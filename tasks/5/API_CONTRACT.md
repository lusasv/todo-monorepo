# API Contract — Story #5: Melhorar Tela de Login

## Overview

This story is primarily a frontend UI improvement. The existing authentication
endpoints are NOT changed. The backend change is limited to returning more
descriptive error messages from the login endpoint so the redesigned UI can
display specific feedback to the user.

---

## Existing Endpoints (unchanged)

### POST /auth/register

Registers a new user and returns a JWT token.

**Request**

```
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Jane Doe"
}
```

| Field    | Type   | Required | Notes                  |
|----------|--------|----------|------------------------|
| email    | string | yes      | Must be a valid email  |
| password | string | yes      |                        |
| name     | string | no       |                        |

**Responses**

`201 Created`
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

`400 Bad Request` — missing fields
```json
{ "error": "email and password are required" }
```

`400 Bad Request` — duplicate email
```json
{ "error": "email already exists" }
```

---

### POST /auth/login

Authenticates a user and returns a JWT token.

**Request**

```
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | yes      |
| password | string | yes      |

**Responses**

`200 OK`
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

`400 Bad Request` — missing fields
```json
{ "error": "email and password are required" }
```

`401 Unauthorized` — user not found
```json
{ "error": "user not found" }
```

`401 Unauthorized` — wrong password
```json
{ "error": "invalid password" }
```

> **Backend change required:** The current implementation returns the generic
> message `"invalid credentials"` for both "user not found" and "wrong
> password". To support the story requirement of displaying specific error
> messages in the UI, the backend must split these into two distinct messages:
> `"user not found"` and `"invalid password"`.

---

## JWT Usage (frontend contract)

- After a successful login or register the frontend stores the token in
  `localStorage` under the key `"token"`.
- All protected requests attach the token as:
  ```
  Authorization: Bearer <token>
  ```
- Token lifetime: 7 days (set by backend).

---

## Frontend UI Contract

The following describes the expected behaviour of the redesigned login/register
form components. This is the primary deliverable of this story.

### LoginForm component (`frontend/src/LoginForm.tsx`)

**Props / state**

| State field   | Type    | Purpose                                      |
|---------------|---------|----------------------------------------------|
| email         | string  | Controlled input value                       |
| password      | string  | Controlled input value                       |
| showPassword  | boolean | Toggles password field between text/password |
| loading       | boolean | True while the HTTP request is in-flight     |
| error         | string  | Error message from backend or validation     |
| isRegister    | boolean | Switches between login and register modes    |

**Validation (client-side, before submit)**

| Rule                | Error message displayed              |
|---------------------|--------------------------------------|
| email is empty      | "Email is required"                  |
| email format invalid| "Enter a valid email address"        |
| password is empty   | "Password is required"               |

**Backend error mapping**

| Backend `error` value       | Message shown to user                   |
|-----------------------------|-----------------------------------------|
| `"user not found"`          | "No account found with this email"      |
| `"invalid password"`        | "Incorrect password"                    |
| `"email already exists"`    | "An account with this email already exists" |
| `"email and password are required"` | "Email and password are required" |
| any other / network error   | "Authentication failed. Please try again." |

**Button states**

| State   | Button label (login) | Button label (register) | Disabled |
|---------|----------------------|-------------------------|---------|
| idle    | "Entrar"             | "Cadastrar"             | false   |
| loading | "Entrando..."        | "Cadastrando..."        | true    |

**Password toggle**

- An icon button inside the password field toggles `showPassword`.
- When `showPassword` is `false` the input type is `"password"`.
- When `showPassword` is `true` the input type is `"text"`.
- Icon: eye / eye-off (e.g. from `lucide-react`).

**Accessibility requirements**

- Every `<input>` has a corresponding `<label>` connected via `htmlFor` / `id`.
- Error messages are rendered in an element with `role="alert"` so screen
  readers announce them immediately.
- The submit button must not rely on colour alone to communicate its disabled
  state (opacity + cursor change required).
- Colour contrast must meet WCAG AA (minimum 4.5:1 for normal text).

**Responsive breakpoints**

| Viewport          | Card behaviour                                   |
|-------------------|--------------------------------------------------|
| < 768 px (mobile) | Full-width, no card shadow, padding 16px         |
| 768–1023 px (tablet) | Centred card, max-width 420px               |
| >= 1024 px (desktop)| Centred card, max-width 400px, shadow          |

---

## E2E Test Expectations (`e2e/login.spec.ts`)

The Playwright tests must cover:

1. Successful login flow — form submits, token stored, task list visible.
2. Invalid email format — inline validation error shown before submit.
3. Wrong password — backend error message displayed in the form.
4. User not found — backend error message displayed in the form.
5. Loading state — submit button is disabled and shows loading label while
   request is in-flight.
6. Password toggle — clicking the eye icon reveals/hides password text.
7. Viewport tests — run tests at 375px, 768px, and 1280px wide.

---

## Out of Scope for This Story

- "Esqueci a senha" (Forgot password) link — noted as future work.
- Dark mode — nice-to-have, not required.
- Any changes to task endpoints (`/tasks`, `/tasks/:id`).
- Any database schema changes.
