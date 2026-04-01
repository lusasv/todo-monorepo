# User Story: Login com Telefone

## Descrição

Permitir que usuários façam login usando seu número de telefone como alternativa ao email. Esta feature expande as opções de autenticação e melhora a acessibilidade para usuários que preferem ou precisam usar telefone como identificador.

---

## História de Usuário

**Como** usuário do aplicativo,  
**Quero** fazer login usando meu número de telefone,  
**Para que** eu tenha uma alternativa mais conveniente ao email como método de autenticação.

---

## Critérios de Aceitação

### Campo de Entrada Flexível

- [ ] O formulário de login exibe um campo único que aceita **email OU número de telefone**
- [ ] O campo apresenta placeholder descritivo: "Email ou telefone"
- [ ] O campo valida o input como email ou telefone automaticamente no client-side
- [ ] Mensagem de validação clara indica qual formato foi detectado ou se ambos são válidos

### Validação de Telefone (Client-side)

- [ ] Telefone válido: formato internacional `+55 (XX) 9XXXX-XXXX` ou variações aceitáveis
- [ ] Telefone válido: formato brasileiros comuns (com ou sem +55, com ou sem formatação)
- [ ] Telefone inválido: menos de 10 dígitos exibe erro "Número de telefone inválido"
- [ ] Telefone inválido: caracteres especiais não numéricos exibem erro apropriado

### Normalização de Telefone

- [ ] Remover espaços, hífens e parênteses do input do usuário antes de enviar ao backend
- [ ] Garantir que o telefone é armazenado no banco de dados em formato normalizado (ex: `+5511987654321`)
- [ ] Aceitar inputs com ou sem o código do país (+55)

### Autenticação com Telefone

- [ ] O endpoint `/auth/login` aceita `phone` como alternativa a `email` no campo identificador
- [ ] Backend valida se o telefone existe na base de usuários
- [ ] Retorna erro específico se telefone não encontrado: `"phone not found"` (status 401)
- [ ] Retorna erro específico se senha inválida: `"invalid password"` (status 401)
- [ ] Retorna token JWT e dados do usuário em caso de sucesso (status 200)

### Registro com Telefone (Opcional no MVP)

- [ ] O formulário de registro permite capturar número de telefone
- [ ] Telefone é campo opcional no registro (email continua obrigatório)
- [ ] Se telefone for fornecido, valida e armazena junto com o usuário
- [ ] Impede registros com telefone duplicado

### Experiência do Usuário

- [ ] Mensagem de erro específica ao usar telefone não registrado: "Nenhuma conta encontrada com este telefone"
- [ ] Mensagem de erro genérica em caso de falha de rede: "Autenticação falhou. Tente novamente."
- [ ] Button mantém estados consistentes (idle, loading) durante requisição
- [ ] Transição suave entre estados de validação
- [ ] Campo limpa automaticamente error messages ao usuário começar a digitar novamente

### Acessibilidade

- [ ] Input tem label conectada via `htmlFor` / `id`
- [ ] Mensagens de erro possuem `role="alert"` para anúncio em screen readers
- [ ] Contraste de cores atende WCAG AA (mínimo 4.5:1)
- [ ] Suporta navegação por teclado (Tab, Enter para submit)

### Responsividade

- [ ] Layout funciona em mobile (< 768px)
- [ ] Layout funciona em tablet (768px - 1023px)
- [ ] Layout funciona em desktop (>= 1024px)
- [ ] Campo mantém tamanho adequado e legível em todos os viewports

### Testes

- [ ] **API**: Requisição POST `/auth/login` com `phone` e `password` retorna token em caso de sucesso
- [ ] **API**: Requisição POST `/auth/login` com telefone não registrado retorna erro 401
- [ ] **API**: Requisição POST `/auth/login` com senha incorreta retorna erro 401
- [ ] **E2E**: Login bem-sucedido com telefone redireciona para lista de tarefas
- [ ] **E2E**: Validação de telefone inválido bloqueia submit
- [ ] **E2E**: Telefone é normalizado corretamente antes de envio ao backend
- [ ] **E2E**: Testes rodam em múltiplos viewports (375px, 768px, 1280px)

---

## Tarefas Técnicas

### Backend

1. **Modelo de Usuário (Prisma)**
   - Adicionar campo `phone` como string nullable na tabela `User`
   - Adicionar índice único opcional em `phone` (sem constraint para permitir múltiplos NULL)
   - Executar migration: `npx prisma migrate dev --name add_phone_to_user`

