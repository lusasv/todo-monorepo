# User Story: Login com Número de Telefone

## Contexto

Atualmente, o sistema de autenticação permite login apenas com email e senha. Para aumentar a flexibilidade e acessibilidade, precisamos implementar um fluxo alternativo de autenticação que permita os usuários fazer login utilizando seu número de telefone registrado, em vez de email.

---

## Narrativa

**Como** um usuário do aplicativo,
**Quero** fazer login usando meu número de telefone,
**Para** ter uma opção de autenticação mais familiar e acessível, especialmente em contextos mobile.

---

## Critérios de Aceitação

### CA1: Adicionar Campo de Telefone ao Modelo de Usuário
- [ ] Schema Prisma atualizado com campo `phone` (string, único, opcional)
- [ ] Migration criada e executada com sucesso
- [ ] Campo pode armazenar números no formato internacional (ex: +55 11 98765-4321)

### CA2: Endpoint de Registro Aceita Telefone
- [ ] POST `/auth/register` agora aceita campo `phone` (opcional)
- [ ] Se telefone é fornecido, deve ser validado e armazenado
- [ ] Validação: número deve ser único no sistema
- [ ] Resposta inclui `phone` do usuário registrado (se fornecido)

### CA3: Novo Endpoint de Login por Telefone
- [ ] POST `/auth/login-phone` implementado
- [ ] Aceita `{ phone: string, password: string }`
- [ ] Retorna JWT e dados do usuário (sucesso 200)
- [ ] Retorna erro específico se telefone não encontrado (401)
- [ ] Retorna erro específico se senha incorreta (401)
- [ ] Erros diferenciados: "phone not found" vs "invalid password"

### CA4: Frontend - Selector de Método de Login
- [ ] Tela de login exibe two tabs/toggle: "Email" e "Telefone"
- [ ] Componente LoginForm adapta inputs baseado na aba selecionada
- [ ] Estado de aba é mantido durante interação do usuário

### CA5: Frontend - Validação de Telefone
- [ ] Campo de telefone valida formato (apenas dígitos, +, espaços, hífens)
- [ ] Mensagem de erro clara: "Número de telefone inválido"
- [ ] Aceita formatos: +5511987654321, (11) 98765-4321, 11 98765-4321
- [ ] Máximo 15 caracteres (recomendação E.164)

### CA6: Testes E2E - Login por Telefone
- [ ] Teste: login bem-sucedido com telefone + senha correta
- [ ] Teste: erro ao fornecer telefone inválido
- [ ] Teste: erro ao fornecer telefone não registrado
- [ ] Teste: erro ao fornecer senha incorreta com telefone válido
- [ ] Teste: validação de formato de telefone antes de submit

### CA7: Mensagens de Erro Mapeadas
- [ ] Backend error "phone not found" → "Nenhuma conta encontrada com este telefone"
- [ ] Backend error "invalid password" → "Senha incorreta"
- [ ] Erro de formato → "Número de telefone inválido"
- [ ] Erro genérico → "Autenticação falhou. Tente novamente."

### CA8: Compatibilidade com Fluxo Existente
- [ ] Login via email continua funcionando normalmente
- [ ] Registro via email (sem telefone) continua suportado
- [ ] Token JWT mantém mesmo formato e validade (7 dias)
- [ ] Sem breaking changes em endpoints existentes

---

## Histórico de Aceitação

### Funcionalidade
- Campo de telefone é armazenado corretamente no banco
- Requisições POST `/auth/login-phone` retornam token JWT válido
- Token é armazenado em localStorage com chave "token"
- Token é enviado em requisições protegidas: `Authorization: Bearer <token>`

### Design & UX
- Interface clara para escolher entre login por email ou telefone
- Ícone ou rótulo indicando qual método está ativo
- Transição suave entre os dois modos
- Campo de telefone com placeholder: "+55 (11) 98765-4321"
- Validação inline enquanto usuário digita
- Feedback visual imediato para formato inválido

