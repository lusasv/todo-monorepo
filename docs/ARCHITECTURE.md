# Arquitetura do Projeto - Todo App (Monorepo)

## Visão Geral

Este é um aplicativo **Todo App** (gerenciador de tarefas) construído como um **monorepo** com arquitetura cliente-servidor. A aplicação permite que usuários se registrem, façam login e gerenciem uma lista de tarefas.

**Objetivo**: Fornecer uma solução completa e funcional para gerenciamento de tarefas com autenticação por JWT, usando tecnologias modernas.

## Stack de Tecnologias

### Backend
- **Runtime**: Node.js
- **Framework**: Express (v4.18.2)
- **Linguagem**: TypeScript (v5.2.2)
- **Banco de Dados**: SQLite (via Prisma ORM)
- **ORM**: Prisma (v5.0.0)
- **Autenticação**: JWT (jsonwebtoken v9.0.3) + bcrypt (v6.0.0)
- **CORS**: cors (v2.8.5)
- **Desenvolvimento**: ts-node-dev (v2.0.0)
- **Testes**: Vitest (v1.0.0) + Supertest (v6.3.4)

### Frontend
- **Runtime**: Node.js (build time)
- **Framework**: React (v18.2.0)
- **Build Tool**: Vite (v5.0.0)
- **Linguagem**: TypeScript (v5.2.2)
- **HTTP Client**: axios (v1.4.0)
- **UI Icons**: lucide-react (v0.577.0)

### Testes E2E
- **Framework**: Playwright (v1.58.2)
- **Configuração**: playwright.config.ts

### Monorepo
- **Gerenciador de Workspace**: npm workspaces
- **Parallelização**: concurrently (v8.2.0)

## Estrutura de Diretórios

```
repo/
├── backend/                          # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── index.ts                 # Endpoints da API (auth, tasks CRUD)
│   │   └── server.ts                # Inicialização do servidor
│   ├── prisma/
│   │   └── schema.prisma            # Definição do banco de dados
│   ├── test/
│   │   └── app.test.ts              # Testes unitários
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/                         # App React (Vite)
│   ├── src/
│   │   ├── App.tsx                  # Componente principal (dashboard de tarefas)
│   │   ├── LoginForm.tsx            # Componente de login/registro
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── e2e/                             # Testes end-to-end (Playwright)
│   └── login.spec.ts                # Testes de fluxo de login
│
├── docs/                            # Documentação
│   ├── ARCHITECTURE.md              # Este arquivo
│   ├── CONVENTIONS.md               # Convenções do projeto
│   ├── API.md                       # Documentação da API
│   └── DECISIONS.md                 # Decisões técnicas
│
├── package.json                     # Root workspace config
├── playwright.config.ts             # Config dos testes E2E
└── README.md                        # Instruções de início rápido
```

## Modelos de Dados

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   (bcrypt hash)
  name      String?
  createdAt DateTime @default(now())
}
```

### Task
```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  dueDate     DateTime?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

**Nota**: Atualmente, as Tasks não estão associadas a um User específico no schema. Todos os usuários veem todas as tasks.

## Endpoints da API

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

### Tasks (CRUD)
- `GET /tasks` - Listar tarefas (suporta filtro `?completed=true|false`)
- `POST /tasks` - Criar nova tarefa
- `GET /tasks/:id` - Obter tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa

### Health Check
- `GET /health` - Verificar status do servidor

## Fluxo de Autenticação

1. **Registro**: Usuário envia `email` e `password` para `/auth/register`
   - Password é hasheado com bcrypt (salt rounds: 10)
   - JWT token é gerado (expira em 7 dias)
   - Retorna: `{ token, user }`

2. **Login**: Usuário envia credenciais para `/auth/login`
   - Password é validado contra hash
   - JWT token é gerado
   - Token é armazenado no `localStorage` do frontend

3. **Requisições Autenticadas**: Frontend envia token no header `Authorization: Bearer <token>`
   - Backend valida o token (em desenvolvimento, apenas lê o usuário logado do token)

## Fluxo Frontend

1. **Carregamento**:
   - Verifica se existe token no `localStorage`
   - Se há token, renderiza a página de tarefas
   - Se não, renderiza formulário de login

2. **Autenticação**:
   - LoginForm.tsx permite registro ou login
   - Sucesso: salva token no localStorage e renderiza tarefas

3. **Dashboard de Tarefas**:
   - Exibe lista de tasks
   - Permite criar nova tarefa
   - Permite logout

## Configuração do Vite (Frontend)

O frontend possui proxy configurado para chamar o backend em `/api`:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})
```

## Convenções do Projeto

- Código centralizado em TypeScript (sem JavaScript puro)
- Testes com Vitest (backend) e Playwright (E2E)
- Banco de dados com Prisma ORM (migrations automáticas)
- Commits atômicos e descritivos
- Sem hardcoding de secrets (usar variáveis de ambiente)

## Como Executar

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Testes
```bash
# Backend unit tests
npm -w backend run test

# E2E tests
npm run dev  # (executa ambos em paralelo)
npx playwright test
```

## Próximas Melhorias Potenciais

- Associar tasks a usuários específicos (adding userId foreign key)
- Implementar middleware de autenticação
- Adicionar validação de entrada mais robusta
- UI melhorada (estilos, responsividade)
- Paginação para lista de tasks
- Filtros avançados
- Documentação OpenAPI/Swagger

## Status Atual

- ✅ Autenticação com JWT
- ✅ CRUD de tarefas
- ✅ Login/Logout
- ✅ Testes básicos (backend)
- ✅ Testes E2E (login)
- ⚠️ Tasks não segregadas por usuário (TODO)
- ⚠️ Frontend UI minimalista
