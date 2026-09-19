import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ImageKit from '@imagekit/nodejs';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

// ─── Secure Order Processing Endpoint ──────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  const { formData, items } = req.body;

  if (!formData || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase is not configured on the backend server.' });
    }
    // 1. Fetch latest product details from Supabase to validate prices
    const productIds = items.map((i: any) => i.productId);
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, title, price, images')
      .in('id', productIds);

    if (productError || !products) {
      throw new Error('Failed to validate product prices.');
    }

    // 2. Calculate totals on the server
    let calculatedSubtotal = 0;
    const validatedItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      
      calculatedSubtotal += product.price * item.quantity;
      return {
        productId: product.id,
        title: product.title,
        image: product.images[0],
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // 3. Create Order Object
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TWS-2026-${randomSuffix}`;
    const newOrderId = `order-${Date.now()}`;

    const newOrder = {
      id: newOrderId,
      order_number: orderNumber,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      shipping_address: {
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
      },
      total_amount: calculatedSubtotal,
      status: 'Pending WhatsApp',
      items: JSON.stringify(validatedItems),
      notes: formData.notes
    };

    // 4. Save to Supabase
    const { error: orderError } = await supabase.from('orders').insert([newOrder]);

    if (orderError) throw orderError;

    res.json({ success: true, orderNumber, total: calculatedSubtotal });
  } catch (err) {
    console.error('[Order Processing Error]', err);
    res.status(500).json({ error: 'Failed to process order securely.' });
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
const SETTINGS_FILE_PATH = path.join(__dirname, '..', 'data', 'store_settings.json');

function getLocalStoreSettings(): Record<string, any> {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('[Settings] Error reading local store settings:', e);
  }
  return {};
}

function saveLocalStoreSetting(key: string, value: any) {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = getLocalStoreSettings();
    current[key] = value;
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(current, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Settings] Error saving local store setting:', e);
  }
}

app.get('/api/store-settings', async (_req, res) => {
  try {
    const localSettings = getLocalStoreSettings();
    if (supabase) {
      const { data, error } = await supabase.from('store_settings').select('*');
      if (!error && data && data.length > 0) {
        const merged: Record<string, any> = { ...localSettings };
        for (const row of data) {
          if (row.key) merged[row.key] = row.value;
        }
        res.json({ success: true, settings: merged });
        return;
      }
    }
    res.json({ success: true, settings: localSettings });
  } catch (err: any) {
    console.error('[Settings] GET error:', err);
    res.json({ success: true, settings: getLocalStoreSettings() });
  }
});

app.post('/api/store-settings', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET || 'westernstore_admin_2026';

  if (!adminSecret || adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret header.' });
    return;
  }

  const { key, value } = req.body || {};
  if (!key) {
    res.status(400).json({ error: 'Missing setting key' });
    return;
  }

  saveLocalStoreSetting(key, value);

  if (supabase) {
    try {
      await supabase.from('store_settings').upsert({ key, value, updated_at: new Date().toISOString() });
    } catch (e: any) {
      console.warn('[Supabase] Background store_setting upsert exception:', e?.message || e);
    }
  }

  res.json({ success: true, message: `Setting '${key}' saved successfully.` });
});

// ─── Start Server (Bound to 0.0.0.0 for Render) ───────────────────────────
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n🟢 The Western Store Backend`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   ImageKit auth endpoint: GET /api/imagekit/auth`);
  console.log(`   Health check endpoint: GET /api/health\n`);
});

