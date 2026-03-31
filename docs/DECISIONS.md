# Architecture Decision Records (ADRs)

This document captures significant architectural decisions and their rationales.

---

## ADR-1: Monorepo with npm Workspaces

**Status:** Accepted
**Date:** 2026-03-15 (inferred from commit history)
**Context:** Need to manage backend and frontend as a cohesive system

### Decision
Use npm workspaces instead of separate repositories or tools like Lerna for monorepo management.

### Rationale
- **Native npm feature:** No external tool dependency
- **Simple setup:** Minimal configuration required
- **Shared lockfile:** Reproducible installs across backend and frontend
- **Unified scripts:** Single `npm run dev` runs both servers
- **Existing ecosystem:** npm workspaces well-supported by tools

### Consequences
- ✅ Easy to set up and maintain
- ✅ Clear separation of concerns (backend/, frontend/)
- ⚠️ Shared node_modules requires careful dependency management
- ⚠️ Cannot easily separate deployments

### Alternatives Considered
1. **Lerna** - More complex, added overhead for this project size
2. **Turborepo** - Good for large monorepos, overkill for current scale
3. **Separate repositories** - Harder to keep API/UI in sync

---

## ADR-2: SQLite for Development Database

**Status:** Accepted
**Date:** 2026-03-20 (inferred)
**Context:** Need data persistence layer; chose dev-friendly database

### Decision
Use SQLite with Prisma ORM as the development database, with migration path to PostgreSQL/MySQL.

### Rationale
- **Zero setup:** File-based, no server installation needed
- **Good for prototyping:** Fast iteration without infrastructure
- **ORM abstraction:** Prisma provides SQL dialect abstraction
- **Test-friendly:** Easy to reset between test runs
- **Migration path:** Prisma handles schema, can switch providers

### Consequences
- ✅ Developers can run the entire app locally
- ✅ No external service dependencies
- ⚠️ Not suitable for production at scale
- ⚠️ Limited concurrent write support
- ⚠️ No built-in replication or high availability

### Migration Plan
When scaling to production:
1. Set `DATABASE_URL=postgresql://...` in env
2. Run Prisma introspection on target database
3. Update migrations if needed
4. Deploy with new provider

### Alternatives Considered
1. **PostgreSQL locally** - Requires Docker or server installation
2. **MongoDB** - Document DB, poor fit for relational task data
3. **In-memory database** - Fine for testing, not for dev persistence

---

## ADR-3: JWT-Based Stateless Authentication

**Status:** Accepted (with reservations)
**Date:** 2026-03-20 (inferred)
**Context:** Need authentication system for user isolation

### Decision
Use JWT (JSON Web Tokens) for stateless authentication with 7-day expiry.

### Rationale
- **Scalable:** No server-side session storage needed
- **Distributed-friendly:** Works across multiple backend servers
- **Standard:** JWT is industry standard for modern APIs
- **Simple implementation:** jsonwebtoken library handles signing/verification
- **Frontend-friendly:** Easy to store in localStorage

