# Relatório de Análise PO - Ferramenta Trello

**Data:** 2026-04-01  
**Produto:** Ferramenta de Gerenciamento de Tarefas (Trello Clone)  
**Arquivo Figma:** https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello

---

## Visão Geral

A tela analisada apresenta um **sistema de gerenciamento de tarefas em formato Kanban**, onde usuários podem visualizar, organizar e colaborar em tarefas através de um painel visual com múltiplas colunas de status (Backlog, Pendentes, Concluídas). A interface oferece funcionalidades de filtro, busca, visualização de membros de projeto e acesso a recursos analíticos.

A aplicação é projetada para equipes de trabalho colaborarem em projetos, atribuindo tarefas, definindo prioridades, adicionando datas de vencimento e acompanhando o progresso através de um painel intuitivo estilo Trello.

---

## Componentes de UI Identificados

1. **Barra Superior (Header)**
   - Logo/Icon da aplicação (Task View)
   - Barra de busca ("Pesquise suas tarefas")
   - Ícone de notificações
   - Avatar do usuário (DS)

2. **Navegação Lateral (Sidebar)**
   - Home
   - Notificação
   - Tarefas
   - Analytics

3. **Painel de Abas (Tab Navigation)**
   - "Todos" (ativo)
   - "Pendentes"
   - "Concluídas"

4. **Colunas Kanban**
   - Backlog (10 tarefas)
   - Pendentes (2 tarefas)
   - Concluídas (3 tarefas)
   - Cada coluna possui botão "+" para adicionar nova tarefa

5. **Cards de Tarefa**
   - Título da tarefa
   - Descrição/Lorem Ipsum
   - Badges de prioridade (Urgente, Interno, Interno)
   - Data de vencimento
   - Indicadores de progresso (4/12)
   - Avatares de membros atribuídos
   - Ícones de comentários (8)
   - Ícones de documentos/anexos (8)

6. **Área de Colaboradores**
   - Avatares dos membros do projeto (+5 membros)
   - Botão "+" para adicionar novo membro

---

## User Stories

### US-1: Visualizar Tarefas em Painel Kanban

**Como** gerente de projeto,  
**quero** visualizar todas as minhas tarefas organizadas em colunas por status (Backlog, Pendentes, Concluídas),  
**para** ter uma visão clara do fluxo de trabalho da minha equipe.

**Critérios de Aceite:**
- [ ] O painel exibe três colunas: Backlog, Pendentes e Concluídas
- [ ] Cada coluna exibe o número total de tarefas (ex: "10 tarefas")
- [ ] As tarefas são renderizadas como cards dentro de suas respectivas colunas
- [ ] O layout é responsivo e se adapta a diferentes tamanhos de tela
- [ ] Os cards são visíveis com scroll vertical dentro das colunas

---

### US-2: Buscar Tarefas por Palavra-chave

**Como** membro da equipe,  
**quero** pesquisar minhas tarefas por palavra-chave (título ou descrição),  
**para** encontrar rapidamente uma tarefa específica sem ter que rolar por todas.

**Critérios de Aceite:**
- [ ] Existe um campo de busca no header "Pesquise suas tarefas"
- [ ] A busca filtra em tempo real (debounce de 300ms)
- [ ] O filtro funciona em todas as colunas simultaneamente
- [ ] A busca é case-insensitive
- [ ] Se nenhuma tarefa corresponder, uma mensagem vazia aparece

---

### US-3: Filtrar Tarefas por Status

**Como** membro da equipe,  
**quero** filtrar tarefas apenas pelo status que me interessa (Todos, Pendentes, Concluídas),  
**para** focar no meu trabalho sem distrações.

**Critérios de Aceite:**
- [ ] Existem 3 abas de filtro: "Todos", "Pendentes", "Concluídas"
- [ ] A aba ativa é destacada (estilo visual diferente)
- [ ] Ao clicar em "Todos", exibe todas as tarefas
- [ ] Ao clicar em "Pendentes", exibe apenas tarefas com status pendente
- [ ] Ao clicar em "Concluídas", exibe apenas tarefas concluídas
- [ ] O filtro persiste a seleção ao recarregar a página

