import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, createRequireUser, AuthenticatedRequest } from './middleware/auth.js';
import { generateOrderId, resolveOrderNumber } from './orderId.js';

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

/** Decrement product stock for paid order line items (idempotent-safe when called once per payment). */
async function decrementInventoryForItems(items: any[]): Promise<void> {
  if (!supabase || !Array.isArray(items)) return;
  for (const itm of items) {
    const prodId = itm.productId || itm.product?.id;
    const qty = Number(itm.quantity) || 1;
    if (!prodId) continue;
    const { data: prodData } = await supabase.from('products').select('in_stock_count').eq('id', prodId).single();
    if (prodData && prodData.in_stock_count !== null && prodData.in_stock_count !== undefined) {
      const currentStock = Number(prodData.in_stock_count);
      const newStock = Math.max(0, currentStock - qty);
      await supabase.from('products').update({
        in_stock_count: newStock,
        is_sold_out: newStock <= 0,
        updated_at: new Date().toISOString(),
      }).eq('id', prodId);
    }
  }
}

// ─── Rate Limiters ────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
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

// Render / Cloudflare terminate TLS and forward client IP via X-Forwarded-For.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }
      // Also allow any *.vercel.app preview for this storefront project family
      if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }
      // Do not throw — throwing turns OPTIONS preflight into HTTP 500.
      return callback(null, false);
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────
// Cashfree webhook needs the raw buffer for HMAC-SHA256 signature verification.
// ImageKit admin uploads send base64 payloads that can exceed the default 5mb JSON limit.
app.use((req, res, next) => {
  const cleanPath = req.path || req.originalUrl.split('?')[0];
  if (cleanPath === '/api/payments/webhook') {
    express.raw({ type: '*/*' })(req, res, next);
  } else if (cleanPath === '/api/imagekit/upload') {
    express.json({ limit: '25mb' })(req, res, next);
  } else {
    express.json({ limit: '5mb' })(req, res, next);
  }
});

// ─── ImageKit SDK Setup ────────────────────────────────────────────────────
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});

