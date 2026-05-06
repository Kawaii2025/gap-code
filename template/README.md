# My Full-Stack App (GitHub Template)

This is a full-stack React + TypeScript + Vite + Express project with dual database support (SQLite for local, Neon/PostgreSQL for production)!

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

3. Start developing:
```bash
npm run dev:full
```

This runs both the backend (port 4000) and frontend (port 5173) with hot reload!

## Key Features
- ✅ React + TypeScript + Vite frontend
- ✅ Express backend
- ✅ Dual database support (SQLite local, Neon/PostgreSQL production)
- ✅ Nodemon for backend hot reload
- ✅ Health check endpoints
- ✅ VS Code tasks
- ✅ GitHub Pages workflow
- ✅ Vercel deployment config
- ✅ Dotenv for environment variables

## Project Structure
```
/
├── src/          # Frontend code
├── server.js     # Backend API
├── db.js         # Database setup
└── ... other configs
```