### Validação
- Aceitar números em múltiplos formatos (varia por país)
- Armazenar número normalizado no banco (apenas dígitos + 1º +)
- Comparação case-insensitive para email, mas case-sensitive para telefone
- Não permitir números duplicados

### Responsividade
- Layout desktop: Tabs lado a lado ou stacked confortavelmente
- Layout tablet: Tabs ajustam para viewport 768px–1023px
- Layout mobile: Tabs full-width, campo de telefone expandido

### Testes
- E2E tests passam em todos os viewports (375px, 768px, 1280px)
- Cobertura de validação de telefone
- Cobertura de ambos os fluxos de login (email e telefone)

---

## Tarefas Técnicas

### Backend

#### 1. Atualizar Modelo de Dados
- **Arquivo:** `/backend/prisma/schema.prisma`
- Adicionar campo `phone` ao modelo `User`:
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    phone     String?  @unique
    password  String
    name      String?
    createdAt DateTime @default(now())
  }
  ```
- Criar migration: `npx prisma migrate dev --name add_phone_to_user`

#### 2. Implementar Validação de Telefone (Utility)
- **Arquivo:** `/backend/src/validatePhone.ts` (novo)
- Função: `validatePhoneFormat(phone: string): { valid: boolean; normalized: string }`
- Normalizar para formato E.164 ou apenas dígitos com +
- Aceitar múltiplos formatos de entrada
- Exemplo de formato aceito:
  - +5511987654321
  - +55 11 98765-4321
  - (11) 98765-4321
  - 11 98765-4321

#### 3. Adicionar Validação de Telefone ao Registro
- **Arquivo:** `/backend/src/index.ts`
- Endpoint POST `/auth/register`:
  - Aceitar campo `phone` (opcional)
  - Validar formato se fornecido
  - Verificar unicidade
  - Responder com campo `phone` do usuário

#### 4. Implementar Novo Endpoint de Login por Telefone
- **Arquivo:** `/backend/src/index.ts`
- Endpoint POST `/auth/login-phone`:
  - Request: `{ phone: string, password: string }`
  - Validar formato de telefone
  - Buscar usuário por telefone normalizado
  - Comparar senha com bcrypt
  - Response success: `{ token, user: { id, email, phone, name } }`
  - Response error (404): `{ error: "phone not found" }`
  - Response error (401): `{ error: "invalid password" }`

#### 5. Testes Backend
- Arquivo: `backend/tests/auth.test.ts` (se não existir)
- Testes para validação de telefone
- Testes para novo endpoint `/auth/login-phone`

### Frontend

#### 1. Atualizar Componente de Login
- **Arquivo:** `/frontend/src/components/LoginForm.tsx` ou similar
- Adicionar estado: `loginMethod: "email" | "phone"`
- Adicionar tabs/toggle para escolher método
- Renderizar input diferente baseado em `loginMethod`
- Validação inline específica por método

#### 2. Criar Função de Validação de Telefone
- **Arquivo:** `/frontend/src/utils/validatePhone.ts` (novo)
- Função: `validatePhoneFormat(phone: string): boolean`
- Função: `formatPhoneDisplay(phone: string): string`
- Aceitar múltiplos formatos

#### 3. Chamar Novo Endpoint
- Modificar função de submit em `LoginForm.tsx`
- Se `loginMethod === "phone"`: chamar POST `/auth/login-phone`
- Se `loginMethod === "email"`: chamar POST `/auth/login` (existente)
- Manter comportamento de armazenamento de token

#### 4. Atualizar Testes E2E
- **Arquivo:** `/e2e/login.spec.ts`
- Novo test: "should login successfully with phone number"
- Novo test: "should show error for invalid phone format"
- Novo test: "should show error for phone not found"
- Novo test: "should show error for invalid password (phone)"
- Novo test: "should switch between email and phone tabs"
- Todos os testes executados em 3 viewports

#### 5. UI/UX Considerações
- Usar ícones para indicar método (envelope para email, telefone para phone)
- Placeholder: "+55 (11) 98765-4321"
- Feedback visual de formato inválido em tempo real
- Descrição textual: "Login com telefone" ou ícone com aria-label

---

## Definição de Pronto

- [ ] Migration do Prisma criada e executada localmente
- [ ] Validação de telefone implementada e testada
- [ ] Endpoint `/auth/login-phone` implementado e documentado
- [ ] POST `/auth/register` atualizado para aceitar telefone
- [ ] Frontend: tabs/toggle de método de login implementados
- [ ] Validação frontend de telefone funcionando
- [ ] Testes E2E passando para todos os cenários
- [ ] Testes executados com sucesso em 3 viewports (375px, 768px, 1280px)
- [ ] Sem regressions em login via email
- [ ] Código revisado e aprovado
- [ ] Documentação atualizada (API contract)

---

## Wireframe Textual - Tela de Login Atualizada

```
┌─────────────────────────────────────────┐
│                                         │
│    Logo / App Title                     │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  [📧 Email] [☎️ Telefone]          ││
│  │                                     ││
│  │  Label: Email                       ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ user@example.com              │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  Label: Senha                       ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ ••••••••• [👁️]               │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ Entrar (loading: Entrando...) │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  ⚠️ Erro: Campo de email inválido   ││
│  │                                     ││
│  │  Não tem conta? Cadastre-se        ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘

