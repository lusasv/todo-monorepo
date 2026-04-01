# Architecture Decision Log

## [2026-04-01] Login com Telefone via OTP SMS

**Decisão:** Implementar autenticação por telefone usando OTP enviado via SMS, como método alternativo ao login por email.

**Justificativa:** Melhora a experiência do usuário mobile, reduz fricção no onboarding e aumenta a taxa de conversão. OTP via SMS é um padrão amplamente adotado e de fácil implementação com serviços como Twilio ou AWS SNS.

**Impacto:** Novo endpoint de autenticação (`/auth/phone/send-otp` e `/auth/phone/verify-otp`), integração com provedor de SMS (Twilio), nova tabela `OtpSession` no banco de dados, campos `phone` e `phoneVerified` no modelo `User`.

**Alternativas consideradas:**
- WhatsApp OTP — descartado por custo e complexidade de integração
- Email OTP — já existe login por email; OTP por telefone agrega canal diferente
- Magic link via SMS — descartado por limitações de caracteres no SMS e UX menos familiar

**Autor:** PO Agent (FusionCode Squad)
