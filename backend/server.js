import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import tournamentRoutes from './routes/tournaments.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

export const db = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ekasi_league',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  await db.getConnection();
  console.log('✅ MySQL connected successfully');
} catch (err) {
  console.error('❌ MySQL connection failed:', err.message);
  process.exit(1);
}

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});