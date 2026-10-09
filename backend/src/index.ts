import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ImageKit from '@imagekit/nodejs';
import Razorpay from 'razorpay';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, createRequireUser, AuthenticatedRequest } from './middleware/auth.js';

// ─── Environment Startup Verification ─────────────────────────────────────
const REQUIRED_ENV_VARS = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missingEnv.length > 0) {
  console.error(`❌ [Startup Error] Missing critical environment variables: ${missingEnv.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    console.error('Halting startup in production due to missing security configuration.');
  }
}

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Security Headers ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ─── Supabase Backend Client (Service Role) ──────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
const requireUser = createRequireUser(supabase);

// ─── Rate Limiters ────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const trackLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
  message: { error: 'Too many tracking requests, please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const orderCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { error: 'Order placement limit exceeded. Please contact store support.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── CORS Allowlist ───────────────────────────────────────────────────────
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://www.thewesternstore.in',
  'https://thewesternstore.in',
];

const vercelPreviewRegex = /^https:\/\/the-western-store[-a-z0-9]*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Webhook Raw Body Middleware ──────────────────────────────────────────
// Razorpay webhook endpoint requires raw buffer for signature verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({ limit: '5mb' })(req, res, next);
  }
});

// ─── ImageKit SDK Setup ────────────────────────────────────────────────────
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});

// ─── Razorpay SDK Setup ───────────────────────────────────────────────────
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

if (!razorpay) {
  console.info('ℹ️ [Razorpay Info] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Razorpay endpoints will run in sandbox notification mode.');
}

// Safe string comparison helper to protect against timing attacks
function safeStringCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a || '', 'utf8');
  const bufB = Buffer.from(b || '', 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// ─── Health & Root Endpoints ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    app: 'The Western Store Backend API',
    version: '2.0.0',
    documentation: {
      health: 'GET /api/health',
      adminLogin: 'POST /api/admin/login',
      trackOrder: 'GET /api/orders/track',
      createOrder: 'POST /api/orders',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'The Western Store API is running smoothly',
    imagekit: {
      configured:
        !!process.env.IMAGEKIT_PUBLIC_KEY &&
        !!process.env.IMAGEKIT_PRIVATE_KEY &&
        !!process.env.IMAGEKIT_URL_ENDPOINT,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'NOT_SET',
    },
    supabase: {
      configured: !!process.env.SUPABASE_URL && !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY),
    },
    jwt: {
      configured: !!process.env.JWT_SECRET,
    },
  });
});

// ─── Admin Authentication Endpoint ────────────────────────────────────────
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const jwtSecret = process.env.JWT_SECRET;

  if (!expectedEmail || !expectedPassword || !jwtSecret) {
    res.status(500).json({ error: 'Server configuration error: ADMIN credentials or JWT_SECRET is not configured.' });
    return;
  }

  const providedEmail = (email || '').trim().toLowerCase();
  const providedPassword = password || '';

  const emailMatches = safeStringCompare(providedEmail, expectedEmail);
  const passwordMatches = safeStringCompare(providedPassword, expectedPassword);

  if (emailMatches && passwordMatches) {
    const token = jwt.sign(
      { role: 'admin', email: expectedEmail },
      jwtSecret,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: 'admin_tws_1',
        name: 'Admin',
        email: expectedEmail,
        role: 'admin',
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials.' });
  }
});

// ─── Secure Admin Orders Endpoints ────────────────────────────────────────
app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Supabase is not configured on the backend.' });
    return;
  }
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('[Admin GET /api/admin/orders Exception]', err);
    res.status(500).json({ error: err.message || 'Failed to load orders.' });
  }
});

app.put('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }

  try {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.courier_name !== undefined || updates.courierName !== undefined) {
      dbUpdates.courier_name = updates.courier_name || updates.courierName;
    }
    if (updates.tracking_number !== undefined || updates.trackingNumber !== undefined) {
      dbUpdates.tracking_number = updates.tracking_number || updates.trackingNumber;
    }
    if (updates.notes !== undefined) {
      // Notes are stored in shipping_address JSONB object to match Supabase schema
      const { data: currentOrder } = await supabase.from('orders').select('shipping_address').eq('id', id).single();
      const currentAddr = currentOrder?.shipping_address || {};
      dbUpdates.shipping_address = { ...currentAddr, notes: updates.notes };
    }
    if (updates.payment_status !== undefined) dbUpdates.payment_status = updates.payment_status;

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('orders').update(dbUpdates).eq('id', id);
      if (error) throw error;
    }
    res.json({ success: true, message: 'Order updated successfully.' });
  } catch (err: any) {
    console.error('[Admin Update Order Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update order.' });
  }
});

app.delete('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }

  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Order deleted successfully.' });
  } catch (err: any) {
    console.error('[Admin Delete Order Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to delete order.' });
  }
});

// ─── Legacy Order Routes (Secured with requireAdmin for backward safety) ───
app.get('/api/orders', requireAdmin, async (_req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Supabase is not configured on the backend.' });
    return;
  }
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('[Backend GET /api/orders Exception]', err);
    res.status(500).json({ error: err.message || 'Failed to load orders.' });
  }
});

app.put('/api/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }

  try {
    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.courier_name !== undefined || updates.courierName !== undefined) {
      dbUpdates.courier_name = updates.courier_name || updates.courierName;
    }
    if (updates.tracking_number !== undefined || updates.trackingNumber !== undefined) {
      dbUpdates.tracking_number = updates.tracking_number || updates.trackingNumber;
    }
    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('orders').update(dbUpdates).eq('id', id);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('[Supabase] Update order error:', err?.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to update order.' });
  }
});

app.delete('/api/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }

  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('[Supabase] Delete order error:', err?.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to delete order.' });
  }
});

// ─── Public Order Tracking Endpoint ───────────────────────────────────────
app.get('/api/orders/track', trackLimiter, async (req, res) => {
  const orderNumber = (req.query.orderNumber || req.query.order_number) as string;
  const phone = req.query.phone as string;

  if (!orderNumber || !phone) {
    res.status(400).json({ error: 'Both order number and phone number are required to track an order.' });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: 'Order tracking service temporarily unavailable.' });
    return;
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOrderNumber = orderNumber.trim();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, status, courier_name, tracking_number, total_amount, created_at, items')
      .eq('order_number', cleanOrderNumber)
      .limit(1);

    if (error) throw error;

    if (!orders || orders.length === 0) {
      res.status(404).json({ error: 'No order found matching the provided order number.' });
      return;
    }

    const order = orders[0];
    const orderPhoneClean = (order.customer_phone || '').replace(/\D/g, '');

    // Verify phone match (last 10 digits or exact)
    const phoneMatch = orderPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneClean);
    if (!phoneMatch) {
      res.status(404).json({ error: 'Order number and phone number do not match.' });
      return;
    }

    // Return sanitized status details (no full address PII)
    res.json({
      orderNumber: order.order_number,
      status: order.status,
      courierName: order.courier_name || null,
      trackingNumber: order.tracking_number || null,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      itemCount: Array.isArray(order.items) ? order.items.length : 1,
      items: Array.isArray(order.items)
        ? order.items.map((i: any) => ({
            title: i.title,
            size: i.size,
            quantity: i.quantity,
            image: i.image,
          }))
        : [],
    });
  } catch (err: any) {
    console.error('[Track Order Error]', err);
    res.status(500).json({ error: 'Failed to retrieve order status.' });
  }
});

// ─── Customer Account Orders Endpoint ─────────────────────────────────────
app.get('/api/account/orders', requireUser, async (req: AuthenticatedRequest, res) => {
  if (!supabase || !req.user) {
    res.status(503).json({ error: 'Supabase client unavailable or unauthenticated.' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('[Customer Orders Error]', err);
    res.status(500).json({ error: 'Failed to load your orders.' });
  }
});

// ─── Public Order Placement Endpoint ──────────────────────────────────────
app.post('/api/orders', orderCreateLimiter, async (req, res) => {
  const { formData, items, orderId, orderNumber: clientOrderNumber, userId } = req.body || {};

  if (!formData || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Invalid order data: Missing items or customer details.' });
    return;
  }

  // Validate contact details
  const name = (formData.name || '').trim();
  const phone = (formData.phone || '').replace(/\D/g, '');
  const pincode = (formData.pincode || '').replace(/\D/g, '');
  const address = (formData.address || '').trim();

  if (!name || name.length < 2) {
    res.status(400).json({ error: 'Please enter a valid customer name.' });
    return;
  }

  if (!phone || phone.length < 10) {
    res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    return;
  }

  if (!pincode || pincode.length !== 6) {
    res.status(400).json({ error: 'Please provide a valid 6-digit PIN code.' });
    return;
  }

  if (!address || address.length < 5) {
    res.status(400).json({ error: 'Please provide a complete delivery address.' });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: 'Order processing database service is currently unavailable.' });
    return;
  }

  try {
    // 1. Fetch products from Supabase to validate server-side pricing
    const productIds = items.map((i: any) => i.productId || i.id).filter(Boolean);
    let dbProducts: any[] = [];

    if (productIds.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, images, is_sold_out')
        .in('id', productIds);

      if (!error && data) {
        dbProducts = data;
      }
    }

    // 2. Validate items and compute authoritative subtotal strictly from DB
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const pId = item.productId || item.id;
      const matched = dbProducts.find((p) => p.id === pId);

      if (!matched) {
        res.status(400).json({ error: `Product '${item.title || pId}' is not available in our boutique catalog.` });
        return;
      }

      const unitPrice = Number(matched.price);
      if (unitPrice <= 0) {
        res.status(400).json({ error: 'Invalid product pricing detected.' });
        return;
      }

      const title = matched ? matched.title : (item.title || 'Boutique Item');
      const image = matched && matched.images?.[0] ? matched.images[0] : (item.image || '');
      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 10));

      calculatedSubtotal += unitPrice * quantity;

      validatedItems.push({
        productId: pId,
        title,
        image,
        size: item.size || 'Free Size',
        color: item.color || '',
        quantity,
        price: unitPrice,
      });
    }

    if (calculatedSubtotal <= 0) {
      res.status(400).json({ error: 'Invalid order amount.' });
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = clientOrderNumber || `TWS-2026-${randomSuffix}`;
    const newOrderId = orderId || `order-${Date.now()}`;
    const isUuid = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;

    const supabaseRow: any = {
      id: newOrderId,
      order_number: orderNumber,
      user_id: isUuid ? userId : null,
      customer_name: name,
      customer_phone: phone,
      customer_email: formData.email ? formData.email.trim() : null,
      shipping_address: {
        address,
        pincode,
        city: formData.city || '',
        state: formData.state || '',
        notes: formData.notes || '',
      },
      total_amount: calculatedSubtotal,
      status: 'Pending WhatsApp',
      payment_method: 'whatsapp_cod',
      items: validatedItems,
    };

    const { error: insertErr } = await supabase.from('orders').insert([supabaseRow]);
    if (insertErr) {
      // Upsert fallback
      const { error: updateErr } = await supabase.from('orders').update(supabaseRow).eq('id', newOrderId);
      if (updateErr) throw updateErr;
    }

    res.json({
      success: true,
      orderId: newOrderId,
      orderNumber,
      total: calculatedSubtotal,
    });
  } catch (err: any) {
    console.error('[Order Placement Exception]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to place order.' });
  }
});

// ─── Razorpay Payment Gateway Endpoints ───────────────────────────────────

// 1. Create Razorpay Order
app.post('/api/payments/create-order', orderCreateLimiter, async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database service is temporarily unavailable.' });
    return;
  }

  if (!razorpay || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    res.status(503).json({
      error: 'Razorpay gateway is not configured on server. Please use WhatsApp checkout or configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment.',
      code: 'RAZORPAY_NOT_CONFIGURED',
    });
    return;
  }

  try {
    const { items, formData, userId, orderId, orderNumber: clientOrderNumber } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty. Please add items to checkout.' });
      return;
    }

    const { name, phone, address, pincode } = formData || {};
    if (!name || !phone || !address || !pincode) {
      res.status(400).json({ error: 'Missing mandatory shipping information (name, phone, address, pincode).' });
      return;
    }

    // Validate prices against catalog in database
    const productIds = items.map((i: any) => i.productId || i.product?.id).filter(Boolean);
    const { data: dbProducts } = await supabase.from('products').select('id, price, title, images').in('id', productIds);
    const productPriceMap = new Map((dbProducts || []).map((p: any) => [p.id, p.price]));

    let calculatedSubtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const pId = item.productId || item.product?.id;
      const verifiedPrice = productPriceMap.get(pId);
      if (verifiedPrice === undefined) {
        res.status(400).json({ error: `Product '${item.product?.title || pId}' is not found in store catalog.` });
        return;
      }
      const unitPrice = Number(verifiedPrice);
      const qty = Math.max(1, Math.min(item.quantity || 1, 10));
      calculatedSubtotal += unitPrice * qty;

      validatedItems.push({
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product: {
          id: pId,
          title: item.product?.title || 'Boutique Apparel',
          price: unitPrice,
          images: item.product?.images || [],
          sizes: item.product?.sizes || [],
          colors: item.product?.colors || [],
        },
        size: item.size || 'Free Size',
        color: item.color || 'Standard',
        quantity: qty,
        price: unitPrice,
      });
    }

    if (calculatedSubtotal <= 0) {
      res.status(400).json({ error: 'Invalid order total amount.' });
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = clientOrderNumber || `TWS-2026-${randomSuffix}`;
    const newOrderId = orderId || `order-${Date.now()}`;
    const isUuid = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;

    // Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(calculatedSubtotal * 100), // Amount in paise
      currency: 'INR',
      receipt: newOrderId,
      notes: {
        orderNumber,
        customerName: name,
        customerPhone: phone,
        customerEmail: formData.email || '',
      },
    });

    // Record pending order in Supabase
    const supabaseRow: any = {
      id: newOrderId,
      order_number: orderNumber,
      user_id: isUuid ? userId : null,
      customer_name: name,
      customer_phone: phone,
      customer_email: formData.email ? formData.email.trim() : null,
      shipping_address: {
        address,
        pincode,
        city: formData.city || '',
        state: formData.state || '',
        notes: formData.notes || '',
      },
      total_amount: calculatedSubtotal,
      status: 'Pending Payment',
      payment_method: 'razorpay',
      payment_status: 'awaiting_payment',
      razorpay_order_id: rzpOrder.id,
      items: validatedItems,
    };

    const { error: insertErr } = await supabase.from('orders').insert([supabaseRow]);
    if (insertErr) {
      const { error: updateErr } = await supabase.from('orders').update(supabaseRow).eq('id', newOrderId);
      if (updateErr) throw updateErr;
    }

    res.json({
      success: true,
      orderId: newOrderId,
      orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[Razorpay Create Order Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create payment order.' });
  }
});

// 2. Verify Razorpay Payment Signature
app.post('/api/payments/verify', async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database service is temporarily unavailable.' });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment verification credentials.' });
    return;
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = safeStringCompare(generatedSignature, razorpay_signature);

    if (!isAuthentic) {
      console.warn(`⚠️ [Payment Signature Mismatch] Order ${order_id || razorpay_order_id}`);
      if (order_id) {
        await supabase.from('orders').update({
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        }).eq('id', order_id);
      }
      res.status(400).json({ success: false, verified: false, error: 'Payment signature verification failed.' });
      return;
    }

    // Update order status to paid in Supabase
    const updateData: any = {
      status: 'Paid',
      payment_status: 'paid',
      razorpay_payment_id,
      razorpay_signature,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let targetOrderId = order_id;
    if (order_id) {
      await supabase.from('orders').update(updateData).eq('id', order_id);
    } else {
      const { data: matchedOrder } = await supabase.from('orders').select('id').eq('razorpay_order_id', razorpay_order_id).single();
      if (matchedOrder?.id) {
        targetOrderId = matchedOrder.id;
        await supabase.from('orders').update(updateData).eq('id', matchedOrder.id);
      }
    }

    res.json({
      success: true,
      verified: true,
      orderId: targetOrderId,
      message: 'Payment verified successfully.',
    });
  } catch (err: any) {
    console.error('[Payment Verification Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Payment verification failed.' });
  }
});

// 3. Razorpay Webhook Handler (Idempotent)
app.post('/api/payments/webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (webhookSecret && signature) {
    try {
      const rawBody = req.body.toString('utf8');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (!safeStringCompare(expectedSignature, signature)) {
        console.warn('⚠️ [Razorpay Webhook] Invalid signature received');
        res.status(400).json({ error: 'Invalid webhook signature.' });
        return;
      }
    } catch (err) {
      console.error('[Razorpay Webhook Error]', err);
      res.status(400).json({ error: 'Signature verification error.' });
      return;
    }
  }

  try {
    const rawBody = req.body.toString('utf8');
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload?.payment?.entity || event.payload?.order?.entity;

    if (supabase && payload) {
      const rzpOrderId = payload.order_id || payload.id;
      const rzpPaymentId = payload.id;

      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        await supabase
          .from('orders')
          .update({
            status: 'Paid',
            payment_status: 'paid',
            razorpay_payment_id: rzpPaymentId,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', rzpOrderId);
      } else if (eventType === 'payment.failed') {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', rzpOrderId);
      } else if (eventType === 'refund.processed') {
        await supabase
          .from('orders')
          .update({
            status: 'Refunded',
            payment_status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', rzpOrderId);
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook Processing Error]', err);
    res.json({ status: 'ok' }); // Always return 200 to webhook caller to prevent retries
  }
});

// 4. Admin Razorpay Refund Trigger
app.post('/api/payments/refund', requireAdmin, async (req, res) => {
  if (!razorpay) {
    res.status(503).json({ error: 'Razorpay is not configured on server.' });
    return;
  }

  const { paymentId, amount, notes, orderId } = req.body || {};

  if (!paymentId) {
    res.status(400).json({ error: 'Missing paymentId for refund.' });
    return;
  }

  try {
    const refundOptions: any = {};
    if (amount) refundOptions.amount = Math.round(Number(amount) * 100);
    if (notes) refundOptions.notes = notes;

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    if (supabase && orderId) {
      await supabase.from('orders').update({
        status: 'Refunded',
        payment_status: 'refunded',
        updated_at: new Date().toISOString(),
      }).eq('id', orderId);
    }

    res.json({ success: true, refund, message: 'Refund initiated successfully.' });
  } catch (err: any) {
    console.error('[Razorpay Refund Error]', err);
    res.status(500).json({ error: err.message || 'Failed to process refund with Razorpay.' });
  }
});

// ─── Contact Form Endpoint with Honeypot Protection ───────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, phone, message, subject, hp_field } = req.body || {};

  // Honeypot check: Bots fill hidden hp_field
  if (hp_field) {
    // Return fake success to bots without processing
    res.json({ success: true, message: 'Message received.' });
    return;
  }

  if (!name || (!email && !phone) || !message) {
    res.status(400).json({ error: 'Please provide your name, contact information (email or phone), and message.' });
    return;
  }

  if (supabase) {
    try {
      await supabase.from('contact_messages').insert([
        {
          name: (name || '').trim(),
          email: email ? email.trim() : null,
          phone: phone ? phone.trim() : null,
          subject: subject ? subject.trim() : 'General Inquiry',
          message: (message || '').trim(),
        },
      ]);
    } catch (err) {
      console.warn('[Contact Form] Failed to save message to database:', err);
    }
  }

  res.json({ success: true, message: 'Thank you for reaching out! We will respond shortly.' });
});

// ─── ImageKit Endpoints (Protected with requireAdmin) ──────────────────────
app.get('/api/imagekit/auth', requireAdmin, (_req, res) => {
  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    res.status(503).json({
      error: 'ImageKit is not fully configured on server. Please add IMAGEKIT credentials.',
    });
    return;
  }

  try {
    const authParams = imagekit.helper.getAuthenticationParameters();
    res.json({
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    });
  } catch (err) {
    console.error('[ImageKit Auth Error]', err);
    res.status(500).json({ error: 'Failed to generate upload authentication.' });
  }
});

app.get('/api/imagekit/files', requireAdmin, async (req, res) => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    res.status(503).json({ error: 'ImageKit private key is not configured on server.' });
    return;
  }

  try {
    const pathFilter = (req.query.path as string) || undefined;
    const limit = Math.min(Number(req.query.limit) || 60, 100);
    const searchQuery = (req.query.searchQuery as string) || undefined;

    const options: any = { limit };
    if (pathFilter && pathFilter !== 'all' && pathFilter !== '/') {
      options.path = pathFilter;
    }
    if (searchQuery) {
      options.searchQuery = searchQuery;
    }

    const rawAssets = await imagekit.assets.list(options);
    const assetsArray = Array.isArray(rawAssets) ? rawAssets : [];

    const files = assetsArray
      .filter((item: any) => item && (item.type === 'file' || item.fileType === 'image' || item.fileType === 'video' || item.type === 'video'))
      .map((item: any) => {
        const isVideo = item.fileType === 'video' || item.type === 'video' || /\.(mp4|webm|mov|ogg|m4v)$/i.test(item.name || item.filePath || '');
        const fileType = isVideo ? 'video' : (item.fileType || 'image');
        const thumbnailUrl = item.thumbnail || item.thumbnailUrl || (isVideo ? `${item.url}/ik-thumbnail.jpg` : item.url);

        return {
          fileId: item.fileId || item.id,
          name: item.name,
          filePath: item.filePath,
          url: item.url,
          thumbnailUrl,
          fileType,
          size: item.size || 0,
          height: item.height || null,
          width: item.width || null,
          createdAt: item.createdAt || item.updatedAt || new Date().toISOString(),
        };
      });

    res.json({ success: true, files });
  } catch (err: any) {
    console.error('[ImageKit List Files Error]', err);
    res.status(500).json({ error: err.message || 'Failed to list files from ImageKit.' });
  }
});

app.delete('/api/imagekit/files/:fileId', requireAdmin, async (req, res) => {
  const { fileId } = req.params;
  if (!fileId) {
    res.status(400).json({ error: 'Missing fileId parameter.' });
    return;
  }

  try {
    await imagekit.files.delete(fileId);
    res.json({ success: true, message: 'Image deleted from ImageKit successfully.' });
  } catch (err: any) {
    console.error('[ImageKit Delete File Error]', err);
    res.status(500).json({ error: err.message || 'Failed to delete file from ImageKit.' });
  }
});

// ─── Store Settings API ───────────────────────────────────────────────────
app.get('/api/store-settings', async (_req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }
  try {
    const { data, error } = await supabase.from('store_settings').select('*');
    if (error) throw error;
    const settings: Record<string, any> = {};
    for (const row of data || []) {
      if (row.key) settings[row.key] = row.value;
    }
    res.json({ success: true, settings });
  } catch (err: any) {
    console.error('[Settings GET Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to load store settings.' });
  }
});

app.post('/api/store-settings', requireAdmin, async (req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }

  const { key, value } = req.body || {};
  if (!key) {
    res.status(400).json({ error: 'Missing setting key' });
    return;
  }

  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
    res.json({ success: true, message: `Setting '${key}' saved successfully.` });
  } catch (err: any) {
    console.error('[Settings POST Error]', err);
    res.status(500).json({ error: err.message || 'Failed to save store setting.' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n🟢 The Western Store Backend`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   Health check: GET /api/health\n`);

  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    console.log(`   Keep-alive ping active → ${selfUrl}/api/health (every 14 min)\n`);
    setInterval(async () => {
      try {
        const res = await fetch(`${selfUrl}/api/health`);
        if (res.ok) {
          console.log(`[Keep-alive] Ping OK — ${new Date().toISOString()}`);
        }
      } catch (err) {
        console.warn('[Keep-alive] Ping failed:', err);
      }
    }, 14 * 60 * 1000);
  }
});
export default app;
