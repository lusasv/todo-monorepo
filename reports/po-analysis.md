# Análise de Tela — Ferramenta Trello (Task View)

**Data:** 2026-04-01
**Figma:** [Ferramenta Trello](https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello?node-id=1-2)
**Node ID:** 1:2
**Analisado por:** FusionCode / PO Agent
**Status:** Concluído

---

## 1. Propósito da Tela

### Objetivo Primário
Esta tela é o **Board Kanban principal** da aplicação "Task View" — uma ferramenta de gerenciamento de tarefas inspirada no Trello. O objetivo central é oferecer uma **visão consolidada de todas as tarefas** do time, organizadas por status (Backlog, Pendentes, Concluídas), permitindo que o usuário acompanhe o progresso e gerencie as atividades de forma visual e colaborativa.

### Contexto de Uso
- O usuário acessa esta tela como **tela principal/dashboard** após o login.
- É o ponto central de trabalho do dia a dia do time.
- Pré-requisito: usuário autenticado com acesso ao projeto/board.

---

## 2. Componentes da Interface (UI)

### 2.1 Navegação

#### Sidebar Esquerda (Menu Lateral Fixo)
| Componente | Rótulo | Ação |
|---|---|---|
| Ícone + Texto | Home | Ir para tela inicial |
| Ícone + Texto | Notificação | Abrir central de notificações |
| Ícone + Texto | Tarefas | Página atual — board de tarefas |
| Ícone + Texto | Analytics | Abrir painel analítico |

#### Top Bar (Cabeçalho)
| Componente | Rótulo/Conteúdo | Ação |
|---|---|---|
| Logo + Nome | "Task View" (com ícone de grid colorido) | Identidade da aplicação |
| Search Bar | "Pesquise suas tarefas" | Busca global de tarefas |
| Bell Icon | Notificação | Abrir notificações |
| Avatar | "DS" (iniciais do usuário) | Menu de perfil / configurações |

### 2.2 Área de Filtros / Tabs

Localizado acima do board, com três opções:
| Tab | Estado | Descrição |
|---|---|---|
| **Todos** | Selecionado (pill roxo) | Exibe tarefas de todas as colunas |
| Pendentes | Normal | Filtra apenas tarefas pendentes |
| Concluídas | Normal | Filtra apenas tarefas concluídas |

Ao lado direito das tabs: **avatares dos membros do time** (9 avatares visíveis + "+5" indicando mais membros) e um botão "+" para adicionar membros.

### 2.3 Board Kanban — Colunas

Três colunas visíveis, com layout horizontal:

| Coluna | Contagem | Cor do Header |
|---|---|---|
| **Backlog** | 10 tarefas | Cinza/Neutro |
| **Pendentes** | 2 tarefas | Cinza/Neutro |
| **Concluídas** | 3 tarefas | Cinza/Neutro |

Cada coluna possui:
- **Header**: Nome da coluna + contagem de tarefas + botão "+" (adicionar novo card)
- **Lista de cards**: rolagem vertical dentro da coluna
- **Botão "+"**: Roxo/violeta, canto superior direito do header

### 2.4 Cards de Tarefa

Cada card contém os seguintes elementos:

| Elemento | Descrição |
|---|---|
| **Tags de prioridade/tipo** | Badges coloridos: "Urgente" (vermelho/rosa), "Interno" (roxo), "Interno" (verde) |
| **Menu de opções** | Ícone "⋯" (três pontos) — ações contextuais do card |
| **Título** | "Customer Support Expert" — texto em negrito |
| **Descrição** | Texto descritivo (Lorem ipsum como placeholder) |
| **Data** | Ícone de calendário + "4 Mar. 2026" |
| **Progresso de checklist** | Ícone de lista + "4/12" (itens concluídos / total) |
| **Avatares de assignees** | 5 avatares de usuários atribuídos ao card |
| **Anexos** | Ícone de clipe + número "8" |
| **Comentários** | Ícone de chat/balão + número "8" |

---

## 3. Análise de Fluxo de Usuário

### 3.1 Jornada Principal — Acompanhar Tarefas do Time

```
1. Usuário acessa a tela "Tarefas" pelo menu lateral
   ↓
2. Sistema exibe o board Kanban com as colunas (Backlog, Pendentes, Concluídas)
   ↓
3. Usuário visualiza cards com status, datas, assignees e progresso
   ↓
4. Usuário filtra por tab (Todos / Pendentes / Concluídas) para focar
   ↓
5. Usuário clica em um card para ver detalhes ou editar
   ↓
6. Resultado: usuário tem visibilidade total do status do time
```

