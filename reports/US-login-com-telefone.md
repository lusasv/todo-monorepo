# User Story: Login com Telefone

## Descrição
Permitir que usuários façam login utilizando número de telefone como alternativa ao email, com autenticação via OTP (One-Time Password) enviado por SMS.

## Contexto
Atualmente o sistema suporta apenas login com email e senha. A adição de autenticação por telefone com OTP melhora a acessibilidade e oferece uma camada adicional de segurança.

---

## User Story

**Como** um usuário,
**quero** fazer login usando meu número de telefone com código OTP,
**para que** eu possa acessar a aplicação de forma segura sem precisar lembrar de senhas complexas.

---

## Critérios de Aceitação

### Fluxo de Autenticação
- [ ] Usuário pode inserir número de telefone no formulário de login
- [ ] Número de telefone é validado no formato brasileiro (ex: +55 11 9XXXX-XXXX)
- [ ] Sistema envia OTP de 6 dígitos via SMS após validação do telefone
- [ ] OTP é valido por 5 minutos (prazo configurável)
- [ ] Usuário recebe feedback visual de sucesso/erro ao solicitar OTP
- [ ] Usuário pode inserir OTP recebido para confirmar autenticação
- [ ] Token JWT é gerado e armazenado após confirmação do OTP
- [ ] Mensagens de erro específicas são exibidas (número inválido, OTP expirado, OTP incorreto)

### Validação e Segurança
- [ ] Validação robusta do formato de telefone no frontend e backend
- [ ] OTP é armazenado com hash (não em plain text) no banco de dados
- [ ] Limite de 3 tentativas de entrada de OTP antes de solicitar novo código
- [ ] Bloqueio temporário após 3 tentativas falhadas (2 minutos)
- [ ] OTP é invalidado após uso bem-sucedido
- [ ] OTP é invalidado após expiração (5 minutos)
- [ ] Nenhuma informação sensível é exposta em mensagens de erro

### Interface e UX
- [ ] Campo de entrada de telefone com máscara visual
- [ ] Botão "Solicitar OTP" com estado loading
- [ ] Área de entrada de OTP aparece apenas após OTP enviado com sucesso
- [ ] Campo de OTP aceita apenas 6 dígitos
- [ ] Indicador visual de tempo restante para expiração do OTP
- [ ] Link "Reenviar código" após 30 segundos de espera
- [ ] Layout responsivo para mobile, tablet e desktop
- [ ] Estados visuais claros: loading, sucesso, erro, expirado

### Integração com Sistema Existente
- [ ] Usuários que já possuem conta por email podem adicionar telefone
- [ ] Usuários podem usar email OU telefone para fazer login (ambos os métodos funcionam)
- [ ] Token JWT gerado mantém compatibilidade com sistema existente
- [ ] Endpoints de autenticação existentes não são afetados

### Testes
- [ ] E2E: Fluxo completo de login com telefone funciona corretamente
- [ ] E2E: Validação de formato de telefone rejeita números inválidos
- [ ] E2E: OTP expirado exibe mensagem apropriada
- [ ] E2E: Limite de tentativas funciona corretamente
- [ ] E2E: Responsividade em diferentes viewports
- [ ] API: Endpoints de OTP retornam status HTTP corretos
- [ ] API: Validação de entrada é robusta contra injeção

---

## Cenários de Teste

### Sucesso (Happy Path)
1. Usuário navega para tela de login
2. Seleciona opção "Login com Telefone"
3. Insere número de telefone válido: +55 11 98765-4321
4. Clica "Solicitar OTP"
5. Sistema envia OTP via SMS
6. Usuário recebe SMS com código: 123456
7. Usuário insere código na tela
8. Sistema valida OTP
9. Token JWT é retornado e armazenado
10. Usuário é redirecionado para dashboard

### Falhas

#### Número de Telefone Inválido
- Usuário insere: "123" → Erro: "Número de telefone inválido"
- Usuário insere: "+55 11 9876-5432" (formato inválido) → Erro: "Formato de telefone inválido. Use +55 XX 9XXXX-XXXX"
- Usuário insere: vazio → Erro: "Número de telefone é obrigatório"

#### OTP Expirado
- Usuário aguarda 6 minutos
- Tenta inserir OTP anterior
- Sistema retorna: "Código expirado. Solicite um novo código"
- Link "Reenviar código" fica ativo

#### OTP Incorreto
- Usuário insere OTP errado: 654321
- Sistema retorna: "Código incorreto. 2 tentativas restantes"
- Após 3 tentativas, sistema bloqueia por 2 minutos: "Muitas tentativas falhadas. Tente novamente em 2 minutos"

#### Usuário Não Encontrado
- Usuário insere telefone não cadastrado: +55 11 99999-9999
- Duas opções possíveis:
  a) Sistema oferece criar conta com este telefone
  b) Sistema retorna: "Telefone não cadastrado. Deseja criar uma conta?"

#### Reenvio de Código
- Usuário clica "Solicitar OTP"
- Aguarda 30 segundos
- Botão "Reenviar código" fica ativo
- Usuário pode solicitar novo OTP
- Código anterior é invalidado

---

## Requisitos Técnicos

### Backend - Nova Tabela

```sql
CREATE TABLE PhoneAuth {
  id INT PRIMARY KEY AUTO_INCREMENT
  userId INT NOT NULL UNIQUE
  phoneNumber VARCHAR(20) NOT NULL UNIQUE
  otp VARCHAR(6) -- armazenar com HASH
  otpAttempts INT DEFAULT 0
  otpExpiresAt DATETIME
  blockedUntil DATETIME NULL
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  updatedAt DATETIME
  FOREIGN KEY (userId) REFERENCES User(id)
}
```

