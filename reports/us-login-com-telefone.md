# User Story: Login com Telefone

## Descrição

Como usuário da plataforma, quero fazer login utilizando meu número de telefone em vez de email, para que eu possa acessar a aplicação de forma mais rápida e natural, especialmente em dispositivos móveis, sem necessidade de memorizar um email.

## Contexto

A aplicação atual oferece apenas autenticação via email e senha. A autenticação por telefone com OTP (One-Time Password) via SMS é um padrão amplamente utilizado em aplicações mobile-first, melhorando a experiência do usuário e reduzindo fricção no onboarding. Esta feature complementa o sistema de autenticação existente, mantendo o login por email como opção.

## Critérios de Aceite

### Fluxo de Envio de OTP
- [ ] O usuário vê um formulário de login com abas/toggle para selecionar "Email" ou "Telefone"
- [ ] Ao selecionar "Telefone", o usuário pode inserir um número de telefone no formato E.164 (+5511999999999)
- [ ] O sistema valida o formato do número de telefone antes de enviar
- [ ] Ao clicar em "Enviar Código", uma requisição POST é feita para `/auth/phone/send-otp`
- [ ] Se o número for válido, um código OTP de 6 dígitos é enviado via SMS
- [ ] O usuário recebe feedback de sucesso: "Código enviado para +55 11 99999-9999"
- [ ] Um campo de entrada aparece para o usuário inserir o código OTP recebido
- [ ] Um timer conta regressivamente os 5 minutos até expiração do código
- [ ] O usuário pode solicitar um novo código após 30 segundos (rate limiting no frontend)

### Fluxo de Verificação de OTP
- [ ] O usuário insere o código OTP de 6 dígitos no campo disponibilizado
- [ ] Ao clicar em "Confirmar", uma requisição POST é feita para `/auth/phone/verify-otp`
- [ ] Se o código estiver correto e ainda válido:
  - [ ] Um token JWT é gerado e armazenado no localStorage
  - [ ] Os dados do usuário (id, email, name, phone) são retornados
  - [ ] O usuário é redirecionado para a dashboard
  - [ ] A sessão é estabelecida com sucesso
- [ ] Se o código estiver incorreto:
  - [ ] Uma mensagem de erro clara é exibida: "Código inválido"
  - [ ] O contador de tentativas é incrementado
  - [ ] Após 3 tentativas incorretas, o acesso é bloqueado por 15 minutos
  - [ ] Uma mensagem informando o bloqueio é exibida com opção de reenviar código

### Validações e Segurança
- [ ] O sistema valida o formato E.164 do número de telefone (ex: +5511999999999)
- [ ] O código OTP tem exatamente 6 dígitos numéricos
- [ ] O código OTP é armazenado com hash (bcrypt) no backend, nunca em texto plano
- [ ] O código OTP expira após exatamente 5 minutos
- [ ] O endpoint de envio de SMS possui rate limiting (máx 3 tentativas por 10 minutos por número)
- [ ] O endpoint de verificação possui rate limiting (máx 5 tentativas por minuto por número)
- [ ] Após 3 verificações falhadas consecutivas, bloqueia por 15 minutos
- [ ] Números de telefone duplicados não são permitidos (unique constraint no banco)
- [ ] Um usuário existente pode adicionar telefone à sua conta (link à feature de editar perfil)

### Experiência de Usuário
- [ ] Os campos de entrada têm focus automático ao carregar e após ações bem-sucedidas
- [ ] A interface é responsiva em mobile (viewport 375px) e desktop (1920px)
- [ ] Estados de loading mostram um spinner e desabilitam botões
- [ ] Mensagens de erro aparecem com ícone, cor vermelha e proximity ao campo afetado
- [ ] Mensagens de sucesso aparecem com ícone de checkmark e cor verde
- [ ] O número de telefone é mascarado na exibição: "+55 11 99999-9999"
- [ ] Um botão "Enviar outro código" permite reiniciar o fluxo
- [ ] Um botão "Voltar para login com email" permite alternar de método

### Integração com Sistema Existente
- [ ] O modelo User recebe novo campo `phone` (string, unique, nullable)
- [ ] O modelo User recebe novo campo `phoneVerified` (boolean, default false)
- [ ] Uma nova tabela `OtpSession` armazena sessões de OTP com: id, phone, code (hash), attempt_count, blocked_until, created_at, expires_at
- [ ] O JWT payload inclui o campo `phone` se disponível
- [ ] Um middleware valida o token JWT e restaura a sessão do usuário
- [ ] Login por email e login por telefone retornam exatamente a mesma estrutura de token/user

