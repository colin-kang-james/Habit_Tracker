import Database from 'better-sqlite3';

const db = new Database('habits.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    done_on TEXT NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits(id),
    UNIQUE (habit_id, done_on)
  );
`);

export default db;