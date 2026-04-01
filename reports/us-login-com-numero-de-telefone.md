# User Story: Login com Numero de Telefone

**ID:** US-6
**Data de criacao:** 2026-04-01
**Status:** Pronto para desenvolvimento

---

## Descricao

**Como** usuario da aplicacao Todo,
**Quero** poder fazer login utilizando meu numero de telefone com verificacao via codigo OTP (One-Time Password),
**Para que** eu possa acessar minha conta de forma alternativa ao email/senha, com maior praticidade e seguranca em dispositivos moveis.

---

## Contexto

Atualmente a aplicacao suporta autenticacao via email e senha com JWT. O fluxo existente esta implementado nos endpoints `POST /auth/register` e `POST /auth/login`, e no componente `LoginForm.tsx` no frontend. O objetivo desta story e adicionar o numero de telefone como metodo alternativo de autenticacao, sem remover o metodo existente.

O fluxo OTP funciona em dois passos:
1. Usuario informa o numero de telefone e solicita o codigo.
2. Usuario informa o codigo recebido via SMS para confirmar identidade e receber o token JWT.

---

## Criterios de Aceitacao

### Cenario 1: Solicitar codigo OTP com numero de telefone valido

**Dado** que o usuario esta na tela de login
**E** seleciona a opcao "Entrar com telefone"
**Quando** informa um numero de telefone valido no formato brasileiro (ex.: +55 11 91234-5678)
**E** clica em "Enviar codigo"
**Entao** o sistema envia um codigo OTP de 6 digitos via SMS para o numero informado
**E** exibe a tela de insercao do codigo com mensagem de confirmacao informando o numero mascarado (ex.: "+55 11 ***45-5678")
**E** o codigo OTP expira em 5 minutos

---

### Cenario 2: Autenticar com codigo OTP valido

**Dado** que o usuario recebeu o codigo OTP no celular
**Quando** informa o codigo de 6 digitos corretamente dentro do prazo de validade
**E** clica em "Verificar"
**Entao** o sistema autentica o usuario com sucesso
**E** retorna um token JWT valido com expiracao de 7 dias
**E** o usuario e redirecionado para a tela principal da aplicacao

---

### Cenario 3: Codigo OTP invalido

**Dado** que o usuario esta na tela de verificacao do codigo
**Quando** informa um codigo OTP incorreto
**Entao** o sistema exibe a mensagem de erro "Codigo invalido. Verifique o SMS e tente novamente."
**E** o usuario pode tentar novamente ate o limite de 3 tentativas

---

### Cenario 4: Codigo OTP expirado

**Dado** que o usuario esta na tela de verificacao do codigo
**Quando** tenta verificar um codigo com mais de 5 minutos de emissao
**Entao** o sistema exibe a mensagem "Codigo expirado. Solicite um novo codigo."
**E** oferece opcao de reenvio do codigo

---

### Cenario 5: Numero de telefone nao cadastrado (primeiro acesso)

**Dado** que o usuario informa um numero de telefone que nao esta associado a nenhuma conta existente
**Quando** o codigo OTP e verificado com sucesso
**Entao** o sistema cria automaticamente uma nova conta associada ao numero de telefone
**E** autentica o usuario retornando um token JWT
**E** o usuario e redirecionado para a tela principal

---

### Cenario 6: Rate limiting - muitas solicitacoes de OTP

**Dado** que o usuario (ou atacante) tenta solicitar multiplos codigos para o mesmo numero
**Quando** o limite de 3 solicitacoes por numero em uma janela de 10 minutos e atingido
**Entao** o sistema bloqueia novas solicitacoes para aquele numero por 10 minutos
**E** retorna HTTP 429 com a mensagem "Muitas tentativas. Aguarde antes de solicitar novo codigo."

---

### Cenario 7: Numero de telefone invalido

**Dado** que o usuario informa um numero de telefone com formato invalido
**Quando** tenta enviar o codigo
**Entao** o sistema exibe a mensagem de erro inline "Numero de telefone invalido. Use o formato +55 XX XXXXX-XXXX"
**E** nao envia nenhum SMS

---

### Cenario 8: Alternar entre login por email e por telefone

**Dado** que o usuario esta na tela de login
**Quando** clica em "Entrar com telefone" ou "Entrar com email"
**Entao** o formulario alterna entre os dois modos sem perda de dados ou estado de erro

---

## Requisitos Tecnicos

### Backend

#### Alteracoes no schema (Prisma)

```prisma
model User {
  id          Int       @id @default(autoincrement())
  email       String?   @unique   // torna opcional para suportar usuarios so com telefone
  phone       String?   @unique   // novo campo
  password    String?             // torna opcional para usuarios sem senha
  name        String?
  createdAt   DateTime  @default(now())
}

model OtpCode {
  id          Int       @id @default(autoincrement())
  phone       String
  code        String    // armazenar hash do codigo, nao texto plano
  expiresAt   DateTime
  attempts    Int       @default(0)
  used        Boolean   @default(false)
  createdAt   DateTime  @default(now())

  @@index([phone])
}
```

#### Novos endpoints de API

**POST /auth/phone/request-otp**

Solicita o envio de um codigo OTP para o numero informado.

Request body:
```json
{
  "phone": "+5511912345678"
}
```

Respostas:
- `200 OK` — codigo enviado com sucesso
  ```json
  { "message": "Codigo enviado para +55 11 ***45-5678" }
  ```
- `400 Bad Request` — numero invalido
  ```json
  { "error": "invalid phone number" }
  ```
- `429 Too Many Requests` — rate limit atingido
  ```json
  { "error": "too many requests", "retryAfter": 600 }
  ```

---

**POST /auth/phone/verify-otp**

Verifica o codigo OTP e autentica o usuario.

