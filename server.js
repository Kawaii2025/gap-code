import express from 'express'
import cors from 'cors'
import { query, get, run, isPostgres } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Health check helper
const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    database: isPostgres ? 'Neon (PostgreSQL)' : 'SQLite (Local)'
  });
};

// Root endpoint (health check)
app.get('/', healthCheck);

// Health check endpoint
app.get('/api/health', healthCheck);

// API Endpoints

// Get all problems
app.get('/api/problems', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM problems');
    const problems = rows.map(row => {
      if (isPostgres) {
        return {
          id: row.id,
          title: row.title,
          difficulty: row.difficulty,
          acceptance: row.acceptance,
          description: row.description,
          examples: row.examples,
          hints: row.hints,
          initialCode: row["initialCode"],
          correctAnswers: row["correctAnswers"],
          testCases: row["testCases"],
          functionName: row["functionName"]
        };
      } else {
        return {
          ...row,
          examples: JSON.parse(row.examples),
          hints: JSON.parse(row.hints),
          correctAnswers: JSON.parse(row.correctAnswers),
          testCases: JSON.parse(row.testCases)
        };
      }
    });
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
    const sql = isPostgres ? 'SELECT * FROM problems WHERE id = $1' : 'SELECT * FROM problems WHERE id = ?';
    const row = await get(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    let problem;
    if (isPostgres) {
      problem = {
        id: row.id,
        title: row.title,
        difficulty: row.difficulty,
        acceptance: row.acceptance,
        description: row.description,
        examples: row.examples,
        hints: row.hints,
        initialCode: row["initialCode"],
        correctAnswers: row["correctAnswers"],
        testCases: row["testCases"],
        functionName: row["functionName"]
      };
    } else {
      problem = {
        ...row,
        examples: JSON.parse(row.examples),
        hints: JSON.parse(row.hints),
        correctAnswers: JSON.parse(row.correctAnswers),
        testCases: JSON.parse(row.testCases)
      };
    }
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
        'INSERT INTO submissions ("problemId", code, status) VALUES ($1, $2, $3) RETURNING *',
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
