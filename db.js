import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { problems } from './data/problems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'problems.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create problems table
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

    // Seed data if table is empty
    db.get('SELECT COUNT(*) as count FROM problems', (err, row) => {
      if (err) {
        console.error('Error checking problems count:', err.message);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding problems...');
        seedProblems();
      }
    });

    // Create submissions table
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

function seedProblems() {
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
      console.error('Error seeding problems:', err.message);
    } else {
      console.log('Problems seeded successfully');
    }
  });
}

export default db;
