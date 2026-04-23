# Architecture

## System Overview

This is a monorepo Todo application with three main layers:

```
┌─────────────────────────────────────────┐
│          Frontend (React + Vite)        │
│   - LoginForm.tsx (Auth UI)             │
│   - App.tsx (Task Management)           │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────┐
│    Backend (Express + TypeScript)       │
│   - /api/auth/* (Auth Endpoints)        │
│   - /api/tasks/* (Task CRUD)            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│    Database (Prisma + SQLite)           │
│   - User model (email, password)        │
│   - Task model (CRUD)                   │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### Components

#### LoginForm.tsx
- **Purpose**: Authentication UI (login/register)
- **Props**: `onAuthSuccess` callback with token and user data
- **State**:
  - Form state: email, password, name, showPassword
  - UI state: loading, error (form-level), emailError, passwordError (field-level)
  - Mode: isRegister (toggle between login/register)

#### App.tsx
- **Purpose**: Main application wrapper
- **Responsibilities**:
  - Token management and storage
  - Task list display and manipulation
  - User session handling
  - Routes between LoginForm (unauthenticated) and task UI (authenticated)

### Styling Approach

All styles are embedded in LoginForm.tsx using inline CSS-in-JS (`<style>` tag). This includes:
- Gradient background (purple: #667eea to #764ba2)
- Card-based layout with shadow effects
- Responsive breakpoints for mobile, tablet, desktop

### Responsive Design

Three breakpoints:
- **Mobile** (<768px): Full-width card, minimal padding, adjusted spacing
- **Tablet** (768-1023px): Wider card (max-width: 420px)
- **Desktop** (>=1024px): Standard card (max-width: 400px)

## Backend Architecture

### Routes

#### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user and return JWT

#### Tasks (CRUD)
- `GET /tasks` - Fetch all tasks (supports `completed` query param)
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Fetch single task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Security

- **JWT Authentication**: Tokens signed with HS256 algorithm
- **Password Hashing**: bcrypt with salt rounds = 10
- **CORS**: Enabled for cross-origin requests from frontend
- **Token Expiry**: 7 days

### Error Handling

Backend returns structured error responses:
```json
{ "error": "error-key" }
```

Frontend maps these errors to user-friendly messages via `mapBackendError()` function.

## Data Flow

### Login/Register Flow
```
1. User submits form
2. Client-side validation (email format, required fields)
3. Send POST to /auth/login or /auth/register
4. Backend validates, hashes password (register), checks credentials (login)
5. Backend returns JWT token + user object
6. Frontend stores token in localStorage
7. Frontend calls onAuthSuccess callback
8. App stores token and user state
```

### Task Management Flow
```
1. App component mounts with token from localStorage
2. Fetch tasks via GET /tasks (with Authorization header)
3. Display task list
4. User actions: add, update, delete tasks
5. Each action sends request with Bearer token
6. Backend validates JWT, performs operation
7. Frontend updates local state
```

## Token Storage

- **Location**: Browser `localStorage` key: "token"
- **Type**: JWT Bearer token
- **Lifespan**: 7 days (server-side) or until manual logout
- **Risk**: XSS vulnerability (stored in localStorage). Production should consider HttpOnly cookies.

## Database Models

### User
- id (PK)
- email (unique)
- password (hashed)
- name (optional)
- createdAt
- updatedAt

### Task
- id (PK)
- title (required)
- description (optional)
- dueDate (optional)
- completed (boolean, default false)
- userId (FK to User) - currently not enforced, backend doesn't filter by user
- createdAt
- updatedAt

## Current Limitations

1. Tasks endpoint doesn't enforce user isolation (no Authorization header checking)
2. Task endpoints don't filter tasks by authenticated user
3. Password reset functionality not implemented
4. Email verification not implemented
5. Frontend task UI is minimal (no styling improvements)
