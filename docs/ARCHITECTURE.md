# Architecture Overview

## System Overview

This is a monorepo containing a full-stack todo application with:
- **Backend:** Node.js/Express API with JWT authentication
- **Frontend:** React + TypeScript SPA with Vite

The system manages user accounts, todo tasks with descriptions and due dates, and includes an exemplar demo screen.

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React + TS)              │
│  ┌──────────────────────────────────────────┐  │
│  │ App.tsx (Route Guard)                    │  │
│  │ ├─ /             → LoginForm / TodoList  │  │
│  │ └─ /tela         → TelaExemplar (Demo)   │  │
│  └──────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────┘
               │ HTTP/REST (axios)
               │ JWT Bearer tokens
┌──────────────▼──────────────────────────────────┐
│         Backend (Node.js/Express)               │
│  ┌──────────────────────────────────────────┐  │
│  │ Authentication Routes (/auth/*)          │  │
│  │ Task Routes (/tasks/*)                   │  │
│  │ Health Check (/health)                   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Frontend Components

### App.tsx
Main application entry point. Implements route-based conditional rendering using `window.location.pathname`.

- **Route Guard Logic:**
  - `/tela` → renders `TelaExemplar` component
  - All other paths → renders login or main todo interface
- **State Management:** Uses React hooks (useState, useEffect) for tasks, auth token, and user info
- **Authentication:** Token stored in localStorage; removed on logout

### TelaExemplar.tsx
Demo/exemplar screen showcasing a polished todo list UI with mock data.

**Characteristics:**
- No API calls or backend dependency
- Self-contained with hardcoded mock data (5 example todos)
- Comprehensive CSS-in-JS styling (no external dependencies)
- Features:
  - Progress bar (completed vs total tasks)
  - Task items with title, description, status badge
  - Completed tasks show visual feedback (strikethrough, green highlight)
  - Responsive design (mobile-optimized with media queries)
  - Back button navigation to `/` (home)

**Mock Data Structure:**
```typescript
type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};
```

### LoginForm.tsx
Authentication form component (existing). Handles login/register with JWT token exchange.

## Backend API Structure

See `/docs/API.md` for full endpoint documentation.

**Main Endpoint Groups:**
- `/auth/*` — User registration and login
- `/tasks/*` — CRUD operations on user tasks
- `/health` — Service health check

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  name: string | null;
}
```

### Task
```typescript
{
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt?: string;
}
```

## Authentication Flow

1. User registers or logs in via `LoginForm`
2. Backend validates credentials and returns JWT token
3. Token stored in browser localStorage
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. On logout, token removed from localStorage and in-memory state cleared

## Routing Strategy

### Frontend Routing (Client-side)
- Implemented using `window.location.pathname` check in `App.tsx`
- Deterministic route guard at component render level
- No external router library (simple guard sufficient for current use cases)

### Route Map
| Path | Component | Purpose |
|------|-----------|---------|
| `/` | LoginForm / TodoList | Main authenticated todo interface |
| `/tela` | TelaExemplar | Demo/exemplar screen (no auth required) |

## Styling Approach

### Frontend
- **App.tsx + LoginForm.tsx:** Inline styles with React style objects
- **TelaExemplar.tsx:** CSS-in-JS via `<style>` tag with scoped class names
  - Uses BEM-like naming (`.tela-*` prefix)
  - Custom properties for colors, spacing
  - Gradient backgrounds (purple/blue theme)
  - Flexbox-based responsive layout
  - Media queries for mobile optimization

## State Management

### Frontend
- **React hooks only** (no Redux, Zustand, etc.)
- **App.tsx holds:**
  - `tasks`: array of Task objects
  - `token`: JWT token (localStorage-backed)
  - `user`: authenticated user info
  - `title`: form input for new tasks
- **TelaExemplar.tsx:** All state local (computed completed count, rendering logic)

## Authentication & Security

- JWT tokens stored in browser localStorage
- All API requests require valid token in `Authorization` header
- Backend validates token on each protected endpoint
- No sensitive data stored on frontend except token

## Development Workflow

The monorepo is managed via a squad workflow:
1. PO (Product Owner) — requirements
2. Spec Writer — technical specifications
3. Backend — API/server implementation
4. QA — testing and validation
5. Documentation Writer — (this step) documentation updates
6. PR — code review and merge

Each role commits to feature branches (`feature/*`, `us-*`) and merges via PR.

## File Organization

```
project-root/
├── backend/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── LoginForm.tsx
│   │   ├── main.tsx
│   │   └── components/
│   │       └── TelaExemplar.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/
│   ├── ARCHITECTURE.md (this file)
│   ├── API.md
│   ├── DECISIONS.md
│   └── CONVENTIONS.md
└── CLAUDE.md (squad workflow instructions)
```

## Future Considerations

- **Routing:** Migrate to React Router when route complexity increases
- **State Management:** Consider global state library if prop drilling becomes problematic
- **Styling:** Consider CSS framework or CSS modules as styling complexity grows
- **Component Library:** Extract common patterns (buttons, cards, inputs) into reusable components
- **TelaExemplar:** Replace mock data with API calls when backend feature is complete
