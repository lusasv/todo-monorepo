# Architecture Decisions

## US-7 — Criar tela mockada exemplar (2026-04-22)

### Routing strategy
No routing library (e.g. react-router-dom) was added. The spec requires no new external dependencies. Routing for `/tela` is implemented via a `window.location.pathname` check inside the top-level `App` component, which renders `<TelaExemplar />` when the path matches and falls through to the existing `TodoApp` otherwise.

### Component isolation
The original `App` function body was extracted into a new `TodoApp` component so that React hooks are always called unconditionally and the early-return route guard at the `App` level does not violate the Rules of Hooks.

### Mock data
Five hardcoded `Todo` items are defined as a module-level constant `FAKE_TODOS` inside `TelaExemplar.tsx`. No API calls are made.

### Styling
CSS-in-JS inline `<style>` tag pattern follows `LoginForm.tsx`. The same color palette (`#667eea` / `#764ba2` gradient) is reused for visual consistency. Media queries target mobile (max 767px), tablet (768–1023px) and desktop (1024px+).