---

### US-4: Visualizar Detalhes de uma Tarefa

**Como** membro da equipe,  
**quero** ver os detalhes de uma tarefa (título, descrição, prioridade, data, responsáveis, comentários, anexos),  
**para** entender completamente o que precisa ser feito.

**Critérios de Aceite:**
- [ ] Cada card exibe o título da tarefa
- [ ] A descrição (Lorem Ipsum) é visível no card
- [ ] Badges de prioridade (Urgente, Interno, Interno) são exibidas com cores distintas
- [ ] A data de vencimento é mostrada com ícone de calendário
- [ ] O indicador de progresso (ex: 4/12) é exibido
- [ ] Avatares dos membros atribuídos aparecem no card
- [ ] O número de comentários (8) é exibido com ícone
- [ ] O número de documentos/anexos (8) é exibido com ícone
- [ ] Ao clicar no card, um modal com detalhes completos abre

---

### US-5: Adicionar Nova Tarefa em uma Coluna

**Como** membro da equipe,  
**quero** adicionar uma nova tarefa clicando no botão "+" em uma coluna,  
**para** criar rapidamente uma tarefa sem sair do painel Kanban.

**Critérios de Aceite:**
- [ ] Cada coluna possui um botão "+" visível
- [ ] Ao clicar, um modal ou forma de criação aparece
- [ ] O formulário solicita: título, descrição, prioridade, data de vencimento
- [ ] É possível atribuir membros à tarefa
- [ ] Após criar, a tarefa aparece automaticamente na coluna correspondente
- [ ] Uma notificação de sucesso aparece após criar a tarefa
- [ ] É possível cancelar a criação sem salvar alterações

---

### US-6: Gerenciar Colaboradores do Projeto

**Como** gerente de projeto,  
**quero** ver os membros da equipe atribuídos ao projeto e adicionar novos membros,  
**para** controlar quem tem acesso ao projeto e às tarefas.

**Critérios de Aceite:**
- [ ] Uma área de "Colaboradores" exibe avatares dos membros (+5 membros visíveis)
- [ ] Um botão "+" permite adicionar novo membro
- [ ] Ao clicar, um modal de seleção de usuários aparece
- [ ] É possível buscar usuários por nome ou email
- [ ] O novo membro é adicionado à lista após seleção
- [ ] Os avatares são exibidos em cores/iniciais diferentes por membro
- [ ] Hover sobre um avatar exibe o nome do membro

---

### US-7: Acessar Análises e Estatísticas

**Como** gerente de projeto,  
**quero** acessar um painel de analytics/estatísticas,  
**para** acompanhar métricas como produtividade, progresso e carga de trabalho.

**Critérios de Aceite:**
- [ ] Existe um menu "Analytics" na sidebar
- [ ] Ao clicar, leva para uma página de estatísticas
- [ ] A página exibe gráficos de progresso (ex: gráficos de pizza, barras)
- [ ] Métricas de carga de trabalho por membro são visíveis
- [ ] Dados de progresso ao longo do tempo estão disponíveis
- [ ] É possível filtrar estatísticas por período

---

### US-8: Receber Notificações de Tarefas

**Como** membro da equipe,  
**quero** receber notificações sobre minhas tarefas (novas atribuições, comentários, prazos próximos),  
**para** nunca perder atualizações importantes.

**Critérios de Aceite:**
- [ ] Existe um ícone de notificações no header
- [ ] O ícone mostra um badge com o número de notificações não lidas
- [ ] Ao clicar, um painel lateral exibe as notificações recentes
- [ ] Notificações incluem: "Você foi atribuído a...", "Nova mensagem em...", "Prazo próximo para..."
- [ ] Notificações podem ser marcadas como lidas
- [ ] É possível limpar todas as notificações

