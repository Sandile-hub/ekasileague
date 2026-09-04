import express from 'express';
import { db } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tournaments ORDER BY date ASC, time ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tournaments WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

router.post('/', async (req, res) => {
  const { name, date, time, location, entry_fee, prize_pool, status, total_slots } = req.body;

  if (!name || !date || !time || !location || entry_fee === undefined || prize_pool === undefined || !total_slots) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO tournaments (name, date, time, location, entry_fee, prize_pool, status, total_slots, slots_taken)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [name, date, time, location, parseFloat(entry_fee), parseFloat(prize_pool), status || 'OPEN', parseInt(total_slots)]
    );

    const [newTournament] = await db.query(
      'SELECT * FROM tournaments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTournament[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, date, time, location, entry_fee, prize_pool, status, total_slots } = req.body;

  if (!name || !date || !time || !location || entry_fee === undefined || prize_pool === undefined || !total_slots) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await db.query(
      `UPDATE tournaments SET
        name = ?, date = ?, time = ?, location = ?,
        entry_fee = ?, prize_pool = ?, status = ?, total_slots = ?
       WHERE id = ?`,
      [name, date, time, location, parseFloat(entry_fee), parseFloat(prize_pool), status || 'OPEN', parseInt(total_slots), req.params.id]
    );

    const [updated] = await db.query(
      'SELECT * FROM tournaments WHERE id = ?',
      [req.params.id]
    );

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM registrations WHERE tournament_id = ?', [req.params.id]);
    await db.query('DELETE FROM tournaments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

router.post('/:id/register', async (req, res) => {
  const { player_name, phone, team1, team2, team3 } = req.body;

  if (!player_name || !phone || !team1) {
    return res.status(400).json({ error: 'Player name, phone, and at least one team are required' });
  }

  const tournamentId = req.params.id;

  try {
    const [tournament] = await db.query(
      'SELECT id, total_slots, slots_taken, status FROM tournaments WHERE id = ?',
      [tournamentId]
    );

    if (tournament.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const t = tournament[0];

    if (t.status === 'FINISHED') {
      return res.status(400).json({ error: 'Tournament is finished' });
    }

    if (t.slots_taken >= t.total_slots) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    const [result] = await db.query(
      `INSERT INTO registrations (tournament_id, player_name, phone, team1, team2, team3)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tournamentId, player_name, phone, team1, team2 || null, team3 || null]
    );

    const newSlotsTaken = t.slots_taken + 1;
    const newStatus = newSlotsTaken >= t.total_slots ? 'FULL' : t.status;

    await db.query(
      'UPDATE tournaments SET slots_taken = ?, status = ? WHERE id = ?',
      [newSlotsTaken, newStatus, tournamentId]
    );

    const [registration] = await db.query(
      'SELECT * FROM registrations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(registration[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/:id/registrations', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM registrations WHERE tournament_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

export default router;