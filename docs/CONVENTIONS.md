# Coding Conventions

## Overview

This document establishes naming patterns, file organization, and coding standards for the todo-monorepo project.

## TypeScript

### Types & Interfaces
- Use `type` for simple type aliases and unions
- Use `interface` for object shapes (especially for components, API responses)
- Prefix interfaces with `I` only when disambiguating from class names (otherwise omit)
- Define types close to where they're used; export to separate file if shared across 3+ components

Example:
```typescript
// Simple type alias
type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

// Shared interface
interface User {
  id: number;
  email: string;
  name: string | null;
}
```

### Function Signatures
- Use explicit return types
- Place optional params at the end
- Use function declarations (not arrow functions) for named exports

```typescript
export function fetchTasks(token: string): Promise<Todo[]> {
  // ...
}

const handleSubmit = (e: React.FormEvent) => {
  // ...
};
```

## React Components

### File Naming
- Component files: PascalCase (e.g., `TelaExemplar.tsx`, `LoginForm.tsx`)
- Utility/helper files: camelCase (e.g., `authService.ts`)
- Test files: `ComponentName.test.tsx`

### Component Structure
- Default export for single-component files
- Props interface named `{ComponentName}Props`
- Hooks at top, helpers below, render logic last

```typescript
interface TelaExemplarProps {
  onNavigate?: (path: string) => void;
}

export default function TelaExemplar({ onNavigate }: TelaExemplarProps) {
  const [completed, setCompleted] = useState(0);
  // ...
  return <div>...</div>;
}
```

### CSS & Styling
- **CSS-in-JS with `<style>` tags:** Use for self-contained, single-component styles (e.g., TelaExemplar)
  - Prefix classes with component name for namespace (e.g., `.tela-*`)
  - Use BEM-like conventions: `.component-element--modifier`
  - Keep color and spacing values explicit (no magic numbers)

```typescript
<style>{`
  .tela-card {
    background: #ffffff;
    padding: 40px;
  }
  .tela-badge.badge-done {
    background: #dcfce7;
    color: #15803d;
  }
`}</style>
```

- **Inline styles:** Use for quick tweaks in parent components
  ```typescript
  <div style={{ padding: 20, display: "flex" }}>
  ```

- **No external CSS framework:** Keep dependencies minimal. Add frameworks (Tailwind, Bootstrap) only when styling becomes unmaintainable.

## File Organization

```
frontend/src/
├── components/
│   ├── TelaExemplar.tsx       # Feature-specific component
│   ├── LoginForm.tsx          # Feature-specific component
│   └── Common/
│       ├── Button.tsx         # Reusable primitive
│       └── Card.tsx
├── services/
│   ├── authService.ts         # API integration
│   └── taskService.ts
├── hooks/
│   ├── useAuth.ts             # Custom hooks
│   └── useTasks.ts
├── types/
│   └── index.ts               # Shared types
├── App.tsx                    # Entry point, routes
└── main.tsx                   # React DOM render

backend/src/
├── routes/
│   ├── auth.ts
│   ├── tasks.ts
│   └── health.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── models/
│   ├── User.ts
│   └── Task.ts
├── types/
│   └── index.ts
└── index.ts                   # Server entry point
```

## Naming Conventions

### Variables & Functions
- Use camelCase for all variables and functions
- Use descriptive names; avoid single-letter vars except loop indices
  - Good: `completedCount`, `handleFormSubmit`
  - Bad: `cc`, `hfs`, `x`

### Constants
- Use UPPER_SNAKE_CASE for module-level constants
  - `const API_BASE_URL = "http://localhost:3000";`
  - `const FAKE_TODOS: Todo[] = [...]`

- Use camelCase for local constants within functions (if they change per call)

### CSS Classes
- Use kebab-case with component prefix
  - `.tela-card`, `.tela-item`, `.tela-badge`
  - Modifier: `.tela-item--done`, `.badge--pending`

### Routes
- Paths lowercase, hyphen-separated
  - `/tela`, `/login`, `/auth/register`
  - `/tasks/:id`, `/tasks/:id/edit`

## Import Organization

1. External libraries (React, axios, etc.)
2. Type definitions
3. Components
4. Services/utilities
5. Styles (if applicable)

```typescript
import React, { useState, useEffect } from "react";
import axios from "axios";

import type { Todo, User } from "../types";
import LoginForm from "./LoginForm";
import TelaExemplar from "./components/TelaExemplar";
import { fetchTasks } from "../services/taskService";
```

## Git & Commit Messages

### Branch Naming
- Feature: `feature/description` (e.g., `feature/dark-mode`)
- User Story: `us-{number}` (e.g., `us-7`)
- Bug fix: `bugfix/description` (e.g., `bugfix/auth-token-refresh`)

### Commit Messages
- Imperative mood: "Add", "Update", "Fix" (not "Added", "Updates")
- Subject line max 70 chars
- Body explains *why*, not *what*

```
Add TelaExemplar component for US-7

The exemplar screen demonstrates the final UI design with mock data.
This allows QA to validate the visual design before backend integration.
```

## Testing

- Test file colocated with component: `Component.test.tsx`
- Use descriptive test names
- Arrange-Act-Assert pattern

```typescript
describe("TelaExemplar", () => {
  it("should display progress bar with correct percentage", () => {
    // Arrange
    const mockTodos = [
      { id: 1, completed: true },
      { id: 2, completed: false },
    ];

    // Act
    render(<TelaExemplar todos={mockTodos} />);

    // Assert
    expect(screen.getByText("1 de 2 tarefas concluidas")).toBeInTheDocument();
  });
});
```

## Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors server-side (backend only)

```typescript
async function addTask(title: string) {
  try {
    const response = await axios.post("/api/tasks", { title });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("Invalid task title");
    }
    throw new Error("Failed to add task");
  }
}
```

## Documentation

- Keep README.md in each package with setup/run instructions
- Inline comments for complex logic only (self-documenting code preferred)
- Type definitions and function signatures serve as documentation

```typescript
// Good: Clear function name and types
function calculateProgressPercentage(completed: number, total: number): number {
  return (completed / total) * 100;
}

// Avoid: Obvious comment on obvious code
// Get the number of completed tasks
const completed = tasks.filter(t => t.completed).length;
```

## Performance & Quality

- Avoid unnecessary re-renders: use `React.memo`, `useCallback`
- Lazy load routes when bundle size grows
- Use `const` by default; `let` only when reassigning
- Never use `any` type; use `unknown` if necessary and narrow
- Run linter and type check before committing

## Async & Side Effects

- Use `useEffect` for side effects
- Dependencies array should be exhaustive (eslint-plugin-react-hooks)
- Cleanup timers, subscriptions in useEffect return

```typescript
useEffect(() => {
  if (!token) return;
  
  fetchTasks();
}, [token]); // token in dependencies
```

## Future Tech Debt

As the project grows, consider:
- Migrating to React Router for complex routing
- Adding ESLint + Prettier
- Adopting CSS modules or Tailwind
- Setting up Storybook for component documentation
- Adding E2E tests (Cypress, Playwright)
