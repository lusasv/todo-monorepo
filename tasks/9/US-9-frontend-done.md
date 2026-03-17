# Frontend — US-9

## Paginas implementadas
- Aba `/figma` (tab navigation interna) → `frontend/src/FigmaViewer.tsx`

## Servicos criados/modificados
- Nenhum serviço dedicado criado — Axios é chamado diretamente no componente `FigmaViewer.tsx`

## Arquivos criados/modificados
- `frontend/src/FigmaViewer.tsx` — **CRIADO** — Componente de integração Figma
- `frontend/src/App.tsx` — **MODIFICADO** — Adicionada importação de `FigmaViewer`, tipo `Tab`, estado `activeTab`, header com tabs "Tarefas" / "Figma", e renderização condicional da aba Figma

## Fluxo da tela Figma

1. Usuário clica na aba **🎨 Figma** no header
2. Exibe campo de texto para digitar o `fileKey` do Figma (ex: `ik0Qa30O9oNUy3qelJbQO7`)
3. Um hint explica onde encontrar o fileKey na URL do Figma
4. Ao submeter, chama `GET /api/figma/:fileKey` via Axios
5. Exibe spinner com texto "Consultando MCP Figma..."
6. Em caso de sucesso:
   - Card **Preview do Design**: renderiza a imagem via `<img src={data.previewUrl}>` + link para a URL
   - Card **Dados de Nodes (JSON)**: exibe `data.nodes` formatado em `<pre>` com fundo escuro (dark code block)
7. Em caso de erro: banner vermelho com a mensagem do backend (`error`)

## Endpoint consumido
- `GET /api/figma/:fileKey` → proxy Vite → `http://localhost:4000/figma/:fileKey`

## Observacoes
- O componente é autocontido (estilos inline via `<style>`) seguindo o padrão do projeto
- Validação client-side: impede submit com fileKey vazio
- Tratamento de erro de carregamento da imagem (`onError` oculta o `<img>` se a URL falhar)
- Acessibilidade: `role="alert"` nos erros, `role="status" aria-live="polite"` no loading
- Compatível com o proxy Vite existente (`/api` → `http://localhost:4000`)
