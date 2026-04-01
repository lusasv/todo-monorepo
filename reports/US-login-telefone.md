# User Story: Tela de Login com Número de Telefone

## Identificação

**ID:** US-6
**Título:** Tela de Login com Número de Telefone
**Status:** Refinamento
**Data:** 2026-04-01
**Prioridade:** Alta

---

## Descrição Executiva

Atualmente, os usuários podem fazer login apenas com email e senha. Esta história estende a funcionalidade de autenticação para permitir que os usuários façam login usando seu número de telefone, em vez de um email. Esta mudança melhora a acessibilidade e a experiência do usuário, especialmente em mercados onde usuários são mais familiares com login via telefone.

---

## História do Usuário

```
Como um novo usuário,
quero fazer login e registrar-me usando meu número de telefone,
para que eu possa acessar a aplicação sem precisar lembrar de um email.
```

---

## Contexto e Motivação

- **Problema:** Muitos usuários não querem fornecer um email ou preferem usar telefone como identificador único.
- **Oportunidade:** Suportar login via telefone pode aumentar a taxa de conversão e melhorar a inclusão digital.
- **Mercado:** Particularmente relevante em mercados emergentes onde telefone é o identificador principal.

---

## Critérios de Aceitação

### 1. Autenticação com Número de Telefone

**Given** um usuário não possui conta registrada
**When** ele preenche o formulário de registro com número de telefone e senha
**Then** uma nova conta é criada com o número de telefone como identificador único e um token JWT é retornado

**Given** um usuário possui uma conta registrada com telefone
**When** ele preenche o formulário de login com seu número de telefone e senha
**Then** a autenticação é bem-sucedida e um token JWT válido é retornado

### 2. Validação de Número de Telefone

**Given** um usuário está no formulário de login/registro
**When** ele preenche o campo de telefone com um formato inválido
**Then** uma mensagem de validação é exibida: "Digite um número de telefone válido"

**Given** um usuário está no formulário de registro
**When** ele tenta registrar com um número de telefone já existente
**Then** a mensagem de erro é exibida: "Este número de telefone já está registrado"

### 3. Tratamento de Erros

**Given** um usuário tenta fazer login com um número de telefone que não existe
**When** ele submete o formulário
**Then** a mensagem de erro é exibida: "Nenhuma conta encontrada com este número"

**Given** um usuário tenta fazer login com senha incorreta
**When** ele submete o formulário
**Then** a mensagem de erro é exibida: "Senha incorreta"

### 4. Interface do Usuário

**Given** um usuário está na página de login
**When** a página carrega
**Then** ele vê um campo de entrada para número de telefone (em vez de email) com label clara em português

**Given** um usuário está no formulário de registro
**When** a página carrega
**Then** ele vê campos para: número de telefone, nome (opcional), e senha

**Given** um usuário está em um dispositivo móvel
**When** ele clica no campo de telefone
**Then** o teclado numérico nativo do dispositivo é exibido

### 5. Responsividade

**Given** um usuário acessa a aplicação em desktop, tablet ou mobile
**When** ele visualiza a tela de login/registro
**Then** o layout se adapta corretamente mantendo usabilidade em todos os breakpoints

### 6. Acessibilidade

**Given** um usuário usa leitor de tela
**When** ele navega pelo formulário
**Then** todos os campos possuem labels associadas via `htmlFor`/`id` e erros são anunciados com `role="alert"`

### 7. Integração com Token JWT

**Given** um login via telefone é bem-sucedido
**When** o token é retornado
**Then** ele é armazenado em `localStorage` sob a chave `"token"` e segue a mesma vida útil de 7 dias

---

## Requisitos Técnicos

### Backend (Node.js + Express + Prisma)

1. **Schema de Banco de Dados**
   - Adicionar campo `phone` (string, unique, nullable) à entidade `User`
   - Adicionar validação de unicidade no nível do banco de dados
   - Campos `email` e `phone` devem aceitar NULL, mas pelo menos um deve ser preenchido

