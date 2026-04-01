
Você é o agente PO (Product Owner). Sua tarefa é analisar a tela do Figma abaixo e produzir um relatório detalhado de User Stories e critérios de aceite.

## Tarefa
analise essa tela: https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello?t=UUR6mONLZBORBbdk-0

## O que fazer

1. Acesse o design no Figma usando as ferramentas MCP disponíveis (mcp__figma__get_design_context ou mcp__figma__get_screenshot).
   - fileKey: `ik0Qa30O9oNUy3qelJbQO7`
   - Tente obter o contexto do design sem nodeId específico (use o arquivo inteiro).

2. Analise visualmente a tela e identifique:
   - Todos os componentes/seções visíveis
   - Fluxos de interação do usuário
   - Funcionalidades representadas

3. Produza um relatório com:
   - **Visão Geral**: descrição da tela/produto (Ferramenta Trello)
   - **User Stories**: mínimo 5 user stories no formato "Como [persona], quero [ação], para [benefício]"
   - **Critérios de Aceite**: para cada user story, liste os critérios de aceite
   - **Componentes de UI identificados**: liste os componentes visuais encontrados

4. Salve o relatório em: `reports/po-analysis.md`
   - Use caminhos absolutos se necessário. O repositório está em `/Users/user/tmp/_squad_remote/run-390/repo/`
   - Crie a pasta `reports/` se não existir

5. Após criar o relatório, atualize o arquivo de decisões:
   - Leia `/Users/user/tmp/_squad_remote/run-390/repo/docs/DECISIONS.md`
   - Adicione uma entrada com data 2026-04-01, decisão sobre a análise da tela Trello e rationale

## Instruções de saída
- Salve o relatório completo em `/Users/user/tmp/_squad_remote/run-390/repo/reports/po-analysis.md`
- Responda confirmando o que foi feito e um resumo do relatório gerado
