---
name: squad
description: Executa a squad completa de agentes para uma GitHub issue. Use com o número da issue como argumento.
argument-hint: <número da issue>
---
Execute o comando abaixo e aguarde terminar. Não pergunte nada ao usuário.

```
Bash: node cli/bin/fusion.js squad $ARGUMENTS --cwd .
```

Quando terminar, exiba o output completo ao usuário.
Se der erro, exiba o erro e pergunte se quer tentar novamente.