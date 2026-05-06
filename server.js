import express from 'express';
import cors from 'cors';
import { query, get, run, isPostgres } from './db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints

// Get all problems
app.get('/api/problems', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM problems');
    const problems = rows.map(row => ({
      ...row,
      examples: isPostgres ? row.examples : JSON.parse(row.examples),
      hints: isPostgres ? row.hints : JSON.parse(row.hints),
      correctAnswers: isPostgres ? row.correctanswers : JSON.parse(row.correctAnswers),
      testCases: isPostgres ? row.testcases : JSON.parse(row.testCases)
    }));
    res.json(problems);
  } catch (err) {
    console.error('Error fetching problems:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get a single problem by id
app.get('/api/problems/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await get('SELECT * FROM problems WHERE id = $1', [id]);
    if (!row) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    const problem = {
      ...row,
      examples: isPostgres ? row.examples : JSON.parse(row.examples),
      hints: isPostgres ? row.hints : JSON.parse(row.hints),
      correctAnswers: isPostgres ? row.correctanswers : JSON.parse(row.correctAnswers),
      testCases: isPostgres ? row.testcases : JSON.parse(row.testCases)
    };
    res.json(problem);
  } catch (err) {
    console.error('Error fetching problem:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a submission
app.post('/api/submissions', async (req, res) => {
  const { problemId, code, status } = req.body;
  try {
    let result;
    if (isPostgres) {
      result = await run(
        'INSERT INTO submissions (problemId, code, status) VALUES ($1, $2, $3) RETURNING *',
        [problemId, code, status]
      );
    } else {
      result = await run(
        'INSERT INTO submissions (problemId, code, status) VALUES (?, ?, ?)',
        [problemId, code, status]
      );
      result = { id: result.lastID, problemId, code, status };
    }
    res.status(201).json(result);
  } catch (err) {
    console.error('Error adding submission:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM submissions ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching submissions:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
