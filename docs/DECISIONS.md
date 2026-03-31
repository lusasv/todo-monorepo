# Decisões Arquiteturais

## Visão Geral

Este documento registra decisões de design e arquitetura identificadas no código-fonte da aplicação Todo.

---

## 1. Monorepo com npm Workspaces

**Decisão:** Usar npm workspaces para gerenciar backend e frontend.

**Vantagens:**
- Dependências compartilhadas reduzem tamanho
- Um comando `npm install` para ambos
- Desenvolvimento sincronizado com `npm run dev`
- Mais fácil de refatorar código compartilhado futuramente

**Alternativas consideradas:**
- Lerna/Nx - Complexidade adicional não necessária neste estágio
- Repositórios separados - Dificultaria sincronização

**Impacto:** Estrutura organizacional, facilita desenvolvimento local.

---

## 2. Express.js para Backend

**Decisão:** Usar Express como framework HTTP.

**Vantagens:**
- Minimalista e flexível
- Comunidade grande
- Fácil integração com Prisma
- Baixa curva de aprendizado

**Alternativas consideradas:**
- Fastify - Mais rápido, mas overkill para esta escala
- Nest.js - Muito opinativo para um pequeno projeto

**Impacto:** Padrão de roteamento simples, sem camadas desnecessárias.

---

## 3. Prisma como ORM

**Decisão:** Usar Prisma para gerenciar banco de dados.

**Vantagens:**
- Schema declarativo e type-safe
- Migrations automáticas
- Geração de tipos TypeScript
- Queries intuitivas

**Alternativas consideradas:**
- TypeORM - Mais complexo
- Sequelize - Menos moderno
- SQL puro - Sem type safety

**Impacto:** Migrations em `prisma/migrations/`, schema em `prisma/schema.prisma`.

---

## 4. SQLite para Desenvolvimento Local

**Decisão:** Usar SQLite como banco de dados principal.

**Vantagens:**
- Zero setup, arquivo local
- Perfeito para prototipagem e testes
- Sem servidor externo necessário
- Fácil reset/backup

**Alternativas consideradas:**
- PostgreSQL - Necessariamente para produção, overhead em dev
- MongoDB - NoSQL sem schema, complexo para relações
- MySQL - Mais pesado que SQLite para dev local

**Impacto:** Arquivo `dev.db` ignorado em git, facilita compartilhamento de código.

**Nota de Produção:** Para produção, considerar migrar para PostgreSQL.

---

## 5. JWT para Autenticação

**Decisão:** Usar JSON Web Tokens (JWT) para autenticação stateless.

**Vantagens:**
- Stateless - Não requer armazenamento de sessão
- Escalável horizontalmente
- Pode conter informações de usuário
- Padrão moderno

**Alternativas consideradas:**
- Session cookies - Stateful, não escalável
- OAuth2 - Complexo para um app interno

**Impacto:** Tokens com expiração 7 dias, armazenados em localStorage no frontend.

**Limitações:**
- Sem refresh token mechanism
- Logout não é imediato (token ainda válido até expiração)

---

## 6. bcrypt para Hashing de Senhas

**Decisão:** Usar bcrypt com salt rounds=10.

**Vantagens:**
- Algoritmo adaptativo (resiste a GPU cracking)
- Implementação simples
- Bem testado e confiável

**Alternativas consideradas:**
- Argon2 - Mais moderno, mas sem necessidade complexa
- PBKDF2 - Menos resistente a ataques

**Impacto:** Senhas nunca armazenadas em plaintext.

---

## 7. React com Hooks para Frontend

**Decisão:** Usar React 18 com hooks (useState, useEffect) para state management.

**Vantagens:**
- Comunidade grande
- Curva de aprendizado baixa
- Hooks modernos e simples
- Integração fácil com terceiros

**Alternativas consideradas:**
- Vue - Menos comunidade, mas mais simples
- Angular - Muito opinativo, overkill
- Redux - Não necessário neste estágio

**Impacto:** State local com useState, sem store global necessária.

**Escalação futura:** Se crescer, considerar Context API ou Redux.

---

## 8. Vite como Build Tool

**Decisão:** Usar Vite para build e dev server do frontend.

**Vantagens:**
- Muito rápido (ESM nativo)
- Dev server com hot module reload
- Build otimizado com treeshaking automático
- Configuração mínima

**Alternativas consideradas:**
- Webpack - Mais lento, mais configuração
- Parcel - Menos controle
- Create React App - Abstraído demais

**Impacto:** Configuração simples em `frontend/vite.config.ts`, build em `dist/`.

---

## 9. Axios para HTTP Client

**Decisão:** Usar Axios para chamadas HTTP no frontend.

**Vantagens:**
- API simples e intuitiva
- Interceptadores para headers/auth
- Tratamento de erro padronizado
- Cancelamento de requisições

**Alternativas consideradas:**
- Fetch API - Nativa, mas verbosa
- SWR/React Query - Overhead para este projeto

**Impacto:** Chamadas diretas em componentes React (não há service layer).

---

## 10. Playwright para E2E Testing

**Decisão:** Usar Playwright para testes end-to-end.

**Vantagens:**
- Suporta múltiplos browsers
- Debugging visual
- Fast e confiável
- Bom para testes cross-viewport

