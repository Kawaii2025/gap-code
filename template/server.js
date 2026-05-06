import express from 'express'
import cors from 'cors'
import { isPostgres, db, seedDatabase } from './db.js'

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
  })
}

// Root endpoint (health check)
app.get('/', healthCheck)

// Health check endpoint
app.get('/api/health', healthCheck)

// API Endpoints - Add your own routes here!
// Example:
// app.get('/api/items', async (req, res) => { ... })

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
