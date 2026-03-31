# User Story: Login com Número de Telefone

**Issue ID:** us-quero-uma-tela-de-login-com-numero-de-te
**Date Created:** 2026-03-31
**Priority:** High
**Status:** Backlog

---

## Descrição Executiva

Transformar o fluxo de autenticação atual (baseado em email) para um fluxo alternativo baseado em número de telefone com verificação via OTP (One-Time Password). Esta mudança visa melhorar a acessibilidade e oferecer uma opção de login mais conveniente para usuários que preferem autenticação por telefone.

---

## História do Usuário

Como **usuário do aplicativo**,
quero **fazer login usando meu número de telefone em vez de email**,
para que **eu tenha uma alternativa de autenticação mais conveniente e acessível**.

---

## Critérios de Aceitação

### Funcionalidade

- [ ] Tela de login exibe opção de escolher entre **Email** ou **Telefone**
- [ ] Campo de entrada de telefone com máscara de formatação (BR: +55 (XX) 9XXXX-XXXX)
- [ ] Validação de formato de telefone no cliente antes de enviar
- [ ] Após inserir telefone válido, usuário recebe OTP via SMS (teste com backend simulado)
- [ ] Campo de entrada para código OTP com 6 dígitos
- [ ] OTP inserido é validado contra o backend
- [ ] Após OTP correto, usuário é autenticado e recebe token JWT
- [ ] Token JWT é armazenado em `localStorage` com chave `"token"`
- [ ] Mensagens de erro específicas para cada cenário (número não cadastrado, OTP expirado, OTP inválido)

### Interface e UX

- [ ] Dois abas/abas ou toggle switch para alternar entre "Email" e "Telefone"
- [ ] Layout responsivo em mobile (< 768px), tablet (768px-1023px) e desktop (>= 1024px)
- [ ] Campo de telefone com ícone de país/bandeira (BR como padrão)
- [ ] Botão "Enviar OTP" que dispara SMS e muda para tela de verificação
- [ ] Tela de verificação exibe campos de entrada para OTP com feedback visual
- [ ] Timer de contagem regressiva para expiração do OTP (5 minutos recomendado)
- [ ] Link "Reenviar OTP" desabilitado até 30 segundos após o último envio
- [ ] Estados visuais claros: idle, loading, sucesso, erro
- [ ] Feedback visual durante validação (spinner, checkmark, mensagens)
- [ ] Cores e espaçamento consistentes com design do US-5 (Melhorar Tela de Login)

### Validação de Entrada

- [ ] Telefone vazio: "Número de telefone é obrigatório"
- [ ] Telefone com formato inválido: "Insira um número de telefone válido"
- [ ] Telefone com menos de 10 dígitos: "Número de telefone inválido"
- [ ] OTP vazio: "Código de verificação é obrigatório"
- [ ] OTP com menos de 6 dígitos: "Código deve ter 6 dígitos"
- [ ] OTP inválido: "Código de verificação incorreto"
- [ ] OTP expirado: "Código expirou. Solicite um novo"

### Acessibilidade

- [ ] Todos os campos de input possuem labels conectadas via `htmlFor` / `id`
- [ ] Mensagens de erro têm atributo `role="alert"` para screen readers
- [ ] Contraste de cores atende WCAG AA (mínimo 4.5:1)
- [ ] Timer e status de loading são anunciados aos leitores de tela
- [ ] Navegação por teclado funciona (Tab, Shift+Tab, Enter)
- [ ] Campos de OTP aceitam entrada de teclado ou clipe

### Performance

- [ ] Carregamento da página não é impactado
- [ ] Requisições de OTP completam em < 3 segundos
- [ ] Sem renderizações desnecessárias durante entrada de OTP

---

## Requisitos Técnicos

### Backend (Novos Endpoints)

#### POST /auth/phone-register

Registra um novo usuário via telefone.

**Request**
```json
{
  "phone": "+5511987654321",
  "name": "João Silva"
}
```

**Response (200 OK)**
```json
{
  "message": "OTP enviado para seu telefone",
  "sessionId": "uuid-aqui",
  "expiresIn": 300
}
```

**Errors**
- `400 Bad Request`: "phone and name are required"
- `400 Bad Request`: "Invalid phone number"
- `400 Bad Request`: "phone already exists"

---

#### POST /auth/phone-verify

Verifica o OTP e completa o registro/login.

**Request**
```json
{
  "sessionId": "uuid-aqui",
  "phone": "+5511987654321",
  "otp": "123456"
}
```

