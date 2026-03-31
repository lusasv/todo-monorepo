# Documentação da API

## Base URL

```
Development: http://localhost:4000
Production: [configure como necessário]
```

## Authentication

A maioria dos endpoints requer autenticação via JWT.

**Header obrigatório:**
```
Authorization: Bearer <token>
```

O token é obtido através dos endpoints de `/auth/register` ou `/auth/login` e é válido por 7 dias.

## Endpoints

### 1. Health Check

**GET /health**

Retorna o status da API.

**Resposta (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 2. Authentication

#### Register

**POST /auth/register**

Criar uma nova conta de usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha_segura",
  "name": "Nome do Usuário"  // opcional
}
```

**Validação:**
- `email` e `password` são obrigatórios
- `email` deve ser único no banco
- `password` será hasheado com bcrypt antes de salvar

**Resposta (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nome do Usuário"
  }
}
```

**Erros:**
- `400 Bad Request` - Email ou senha faltando
- `400 Bad Request` - Email já existe: `{ "error": "email already exists" }`

---

#### Login

**POST /auth/login**

Autenticar usuário existente.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha_segura"
}
```

**Validação:**
- `email` e `password` são obrigatórios
- Senha deve corresponder ao hash armazenado

**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nome do Usuário"
  }
}
```

**Erros:**
- `400 Bad Request` - Email ou senha faltando: `{ "error": "email and password are required" }`
- `401 Unauthorized` - Email não encontrado: `{ "error": "user not found" }`
- `401 Unauthorized` - Senha incorreta: `{ "error": "invalid password" }`

---

### 3. Tasks

#### Listar Tarefas

**GET /tasks**

Listar todas as tarefas (sem filtro de usuário atualmente).

**Query Parameters:**
- `completed` (opcional): `"true"` ou `"false"` para filtrar por status

**Exemplos:**
```
GET /tasks                    // todas
GET /tasks?completed=true     // apenas completas
GET /tasks?completed=false    // apenas incompletas
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Comprar leite",
    "description": "Leite integral, 1L",
    "dueDate": "2026-04-30T10:00:00.000Z",
    "completed": false,
    "createdAt": "2026-03-31T10:45:00.000Z"
  },
  {
    "id": 2,
    "title": "Enviar relatório",
    "description": null,
    "dueDate": null,
    "completed": true,
    "createdAt": "2026-03-31T09:30:00.000Z"
  }
]
```

---

#### Obter Tarefa Específica

**GET /tasks/:id**

Obter detalhes de uma tarefa pelo ID.

**Parâmetros:**
- `id` (path): ID numérico da tarefa

**Resposta (200 OK):**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Leite integral, 1L",
  "dueDate": "2026-04-30T10:00:00.000Z",
  "completed": false,
  "createdAt": "2026-03-31T10:45:00.000Z"
}
```

**Erros:**
- `404 Not Found` - Tarefa não existe: `{ "error": "not found" }`

---

#### Criar Tarefa

**POST /tasks**

Criar uma nova tarefa.

**Body:**
```json
{
  "title": "Comprar leite",
  "description": "Leite integral, 1L",      // opcional
  "dueDate": "2026-04-30T10:00:00Z"        // opcional, ISO 8601
}
```

**Validação:**
- `title` é obrigatório e deve ser string não-vazia
- `description` deve ser string (opcional)
- `dueDate` deve ser data válida (opcional)

**Resposta (201 Created):**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Leite integral, 1L",
  "dueDate": "2026-04-30T10:00:00.000Z",
  "completed": false,
  "createdAt": "2026-03-31T10:45:00.000Z"
}
```

**Headers de Resposta:**
```
Location: /tasks/1
```

**Erros:**
- `400 Bad Request` - Title faltando ou inválido
- `400 Bad Request` - Description não é string
- `400 Bad Request` - dueDate não é data válida

---

#### Atualizar Tarefa

**PUT /tasks/:id**

Atualizar uma tarefa existente.

**Parâmetros:**
- `id` (path): ID numérico da tarefa

**Body:**
```json
{
  "title": "Comprar leite desnatado",
  "description": "Leite desnatado, 1L",
  "dueDate": "2026-05-01T10:00:00Z",
  "completed": true
}
```

**Validação:**
- Todos os campos são opcionais
- Mesmo comportamento de validação que POST /tasks

**Resposta (200 OK):**
```json
{
  "id": 1,
  "title": "Comprar leite desnatado",
  "description": "Leite desnatado, 1L",
  "dueDate": "2026-05-01T10:00:00.000Z",
  "completed": true,
  "createdAt": "2026-03-31T10:45:00.000Z"
}
```

**Erros:**
- `404 Not Found` - Tarefa não existe

---

#### Deletar Tarefa

**DELETE /tasks/:id**

Deletar uma tarefa.

**Parâmetros:**
- `id` (path): ID numérico da tarefa

**Resposta (204 No Content):**
```
(sem body)
```

**Erros:**
- `404 Not Found` - Tarefa não existe

---

## Estrutura de Resposta de Erro

Todos os erros seguem este padrão:

```json
{
  "error": "Descrição do erro em linguagem clara"
}
```

## Status Codes

| Code | Significado |
|------|-------------|
| 200  | OK - Requisição bem-sucedida |
| 201  | Created - Recurso criado |
| 204  | No Content - Operação bem-sucedida, sem resposta |
| 400  | Bad Request - Validação falhou |
| 401  | Unauthorized - Falha de autenticação |
| 404  | Not Found - Recurso não encontrado |

## Exemplos de Uso (cURL)

### Registrar

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Criar Tarefa

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Comprar leite",
    "description": "Leite integral, 1L",
    "dueDate": "2026-04-30T10:00:00Z"
  }'
```

### Listar Tarefas

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:4000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

## Limitações Atuais

1. **Sem autorização por usuário:** Todas as tarefas são listadas para todos (não há isolamento por usuário)
2. **Sem paginação:** Retorna todas as tarefas em uma única requisição
3. **Sem soft deletes:** Deletar tarefa a remove completamente
4. **Sem refresh tokens:** JWT não pode ser renovado após expiração
5. **Sem rate limiting:** API sem proteção contra abuso
6. **Sem versionamento:** Não há `/api/v1/` prefixo

## Notas de Implementação

- Banco SQLite armazenado em `dev.db` (arquivo local)
- Senhas hasheadas com bcrypt (salt rounds: 10)
- JWT secret padrão: "secret-key-change-in-production" (deve ser alterado em produção)
- CORS habilitado para todas as origens (deve ser restringido em produção)
