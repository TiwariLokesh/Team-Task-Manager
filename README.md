# Team Task Manager

A full-stack task management app with role-based access, JWT authentication, and a modern dashboard UI.

## Features
- JWT authentication with bcrypt password hashing
- Admin and Member roles with permission checks
- Project and task management with Kanban-style board
- Dashboard API with task metrics
- Tailwind CSS UI with responsive layout
- MySQL schema with foreign keys

## Project Structure
- frontend: React (Vite) + Tailwind CSS
- backend: Node.js + Express.js + MySQL

## Setup

### 1) Database
1. Create a MySQL database named team_task_manager.
2. Run the SQL in backend/sql/schema.sql to create tables.

### 2) Backend
1. Copy backend/.env.example to backend/.env and fill in values.
2. Install dependencies:
   - cd backend
   - npm install
3. Start the API server:
   - npm run dev

### 3) Frontend
1. Copy frontend/.env.example to frontend/.env and update the API URL if needed.
2. Install dependencies:
   - cd frontend
   - npm install
3. Start the frontend:
   - npm run dev

## Environment Variables

### Backend (.env)
- PORT
- NODE_ENV
- JWT_SECRET
- FRONTEND_URL
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_PORT

### Frontend (.env)
- VITE_API_BASE_URL

## Deployment (Railway)
1. Create a MySQL service in Railway and note the connection values.
2. Create a backend service and set the backend environment variables.
3. Create a frontend service and set VITE_API_BASE_URL to the backend URL.
4. Update FRONTEND_URL on the backend to match the frontend URL.
5. Deploy both services.

## API Overview
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- POST /api/projects/:projectId/members
- DELETE /api/projects/:projectId/members/:userId
- GET /api/projects/:projectId/members
- GET /api/tasks
- POST /api/tasks
- PATCH /api/tasks/:taskId/status
- GET /api/dashboard