## Notas Técnicas

### Backend (Express.js + Prisma + SQLite)

**Novos Endpoints:**

1. `POST /auth/phone/send-otp`
   - Body: `{ phone: "+5511999999999" }`
   - Validar formato E.164
   - Verificar rate limiting (máx 3 por 10 minutos)
   - Gerar OTP aleatório (6 dígitos)
   - Hash do OTP com bcrypt (salt: 10)
   - Armazenar em tabela OtpSession
   - Enviar SMS via Twilio (usar env var TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
   - Response: `{ message: "OTP sent", phone_masked: "+55 11 9****9999" }`

2. `POST /auth/phone/verify-otp`
   - Body: `{ phone: "+5511999999999", code: "123456" }`
   - Validar formato E.164
   - Verificar rate limiting (máx 5 por minuto)
   - Buscar OtpSession ativa para o telefone
   - Validar se código não expirou (5 minutos)
   - Validar código com bcrypt.compare
   - Incrementar attempt_count em caso de falha
   - Bloquear se attempt_count >= 3 (set blocked_until = agora + 15 minutos)
   - Se válido:
     - Procurar/criar User com phone
     - Marcar phoneVerified = true
     - Deletar OtpSession
     - Gerar JWT
     - Response: `{ token: "jwt...", user: { id, email, name, phone } }`

**Nova Migração Prisma:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  phone     String?  @unique          // Novo campo
  phoneVerified Boolean @default(false) // Novo campo
  createdAt DateTime @default(now())
}

