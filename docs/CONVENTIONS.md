# Convenções de Código

## Geral

- **Linguagem:** TypeScript em todo o código (backend e frontend)
- **Formatação:** 2 espaços de indentação (observado nos arquivos existentes)
- **Line Length:** Não há limite rígido, mas preferir manter legível (< 120 caracteres quando possível)

## Backend (Express + TypeScript)

### Estrutura de Arquivo

- Entry point: `src/index.ts` - Define a aplicação Express
- Server setup: `src/server.ts` - Inicia o servidor (port listening)
- Prisma schema: `prisma/schema.prisma` - Define modelos e migrations

### Convenções de Requisição/Resposta

#### Sucesso
- `200 OK` - Para GET, PUT bem-sucedidos
- `201 Created` - Para POST que cria recurso (com header `Location`)
- `204 No Content` - Para DELETE bem-sucedido

#### Erros
- `400 Bad Request` - Validação falhou
- `401 Unauthorized` - Falha de autenticação
- `404 Not Found` - Recurso não existe
- Todos os erros retornam: `{ error: "mensagem descritiva" }`

### Validação de Input

```typescript
// Padrão observado
if (!title || typeof title !== 'string' || title.trim().length === 0) {
  return res.status(400).json({ error: 'title is required and must be a non-empty string' })
}
```

### Autenticação

- JWT com expiração de 7 dias
- Token assinado com `JWT_SECRET` (variável de ambiente)
- Enviado pelo cliente em header: `Authorization: Bearer <token>`

### Tratamento de Erro

```typescript
try {
  // operação
} catch (e) {
  res.status(404).json({ error: "not found" })
}
```

## Frontend (React + TypeScript + Vite)

### Estrutura de Componente

```typescript
interface ComponentProps {
  prop1: string;
  prop2: () => void;
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // lógica
  return <div>...</div>
}
```

### Tipos TypeScript

```typescript
// Definir tipos no topo do arquivo
type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

type User = {
  id: number;
  email: string;
  name: string | null;
}
```

### State Management

- Usar `useState` do React (não há Redux/Context necessário atualmente)
- Guardar token em `localStorage` como fallback para sessão
- Estado local para UI (form inputs, loading, errors)

### Requisições HTTP

```typescript
// Usar axios com headers de autenticação
const res = await axios.post("/api/tasks", { title }, {
  headers: { Authorization: `Bearer ${token}` }
})
```

### Tratamento de Erro

```typescript
try {
  // operação
} catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    const backendError = err.response?.data?.error ?? ""
    // mapear erro para mensagem user-friendly
  } else {
    // erro desconhecido
  }
}
```

### Estilização

- **Preferência:** CSS-in-JS com `<style>` tag (observado em LoginForm.tsx)
- **Estrutura CSS:** Classes utilitárias + BEM para especificidade
- **Cores:** Gradientes e paleta moderna (purples/blues observados)
- **Responsive:** Mobile-first, breakpoints em 768px (tablet) e 1024px (desktop)

### Acessibilidade

```typescript
// Usar aria-labels, aria-describedby, aria-invalid
<input
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={!!error}
/>
<p id="email-error" role="alert">
  {error}
</p>
```

### Validação de Formulário

```typescript
// Validar antes de enviar
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

if (!isValidEmail(email)) {
  setEmailError("Enter a valid email address")
}
```

## Testing

### Backend (Vitest + Supertest)

```typescript
import request from 'supertest'
import app from '../src/index'

describe('API endpoint', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
  })
})
```

**Convenções:**
- Arquivo de teste ao lado do código (`app.test.ts` próximo a `index.ts`)
- Descrever comportamento com `describe` e `it`
- Usar `supertest` para testar a aplicação Express

### Frontend E2E (Playwright)

```typescript
test('should do something', async ({ page }) => {
  await page.goto(BASE_URL)
  await page.fill('#email', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Success')).toBeVisible()
})
```

**Convenções:**
- Arquivo em `e2e/` pasta
- Usar `page.goto`, `page.fill`, `page.click` para interação
- Usar `expect(...).toBeVisible()` para assertions
- Testar em múltiplos viewports (mobile, tablet, desktop)

## Naming Conventions

### Pastas
- `backend/` - Source backend
- `frontend/` - Source frontend
- `e2e/` - Testes end-to-end
- `docs/` - Documentação
- `tasks/` - User stories e artefatos
- `prisma/` - Configuração do ORM

### Arquivos
- `*.ts` - TypeScript files
- `*.tsx` - React components
- `*.test.ts` - Testes unitários
- `*.spec.ts` - Testes E2E

### Variáveis e Funções
- camelCase para variáveis e funções: `fetchTasks`, `setLoading`
- PascalCase para componentes: `LoginForm`, `App`
- UPPER_SNAKE_CASE para constantes: `JWT_SECRET`, `BASE_URL`

### Tipos/Interfaces
- PascalCase: `type Task`, `interface User`

## Git/Commits

Seguir formato observado nos commits:
```
<tipo>: <descrição breve>

<corpo opcional>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Tipos observados:
- `feat:` - Nova feature
- `fix:` - Bug fix
- `refactor:` - Refatoração
- `docs:` - Documentação
- `test:` - Testes
- `US-<N>:` - User Story (ex: `US-5: Login melhorado`)

## Segurança

1. **Variáveis de Ambiente:** Usar `process.env.<VAR_NAME>`
2. **Secrets:** Nunca commitar `.env`, usar `.env.example`
3. **Passwords:** Sempre usar bcrypt antes de salvar
4. **Tokens:** Enviar em Authorization header, nunca em URL
5. **CORS:** Configurar apropriadamente para domínios permitidos

## Performance

1. **Frontend:** Usar React hooks otimizados, evitar renders desnecessários
2. **Backend:** Queries Prisma devem ser específicas (não trazer dados desnecessários)
3. **Bundle:** Vite faz treeshaking automático
4. **Assets:** Ícones com lucide-react (inline SVG)

## Documentação

- Arquivos `.md` em `docs/`
- User stories em `tasks/<N>/USER_STORY.md`
- Contratos de API em `tasks/<N>/API_CONTRACT.md`
- Reports em `reports/`
- README no raiz do projeto

## Padrões Observados no Código

1. **Inline Types:** Tipos definidos com `type` em componentes React
2. **Direct State Management:** useState para gerenciar token e tasks
3. **Axios para HTTP:** Não há wrapper ou service layer (direto no componente)
4. **Styled JSX:** CSS-in-JS com `<style>` tag no componente
5. **Error Mapping:** Erros do backend mapeados para mensagens amigáveis no frontend
