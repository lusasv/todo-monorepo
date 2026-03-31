# Arquitetura do Sistema

## Visão Geral

Trata-se de uma **aplicação de gerenciamento de tarefas (Todo App)** com arquitetura full-stack em **monorepo**, seguindo o padrão cliente-servidor com separação clara entre frontend e backend.

## Stack Tecnológico

### Backend
- **Linguagem:** TypeScript
- **Framework:** Express.js 4.18.2
- **ORM/Database:** Prisma 5.0.0 + SQLite
- **Autenticação:** JWT (jsonwebtoken 9.0.3) + bcrypt (hashing de senhas)
- **Middleware:** CORS
- **Testes:** Vitest + Supertest
- **Build:** TypeScript Compiler (tsc)

### Frontend
- **Linguagem:** TypeScript
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.0
- **HTTP Client:** Axios 1.4.0
- **UI Components:** lucide-react (ícones)
- **Estilização:** CSS-in-JS (styled inline em LoginForm.tsx)

### Testing & DevOps
- **E2E Tests:** Playwright 1.58.2
- **Task Runner:** npm workspaces
- **Dev Server:** ts-node-dev (backend), Vite dev server (frontend)

## Estrutura de Pastas

```
repo/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Aplicação Express principal
│   │   └── server.ts          # Entry point do servidor
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── migrations/        # Migration history
│   ├── test/
│   │   └── app.test.ts        # Testes unitários/integração
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Componente principal (lista de tarefas)
│   │   └── LoginForm.tsx      # Componente de autenticação
│   ├── package.json
│   └── tsconfig.json
├── e2e/
│   └── login.spec.ts          # Testes E2E com Playwright
├── docs/
│   ├── ARCHITECTURE.md        # Este arquivo
│   ├── CONVENTIONS.md
│   ├── API.md
│   └── DECISIONS.md
├── tasks/
│   └── 5/                     # User Story #5: Login Melhorado
│       ├── USER_STORY.md
│       ├── API_CONTRACT.md
│       └── qa-report.md
├── README.md
├── package.json               # Workspace root
├── playwright.config.ts       # Configuração dos testes E2E
└── CLAUDE.md                  # Instruções para agentes IA
```

## Fluxo de Dados

### Fluxo de Autenticação

```
Frontend (LoginForm)
    ↓
POST /api/auth/register
    ↓
Backend (Express)
    ↓
Prisma ORM → SQLite
    ↓
Validação + bcrypt hash
    ↓
Retorna { token, user }
    ↓
Frontend armazena token em localStorage
```

### Fluxo de Gerenciamento de Tarefas

```
Frontend (App)
    ↓
GET /api/tasks + headers: { Authorization: "Bearer <token>" }
    ↓
Backend (Express)
    ↓
Prisma ORM → SQLite
    ↓
Retorna array de Task[]
    ↓
Frontend atualiza estado (React hooks)
```

## Modelos de Dados

### User
```
id          Int      @id @default(autoincrement())
email       String   @unique
password    String   (bcrypt hash)
name        String?  (opcional)
createdAt   DateTime @default(now())
```

### Task
```
id          Int      @id @default(autoincrement())
title       String
description String?  (opcional)
dueDate     DateTime? (opcional)
completed   Boolean  @default(false)
createdAt   DateTime @default(now())
```

## Endpoints da API

### Autenticação
- `POST /auth/register` - Criar novo usuário
- `POST /auth/login` - Autenticar usuário

### Tarefas
- `GET /tasks` - Listar tarefas (com query filter por `completed`)
- `GET /tasks/:id` - Obter tarefa específica
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa

### Health Check
- `GET /health` - Status do servidor

## Características de Segurança

1. **Autenticação JWT:** Tokens com expiração de 7 dias
2. **Hashing de Senhas:** bcrypt com salt round 10
3. **CORS:** Habilitado para permitir chamadas frontend
4. **Validação de Input:** Checkagem de campos obrigatórios nos endpoints
5. **Tratamento de Erros:** Respostas padronizadas com status HTTP apropriados

## Configuração de Ambiente

- **Backend URL:** http://localhost:4000 (default PORT=4000)
- **Frontend URL:** http://localhost:5173 (Vite default)
- **Database:** SQLite local (arquivo dev.db)
- **JWT Secret:** Variável de ambiente `JWT_SECRET` (default: "secret-key-change-in-production")

## Fluxo de Desenvolvimento

1. **Backend**
   ```bash
   npm -w backend run dev  # Inicia ts-node-dev em hot-reload
   ```

2. **Frontend**
   ```bash
   npm -w frontend run dev # Inicia Vite dev server
   ```

3. **Ambos em paralelo**
   ```bash
   npm run dev # Usa concurrently
   ```

## Deployment

- **Backend:** Build com `npm -w backend run build`, inicia com `npm -w backend start`
- **Frontend:** Build com `npm -w frontend run build`, output em `dist/`
- **Database:** Migrations rodadas com `npx prisma migrate deploy`

## Padrões Arquiteturais

1. **Monorepo com npm workspaces** - Compartilhamento de dependências, simplifica desenvolvimento
2. **API RESTful** - Endpoints semânticos, uso apropriado de métodos HTTP
3. **Component-based (React)** - Componentização do LoginForm e App
4. **ORM-first** - Prisma para abstração de banco de dados
5. **Separation of Concerns** - Backend gerencia lógica, frontend gerencia interface

## Próximas Etapas (Não implementado)

- Autenticação com refresh tokens
- Autorização por roles/permissions
- Paginação de tarefas
- Soft deletes
- Logging centralizado
- Rate limiting
- Tratamento de race conditions em updates simultâneos
