# US-6: Login com Número de Telefone

## Visão Geral

Expandir o sistema de autenticação para permitir que usuários façam login usando seu número de telefone como alternativa ao email. Isso aumenta a flexibilidade de autenticação e melhora a experiência para usuários que preferem usar telefone.

## Histórico de Usuário

```
Como um usuário,
quero fazer login com meu número de telefone,
para que eu tenha uma alternativa ao email na autenticação.
```

## Critérios de Aceitação

### Registro com Telefone

1. **Validação de Telefone**
   - Campo de telefone aceita formato internacional (ex: +55 11 98765-4321)
   - Campo valida se o telefone é único no sistema
   - Erro "phone already exists" retornado se número duplicado

2. **Persistência**
   - Novo campo `phone` adicionado ao modelo User no banco de dados
   - Phone é opcional durante registro (usuário pode usar email ou telefone)
   - Possibilidade de adicionar telefone ao perfil depois (fora do escopo desta US)

### Login com Telefone

1. **Fluxo de Login por Telefone**
   - Novo endpoint `/auth/login-phone` aceita POST com `phone` e `password`
   - Retorna JWT token e dados do usuário (sucesso 200 OK)
   - Retorna erro específico se telefone não encontrado (401 Unauthorized)
   - Retorna erro específico se senha incorreta (401 Unauthorized)

2. **Interface do Usuário**
   - Botão/link "Entrar com Telefone" na tela de login
   - Toggle/aba entre "Email" e "Telefone" como método de autenticação
   - Campo de telefone com máscara/validação visual
   - Mensagens de erro específicas para cada caso de falha

3. **Validação Frontend**
   - Validar formato de telefone antes de submeter (cliente-side)
   - Exibir erro "Telefone inválido" se formato estiver incorreto
   - Telefone é obrigatório quando modo de login é "Telefone"

4. **Backend Validation**
   - Validar que o telefone está em formato aceitável
   - Normalizador de telefone (remover caracteres especiais e espaços)
   - Verificar se telefone existe e se senha está correta
   - Retornar mensagens de erro específicas

### Registro por Telefone

1. **Modo de Registro**
   - Suportar registro usando telefone como identificador principal
   - Campo de telefone obrigatório no registro por telefone
   - Email é opcional (user.email pode ser NULL se registrado por telefone)
   - Ambos email e telefone devem ser únicos

2. **Regras de Negócio**
   - Um usuário pode ter email E telefone
   - Um usuário pode registrar com APENAS telefone
   - Um usuário pode registrar com APENAS email (compatibilidade com fluxo existente)
   - Uma vez registrado, não é possível adicionar/alterar telefone (escopo futuro)

## Critérios de Teste (QA)

### Testes Unitários

- Validação de formato de telefone (números válidos e inválidos)
- Normalização de telefone (remover caracteres especiais)
- Verificação de unicidade de telefone no banco de dados

### Testes de API

**POST /auth/register-phone**
- ✓ Registro com telefone válido retorna 201 com token
- ✓ Registro com telefone duplicado retorna 400 "phone already exists"
- ✓ Registro com telefone inválido retorna 400 "invalid phone format"
- ✓ Registro sem senha retorna 400 "phone and password are required"

**POST /auth/login-phone**
- ✓ Login com telefone válido e senha correta retorna 200 com token
- ✓ Login com telefone não encontrado retorna 401 "phone not found"
- ✓ Login com senha incorreta retorna 401 "invalid password"
- ✓ Login sem telefone/senha retorna 400 "phone and password are required"

### Testes E2E

- ✓ Usuário consegue registrar com telefone
- ✓ Usuário consegue fazer login com telefone
- ✓ Token JWT é armazenado após login com telefone
- ✓ Usuário consegue acessar dashboard após login com telefone
- ✓ Toggle entre modo email/telefone funciona corretamente
- ✓ Validação de telefone inválido exibe erro antes de submeter
- ✓ Mensagem de erro "telefone não encontrado" é exibida
- ✓ Responsividade em diferentes viewports (mobile, tablet, desktop)

## Notas Técnicas

### Backend

- Adicionar campo `phone` (String, @unique, nullable) ao modelo User
- Criar migration Prisma para adicionar coluna
- Implementar endpoint POST `/auth/register-phone`
- Implementar endpoint POST `/auth/login-phone`
- Normalizar número de telefone antes de salvar (apenas dígitos + símbolo +)
- Usar biblioteca `libphonenumber-js` ou similar para validação

### Frontend

- Refatorar LoginForm para suportar toggle email/telefone
- Adicionar componente/hook para validação de telefone
- Aplicar máscara de entrada de telefone (ex: +55 (11) 98765-4321)
- Atualizar tipos TypeScript para User incluir phone opcional
- Manter compatibilidade com login por email existente

### Banco de Dados

```sql
ALTER TABLE User ADD COLUMN phone VARCHAR(20) UNIQUE NULL;
```

## Fora do Escopo

- Autenticação por SMS/OTP (será futuro)
- Dois fatores (2FA)
- Sincronização de telefone com terceiros (Google, Apple)
- Alteração de telefone após registro
- Reset de senha por telefone (futuro)
- Validação de propriedade do telefone via SMS confirmação
- Internacionalização de validação de telefone (apenas formatos básicos)

## Dependências

- Impacto: Schema do banco de dados (nova coluna)
- Impacto: API de autenticação (novos endpoints)
- Impacto: Frontend de login (novos campos e fluxo)

## Definição de Pronto

- [ ] Schema Prisma atualizado com campo `phone`
- [ ] Migration executada com sucesso
- [ ] Endpoints `/auth/register-phone` e `/auth/login-phone` implementados
- [ ] Validação de telefone no backend funcionando
- [ ] UI de login suporta toggle email/telefone
- [ ] Testes unitários passando (validação, normalização)
- [ ] Testes de API passando (register, login, erros)
- [ ] Testes E2E passando em múltiplos viewports
- [ ] Documentação de API atualizada
- [ ] Sem regressions em login por email existente

## Estimativa

- Complexidade: Média
- Story Points: 8 (design + backend + frontend + testes)
