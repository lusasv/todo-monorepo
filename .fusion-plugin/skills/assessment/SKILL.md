---
name: assessment
description: Executa assessment completo do projeto com 3 auditorias sequenciais (Acessibilidade, Segurança OWASP, Arquitetura), gerando 3 relatórios HTML em reports/.
---
Execute os 3 agentes de assessment em sequência. Cada agente gera um relatório HTML autocontido em `reports/`.

## Fluxo

1. **Acessibilidade** — agente `report-accessibility` (WCAG 2.2)
2. **Segurança** — agente `security-owasp-top10` (OWASP Top 10)
3. **Arquitetura** — agente `report-architecture` (10 dimensões arquiteturais)

## Execução

Lance os 3 agentes em sequência usando o Agent tool. Cada um deve rodar até o fim antes de iniciar o próximo.

```
Agent 1: report-accessibility
  → gera reports/accessibility-report-YYYY-MM-DD.html

Agent 2: security-owasp-top10
  → gera reports/security-owasp-report-YYYY-MM-DD.html

Agent 3: report-architecture
  → gera reports/architecture-report-YYYY-MM-DD.html
```

Use `subagent_type` correspondente ao slug do agente:
- Agent 1: `subagent_type: "report-accessibility"`
- Agent 2: `subagent_type: "security-owasp-top10"` (se não existir como subagent_type, use general-purpose com o prompt do agente)
- Agent 3: `subagent_type: "report-architecture"` (se não existir como subagent_type, use general-purpose com o prompt do agente)

Para cada agente, passe como prompt: "Execute a auditoria conforme as instruções do seu prompt. Gere o relatório HTML em reports/."

## Output

Ao final dos 3, exiba:

```
✅ Assessment completo!

📄 Relatórios gerados:
  1. reports/accessibility-report-YYYY-MM-DD.html (Acessibilidade WCAG 2.2)
  2. reports/security-owasp-report-YYYY-MM-DD.html (Segurança OWASP Top 10)
  3. reports/architecture-report-YYYY-MM-DD.html (Arquitetura)
```

Liste os arquivos reais gerados em `reports/` para confirmar.