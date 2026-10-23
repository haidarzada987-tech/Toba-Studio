import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import fs from 'fs';
import multer from 'multer';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-before-production';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@tobastudio.local').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'TOBA Admin';
const HESABPAY_CREATE_SESSION_URL =
  process.env.HESABPAY_CREATE_SESSION_URL || 'https://api-sandbox.hesab.com/api/v1/payment/create-session';
const HESABPAY_SUCCESS_URL =
  process.env.HESABPAY_SUCCESS_URL || `http://localhost:${PORT}/payment-success`;
const HESABPAY_FAILURE_URL =
  process.env.HESABPAY_FAILURE_URL || `http://localhost:${PORT}/payment-failure`;
const HESABPAY_API_KEY = process.env.HESABPAY_API_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

const databasePath = path.join(__dirname, 'database.sqlite');
const sqlite = new Database(databasePath);
sqlite.pragma('journal_mode = WAL');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    items_json TEXT NOT NULL,
    amount_afn INTEGER NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'new',
    session_id TEXT,
    payment_url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    title_dr TEXT NOT NULL,
    title_ps TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_dr TEXT NOT NULL,
    description_ps TEXT NOT NULL,
    description_en TEXT NOT NULL,
    price_dr TEXT NOT NULL,
    price_ps TEXT NOT NULL,
    price_en TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    dr TEXT NOT NULL,
    ps TEXT NOT NULL,
    en TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const adminExists = sqlite.prepare('SELECT email FROM admin_users WHERE email = ?').get(ADMIN_EMAIL);