### 3.2 Jornada Secundária A — Criar Nova Tarefa

```
1. Usuário clica no botão "+" na coluna desejada
   ↓
2. Sistema abre modal ou inline form para criação de task
   ↓
3. Usuário preenche título, descrição, tags, data, assignees
   ↓
4. Usuário confirma — card aparece na coluna correspondente
```

### 3.3 Jornada Secundária B — Mover Tarefa Entre Colunas

```
1. Usuário arrasta um card de uma coluna para outra (Drag & Drop)
   ↓
2. Sistema atualiza o status da tarefa
   ↓
3. Contadores de cada coluna são atualizados
```

### 3.4 Jornada Secundária C — Buscar Tarefa

```
1. Usuário clica na barra de busca no topo
   ↓
2. Digita palavras-chave do título ou descrição
   ↓
3. Sistema filtra e exibe resultados em tempo real
```

### 3.5 Estados da Tela

| Estado | Descrição |
|---|---|
| Estado com dados | Colunas populadas com cards (estado exibido no design) |
| Estado vazio | Colunas sem cards — exibir mensagem de "Nenhuma tarefa" + CTA |
| Estado carregando | Skeleton loader nas colunas/cards |
| Estado de erro | Toast/banner de erro ao falhar carregamento |
| Estado filtrado | Tabs alteram quais colunas/cards são exibidos |

---

## 4. Histórias de Usuário

### US-01: Visualizar Board de Tarefas
```
Como membro do time,
quero visualizar todas as tarefas organizadas em colunas Kanban,
para entender o status atual do trabalho do time de forma rápida.

Critérios de Aceitação:
- [ ] O board deve exibir no mínimo as colunas: Backlog, Pendentes, Concluídas
- [ ] Cada coluna deve exibir a contagem de tarefas no header
- [ ] Cada card deve mostrar: título, descrição, tags, data, assignees, progresso, anexos e comentários
- [ ] O board deve ser acessível pelo menu lateral em "Tarefas"
```

### US-02: Criar Nova Tarefa
```
Como membro do time,
quero criar uma nova tarefa em qualquer coluna do board,
para registrar novos trabalhos a serem realizados.

Critérios de Aceitação:
- [ ] Deve haver um botão "+" em cada coluna para criar tarefa
- [ ] O formulário deve aceitar: título (obrigatório), descrição, tags, data, assignees
- [ ] A tarefa criada deve aparecer imediatamente na coluna correspondente
- [ ] O contador da coluna deve ser incrementado após a criação
```

### US-03: Filtrar Tarefas por Status
```
Como membro do time,
quero filtrar as tarefas por status (Todos / Pendentes / Concluídas),
para focar nas tarefas relevantes ao meu contexto atual.

Critérios de Aceitação:
- [ ] As tabs "Todos", "Pendentes" e "Concluídas" devem estar visíveis acima do board
- [ ] A tab ativa deve ter destaque visual (pill roxo)
- [ ] Ao clicar em "Pendentes", apenas cards pendentes devem ser exibidos
- [ ] Ao clicar em "Concluídas", apenas cards concluídos devem ser exibidos
- [ ] "Todos" exibe todas as colunas e cards
```

### US-04: Mover Tarefa Entre Colunas
```
Como membro do time,
quero mover uma tarefa de uma coluna para outra via drag & drop,
para atualizar o status da tarefa de forma intuitiva.

Critérios de Aceitação:
- [ ] O usuário deve poder arrastar um card de uma coluna para outra
- [ ] O status da tarefa deve ser atualizado automaticamente
- [ ] Os contadores de cada coluna devem ser atualizados em tempo real
- [ ] A operação deve ser refletida para todos os usuários (real-time ou ao recarregar)
```

### US-05: Buscar Tarefa
```
Como membro do time,
quero buscar tarefas pelo nome ou descrição,
para localizar rapidamente uma tarefa específica sem precisar rolar o board.

Critérios de Aceitação:
- [ ] A barra de busca deve estar visível no topo da tela
- [ ] A busca deve funcionar com texto parcial (mínimo 2 caracteres)
- [ ] Os resultados devem ser exibidos em tempo real (debounce ~300ms)
- [ ] Sem resultados deve exibir mensagem de "Nenhuma tarefa encontrada"
```

### US-06: Ver Detalhes de uma Tarefa
```
Como membro do time,
quero clicar em um card para ver todos os seus detalhes,
para obter informações completas sobre a tarefa, seus comentários e anexos.

Critérios de Aceitação:
- [ ] Clicar no card deve abrir um modal ou página de detalhe
- [ ] O detalhe deve exibir: título, descrição completa, checklist, comentários, anexos, assignees e histórico
- [ ] Deve ser possível editar a tarefa diretamente na tela de detalhe
- [ ] Deve ser possível fechar/voltar ao board sem perder o estado
```

