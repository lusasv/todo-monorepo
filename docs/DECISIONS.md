# Architectural Decisions Log

## ADR-001: Support Phone Number Authentication

**Status:** Proposed
**Date:** 2026-04-01
**Deciders:** Product Owner, Technical Lead, Frontend Lead, Backend Lead

### Context

The current authentication system supports email and password only. User research and market analysis indicate that supporting phone number as an alternative authentication method would improve user onboarding and reduce friction, especially in emerging markets where phone numbers are the primary identifier.

### Decision

We will implement phone number-based authentication alongside the existing email-based system. The implementation will include:

1. **Database Schema Extension**
   - Add optional `phone` field to User model (unique, nullable)
   - Both `email` and `phone` can be null, but at least one must be provided
   - Create unique indexes on both fields

2. **New Authentication Endpoints**
   - `POST /auth/register-phone` - Register with phone number
   - `POST /auth/login-phone` - Login with phone number
   - Keep existing `/auth/login` and `/auth/register` unchanged (email-based)

3. **Phone Validation Strategy**
   - Use `libphonenumber-js` for international phone number validation
   - Normalize all phone numbers to E.164 format (+55XXXXXXXXXXX)
   - Support multiple input formats (user-friendly)
   - Focus on Brazil (+55) initially, with extensibility for other countries

4. **Frontend Implementation**
   - Create reusable `PhoneInput` component with input masking
   - Create `PhoneLoginForm` component (can extend existing `LoginForm`)
   - Implement client-side validation before submission
   - Display specific error messages from backend

5. **Security Considerations**
   - Passwords hashed with bcrypt (same as email auth)
   - Rate limiting on authentication endpoints
   - HTTPS mandatory
   - Token-based authentication (JWT) with 7-day expiration

### Rationale

- **User Experience:** Phone number is often more memorable than email
- **Market Relevance:** Particularly important for emerging markets
- **Backward Compatibility:** Existing email-based auth remains unchanged
- **Extensibility:** Architecture supports adding other auth methods (SMS OTP, social login) in the future
- **Proven Pattern:** Phone-based auth is industry standard (WhatsApp, Telegram, etc)
- **Tech Stack Compatibility:** libphonenumber-js is lightweight and well-maintained

### Consequences

**Positive:**
- Improved user onboarding and conversion rates
- Better accessibility for users without email
- Future-proofs system for additional auth methods
- Maintains backward compatibility

**Negative:**
- Slightly increased database complexity (dual identifiers)
- Need to maintain two authentication flows
- More comprehensive testing required
- Potential user confusion about which field to use

**Mitigations:**
- Clear UI messaging (label explains which field to use)
- Comprehensive E2E testing
- Backend validation to prevent conflicts
- Documentation for users

### Alternatives Considered

1. **Replace Email with Phone (Not Selected)**
   - Breaking change, unsuitable for existing users

2. **Add Phone as Optional Profile Field Only (Not Selected)**
   - Doesn't solve primary problem (authentication)

3. **Use SMS OTP Instead (Not Selected)**
   - More complex, requires SMS service integration
   - Can be added later as second factor authentication

### Implementation Timeline

- **Phase 1:** Backend endpoints + database schema
- **Phase 2:** Frontend components + validation
- **Phase 3:** E2E testing and QA
- **Phase 4:** Documentation and deployment

### Related Decisions

- None yet

### Related Issues

- Issue #X: Tela de Login com Número de Telefone
- Story #5: Melhorar Tela de Login (UI improvements only)

---

## ADR-002: Phone Number Format Normalization

**Status:** Proposed
**Date:** 2026-04-01

### Context

Different users will input phone numbers in different formats:
- +55 11 99988-7766 (international with spaces/hyphens)
- 11 99988-7766 (national format)
- (11) 99988-7766 (with area code parentheses)
- 5511999887766 (no formatting)

We need a consistent storage and comparison strategy.

### Decision

All phone numbers will be normalized to and stored in E.164 format (+55XXXXXXXXXXX) in the database:
- Validation happens in backend before storage
- Frontend input mask guides user but stores normalized value
- Frontend and backend share validation logic using `libphonenumber-js`

### Rationale

- E.164 is the international standard for phone numbers
- Eliminates ambiguity in storage and comparison
- Makes database queries predictable
- Simplifies testing (always compare same format)

### Consequences

**Positive:**
- No format ambiguity in database
- International compatibility
- Easy to add support for other countries

**Negative:**
- User sees normalized format in some contexts (UI display can mask this)

**Mitigation:** Format display for user-facing UI using locale settings

### Implementation

```typescript
// Backend normalization example
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const normalized = parsePhoneNumber(userInput, 'BR')?.format('E.164');
```

---

## ADR-003: API Endpoint Design for Phone Authentication

**Status:** Proposed
**Date:** 2026-04-01

### Context

We need to decide how to structure phone authentication endpoints. Options:
1. Separate endpoints: `/auth/login-phone`, `/auth/register-phone`
2. Unified endpoint with type parameter: `/auth/login?type=phone|email`
3. Single flexible endpoint that accepts either phone or email

### Decision

Use separate endpoints:
- `POST /auth/register-phone`
- `POST /auth/login-phone`

This approach is chosen because:
- Clear, RESTful, and easy to understand
- Separates concerns (phone vs email validation logic)
- Allows different rate limiting strategies per auth type
- Easier to test and debug

### Rationale

- Explicitness over implicitness (Python's Zen)
- Doesn't require additional query parameters
- Frontend code is clearer about what endpoint to call
- Can be deprecated independently if needed

### Alternatives

- **Unified endpoint:** More complex validation, parameter-based routing
- **Single flexible endpoint:** Harder to document, more error-prone

### Related

- ADR-001: Support Phone Number Authentication

