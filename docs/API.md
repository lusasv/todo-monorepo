# API Specification

## Base URL

Development: `http://localhost:4000`
Frontend proxy: `/api` (proxied to backend in vite.config.ts)

## Authentication Endpoints

### POST /auth/register

Create a new user account.

**Request**
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Parameters**
| Field    | Type   | Required | Description         |
|----------|--------|----------|----------------------|
| email    | string | Yes      | Unique user email    |
| password | string | Yes      | Plain-text password  |
| name     | string | No       | User display name    |

**Response (201 Created)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors**
| Status | Error Message                | Cause                          |
|--------|------------------------------|--------------------------------|
| 400    | "email and password are required" | Missing email or password   |
| 400    | "email already exists"       | Email already registered       |

---

### POST /auth/login

Authenticate user and receive JWT token.

**Request**
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Parameters**
| Field    | Type   | Required | Description        |
|----------|--------|----------|--------------------|
| email    | string | Yes      | Registered email   |
| password | string | Yes      | Account password   |

**Response (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors**
| Status | Error Message                | Cause                          |
|--------|------------------------------|--------------------------------|
| 400    | "email and password are required" | Missing email or password   |
| 401    | "user not found"             | No account with this email     |
| 401    | "invalid password"           | Incorrect password             |

---

## Task Endpoints

All task endpoints require Authorization header with JWT token:
```
Authorization: Bearer <token>
```

### GET /tasks

Fetch all tasks (optionally filtered by completion status).

**Request**
```
GET /tasks?completed=true
Authorization: Bearer <token>
```

**Query Parameters**
| Parameter | Type    | Description                          |
|-----------|---------|--------------------------------------|
| completed | boolean | Filter by completion status (optional) |

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "title": "Learn React",
    "description": "Complete React tutorial",
    "dueDate": "2026-05-01T00:00:00Z",
    "completed": false,
    "createdAt": "2026-04-22T10:30:00Z",
    "updatedAt": "2026-04-22T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Deploy app",
    "description": null,
    "dueDate": null,
    "completed": true,
    "createdAt": "2026-04-20T14:15:00Z",
    "updatedAt": "2026-04-21T09:45:00Z"
  }
]
```

---

### POST /tasks

Create a new task.

**Request**
```
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-04-25T18:00:00Z"
}
```

**Parameters**
| Field       | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| title       | string | Yes      | Task title (non-empty)         |
| description | string | No       | Task description               |
| dueDate     | string | No       | ISO 8601 date string          |

**Response (201 Created)**
```json
{
  "id": 3,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-04-25T18:00:00Z",
  "completed": false,
  "createdAt": "2026-04-22T11:20:00Z",
  "updatedAt": "2026-04-22T11:20:00Z"
}
```

**Errors**
| Status | Error Message                                       | Cause                      |
|--------|-----------------------------------------------------|----------------------------|
| 400    | "title is required and must be a non-empty string" | Missing or empty title     |
| 400    | "description must be a string"                      | description not a string   |
| 400    | "dueDate must be a valid date"                      | Invalid date format        |

---

### GET /tasks/:id

Fetch a single task by ID.

**Request**
```
GET /tasks/1
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "id": 1,
  "title": "Learn React",
  "description": "Complete React tutorial",
  "dueDate": "2026-05-01T00:00:00Z",
  "completed": false,
  "createdAt": "2026-04-22T10:30:00Z",
  "updatedAt": "2026-04-22T10:30:00Z"
}
```

**Errors**
| Status | Error Message | Cause              |
|--------|---------------|--------------------|
| 404    | "not found"   | Task ID not found  |

---

### PUT /tasks/:id

Update a task.

**Request**
```
PUT /tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Complete TypeScript advanced course",
  "dueDate": "2026-05-15T00:00:00Z",
  "completed": true
}
```

**Parameters**
| Field       | Type    | Required | Description                    |
|-------------|---------|----------|--------------------------------|
| title       | string  | No       | Updated title                  |
| description | string  | No       | Updated description            |
| dueDate     | string  | No       | Updated due date (ISO 8601)   |
| completed   | boolean | No       | Mark task as complete/incomplete |

**Response (200 OK)**
```json
{
  "id": 1,
  "title": "Learn TypeScript",
  "description": "Complete TypeScript advanced course",
  "dueDate": "2026-05-15T00:00:00Z",
  "completed": true,
  "createdAt": "2026-04-22T10:30:00Z",
  "updatedAt": "2026-04-22T12:45:00Z"
}
```

**Errors**
| Status | Error Message | Cause             |
|--------|---------------|-------------------|
| 404    | "not found"   | Task ID not found |

---

### DELETE /tasks/:id

Delete a task.

**Request**
```
DELETE /tasks/1
Authorization: Bearer <token>
```

**Response (204 No Content)**
```
(empty body)
```

**Errors**
| Status | Error Message | Cause             |
|--------|---------------|-------------------|
| 404    | "not found"   | Task ID not found |

---

## Error Response Format

All error responses follow this structure:
```json
{
  "error": "error-key"
}
```

The frontend converts these error keys to user-friendly Portuguese messages via `mapBackendError()` function.

---

## Token Format

JWT tokens use HS256 algorithm with the following payload:
```json
{
  "userId": 1,
  "iat": 1713787200,
  "exp": 1714392000
}
```

- **iat**: Issued at (Unix timestamp)
- **exp**: Expires at (Unix timestamp, 7 days from issue)

---

## CORS

All endpoints accept cross-origin requests with CORS enabled. Frontend can call endpoints from different origins.

Allowed headers:
- Content-Type
- Authorization
