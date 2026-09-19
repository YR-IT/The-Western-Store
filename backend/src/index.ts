import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ImageKit from '@imagekit/nodejs';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Supabase Backend Client ──────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// ─── Rate Limiter Setup ────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ─── Render & Multi-Origin CORS Setup ──────────────────────────────────────
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or matching origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.netlify.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ─── ImageKit SDK Setup ────────────────────────────────────────────────────
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});

// ─── Root & Health Check Endpoints (For Render Monitoring) ────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    app: 'The Western Store Backend API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      imagekitAuth: 'GET /api/imagekit/auth',
      orders: 'POST /api/orders',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'The Western Store API is running smoothly on Render',
    imagekit: {
      configured:
        !!process.env.IMAGEKIT_PUBLIC_KEY &&
        !!process.env.IMAGEKIT_PRIVATE_KEY &&
        !!process.env.IMAGEKIT_URL_ENDPOINT,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'NOT_SET',
    },
    supabase: {
      configured: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
});

// ─── Admin Login Authentication Endpoint ──────────────────────────────────
// Keeps ADMIN_EMAIL & ADMIN_PASSWORD strictly on the server — never in frontend JS!
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedEmail || !expectedPassword) {
    res.status(500).json({ error: 'Server configuration error: ADMIN_EMAIL or ADMIN_PASSWORD is not set on server environment.' });
    return;
  }

  if (email && email.trim().toLowerCase() === expectedEmail && password === expectedPassword) {
    res.json({
      success: true,
      user: {
        id: 'admin_tws_1',
        name: 'Boutique Manager',
        email: expectedEmail,
        authProvider: 'admin',
        isAdmin: true,
      },
      adminSecret: process.env.ADMIN_SECRET || '',
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials.' });
  }
});

