# Todo App (Monorepo)

This repository contains a simple Todo application with a backend API (Node + Express + TypeScript) and a frontend (React + Vite + TypeScript).

Structure:

- backend/ - API server
- frontend/ - React app

See each subfolder for install and run instructions.

Quick start

1. Backend
   - cd backend
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm run dev

With the frontend proxy configured, the React app will call the backend at /api.

Notes

- This is a minimal scaffold. You can replace Prisma with another ORM or raw SQLite if desired.