// Ao clicar na aba "Telefone":

┌─────────────────────────────────────────┐
│                                         │
│    Logo / App Title                     │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  [📧 Email] [☎️ Telefone] (ativo) ││
│  │                                     ││
│  │  Label: Telefone                    ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ +55 (11) 98765-4321           │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  Label: Senha                       ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ ••••••••• [👁️]               │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ Entrar                        │ ││
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  Não tem conta? Cadastre-se        ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## Fluxos de Caso de Uso

### Fluxo 1: Login Bem-Sucedido com Telefone

```
1. Usuário clica na aba "Telefone"
2. Campo de input muda para "Telefone"
3. Usuário digita: "11 98765-4321"
   - Validação inline passa (✓)
4. Usuário digita senha: "minhasenha123"
5. Usuário clica em "Entrar"
6. Frontend normaliza telefone: "+5511987654321"
7. Frontend envia: POST /auth/login-phone { phone, password }
8. Backend valida telefone, busca usuário, compara senha
9. Backend retorna: { token, user }
10. Frontend armazena token em localStorage["token"]
11. Usuário redirecionado para dashboard
```

### Fluxo 2: Telefone Não Registrado

```
1. Usuário seleciona aba "Telefone"
2. Digita: "+55 11 91234-5678"
3. Digita senha: "qualquer123"
4. Clica em "Entrar"
5. Frontend envia POST /auth/login-phone
6. Backend: usuário não encontrado
7. Backend retorna 401: { error: "phone not found" }
8. Frontend mostra erro: "Nenhuma conta encontrada com este telefone"
9. Campo de telefone recebe focus
```

### Fluxo 3: Validação de Formato Inválido

```
1. Usuário seleciona aba "Telefone"
2. Digita: "abc123xyz"
3. Validação inline detecta formato inválido
4. Mensagem de erro aparece: "Número de telefone inválido"
5. Botão "Entrar" permanece desabilitado
6. Usuário não consegue submeter formulário
7. Usuário corrige para: "11 98765-4321"
8. Erro desaparece, botão habilitado
9. Agora pode submeter
```

### Fluxo 4: Registrar Usuário com Telefone

```
1. Usuário clica em "Cadastre-se"
2. Navega para página de registro
3. Preenche: nome, email, telefone (opcional), senha
4. Submete formulário
5. Backend valida e cria usuário com phone
6. Backend retorna token
7. Usuário logado automaticamente
8. Redirecionado para dashboard
```

---

## Requisitos Técnicos

### Validação de Telefone (Backend)

- Aceitar números em formato E.164 (ex: +5511987654321)
- Aceitar números com separadores (ex: +55 (11) 98765-4321)
- Aceitar números nacionais (ex: 11 98765-4321)
- Normalizar para formato único no banco (apenas dígitos + 1º +)
- Máximo 15 caracteres (padrão E.164)
- Mínimo 10 caracteres (após remover não-dígitos, excluindo +)