### US-07: Ver Notificações
```
Como membro do time,
quero receber notificações sobre atualizações em tarefas que me envolvem,
para me manter informado sem precisar verificar o board constantemente.

Critérios de Aceitação:
- [ ] O ícone de sino no header deve exibir badge com contagem de notificações não lidas
- [ ] Clicar no sino deve abrir painel de notificações
- [ ] As notificações devem indicar: qual tarefa mudou, quem fez a mudança e quando
```

---

## 5. Critérios de Aceitação Globais

### Board Kanban
- [ ] Deve ser responsivo (adaptar para telas menores com scroll horizontal no board)
- [ ] Cards devem suportar drag & drop entre colunas
- [ ] Contadores de coluna devem refletir o estado atual em tempo real
- [ ] Botão "+" deve estar presente em cada coluna

### Cards
- [ ] Devem exibir tags coloridas por tipo (Urgente = vermelho, Interno = roxo/verde)
- [ ] Devem exibir avatares dos assignees (máx. 5 visíveis + overflow)
- [ ] Devem exibir data, progresso de checklist (X/Y), contagem de anexos e comentários
- [ ] Devem ter menu de contexto "⋯" com ações: Editar, Mover, Arquivar, Excluir

### Navegação
- [ ] Menu lateral deve permanecer fixo e visível em todas as telas
- [ ] Item ativo do menu deve ter destaque visual
- [ ] A busca global deve estar sempre acessível no header

---

## 6. Arquitetura de Informação

### Hierarquia Visual
```
App: Task View
├── Header (fixo)
│   ├── Logo/Nome
│   ├── Busca Global
│   ├── Notificações
│   └── Avatar do Usuário
├── Sidebar (fixo)
│   ├── Home
│   ├── Notificação
│   ├── Tarefas (atual)
│   └── Analytics
└── Área Principal
    ├── Filtros / Tabs (Todos | Pendentes | Concluídas)
    ├── Membros do Time (avatares + adicionar)
    └── Board Kanban
        ├── Coluna: Backlog (N tarefas)
        │   └── Cards (título, descrição, tags, data, assignees, métricas)
        ├── Coluna: Pendentes (N tarefas)
        │   └── Cards
        └── Coluna: Concluídas (N tarefas)
            └── Cards
```

### Entidade: Tarefa (Task/Card)
| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| id | UUID | Sim | Gerado automaticamente |
| título | String | Sim | Exibido em negrito no card |
| descrição | Text | Não | Texto livre |
| status | Enum | Sim | backlog \| pendente \| concluída |
| tags | Array<Tag> | Não | Ex: Urgente, Interno |
| data_vencimento | Date | Não | Exibida no card |
| assignees | Array<User> | Não | Máx. 5 visíveis no card |
| checklist_total | Integer | Não | Total de itens do checklist |
| checklist_done | Integer | Não | Itens concluídos |
| attachments_count | Integer | Não | Contagem de anexos |
| comments_count | Integer | Não | Contagem de comentários |
| created_at | DateTime | Sim | Automático |
| updated_at | DateTime | Sim | Automático |

---

## 7. Design Patterns Identificados

### Padrões de Navegação
- ✅ **Sidebar fixa** com ícones + labels
- ✅ **Top navigation bar** com busca central
- ✅ **Tab/Pill navigation** para filtros rápidos

### Padrões de Conteúdo
- ✅ **Kanban board** (colunas com cards arrastaveis)
- ✅ **Card-based layout** com informações densas mas organizadas
- ✅ **Avatares com overflow** (ex: +5 membros)

### Padrões de Interação
- ✅ **Drag and drop** (inferido pela natureza Kanban)
- ✅ **Contextual menu** (⋯ em cada card)
- ✅ **Search bar** com placeholder descritivo
- ✅ **Inline counters** para contagens (tarefas por coluna)

### Padrões Visuais
- ✅ **Color coding** para tags de prioridade (Urgente = vermelho, Interno = roxo/verde)
- ✅ **Avatar stacking** para múltiplos assignees
- ✅ **Badge/pill** para tabs e status
- ✅ **Icon + number** para métricas (anexos, comentários, checklist)

---

## 8. Notas de Design Visual