2. **Endpoint POST /auth/login**
   - Modificar endpoint para aceitar **tanto** `email` quanto `phone` (um deles obrigatório)
   - Adicionar lógica: se `phone` é fornecido, buscar usuário por phone em vez de email
   - Retornar erro específico: `"phone not found"` se telefone não existe
   - Manter compatibilidade com login por email

3. **Endpoint POST /auth/register**
   - Adicionar campo opcional `phone` ao request
   - Validar unicidade do telefone (se fornecido)
   - Armazenar telefone normalizado no banco

4. **Serviço de Validação**
   - Criar função de normalização de telefone: `normalizePhone(input: string): string`
     - Remover espaços, hífens, parênteses
     - Adicionar +55 se não presente (assumir Brasil)
     - Retornar string normalizada como `+5511987654321`
   - Criar função de validação: `isValidPhone(phone: string): boolean`
     - Validar comprimento após normalização (10-13 dígitos)
     - Validar apenas caracteres numéricos e +

### Frontend

1. **Componente LoginForm**
   - Modificar input único que aceita email OU telefone
   - Atualizar placeholder para "Email ou telefone"
   - Implementar detecção automática: email if contains `@`, caso contrário telefone
   - Normalizar telefone antes de enviar ao backend

2. **Validação Client-side**
   - Implementar `isValidEmail(email: string): boolean`
   - Implementar `isValidPhone(phone: string): boolean`
   - Implementar `normalizePhone(input: string): string`
   - Mostrar erro se input não é email válido NEM telefone válido

3. **Mapeamento de Erros**
   - Adicionar mapping: `"phone not found"` → "Nenhuma conta encontrada com este telefone"
   - Manter mappings existentes para email

4. **E2E Tests**
   - Adicionar teste: login bem-sucedido com telefone
   - Adicionar teste: telefone não registrado mostra erro
   - Adicionar teste: normalização de telefone (com/sem máscara, com/sem +55)
   - Manter testes existentes de login por email

5. **Componente RegisterForm** (opcional para MVP)
   - Adicionar campo opcional "Telefone"
   - Validar telefone se fornecido
   - Armazenar telefone normalizado

---

## Definição de Pronto

- [x] Backend: Migration criada e rodada com sucesso
- [x] Backend: Endpoints atualizados e testados
- [x] Frontend: LoginForm aceita telefone
- [x] Frontend: Validação e normalização de telefone funcionam
- [x] E2E: Testes cobrem flows de login com telefone
- [x] Código revisado e aprovado
- [x] Nenhuma regressão em funcionalidade existente (login por email ainda funciona)

---

## Notas Técnicas

1. **Banco de Dados**
   - Campo `phone` pode ser NULL para usuários antigos que não preencheram
   - Índice único em `phone` permite NULL múltiplos (standard SQL behavior)
   - Migração deve ser backward-compatible

2. **Normalização**
   - Assumir Brasil como país padrão (adicionar +55 se não presente)
   - Aceitar variações: `(11) 98765-4321`, `11 98765-4321`, `1198765-4321`, `+55 11 98765-4321`
   - Normalizar para: `+5511987654321` no backend

3. **Validação**
   - Client-side: validação imediata para melhor UX
   - Server-side: validação obrigatória para segurança
   - Telefone brasileiro padrão: 10 (fixo) ou 11 dígitos (celular) + código do país

4. **Compatibilidade**
   - Manter login por email totalmente funcional
   - Novo fluxo não quebra nada existente
   - JWT signature continua igual

5. **Segurança**
   - Nunca expor lista de usuários via endpoint
   - Retornar erro genérico "Autenticação falhou" em caso de network error
   - Validar input no server-side (não confiar em client)

---

## Fora do Escopo

- **Two-factor authentication com SMS** — futuro
- **Recuperação de senha via SMS** — futuro
- **Autenticação com WhatsApp** — futuro
- **Sincronização de telefone com contatos** — futuro
- **Mudança de telefone registrado** — futuro (será outra story)
- **Validação de telefones de outros países** — suporte limitado a Brasil no MVP
- **Integração com serviços de validação SMS** — futuro

---

## Referências

- Stack: React + Vite + TypeScript (frontend), Express + Prisma (backend)
- Autenticação existente: JWT (7 dias)
- Testes: Playwright para E2E
- DB: Prisma ORM com SQLite

---

## Exemplo de Request/Response

### POST /auth/login (com telefone)

**Request**
```json
{
  "phone": "11 98765-4321",
  "password": "secret123"
}
```

**Response (201 Created)**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João Silva",
    "phone": "+5511987654321"
  }
}
```

**Response (401 Unauthorized - phone not found)**
```json
{
  "error": "phone not found"
}
```

**Response (401 Unauthorized - invalid password)**
```json
{
  "error": "invalid password"
}
```
