# CLAUDE.md

## Visão Geral

**Todo** — Aplicação full-stack de gerenciamento de tarefas com autenticação JWT.

Monorepo com backend Express + Prisma e frontend React + Vite. Testes automatizados com Vitest (API) e Playwright (E2E).

## Stack

- **Runtime:** Node.js
- **Backend:** Express 4 — porta 3000
- **Frontend:** React 18 + Vite — porta 5173
- **Banco:** SQLite com Prisma ORM
- **Linguagem:** TypeScript
- **Auth:** JWT + bcrypt
- **Cliente HTTP:** Axios
- **Testes:** Vitest (unitário/integração), Playwright (E2E)

## Estrutura

```
backend/
├── prisma/
│   └── schema.prisma       # Schema do banco
├── src/
│   ├── index.ts            # Entry point
│   └── server.ts           # Configuração do Express
└── test/
    └── app.test.ts         # Testes unitários/integração

frontend/
├── src/
│   ├── App.tsx             # Componente raiz
│   └── main.tsx            # Entry point React
└── index.html              # HTML raiz

e2e/
└── login.spec.ts           # Testes E2E com Playwright

playwright.config.ts        # Configuração Playwright
```

## Comandos

**Desenvolvimento:**
```bash
npm run dev                            # Sobe backend (port 3000) + frontend (port 5173)
npm -w backend run dev                 # Só backend
npm -w frontend run dev                # Só frontend
```

**Build:**
```bash
npm -w backend run build               # Compila TypeScript
npm -w frontend run build              # Build otimizado
npm -w backend run start               # Roda build compilado
```

**Banco de dados:**
```bash
npm -w backend run prisma:generate     # Gera cliente Prisma
npm -w backend run prisma:migrate      # Roda migrations
```

**Testes:**
```bash
npm -w backend run test                # Vitest (backend)
npx playwright test                    # Playwright (E2E)
```

## Convenções

- **Backend:**
  - Controllers/rotas em `src/`
  - Modelos definidos no `prisma/schema.prisma`
  - Use `ts-node-dev` para desenvolvimento (reload automático)
  - Senhas hash com bcrypt antes de salvar

- **Frontend:**
  - Componentes em `src/`
  - Requisições HTTP via Axios
  - Token JWT armazenado localmente (localStorage/sessionStorage)
  - Anexar token no header `Authorization: Bearer <token>`

- **Testes:**
  - Testes unitários/integração em `backend/test/` com Vitest
  - Testes E2E em `e2e/` com Playwright
  - Nomes descritivos: `should...`, `test...`

- **TypeScript:**
  - Sempre tipado (evitar `any`)
  - Interfaces para modelos de dados

## Boas Práticas

1. **Monorepo workspaces** — use `npm -w <workspace> run <script>` ou `npm run <script>` (executa ambas)
2. **CORS habilitado** — backend aceita requisições do frontend
3. **Migrações** — nunca altere schema.prisma sem roddar `prisma migrate dev`
4. **Autenticação** — proteja rotas sensíveis com middleware JWT
5. **Variáveis de ambiente** — use `.env` local (não commit)

## Fluxo típico de feature

1. Defina o schema em `prisma/schema.prisma`
2. Rode `npm -w backend run prisma:migrate`
3. Implemente controller/rota no backend
4. Implemente componente/serviço no frontend
5. Escreva testes em `backend/test/` e `e2e/`
6. Rode `npm run dev` e teste manualmente

## Squad Workflow

This workspace is being operated by a squad of AI agents.

Pipeline:
1. PO
2. TL
3. Backend + Frontend (parallel)
4. QA
5. PR

Flow: PO → TL → [Backend | Frontend] → QA → PR
