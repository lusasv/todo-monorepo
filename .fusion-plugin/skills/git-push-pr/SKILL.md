---
name: Push and Create PR
description: Push current branch and open a pull request
argument-hint: <base-branch>
---
Push the current branch to remote and create a pull request.

## Steps

1. Get current branch name: `git branch --show-current`
2. Check if there are unpushed commits: `git log @{u}..HEAD --oneline 2>/dev/null`
3. Push to remote: `git push -u origin HEAD`
4. Create PR using GitHub CLI:
   ```bash
   gh pr create --title "<title from commits>" --body "<summary>"
   ```
5. If base branch argument is provided, use it. Otherwise use `main` or `master`.
6. Return the PR URL

## Rules

- Never force push
- Never push to main/master directly
- If the branch is already up to date, just create the PR
- Include a summary of all commits in the PR body
- Add `Co-Authored-By: FusionCode <noreply@brq.com>` in the PR description