### Armazenamento no Banco

- Campo `phone` é STRING, UNIQUE, NULLABLE
- Armazenar formato normalizado: "+5511987654321" ou "11987654321"
- Comparação de busca: usar formato normalizado

### JWT e Autenticação

- Token JWT mantém mesma estrutura: `{ userId, iat, exp }`
- Validade: 7 dias
- Armazenamento frontend: `localStorage.setItem("token", token)`
- Envio em requisições: `Authorization: Bearer <token>`

### Segurança

- Senha sempre comparada com bcrypt (sem mudanças)
- Não expor diferença entre "user not found" e "invalid password" no status HTTP (ambos 401)
  - Diferenciação apenas na mensagem de erro JSON
- Validar telefone em todas as entradas (register e login-phone)
- Proteção contra SQL injection: usar ORM Prisma
- Proteção contra brute force: considerar rate limiting em fase futura

---

## Considerações de UX/UI

### Acessibilidade
- [ ] Cada input tem `<label htmlFor>` conectada
- [ ] Aba ativa tem `aria-selected="true"`
- [ ] Erros com `role="alert"` para screen readers
- [ ] Botão de toggle de senha com `aria-label="Mostrar/ocultar senha"`
- [ ] Contraste WCAG AA mínimo (4.5:1 para texto)
- [ ] Fokus visível em todos os elementos interativos

### Responsividade
- **Mobile (<768px)**: Card full-width, padding 16px, botões full-width
- **Tablet (768–1023px)**: Card centrado, max-width 420px
- **Desktop (>=1024px)**: Card centrado, max-width 400px, shadow

### Estados do Componente
- **Idle**: Campos ativados, botão "Entrar" ativo
- **Loading**: Botão desabilitado, mostra "Entrando...", spinner opcional
- **Error**: Mensagem vermelha com `role="alert"`, input com borda vermelha
- **Success**: Redireciona automaticamente (sem pausa)

---

## Considerações de Segurança

1. **Validação de Entrada**: Validar formato de telefone tanto frontend quanto backend
2. **SQL Injection**: Usar ORM Prisma (proteção automática)
3. **Timing Attacks**: Erros "user not found" e "invalid password" levam tempo similar
4. **Brute Force**: Rate limiting não é escopo desta story, mas considerar para futuro
5. **Token Storage**: localStorage é vulnerável a XSS; considerar HttpOnly cookies em futuro
6. **HTTPS**: Assumir que produção usa HTTPS; não transmitir senhas em plain text

---

## Fora do Escopo

- Recuperação de senha (Forgot password)
- Verificação de telefone por SMS (OTP)
- Múltiplos números de telefone por usuário
- Dark mode
- Internacionalização (i18n) de mensagens
- Rate limiting de tentativas de login
- Autenticação com redes sociais (Google, Apple, etc)
- Biometria (Touch ID, Face ID)
- Mudança de telefone/email registrado
- Sincronização com contatos do celular

---

## Estimativa e Esforço

- **Backend**: 3-5 horas (migration, validação, endpoint)
- **Frontend**: 4-6 horas (UI, validação, integração)
- **Testes**: 2-3 horas (E2E + unitários)
- **Review**: 1-2 horas
- **Total**: 10-16 horas (1.5-2 dias com 1 dev)

---

## Referências e Recursos

- [E.164 Phone Format](https://en.wikipedia.org/wiki/E.164)
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) - opcional, para validação avançada
- [Prisma Migrations](https://www.prisma.io/docs/orm/prisma-migrate/overview)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [WCAG 2.1 AA Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Testing](https://playwright.dev/)

---

## Notas Adicionais

- Este story assume que o projeto continua usando Jest para testes unitários e Playwright para E2E
- A validação de telefone pode ser simples (regex) ou complexa (libphonenumber-js); documentar decisão
- Considerar adicionar campo `phone` a respostas de `/auth/login` (email) também para consistência
- Futuro: considerar autenticação passwordless via SMS

