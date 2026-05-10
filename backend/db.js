const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'traveloop.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (!err) {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        cover_photo TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS stops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        city_name TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        order_index INTEGER,
        FOREIGN KEY (trip_id) REFERENCES trips (id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stop_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT,
        estimated_cost REAL,
        duration TEXT,
        FOREIGN KEY (stop_id) REFERENCES stops (id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS checklist_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        is_packed INTEGER DEFAULT 0,
        category TEXT,
        FOREIGN KEY (trip_id) REFERENCES trips (id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (trip_id) REFERENCES trips (id)
      )`);
    });
  }
});

module.exports = db;
