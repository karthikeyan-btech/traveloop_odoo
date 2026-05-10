const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.get('/api/trips', (req, res) => {

  const userId = 1;
  db.all('SELECT * FROM trips WHERE user_id = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/trips', (req, res) => {
  const userId = 1;
  const { name, start_date, end_date, description, cover_photo } = req.body;
  db.run(
    'INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, start_date, end_date, description, cover_photo],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, start_date, end_date, description, cover_photo });
    }
  );
});


app.get('/api/trips/:id', (req, res) => {
  const userId = 1;
  const tripId = req.params.id;
  db.get('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, userId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    db.all('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [tripId], (err, stops) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const stopIds = stops.map(s => s.id);
      if (stopIds.length === 0) {
        trip.stops = [];
        return res.json(trip);
      }
      
      const placeholders = stopIds.map(() => '?').join(',');
      db.all(`SELECT * FROM activities WHERE stop_id IN (${placeholders})`, stopIds, (err, activities) => {
        if (err) return res.status(500).json({ error: err.message });
        
        trip.stops = stops.map(stop => {
          stop.activities = activities.filter(a => a.stop_id === stop.id);
          return stop;
        });
        
        res.json(trip);
      });
    });
  });
});

app.delete('/api/trips/:id', (req, res) => {
  const tripId = req.params.id;
  const userId = 1;

  db.get('SELECT id FROM trips WHERE id = ? AND user_id = ?', [tripId, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Trip not found' });

    db.all('SELECT id FROM stops WHERE trip_id = ?', [tripId], (err, stops) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const stopIds = stops.map(s => s.id);
      if (stopIds.length > 0) {
        const placeholders = stopIds.map(() => '?').join(',');
        db.run(`DELETE FROM activities WHERE stop_id IN (${placeholders})`, stopIds);
      }
      
      db.run('DELETE FROM stops WHERE trip_id = ?', [tripId]);
      db.run('DELETE FROM checklist_items WHERE trip_id = ?', [tripId]);
      db.run('DELETE FROM notes WHERE trip_id = ?', [tripId]);
      
      db.run('DELETE FROM trips WHERE id = ?', [tripId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  });
});

app.post('/api/stops', (req, res) => {
  const { trip_id, city_name, start_date, end_date, order_index } = req.body;
  db.run(
    'INSERT INTO stops (trip_id, city_name, start_date, end_date, order_index) VALUES (?, ?, ?, ?, ?)',
    [trip_id, city_name, start_date, end_date, order_index],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, trip_id, city_name, start_date, end_date, order_index });
    }
  );
});

app.post('/api/activities', (req, res) => {
  const { stop_id, name, type, estimated_cost, duration } = req.body;
  db.run(
    'INSERT INTO activities (stop_id, name, type, estimated_cost, duration) VALUES (?, ?, ?, ?, ?)',
    [stop_id, name, type, estimated_cost, duration],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, stop_id, name, type, estimated_cost, duration });
    }
  );
});


app.get('/api/trips/:id/checklist', (req, res) => {
  db.all('SELECT * FROM checklist_items WHERE trip_id = ?', [req.params.id], (err, items) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(items);
  });
});

app.post('/api/trips/:id/checklist', (req, res) => {
  const { name, category } = req.body;
  db.run(
    'INSERT INTO checklist_items (trip_id, name, category, is_packed) VALUES (?, ?, ?, 0)',
    [req.params.id, name, category],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, trip_id: req.params.id, name, category, is_packed: 0 });
    }
  );
});

app.put('/api/checklist/:id', (req, res) => {
  const { is_packed } = req.body;
  db.run('UPDATE checklist_items SET is_packed = ? WHERE id = ?', [is_packed, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/checklist/:id', (req, res) => {
  db.run('DELETE FROM checklist_items WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


app.get('/api/trips/:id/notes', (req, res) => {
  db.all('SELECT * FROM notes WHERE trip_id = ? ORDER BY timestamp DESC', [req.params.id], (err, notes) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(notes);
  });
});

app.post('/api/trips/:id/notes', (req, res) => {
  const { content } = req.body;
  const timestamp = new Date().toISOString();
  db.run(
    'INSERT INTO notes (trip_id, content, timestamp) VALUES (?, ?, ?)',
    [req.params.id, content, timestamp],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, trip_id: req.params.id, content, timestamp });
    }
  );
});

app.delete('/api/notes/:id', (req, res) => {
  db.run('DELETE FROM notes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


db.get('SELECT id FROM users WHERE id = 1', (err, row) => {
  if (!row) {
    db.run("INSERT INTO users (name, email, password) VALUES ('Test User', 'test@test.com', 'password')");
  }
});

app.listen(PORT);