**Response (200 OK)**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "phone": "+5511987654321",
    "name": "João Silva"
  }
}
```

**Errors**
- `400 Bad Request`: "Invalid OTP"
- `400 Bad Request`: "OTP expired"
- `400 Bad Request`: "sessionId not found"

---

#### POST /auth/phone-resend-otp

Reenvia o OTP para o telefone.

**Request**
```json
{
  "sessionId": "uuid-aqui"
}
```

**Response (200 OK)**
```json
{
  "message": "OTP reenviado",
  "expiresIn": 300
}
```

**Errors**
- `400 Bad Request`: "Too many attempts. Try again in 30 seconds"
- `404 Not Found`: "sessionId not found"

---

### Frontend

**Novos Componentes:**
- `LoginPhoneForm.tsx` - Formulário de entrada de telefone
- `OTPVerification.tsx` - Componente de verificação de OTP
- `PhoneAuthTabs.tsx` - Abas/toggle para Email vs Telefone

**Modificações:**
- `LoginForm.tsx` - Integrar novo tab de autenticação por telefone
- `App.tsx` ou `AuthContext.tsx` - Atualizar fluxo de autenticação para suportar ambos os métodos

**Bibliotecas:**
- `libphonenumber-js` para validação e formatação de telefone (BR)
- Manter compatibilidade com `lucide-react` para ícones

---

## Mapeamento de Erros do Backend

| Erro do Backend | Mensagem do Usuário | Contexto |
|-----------------|-------------------|----------|
| `"phone and name are required"` | "Número de telefone e nome são obrigatórios" | Registro |
| `"Invalid phone number"` | "Insira um número de telefone válido" | Ambos |
| `"phone already exists"` | "Já existe uma conta com este telefone" | Registro |
| `"Invalid OTP"` | "Código de verificação incorreto" | Verificação |
| `"OTP expired"` | "Código expirou. Solicite um novo" | Verificação |
| `"sessionId not found"` | "Sessão expirou. Comece novamente" | Verificação/Reenvio |
| `"Too many attempts"` | "Muitas tentativas. Aguarde 30 segundos" | Reenvio |
| Outro / network error | "Falha na autenticação. Tente novamente" | Qualquer |

---

## Arquitetura e Padrões

### Fluxo de Autenticação por Telefone

```
1. Usuário acessa tela de login
   ↓
2. Seleciona "Telefone" (vs Email)
   ↓
3. Insere número de telefone + nome (novo) ou apenas número (existente)
   ↓
4. Frontend valida formato
   ↓
5. Frontend envia POST /auth/phone-register ou /auth/phone-login
   ↓
6. Backend gera OTP, armazena sessionId e envia SMS
   ↓
7. Frontend exibe tela de verificação com timer
   ↓
8. Usuário insere 6 dígitos do OTP
   ↓
9. Frontend envia POST /auth/phone-verify com sessionId + OTP
   ↓
10. Backend valida OTP, gera JWT e retorna
   ↓
11. Frontend armazena token em localStorage
   ↓
