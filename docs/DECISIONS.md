# Decisions Log

## 2026-04-01 - Análise de Design: Task View (Ferramenta Trello)

**Decisão:** Realizada análise completa do design "Task View" do Figma para documentar a interface Kanban.

**Contexto:**
- URL Figma: https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello?node-id=1-2
- Objetivo: Entender a tela e criar especificação de produto

**Análise Realizada:**
1. Captura visual da tela via Figma MCP tools
2. Identificação de componentes visuais e funcionalidades
3. Documentação estruturada de UX/UI
4. Geração de 11 user stories baseadas no design
5. Definição de critérios de aceite para desenvolvimento

**Componentes Principais Identificados:**
- Layout Kanban com 3 colunas (Backlog, Pendentes, Concluídas)
- Cards de tarefas com: badges de prioridade, descrição, data, membros, comentários, anexos
- Navegação lateral com menu principal
- Barra superior com busca e notificações
- Sistema de abas para alternar visualizações
- Filtros rápidos por prioridade/categoria

**User Stories Definidas:**
- US-1: Visualizar Tarefas em Kanban
- US-2: Criar Nova Tarefa
- US-3: Filtrar Tarefas por Prioridade/Categoria
- US-4: Buscar Tarefas por Texto
- US-5: Visualizar Detalhes da Tarefa
- US-6: Atualizar Status da Tarefa (Drag & Drop)
- US-7: Visualizar Membros da Tarefa
- US-8: Gerenciar Membros do Projeto
- US-9: Visualizar Progresso de Subtarefas
- US-10: Ver Contador de Comentários e Anexos
- US-11: Filtrar por Abas de Status

**Observações sobre UX/UI:**
- Pontos fortes: clareza visual, código de cores consistente, hierarquia clara
- Melhorias sugeridas: feedback visual ao hover, estados vazios, destaque de datas vencidas

**Artefatos Criados:**
- `/reports/po-analysis.md` - Análise detalhada do design (completa)

**Próximos Passos:**
- Validar user stories com stakeholders
- Prototipagem interativa de drag & drop
- Especificação de API endpoints
- Design system documentation
- Planejar testes (unit, integration, E2E)

**Decisões de Design Confirmadas:**
- Padrão Kanban com 3 status (Backlog, Pendentes, Concluídas)
- Layout em colunas (não em lista ou tabela)
- Membros representados por avatares empilhados (até 4 visíveis)
- Badges de cor para prioridade/categoria
- Filtros e busca funcionam em paralelo

**Status:** Completo
**Próxima Etapa:** Aguardando validação de PM/stakeholders antes de começar design detalhado ou desenvolvimento
