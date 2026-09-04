import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tournaments ORDER BY date ASC, time ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// Get single tournament
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tournaments WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Create tournament
router.post('/', async (req, res) => {
  const { name, date, time, location, entry_fee, prize_pool, status, total_slots } = req.body;

  if (!name || !date || !time || !location || entry_fee === undefined || prize_pool === undefined || !total_slots) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO tournaments (name, date, time, location, entry_fee, prize_pool, status, total_slots, slots_taken)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)
       RETURNING *`,
      [name, date, time, location, parseFloat(entry_fee), parseFloat(prize_pool), status || 'OPEN', parseInt(total_slots)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// Update tournament
router.put('/:id', async (req, res) => {
  const { name, date, time, location, entry_fee, prize_pool, status, total_slots } = req.body;

  if (!name || !date || !time || !location || entry_fee === undefined || prize_pool === undefined || !total_slots) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      `UPDATE tournaments SET
        name = $1, date = $2, time = $3, location = $4,
        entry_fee = $5, prize_pool = $6, status = $7, total_slots = $8
       WHERE id = $9
       RETURNING *`,
      [name, date, time, location, parseFloat(entry_fee), parseFloat(prize_pool), status || 'OPEN', parseInt(total_slots), req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM registrations WHERE tournament_id = $1', [req.params.id]);
    await db.query('DELETE FROM tournaments WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

// Register player for tournament
router.post('/:id/register', async (req, res) => {
  const { player_name, phone, team1, team2, team3 } = req.body;

  if (!player_name || !phone || !team1) {
    return res.status(400).json({ error: 'Player name, phone, and at least one team are required' });
  }

  const tournamentId = req.params.id;

  try {
    const tournResult = await db.query(
      'SELECT id, total_slots, slots_taken, status FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const t = tournResult.rows[0];

    if (t.status === 'FINISHED') {
      return res.status(400).json({ error: 'Tournament is finished' });
    }

    if (t.slots_taken >= t.total_slots) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    const insertResult = await db.query(
      `INSERT INTO registrations (tournament_id, player_name, phone, team1, team2, team3)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tournamentId, player_name, phone, team1, team2 || null, team3 || null]
    );

    const newSlotsTaken = t.slots_taken + 1;
    const newStatus = newSlotsTaken >= t.total_slots ? 'FULL' : t.status;

    await db.query(
      'UPDATE tournaments SET slots_taken = $1, status = $2 WHERE id = $3',
      [newSlotsTaken, newStatus, tournamentId]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get registrations for a tournament
router.get('/:id/registrations', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM registrations WHERE tournament_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

export default router;