// ─── Secure Order Processing & Management Endpoints ─────────────────────────
// Supabase is the single source of truth for orders — no local file cache.
app.get('/api/orders', async (_req, res) => {
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

    const filtered = (data || []).filter(
      (row: any) => row && (row.order_number || row.orderNumber)
    );
    res.json(filtered);
  } catch (err: any) {
    console.error('[Backend GET /api/orders Exception]', err);
    res.status(500).json({ error: err.message || 'Failed to load orders.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { formData, items, orderId, orderNumber: clientOrderNumber, userId } = req.body;

  if (!formData || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  try {
    // 1. Fetch latest product details from Supabase to validate prices if available
    let products: any[] = [];
    if (supabase) {
      try {
        const productIds = items.map((i: any) => i.productId).filter(Boolean);
        if (productIds.length > 0) {
          const { data, error } = await supabase
            .from('products')
            .select('id, title, price, images')
            .in('id', productIds);
          if (!error && data) {
            products = data;
          }
        }
      } catch (e) {
        console.warn('[Supabase Products Lookup Exception]', e);
      }
    }

    // 2. Calculate totals on the server with fallback
    let calculatedSubtotal = 0;
    const validatedItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      const unitPrice = product ? Number(product.price) : (Number(item.price) || 0);
      const itemTitle = product ? product.title : (item.title || 'Boutique Garment');
      const itemImage = product && product.images?.[0] ? product.images[0] : (item.image || '');

      calculatedSubtotal += unitPrice * (Number(item.quantity) || 1);
      return {
        productId: item.productId,
        title: itemTitle,
        image: itemImage,
        size: item.size || 'Free Size',
        color: item.color || '',
        quantity: Number(item.quantity) || 1,
        price: unitPrice,
      };
    });

    // 3. Create Order Object
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = clientOrderNumber || `TWS-2026-${randomSuffix}`;
    const newOrderId = orderId || `order-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newOrder = {
      id: newOrderId,
      order_number: orderNumber,
      orderNumber,
      user_id: userId || null,
      userId: userId || undefined,
      customer_name: formData.name || 'Customer',
      customerName: formData.name || 'Customer',
      customer_phone: formData.phone || '',
      phone: formData.phone || '',
      customer_email: formData.email || '',
      email: formData.email || '',
      shipping_address: {
        address: formData.address || '',
        pincode: formData.pincode || '',
        city: formData.city || '',
        state: formData.state || '',
        notes: formData.notes || '',
      },
      address: formData.address || '',
      pincode: formData.pincode || '',
      city: formData.city || '',
      state: formData.state || '',
      total_amount: calculatedSubtotal,
      total: calculatedSubtotal,
      status: 'Pending WhatsApp',
      payment_method: 'whatsapp_cod',
      items: validatedItems,
      notes: formData.notes || '',
      created_at: nowIso,
      createdAt: nowIso,
    };

    // 4. Save to Supabase (single source of truth — compatible with Supabase DB schema columns)
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured on the backend.' });
      return;
    }
    const isUuid = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;
    const supabaseRow: any = {
      id: newOrderId,
      order_number: orderNumber,
      user_id: isUuid ? userId : null,
      customer_name: formData.name || 'Customer',
      customer_phone: formData.phone || '',
      customer_email: formData.email || null,
      shipping_address: {
        address: formData.address || '',
        pincode: formData.pincode || '',
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
      const { error: updateErr } = await supabase.from('orders').update(supabaseRow).eq('id', newOrderId);
      if (updateErr) throw updateErr;
    }

    res.json({ success: true, orderId: newOrderId, orderNumber, total: calculatedSubtotal });
  } catch (err: any) {
    console.error('[Order Processing Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to place order.' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const normalizedUpdates: any = {
    ...updates,
    ...(updates.courier_name ? { courierName: updates.courier_name } : {}),
    ...(updates.tracking_number ? { trackingNumber: updates.tracking_number } : {}),
    ...(updates.tracking_link ? { trackingLink: updates.tracking_link } : {}),
    ...(updates.courierName ? { courier_name: updates.courierName } : {}),
    ...(updates.trackingNumber ? { tracking_number: updates.trackingNumber } : {}),
    ...(updates.trackingLink ? { tracking_link: updates.trackingLink } : {}),
  };
  if (!supabase) {
    res.status(503).json({ success: false, error: 'Supabase is not configured on the backend.' });
    return;
  }
  try {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.courier_name || updates.courierName) dbUpdates.courier_name = updates.courier_name || updates.courierName;
    if (updates.tracking_number || updates.trackingNumber) dbUpdates.tracking_number = updates.tracking_number || updates.trackingNumber;
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

app.delete('/api/orders/:id', async (req, res) => {
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

app.get('/api/imagekit/auth', (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET || 'westernstore_admin_2026';

  if (!expectedSecret) {
    res.status(500).json({ error: 'Server configuration error: ADMIN_SECRET is not set in environment.' });
    return;
  }

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret header.' });
    return;
  }

  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    res.status(503).json({
      error:
        'ImageKit is not configured on Render environment. Please add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in Render Environment Variables.',
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
    console.error('[ImageKit] Auth generation failed:', err);
    res.status(500).json({ error: 'Failed to generate upload authentication.' });
  }
});

// ─── ImageKit Media Library: List Files ──────────────────────────────────
app.get('/api/imagekit/files', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET || 'westernstore_admin_2026';

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret header.' });
    return;
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    res.status(503).json({ error: 'ImageKit private key is not configured on server.' });
    return;
  }

  try {
    const pathFilter = (req.query.path as string) || undefined;
    const limit = Math.min(Number(req.query.limit) || 60, 100);
    const searchQuery = (req.query.searchQuery as string) || undefined;

    const options: any = {
      limit,
    };
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
    console.error('[ImageKit] List files failed:', err);
    res.status(500).json({ error: err.message || 'Failed to list files from ImageKit.' });
  }
});

// ─── ImageKit Media Library: Delete File ─────────────────────────────────
app.delete('/api/imagekit/files/:fileId', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET || 'westernstore_admin_2026';

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret header.' });
    return;
  }

  const { fileId } = req.params;
  if (!fileId) {
    res.status(400).json({ error: 'Missing fileId parameter.' });
    return;
  }

  try {
    await imagekit.files.delete(fileId);
    res.json({ success: true, message: 'Image deleted from ImageKit successfully.' });
  } catch (err: any) {
    console.error('[ImageKit] Delete file failed:', err);
    res.status(500).json({ error: err.message || 'Failed to delete file from ImageKit.' });
  }
});



// ─── Store Settings API (Hero Slides, Reels, Home Sections Persistence) ──
// Supabase is the single source of truth. No local file cache, no committed
// defaults — every read/write goes straight to the `store_settings` table so
// nothing here can survive a redeploy and overwrite what was last saved.
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
    console.error('[Settings] GET error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to load store settings.' });
  }
});

app.post('/api/store-settings', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET || 'westernstore_admin_2026';

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret header.' });
    return;
  }

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
  } catch (e: any) {
    console.error('[Settings] POST error:', e);
    res.status(500).json({ success: false, error: e.message || 'Failed to save store setting.' });
  }
});

// ─── Start Server (Bound to 0.0.0.0 for Render) ───────────────────────────
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n🟢 The Western Store Backend`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   ImageKit auth endpoint: GET /api/imagekit/auth`);
  console.log(`   Health check endpoint: GET /api/health\n`);
});