// ─── Cashfree PG SDK Setup ────────────────────────────────────────────────
const cashfreeAppId = process.env.CASHFREE_APP_ID || '';
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY || '';
const cashfreeEnv =
  (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase() === 'PRODUCTION'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const isCashfreeConfigured = !!(cashfreeAppId && cashfreeSecretKey);
const cashfree = isCashfreeConfigured
  ? new Cashfree(cashfreeEnv, cashfreeAppId, cashfreeSecretKey)
  : null;

if (!cashfree) {
  console.info('ℹ️ [Cashfree Info] CASHFREE_APP_ID or CASHFREE_SECRET_KEY is not set. Cashfree endpoints will run in sandbox notification mode.');
} else {
  console.info(
    `✅ [Cashfree] Configured (${cashfreeEnv === CFEnvironment.PRODUCTION ? 'PRODUCTION' : 'SANDBOX'} mode) appId=${cashfreeAppId.slice(0, 8)}…`
  );
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
    cashfree: {
      configured: isCashfreeConfigured,
      mode: !cashfree ? 'off' : cashfreeEnv === CFEnvironment.PRODUCTION ? 'production' : 'sandbox',
      appIdPrefix: cashfreeAppId ? cashfreeAppId.slice(0, 8) : null,
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
    const cleanId = (id || '').replace(/^#/, '').trim();
    const isIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    const withHyphens = cleanId.replace(/_/g, '-');
    const withUnderscores = cleanId.replace(/-/g, '_');
    const orFilters = [
      `order_number.eq.${cleanId}`,
      `order_number.eq.${withHyphens}`,
      `order_number.eq.${withUnderscores}`,
      `order_number.ilike.${cleanId}`,
    ];
    if (isIdUuid) orFilters.push(`id.eq.${cleanId}`);

    const { data: currentOrder } = await supabase
      .from('orders')
      .select('id, shipping_address, status_history')
      .or(orFilters.join(','))
      .maybeSingle();

    const targetId = currentOrder?.id || (isIdUuid ? id : null);
    if (!targetId) {
      res.status(404).json({ success: false, error: 'Order not found for update.' });
      return;
    }

    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.courier_name !== undefined || updates.courierName !== undefined) {
      dbUpdates.courier_name = updates.courier_name || updates.courierName;
    }
    if (updates.tracking_number !== undefined || updates.trackingNumber !== undefined) {
      dbUpdates.tracking_number = updates.tracking_number || updates.trackingNumber;
    }
    if (updates.tracking_link !== undefined || updates.trackingLink !== undefined) {
      dbUpdates.tracking_link = updates.tracking_link || updates.trackingLink;
    }
    if (updates.notes !== undefined) {
      const currentAddr = currentOrder?.shipping_address || {};
      dbUpdates.shipping_address = { ...currentAddr, notes: updates.notes };
    }
    if (updates.payment_status !== undefined) dbUpdates.payment_status = updates.payment_status;

    if (updates.status !== undefined) {
      const hist = Array.isArray(currentOrder?.status_history) ? currentOrder.status_history : [];
      hist.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: updates.notes || `Order status updated to ${updates.status}`,
      });
      dbUpdates.status_history = hist;
    }

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('orders').update(dbUpdates).eq('id', targetId);
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

// ─── Secure Admin Catalog (Products & Categories) Endpoints ───────────────
app.get('/api/admin/products', requireAdmin, async (_req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, products: data || [] });
  } catch (err: any) {
    console.error('[Admin Get Products Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch products.' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const p = req.body || {};
    const row = {
      id: p.id || `prod-${Date.now()}`,
      title: p.title || 'Untitled Product',
      slug: p.slug || (p.title || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: p.category || 'Ethnic Wear',
      price: Number(p.price) || 0,
      original_price: Number(p.originalPrice) || Number(p.price) || 0,
      sale_discount: p.saleDiscount || null,
      on_sale: !!p.onSale,
      is_bestseller: !!p.isBestSeller,
      is_new: !!p.isNew,
      is_sold_out: !!p.isSoldOut,
      in_stock_count: p.inStockCount !== undefined ? Number(p.inStockCount) : 15,
      budget_tier: p.budgetTier || 'under_1499',
      description: p.description || '',
      fabric_care: {
        ...(p.fabricCare || {}),
        custom_return_policy: p.customReturnPolicy || null,
        custom_wash_care_notes: p.customWashCareNotes || null,
        custom_delivery_timeline: p.customDeliveryTimeline || null,
        custom_reviews: p.customReviews || null,
      },
      sizes: Array.isArray(p.sizes) ? p.sizes : ['Free Size'],
      colors: Array.isArray(p.colors) ? p.colors : [{ name: 'Deep Maroon' }],
      images: Array.isArray(p.images) ? p.images : [],
      rating: Number(p.rating || 5.0),
      review_count: Number(p.reviewCount || 0),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('products').upsert(row).select().single();
    if (error) throw error;
    res.json({ success: true, product: data, message: 'Product saved successfully.' });
  } catch (err: any) {
    console.error('[Admin Add Product Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to save product.' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const p = req.body || {};
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (p.title !== undefined) updates.title = p.title;
    if (p.slug !== undefined) updates.slug = p.slug;
    if (p.category !== undefined) updates.category = p.category;
    if (p.price !== undefined) updates.price = Number(p.price);
    if (p.originalPrice !== undefined) updates.original_price = Number(p.originalPrice);
    if (p.saleDiscount !== undefined) updates.sale_discount = p.saleDiscount;
    if (p.onSale !== undefined) updates.on_sale = !!p.onSale;
    if (p.isBestSeller !== undefined) updates.is_bestseller = !!p.isBestSeller;
    if (p.isNew !== undefined) updates.is_new = !!p.isNew;
    if (p.isSoldOut !== undefined) updates.is_sold_out = !!p.isSoldOut;
    if (p.inStockCount !== undefined) updates.in_stock_count = Number(p.inStockCount);
    if (p.budgetTier !== undefined) updates.budget_tier = p.budgetTier;
    if (p.description !== undefined) updates.description = p.description;
    if (p.fabricCare !== undefined || p.customReturnPolicy !== undefined || p.customWashCareNotes !== undefined || p.customDeliveryTimeline !== undefined || p.customReviews !== undefined) {
      const { data: cur } = await supabase.from('products').select('fabric_care').eq('id', id).single();
      const existingFc = (typeof cur?.fabric_care === 'object' && cur?.fabric_care) ? cur.fabric_care : {};
      updates.fabric_care = {
        ...existingFc,
        ...(p.fabricCare || {}),
        ...(p.customReturnPolicy !== undefined ? { custom_return_policy: p.customReturnPolicy } : {}),
        ...(p.customWashCareNotes !== undefined ? { custom_wash_care_notes: p.customWashCareNotes } : {}),
        ...(p.customDeliveryTimeline !== undefined ? { custom_delivery_timeline: p.customDeliveryTimeline } : {}),
        ...(p.customReviews !== undefined ? { custom_reviews: p.customReviews } : {}),
      };
    }
    if (p.sizes !== undefined) updates.sizes = p.sizes;
    if (p.colors !== undefined) updates.colors = p.colors;
    if (p.images !== undefined) updates.images = p.images;
    if (p.rating !== undefined) updates.rating = Number(p.rating);
    if (p.reviewCount !== undefined) updates.review_count = Number(p.reviewCount);

    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (err: any) {
    console.error('[Admin Update Product Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update product.' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err: any) {
    console.error('[Admin Delete Product Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to delete product.' });
  }
});

app.get('/api/admin/categories', requireAdmin, async (_req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, categories: data || [] });
  } catch (err: any) {
    console.error('[Admin Get Categories Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch categories.' });
  }
});

