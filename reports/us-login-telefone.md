# User Story: Login com Número de Telefone

## Visão Geral
Implementar autenticação alternativa via número de telefone, permitindo que usuários façam login sem necessariamente usar email. Esta feature expande as opções de autenticação e melhora a acessibilidade para usuários que preferem utilizar telefone.

## Descrição da História

**Como** um usuário do aplicativo,
**Quero** fazer login usando meu número de telefone em vez de email,
**Para** que eu tenha uma alternativa de autenticação mais conveniente e flexível.

## Critérios de Aceitação

### Autenticação e Validação
- [ ] Usuário pode registrar-se com email OU telefone (ou ambos)
- [ ] Usuário pode fazer login com número de telefone + senha
- [ ] Número de telefone é validado no formato correto (aceitar múltiplos formatos: +55 11 98765-4321, 11 98765-4321, 11987654321)
- [ ] Número de telefone é armazenado de forma normalizada no banco de dados
- [ ] Cada número de telefone é único no sistema (não pode haver dois usuários com o mesmo telefone)
- [ ] Mensagens de erro especificam se o telefone não foi encontrado ou a senha está incorreta
- [ ] Token JWT é gerado corretamente após autenticação bem-sucedida

### Interface de Usuário
- [ ] Tela de login exibe toggle/tab para selecionar entre "Email" e "Telefone"
- [ ] Campo de entrada de telefone com máscara de formatação automática (visual, não altera valor)
- [ ] Validação em tempo real para números de telefone inválidos
- [ ] Mensagens de erro claras e acessíveis para entrada de telefone
- [ ] Compatibilidade com autofill de telefone do navegador/dispositivo

### Funcionalidade de Registro
- [ ] Tela de registro permite input de número de telefone
- [ ] Campo de telefone é opcional se email foi fornecido
- [ ] Campo de telefone é obrigatório se email não foi fornecido
- [ ] Validação evita duplicação de números de telefone já registrados

### Segurança
- [ ] Número de telefone não é exposto em respostas de erro sensíveis
- [ ] Rate limiting aplicado a tentativas de login por telefone (mesmo que por email)
- [ ] Senhas são criptografadas com bcrypt (sem mudanças no sistema existente)
- [ ] JWT secret continua protegido em variáveis de ambiente

### Compatibilidade
- [ ] Usuários com email + telefone podem fazer login por qualquer um
- [ ] Usuários somente com email continuam funcionando normalmente
- [ ] Usuários somente com telefone funcionam normalmente
- [ ] Banco de dados é migrado sem perder dados existentes

## Regras Técnicas

### Backend (Node.js + Express + TypeScript)

#### Mudanças no Schema Prisma
- Adicionar campo `phone` (String, @unique, opcional) ao modelo User
- Campo email permanece @unique (para suportar ambos)
- Criar migração Prisma para adicionar coluna phone ao banco existente

#### Novos Endpoints
- `POST /auth/login/phone` - Login com telefone + senha
  - Input: `{ phone: string, password: string }`
  - Output: `{ token: string, user: { id, email, name, phone } }`
- `POST /auth/register/phone` - Registro com telefone + senha
  - Input: `{ phone: string, password: string, name?: string }`
  - Output: `{ token: string, user: { id, email, name, phone } }`

#### Validação de Telefone
- Criar função auxiliar de validação `validatePhone(phone: string): { valid: boolean, normalized: string }`
- Aceitar formatos: `+55 11 98765-4321`, `11 98765-4321`, `11987654321`
- Normalizar para formato interno: `55119876543321` (sem formatação)
- Validar comprimento mínimo/máximo apropriado (Brasil: 10-13 dígitos com DDI)

#### Resposta de Erro Consistente
- Não revelar se o telefone existe ou não (segurança)
- Usar mensagem genérica: `"Telefone ou senha inválidos"`

### Frontend (React + Vite + TypeScript)

#### Componente de Login
- Adicionar toggle/tabs para alternar entre "Email" e "Telefone"
- Input de telefone com máscara (visual only, usando biblioteca como `libphonenumber-js`)
- Reutilizar lógica de autenticação existente

#### Componente de Registro
- Similar ao login, permitir seleção de método
- Campo de telefone com validação

#### Testes E2E (Playwright)
- Cenário: login com telefone válido + senha correta
- Cenário: login com telefone inválido + senha
- Cenário: registro com telefone
- Cenário: alternância entre abas email/telefone

## Fora do Escopo

- [ ] Autenticação por SMS (OTP) - será uma história futura
- [ ] Recuperação de conta por telefone - será uma história futura
- [ ] Internacionalização de validação (suportar apenas Brasil nesta versão)
- [ ] Mudança de número de telefone registrado (será feature posterior)
- [ ] Desvinculação de email/telefone - será feature posterior
- [ ] Verificação de telefone (confirmação por SMS/chamada)

## Tarefas Técnicas

### 1. Backend - Banco de Dados
- [ ] Criar migração Prisma para adicionar campo `phone` ao User
- [ ] Testar migração em dev.db sem perder dados
- [ ] Atualizar schema.prisma

