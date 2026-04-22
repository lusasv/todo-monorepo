# Architecture

## System Overview

The todo-monorepo is a full-stack Todo application with a React frontend and Node/Express backend, using TypeScript across both layers.

```
todo-monorepo/
├── frontend/          React SPA with authentication
│   ├── src/
│   │   ├── App.tsx    Top-level routing and App container
│   │   ├── LoginForm.tsx
│   │   ├── components/
│   │   │   └── TelaExemplar.tsx    Example Todo screen (US-7)
├── backend/           Node/Express REST API
└── docs/              Project documentation
```

## Frontend Architecture

### Routing

Client-side routing is implemented via `window.location.pathname` checks in the top-level `App` component. No routing library is used to minimize external dependencies.

- **`/`** (default): Renders `TodoApp` (authenticated todo list interface)
- **`/tela`**: Renders `TelaExemplar` (example todo screen with mock data)

### Components

#### TelaExemplar (`frontend/src/components/TelaExemplar.tsx`)

Example todo list screen with hardcoded mock data. Demonstrates:

- **State Management**: Five mock Todo items (id, title, description, completed status) managed via React hooks (`useState`)
- **Filtering**: Three filter buttons (Todos/Pendentes/Concluidos) toggle between showing all, pending-only, or completed-only items
- **Progress Tracking**: Visual progress bar showing completed items count vs total count
- **UI Interactions**:
  - Click or keyboard (Enter/Space) to toggle completion status
  - Completed items show with strikethrough, reduced opacity, and green "Feito" badge
  - Pending items show yellow "Pendente" badge
- **Styling**: CSS-in-JS (inline `<style>` tag) with responsive breakpoints (mobile ≤767px, tablet 768–1023px, desktop ≥1024px)
- **Visual Design**: Purple gradient background (#667eea → #764ba2), consistent with existing LoginForm styling

#### TodoApp (`frontend/src/App.tsx` → `TodoApp` function)

Main authenticated todo interface. Handles:

- User authentication and token management via localStorage
- API calls to `/api/tasks` (GET, POST)
- Task list rendering with logout functionality

#### LoginForm (`frontend/src/LoginForm.tsx`)

Authentication UI. Not detailed here but uses similar CSS-in-JS gradient pattern.

## Backend Architecture

Express REST API with authentication and task management endpoints.

### Key Endpoints

See `docs/API.md` for complete endpoint reference.

## Data Models

### Todo (Frontend Mock)

```typescript
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
```

### Task (Backend)

```typescript
type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};
```

### User

```typescript
type User = {
  id: number;
  email: string;
  name: string | null;
};
```

## Design Patterns

### CSS-in-JS with Inline Styles

UI components use inline `<style>` tags for scoped CSS. This pattern is used in both `TelaExemplar` and `LoginForm` to ensure visual consistency and avoid external CSS file dependencies.

### Mock Data for Examples

`TelaExemplar` uses a module-level constant `FAKE_TODOS` to demonstrate the UI without backend integration. This approach allows frontend designers and QA to validate layouts and interactions independently.

### Hook Isolation

The original `App` function body was extracted into `TodoApp` to ensure React hooks are always called unconditionally (required by the Rules of Hooks). The early-return route guard at the `App` level returns `TelaExemplar` without violating hook rules.
