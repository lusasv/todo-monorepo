# Coding Conventions

## Frontend

### File Organization
- **Components**: `.tsx` files in `frontend/src/`
- **Styling**: Embedded CSS-in-JS using `<style>` tag within components
- **No external CSS files** used (all styles co-located with JSX)

### React Patterns

#### Functional Components
- All components are functional with hooks
- State management: `useState` for local state
- Side effects: `useEffect` for data fetching

#### Props
- Destructure in function parameters
- Use TypeScript interfaces for prop types
- Example:
  ```tsx
  interface LoginFormProps {
    onAuthSuccess: (token: string, user: User) => void;
  }
  ```

#### State Management
- Form state (input values) in component state
- UI state (loading, errors) in component state
- Auth token and user in App.tsx state
- Persistent data: localStorage for JWT token

### Validation Patterns

#### Client-Side Validation
- Email: Regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Form submission blocks if validation fails
- Field-level errors (individual error messages per field)
- Form-level errors (backend errors, general failures)

#### Error Handling
- Try-catch for async operations
- Axios error checking: `axios.isAxiosError()`
- Map backend error strings to user-friendly messages
- Clear errors on input change (UX improvement)

### Styling Conventions

#### CSS Structure
- Single `<style>` tag in component
- BEM-like naming: `.auth-wrapper`, `.auth-card`, `.form-group`
- Consistent color palette:
  - Primary gradient: #667eea to #764ba2
  - Error: #ef4444 (red)
  - Neutral gray: #6b7280

#### Responsive Breakpoints
- Mobile: `<768px` (@media max-width)
- Tablet: `768px - 1023px` (@media min-width and max-width)
- Desktop: `>=1024px` (@media min-width)

#### Interactive States
- Hover: `opacity: 0.92`, shadow enhancement, slight scale up (transform translateY)
- Focus: Visible outline (2px solid) with outline-offset
- Disabled: Reduced opacity (0.55), cursor not-allowed, no hover effects
- Active: Immediate visual feedback (transform resets)

### Accessibility Standards

#### ARIA Attributes
- `role="alert"` on error messages and form-level error banners
- `aria-label` on icon buttons (e.g., password toggle)
- `aria-describedby` on inputs with validation errors
- `aria-invalid` on inputs with errors

#### Form Labels
- `<label htmlFor="fieldId">` paired with `<input id="fieldId">`
- All form inputs have associated labels
- No label: Only icon buttons (password toggle)

#### Keyboard Navigation
- All interactive elements: buttons, inputs, links focusable
- Focus visible with high-contrast outline
- Tab order follows document order

## Backend

### File Organization
- **Entry point**: `backend/src/index.ts`
- **Server setup**: `backend/src/server.ts`
- **Database**: Prisma ORM with SQLite
- **No middleware files** (all inline in server.ts for simplicity)

### API Conventions

#### HTTP Methods
- GET: Fetch resources (read-only)
- POST: Create new resources
- PUT: Update full resources
- DELETE: Remove resources

#### Route Naming
- RESTful style: `/resource` and `/resource/:id`
- Nested resources: `/auth/login`, `/auth/register`
- No trailing slashes

#### Response Format
```json
{
  "data": {...} or [...],
  "error": "error-key"
}
```
- Success: Returns data object or array
- Error: Returns `{ error: "error-message" }`

#### Status Codes
- 201: Created (POST successful)
- 204: No Content (DELETE successful)
- 400: Bad Request (validation failure)
- 401: Unauthorized (auth failure)
- 404: Not Found (resource missing)

### Error Messages

Backend returns error keys (lowercase, hyphen-separated):
- "user not found"
- "invalid password"
- "email already exists"
- "email and password are required"

Frontend maps these to user-friendly messages in `mapBackendError()`.

### Security Conventions

#### Password Handling
- Hash with bcrypt (10 salt rounds)
- Never return password in responses
- Always validate presence before processing

#### Token Management
- JWT signed with HS256
- Payload: `{ userId: number }`
- Expiry: 7 days
- Secret: From `JWT_SECRET` env var or "secret-key-change-in-production"

#### Database Queries
- Prisma for type-safe queries
- Use `findUnique()` for lookups by unique fields
- Use `findMany()` for filtered lists

## Testing Conventions

### E2E Testing (Playwright)

#### Test Structure
- Test description: Clear, user-focused language
- Setup: Navigate to page, clear state if needed
- Action: User interaction (fill, click)
- Assert: Verify expected outcome

#### Common Patterns
```typescript
// Navigation
await goToLogin(page);

// Form interaction
await page.fill('#email', 'user@test.com');
await page.click('button[type="submit"]');

// Assertion
await expect(page.locator('#email-error')).toBeVisible();
await expect(page.locator('h2')).toContainText('Login');

// Network interception (for loading states)
await page.route('**/auth/login', async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await route.continue();
});
```

#### Test Categories
- **Page Load**: Verify UI elements render
- **User Flows**: Complete login/register/logout
- **Validation**: Field validation errors
- **Error Handling**: Backend error messages
- **UI States**: Loading, disabled, visibility
- **Responsive Design**: Viewport/breakpoint tests

## Language & Localization

### Current Language
- **Portuguese (Brazilian Portuguese)**
- UI text: Portuguese
- Error messages: Mapped to English internally, displayed in Portuguese

### Examples
- Login button: "Entrar"
- Register button: "Cadastrar"
- Error: "Email é obrigatório" (maps to internal "email is required")

## Documentation

### Code Comments
- Use inline comments for complex logic
- Document function purposes with JSDoc (optional for simple functions)
- Keep comments concise and focused on "why" not "what"

### Commit Messages
- Format: `[FEATURE|FIX|CHORE]: description`
- Keep first line under 50 characters
- Add body with details if needed
- Example: `feat: add LoginForm with responsive styling and validation`