Alternativamente, adicionar campos à tabela User:
```sql
ALTER TABLE User ADD COLUMN phoneNumber VARCHAR(20) UNIQUE NULL;
```

### Backend - Novos Endpoints

1. **POST /auth/phone/request-otp**
   - Body: `{ phoneNumber: "+55 11 98765-4321" }`
   - Response (201): `{ message: "OTP enviado", expiresIn: 300 }`
   - Response (400): `{ error: "Número inválido" }`
   - Response (429): `{ error: "Muitas tentativas. Tente novamente em X segundos" }`

2. **POST /auth/phone/verify-otp**
   - Body: `{ phoneNumber: "+55 11 98765-4321", otp: "123456" }`
   - Response (200): `{ token: "jwt...", user: { id, email, name, phoneNumber } }`
   - Response (400): `{ error: "OTP inválido ou expirado" }`
   - Response (429): `{ error: "Bloqueado temporariamente" }`

3. **POST /auth/register-phone** (opcional, se suportar criação de conta por telefone)
   - Body: `{ phoneNumber, name }`
   - Cria novo usuário sem senha (ou com senha temporária)

### Backend - Serviço SMS

- Integração com provedor de SMS (Twilio, AWS SNS, etc.)
- Configuração via variáveis de ambiente
- Fallback para modo desenvolvimento (logar OTP no console)

### Frontend - Componentes

1. **LoginPhoneForm**
   - Input de telefone com máscara
   - Validação em tempo real
   - Botão "Solicitar OTP"

2. **OtpVerification**
   - Input de 6 dígitos
   - Timer visual de expiração
   - Link "Reenviar código"
   - Feedback de erro/sucesso

3. **LoginSelector**
   - Abas: "Email" e "Telefone"
   - Navegação entre métodos

### Stack Mantido
- Backend: Express + TypeScript + Prisma
- Frontend: React + Vite + TypeScript
- Auth: JWT (compatível)
- Database: SQLite

---

## Definição de Pronto

- [ ] Endpoints de OTP implementados e testados
- [ ] Tabela de telefone/OTP criada no banco de dados
- [ ] Componentes React para login com telefone funcionam
- [ ] Validação de telefone é robusta no frontend e backend
- [ ] Integração com provedor de SMS configurada
- [ ] Testes E2E cobrindo todos os cenários passam
- [ ] Testes unitários para validação de OTP cobrem casos extremos
- [ ] Código revisado e aprovado
- [ ] Sem regressões em funcionalidade de login por email
- [ ] Documentação de API atualizada
- [ ] Variáveis de ambiente documentadas (.env.example)

---

## Notas e Considerações

### Decisões Arquiteturais
- **OTP por SMS vs Email**: SMS é escolhido por ser mais comum em login com telefone
- **Comprimento do OTP**: 6 dígitos é padrão na indústria (balance entre segurança e usabilidade)
- **Validade do OTP**: 5 minutos é tempo suficiente sem comprometer segurança
- **Limite de tentativas**: 3 tentativas com bloqueio de 2 minutos mitiga força bruta
- **Usuário não encontrado**: Considerar permitir criação de conta no mesmo fluxo (nice-to-have)

### Fora do Escopo (v1)
- Autenticação multi-fator (pode ser adicionado depois)
- 2FA obrigatório (pode ser uma opção do usuário depois)
- Recuperação de conta via telefone
- Código QR para autenticação
- Biometria (face/fingerprint)
- WhatsApp como canal de OTP

### Dados Sensíveis
- OTP sempre armazenado com hash
- Nunca expor telefone completo em erros
- Logs não devem conter OTP ou telefone completo
- JWT mantém compatibilidade com segurança existente

### Conformidade
- LGPD: Dados de telefone são informações pessoais (consentimento necessário)
- Avisar usuário sobre coleta de dado de telefone
- Oferecer opção de remover telefone da conta

---

## Histórico de Aceitação (após conclusão)

### Funcionalidade
- [ ] Solicitar OTP envia código via SMS
- [ ] OTP é validado corretamente
- [ ] Token JWT é gerado após OTP bem-sucedido
- [ ] Telefone é armazenado na conta do usuário
- [ ] Login com telefone e email são equivalentes

### Segurança
- [ ] OTP é invalidado após uso
- [ ] OTP é invalidado após expiração
- [ ] Limite de tentativas funciona
- [ ] Bloqueio temporário funciona
- [ ] OTP não é exposto em logs ou erros

### Design & UX
- [ ] Seletor de método de login (email/telefone) visível
- [ ] Máscara de telefone funciona corretamente
- [ ] Timer de expiração visível e atualiza em tempo real
- [ ] Mensagens de erro são claras e específicas
- [ ] Feedback de loading durante requisições
- [ ] Responsivo em mobile, tablet, desktop

### Performance
- [ ] SMS é enviado em menos de 2 segundos
- [ ] Verificação de OTP é rápida (< 500ms)
- [ ] Não há impacto em performance geral da aplicação

### Testes
- [ ] E2E: Fluxo completo funciona
- [ ] E2E: Validações funcionam
- [ ] E2E: Casos de erro tratados
- [ ] API: Testes unitários passam
- [ ] Responsividade: Testado em 3+ breakpoints

---

## Referências

- Stack existente: Express, TypeScript, Prisma, React, Vite
- Testes E2E: Playwright
- Formato brasileiro de telefone: +55 XX 9XXXX-XXXX
- OTP: RFC 4226 (HOTP), RFC 6238 (TOTP)
- JWT: RFC 7519
- Possíveis integrações SMS: Twilio, AWS SNS, Firebase Cloud Messaging
