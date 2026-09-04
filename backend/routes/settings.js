import express from 'express';
import { db } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings LIMIT 1');
    if (rows.length === 0) {
      await db.query(
        `INSERT INTO settings (host_whatsapp, admin_password) VALUES ('0664171598', 'ekasi123')`
      );
      const [newRows] = await db.query('SELECT * FROM settings LIMIT 1');
      return res.json(newRows[0]);
    }
    res.json(rows[0]);
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
    const [rows] = await db.query('SELECT * FROM settings LIMIT 1');
    if (rows.length === 0) {
      await db.query(
        `INSERT INTO settings (host_whatsapp, admin_password) VALUES (?, 'ekasi123')`,
        [host_whatsapp]
      );
    } else {
      await db.query(
        'UPDATE settings SET host_whatsapp = ? WHERE id = ?',
        [host_whatsapp, rows[0].id]
      );
    }

    const [updated] = await db.query('SELECT * FROM settings LIMIT 1');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;