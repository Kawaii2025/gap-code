import 'dotenv/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export let isPostgres = false
export let db

async function initialize() {
  if (process.env.DATABASE_URL && process.env.LOCAL_SQLITE !== 'true') {
    const { Pool } = await import('pg')
    isPostgres = true
    db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
    
    console.log('Connected to Neon (PostgreSQL) database')
    await initializePostgresDatabase()
  } else {
    const sqlite3 = (await import('sqlite3')).default
    const dbPath = join(__dirname, 'data.db')
    isPostgres = false
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening SQLite database:', err.message)
      } else {
        console.log('Connected to SQLite database')
        initializeSqliteDatabase()
      }
    })
  }
}

async function initializePostgresDatabase() {
  // Add your Postgres table creation here!
  // Example:
  // await db.query(`
  //   CREATE TABLE IF NOT EXISTS items (
  //     id SERIAL PRIMARY KEY,
  //     name TEXT NOT NULL
  //   )
  // `)
  console.log('Postgres database initialized!')
  await seedDatabase()
}

function initializeSqliteDatabase() {
  db.serialize(() => {
    // Add your SQLite table creation here!
    // Example:
    // db.run(`
    //   CREATE TABLE IF NOT EXISTS items (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     name TEXT NOT NULL
    //   )
    // `)
    console.log('SQLite database initialized!')
    seedDatabase()
  })
}

export async function seedDatabase() {
  // Add your seed logic here!
  console.log('Database seeded!')
}

// Database helper functions
export async function query(sql, params = []) {
  if (isPostgres) {
    const result = await db.query(sql, params)
    return result.rows
  } else {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }
}

export async function get(sql, params = []) {
  if (isPostgres) {
    const result = await db.query(sql, params)
    return result.rows[0]
  } else {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }
}

export async function run(sql, params = []) {
  if (isPostgres) {
    await db.query(sql, params)
  } else {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }
}

initialize()