### Consequences
- ✅ Scales horizontally without session replication
- ✅ No server memory usage for sessions
- ⚠️ No built-in token revocation (logout doesn't invalidate server-side)
- ⚠️ Fixed 7-day expiry (no refresh token mechanism)
- ⚠️ Token compromise requires full expiry wait
- ⚠️ Large tokens consume more bandwidth

### Security Gaps (Must Address)
1. **Token validation missing** - Endpoints don't verify JWT on protected routes
2. **No refresh tokens** - User logged out for full 7 days if password compromised
3. **Secret key default** - Falls back to `"secret-key-change-in-production"`

### Improvements Needed
```typescript
// Add auth middleware
app.use('/tasks', validateJWT); // Verify token on all task endpoints

// Add refresh token mechanism
POST /auth/refresh
  ├── Accepts expired JWT + refresh token
  └── Returns new access JWT

// Add token revocation
POST /auth/logout
  └── Adds token to blacklist (Redis)
```

### Alternatives Considered
1. **Session-based** - Simpler but doesn't scale
2. **OAuth 2.0** - Overkill for this phase, good for future
3. **API Keys** - Not suitable for user-facing apps

---

## ADR-4: Vite Proxy for Development API Calls

**Status:** Accepted
**Date:** 2026-03-25 (inferred)
**Context:** Frontend and backend run on different ports

### Decision
Configure Vite dev server to proxy `/api/*` requests to backend (http://localhost:4000).

### Rationale
- **CORS avoidance:** No CORS configuration needed during dev
- **Transparent to code:** React code uses relative `/api/*` paths
- **Production-ready URLs:** Same relative paths used in production
- **Simple setup:** One-liner in vite.config.ts

### Configuration
```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:4000",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
},
```

### Consequences
- ✅ No CORS issues in development
- ✅ Backend doesn't need to be CORS-aware (though it is)
- ✅ URLs don't change between dev and production
- ⚠️ Adds slight latency (request → Vite → backend)
- ⚠️ Only works in dev; production needs real routing

### Production Deployment
In production:
1. Build React with `vite build` → static files
2. Serve from same origin as backend (e.g., reverse proxy)
3. Backend serves static files AND API routes

OR

3. Upload static files to CDN, API routes on separate domain

### Alternatives Considered
1. **CORS headers** - Would work but adds complexity
2. **Environment-based baseURL** - Would require build-time env variables
3. **Same-origin deployment** - Best practice, standard approach

---

## ADR-5: CSS-in-JS Styling (No Framework)

**Status:** Accepted
**Date:** 2026-03-27 (inferred, Story #5)
**Context:** Need responsive, accessible login UI without external dependencies

### Decision
Use inline CSS-in-JS styling in LoginForm component with responsive breakpoints defined in code.

### Rationale
- **No external dependencies:** Avoids Tailwind or styled-components
- **Complete control:** Full CSS control without abstraction layer
- **Responsive:** Breakpoints defined via CSS media queries
- **Accessibility:** Direct control over color contrast, ARIA
- **Bundle size:** Minimal added size

### Consequences
- ✅ No CSS framework overhead
- ✅ Styling logic visible in component
- ✅ Easy to modify for accessibility
- ⚠️ Verbose (long CSS strings)
- ⚠️ No theming mechanism
- ⚠️ Difficult to reuse styles across components

### Responsive Breakpoints
```
Mobile:   < 768px
Tablet:   768px - 1023px
Desktop:  >= 1024px
```

### Accessibility Checklist
- ✅ Form labels connected via htmlFor/id
- ✅ Error messages with role="alert"
- ✅ Color contrast WCAG AA (4.5:1)
- ✅ Focus states visible
- ✅ Password toggle aria-label

### Future Improvements
1. Extract styles to CSS module
2. Add Tailwind CSS if more components added
3. Implement dark mode support
4. Create component library

### Alternatives Considered
1. **Tailwind CSS** - Good option, adds build step
2. **styled-components** - Adds runtime overhead
3. **CSS modules** - More maintainable but more files
4. **Plain CSS file** - Would work but harder to manage responsive

---

## ADR-6: Error Message Mapping (Frontend)

**Status:** Accepted
**Date:** 2026-03-27 (Story #5)
**Context:** Backend returns technical error codes; frontend needs user-friendly messages

### Decision
Create error mapping function in LoginForm that translates backend error codes to user messages.

### Rationale
- **Better UX:** Users see clear, actionable messages
- **Specific feedback:** Different messages for different failures
- **Decoupled:** Frontend doesn't hardcode backend strings
- **Localization-ready:** Easy to add multiple languages

### Mapping Table
```typescript
function mapBackendError(errorValue: string): string {
  switch (errorValue) {
    case "user not found":
      return "No account found with this email";
    case "invalid password":
      return "Incorrect password";
    case "email already exists":
      return "An account with this email already exists";
    case "email and password are required":
      return "Email and password are required";
    default:
      return "Authentication failed. Please try again.";
  }
}
```

### Consequences
- ✅ Consistent error messages across app
- ✅ Easy to update without code changes
- ✅ Support for internationalization
- ⚠️ String mapping can get out of sync
- ⚠️ Duplicate error strings (backend + frontend)

### Future: Internationalization
```typescript
// With i18n library
const errorMessages = {
  "user not found": t("errors.userNotFound"),
  "invalid password": t("errors.invalidPassword"),
  ...
};
```

### Alternatives Considered
1. **Return error codes** - More machine-readable but harder to use
2. **Hardcode messages in backend** - Tightly couples frontend to backend
3. **Shared error constant file** - Requires coordination

---

## ADR-7: Comprehensive E2E Testing with Playwright

**Status:** Accepted
**Date:** 2026-03-27 (Story #5)
**Context:** Need to verify user flows work end-to-end across all devices

### Decision
Use Playwright for E2E testing with comprehensive coverage of login/register flows and viewport sizes.

### Rationale
- **User perspective:** Tests real user interactions
- **Multi-browser:** Configured for Chromium, extensible to Firefox/Safari
- **Viewport testing:** Verify responsive design across devices
- **Network simulation:** Can test loading states
- **Accessibility:** Can query by ARIA labels and roles

### Test Coverage
```
11 Test Scenarios:
├── Login page loads
├── Register new user
├── Successful login flow (token stored)
├── Validation errors
│   ├── Email required/invalid format
│   ├── Password required
│   └── Backend error mapping
├── Password toggle
├── Loading states
└── Multi-viewport (375px/768px/1280px)
```

### Consequences
- ✅ High confidence in user flows
- ✅ Catch regressions automatically
- ✅ Document expected behavior
- ⚠️ Slower than unit tests
- ⚠️ Brittle if selectors change
- ⚠️ Need running frontend/backend

### Configuration
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});
```

### Selector Strategy (Accessibility-First)
- ✅ Prefer: `page.locator('#email')` (aria-id)
- ✅ Prefer: `page.locator('[role="alert"]')` (aria-role)
- ⚠️ Avoid: `page.locator('.submit-btn')` (brittle)
- ⚠️ Avoid: CSS coordinates or visual locators

### Future Improvements
1. Add Firefox and Safari to browser matrix
2. Add visual regression testing
3. Test on real devices via cloud service
4. Integrate with CI/CD pipeline

### Alternatives Considered
1. **Cypress** - Simpler but not multi-browser native
2. **Selenium** - More complex setup, slower
3. **Manual testing** - Not scalable, error-prone

---

## ADR-8: No User-Task Association (CRITICAL DECISION)

**Status:** Pending Rejection
**Date:** 2026-03-20 (inferred, design decision)
**Context:** Initial MVP focused on authentication proof-of-concept

### Current Decision
The Task model has NO `userId` field. All users see all tasks.

### Consequences
- ❌ **CRITICAL SECURITY GAP:** Data not isolated by user
- ❌ Not suitable for production
- ❌ Violates privacy/security expectations
- ⚠️ All endpoints publicly readable/writable (if JWT added)

### This Must Be Fixed
ADR-9 below recommends immediate correction.

---

## ADR-9: Add Task-User Association (RECOMMENDED)

**Status:** Proposed
**Date:** 2026-03-31 (current analysis)
**Context:** Current architecture violates data isolation requirements

### Decision (SHOULD ADOPT)
Implement user-task association immediately to fix critical security gap.

### Changes Required
1. **Database Schema:**
   ```prisma
   model Task {
     id          Int      @id @default(autoincrement())
     title       String
     description String?
     dueDate     DateTime?
     completed   Boolean  @default(false)
     createdAt   DateTime @default(now())

     userId      Int      // NEW
     user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   }
   ```

2. **Prisma Migration:**
   ```
   npx prisma migrate dev --name add_user_task_association
   ```

3. **Backend Changes:**
   ```typescript
   // Add auth middleware (new file: middleware/auth.ts)
   export function validateJWT(req, res, next) {
     const token = req.headers.authorization?.replace('Bearer ', '');
     if (!token) return res.status(401).json({ error: 'Unauthorized' });
     try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.user = decoded;
       next();
     } catch {
       return res.status(401).json({ error: 'Invalid token' });
     }
   }

   // Apply to task routes
   app.use('/tasks', validateJWT);

   // Filter by user
   app.get('/tasks', async (req, res) => {
     const tasks = await prisma.task.findMany({
       where: { userId: req.user.userId },  // NEW
       orderBy: { createdAt: 'desc' },
     });
     res.json(tasks);
   });

   // Similar changes for POST, PUT, DELETE
   ```

4. **Database Migration Data:**
   - Strategy: Set orphaned tasks to user ID 1 (or delete them)
   - Better: Run migration in maintenance window
   - Test: Write migration test

### Rationale
- **Security:** Isolate user data
- **Privacy:** Compliance with data protection
- **Production-ready:** Necessary before launch
- **Straightforward:** Doesn't break existing API contract

### Timeline
- **Immediate:** Create migration file
- **Before production:** Apply and test
- **Testing:** Add E2E test for data isolation

### Risks
- May break existing data (if real users exist)
- Need backward-compatible migration
- Requires testing on production database copy

---

## ADR-10: Add Authorization Middleware

**Status:** Proposed
**Date:** 2026-03-31 (current analysis)
**Context:** Current endpoints don't validate JWT tokens

### Decision (SHOULD ADOPT)
Implement auth middleware to validate JWT tokens on all protected routes.

### Implementation
```typescript
// middleware/auth.ts
export function validateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply to protected routes
app.use('/tasks', validateJWT);

// Public routes
app.post('/auth/register', ...);
app.post('/auth/login', ...);
app.get('/health', ...);
```

### Benefits
- ✅ Validates JWT on every protected request
- ✅ Prevents unauthorized access
- ✅ Enables request.user context
- ✅ Clear error responses

### Breaking Changes
- May break existing frontend if tokens not sent correctly
- But frontend already sends tokens, so should be compatible

---

## ADR-11: Rate Limiting Strategy

**Status:** Proposed
**Date:** 2026-03-31 (current analysis)
**Context:** No protection against brute force or DoS attacks

### Decision (SHOULD ADOPT)
Implement rate limiting on auth endpoints to prevent credential stuffing.

### Configuration
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                     // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 3,                         // 3 registrations per hour
  skipSuccessfulRequests: true,   // Don't count successful registrations
});

app.post('/auth/login', loginLimiter, ...);
app.post('/auth/register', registerLimiter, ...);
```

### Benefits
- ✅ Prevents brute force attacks
- ✅ Protects against credential stuffing
- ✅ Reduces server load from abuse

---

## ADR-12: Environment Configuration

**Status:** Proposed
**Date:** 2026-03-31 (current analysis)
**Context:** Hard-coded values throughout codebase

### Decision (SHOULD ADOPT)
Implement environment-based configuration for all deployment-specific values.

### Required Environment Variables
```bash
# Backend
JWT_SECRET=your-secret-key-here      # No default
DATABASE_URL=file:./dev.db           # Default for dev
NODE_ENV=development                 # development|production
PORT=4000                             # Server port
LOG_LEVEL=info                        # Logging level

# Frontend
VITE_API_BASE_URL=http://localhost:4000  # API URL
```

### Implementation
```typescript
// backend/src/config.ts
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  server: {
    port: parseInt(process.env.PORT || '4000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Fail fast if critical env vars missing
if (!config.jwt.secret && config.server.nodeEnv === 'production') {
  throw new Error('JWT_SECRET environment variable is required');
}
```

### Files to Create
1. `.env.example` - Template with all required vars
2. `.env.local` - Local development (git-ignored)
3. `docker-compose.yml` - For containerized dev
4. `.env.production` - Production deployment guide

---

## Decision Summary Table

| ADR | Decision | Status | Priority |
|-----|----------|--------|----------|
| ADR-1 | npm workspaces | ✅ Accepted | N/A |
| ADR-2 | SQLite + Prisma | ✅ Accepted | N/A |
| ADR-3 | JWT Auth | ✅ Accepted | Medium |
| ADR-4 | Vite Proxy | ✅ Accepted | N/A |
| ADR-5 | CSS-in-JS | ✅ Accepted | N/A |
| ADR-6 | Error Mapping | ✅ Accepted | N/A |
| ADR-7 | Playwright E2E | ✅ Accepted | N/A |
| ADR-8 | No User-Task Association | ❌ Reject | CRITICAL |
| ADR-9 | Add User-Task Association | ⚠️ Proposed | CRITICAL |
| ADR-10 | Authorization Middleware | ⚠️ Proposed | HIGH |
| ADR-11 | Rate Limiting | ⚠️ Proposed | HIGH |
| ADR-12 | Environment Configuration | ⚠️ Proposed | HIGH |

---

## Conclusion

The current architecture provides a solid foundation for a modern SPA. However, several security-critical gaps must be addressed before production deployment:

1. **CRITICAL:** Implement user-task association (ADR-9)
2. **CRITICAL:** Add authorization middleware (ADR-10)
3. **HIGH:** Implement rate limiting (ADR-11)
4. **HIGH:** Add environment configuration (ADR-12)

These improvements will transform the MVP into a production-ready system.

---

**Document Version:** 1.0
**Last Updated:** 2026-03-31
**Next Review:** After ADR-9 implementation