2. **Endpoints de Autenticação**
   - **POST /auth/register-phone**
     - Request: `{ "phone": "+5511999887766", "password": "...", "name": "..." }`
     - Response: `{ "token": "...", "user": { "id": 1, "phone": "...", "name": "..." } }`
     - Validações:
       - Telefone deve estar em formato internacional ou BR válido
       - Telefone único no banco de dados
       - Senha obrigatória

   - **POST /auth/login-phone**
     - Request: `{ "phone": "+5511999887766", "password": "..." }`
     - Response: `{ "token": "...", "user": { "id": 1, "phone": "...", "name": "..." } }`
     - Erros específicos: `"number not found"`, `"invalid password"`

3. **Validação**
   - Usar biblioteca como `libphonenumber-js` para validação de telefone internacional
   - Normalizar números de telefone (remover espaços, hífens, parênteses)
   - Suportar múltiplos formatos: +55 11 99988-7766, 11 99988-7766, (11) 99988-7766

### Frontend (React + Vite + TypeScript)

1. **Componentes**
   - Criar componente `PhoneLoginForm.tsx` (ou estender `LoginForm.tsx` existente)
   - Componente reutilizável `PhoneInput.tsx` com máscara de entrada
   - Estados: `phone`, `password`, `showPassword`, `loading`, `error`, `isRegister`

2. **Validação Client-side**
   - Validar formato de telefone antes de submeter
   - Validar senha obrigatória
   - Exibir erros específicos com `role="alert"`

3. **Interface**
   - Campo de telefone com máscara (ex: +55 11 99988-7766)
   - Seletor de país/código (ou fixo em +55 se apenas Brasil)
   - Ícone de toggle para mostrar/ocultar senha
   - Estados visuais: idle, loading, error, success

4. **Estilos**
   - Manter consistência com design system existente
   - Responsivo: mobile (<768px), tablet (768-1023px), desktop (>=1024px)
   - Contraste WCAG AA mínimo

### Testes

1. **Testes Unitários (Backend)**
   - Validação de telefone com diferentes formatos
   - Normalização de números
   - Casos de erro: telefone duplicado, telefone não encontrado, senha inválida

2. **Testes E2E (Playwright)**
   - Fluxo completo de registro com telefone
   - Fluxo completo de login com telefone
   - Validação de formato de telefone (erro inline)
   - Erros do backend exibidos corretamente
   - Estado de loading durante requisição
   - Toggle de senha funciona
   - Responsividade em múltiplos viewports (375px, 768px, 1280px)
   - Token armazenado em localStorage após sucesso

---

## Definição de Pronto

- [ ] Backend: Endpoints `/auth/register-phone` e `/auth/login-phone` implementados e testados
- [ ] Backend: Validação de telefone funciona com múltiplos formatos
- [ ] Backend: Erros específicos retornados (não genéricos)
- [ ] Frontend: Componentes `PhoneLoginForm` e `PhoneInput` criados
- [ ] Frontend: Validação client-side funcionando
- [ ] Frontend: Token armazenado em localStorage
- [ ] Frontend: Acessibilidade (labels, alerts) implementada
- [ ] Frontend: Responsividade testada em todos os breakpoints
- [ ] E2E: Testes Playwright cobrem todos os cenários
- [ ] E2E: Testes passam em múltiplos viewports
- [ ] Backend: Sem regressions em endpoints de email (email login ainda funciona)
- [ ] Frontend: Sem regressions em login por email
- [ ] Código revisado e aprovado
- [ ] Documentação de componentes atualizada

---

## Regras Técnicas

1. **Banco de Dados**
   - Campos `email` e `phone` são ambos opcionais, mas usuário deve ter pelo menos um
   - Índices de uniqueness em ambos os campos
   - Migração Prisma deve ser compatível com base de dados existente