app.post('/api/admin/categories', requireAdmin, async (req, res) => {
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const c = req.body || {};
    const row = {
      id: c.id || `cat-${Date.now()}`,
      name: c.name,
      slug: c.slug || (c.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      subtitle: c.subtitle || null,
      image: c.image || '',
    };
    const { data, error } = await supabase.from('categories').upsert(row).select().single();
    if (error) throw error;
    res.json({ success: true, category: data, message: 'Category saved successfully.' });
  } catch (err: any) {
    console.error('[Admin Add Category Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to save category.' });
  }
});

app.put('/api/admin/categories/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const c = req.body || {};
    const updates: Record<string, any> = {};
    if (c.name !== undefined) updates.name = c.name;
    if (c.slug !== undefined) updates.slug = c.slug;
    if (c.subtitle !== undefined) updates.subtitle = c.subtitle;
    if (c.image !== undefined) updates.image = c.image;

    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (err: any) {
    console.error('[Admin Update Category Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update category.' });
  }
});

app.delete('/api/admin/categories/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Database service is unavailable.' });
    return;
  }
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err: any) {
    console.error('[Admin Delete Category Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to delete category.' });
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
    const cleanId = (id || '').replace(/^#/, '').trim();
    const isIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    const withHyphens = cleanId.replace(/_/g, '-');
    const withUnderscores = cleanId.replace(/-/g, '_');
    const orFilters = [
      `order_number.eq.${cleanId}`,
      `order_number.eq.${withHyphens}`,
      `order_number.eq.${withUnderscores}`,
      `order_number.ilike.${cleanId}`,
    ];
    if (isIdUuid) orFilters.push(`id.eq.${cleanId}`);

    const { data: currentOrder } = await supabase
      .from('orders')
      .select('id')
      .or(orFilters.join(','))
      .maybeSingle();

    const targetId = currentOrder?.id || (isIdUuid ? id : null);
    if (!targetId) {
      res.status(404).json({ success: false, error: 'Order not found for update.' });
      return;
    }

    const dbUpdates: Record<string, any> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.courier_name !== undefined || updates.courierName !== undefined) {
      dbUpdates.courier_name = updates.courier_name || updates.courierName;
    }
    if (updates.tracking_number !== undefined || updates.trackingNumber !== undefined) {
      dbUpdates.tracking_number = updates.tracking_number || updates.trackingNumber;
    }
    if (updates.tracking_link !== undefined || updates.trackingLink !== undefined) {
      dbUpdates.tracking_link = updates.tracking_link || updates.trackingLink;
    }
    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('orders').update(dbUpdates).eq('id', targetId);
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

