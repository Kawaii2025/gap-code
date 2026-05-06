import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { problems } from './data/problems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;
let isPostgres = false;

// Check if we should use PostgreSQL (Neon) or SQLite
if (process.env.DATABASE_URL) {
  const { Pool } = await import('pg');
  isPostgres = true;
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  console.log('Connected to Neon (PostgreSQL) database');
  await initializePostgresDatabase();
} else {
  const sqlite3 = (await import('sqlite3')).default;
  const dbPath = join(__dirname, 'problems.db');
  isPostgres = false;
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      initializeSqliteDatabase();
    }
  });
}

// Initialize SQLite database
function initializeSqliteDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      acceptance TEXT NOT NULL,
      description TEXT NOT NULL,
      examples TEXT NOT NULL,
      hints TEXT NOT NULL,
      initialCode TEXT NOT NULL,
      correctAnswers TEXT NOT NULL,
      testCases TEXT NOT NULL,
      functionName TEXT NOT NULL
    )`);

    db.get('SELECT COUNT(*) as count FROM problems', (err, row) => {
      if (err) {
        console.error('Error checking problems count:', err.message);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding problems (SQLite)...');
        seedSqliteProblems();
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problemId INTEGER NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (problemId) REFERENCES problems(id)
    )`);
  });
}

// Seed problems for SQLite
function seedSqliteProblems() {
  const insertStmt = db.prepare(`INSERT INTO problems (title, difficulty, acceptance, description, examples, hints, initialCode, correctAnswers, testCases, functionName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  problems.forEach(problem => {
    insertStmt.run(
      problem.title,
      problem.difficulty,
      problem.acceptance,
      problem.description,
      JSON.stringify(problem.examples),
      JSON.stringify(problem.hints),
      problem.initialCode,
      JSON.stringify(problem.correctAnswers),
      JSON.stringify(problem.testCases),
      problem.functionName
    );
  });

  insertStmt.finalize((err) => {
    if (err) {
      console.error('Error seeding problems (SQLite):', err.message);
    } else {
      console.log('Problems seeded successfully (SQLite)');
    }
  });
}

// Initialize PostgreSQL (Neon) database
async function initializePostgresDatabase() {
  await db.query(`CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    acceptance TEXT NOT NULL,
    description TEXT NOT NULL,
    examples JSONB NOT NULL,
    hints JSONB NOT NULL,
    initialCode TEXT NOT NULL,
    correctAnswers JSONB NOT NULL,
    testCases JSONB NOT NULL,
    functionName TEXT NOT NULL
  )`);

  const result = await db.query('SELECT COUNT(*) as count FROM problems');
  if (parseInt(result.rows[0].count) === 0) {
    console.log('Seeding problems (PostgreSQL)...');
    await seedPostgresProblems();
  }

  await db.query(`CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    problemId INTEGER NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problemId) REFERENCES problems(id)
  )`);
}

// Seed problems for PostgreSQL
async function seedPostgresProblems() {
  const insertQuery = `INSERT INTO problems (title, difficulty, acceptance, description, examples, hints, initialCode, correctAnswers, testCases, functionName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

  for (const problem of problems) {
    await db.query(insertQuery, [
      problem.title,
      problem.difficulty,
      problem.acceptance,
      problem.description,
      problem.examples,
      problem.hints,
      problem.initialCode,
      problem.correctAnswers,
      problem.testCases,
      problem.functionName
    ]);
  }

  console.log('Problems seeded successfully (PostgreSQL)');
}

// Helper function to execute queries (works for both databases)
async function query(sql, params = []) {
  if (isPostgres) {
    const result = await db.query(sql, params);
    return result.rows;
  } else {
    // SQLite implementation
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

// Helper function to get a single row
async function get(sql, params = []) {
  if (isPostgres) {
    const result = await db.query(sql, params);
    return result.rows[0] || null;
  } else {
    // SQLite implementation
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

// Helper function to run an INSERT and get the last inserted id
async function run(sql, params = []) {
  if (isPostgres) {
    const result = await db.query(sql, params);
    return result.rows[0];
  } else {
    // SQLite implementation
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
}

export { db, isPostgres, query, get, run };