model OtpSession {
  id           Int      @id @default(autoincrement())
  phone        String
  code         String   // Hash bcrypt
  attemptCount Int      @default(0)
  blockedUntil DateTime?
  createdAt    DateTime @default(now())
  expiresAt    DateTime
  @@index([phone]) // Para queries rápidas
  @@index([expiresAt]) // Para limpeza de expirados
}
```

**Dependências Adicionais:**
- `twilio` (SMS provider)
- `libphonenumber-js` (validação E.164)

### Frontend (React + TypeScript)

**Novo Componente: `PhoneLoginForm.tsx`**
- Tab selector entre "Email Login" e "Phone Login"
- Componente `PhoneInput` com máscara (+55 11 99999-9999)
- Componente `OtpInput` com 6 campos (um para cada dígito)
- Timer regressivo mostrando segundos restantes
- Estados: idle, sending, verifying, blocked, success, error
- Integração com axios para chamar novos endpoints
- Validações em tempo real do número de telefone

**Atualizações em `App.tsx`:**
- Importar novo componente `PhoneLoginForm`
- Manter seletor de método de login (email/phone)
- Reutilizar `onAuthSuccess` existente

### Configuração de Variáveis de Ambiente
```
# Backend
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=3
OTP_BLOCK_DURATION_MINUTES=15
OTP_RATE_LIMIT_WINDOW_MINUTES=10
OTP_RATE_LIMIT_MAX_REQUESTS=3
```

## Regras Técnicas

- Seguir convenções do CLAUDE.md (documentação em `docs/`, commits atômicos)
- Todas as validações devem ser feitas nas duas camadas: frontend (UX) e backend (segurança)
- Usar bcrypt para hash de OTP (nunca armazenar em texto plano)
- Implementar rate limiting no backend com Redis ou em-memory cache
- Evitar over-engineering; usar SQLite conforme stack existente
- OTP deve ser aleatório e criptograficamente seguro (usar `crypto.randomInt()`)
- Não enviar código OTP em resposta de erro (security by obscurity)
- Implementar garbage collection para OtpSession expiradas

## Critérios de Teste (QA)

### Testes Unitários (Vitest)
- [ ] Validação de formato E.164 aceita números válidos (+5511999999999)
- [ ] Validação de formato E.164 rejeita números inválidos (11999999999, 5511999999999)
- [ ] Geração de OTP cria 6 dígitos numéricos aleatórios
- [ ] Hash de OTP com bcrypt é validável
- [ ] Timer regressivo decrementa a cada segundo
- [ ] Rate limiting bloqueia após N tentativas dentro da janela

### Testes de Integração
- `POST /auth/phone/send-otp` com número válido retorna 200
- `POST /auth/phone/send-otp` com número inválido retorna 400
- `POST /auth/phone/send-otp` com rate limit excedido retorna 429
- `POST /auth/phone/verify-otp` com código correto retorna 200 + token
- `POST /auth/phone/verify-otp` com código incorreto retorna 401
- `POST /auth/phone/verify-otp` após 3 tentativas bloqueia por 15 minutos
- User é criado/atualizado após verificação bem-sucedida
- phoneVerified é setado para true
- Código OTP é deletado após verificação bem-sucedida

### Testes E2E (Playwright)
**Cenário 1: Login bem-sucedido com telefone**
- Abrir página de login
- Selecionar abas "Telefone"
- Inserir número +5511999999999
- Clicar "Enviar Código"
- Mensagem de sucesso aparece
- Campo de OTP aparece com focus
- Inserir código OTP correto (mock SMS ou Twilio sandbox)
- Clicar "Confirmar"
- Redirecionado para dashboard
- Token armazenado em localStorage
- Dados do usuário exibidos corretamente

**Cenário 2: Rate limiting de envio (3+ tentativas)**
- Enviar OTP 3 vezes em menos de 10 minutos
- 4ª tentativa retorna erro 429
- Mensagem de erro clara é exibida

**Cenário 3: Código expirado (> 5 minutos)**
- Enviar OTP
- Aguardar > 5 minutos (ou mockar tempo)
- Inserir código válido
- Retorna erro 401 "Código expirado"
- Botão "Reenviar código" fica disponível

**Cenário 4: Bloqueio após 3 tentativas**
- Enviar OTP
- Inserir código incorreto 3 vezes
- Acesso bloqueado por 15 minutos
- Mensagem: "Muitas tentativas. Tente novamente em 15 minutos"
- Botão "Reenviar código" desabilitado até o tempo passar

**Cenário 5: Alternar entre métodos de login**
- Estar em "Phone Login"
- Clicar "Voltar para login com email"
- Formulário muda para email/senha
- Clicar "Ou login com telefone"
- Volta para phone login

**Cenário 6: Validação de número em tempo real**
- Digitar número inválido (ex: "123")
- Erro de validação aparece
- Digitar número válido
- Erro desaparece

## Referência Visual (Figma)

Não há Figma URL especificada na issue. Para adicionar telas de login com telefone ao design system, criar frames em `figma.com/design/<file-key>` com:
- Estado "Idle" — campo de telefone vazio com placeholder
- Estado "Sending" — spinner de carregamento
- Estado "Enter OTP" — 6 campos para dígitos, timer visível
- Estado "Verifying" — spinner de carregamento
- Estado "Error" — mensagem de erro em vermelho
- Estado "Blocked" — mensagem de bloqueio com timer de 15 minutos

## Fora do Escopo

- Autenticação biométrica (Face ID, Touch ID) — considerar em sprint futura
- Verificação de número de telefone via MMS (apenas SMS)
- Integração com redes sociais — separar em outra story
- MFA (multi-factor authentication) além de OTP — separar em outra story
- Alterar número de telefone após registrado — considerar feature de "editar perfil"
- SMS em múltiplos idiomas — usar apenas português
- Backup codes para recuperação — considerar em sprint futura
- Sincronização de telefone com contatos do dispositivo — fora do escopo
- Suporte a eSIM ou números virtuais — usar apenas números reais

## Definição de Pronto

- [ ] Código implementado e revisado (TL review)
- [ ] Testes unitários com cobertura > 80%
- [ ] Testes de integração para ambos endpoints
- [ ] Testes E2E cobrindo 5+ cenários (Playwright)
- [ ] Banco de dados migrado (Prisma migrations)
- [ ] Documentação de API atualizada em `docs/API.md`
- [ ] Decisão arquitetural registrada em `docs/DECISIONS.md`
- [ ] Variáveis de ambiente documentadas em `.env.example`
- [ ] Nenhuma senha/token Twilio em código ou logs
- [ ] Build passa sem warnings
- [ ] Lint passa (ESLint + Prettier)
- [ ] Feature branch deletada após merge
- [ ] Deployed em staging sem erros

---

**Story Points:** 13 (Large feature: novo endpoint, banco, validações, frontend, testes)

**Sprint:** Current

**Priority:** High

**Labels:** authentication, mobile-first, backend, frontend
