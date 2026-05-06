# GitHub Template Setup

This project is a template for full-stack React + TypeScript + Express + Database apps!

## What's Included
- ✅ React + TypeScript + Vite frontend
- ✅ Express backend
- ✅ Dual database support (SQLite local, Neon/PostgreSQL production)
- ✅ Nodemon for backend hot reload
- ✅ Health check endpoints
- ✅ VS Code tasks
- ✅ GitHub Pages workflow
- ✅ Vercel deployment config
- ✅ Dotenv for environment variables

## How to Use This Template

### 1. Create Your Project from Template
1. Go to https://github.com/Kawaii2025/gap-code
2. Click "Use this template" → "Create a new repository"

### 2. Customize Your Project
1. Update `package.json` name/version
2. Update `README.md` with your project info
3. Replace `data/problems.js` with your own seed data
4. Update `src/` with your own frontend code
5. Update `server.js`/`db.js` with your own API routes
6. Update `.env.example` with your required env vars

### 3. Set Up Environment
1. Copy `.env.example` to `.env`
2. Set your database URL (if using Neon/PostgreSQL)
3. Set `LOCAL_SQLITE=true` for local dev

### 4. Start Developing!
```bash
npm install
./reload-db.sh
npm run dev:full
```

## Project Structure
```
/
├── src/          # Frontend code (React + TypeScript)
├── data/         # Seed data
├── server.js     # Backend API
├── db.js         # Database setup
├── vercel.json   # Vercel deployment config
├── .github/      # GitHub workflows
└── .vscode/      # VS Code tasks
```

## Key Configuration Files
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variable template
- `vercel.json` - Vercel deployment config
- `nodemon.json` - Nodemon watch config
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite config
