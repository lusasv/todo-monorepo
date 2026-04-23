# Architecture Decision Records

## ADR-001: LoginForm UI/UX Improvements (Issue #5)

**Date**: 2026-04-22

**Status**: Accepted

**Context**: The original LoginForm component needed visual and UX improvements to enhance user experience, accessibility, and mobile responsiveness.

**Decision**: Implemented comprehensive UI/UX enhancements to LoginForm.tsx including responsive design, modern styling, validation feedback, and accessibility improvements.

### Key Changes

#### 1. Responsive Layout (3 Breakpoints)
- **Mobile** (<768px): Full-width card with reduced padding, minimal shadow
- **Tablet** (768-1023px): Card max-width 420px
- **Desktop** (>=1024px): Card max-width 400px

**Rationale**: Mobile-first approach ensures usable experience on all screen sizes without separate components. CSS media queries handle breakpoints efficiently.

#### 2. Modern Gradient & Card Styling
- **Background**: Linear gradient (135deg, #667eea to #764ba2)
- **Card**: White background, 12px border-radius, 20px/60px shadow with rgba opacity
- **Typography**: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

**Rationale**: Modern gradient background creates visual hierarchy. Card-based design with shadow provides depth and professional appearance. System fonts load instantly without external requests.

#### 3. Client-Side Validation
- **Email**: Regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password**: Required field validation
- **Field-level errors**: Individual error messages per field
- **Error clearing**: Errors clear on input change (improves UX)

**Rationale**: Client-side validation provides immediate feedback without server round-trip. Regex pattern is practical for most email formats. Field-level errors help users fix issues quickly.

#### 4. Backend Error Mapping
- Centralized `mapBackendError()` function converts backend error keys to user-friendly Portuguese messages
- Handles: user-not-found, invalid-password, email-already-exists, etc.

**Rationale**: Decouples backend error messages from frontend. Allows reusable error handling across the app. Single source of truth for error translations.

#### 5. Password Visibility Toggle
- **Icon**: Eye/EyeOff icons from lucide-react
- **Behavior**: Toggles input type between "password" and "text"
- **Accessibility**: aria-label describes action ("Mostrar senha"/"Ocultar senha")

**Rationale**: Eye icon is universally recognized for password visibility. Lucide-react provides lightweight, accessible SVG icons. Toggling type attribute is simpler than character masking.

#### 6. Loading States
- **Submit button**: Disabled during request, shows "Entrando..." or "Cadastrando..."
- **Visual feedback**: Reduced opacity (0.55), cursor: not-allowed
- **Prevents double submission**: Disabled button blocks clicks

**Rationale**: Prevents accidental double submissions. Clear feedback that request is processing. Maintains form integrity during async operations.

#### 7. Accessibility Enhancements
- **Form labels**: `<label htmlFor="">` paired with `<input id="">`
- **Error announcements**: `role="alert"` on error messages
- **Input descriptions**: `aria-describedby` links inputs to error IDs
- **Invalid state**: `aria-invalid` indicates input errors
- **Icon button labels**: `aria-label` describes password toggle action
- **Focus states**: 2px solid outline with 2px offset, high-contrast color (#667eea)

**Rationale**: Follows WCAG guidelines. Enables screen reader users to understand form structure and errors. Visible focus states aid keyboard navigation.

#### 8. E2E Test Coverage
- **11 test scenarios** in e2e/login.spec.ts covering:
  - Page load
  - Registration flow
  - Login flow with token storage
  - Client-side validation errors
  - Backend error handling
  - Loading states
  - Password visibility toggle
  - Responsive viewport tests (mobile, tablet, desktop)

**Rationale**: E2E tests verify user-facing behavior. Multiple viewports ensure responsive design works correctly. Error scenarios test edge cases.

### Consequences

**Positive**:
- Professional, modern appearance improves user trust
- Responsive design supports all device sizes
- Client-side validation improves perceived performance
- Accessibility compliance expands user base (includes screen readers, keyboard-only users)
- Comprehensive E2E tests catch regressions
- Inline CSS approach reduces build complexity (no CSS files to manage)

**Negative**:
- LoginForm.tsx grew from ~100 to ~440 lines (maintainability concern)
- Inline CSS-in-JS approach doesn't leverage CSS reusability
- No component library/styling system for consistency across app
- localStorage token storage has XSS vulnerability (needs HttpOnly cookies in production)

### Alternatives Considered

1. **CSS Modules/BEM**: Would separate styles into CSS files but require build tooling changes
2. **Tailwind CSS**: Faster to write, but adds build dependency and larger bundle
3. **Styled-components**: Runtime CSS-in-JS but adds bundle size
4. **HTML5 validation**: Native browser validation, but less control over UX

**Why inline CSS**: Simplicity for monorepo without build configuration. All styling isolated to component.

### Follow-up Tasks

1. Consider extracting styles to separate utility functions or styled-components as app grows
2. Migrate token storage to HttpOnly cookies for security
3. Apply same styling improvements to task management UI
4. Consider component library (shadcn/ui, React Aria) for consistency
5. Add password strength indicator on registration form
6. Implement email verification before account activation

---

## ADR-002: JWT Token Storage Location

**Date**: 2026-04-22

**Status**: Accepted (With Security Caveat)

**Context**: Need to persist JWT token across page reloads and browser restarts for persistent sessions.

**Decision**: Store JWT token in browser `localStorage` under key "token".

**Rationale**:
- Simple to implement: `localStorage.getItem("token")` on app load
- Persists across browser restarts
- Accessible from React state (no additional HTTP layer)
- Works with current architecture

**Consequences**:

**Positive**:
- Easy to implement and test
- Works cross-origin (unlike cookies)
- Can retrieve token for debugging

**Negative**:
- **Vulnerable to XSS attacks**: Any injected JavaScript can read/modify token
- No HttpOnly flag (browser-accessible by scripts)
- No CSRF protection (but POST requests require Content-Type header)

**Recommendation for Production**:
Migrate to HttpOnly, Secure, SameSite cookies:
```http
Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

This prevents JavaScript access and XSS token theft.

---

## ADR-003: Client-Side Validation Strategy

**Date**: 2026-04-22

**Status**: Accepted

**Context**: Form submission requires validation before sending to backend to improve UX and reduce server load.

**Decision**: Implement client-side validation with field-level error messages that clear on input change. Backend also validates and provides error messages.

**Validation Rules**:
- **Email**: Required + valid format (regex)
- **Password**: Required (no strength requirement at client level)
- **Name** (registration): Optional

**Rationale**:
- Immediate feedback without server delay
- Prevents submission of obviously invalid data
- Reduces unnecessary backend requests
- Field-level errors guide users to fix issues

**Consequences**:
- Backend validation is duplicated (necessary for security)
- Regex email validation not RFC 5322 compliant (acceptable for UX)
- Error clearing on change may hide previous submission errors (mitigated by form-level error banner)

---

## ADR-004: Password Visibility Toggle Implementation

**Date**: 2026-04-22

**Status**: Accepted

**Context**: Users often struggle with password entry. Provide option to see password during typing.

**Decision**: Implement toggle button with Eye/EyeOff icons that changes input type between "password" and "text".

**Implementation**:
```tsx
<input type={showPassword ? "text" : "password"} />
<button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

**Rationale**:
- Eye icon is universally recognized
- Type toggling is simpler than character masking
- Lucide-react provides accessible, lightweight icons
- Clear aria-label for screen readers

**Consequences**:
- Adds button to form (increases visual complexity slightly)
- Requires lucide-react dependency
- Password briefly visible on screen (user aware of this)

---

## ADR-005: Error Message Localization

**Date**: 2026-04-22

**Status**: Accepted

**Context**: Backend returns generic error keys; frontend should display user-friendly, localized messages.

**Decision**: Implement `mapBackendError()` function that converts backend error keys to Portuguese user-friendly messages.

**Example**:
```typescript
mapBackendError("user not found") 
  → "No account found with this email"
```

**Rationale**:
- Single source of truth for error translations
- Easy to add more languages later (wrap function with i18n)
- Decouples backend error messages from frontend UI
- Consistent error messaging across app

**Consequences**:
- Need to update function when new error types added to backend
- Currently only Portuguese; would need i18n library for multiple languages

**Future**: Consider using i18next or react-i18next for proper localization.

---

## ADR-006: Form State Management Approach

**Date**: 2026-04-22

**Status**: Accepted

**Context**: LoginForm manages multiple pieces of state: email, password, name, loading, errors, validation errors, mode toggle.

**Decision**: Use individual `useState` hooks for each state piece (not reducer pattern).

**Rationale**:
- Simple and straightforward for single-page form
- Easy to understand state dependencies
- Sufficient for current complexity

**Consequences**:
- 8 useState calls (email, password, name, showPassword, loading, error, emailError, passwordError)
- Would become unwieldy if form grows significantly
- No centralized state machine

**Future**: Consider `useReducer` if form grows or multiple forms need similar logic.
