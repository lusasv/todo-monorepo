# Decisões Arquiteturais

## Autenticação com Telefone e OTP (US-Login-Com-Telefone)

**Data**: 2026-04-01
**Status**: Em Decisão (ainda não implementado)
**Afetados**: Backend, Frontend, Banco de Dados

### Decisão 1: Método de Autenticação - OTP via SMS

**Opções Consideradas**:
- OTP via SMS
- OTP via Email
- OTP via WhatsApp/Telegram
- Biometria (Face/Fingerprint)

**Decisão**: OTP via SMS

**Justificativa**:
- SMS é mais confiável que email para usuários brasileiros
- Não requer app adicional como WhatsApp
- Padrão consolidado no mercado
- Compatível com qualquer dispositivo

**Trade-offs**:
- Requer integração com provedor externo (custo)
- Dependência de serviço de SMS
- Latência potencial na entrega do código

---

### Decisão 2: Comprimento do OTP

**Opções**:
- 4 dígitos (força bruta: 10.000 combinações)
- 5 dígitos (força bruta: 100.000 combinações)
- 6 dígitos (força bruta: 1.000.000 combinações)
- 8 dígitos ou mais

**Decisão**: 6 dígitos

**Justificativa**:
- Padrão consolidado (Google, Amazon, WhatsApp usam 6)
- Balanceamento entre usabilidade e segurança
- Força bruta com 6 dígitos + limite de tentativas é suficiente
- Usuário consegue digitar rapidamente

---

### Decisão 3: Validade do OTP

**Opções**:
- 3 minutos (muito curto, frustra usuários)
- 5 minutos (padrão, bom balance)
- 10 minutos (muito longo, reduz segurança)

**Decisão**: 5 minutos

**Justificativa**:
- Tempo suficiente para usuário receber SMS e digitar
- Reduz significativamente risco de força bruta
- Compatível com expectativa do usuário

---

### Decisão 4: Limite de Tentativas de OTP

**Opções**:
- Sem limite (inseguro)
- 5 tentativas (muitas, permite força bruta)
- 3 tentativas com bloqueio (padrão seguro)
- 2 tentativas (muito rigoroso)

**Decisão**: 3 tentativas com bloqueio de 2 minutos

**Justificativa**:
- 3 tentativas permitem erros do usuário
- Bloqueio exponencial aumenta após múltiplas tentativas (consideração futura)
- Mitiga força bruta efetivamente
- Compatível com UX aceitável

---

### Decisão 5: Persistência do Telefone

**Opções**:
- Coluna adicional na tabela User
- Nova tabela PhoneAuth separada com FK
- NoSQL document (não aplicável aqui)

**Decisão**: Coluna adicional em User (phoneNumber UNIQUE NULL)

**Justificativa**:
- Simplicidade: um usuário tem um telefone
- Relacionamento 1:1 é direto
- Alternativa: Nova tabela se suportar múltiplos telefones no futuro
- Para v1, telefone único por usuário é suficiente

**Schema Decisão**:
```sql
ALTER TABLE User ADD COLUMN phoneNumber VARCHAR(20) UNIQUE NULL;
```

---

### Decisão 6: Armazenamento do OTP Temporário

**Opções**:
- Cache em memória (Redis)
- Tabela temporária no banco
- Cache no próprio banco com TTL

**Decisão**: Tabela temporária no banco com TTL (expiração)

**Justificativa**:
- Simplicidade: sem dependência de Redis
- Compatível com SQLite existente
- OTP é dados temporários de curta vida (5 min)
- Cleanup via job scheduler é simples

**Schema**:
```sql
CREATE TABLE PhoneOTP (
  id INT PRIMARY KEY AUTO_INCREMENT
  phoneNumber VARCHAR(20) NOT NULL UNIQUE
  otp VARCHAR(6) NOT NULL (hashed)
  attempts INT DEFAULT 0
  expiresAt DATETIME
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

### Decisão 7: Compatibilidade com Login Existente

**Opções**:
- Substituir login por email por login por telefone
- Suportar ambos (email E telefone)
- Suportar ambos com rota de migração

**Decisão**: Suportar ambos (email E telefone)

**Justificativa**:
- Não quebra funcionalidade existente
- Usuários podem usar qualquer um dos dois
- Transição gradual: usuários decidem quando adicionar telefone
- Compatibilidade com JWT mantida
- Endpoints existentes não afetados

---

### Decisão 8: Provedor de SMS

**Opções**:
- Twilio (consolidado, caro)
- AWS SNS (integrado se usar AWS)
- Firebase Cloud Messaging (Google)
- Provedor local brasileiro (Zenvia, TotalVoice)

**Decisão**: Configurável via variável de ambiente (abstrato)

**Justificativa**:
- Flexibilidade: permite trocar provedor depois
- Implementar adapter pattern
- Padrão: Twilio para MVP, trocar se custo for problema
- Dev: Mock/console logging em desenvolvimento

---

### Decisão 9: Formato de Telefone

**Opções**:
- E.164: +5511987654321 (sem máscara)
- Brasileiro mascarado: +55 11 9XXXX-XXXX (com máscara)
- Apenas número: 11987654321

**Decisão**: E.164 no banco (+5511987654321), máscara no frontend (+55 11 9XXXX-XXXX)

**Justificativa**:
- E.164 é padrão internacional
- Facilita integração com APIs de SMS
- Máscara no frontend para usabilidade
- Conversão frontend <-> backend é simples

---

### Decisão 10: User Story - Criar Conta via Telefone?

**Opções**:
- Apenas login (usuário deve ter email)
- Permitir criar conta só com telefone

**Decisão**: v1 = login apenas (usuário deve ter email). v2 = criar conta via telefone (nice-to-have)

**Justificativa**:
- Simplifica escopo de v1
- Email ainda pode ser coletado no registro
- v2 pode ser adicionado depois sem impacto
- Reduz complexidade de recuperação de conta

---

## Referências

- RFC 4226: HOTP (HMAC-based OTP)
- RFC 6238: TOTP (Time-based OTP)
- RFC 3966: Telephone Number Format
- E.164 Standard: International Public Telecommunication Numbering Plan

## Próximas Decisões (Para Depois)

- Autenticação multi-fator (2FA) obrigatória ou opcional?
- Recuperação de conta via telefone ou email?
- Suportar múltiplos telefones por usuário?
- Rate limiting global vs por telefone?
- Logging e auditoria de tentativas de login?
