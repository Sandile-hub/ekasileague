import express from 'express';
import { db } from '../../backend/server.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings LIMIT 1');
    if (result.rows.length === 0) {
      // Insert default settings
      await db.query(
        `INSERT INTO settings (host_whatsapp, admin_password) VALUES ($1, $2)`,
        ['0664171598', 'ekasi123']
      );
      const newResult = await db.query('SELECT * FROM settings LIMIT 1');
      return res.json(newResult.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', async (req, res) => {
  const { host_whatsapp } = req.body;

  if (!host_whatsapp) {
    return res.status(400).json({ error: 'Host WhatsApp number is required' });
  }

  try {
    const result = await db.query('SELECT * FROM settings LIMIT 1');
    if (result.rows.length === 0) {
      await db.query(
        `INSERT INTO settings (host_whatsapp, admin_password) VALUES ($1, $2)`,
        [host_whatsapp, 'ekasi123']
      );
    } else {
      await db.query(
        'UPDATE settings SET host_whatsapp = $1 WHERE id = $2',
        [host_whatsapp, result.rows[0].id]
      );
    }

    const updated = await db.query('SELECT * FROM settings LIMIT 1');
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;