if (!adminExists) {
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  sqlite
    .prepare(
      `INSERT INTO admin_users (email, password_hash, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    )
    .run(ADMIN_EMAIL, passwordHash, ADMIN_NAME, now, now);
}

const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    const allowedExtensions = /\.(jpeg|jpg|png|webp|svg)$/i;
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, PNG, WEBP, and SVG images are allowed.'));
  },
});

type AuthenticatedRequest = express.Request & {
  admin?: { email: string; name: string };
  file?: Express.Multer.File;
};

type LocalizedText = { dr: string; ps: string; en: string };
type ServicePayload = {
  id: string;
  category: 'ai' | 'card' | 'graphic';
  image: string;
  title: LocalizedText;
  description: LocalizedText;
  price: LocalizedText;
};

type HesabPayItem = { id: string; name: string; price: number; quantity?: number };

type TrackableOrder = {
  tracking_code: string;
  customer_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  items: HesabPayItem[];
  amount_afn: number;
  payment_status: string;
  order_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

function normalizePaymentItems(items: unknown): HesabPayItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one payment item is required.');
  }
  return items.map((item, index) => {
    const source = item as Partial<HesabPayItem>;
    const id = String(source.id || `item-${index + 1}`);
    const name = String(source.name || '').trim();
    const price = Number(source.price);
    if (!name) throw new Error(`Item ${index + 1} is missing a valid name.`);
    if (!Number.isFinite(price) || price <= 0) throw new Error(`Item ${index + 1} has an invalid price.`);
    const quantity = Number((source as any).quantity);
    return { id, name, price: Math.round(price), quantity: Number.isFinite(quantity) && quantity > 0 ? Math.round(quantity) : undefined };

  });
}

function normalizeContactValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeLocalizedText(value: unknown, fallback = ''): LocalizedText {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    dr: normalizeContactValue(source.dr) || fallback,
    ps: normalizeContactValue(source.ps) || fallback,
    en: normalizeContactValue(source.en) || fallback,
  };
}

function buildRedirectUrl(baseUrl: string, trackingCode: string) {
  const url = new URL(baseUrl);
  url.searchParams.set('tracking', trackingCode);
  return url.toString();
}

function generateTrackingCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TOBA-${Date.now().toString().slice(-6)}-${random}`;
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapServiceRow(row: any): ServicePayload {
  return {
    id: String(row.id),
    category: row.category,
    image: row.image || '/images/logo.svg',
    title: { dr: row.title_dr || '', ps: row.title_ps || '', en: row.title_en || '' },
    description: {
      dr: row.description_dr || '',
      ps: row.description_ps || '',
      en: row.description_en || '',
    },
    price: { dr: row.price_dr || '', ps: row.price_ps || '', en: row.price_en || '' },
  };
}

function orderPublicShape(row: any): TrackableOrder {
  return {
    tracking_code: row.tracking_code,
    customer_name: row.customer_name,
    email: row.email || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    items: safeJsonParse(row.items_json || '[]', []),
    amount_afn: row.amount_afn,
    payment_status: row.payment_status,
    order_status: row.order_status,
    notes: row.notes || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function createToken(payload: { email: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function requireAdmin(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return res.status(401).json({ error: 'Admin authentication required.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; name: string };
    req.admin = { email: decoded.email, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin token.' });
  }
}

function getSiteContentMap() {
  const rows = sqlite.prepare('SELECT key, dr, ps, en FROM site_content ORDER BY key ASC').all() as any[];
  return rows.reduce<Record<string, LocalizedText>>((acc, row) => {
    acc[row.key] = { dr: row.dr, ps: row.ps, en: row.en };
    return acc;
  }, {});
}

function getSiteSettingsMap() {
  const rows = sqlite.prepare('SELECT key, value FROM site_settings ORDER BY key ASC').all() as any[];
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  app.use(
    cors(
      CORS_ORIGIN
        ? {
            origin: CORS_ORIGIN.split(',').map((item) => item.trim()),
            credentials: true,
          }
        : undefined
    )
  );
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/admin/login', (req, res) => {
    const email = normalizeContactValue(req.body?.email).toLowerCase();
    const password = normalizeContactValue(req.body?.password);
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const admin = sqlite.prepare('SELECT email, password_hash, name FROM admin_users WHERE email = ?').get(email) as any;
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken({ email: admin.email, name: admin.name });
    return res.json({ token, admin: { email: admin.email, name: admin.name } });
  });

  app.get('/api/admin/me', requireAdmin, (req: AuthenticatedRequest, res) => res.json({ admin: req.admin }));

  app.get('/api/public/bootstrap', (_req, res) => {
    const featuredServices = sqlite
      .prepare(
        `SELECT * FROM services ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC LIMIT 6`
      )
      .all()
      .map(mapServiceRow);

    res.json({
      featuredServices,
      siteContent: getSiteContentMap(),
      siteSettings: getSiteSettingsMap(),
    });
  });

  app.get('/api/public/services', (req, res) => {
    const category = normalizeContactValue(req.query.category);
    const rows = category
      ? sqlite
          .prepare(`SELECT * FROM services WHERE category = ? ORDER BY datetime(created_at) DESC`)
          .all(category)
      : sqlite.prepare(`SELECT * FROM services ORDER BY datetime(created_at) DESC`).all();

    res.json({ services: (rows as any[]).map(mapServiceRow) });
  });

  app.get('/api/admin/orders', requireAdmin, (_req, res) => {
    const rows = sqlite
      .prepare(`SELECT * FROM orders ORDER BY datetime(created_at) DESC, id DESC`)
      .all()
      .map(orderPublicShape);
    res.json({ orders: rows });
  });

  app.put('/api/admin/orders/:trackingCode', requireAdmin, (req, res) => {
    const trackingCode = req.params.trackingCode;
    const existing = sqlite.prepare('SELECT * FROM orders WHERE tracking_code = ?').get(trackingCode) as any;
    if (!existing) return res.status(404).json({ error: 'Order not found.' });

    const paymentStatus = normalizeContactValue(req.body?.payment_status) || existing.payment_status;
    const orderStatus = normalizeContactValue(req.body?.order_status) || existing.order_status;
    const notes = normalizeContactValue(req.body?.notes);
    const updatedAt = new Date().toISOString();

    sqlite
      .prepare(
        `UPDATE orders SET payment_status = ?, order_status = ?, notes = ?, updated_at = ? WHERE tracking_code = ?`
      )
      .run(paymentStatus, orderStatus, notes, updatedAt, trackingCode);

    const row = sqlite.prepare('SELECT * FROM orders WHERE tracking_code = ?').get(trackingCode);
    res.json({ order: orderPublicShape(row) });
  });

  app.delete('/api/admin/orders/:trackingCode', requireAdmin, (req, res) => {
    const trackingCode = req.params.trackingCode;
    const existing = sqlite.prepare('SELECT tracking_code FROM orders WHERE tracking_code = ?').get(trackingCode) as any;
    if (!existing) return res.status(404).json({ error: 'Order not found.' });

    sqlite.prepare('DELETE FROM orders WHERE tracking_code = ?').run(trackingCode);
    res.status(204).send();
  });

  app.get('/api/admin/site-content', requireAdmin, (_req, res) => {
    res.json({ content: getSiteContentMap() });
  });

  app.put('/api/admin/site-content', requireAdmin, (req, res) => {
    const content = req.body?.content;
    if (!content || typeof content !== 'object') return res.status(400).json({ error: 'content is required.' });
    const now = new Date().toISOString();
    const upsert = sqlite.prepare(
      `INSERT INTO site_content (key, dr, ps, en, updated_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET dr = excluded.dr, ps = excluded.ps, en = excluded.en, updated_at = excluded.updated_at`
    );
    const transaction = sqlite.transaction((entries: Array<[string, LocalizedText]>) => {
      for (const [key, value] of entries) {
        upsert.run(key, value.dr || '', value.ps || '', value.en || '', now);
      }
    });
    transaction(Object.entries(content as Record<string, LocalizedText>));
    res.json({ content: getSiteContentMap() });
  });

  app.get('/api/admin/site-settings', requireAdmin, (_req, res) => {
    res.json({ settings: getSiteSettingsMap() });
  });

  app.put('/api/admin/site-settings', requireAdmin, (req, res) => {
    const settings = req.body?.settings;
    if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'settings is required.' });
    const now = new Date().toISOString();
    const upsert = sqlite.prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    );
    const transaction = sqlite.transaction((entries: Array<[string, string]>) => {
      for (const [key, value] of entries) {
        upsert.run(key, String(value ?? ''), now);
      }
    });
    transaction(Object.entries(settings as Record<string, string>));
    res.json({ settings: getSiteSettingsMap() });
  });

  app.get('/api/admin/services', requireAdmin, (_req, res) => {
    const rows = sqlite.prepare(`SELECT * FROM services ORDER BY datetime(created_at) DESC`).all();
    res.json({ services: (rows as any[]).map(mapServiceRow) });
  });

  app.post('/api/admin/services', requireAdmin, (req, res) => {
    const id = normalizeContactValue(req.body?.id);
    const category = normalizeContactValue(req.body?.category);
    const image = normalizeContactValue(req.body?.image) || '/images/logo.svg';
    const title = normalizeLocalizedText(req.body?.title);
    const description = normalizeLocalizedText(req.body?.description);
    const price = normalizeLocalizedText(req.body?.price);

    if (!id || !category) return res.status(400).json({ error: 'id and category are required.' });
    if (!title.en && !title.dr && !title.ps) return res.status(400).json({ error: 'Service title is required.' });

    const now = new Date().toISOString();
    sqlite
      .prepare(
        `INSERT INTO services (
          id, category, image,
          title_dr, title_ps, title_en,
          description_dr, description_ps, description_en,
          price_dr, price_ps, price_en,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        id,
        category,
        image,
        title.dr,
        title.ps,
        title.en,
        description.dr,
        description.ps,
        description.en,
        price.dr,
        price.ps,
        price.en,
        now,
        now
      );

    const row = sqlite.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.json({ service: mapServiceRow(row) });
  });

  app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
    const serviceId = req.params.id;
    const existing = sqlite.prepare('SELECT * FROM services WHERE id = ?').get(serviceId) as any;
    if (!existing) return res.status(404).json({ error: 'Service not found.' });

    const category = normalizeContactValue(req.body?.category) || existing.category;
    const image = normalizeContactValue(req.body?.image) || existing.image;
    const title = normalizeLocalizedText(req.body?.title, existing.title_en);
    const description = normalizeLocalizedText(req.body?.description, '');
    const price = normalizeLocalizedText(req.body?.price, '');
    const now = new Date().toISOString();

    sqlite
      .prepare(
        `UPDATE services SET
          category = ?, image = ?,
          title_dr = ?, title_ps = ?, title_en = ?,
          description_dr = ?, description_ps = ?, description_en = ?,
          price_dr = ?, price_ps = ?, price_en = ?,
          updated_at = ?
        WHERE id = ?`
      )
      .run(
        category,
        image,
        title.dr,
        title.ps,
        title.en,
        description.dr,
        description.ps,
        description.en,
        price.dr,
        price.ps,
        price.en,
        now,
        serviceId
      );

    const row = sqlite.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
    res.json({ service: mapServiceRow(row) });
  });

  app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
    sqlite.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/payment/create', async (req, res) => {
    try {
      if (!HESABPAY_API_KEY) {
        return res.status(500).json({ error: 'HesabPay API key is not configured.' });
      }

      const customerName = normalizeContactValue(req.body?.customerName);
      const email = normalizeContactValue(req.body?.email);
      const phone = normalizeContactValue(req.body?.phone);
      const whatsapp = normalizeContactValue(req.body?.whatsapp);
      const items = normalizePaymentItems(req.body?.items);

      if (!customerName) return res.status(400).json({ error: 'Customer name is required.' });
      if (!email && !phone && !whatsapp) {
        return res.status(400).json({ error: 'Please provide at least one contact method.' });
      }

      const trackingCode = generateTrackingCode();
      const createdAt = new Date().toISOString();
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const redirectSuccessUrl = buildRedirectUrl(HESABPAY_SUCCESS_URL, trackingCode);
      const redirectFailureUrl = buildRedirectUrl(HESABPAY_FAILURE_URL, trackingCode);
      const paymentEmail = email || `guest-${trackingCode.toLowerCase()}@tobastudio.local`;

      const response = await axios.post(
        HESABPAY_CREATE_SESSION_URL,
        {
          email: paymentEmail,
          items,
          redirect_success_url: redirectSuccessUrl,
          redirect_failure_url: redirectFailureUrl,
        },
        {
          headers: {
            Authorization: `API-KEY ${HESABPAY_API_KEY}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 20000,
        }
      );

      const paymentUrl =
        response.data?.payment_url ||
        response.data?.checkout_url ||
        response.data?.redirect_url ||
        response.data?.url ||
        response.data?.paymentUrl ||
        response.data?.data?.payment_url ||
        response.data?.data?.checkout_url ||
        response.data?.data?.url;

      if (!paymentUrl) {
        return res.status(502).json({ error: 'HesabPay did not return a payment URL.', details: response.data });
      }

      sqlite
        .prepare(
          `INSERT INTO orders (
            tracking_code, customer_name, email, phone, whatsapp, items_json,
            amount_afn, payment_status, order_status, session_id, payment_url,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'new', ?, ?, ?, ?)`
        )
        .run(
          trackingCode,
          customerName,
          email,
          phone,
          whatsapp,
          JSON.stringify(items),
          totalAmount,
          response.data?.session_id || response.data?.data?.session_id || null,
          paymentUrl,
          createdAt,
          createdAt
        );

      return res.json({ ...response.data, payment_url: paymentUrl, tracking_code: trackingCode });
    } catch (error: any) {
      const remoteError = error?.response?.data;
      return res.status(error?.response?.status || 500).json({
        error: remoteError?.message || remoteError?.error || error?.message || 'Failed to create payment session',
        details: remoteError || null,
      });
    }
  });

  app.get('/api/orders/track', (req, res) => {
    const tracking = normalizeContactValue(req.query.tracking);
    const contact = normalizeContactValue(req.query.contact).toLowerCase();
    if (!tracking || !contact) {
      return res.status(400).json({ error: 'Tracking code and contact value are required.' });
    }

    const row = sqlite.prepare('SELECT * FROM orders WHERE tracking_code = ?').get(tracking) as any;
    if (!row) return res.status(404).json({ error: 'Order not found.' });

    const matches = [row.email, row.phone, row.whatsapp]
      .filter(Boolean)
      .map((value: string) => value.toLowerCase())
      .includes(contact);

    if (!matches) return res.status(403).json({ error: 'Contact information does not match this order.' });
    return res.json({ order: orderPublicShape(row) });
  });

  app.get('/payment-success', (req, res) => {
    const tracking = normalizeContactValue(req.query.tracking);
    if (tracking) {
      sqlite
        .prepare(`UPDATE orders SET payment_status = 'paid', order_status = CASE WHEN order_status = 'failed' THEN 'failed' ELSE 'confirmed' END, updated_at = ? WHERE tracking_code = ?`)
        .run(new Date().toISOString(), tracking);
    }
    const query = new URLSearchParams({
      status: 'success',
      ...Object.fromEntries(Object.entries(req.query).map(([k, v]) => [k, String(v)])),
    });
    res.redirect(`/checkout?${query.toString()}`);
  });

  app.get('/payment-failure', (req, res) => {
    const tracking = normalizeContactValue(req.query.tracking);
    if (tracking) {
      sqlite
        .prepare(`UPDATE orders SET payment_status = 'failed', order_status = 'failed', updated_at = ? WHERE tracking_code = ?`)
        .run(new Date().toISOString(), tracking);
    }
    const query = new URLSearchParams({
      status: 'failure',
      ...Object.fromEntries(Object.entries(req.query).map(([k, v]) => [k, String(v)])),
    });
    res.redirect(`/checkout?${query.toString()}`);
  });

  app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req: AuthenticatedRequest, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API route not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
