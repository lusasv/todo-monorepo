# API Reference

## Existing Endpoints

### Auth

#### POST /auth/register
- **Body:** `{ email: string, password: string, name?: string }`
- **Response 201:** `{ token: string, user: { id, email, name } }`
- **Response 400:** `{ error: string }` (missing fields or email already exists)

#### POST /auth/login
- **Body:** `{ email: string, password: string }`
- **Response 200:** `{ token: string, user: { id, email, name } }`
- **Response 400:** `{ error: string }` (missing fields)
- **Response 401:** `{ error: string }` (user not found or invalid password)

### Tasks

#### GET /tasks
- **Query params:** `completed=true|false` (optional)
- **Response 200:** `Array<{ id, title, description, dueDate, completed, createdAt }>`

#### POST /tasks
- **Body:** `{ title: string, description?: string, dueDate?: string }`
- **Response 201:** `{ id, title, description, dueDate, completed, createdAt }`
- **Response 400:** `{ error: string }` (invalid fields)

#### GET /tasks/:id
- **Response 200:** `{ id, title, description, dueDate, completed, createdAt }`
- **Response 404:** `{ error: "not found" }`

#### PUT /tasks/:id
- **Body:** `{ title?: string, description?: string, dueDate?: string, completed?: boolean }`
- **Response 200:** `{ id, title, description, dueDate, completed, createdAt }`
- **Response 404:** `{ error: "not found" }`

#### DELETE /tasks/:id
- **Response 204:** (no body)
- **Response 404:** `{ error: "not found" }`

### Health

#### GET /health
- **Response 200:** `{ status: "ok" }`

---

## Frontend Routes

### /tela — Exemplar Todo Screen
- **Component:** `frontend/src/components/TelaExemplar.tsx`
- **Access:** Public (no authentication required)
- **Backend Calls:** None
- **Data Source:** Hardcoded mock data (5 example todos)
- **Features:**
  - Progress bar showing completion percentage
  - Task list with title, description, and status badges
  - Visual feedback for completed tasks
  - Responsive mobile-optimized layout
  - Back button to home page

This is a frontend-only demonstration screen added in US-7. No API endpoints are consumed.