Request body:
```json
{
  "phone": "+5511912345678",
  "code": "123456"
}
```

Respostas:
- `200 OK` — autenticacao bem-sucedida
  ```json
  {
    "token": "<jwt>",
    "user": { "id": 1, "phone": "+5511912345678", "name": null }
  }
  ```
- `400 Bad Request` — dados ausentes ou invalidos
  ```json
  { "error": "phone and code are required" }
  ```
- `401 Unauthorized` — codigo incorreto
  ```json
  { "error": "invalid code" }
  ```
- `401 Unauthorized` — codigo expirado
  ```json
  { "error": "expired code" }
  ```
- `429 Too Many Requests` — limite de tentativas de verificacao atingido
  ```json
  { "error": "too many attempts" }
  ```

---

#### Logica de negocio no backend

- Gerar codigo OTP de 6 digitos numericos aleatorios com `crypto.randomInt`
- Armazenar **hash** do codigo (bcrypt ou SHA-256) no banco, nunca o valor em texto plano
- O codigo expira em 5 minutos (`expiresAt = now + 5min`)
- Invalidar codigos anteriores do mesmo numero ao emitir novo codigo
- Limite de 3 tentativas de verificacao por codigo; apos isso, o codigo e invalidado
- Rate limiting: maximo 3 solicitacoes de OTP por numero em janela de 10 minutos (usar contador em memoria ou tabela auxiliar)
- Apos verificacao bem-sucedida, marcar o codigo como `used = true`
- Criar usuario automaticamente se o numero nao existir no banco

#### Integracao com servico de SMS

- Usar variavel de ambiente `SMS_PROVIDER` para selecionar o provedor (ex.: `twilio`, `mock`)
- Em ambiente de desenvolvimento/teste, usar provider `mock` que loga o codigo no console em vez de enviar SMS
- Credenciais do Twilio (ou outro provedor) via variaveis de ambiente:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
- Abstracao via interface `SmsService` para facilitar troca de provedor e testes

### Frontend

#### Alteracoes no componente LoginForm

- Adicionar tab/toggle "Email" | "Telefone" no topo do formulario
- Modo telefone: campo de input para numero com mascara brasileira (`+55 XX XXXXX-XXXX`)
- Apos envio do codigo: exibir tela de verificacao com campo para o codigo de 6 digitos
- Contador regressivo de 5 minutos exibido na tela de verificacao
- Botao "Reenviar codigo" habilitado apos expiracao do tempo ou em caso de codigo expirado
- Exibir numero mascarado na confirmacao (ex.: "+55 11 ***45-5678")
- Tratar todos os erros retornados pela API com mensagens amigaveis em portugues

---

## Consideracoes de Seguranca

- **OTP nunca em texto plano:** o codigo e sempre armazenado como hash no banco de dados
- **Expiracao curta:** 5 minutos para minimizar janela de ataque
- **Tentativas limitadas:** max 3 tentativas por codigo antes de invalida-lo, forcando novo envio
- **Rate limiting:** max 3 solicitacoes de OTP por numero em 10 minutos, evitando abuso de envio de SMS
- **Mascaramento:** numero exibido parcialmente na UI para confirmar sem expor completamente
- **HTTPS obrigatorio em producao:** nunca transmitir codigos OTP via HTTP simples
- **Codigo invalidado apos uso:** codigo marcado como `used = true` imediatamente apos verificacao
- **JWT identico ao fluxo atual:** mesmo segredo (`JWT_SECRET`) e expiracao de 7 dias
- **Variavel de ambiente para segredos:** credenciais SMS jamais no codigo-fonte
- **Validacao de formato de telefone:** validacao no frontend E no backend (E.164 format)

---

## Fora do Escopo

- Registro explicito por telefone separado do login (o cadastro e automatico no primeiro login)
- Associar numero de telefone a uma conta ja existente (vinculacao de metodos)
- Autenticacao por WhatsApp ou outros canais que nao SMS
- Recuperacao de senha via telefone
- Login com numero internacional fora do formato E.164
- Verificacao de numero de telefone em fluxo de cadastro por email
- Interface administrativa para gerenciamento de OTPs
- Suporte a multiplos numeros por usuario

---

## Dependencias

- Biblioteca de validacao de numero de telefone: `libphonenumber-js` (frontend e backend)
- Provedor de SMS: Twilio SDK (`twilio`) ou similar no backend
- Variavel de ambiente: `SMS_PROVIDER=mock` para desenvolvimento, `SMS_PROVIDER=twilio` para producao

---

## Definition of Done

- [ ] Schema do Prisma atualizado com campos `phone` no modelo `User` e modelo `OtpCode`
- [ ] Migration gerada e aplicada com `prisma migrate dev`
- [ ] Endpoint `POST /auth/phone/request-otp` implementado com validacao, geracao de OTP, hash e rate limiting
- [ ] Endpoint `POST /auth/phone/verify-otp` implementado com verificacao de hash, expiracao e tentativas
- [ ] Integracao com provedor SMS via abstracao (mock para dev, Twilio para prod)
- [ ] Frontend com toggle Email/Telefone no formulario de login
- [ ] Frontend com tela de verificacao de codigo e contador regressivo
- [ ] Tratamento de todos os erros da API no frontend com mensagens em portugues
- [ ] Testes unitarios/integracao no backend cobrindo todos os cenarios de aceite
- [ ] Testes E2E com Playwright cobrindo o fluxo completo de login por telefone
- [ ] Variaveis de ambiente documentadas no `README.md` ou `.env.example`
- [ ] Codigo revisado e aprovado em Pull Request
- [ ] Sem segredos ou credenciais commitados no repositorio
- [ ] Rate limiting validado manualmente ou por testes automatizados
