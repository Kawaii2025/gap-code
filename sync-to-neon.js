import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if DATABASE_URL is set for Neon
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set in .env file! Please set it to your Neon connection string.');
  process.exit(1);
}

// Check if problems.db exists
const dbPath = join(__dirname, 'problems.db');
const fs = await import('fs');
if (!fs.existsSync(dbPath)) {
  console.error('Local SQLite database (problems.db) not found! Please run the backend locally first to create it.');
  process.exit(1);
}

console.log('Syncing local SQLite data to Neon (PostgreSQL)...');

// Connect to local SQLite
const sqliteDb = new sqlite3.Database(dbPath);

// Connect to Neon
const neonPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

try {
  // Read problems from SQLite
  const sqliteProblems = await new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM problems', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  // Read submissions from SQLite
  const sqliteSubmissions = await new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM submissions', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  console.log(`Found ${sqliteProblems.length} problems and ${sqliteSubmissions.length} submissions in local SQLite.`);

  // Clear existing data in Neon
  console.log('Clearing existing data in Neon...');
  await neonPool.query('DELETE FROM submissions');
  await neonPool.query('DELETE FROM problems');

  // Reset sequences in Neon
  await neonPool.query('ALTER SEQUENCE problems_id_seq RESTART WITH 1');
  await neonPool.query('ALTER SEQUENCE submissions_id_seq RESTART WITH 1');

  // Insert problems into Neon
  console.log('Inserting problems into Neon...');
  for (const problem of sqliteProblems) {
    await neonPool.query(
      `INSERT INTO problems (
        id, title, difficulty, acceptance, description, 
        examples, hints, "initialCode", "correctAnswers", "testCases", "functionName"
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9::jsonb, $10::jsonb, $11)`,
      [
        problem.id,
        problem.title,
        problem.difficulty,
        problem.acceptance,
        problem.description,
        problem.examples, // Already JSON string
        problem.hints, // Already JSON string
        problem.initialCode,
        problem.correctAnswers, // Already JSON string
        problem.testCases, // Already JSON string
        problem.functionName
      ]
    );
  }

  // Insert submissions into Neon
  console.log('Inserting submissions into Neon...');
  for (const submission of sqliteSubmissions) {
    await neonPool.query(
      `INSERT INTO submissions (id, "problemId", code, status, "createdAt") VALUES ($1, $2, $3, $4, $5)`,
      [
        submission.id,
        submission.problemId,
        submission.code,
        submission.status,
        submission.createdAt
      ]
    );
  }

  console.log('Sync complete!');
} catch (err) {
  console.error('Error syncing data:', err);
} finally {
  // Close connections
  sqliteDb.close();
  await neonPool.end();
}