### Paleta de Cores
| Uso | Cor |
|---|---|
| Primária / Destaque | Roxo/Violeta (#7C3AED aproximado) |
| Tag Urgente | Vermelho/Rosa claro |
| Tag Interno (variante 1) | Roxo claro |
| Tag Interno (variante 2) | Verde claro |
| Background do app | Branco (#FFFFFF) |
| Background dos cards | Branco (#FFFFFF) com sombra leve |
| Background da sidebar | Branco / levemente acinzentado |
| Texto principal | Cinza escuro / Preto |
| Texto secundário | Cinza médio |

### Tipografia
- **Título do app**: Negrito, tamanho grande (~20px)
- **Título das colunas**: Negrito, tamanho médio (~16px)
- **Título dos cards**: Negrito, tamanho médio (~14px)
- **Descrição dos cards**: Regular, tamanho pequeno (~12px), cor cinza
- **Labels e tags**: Pequeno, pill/badge colorido

### Layout
- **Sidebar**: ~160px de largura, fixo à esquerda
- **Board**: Layout horizontal com scroll (colunas fixas visíveis ~3)
- **Cards**: Largura fixa (~250px), altura variável
- **Espaçamento**: Generoso entre cards (~12-16px gap)

---

## 9. Observações sobre UX

### Pontos Positivos
- Layout Kanban familiar — curva de aprendizado baixa para usuários de Trello/Jira
- Cards informativos com dados essenciais visíveis sem necessidade de abrir
- Uso de avatares para visualizar assignees rapidamente
- Filtros por tab simples e diretos (Todos / Pendentes / Concluídas)
- Barra de busca central e sempre acessível
- Tags coloridas permitem identificação rápida de prioridade/tipo

### Oportunidades de Melhoria
- Não há indicação de prioridade além das tags (poderia ter ordenação por prioridade)
- As colunas têm contadores mas não há indicador visual de carga excessiva (WIP limit)
- Os filtros de tab poderiam ser combinados com filtros por membro/assignee
- Não é visível uma opção de visualização alternativa (lista vs. board)

### Questões em Aberto
- É possível criar novas colunas customizadas além das 3 padrão?
- O drag & drop é o único meio de mover cards entre colunas, ou há opção no menu contextual?
- Existe funcionalidade de sub-tarefas além do checklist?
- O campo "Analytics" no menu leva a qual tipo de dashboard?
- Como funciona a integração/atribuição de membros ao board?

---

## 10. Dependências e Relacionamentos

### APIs Necessárias
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/boards/:id/columns` | Listar colunas com tarefas |
| GET | `/api/tasks?board=:id` | Listar tarefas por board |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa (status, dados) |
| PATCH | `/api/tasks/:id/move` | Mover tarefa entre colunas |
| DELETE | `/api/tasks/:id` | Excluir tarefa |
| GET | `/api/users?board=:id` | Listar membros do board |
| GET | `/api/notifications` | Listar notificações do usuário |

### Permissões
- Usuário deve estar autenticado
- Usuário deve ser membro do board para visualizar
- Apenas admin pode adicionar/remover membros do board
- Todos os membros podem criar, editar e mover tarefas

### Integrações
- Sistema de autenticação (avatar + iniciais do usuário visíveis no header)
- Sistema de notificações em tempo real (ícone de sino)
- Armazenamento de arquivos para anexos

---

## 11. Próximos Passos

- [x] Análise inicial da tela realizada
- [ ] Validar análise com designer responsável
- [ ] Validar modelo de dados com tech lead
- [ ] Desdobrar em stories técnicas (Frontend + Backend)
- [ ] Estimar complexidade (Story Points)
- [ ] Priorizar features para MVP vs. iterações futuras
- [ ] Definir WIP limits por coluna (se aplicável)
- [ ] Especificar comportamento responsivo / mobile

---

## Anexo: Referências Visuais

**Figma Design:** [Abrir no Figma](https://www.figma.com/design/ik0Qa30O9oNUy3qelJbQO7/Ferramenta-Trello?node-id=1-2)

**Screenshot capturado em:** 2026-04-01

> A tela exibe um board Kanban com três colunas (Backlog: 10 tarefas, Pendentes: 2 tarefas, Concluídas: 3 tarefas), cada uma contendo cards com título "Customer Support Expert", tags de prioridade/tipo (Urgente, Interno), data (4 Mar. 2026), progresso de checklist (4/12), avatares de assignees, contagem de anexos (8) e comentários (8). A sidebar à esquerda contém: Home, Notificação, Tarefas, Analytics. O header contém a busca global e avatar do usuário.

---

**Análise realizada em:** 2026-04-01
**Analisado por:** FusionCode PO Agent
**Status:** ✅ Concluído
