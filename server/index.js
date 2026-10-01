import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const today = () => new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

// Get all habits, with whether each is done today
app.get('/api/habits', (req, res) => {
  const habits = db.prepare(`
    SELECT h.id, h.name,
      EXISTS (
        SELECT 1 FROM completions c
        WHERE c.habit_id = h.id AND c.done_on = ?
      ) AS done
    FROM habits h
    ORDER BY h.id
  `).all(today());

  res.json(habits.map(h => ({ ...h, done: !!h.done })));
});

// Create a habit
app.post('/api/habits', (req, res) => {
  const { name } = req.body;
  const result = db.prepare('INSERT INTO habits (name) VALUES (?)').run(name);
  res.json({ id: result.lastInsertRowid, name, done: false });
});

// Toggle today's completion
app.post('/api/habits/:id/toggle', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare(
    'SELECT id FROM completions WHERE habit_id = ? AND done_on = ?'
  ).get(id, today());

  if (existing) {
    db.prepare('DELETE FROM completions WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO completions (habit_id, done_on) VALUES (?, ?)').run(id, today());
  }
  res.json({ ok: true });
});

// Delete a habit
app.delete('/api/habits/:id', (req, res) => {
  db.prepare('DELETE FROM completions WHERE habit_id = ?').run(req.params.id);
  db.prepare('DELETE FROM habits WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));