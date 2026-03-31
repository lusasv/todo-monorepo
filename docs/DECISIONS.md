# Architectural Decision Records (ADR)

## ADR-001: Phone Number Based Authentication

**Date:** 2026-03-31
**Status:** Proposed
**Context:** User Story "Quero uma tela de login com número de telefone"

### Decision

Implement an alternative authentication flow using phone number + OTP (One-Time Password) as a complement to the existing email-based authentication.

### Rationale

1. **User Accessibility:** Phone numbers are often more accessible than email addresses for some users
2. **Market Fit:** Phone-based auth is common in emerging markets and mobile-first apps
3. **Non-Breaking:** Complements existing email auth; no changes to current login flow
4. **Security:** OTP provides an additional verification layer
5. **User Choice:** Users can choose their preferred authentication method

### Implications

**Positive:**
- Broader user base can authenticate
- Improved user experience for phone-first users
- Can migrate email-only users to phone in future

**Negative:**
- Requires SMS integration (cost consideration)
- Additional endpoints and business logic
- More test coverage needed
- Slightly more complex auth state management

### Technical Approach

- New endpoints: `POST /auth/phone-register`, `POST /auth/phone-verify`, `POST /auth/phone-resend-otp`
- New frontend components: `LoginPhoneForm`, `OTPVerification`, `PhoneAuthTabs`
- Use `libphonenumber-js` for phone validation
- OTP TTL: 5 minutes, max 3 resends per hour
- Rate limiting: 5 OTP attempts before session reset

### Dependencies

- SMS service integration (Twilio, AWS SNS, or mock in dev)
- Phone number validation library
- New database schema (sessionId + OTP table)

### Alternatives Considered

1. **Email + SMS 2FA:** More secure but more friction for users
2. **Phone-only auth:** Would break existing user base
3. **Passwordless magic links:** More complex, requires email service

### Related Stories

- US-5: Melhorar Tela de Login (visual improvements to auth screens)

### Review & Approval

- [ ] Tech Lead Review
- [ ] Security Review
- [ ] Backend Lead Sign-off
- [ ] Frontend Lead Sign-off
