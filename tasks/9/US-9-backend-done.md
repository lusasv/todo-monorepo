# Backend — US-9

## Endpoints implementados

### GET /api/figma/:fileKey
- **Params:** `fileKey` (string) — chave do arquivo Figma (ex: `ik0Qa30O9oNUy3qelJbQO7`)
- **Body:** N/A
- **Resposta 200:**
  ```json
  {
    "previewUrl": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/...",
    "nodes": {
      "document": { "...": "..." },
      "components": { "...": "..." },
      "styles": { "...": "..." }
    }
  }
  ```
- **Resposta 400:** `{ "error": "fileKey inválido ou ausente" }` — fileKey vazio ou com caracteres inválidos
- **Resposta 401:** `{ "error": "MCP Figma não autenticado" }` — `FIGMA_TOKEN` ausente ou token rejeitado pela API
- **Resposta 404:** `{ "error": "Arquivo Figma não encontrado" }` — fileKey não existe no Figma

## Arquivos criados/modificados

- `backend/src/index.ts` — Endpoint `GET /api/figma/:fileKey` adicionado (linha ~116)
- `backend/tsconfig.json` — Adicionado `"lib": ["ES2020", "DOM"]` para tipagem do `fetch` nativo do Node 18

## Observações

### Variável de ambiente obrigatória
O endpoint requer `FIGMA_TOKEN` no arquivo `.env` do backend:
```
FIGMA_TOKEN=<personal_access_token_do_figma>
```
Sem essa variável, o endpoint retorna 401 imediatamente.

### Lógica de integração com Figma REST API
1. **Validação:** `fileKey` deve corresponder a `/^[a-zA-Z0-9_-]+$/` — strings inválidas retornam 400.
2. **GET file:** Chama `https://api.figma.com/v1/files/:fileKey` (equivalente a `mcp__figma__get_file`). Extrai `document`, `components` e `styles`.
3. **GET image:** Chama `https://api.figma.com/v1/images/:fileKey?ids=<documentNodeId>&format=png` (equivalente a `mcp__figma__get_image`). Retorna a URL pública do preview PNG.
4. **Logs de debug:** `console.debug` nos pontos críticos para troubleshooting.

### Para o Frontend
- Renderizar `previewUrl` como `<img src={previewUrl} />`.
- Exibir `nodes` formatado em `<pre>{JSON.stringify(nodes, null, 2)}</pre>` para validação visual.
- O endpoint é público (sem autenticação JWT), portanto pode ser chamado diretamente via Axios.

### Para o QA
- Testar com `fileKey=ik0Qa30O9oNUy3qelJbQO7` (referência visual do PRD).
- Testar com `fileKey=` vazio → espera 400.
- Testar sem `FIGMA_TOKEN` no `.env` → espera 401.
- Testar com `fileKey=nao-existe-nao-existe-000` → espera 404.
