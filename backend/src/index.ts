import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ImageKit from '@imagekit/nodejs';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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
  });
});

// ─── Admin Login Authentication Endpoint ──────────────────────────────────
// Keeps ADMIN_EMAIL & ADMIN_PASSWORD strictly on the server — never in frontend JS!
app.post('/api/admin/login', (req, res) => {
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

// ─── Start Server (Bound to 0.0.0.0 for Render) ───────────────────────────
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n🟢 The Western Store Backend`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   ImageKit auth endpoint: GET /api/imagekit/auth`);
  console.log(`   Health check endpoint: GET /api/health\n`);
});

