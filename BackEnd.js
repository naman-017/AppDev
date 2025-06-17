const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
// mysql -u root -p
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'naman', // Change this if needed
  database: 'tabledb'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
  console.log('✅ MySQL connected');
});

// GET all rows
app.get('/api/rows', (req, res) => {
  db.query('SELECT * FROM my_table', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query error' });
    res.json(results);
  });
});

// PUT update row (all columns col1-col4)
app.put('/api/rows/:id', (req, res) => {
  const { col1, col2, col3, col4 } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE my_table SET col1=?, col2=?, col3=?, col4=? WHERE id=?',
    [col1, col2, col3, col4, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database update error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Row not found' });
      res.json({ message: 'Row updated successfully' });
    }
  );
});

// POST add new row
app.post('/api/rows', (req, res) => {
  const { col1, col2, col3, col4 } = req.body;

  db.query(
    'INSERT INTO my_table (col1, col2, col3, col4) VALUES (?, ?, ?, ?)',
    [col1, col2, col3, col4],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database insert error' });
      res.status(201).json({ message: 'Row inserted successfully', insertedId: result.insertId });
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
