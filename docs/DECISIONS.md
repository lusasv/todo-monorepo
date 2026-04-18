# Architectural Decisions

## US-7 — Criar tela mockada exemplar (2026-04-18)

**Decision:** No backend implementation required for this user story.

**Context:** The spec writer explicitly determined that US-7 is a frontend-only task. The `/tela` route is a demonstration screen with hardcoded mock data. There are no data persistence, authentication, or API integration requirements at this stage.

**Consequences:**
- The `TelaExemplar` React component holds all mock data inline (no API calls).
- The route `/tela` is registered only in `frontend/src/App.tsx`.
- Backend files (`backend/src/index.ts`) are unchanged.
- No new API endpoints were added to `docs/API.md` for this US.
