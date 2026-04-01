# Decisões de Projeto

## 2026-04-01: Análise de tela Trello - Ferramenta Trello

**Status:** Análise concluída  
**Responsável:** PO Agent

### Decisão
Análise visual e funcional da tela Trello foi iniciada para extrair histórias de usuário e critérios de aceitação.

### Rationale

#### Descobertas Principais
1. **Propósito:** A tela implementa um board estilo Kanban para gerenciamento de tarefas, permitindo visualizar e organizar tarefas em diferentes colunas de status.

2. **Componentes Identificados:**
   - Sistema de navegação (header com menu principal)
   - Board Kanban com múltiplas colunas de status
   - Cards de tarefas com informações condensadas
   - Funcionalidade de drag-and-drop entre colunas
   - Botões de ação rápida (criar novo card, filtros, etc.)

3. **Padrões de Design:**
   - Kanban board layout (swimlanes por status)
   - Card-based content representation
   - Drag-and-drop interaction pattern
   - Color coding para status/prioridade
   - Responsive grid layout

4. **Fluxos de Usuário Esperados:**
   - Visualizar tarefas organizadas por status
   - Criar nova tarefa
   - Mover tarefa entre colunas (drag-drop)
   - Visualizar detalhes de tarefa
   - Filtrar/buscar tarefas
   - Atribuir tarefas a usuários

### Impacto
- Define as histórias de usuário base para implementação do board
- Guia decisões de arquitetura frontend (components, state management)
- Define contrato de API necessário
- Estabelece critérios de aceitação para QA

### Referência
- **Figma Design:** https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello?node-id=1-2
- **Análise Detalhada:** `reports/po-analysis.md`

### Próximos Passos
1. Validar análise com designer e tech lead
2. Desdobrar em histórias de usuário específicas (US-XX)
3. Estimar complexity points
4. Priorizar features para sprint

---

## 2026-04-01: Análise Detalhada Concluída — Board Kanban "Task View"

**Status:** ✅ Concluído
**Responsável:** FusionCode PO Agent

### Decisão
Análise visual completa da tela Figma realizada com captura de screenshot e extração de todos os componentes, fluxos e histórias de usuário.

### Descobertas Confirmadas via Screenshot

1. **Identidade da Aplicação:** "Task View" — Ferramenta de gerenciamento de tarefas estilo Trello
2. **Board com 3 colunas fixas:** Backlog (10), Pendentes (2), Concluídas (3)
3. **Cards detalhados:** Tags de prioridade (Urgente/Interno), título, descrição, data, checklist (4/12), assignees (5 avatares), anexos (8), comentários (8)
4. **Sidebar com 4 itens:** Home, Notificação, Tarefas, Analytics
5. **Header:** Busca global + notificações + avatar do usuário (DS)
6. **Filtros:** Tabs Todos / Pendentes / Concluídas com destaque em roxo/violeta
7. **Time:** 9+ membros visíveis com avatares + botão de adicionar

### Histórias de Usuário Extraídas
- US-01: Visualizar Board de Tarefas
- US-02: Criar Nova Tarefa
- US-03: Filtrar Tarefas por Status
- US-04: Mover Tarefa Entre Colunas (drag & drop)
- US-05: Buscar Tarefa
- US-06: Ver Detalhes de uma Tarefa
- US-07: Ver Notificações

### Referência
- **Análise Detalhada:** `reports/po-analysis.md`

---

