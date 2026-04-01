# User Story: Login com Telefone

## Título
Permitir que usuários façam login e cadastro usando número de telefone como método alternativo ao email

## Descrição

Como um **usuário mobile**,
quero **fazer login e cadastro usando meu número de telefone**,
para que **eu tenha uma experiência mais rápida e intuitiva, especialmente em dispositivos móveis onde inserir email é mais trabalhoso**.

## Contexto

Atualmente, o sistema suporta apenas autenticação por email + senha. Este story expande as opções de autenticação para incluir telefone como método alternativo, mantendo a compatibilidade com o sistema JWT existente.

O número de telefone será normalizado e armazenado no banco de dados. Usuários poderão fazer login com telefone OU email, dependendo de sua preferência no momento do cadastro.

## Critérios de Aceitação

### Funcionalidade de Backend

**CA 1:** Adicionar campo `phone` na tabela User
- Campo `phone` deve ser string, único, e opcional
- Migration do Prisma deve ser criada e executada
- Formato: telefone será armazenado normalizado (apenas dígitos, +55 opcionalmente)

**CA 2:** Validar e normalizar número de telefone
- Aceitar formatos: `(11) 98765-4321`, `11 98765-4321`, `11987654321`, `+5511987654321`
- Normalizar para formato padrão: `+5511987654321` (com código do país Brasil)
- Rejeitar números inválidos (menos de 10 dígitos sem código de país)
- Validação no backend (boundary validation) antes de persistir

**CA 3:** Endpoint POST /auth/register-phone
- Recebe: `{ phone: string, password: string, name?: string }`
- Validações:
  - Telefone é obrigatório e deve ser válido
  - Senha é obrigatória
  - Não permitir dois usuários com mesmo telefone
  - Retornar erro específico: `"phone already exists"` se telefone duplicado
  - Retornar erro específico: `"invalid phone format"` se formato inválido
- Resposta de sucesso (201):
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

**CA 4:** Endpoint POST /auth/login-phone
- Recebe: `{ phone: string, password: string }`
- Validações:
  - Telefone e senha são obrigatórios
  - Validar formato do telefone (se inválido, retornar `"invalid phone format"`)
  - Retornar `"phone not found"` se usuário não existe
  - Retornar `"invalid password"` se senha incorreta
- Resposta de sucesso (200):
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

**CA 5:** Manter compatibilidade com endpoints existentes
- POST /auth/login (email) continua funcionando sem mudanças
- POST /auth/register (email) continua funcionando sem mudanças
- Token JWT mantém mesmo formato e expiração (7 dias)

### Funcionalidade de Frontend

**CA 6:** Tela de registro com abas (Telefone / Email)
- Componente LoginForm suporta modo `registerMode` com abas
- Aba "Telefone": campo de telefone + senha + nome
- Aba "Email": campo de email + senha + nome (comportamento atual)
- Usuário escolhe qual método prefere

**CA 7:** Tela de login com abas (Telefone / Email)
- Componente LoginForm suporta modo `loginMode` com abas
- Aba "Telefone": campo de telefone + senha
- Aba "Email": campo de email + senha (comportamento atual)
- Abas com navegação visual clara

**CA 8:** Validação de telefone no frontend
- Aceitar caracteres: dígitos, espaços, parênteses, hífens, +
- Máximo 20 caracteres de entrada
- Feedback em tempo real: "Telefone inválido" se não atender formato mínimo
- Máscara visual opcional (exemplo: `(XX) XXXXX-XXXX`)

**CA 9:** Tratamento de erros específicos
- `"invalid phone format"` → "Formato de telefone inválido. Use (XX) XXXXX-XXXX"
- `"phone already exists"` → "Já existe uma conta com este telefone"
- `"phone not found"` → "Nenhuma conta encontrada com este telefone"
- `"invalid password"` → "Senha incorreta"

**CA 10:** Responsividade
- Design otimizado para mobile (prioridade, já que é o caso de uso principal)
- Abas devem ser claras e fáceis de navegar em touch
- Campo de telefone com teclado numérico em mobile (input type="tel")

### Testes E2E

**CA 11:** Fluxo de registro com telefone
- Navigar para tela de registro
- Clicar aba "Telefone"
- Inserir telefone válido: `(11) 98765-4321`
- Inserir senha: `secret123`
- Inserir nome: `João Silva`
- Clicar botão "Cadastrar"
- Validar: token salvo em localStorage
- Validar: redirecionado para task list

**CA 12:** Fluxo de login com telefone
- Navigar para tela de login
- Clicar aba "Telefone"
- Inserir telefone: `11987654321`
- Inserir senha: `secret123`
- Clicar botão "Entrar"
- Validar: token salvo em localStorage
- Validar: redirecionado para task list

**CA 13:** Validações de telefone inválido
- Inserir telefone com menos de 10 dígitos: erro deve aparecer
- Inserir telefone com caracteres inválidos: erro deve aparecer
- Tentar se registrar com telefone já existente: erro backend

**CA 14:** Manter compatibilidade com login por email
- Fluxo de login por email deve continuar funcionando
- Não deve haver regressão em testes e2e existentes