### 2. Backend - API
- [ ] Implementar função `validatePhone()` com testes
- [ ] Implementar `POST /auth/login/phone`
- [ ] Implementar `POST /auth/register/phone`
- [ ] Adicionar testes unitários para endpoints
- [ ] Validar CORS e headers

### 3. Frontend - Componentes
- [ ] Refatorar/criar LoginForm para suportar toggle Email/Telefone
- [ ] Adicionar componente de input de telefone com máscara
- [ ] Refatorar/criar RegisterForm
- [ ] Atualizar tipos TypeScript

### 4. Frontend - Testes E2E
- [ ] Atualizar `e2e/login.spec.ts` com cenários de telefone
- [ ] Atualizar `e2e/register.spec.ts` com cenários de telefone
- [ ] Testar em múltiplos viewports

### 5. Documentação
- [ ] Atualizar README com instruções de login por telefone
- [ ] Documentar formatos de telefone aceitos
- [ ] Atualizar API docs com novos endpoints

## Definição de Pronto

- [ ] Código revisado e aprovado em PR
- [ ] Testes unitários passando (backend)
- [ ] Testes E2E passando em múltiplos viewports
- [ ] Sem regressions em login por email
- [ ] Migração Prisma testada e funcionando
- [ ] Validação de telefone cobre casos extremos
- [ ] Documentação atualizada

## Critérios de Teste (QA)

### Testes Manuais - Login

#### Cenário 1: Login com telefone válido
- Ação: Inserir telefone válido (ex: 11 98765-4321) e senha correta
- Esperado: Usuário é autenticado e redirecionado para dashboard
- Token JWT é armazenado localmente

#### Cenário 2: Login com telefone não registrado
- Ação: Inserir telefone válido (ex: 11 91111-1111) e qualquer senha
- Esperado: Erro "Telefone ou senha inválidos"

#### Cenário 3: Login com telefone registrado + senha incorreta
- Ação: Inserir telefone registrado e senha errada
- Esperado: Erro "Telefone ou senha inválidos"

#### Cenário 4: Formatos de telefone alternativos
- Ação: Inserir telefone em diferentes formatos:
  - `+55 11 98765-4321`
  - `11 98765-4321`
  - `11987654321`
- Esperado: Todos devem funcionar (mesma conta)

#### Cenário 5: Validação de telefone inválido
- Ação: Inserir números inválidos (ex: 123, muitos dígitos)
- Esperado: Campo marca como inválido antes de enviar

### Testes Manuais - Registro

#### Cenário 6: Registro com telefone
- Ação: Registrar novo usuário com telefone válido + senha + nome
- Esperado: Usuário criado, token gerado, redirecionado

#### Cenário 7: Registro com telefone duplicado
- Ação: Tentar registrar com telefone já usado
- Esperado: Erro "Telefone já existe"

### Testes API (Backend)

#### POST /auth/login/phone
```
Request: { phone: "11987654321", password: "senha123" }
Response (sucesso):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João",
    "phone": "55119876543210"
  }
}

Response (erro - telefone inválido):
Status: 401
{ "error": "Telefone ou senha inválidos" }
```

#### POST /auth/register/phone
```
Request: { phone: "11987654321", password: "senha123", name: "João" }
Response (sucesso):
Status: 201
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { id: 2, phone: "55119876543210", name: "João", email: null }
}

Response (erro - telefone duplicado):
Status: 400
{ "error": "Telefone já existe" }
```

### Testes E2E (Playwright)

- [ ] Fluxo completo: registro via telefone → login via telefone
- [ ] Login alternando entre abas (email → telefone)
- [ ] Persistência de token após login por telefone
- [ ] Responsividade do input de telefone em mobile/tablet/desktop

## Notas e Considerações

### Internacionalização (Future)
- Atualmente suportar apenas formato brasileiro
- Preparar código para suportar múltiplos países (usar `libphonenumber-js`)

### Performance
- Validação de telefone é rápida (regex ou biblioteca otimizada)
- Índice no banco de dados será criado automaticamente por @unique

### Segurança
- Não expor diferença entre "telefone não existe" vs "senha errada" (ambos retornam mesmo erro)
- Rate limiting deve ser aplicado no endpoint de login por IP/usuário

### Consistência com Email
- Refatorar endpoints de login/registro para suportar ambos os métodos
- Considerar criar endpoints unificados: `/auth/login` (aceita email ou telefone)

## Estimativa

- Backend: 4-6 horas (endpoint + validação + testes)
- Frontend: 3-4 horas (componentes + lógica + testes)
- Testes E2E: 2-3 horas
- Documentação: 1 hora

**Total Estimado: 10-14 horas**

## Referências

- Issue GitHub: #6 (assumido)
- Stack: Node.js (Express, TypeScript), React (Vite), Prisma, SQLite
- Autenticação Atual: JWT + bcrypt
- Biblioteca sugerida para telefone: `libphonenumber-js`
- Data de criação: 2026-03-31