// ─── Customer Account Orders Endpoint ─────────────────────────────────────
app.get('/api/account/orders', requireUser, async (req: AuthenticatedRequest, res) => {
  if (!supabase || !req.user) {
    res.status(503).json({ error: 'Supabase client unavailable or unauthenticated.' });
    return;
  }

  try {
    const filters = [`user_id.eq.${req.user.id}`];
    if (req.user.email) {
      filters.push(`customer_email.ilike.${req.user.email.trim()}`);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(filters.join(','))
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

    const orderNumber = resolveOrderNumber(clientOrderNumber);
    const newOrderId = orderId || generateOrderId();
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

// ─── Cashfree Payment Gateway Endpoints ───────────────────────────────────

// 1. Create Cashfree Order
app.post('/api/payments/create-order', orderCreateLimiter, async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database service is temporarily unavailable.' });
    return;
  }

  if (!cashfree || !cashfreeAppId || !cashfreeSecretKey) {
    res.status(503).json({
      error: 'Cashfree gateway is not configured on server. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in backend environment.',
      code: 'CASHFREE_NOT_CONFIGURED',
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

    // Validate prices + stock against catalog in database
    const productIds = items.map((i: any) => i.productId || i.product?.id || i.id).filter(Boolean);
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, price, title, images, sizes, colors, in_stock_count, is_sold_out')
      .in('id', productIds);
    const productMap = new Map((dbProducts || []).map((p: any) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const pId = item.productId || item.product?.id || item.id;
      const matched = productMap.get(pId);

      // In Sandbox mode, allow cart snapshots when the catalog row is missing so gateway testing can proceed
      const clientPrice = Number(item.price ?? item.product?.price);
      if (!matched) {
        if (cashfreeEnv !== CFEnvironment.SANDBOX || !Number.isFinite(clientPrice) || clientPrice <= 0) {
          res.status(400).json({
            error: `Product '${item.product?.title || item.title || pId}' is not found in store catalog.`,
          });
          return;
        }
      }

      const qty = Math.max(1, Math.min(item.quantity || 1, 10));
      const stockCount =
        matched && matched.in_stock_count !== null && matched.in_stock_count !== undefined
          ? Number(matched.in_stock_count)
          : null;

      if (matched) {
        if (matched.is_sold_out === true || (stockCount !== null && stockCount <= 0)) {
          res.status(409).json({
            error: `"${matched.title}" is currently sold out. Please remove it from your bag to continue.`,
            code: 'OUT_OF_STOCK',
            productId: pId,
          });
          return;
        }
        if (stockCount !== null && qty > stockCount) {
          res.status(409).json({
            error: `"${matched.title}" only has ${stockCount} left in stock. Please reduce quantity.`,
            code: 'INSUFFICIENT_STOCK',
            productId: pId,
            available: stockCount,
          });
          return;
        }
      }

      const unitPrice = matched ? Number(matched.price) : clientPrice;
      calculatedSubtotal += unitPrice * qty;

      const title = matched?.title || item.product?.title || item.title || 'Item';
      const image =
        matched?.images?.[0] || item.image || item.product?.images?.[0] || '';

      validatedItems.push({
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: pId,
        title,
        image,
        product: {
          id: pId,
          title,
          price: unitPrice,
          images: matched?.images || item.product?.images || (image ? [image] : []),
          sizes: matched?.sizes || item.product?.sizes || [],
          colors: matched?.colors || item.product?.colors || [],
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

    const orderNumber = resolveOrderNumber(clientOrderNumber);
    const newOrderId = orderId || generateOrderId();
    const isUuid = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;

    // Cashfree order_id accepts alphanumeric, '-', '_' (max 45 chars)
    const cfOrderId = orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10) || '9999999999';
    const customerId = (userId || `cust_${cleanPhone}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);

    const backendPublicUrl = process.env.RENDER_EXTERNAL_URL || 'https://the-western-store.onrender.com';

    let returnBaseUrl = FRONTEND_URL;
    const requestOrigin = (req.headers.origin || req.headers.referer || '').trim();
    if (requestOrigin) {
      try {
        const parsed = new URL(requestOrigin);
        const originBase = `${parsed.protocol}//${parsed.host}`;
        if (allowedOrigins.includes(originBase) || vercelPreviewRegex.test(originBase)) {
          returnBaseUrl = originBase;
        }
      } catch {}
    }
    if (cashfreeEnv === CFEnvironment.PRODUCTION && returnBaseUrl.includes('localhost')) {
      returnBaseUrl = 'https://thewesternstore.in';
    }

    // Create Cashfree Order (Rupees, decimal — NO paise multiplication)
    const cfResponse = await cashfree.PGCreateOrder({
      order_id: cfOrderId,
      order_amount: Number(calculatedSubtotal.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_phone: cleanPhone,
        customer_name: (name || 'Customer').trim().slice(0, 100),
        customer_email: (formData.email || 'customer@thewesternstore.in').trim(),
      },
      order_meta: {
        return_url: `${returnBaseUrl}/order-confirmation/${orderNumber}?order_id={order_id}`,
        notify_url: `${backendPublicUrl}/api/payments/webhook`,
      },
      order_note: `The Western Store Order ${orderNumber}`,
    });

    const paymentSessionId = cfResponse.data.payment_session_id;

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
      payment_method: 'cashfree',
      payment_status: 'awaiting_payment',
      items: validatedItems,
      status_history: [
        {
          status: 'Pending Payment',
          timestamp: new Date().toISOString(),
          note: `Online checkout initiated via Cashfree (Order ID: ${cfOrderId})`,
        },
      ],
    };

    let { error: insertErr } = await supabase.from('orders').insert([supabaseRow]);
    // If insert fails for any reason (e.g. foreign key constraint on user_id not in auth.users), retry as guest order
    if (insertErr) {
      console.warn(`[Order Create] Initial insert failed (${insertErr.message || insertErr.code}). Retrying with user_id = null...`);
      supabaseRow.user_id = null;
      const retryResult = await supabase.from('orders').insert([supabaseRow]);
      insertErr = retryResult.error;
    }
    if (insertErr) {
      console.error('[Order Insert Failed]', insertErr);
      throw insertErr;
    }

    res.json({
      success: true,
      orderId: newOrderId,
      orderNumber,
      cfOrderId,
      paymentSessionId,
      amount: calculatedSubtotal,
      currency: 'INR',
    });
  } catch (err: any) {
    const errorDetails = err?.response?.data || err?.message || err;
    console.error('[Cashfree Create Order Error]', errorDetails);
    res.status(500).json({ success: false, error: err?.response?.data?.message || err.message || 'Failed to create payment order.' });
  }
});

// 2. Verify Cashfree Payment
app.post('/api/payments/verify', async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database service is temporarily unavailable.' });
    return;
  }

  if (!cashfree) {
    res.status(503).json({ error: 'Cashfree gateway is not configured on server.' });
    return;
  }

  const { order_id, orderId } = req.body || {};
  const queryOrderId = order_id || orderId;

  if (!queryOrderId) {
    res.status(400).json({ error: 'Missing order_id for payment verification.' });
    return;
  }

  try {
    // 1. Fetch authoritative order state from Cashfree
    const cfOrderResponse = await cashfree.PGFetchOrder(queryOrderId);
    const cfOrder = cfOrderResponse.data;

    if (!cfOrder) {
      res.status(404).json({ success: false, verified: false, error: 'Order not found in Cashfree.' });
      return;
    }

    const isPaid = cfOrder.order_status === 'PAID';

    // Assert payment currency is INR
    if (cfOrder.order_currency && cfOrder.order_currency.toUpperCase() !== 'INR') {
      console.error(`🚨 [Currency Mismatch] Order ${queryOrderId}: expected INR, got ${cfOrder.order_currency}`);
      res.status(400).json({ error: 'Payment currency mismatch.', verified: false });
      return;
    }

    // 2. Match local order in Supabase (flexible matching by id, order_number, or clean cfOrderId)
    const normalizedNumber = queryOrderId.replace(/_/g, '-');
    const isQueryUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(queryOrderId);
    const isParamUuid = orderId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId) : false;

    const orFilters = [
      `order_number.eq.${queryOrderId}`,
      `order_number.eq.${normalizedNumber}`,
    ];
    if (isQueryUuid) orFilters.push(`id.eq.${queryOrderId}`);
    if (isParamUuid) orFilters.push(`id.eq.${orderId}`);

    const { data: matchedOrder } = await supabase
      .from('orders')
      .select('*')
      .or(orFilters.join(','))
      .maybeSingle();

    const targetOrderId = matchedOrder?.id || (isQueryUuid ? queryOrderId : isParamUuid ? orderId : null);

    if (!isPaid) {
      console.warn(`⚠️ [Cashfree Payment Incomplete] Order ${queryOrderId} status is ${cfOrder.order_status}`);
      if (matchedOrder && cfOrder.order_status !== 'ACTIVE' && targetOrderId) {
        await supabase.from('orders').update({
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        }).eq('id', targetOrderId);
      }
      res.json({
        success: false,
        verified: false,
        status: cfOrder.order_status,
        order: matchedOrder,
        message: `Payment status is ${cfOrder.order_status}`,
      });
      return;
    }

    // 3. Payment confirmed as PAID
    if (matchedOrder) {
      const expectedAmount = Number(matchedOrder.total_amount);
      const paidAmount = Number(cfOrder.order_amount);
      if (Number.isFinite(expectedAmount) && expectedAmount > 0 && Math.abs(paidAmount - expectedAmount) > 0.01) {
        console.error(`🚨 [Amount Mismatch] Order ${queryOrderId}: expected ₹${expectedAmount}, got ₹${paidAmount}`);
        res.status(400).json({ error: 'Payment amount mismatch detected.', verified: false });
        return;
      }
    }

    const currentHistory = Array.isArray(matchedOrder?.status_history) ? matchedOrder.status_history : [];
    const alreadyPaid = matchedOrder?.payment_status === 'paid';

    if (matchedOrder && targetOrderId) {
      if (!alreadyPaid) {
        currentHistory.push({
          status: 'Paid',
          timestamp: new Date().toISOString(),
          note: `Payment verified via Cashfree (CF Order ID: ${cfOrder.cf_order_id})`,
        });

        const updateData: any = {
          status: 'Paid',
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status_history: currentHistory,
        };

        await supabase.from('orders').update(updateData).eq('id', targetOrderId);

        if (Array.isArray(matchedOrder.items)) {
          await decrementInventoryForItems(matchedOrder.items);
        }
      }
    } else {
      // Order row was somehow missing in DB; reconstruct from Cashfree so payment is never lost
      const restoredId = isParamUuid ? orderId : isQueryUuid ? queryOrderId : crypto.randomUUID();
      const restoredNumber = normalizedNumber.startsWith('TWS-') ? normalizedNumber : `TWS-${normalizedNumber}`;
      const newOrderRow = {
        id: restoredId,
        order_number: restoredNumber,
        user_id: null,
        customer_name: cfOrder.customer_details?.customer_name || 'Customer',
        customer_phone: cfOrder.customer_details?.customer_phone || '',
        customer_email: cfOrder.customer_details?.customer_email || null,
        shipping_address: {
          address: 'Recorded during checkout',
          city: '',
          state: '',
          pincode: '',
          notes: '',
        },
        total_amount: Number(cfOrder.order_amount) || 0,
        status: 'Paid',
        payment_method: 'cashfree',
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        items: [],
        status_history: [
          {
            status: 'Paid',
            timestamp: new Date().toISOString(),
            note: `Payment verified via Cashfree (CF Order ID: ${cfOrder.cf_order_id})`,
          },
        ],
      };
      await supabase.from('orders').insert([newOrderRow]);
    }

    // Retrieve fresh updated order row to return to client
    const { data: finalOrder } = await supabase
      .from('orders')
      .select('*')
      .or(orFilters.join(','))
      .maybeSingle();

    res.json({
      success: true,
      verified: true,
      orderId: finalOrder?.id || targetOrderId || queryOrderId,
      orderNumber: finalOrder?.order_number || matchedOrder?.order_number || normalizedNumber,
      status: 'PAID',
      order: finalOrder || matchedOrder,
      message: 'Payment verified successfully.',
    });
  } catch (err: any) {
    const errorDetails = err?.response?.data || err?.message || err;
    console.error('[Cashfree Payment Verification Error]', errorDetails);
    res.status(500).json({ success: false, error: err?.response?.data?.message || err.message || 'Payment verification failed.' });
  }
});

// 2b. Public Lookup Order Endpoint (for Order Confirmation & Tracking)
app.get('/api/orders/lookup/:identifier', async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database service is temporarily unavailable.' });
    return;
  }
  const { identifier } = req.params;
  const cleanIdentifier = (identifier || '').replace(/^#/, '').trim();
  const withHyphens = cleanIdentifier.replace(/_/g, '-');
  const withUnderscores = cleanIdentifier.replace(/-/g, '_');
  try {
    const isIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanIdentifier);
    const orFilters = [
      `order_number.eq.${cleanIdentifier}`,
      `order_number.eq.${withHyphens}`,
      `order_number.eq.${withUnderscores}`,
      `order_number.ilike.${cleanIdentifier}`,
    ];
    if (isIdUuid) orFilters.push(`id.eq.${cleanIdentifier}`);

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .or(orFilters.join(','))
      .maybeSingle();

    if (error || !order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error looking up order' });
  }
});

// 3. Cashfree Webhook Handler (Idempotent with Replay Defense)
app.post('/api/payments/webhook', async (req, res) => {
  const signature = req.headers['x-webhook-signature'] as string;
  const timestamp = req.headers['x-webhook-timestamp'] as string;
  const rawBody = req.body ? req.body.toString('utf8') : '';

  if (!signature || !timestamp) {
    console.warn('⚠️ [Cashfree Webhook] Rejected: Missing signature or timestamp headers.');
    res.status(401).json({ error: 'Missing webhook signature or timestamp.' });
    return;
  }

  // Webhook Replay Protection: reject payloads older than 300 seconds (5 minutes)
  const rawTs = Number(timestamp);
  if (isNaN(rawTs) || rawTs <= 0) {
    res.status(400).json({ error: 'Invalid webhook timestamp.' });
    return;
  }
  const tsInSeconds = rawTs > 1e11 ? Math.floor(rawTs / 1000) : rawTs;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const ageInSeconds = Math.abs(nowInSeconds - tsInSeconds);
  if (ageInSeconds > 300) {
    console.warn(`⚠️ [Cashfree Webhook] Webhook timestamp expired (${ageInSeconds}s difference). Rejecting potential replay.`);
    res.status(400).json({ error: 'Webhook timestamp expired.' });
    return;
  }

  if (cashfree) {
    try {
      cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (err) {
      console.warn('⚠️ [Cashfree Webhook] Invalid signature received:', err);
      res.status(400).json({ error: 'Invalid webhook signature.' });
      return;
    }
  } else {
    res.status(503).json({ error: 'Cashfree gateway is not configured on server.' });
    return;
  }

  try {
    const event = JSON.parse(rawBody);
    const eventType = event.type;
    const eventData = event.data;

    if (supabase && eventData) {
      const cfOrderId = eventData.order?.order_id || eventData.order_id || '';
      const payment = eventData.payment;
      const paymentStatus = payment?.payment_status;

      const isCfUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cfOrderId);
      const normalizedCfNumber = cfOrderId.replace(/_/g, '-');
      const cfFilters = [`order_number.eq.${cfOrderId}`, `order_number.eq.${normalizedCfNumber}`];
      if (isCfUuid) cfFilters.push(`id.eq.${cfOrderId}`);
      const cfFilterStr = cfFilters.join(',');

      if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentStatus === 'SUCCESS') {
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id, payment_status, items, status_history, total_amount')
          .or(cfFilterStr)
          .maybeSingle();

        if (existingOrder) {
          const paidAmount = Number(eventData.order?.order_amount || payment?.payment_amount);
          const expectedAmount = Number(existingOrder.total_amount);
          if (Number.isFinite(expectedAmount) && expectedAmount > 0 && Number.isFinite(paidAmount) && paidAmount > 0) {
            if (Math.abs(paidAmount - expectedAmount) > 0.01) {
              console.error(`🚨 [Webhook Amount Mismatch] Order ${cfOrderId}: expected ₹${expectedAmount}, got ₹${paidAmount}`);
              res.status(200).send('AMOUNT_MISMATCH');
              return;
            }
          }

          const currentHistory = Array.isArray(existingOrder.status_history) ? existingOrder.status_history : [];
          currentHistory.push({
            status: 'Paid',
            timestamp: new Date().toISOString(),
            note: `Payment confirmed via Cashfree webhook (CF Payment ID: ${payment?.cf_payment_id || 'N/A'})`,
          });

          await supabase
            .from('orders')
            .update({
              status: 'Paid',
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status_history: currentHistory,
            })
            .eq('id', existingOrder.id);

          if (existingOrder.payment_status !== 'paid' && Array.isArray(existingOrder.items)) {
            await decrementInventoryForItems(existingOrder.items);
          }
        }
      } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || paymentStatus === 'FAILED') {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .or(cfFilterStr);
      } else if (eventType === 'REFUND_STATUS_WEBHOOK') {
        await supabase
          .from('orders')
          .update({
            status: 'Refunded',
            payment_status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .or(cfFilterStr);
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('[Cashfree Webhook Processing Error]', err);
    res.status(200).send('OK'); // Always return 200 to prevent retry storms
  }
});

// 4. Admin Cashfree Refund Trigger
app.post('/api/payments/refund', requireAdmin, async (req, res) => {
  if (!cashfree) {
    res.status(503).json({ error: 'Cashfree is not configured on server.' });
    return;
  }

  const { orderId, orderNumber, amount, note } = req.body || {};
  const targetOrderId = orderNumber || orderId;

  if (!targetOrderId) {
    res.status(400).json({ error: 'Missing orderId / orderNumber for refund.' });
    return;
  }

  try {
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const refundAmount = Number(amount);

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      res.status(400).json({ error: 'Invalid refund amount. Must be a positive number.' });
      return;
    }

    if (supabase) {
      const { data: orderData } = await supabase
        .from('orders')
        .select('total_amount, payment_status')
        .or(`id.eq.${targetOrderId},order_number.eq.${targetOrderId}`)
        .maybeSingle();

      if (orderData) {
        if (orderData.payment_status && orderData.payment_status !== 'paid') {
          res.status(400).json({
            error: `Cannot refund order with payment status '${orderData.payment_status}'. Only 'paid' orders can be refunded.`,
          });
          return;
        }
        if (Number.isFinite(Number(orderData.total_amount))) {
          if (refundAmount > Number(orderData.total_amount)) {
            res.status(400).json({ error: `Refund amount (₹${refundAmount}) cannot exceed order total (₹${orderData.total_amount}).` });
            return;
          }
        }
      }
    }

    const response = await cashfree.PGOrderCreateRefund(targetOrderId, {
      refund_id: refundId,
      refund_amount: refundAmount,
      refund_note: note || 'Refund processed by store admin',
    });

    if (supabase && targetOrderId) {
      await supabase.from('orders').update({
        status: 'Refunded',
        payment_status: 'refunded',
        refund_status: 'PROCESSED',
        refund_id: refundId,
        refund_amount: refundAmount,
        updated_at: new Date().toISOString(),
      }).or(`id.eq.${targetOrderId},order_number.eq.${targetOrderId}`);
    }

    res.json({ success: true, refund: response.data, message: 'Refund initiated successfully via Cashfree.' });
  } catch (err: any) {
    console.error('[Cashfree Refund Error]', err?.response?.data || err);
    res.status(500).json({ error: err?.response?.data?.message || err.message || 'Failed to process refund with Cashfree.' });
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
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    });
  } catch (err) {
    console.error('[ImageKit Auth Error]', err);
    res.status(500).json({ error: 'Failed to generate upload authentication.' });
  }
});

/**
 * Server-side ImageKit upload.
 * Preferred over browser→ImageKit direct upload so private-key signing stays on the server
 * and mismatched client credentials cannot break catalogue photo uploads.
 */
app.post('/api/imagekit/upload', requireAdmin, async (req, res) => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    res.status(503).json({
      error: 'ImageKit is not fully configured on server. Please add IMAGEKIT credentials.',
    });
    return;
  }

  try {
    const { fileBase64, fileName, folder, tags } = req.body || {};
    if (!fileBase64 || typeof fileBase64 !== 'string') {
      res.status(400).json({ error: 'Missing fileBase64 payload.' });
      return;
    }

    const rawBase64 = fileBase64.includes(',')
      ? fileBase64.split(',').pop() || ''
      : fileBase64;
    const buffer = Buffer.from(rawBase64, 'base64');
    if (!buffer.length) {
      res.status(400).json({ error: 'Invalid file data. Could not decode base64 payload.' });
      return;
    }
    // Guard against oversized payloads (client compresses first; allow headroom for rare large files)
    if (buffer.length > 20 * 1024 * 1024) {
      res.status(413).json({ error: 'File is too large. Please use a photo under 20 MB (or a shorter video).' });
      return;
    }

    const safeName = String(fileName || `upload-${Date.now()}.jpg`)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 120);
    const targetFolder = typeof folder === 'string' && folder.trim()
      ? folder.trim()
      : '/products';

    const uploadFile = await toFile(buffer, safeName);
    const uploadOptions: Record<string, unknown> = {
      file: uploadFile,
      fileName: safeName,
      folder: targetFolder,
      useUniqueFileName: true,
    };
    if (Array.isArray(tags) && tags.length > 0) {
      uploadOptions.tags = tags.map(String).join(',');
    }

    const uploaded = await imagekit.files.upload(uploadOptions as any);
    if (!uploaded?.url) {
      res.status(502).json({ error: 'ImageKit did not return a file URL.' });
      return;
    }

    res.json({
      success: true,
      url: uploaded.url,
      fileId: uploaded.fileId,
      name: uploaded.name,
      filePath: uploaded.filePath,
      thumbnailUrl: uploaded.thumbnailUrl,
    });
  } catch (err: any) {
    console.error('[ImageKit Upload Error]', err);
    res.status(500).json({
      error: err?.message || 'Failed to upload file to ImageKit.',
    });
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