2. **Validação de Telefone**
   - Suportar formato internacional: +55 11 99988-7766
   - Suportar formato brasileiro sem código país: 11 99988-7766, (11) 99988-7766
   - Armazenar sempre em formato normalizado (+55XXXXXXXXXXX)

3. **Segurança**
   - Senhas devem ser hasheadas com bcrypt (já implementado para email)
   - Telefone não deve ser transmitido em plain text (HTTPS obrigatório)
   - Rate limiting em endpoints de autenticação

4. **Compatibilidade**
   - Não alterar endpoints existentes `/auth/login` e `/auth/register`
   - Usuários com email continuam funcionando normalmente
   - Permitir futura migração de email para telefone (nice-to-have)

5. **Padrões de Código**
   - Seguir convenções do projeto (TypeScript, nomes em camelCase)
   - Reutilizar componentes e utilities existentes
   - Manter testes com >80% de cobertura

---

## Critérios de Teste (QA)

### Testes Manuais

**Cenário 1: Registro com Telefone**
- [ ] Acesar página de registro
- [ ] Preencher: telefone (+55 11 99988-7766), nome, senha
- [ ] Submeter
- [ ] Verificar redirecionamento para dashboard
- [ ] Verificar token em localStorage

**Cenário 2: Login com Telefone**
- [ ] Acessar página de login
- [ ] Preencher: telefone, senha
- [ ] Submeter
- [ ] Verificar autenticação bem-sucedida

**Cenário 3: Telefone Duplicado**
- [ ] Registrar usuário A com telefone X
- [ ] Tentar registrar usuário B com mesmo telefone X
- [ ] Verificar mensagem de erro: "Este número de telefone já está registrado"

**Cenário 4: Telefone Não Encontrado**
- [ ] Tentar login com telefone inexistente
- [ ] Verificar erro: "Nenhuma conta encontrada com este número"

**Cenário 5: Senha Incorreta**
- [ ] Login com telefone correto + senha errada
- [ ] Verificar erro: "Senha incorreta"

**Cenário 6: Validação de Formato**
- [ ] Preencher campo com número inválido (ex: "123")
- [ ] Verificar erro inline: "Digite um número de telefone válido"

**Cenário 7: Responsividade**
- [ ] Testar em mobile (375px)
- [ ] Testar em tablet (768px)
- [ ] Testar em desktop (1280px)
- [ ] Verificar teclado numérico em mobile

### Testes Automatizados (E2E)

```gherkin
Feature: Phone Number Authentication

  Scenario: Register new user with phone number
    Given I am on the register page
    When I fill phone field with "+5511999887766"
    And I fill name field with "João Silva"
    And I fill password field with "securepass123"
    And I click the register button
    Then I should be logged in
    And the token should be stored in localStorage
    And I should see the task list

  Scenario: Login with phone number
    Given a user with phone "+5511999887766" exists
    When I am on the login page
    And I fill phone field with "+5511999887766"
    And I fill password field with "securepass123"
    And I click the login button
    Then I should be logged in
    And I should see the task list

  Scenario: Invalid phone format shows error
    Given I am on the register page
    When I fill phone field with "invalid"
    And I blur the phone field
    Then I should see error "Digite um número de telefone válido"

  Scenario: Duplicate phone shows error
    Given a user with phone "+5511999887766" exists
    When I try to register with the same phone
    Then I should see error "Este número de telefone já está registrado"

  Scenario: Phone not found shows error
    Given I am on the login page
    When I fill phone field with "+5511988776655"
    And I fill password field with "anypass"
    And I click the login button
    Then I should see error "Nenhuma conta encontrada com este número"

  Scenario: Incorrect password shows error
    Given a user with phone "+5511999887766" exists
    When I am on the login page
    And I fill phone field with "+5511999887766"
    And I fill password field with "wrongpass"
    And I click the login button
    Then I should see error "Senha incorreta"

  Scenario: Password toggle works
    Given I am on the login page
    When I fill password field with "secret123"
    And I click the password toggle icon
    Then the password should be visible as text

  Scenario: Loading state during submission
    Given I am on the login page
    When I fill phone field with "+5511999887766"
    And I fill password field with "securepass123"
    And I click the login button
    Then the button should show "Entrando..."
    And the button should be disabled
    And I should wait for the response
```