**Alternativas consideradas:**
- Cypress - Melhor DX, mas mais lento
- Selenium - Muito baixo nível
- Puppeteer - Chrome only

**Impacto:** Testes em `e2e/`, configuração em `playwright.config.ts`.

---

## 11. CSS-in-JS para Estilização Frontend

**Decisão:** Usar `<style>` tags com CSS inline no componente LoginForm.

**Vantagens:**
- Sem dependências adicionais
- Escopo local ao componente
- Fácil de manter

**Alternativas consideradas:**
- Tailwind CSS - Bom, mas adiciona dependência
- styled-components - Runtime overhead
- CSS modules - Mais verbose

**Impacto:** Componente LoginForm contém todo CSS internamente.

---

## 12. Sem Isolamento de Usuário em Tarefas

**Decisão:** Não implementar autorização por usuário nas tarefas (não há `userId` no schema).

**Justificativa:**
- Escopo inicial simplificado
- Foco em funcionalidade de auth/login
- Pode ser adicionado depois

**Impacto:** Todas as tarefas são visíveis para qualquer usuário autenticado.

**Limitação conhecida:** Não é adequado para produção multi-tenant.

---

## 13. Validação no Backend, Não no Frontend

**Decisão:** Backend implementa todas as validações; frontend apenas para UX.

**Vantagens:**
- Segurança (frontend pode ser bypassado)
- Fonte única de verdade
- Erros mapeados para mensagens amigáveis no frontend

**Impacto:** Frontend valida para feedback rápido; backend valida novamente para segurança.

---

## 14. Sem Logging/Observabilidade Centralizado

**Decisão:** Usar apenas `console.log` para logging.

**Alternativas consideradas:**
- Winston/Bunyan - Overhead para prototipagem
- ELK Stack - Overkill

**Impacto:** Logs aparecem em stdout do servidor.

**Melhorias futuras:** Implementar logging estruturado para produção.

---

## 15. Sem Rate Limiting ou Proteção DDoS

**Decisão:** Não implementar rate limiting inicialmente.

**Justificativa:**
- Prototype de prototipagem
- Pode ser adicionado com express-rate-limit depois

**Impacto:** API não protegida contra abuso.

**Produção:** Implementar rate limiting obrigatoriamente.

---

## 16. Estrutura de Pastas: Colocation vs Separation

**Decisão:** Manter separação entre backend e frontend em pastas distintas.

**Alternativas consideradas:**
- Colocation por feature (ex: `auth/backend.ts` e `auth/frontend.tsx`)
- Separação completa (atual)

**Impacto:** Estrutura clara, mas requer sincronização manual entre layers.

---

## 17. Tipos TypeScript vs Interfaces

**Decisão:** Preferir `type` sobre `interface`.

**Observado no código:**
```typescript
type Task = { ... }
type User = { ... }
```

**Vantagens:**
- Mais simples para tipos de dados
- Union types (`type A = B | C`)
- Mais moderno

**Impacto:** Consistent type definitions.

---

## 18. Tratamento de Erro: Mapeamento Backend → Frontend

**Decisão:** Backend retorna mensagens de erro padronizadas; frontend mapeia para UI.

**Exemplo:**
```typescript
// Backend
{ error: "user not found" }

// Frontend
function mapBackendError(err) {
  switch(err) {
    case "user not found": return "No account found with this email"
    // ...
  }
}
```

**Vantagens:**
- Mensagens backend podem mudar sem quebrar UI
- UX com linguagem amigável

**Impacto:** Manutenção da mapping function em LoginForm.

---

## 19. localStorage para Persistência de Token

**Decisão:** Armazenar JWT em localStorage.

**Alternativas consideradas:**
- sessionStorage - Limpo ao fechar abas
- Cookies HTTP-only - Melhor segurança, mas complexo
- Memory only - Perdido ao refresh

**Impacto:** Token persiste após reload de página.

**Limitação:** Vulnerável a XSS; em produção usar HTTP-only cookies.

---

## 20. Sem Autenticação de Backend Tests

**Decisão:** Tests unitários não autenticam (não usam JWT).

**Justificativa:**
- Simpler testing
- Autenticação testada em E2E

**Impacto:** Backend tests usam Supertest diretamente.

---

## 21. User Story Workflow com Pasta `tasks/`

**Decisão:** Artefatos de user story em `tasks/<id>/` com USER_STORY.md, API_CONTRACT.md, etc.

**Impacto:** Organização clara de requisitos por issue.

---

## 22. Sem Package Locks em Produção

**Decisão:** Commitar package-lock.json para reproducibilidade.

**Impacto:** Builds determinísticos.

---

## Próximas Decisões (Não implementadas)

Estas decisões ainda precisam ser tomadas conforme o projeto escala:

1. **Refresh Tokens** - Implementar mecanismo de token renewal
2. **Database em Produção** - Migração para PostgreSQL
3. **Caching** - Redis para session/token cache
4. **API Versioning** - Adicionar `/api/v1/` prefix
5. **GraphQL vs REST** - Expandir para GraphQL se necessário
6. **Microserviços** - Arquitetura inicialmente monolítica
7. **Containerização** - Docker/Kubernetes para deploy
8. **CI/CD** - GitHub Actions/GitLab CI
9. **Monitoring** - Sentry, DataDog, etc.
10. **Global State Management** - Context API, Redux, ou Zustand se complexidade crescer
