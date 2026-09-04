import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import tournamentRoutes from './routes/tournaments.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----- CORS configuration -----
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOptions = {
  origin: allowedOrigin,          // Must be exact, with https://
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,              // If your frontend sends cookies / auth headers
  optionsSuccessStatus: 200,      // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle preflight (OPTIONS) for all routes – cors does this,
// but we add an extra catch-all just in case.
app.options('*', cors(corsOptions));

app.use(express.json());

// ----- PostgreSQL connection pool -----
export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ekasi_league',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Test the connection (but don't crash on failure – let the app start and log)
try {
  await db.connect();
  console.log('✅ PostgreSQL connected successfully');
} catch (err) {
  console.error('❌ PostgreSQL connection failed:', err.message);
  console.log('⚠️  The server will still start, but database operations will fail.');
  // We do NOT exit here, so you can check the logs and fix env vars without restarting.
}

// ----- Routes -----
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/settings', settingsRoutes);

// Health check (useful for Render's uptime monitoring)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler (optional – catches any undefined routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});