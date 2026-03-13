# User Story #5: Melhorar Tela de Login

## Descrição
A tela de login precisa ser mais bonita e visualmente atraente para melhorar a experiência do usuário.

## Critérios de Aceitação

- [ ] Layout responsivo funciona em desktop, tablet e mobile
- [ ] Estilo visual modernizado com cores, fontes e espaçamento consistentes
- [ ] Componentes de input e button com hover/focus estados bem definidos
- [ ] Mensagens de erro exibidas de forma clara e acessível
- [ ] Formulário de login mantém funcionalidade de autenticação JWT existente
- [ ] Transições suaves entre estados (loading, sucesso, erro)
- [ ] Acessibilidade: labels conectadas aos inputs, contraste adequado
- [ ] Performance otimizada (sem impacto em carregamento da página)

## Histórico de Aceitação

### Funcionalidade
- Entrada de email e senha funcionam corretamente
- Autenticação com backend funciona sem erros
- Token JWT é armazenado e enviado corretamente em requisições subsequentes

### Design & UX
- Botão de login com estado loading durante requisição
- Feedback visual de validação de input (email válido/inválido)
- Mensagens de erro específicas (usuário não encontrado, senha incorreta)
- Campo de senha com ícone toggle para mostrar/ocultar
- Link "Esqueci a senha" ou similar (futuro)

### Responsividade
- Layout centralizado em desktop (min-width: 1024px)
- Adaptado para tablet (768px - 1023px)
- Full-width otimizado para mobile (< 768px)

### Testes
- Testes E2E com Playwright cobrindo fluxo de login visual
- Verificar transições e estados visuais
- Testar em diferentes viewports

## Tarefas Técnicas

1. **Frontend - Componente Login**
   - Criar/refatorar componente LoginForm em `frontend/src/`
   - Adicionar estilos CSS ou CSS-in-JS (considerar Tailwind/styled-components)
   - Implementar validação de formulário
   - Adicionar feedback de loading/estado

2. **Frontend - Testes**
   - Atualizar/expandir testes E2E em `e2e/login.spec.ts`
   - Validar aparência visual em diferentes breakpoints

3. **Backend - Validação (se necessário)**
   - Revisar endpoints de login para erros descritivos
   - Garantir CORS configurado corretamente

4. **Assets**
   - Definir paleta de cores
   - Escolher/instalar fonts (Google Fonts ou similar)
   - Considerar ícones (lucide-react, react-icons)

## Definição de Pronto

- Código revisado e aprovado
- Testes E2E passando em múltiplos viewports
- Sem regressions em funcionalidade de autenticação
- Documentação de componente atualizada se necessário

## Notas

- Manter compatibilidade com JWT existente
- Não alterar endpoints de autenticação
- Considerar usar componentes da biblioteca UI existente (se houver)
- Dark mode é nice-to-have, não requisito

## Referências

- Issue GitHub: #5
- Stack: React + Vite + Tailwind (ou similar)
- Testes: Playwright para E2E
