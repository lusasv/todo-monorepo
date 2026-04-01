# Decisoes Arquiteturais

Este arquivo registra as decisoes arquiteturais relevantes tomadas ao longo do desenvolvimento do projeto.

---

## [2026-04-01] Implementar login via numero de telefone com verificacao OTP

### Decisao

Adicionar autenticacao por numero de telefone utilizando o padrao OTP (One-Time Password) entregue via SMS como metodo alternativo ao login por email e senha ja existente.

### Contexto

A aplicacao Todo ja possui autenticacao via email/senha com JWT. A demanda e oferecer um metodo alternativo de acesso que seja mais pratico em dispositivos moveis e nao exija que o usuario memorize uma senha, melhorando a experiencia e aumentando a taxa de conversao de login.

### Abordagem Tecnica

**Fluxo em dois passos:**

1. `POST /auth/phone/request-otp` — usuario informa o numero de telefone; o backend gera um codigo OTP de 6 digitos, armazena o hash no banco (tabela `OtpCode`) e envia via SMS.
2. `POST /auth/phone/verify-otp` — usuario informa o codigo recebido; o backend valida o hash, expiracao e numero de tentativas; em caso de sucesso, emite um JWT identico ao fluxo existente.

**Modelo de dados:**

- Campo `phone` (unico, opcional) adicionado ao modelo `User` existente.
- Novo modelo `OtpCode` para armazenar codigos pendentes com hash, expiracao, tentativas e flag de uso.
- Os campos `email` e `password` do modelo `User` passam a ser opcionais para suportar usuarios que se cadastram apenas via telefone.

**Seguranca:**

- Codigos OTP armazenados como hash (nunca texto plano).
- Expiracao de 5 minutos por codigo.
- Limite de 3 tentativas de verificacao por codigo.
- Rate limiting de 3 solicitacoes por numero em janela de 10 minutos.
- Codigos invalidados apos uso ou esgotamento de tentativas.

**Integracao SMS:**

- Abstracao via interface `SmsService` com implementacoes `MockSmsService` (desenvolvimento/testes) e `TwilioSmsService` (producao).
- Provedor selecionado via variavel de ambiente `SMS_PROVIDER`.
- Credenciais armazenadas exclusivamente em variaveis de ambiente.

### Alternativas Consideradas

- **Login por WhatsApp:** descartado por complexidade de integracao e requisitos adicionais da API do WhatsApp Business.
- **TOTP (Google Authenticator):** descartado por exigir configuracao previa pelo usuario; OTP por SMS e mais acessivel para onboarding.
- **Codigo de 4 digitos:** descartado em favor de 6 digitos para maior entropia e padrao de mercado.

### Consequencias

- Nova migracao Prisma necessaria para adicionar campos e tabela.
- Dependencia externa de provedor SMS (Twilio recomendado para producao).
- Custo operacional por SMS enviado (relevante para escala).
- Schema do `User` torna `email` e `password` opcionais, exigindo revisao das validacoes existentes nos endpoints de registro/login por email.
