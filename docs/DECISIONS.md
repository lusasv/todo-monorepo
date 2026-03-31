# Decisões Arquiteturais

## 2026-03-31: Autenticação com Número de Telefone

### Contexto
O sistema atual de autenticação suporta apenas email e senha. Para melhorar a flexibilidade e alcance, foi solicitado expandir a autenticação para incluir número de telefone como alternativa de identificação.

### Decisão
Implementar suporte a login e registro com número de telefone como método de autenticação primário ou complementar.

### Rationale
1. **Flexibilidade do Usuário**: Muitos usuários preferem usar telefone como identificador primário
2. **Mercado Brasileiro**: Em mercados onde telefone é mais comum que email, essa funcionalidade é essencial
3. **Compatibilidade**: Mantém compatibilidade total com fluxo de email existente
4. **Escalabilidade**: Prepara o sistema para futuras autenticações multi-fator baseadas em SMS

### Implicações Técnicas

#### Banco de Dados
- Adicionar campo `phone` ao modelo User (VARCHAR(20), UNIQUE, NULL)
- Campo é opcional para manter compatibilidade com usuários legados
- Validação de unicidade tanto para email quanto telefone

#### API
- Novos endpoints: `POST /auth/register-phone` e `POST /auth/login-phone`
- Endpoints existentes `/auth/login` e `/auth/register` permanecem inalterados
- Validação de formato de telefone com `libphonenumber-js` ou similar
- Normalização de telefone antes de persistência (apenas dígitos + símbolo +)

#### Frontend
- Refatorar componente LoginForm para suportar toggle email/telefone
- Máscara de entrada visual para número de telefone
- Mensagens de erro específicas para cada método
- Sem impacto em fluxo de email existente

### Alternativas Consideradas
1. **Substituir email completamente por telefone**: Rejeitado — email ainda é importante
2. **Suportar ambos no mesmo campo**: Rejeitado — complexo e propenso a erros
3. **Implementar OTP/SMS**: Rejeitado — fora do escopo, pode ser futuro

### Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Colisão de números | Médio | Validação rigorosa de unicidade |
| Validação de formato | Médio | Usar biblioteca robusta (libphonenumber-js) |
| Regressions em email | Alto | Testes automatizados abrangentes |
| Performance | Baixo | Índice de banco de dados em coluna phone |

### Próximas Etapas
1. Implementar US-6: Login com Número de Telefone
2. Avaliar necessidade de validação por SMS confirmação
3. Implementar recuperação de senha por telefone (futuro)
4. Considerar integração com provedores de SMS para OTP (futuro)

### Referências
- [US-6: Login com Número de Telefone](/docs/US-login-com-numero-de-telefone.md)
- [Prisma Schema](/backend/prisma/schema.prisma)
- [API Contract - Story #5](/tasks/5/API_CONTRACT.md)