### Testes de Acessibilidade

- [ ] Campos possuem labels conectadas via `htmlFor`
- [ ] Erros anunciados com `role="alert"`
- [ ] Contraste de texto: mínimo 4.5:1 (normal), 3:1 (large)
- [ ] Navegação por teclado funciona
- [ ] Teclado numérico em mobile ativo para campo de telefone

---

## Notas Técnicas

1. **Biblioteca de Validação de Telefone**
   - Recomendação: `libphonenumber-js` (lightweight, bem mantida)
   - Alternativa: `awesome-phonenumber`

2. **Máscara de Entrada**
   - Usar `react-imask` ou `react-input-mask` para formatação visual
   - Armazenar valor normalizado no state

3. **Internacionalização Futura**
   - Componente PhoneInput deve aceitar prop `country` para selector de país
   - Consideração para versão 2: suportar múltiplos países além Brasil

4. **Estrutura de Componentes**
   ```
   frontend/src/
   ├── components/
   │   ├── PhoneInput.tsx         (componente reutilizável)
   │   └── PhoneLoginForm.tsx      (ou estender LoginForm)
   └── hooks/
       └── usePhoneValidation.ts   (lógica de validação)
   ```

5. **Backend Structure**
   ```
   backend/src/
   ├── routes/
   │   └── auth.ts                (adicionar endpoints)
   ├── controllers/
   │   └── authController.ts      (lógica de telefone)
   └── utils/
       └── phoneValidator.ts      (validação e normalização)
   ```

---

## Fora do Escopo

- Esqueci a senha via SMS
- Verificação de telefone via OTP (one-time password)
- Seletor de país com dropdown (usar código +55 fixo)
- Suporte a números de múltiplos países (apenas Brasil por enquanto)
- Dark mode
- Alteração do schema de outros endpoints (`/tasks`)
- Integração com WhatsApp ou SMS (apenas banco de dados)
- Login social via telefone (Google, Facebook, etc)

---

## Dependências

- Libphonenumber-js (backend: validação, frontend: opcionalmente para validação adicional)
- Possível atualizar React Input Mask (se não houver)
- Prisma migration (schema update)

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Colisão de dados (email vs phone) | Alto | Adicionar constraints no BD, testes de uniqueness |
| Quebra de login existente | Alto | Manter endpoints /auth/login e /auth/register funcionando |
| UX confusa (2 tipos de login) | Médio | Deixar claro na UI qual campo usar |
| Performance da validação | Baixo | Usar libphonenumber-js (otimizada) e cache |
| Compatibilidade com países | Médio | Documentar, suportar múltiplos formatos, versão 2 expansão |

---

## Casos de Uso Secundários

1. **Migração Futura de Email para Telefone**
   - Usuário com email poderia adicionar telefone depois

2. **Recuperação de Conta**
   - Se esquecer telefone, poderá usar email (caso tenha)

3. **Autenticação de Dois Fatores (Futuro)**
   - SMS com OTP como segundo fator

---

## Links e Referências

- **Projeto:** Monorepo Todo App (React + Node)
- **Story Anterior:** #5 - Melhorar Tela de Login (UI improvements)
- **API Contract:** Baseado em contrato existente, estendido com endpoints de telefone
- **Testes:** Playwright E2E (`e2e/phone-login.spec.ts` novo)

---

## Histórico de Mudanças

| Data | Autor | Versão | Mudanças |
|------|-------|--------|----------|
| 2026-04-01 | PO | 1.0 | Versão inicial |

---

## Aprovação

- **Product Owner:** Pendente
- **Tech Lead:** Pendente
- **Designer:** Pendente