## Regras Técnicas

- Usar biblioteca `libphonenumber-js` ou similar para validação/normalização de telefone
- Formato padrão de armazenamento: E.164 (`+5511987654321`)
- Não quebrar compatibilidade com autenticação existente (JWT, token storage)
- Validar inputs nas fronteiras do sistema (backend recebe inputs do usuário)
- Seguir convenções do projeto (TypeScript strict, componentes React, Tailwind para CSS)
- Usar variáveis de ambiente para configurações sensíveis
- Manter transações ACID ao persistir usuários (evitar race conditions)

## Critérios de Teste (QA)

### API — Endpoints de Telefone

**Backend**
- GET /health retorna `{ status: "ok" }`
- POST /auth/register-phone com dados válidos retorna 201 + token
- POST /auth/register-phone com telefone duplicado retorna 400 `"phone already exists"`
- POST /auth/register-phone com formato inválido retorna 400 `"invalid phone format"`
- POST /auth/register-phone sem telefone/senha retorna 400
- POST /auth/login-phone com dados válidos retorna 200 + token
- POST /auth/login-phone com telefone inexistente retorna 401 `"phone not found"`
- POST /auth/login-phone com senha incorreta retorna 401 `"invalid password"`
- POST /auth/login-phone com formato inválido retorna 400 `"invalid phone format"`
- Tokens retornados são válidos JWT com expiração 7 dias

**Token Verification**
- Token em Authorization header `Bearer <token>` é validado corretamente
- Token expirado retorna erro apropriado
- Token mal-formado retorna erro

### E2E — Fluxo de Usuário

**Registro com Telefone**
- Clicar aba "Telefone" na tela de registro
- Preencher telefone: `(11) 98765-4321`
- Preencher senha: `test@123`
- Preencher nome: `Test User`
- Clicar "Cadastrar"
- Validar: página redireciona para task list
- Validar: token armazenado em localStorage
- Validar: usuário pode criar e listar tasks

**Login com Telefone**
- Clicar aba "Telefone" na tela de login
- Preencher telefone: `11987654321` (número registrado anteriormente)
- Preencher senha: `test@123`
- Clicar "Entrar"
- Validar: página redireciona para task list
- Validar: token armazenado em localStorage

**Validações no Frontend**
- Inserir `(11) 1234` (muito curto): erro "Formato de telefone inválido"
- Inserir `abc123def`: erro "Formato de telefone inválido"
- Deixar campo vazio: erro "Telefone é obrigatório"

**Tratamento de Erros**
- Telefone não registrado: exibir "Nenhuma conta encontrada com este telefone"
- Telefone duplicado ao registrar: exibir "Já existe uma conta com este telefone"
- Senha incorreta: exibir "Senha incorreta"
- Erro de rede: exibir "Autenticação falhou. Tente novamente."

**Compatibilidade com Email**
- Login por email ainda funciona na aba "Email"
- Registro por email ainda funciona na aba "Email"
- Mesmo usuário pode ser encontrado tanto por email quanto por... (esperar implementação futura: phone fallback)

**Responsividade**
- Testar em viewports: 375px (mobile), 768px (tablet), 1280px (desktop)
- Abas devem ser navegáveis em touch (tamanho mínimo 44x44px)
- Campo de telefone exibe teclado numérico em mobile

## Fora do Escopo

- Login social (Google, Facebook, etc.)
- Verificação OTP via SMS (será future story)
- Recuperação de conta por telefone (será future story)
- Sincronização de conta existente (email) com telefone
- Alteração de telefone após registro (será future story)
- Portabilidade para outros países (foco inicial: Brasil com +55)
- Dark mode (nice-to-have, não requisito)
- Qualquer mudança nos endpoints de tasks (`/tasks`, `/tasks/:id`)

## Definição de Pronto

- Código implementado e revisado
- Testes E2E passando em múltiplos viewports (375px, 768px, 1280px)
- Testes de API cobrindo todos os cenários (sucesso, erro de validação, erro de negócio)
- Nenhuma regressão em funcionalidade de email + senha existente
- Database migrations executadas e reversíveis
- Documentação atualizada (API_CONTRACT.md, arquitetura)
- Performance mantida (sem impacto perceptível em load time)

## Notas Adicionais

- Priorizar mobile-first: o caso de uso principal é usuários mobile
- Considerar internacionalização futura (diferentes códigos de país)
- Validação de telefone deve ser robusta mas não sobre-complexa
- Token JWT permanece o mesmo: não há mudança no mecanismo de autenticação
- Manter compatibilidade backward com logins por email

## Referências Técnicas

- Stack: React + Vite + Tailwind (frontend), Node + Express + TypeScript (backend)
- ORM: Prisma com SQLite
- Testes E2E: Playwright
- Validação: libphonenumber-js (sugestão)
- Autenticação: JWT com bcrypt
- Convenções: Seguir CLAUDE.md do projeto

## Histórico

- 2026-04-01: Criado como User Story para expandir opções de autenticação
- Baseado em: US-5 (Melhorar Tela de Login com email)
- Status: Pronto para desenvolvimento
