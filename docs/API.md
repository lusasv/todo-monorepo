# API Reference

## Routing

### Frontend Routes

| Path | Component | Type | Notes |
|------|-----------|------|-------|
| `/` | `TodoApp` | Page | Authenticated todo list (requires token in localStorage) |
| `/tela` | `TelaExemplar` | Page | Example todo screen with mock data (no authentication required) |

The `/tela` route is a frontend-only UI example. No backend endpoints are required or called.

## Backend Endpoints

Refer to backend implementation for the current list of REST API endpoints under `/api/`.

### Example Endpoints (Reference)

- `GET /api/tasks` — Fetch user tasks (requires Bearer token)
- `POST /api/tasks` — Create new task (requires Bearer token)

## Notes on US-7

US-7 (Criar tela mockada exemplar) introduces only frontend changes:
- New component: `TelaExemplar.tsx` at path `/tela`
- No new backend endpoints created
- Uses hardcoded mock data (`FAKE_TODOS`) — no API calls made
- Available without authentication
