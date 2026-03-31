---
name: Figma Design
description: UI Designer: le issue do GitHub e cria frames no Figma via MCP oficial (use_figma)
argument-hint: <issue-number> [--file <figma-url>]
---
UI Designer agent: reads a GitHub issue and creates native Figma frames for every screen state using the project's design system.

## Workflow

1. Read GitHub issue with `gh issue view <N> --json title,body,labels`
2. Extract acceptance criteria, screen states, and any Figma URLs
3. Discover the design system: use `get_variable_defs`, `get_metadata`, `search_design_system`
4. Plan frames: one per state (idle, loading, error, success, empty)
5. Create frames with `use_figma` — Auto Layout, design tokens, real content from AC
6. Verify with `get_screenshot` on each frame
7. Report: links + screenshots

## Rules

- One frame per state, named `#<issue> | <Screen> - <State>`
- Never create a new Figma file — use the specified or default file
- Never invent colors or fonts — use existing design system tokens
- Auto Layout on every frame
- Save directly, no confirmation prompts
- Always show Figma links + screenshots at the end