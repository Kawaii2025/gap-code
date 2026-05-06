import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints

// Get all problems
app.get('/api/problems', (req, res) => {
  db.all('SELECT * FROM problems', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const problems = rows.map(row => ({
      ...row,
      examples: JSON.parse(row.examples),
      hints: JSON.parse(row.hints),
      correctAnswers: JSON.parse(row.correctAnswers),
      testCases: JSON.parse(row.testCases)
    }));
    res.json(problems);
  });
});

// Get a single problem by id
app.get('/api/problems/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM problems WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    const problem = {
      ...row,
      examples: JSON.parse(row.examples),
      hints: JSON.parse(row.hints),
      correctAnswers: JSON.parse(row.correctAnswers),
      testCases: JSON.parse(row.testCases)
    };
    res.json(problem);
  });
});

// Add a submission
app.post('/api/submissions', (req, res) => {
  const { problemId, code, status } = req.body;
  db.run(
    'INSERT INTO submissions (problemId, code, status) VALUES (?, ?, ?)',
    [problemId, code, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        problemId,
        code,
        status
      });
    }
  );
});

// Get all submissions
app.get('/api/submissions', (req, res) => {
  db.all('SELECT * FROM submissions ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
