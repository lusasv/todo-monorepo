# System Architecture

## Overview

Todo App is a full-stack, single-page application (SPA) with a RESTful API backend and a modern React frontend. The application follows a monorepo structure with clear separation of concerns between backend and frontend layers.

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          React App (frontend/)                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  App.tsx      LoginForm.tsx        main.tsx  │   │   │
│  │  │  (Dashboard)  (Auth UI)            (Entry)   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓ HTTP (Axios)                     │
│         /api/* → [Vite Proxy] → http://localhost:4000      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Node.js Backend (backend/)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Server (port 4000)                         │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Auth Routes:          Task Routes:          │   │   │
│  │  │  - POST /auth/register - GET /tasks          │   │   │
│  │  │  - POST /auth/login    - POST /tasks         │   │   │
│  │  │                        - GET /tasks/:id      │   │   │
│  │  │                        - PUT /tasks/:id      │   │   │
│  │  │                        - DELETE /tasks/:id   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └────────────────────────┬────────────────────────────┘   │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Prisma ORM (Data Access Layer)                     │    │
│  │  - User model  → migrations → dev.db               │    │
│  │  - Task model                                      │    │
│  └────────────────────────┬────────────────────────────┘    │
└──────────────────────────┼────────────────────────────────────┘
                           ↓
                 ┌──────────────────┐
                 │  SQLite Database │
                 │   (dev.db)       │
                 └──────────────────┘
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v4.18.2
- **Language:** TypeScript v5.2.2
- **ORM:** Prisma v5.0.0
- **Database:** SQLite (development)
- **Authentication:** JWT (jsonwebtoken ^9.0.3)
- **Password Hashing:** bcrypt v6.0.0
- **CORS:** cors v2.8.5
- **Testing:** Vitest v1.0.0, Supertest v6.3.4

### Frontend
- **Framework:** React v18.2.0
- **Build Tool:** Vite v5.0.0
- **Language:** TypeScript v5.2.2
- **HTTP Client:** Axios v1.4.0
- **Icons:** Lucide React v0.577.0
- **Testing:** Playwright v1.58.2

### DevOps & Monorepo
- **Package Manager:** npm v8+
- **Monorepo:** npm workspaces
- **Parallel Execution:** concurrently v8.2.0
- **E2E Testing:** Playwright v1.58.2

---

## Layers & Components

### 1. Backend Architecture

#### Entry Point (`src/index.ts` & `src/server.ts`)
```
server.ts (main entry)
    ↓
    index.ts (app definition)
        ├── CORS middleware
        ├── JSON parser middleware
        └── Route handlers
            ├── GET /health
            ├── POST /auth/register
            ├── POST /auth/login
            ├── GET /tasks
            ├── POST /tasks
            ├── GET /tasks/:id
            ├── PUT /tasks/:id
            └── DELETE /tasks/:id
```

#### Request Flow for Task Operations
```
HTTP Request
    ↓
Express Router (route matching)
    ↓
Route Handler (req, res)
    ├── Input Validation
    │   └── Check required fields, format, type
    ├── Database Operation (Prisma)
    │   └── Create/Read/Update/Delete
    └── Response
        ├── 200/201 - Success
        ├── 400 - Validation Error
        ├── 401 - Auth Error
        └── 404 - Not Found
```

#### Authentication Flow
```
User provides email + password
    ↓
bcrypt.compare() - Hash verification
    ↓
JWT Signing (exp: 7 days)
    ↓
Token returned to client
    ↓
Client stores in localStorage
    ↓
All subsequent requests: Authorization: Bearer <token>
```

**Note:** Currently, tokens are NOT validated on protected routes. This is a security gap that needs to be addressed.

#### Database Layer (Prisma)

**User Model**
```
User {
  id:        Int       @id @default(autoincrement())
  email:     String    @unique
  password:  String    (bcrypt hashed)
  name:      String?
  createdAt: DateTime  @default(now())
}
```

**Task Model**
```
Task {
  id:          Int       @id @default(autoincrement())
  title:       String    (required)
  description: String?
  dueDate:     DateTime?
  completed:   Boolean   @default(false)
  createdAt:   DateTime  @default(now())
}
```

**CRITICAL GAP:** No `userId` field in Task model. This means:
- All tasks are shared across all users
- No data isolation
- Production blocker

---

### 2. Frontend Architecture

#### Component Hierarchy
```
App.tsx (root)
├── <LoginForm /> (if no token)
│   ├── Email input
│   ├── Password input + toggle
│   ├── Name input (registration only)
│   ├── Error messages
│   ├── Submit button (login/register toggle)
│   └── Styling (CSS-in-JS)
│
└── Dashboard (if token exists)
    ├── Header (user info + logout)
    ├── Task form (add new task)
    └── Task list
```

#### State Management
```
App.tsx maintains:
├── tasks: Task[]           (fetched from API)
├── title: string           (form input)
├── user: User | null       (logged-in user)
└── token: string | null    (JWT from localStorage)

LoginForm maintains:
├── email: string
├── password: string
├── name: string
├── showPassword: boolean   (password visibility toggle)
├── loading: boolean        (request in-flight)
├── error: string           (form-level error)
├── emailError: string      (field-level error)
└── passwordError: string   (field-level error)
```

#### Data Flow
```
User Input (email/password)
    ↓
Client-side Validation
    ├── Email format check (regex)
    └── Required field check
    ↓
HTTP POST to /auth/login or /auth/register
    ├── Error → Display mapped error message
    └── Success → Store token + set user
        ↓
        localStorage.setItem('token', token)
        ↓
        Fetch tasks with Authorization header
        ↓
        Display task list
```

#### Responsive Breakpoints
```
Mobile (< 768px)
├── Full-width card
├── Padding: 16px
└── No shadow

Tablet (768px - 1023px)
├── Max-width: 420px
├── Centered
└── Minimal shadow

Desktop (>= 1024px)
├── Max-width: 400px
├── Centered
└── Full shadow
```

---

## API Contract

### Authentication Endpoints

#### POST /auth/register
Creates a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"  // optional
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `400` - Email already exists (duplicate)

#### POST /auth/login
Authenticates a user and returns JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - User not found
- `401` - Invalid password

### Task Endpoints

#### GET /tasks
Lists all tasks (currently no user filtering).

**Query Parameters:**
- `completed` (optional): "true" or "false" to filter by status

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Learn TypeScript",
    "description": "Complete the TypeScript handbook",
    "dueDate": "2026-04-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2026-03-31T10:30:00.000Z"
  }
]
```

#### POST /tasks
Creates a new task.

**Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-04-01T18:00:00Z"  // optional
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-04-01T18:00:00.000Z",
  "completed": false,
  "createdAt": "2026-03-31T10:30:00.000Z"
}
```

**Errors:**
- `400` - Title is required or invalid

#### GET /tasks/:id
Retrieves a single task.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Buy groceries",
  ...
}
```

**Errors:**
- `404` - Task not found

#### PUT /tasks/:id
Updates a task.

**Request:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-04-01T18:00:00Z",
  "completed": true
}
```

**Response (200 OK):** Updated task object

**Errors:**
- `404` - Task not found

#### DELETE /tasks/:id
Deletes a task.

**Response (204 No Content)**

**Errors:**
- `404` - Task not found

---

## Data Flow Diagrams

### User Registration Flow
```
1. User enters credentials on LoginForm
           ↓
2. Frontend validates (email format, required fields)
           ↓
3. POST /auth/register
           ↓
4. Backend: Hash password with bcrypt
           ↓
5. Backend: Create user in database
           ↓
6. Backend: Sign JWT token (exp 7d)
           ↓
7. Response with token + user object
           ↓
8. Frontend: Store token in localStorage
           ↓
9. Frontend: Render task dashboard
```

### Task Creation Flow
```
1. User types task title + clicks Add
           ↓
2. Frontend validates (title required)
           ↓
3. POST /tasks with Authorization header
           ↓
4. Backend: Create task in database
           ↓
5. Response with task ID + metadata
           ↓
6. Frontend: Add task to local state
           ↓
7. Frontend: Re-fetch task list
           ↓
8. Display updated list to user
```

---

## Monorepo Structure

### npm Workspaces Configuration
```
package.json (root)
{
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "concurrently \"npm -w backend run dev\" \"npm -w frontend run dev\""
  }
}
```

### Development Workflow
```
npm install
  └── Installs dependencies for both backend and frontend

npm run dev
  ├── Backend: ts-node-dev src/index.ts (watches for changes)
  │   └── Port 4000
  └── Frontend: Vite dev server
      └── Port 5173
      └── Proxies /api/* to backend

npm -w backend test
  └── Runs backend unit tests (Vitest)

npm -w frontend build
  └── Builds production-ready React bundle
```

---

## Testing Strategy

### Backend Testing (Vitest)
```
Unit Tests (app.test.ts)
├── Health check endpoint
├── Task CRUD operations
│   ├── Create task (valid/invalid)
│   ├── Get all tasks
│   └── Error handling
└── Authentication
    ├── Register (success/duplicate email)
    ├── Login (valid/invalid credentials)
    └── Error messages
```

### Frontend Testing (Playwright E2E)
```
E2E Tests (login.spec.ts)
├── Login page loads
├── Register new user
├── Successful login flow (token stored)
├── Validation errors
│   ├── Email required/invalid format
│   ├── Password required
│   └── Backend error mapping
├── Password toggle
├── Loading states
└── Multi-viewport testing (375px/768px/1280px)
```

---

## Security Architecture

### Current Security Measures
1. **Password Hashing:** bcrypt with 10 salt rounds
2. **JWT Tokens:** Signed with secret key, 7-day expiry
3. **CORS:** Enabled for cross-origin requests
4. **Input Validation:** Email format, required fields

### Security Gaps (MUST FIX)

#### 1. No Task Authorization
**Problem:** Any user can access any task via direct API calls
```
GET /tasks        → Returns ALL tasks (no filtering)
PUT /tasks/:id    → Can update ANY task (no ownership check)
DELETE /tasks/:id → Can delete ANY task (no ownership check)
```

**Solution:**
- Add `userId` to Task model
- Add authorization middleware
- Filter tasks by `req.user.id`

#### 2. No Token Validation
**Problem:** Task endpoints don't validate JWT tokens
**Solution:**
- Create auth middleware
- Verify JWT on protected routes
- Extract user ID from token

#### 3. No Rate Limiting
**Problem:** No protection against brute force or DoS
**Solution:** Use `express-rate-limit` middleware

#### 4. Hard-coded JWT Secret
**Problem:** Falls back to `"secret-key-change-in-production"`
**Solution:** Require `JWT_SECRET` environment variable

---

## Deployment Considerations

### Current State (Development Only)
```
Local Machine
├── Backend (ts-node, hot reload)
├── Frontend (Vite, hot reload)
└── SQLite dev database
```

### Production Requirements

#### Database
- [ ] Migrate to PostgreSQL or MySQL
- [ ] Set up managed database service (AWS RDS, etc.)
- [ ] Implement database backups
- [ ] Plan migration strategy

#### Backend
- [ ] Build TypeScript to JavaScript
- [ ] Configure environment variables
- [ ] Set up error logging/monitoring
- [ ] Implement rate limiting
- [ ] Add auth middleware
- [ ] Optimize for production

#### Frontend
- [ ] Build with `vite build`
- [ ] Configure API base URL for production
- [ ] Set up CDN for static assets
- [ ] Implement analytics

#### DevOps
- [ ] Containerize with Docker
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring and alerts
- [ ] Plan scaling strategy

---

## Future Architecture Considerations

### 1. Microservices Transition
```
Current:          Future:
┌──────┐         ┌────────────┐
│Frontend│        │Auth Service│
└──────┘         └────────────┘
  ↓                 ↓
┌──────┐         ┌────────────┐
│Backend│  →    │Task Service│
└──────┘         └────────────┘
  ↓                 ↓
┌──────┐         ┌────────────┐
│SQLite│        │Shared DB│
└──────┘         └────────────┘
```

### 2. Real-time Updates (WebSockets)
```
Frontend (React + Socket.io)
      ↔️ WebSocket connection
Backend (Express + Socket.io)
      ↓ Broadcast to connected clients
```

### 3. Offline Support (Service Workers)
```
Service Worker
├── Cache API endpoints
├── Sync queue
└── Background sync
```

### 4. Mobile App
```
React Native App
      ↓ Same API
Backend (unchanged)
```

---

## Performance Optimization Notes

### Current Bottlenecks
1. No pagination on task list (N+1 problem possible)
2. No database indexing beyond primary keys
3. Entire task list fetched on every page load
4. No caching strategy

### Recommended Optimizations
1. **Pagination:** Implement cursor-based or offset pagination
2. **Indexing:** Add database indexes on `userId` (once added), `createdAt`
3. **Caching:** Implement Redis for session/token caching
4. **API:** Add response compression, ETag support
5. **Frontend:** Implement code splitting, lazy loading

---

## Maintenance & Support

### Dependency Management
- Node.js LTS recommended
- npm security audits: `npm audit`
- Regular dependency updates via `npm update`

### Database Maintenance
- Prisma migration versioning
- Database backups required
- Growth monitoring for SQLite (migrate to SQL DB at scale)

### Monitoring
- No current logging infrastructure
- Recommendation: Winston or Pino for structured logs
- Error tracking: Sentry recommended

---

## References

- **Repository:** Monorepo at root with backend/ and frontend/ workspaces
- **Migrations:** Located in backend/prisma/migrations/
- **Tests:** backend/test/ and e2e/
- **Configuration:** vite.config.ts, playwright.config.ts, tsconfig.json

---

**Last Updated:** 2026-03-31
**Document Type:** Architecture Overview
**Status:** Living document - updated as architecture evolves