---

### US-9: Navegar pela Aplicação

**Como** usuário,  
**quero** navegar facilmente entre as principais seções (Home, Notificações, Tarefas, Analytics),  
**para** acessar todas as funcionalidades da aplicação.

**Critérios de Aceite:**
- [ ] Existe uma sidebar de navegação fixa
- [ ] Menu contém: Home, Notificação, Tarefas, Analytics
- [ ] A página ativa é destacada no menu
- [ ] Ícones representam cada seção (para acessibilidade)
- [ ] A sidebar é collapse-able em telas pequenas
- [ ] Os textos dos itens são legíveis

---

### US-10: Atribuir Membros a uma Tarefa

**Como** gerente de projeto,  
**quero** atribuir membros específicos a uma tarefa,  
**para** deixar claro quem é responsável por cada trabalho.

**Critérios de Aceite:**
- [ ] No card da tarefa, avatares de membros atribuídos aparecem
- [ ] Ao clicar nos avatares, um modal de atribuição abre
- [ ] É possível pesquisar membros por nome
- [ ] Múltiplos membros podem ser atribuídos à mesma tarefa
- [ ] Os membros selecionados aparecem como avatares no card
- [ ] É possível remover membros clicando no "X" sobre seu avatar
- [ ] Após atribuição, o membro recebe uma notificação

---

## Fluxo de Interação Primário

1. **Usuário acessa a aplicação** → Sistema exibe tela "Task View"
2. **Usuário vê painel Kanban** → 3 colunas com tarefas separadas por status
3. **Usuário pode:**
   - Pesquisar uma tarefa usando a barra de busca
   - Filtrar tarefas usando as abas (Todos, Pendentes, Concluídas)
   - Clicar em uma tarefa para ver detalhes completos
   - Adicionar uma nova tarefa clicando no botão "+"
   - Navegar para Analytics ou Notificações usando a sidebar
   - Gerenciar membros do projeto na área de colaboradores

---

## Componentes Reutilizáveis Sugeridos

1. **Card de Tarefa**
   - Recebe props: título, descrição, prioridade, data, membros, comentários, anexos
   - Estados: hover, active, completed

2. **Coluna Kanban**
   - Recebe props: titulo, numero_tarefas, lista_tarefas
   - Suporta: scroll vertical, adicionar nova tarefa

3. **Badge de Prioridade**
   - Estados: Urgente (vermelho), Interno (laranja), Normal (verde)

4. **Avatar de Membro**
   - Mostra iniciais ou imagem
   - Hover exibe nome

5. **Tab de Filtro**
   - Estados: ativo, inativo
   - Recebe label e callback de clique

6. **Barra de Busca**
   - Placeholder dinâmico
   - Suporta debounce

7. **Modal de Criação de Tarefa**
   - Campos: título, descrição, prioridade, data, membros

---

## Considerações de Design

- **Consistência Visual:** Usar uma paleta de cores consistente para prioridades
- **Acessibilidade:** Todos os ícones devem ter labels ou aria-labels
- **Performance:** Considerar virtualização para colunas com muitas tarefas
- **Responsividade:** Layout deve adaptar para tablets e mobile (modo single-column)
- **Animações:** Transitions suaves ao mover cards entre colunas

---

## Requisitos Não-Funcionais

- **Sincronização em Tempo Real:** Mudanças devem ser refletidas em todos os clientes simultaneamente
- **Persistência de Dados:** Todas as tarefas e alterações devem ser salvas no servidor
- **Autenticação:** Verificar identidade do usuário antes de acessar tarefas
- **Rate Limiting:** Limitar requisições de busca para evitar overload

---

## Próximas Etapas

1. Detalhar especificações técnicas de cada US
2. Criar wireframes de alta fidelidade para novos fluxos
3. Definir critérios de aceitação mais específicos com a equipe técnica
4. Priorizar as user stories para o roadmap do produto
5. Estimar effort points para cada US