12. Frontend redireciona para dashboard/tarefas
```

### Estado do Componente

```typescript
type PhoneAuthState = {
  phone: string;
  name?: string;
  sessionId?: string;
  otp: string;
  showPassword?: boolean;
  loading: boolean;
  error: string;
  mode: 'phone-entry' | 'otp-verification';
  isNewUser: boolean;
  otpExpiry: number; // timestamp
  otpResendCountdown: number; // segundos
}
```

---

## Requisitos de Teste

### Testes E2E (Playwright)

1. **Fluxo de Registro com Telefone**
   - Seleciona "Telefone"
   - Insere número válido e nome
   - Recebe OTP (simulado)
   - Insere OTP correto
   - É autenticado e redirecionado para dashboard

2. **Fluxo de Login com Telefone (usuário existente)**
   - Seleciona "Telefone"
   - Insere número existente
   - Recebe OTP
   - Insere OTP correto
   - É autenticado

3. **Validação de Telefone**
   - Número vazio mostra erro
   - Número com formato inválido mostra erro
   - Número com menos de 10 dígitos mostra erro

4. **Validação de OTP**
   - OTP vazio mostra erro
   - OTP com menos de 6 dígitos mostra erro
   - OTP incorreto mostra erro após submit
   - OTP expirado mostra erro apropriado

5. **Estados de Loading**
   - Botão desabilitado durante envio de SMS
   - Spinner visível durante verificação de OTP
   - Mensagem "Aguarde, enviando código..." durante requisição

6. **Timer e Reenvio**
   - Timer de 5 minutos visível e decrementando
   - Botão "Reenviar OTP" desabilitado por 30 segundos
   - Botão "Reenviar OTP" habilitado após timeout

7. **Responsividade**
   - Testes em 375px (mobile)
   - Testes em 768px (tablet)
   - Testes em 1280px (desktop)

8. **Alternância Email/Telefone**
   - Abas alternam entre formulários corretamente
   - Estado anterior é preservado ao alternar

---

## Definição de Pronto (Definition of Done)

- [ ] Código revisado e aprovado (Code Review)
- [ ] Testes E2E passando em todos os cenários
- [ ] Testes E2E passando em múltiplos viewports (mobile, tablet, desktop)
- [ ] Sem regressions na funcionalidade de email existente
- [ ] Acessibilidade validada (WCAG AA)
- [ ] Performance não degradada (< 3s para requisições)
- [ ] Documentação de componentes atualizada
- [ ] Tratamento de erros robusto
- [ ] Mensagens de erro traduzidas em PT-BR
- [ ] Feature branch mergeado para main

---

## Restrições e Considerações

### Segurança
- Nunca armazenar OTP em plaintext no banco de dados
- OTP deve ter expiração de 5 minutos
- Limitar tentativas de validação de OTP (máx 5 tentativas)
- Usar HTTPS para todas as requisições de autenticação
- Verificar rate limiting para envio de SMS (máx 3 por hora por número)

### Compatibilidade
- Manter compatibilidade total com fluxo de email existente
- JWT gerado por ambos os fluxos deve ser idêntico
- Não alterar endpoints existentes de `/auth/login` e `/auth/register`
- Banco de dados deve rastrear se usuário foi criado via email ou telefone

### SMS (Simulação em Dev)
- Em environment de desenvolvimento, exibir OTP no console ou em modal
- Em produção, integrar com provedor SMS (ex: Twilio, AWS SNS)
- Considerar custo de SMS ao calcular viabilidade

---

## Fora do Escopo

- Autenticação via redes sociais (Google, Facebook, etc)
- Dois fatores (2FA) adicional
- Mudança ou recuperação de telefone
- Integração real com SMS (usar mock/simulação)
- Suporte a outros países além de Brasil
- Dark mode (já considerado nice-to-have no US-5)
- Alterações aos endpoints existentes de email
- Alterações ao banco de dados schema (usar campos existentes ou adicionar coluna `phone` simples)

---

## Dependências

### Bibliotecas Externas
- `libphonenumber-js@^1.10.0` - Validação e formatação de telefone
- `lucide-react` - Ícones (já usado no projeto)

### Dependências de Features
- Backend deve ter suporte a envio de SMS (mock aceitável em dev)
- Backend deve ter schema para armazenar sessionId + OTP (tabela temporária)
- Backend deve ter suporte a JWT gerado pelo fluxo de telefone

### Dependências de Recursos
- Designer confirmou alinhamento visual com US-5
- Backend pronto para implementar 3 novos endpoints

---

## Estimativa

**Complexidade:** Média
**T-shirt Size:** M (Medium)
**Pontos Story:** 8-13 (a definir por time)

**Breakdown Estimado:**
- Frontend: 5-8 pontos (componentes, validação, testes E2E)
- Backend: 3-5 pontos (endpoints, OTP logic, SMS integration)
- Testes: 2-3 pontos (E2E, validação, edge cases)

---

## Notas e Contexto

- Este é um complemento ao US-5 (Melhorar Tela de Login), não uma substituição
- Mantém estilo visual e padrões de UX estabelecidos no US-5
- A escolha entre Email e Telefone é oferecida como preferência do usuário
- Usuário pode ter conta com ambos email e telefone (caso de migração futura)
- OTP é temporário, não substitui senha permanente
- Integração de SMS real deve ser escalável e com bom custo-benefício

---

## Referências

- **Issue GitHub:** us-quero-uma-tela-de-login-com-numero-de-te
- **Related Story:** US-5 — Melhorar Tela de Login
- **Stack:** React + Vite + TypeScript (frontend), Node + Express + TypeScript (backend)
- **Testes:** Playwright para E2E
- **Auth Method:** JWT (7 dias de validade)
- **Localização:** Brasil (BR) - suporte a formato de telefone brasileira

---

## Histórico de Mudanças

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-03-31 | PO Agent | Criação inicial da story |
