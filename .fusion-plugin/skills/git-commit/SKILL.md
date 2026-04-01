---
name: Git Commit
description: Stage changes, create a commit with a good message
argument-hint: <optional message hint>
---
Create a well-structured git commit for the current changes.

## Steps

1. Run `git status` to see all changes
2. Run `git diff --stat` to understand the scope
3. Analyze the changes to draft a commit message:
   - Use conventional commits format: `type(scope): description`
   - Types: feat, fix, refactor, docs, style, test, chore, perf
   - Keep the subject line under 72 characters
   - Add a body if the change is non-trivial
4. Stage relevant files (avoid `.env`, credentials, large binaries)
5. Create the commit with:
   ```
   Co-Authored-By: FusionCode <noreply@brq.com>
   ```
6. Show the commit hash and summary

## Rules

- Never use `git add -A` without reviewing what will be staged
- Never commit `.env`, secrets, or credential files
- If the user provides a message hint, incorporate it
- Do NOT push — only commit locally