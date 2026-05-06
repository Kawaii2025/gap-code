# GapCode - 填空式算法刷题平台 (GitHub Template)

This is a full-stack React + TypeScript + Vite + Express project with dual database support (SQLite for local, Neon/PostgreSQL for production)!

**This repo is a GitHub Template! Click "Use this template" to start your own project!**

See `TEMPLATE_SETUP.md` for detailed instructions on how to use this template!

## Key Points to Remember
- **Local Development**: Uses SQLite, set `LOCAL_SQLITE=true` in `.env`
- **Sync to Neon**: Run `node sync-to-neon.js` or use VS Code task "sync to neon"
- **Reload DB**: Run `./reload-db.sh` or use VS Code task "reload db"
- **Production**: Deploy backend to Vercel/Railway and set `DATABASE_URL` without `LOCAL_SQLITE=true`

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `DATABASE_URL` to your Neon connection string
3. Set `LOCAL_SQLITE=true` to use SQLite locally

### 3. Reload DB
```bash
./reload-db.sh
```

### 4. Start development
```bash
npm run dev:full
```

This starts both backend (port 4000) and frontend (port 5173)

## Build
```bash
npm run build
```

## Features
- Problem list page
- Solve page with Monaco code editor
- Light/Dark theme toggle
- Simple judge logic
- Backend API with dual database support (SQLite for local, Neon/PostgreSQL for production)
- Health check endpoint at `/api/health`
- VS Code tasks for common operations

## Database
### Local (SQLite)
Set `LOCAL_SQLITE=true` in `.env`, the DB file is `problems.db`

### Production (Neon)
Set `DATABASE_URL` without `LOCAL_SQLITE=true`

### Sync local to Neon
```bash
node sync-to-neon.js
```

## VS Code Tasks
- `npm: dev` - Start frontend dev server
- `npm: dev:full` - Start both frontend + backend
- `npm: build` - Build production
- `reload db` - Reload local database from seed data
- `sync to neon` - Sync local data to Neon database

