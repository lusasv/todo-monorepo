---
name: Deploy Check
description: Verify the project is ready for deployment
---
Run a pre-deployment checklist to verify the project is ready to deploy.

## Checks

1. **Build**: Run the build command and verify it succeeds
2. **Tests**: Run the test suite and verify all pass
3. **Lint**: Run the linter and verify no errors
4. **Environment**: Check that `.env.example` exists and all required vars are documented
5. **Dependencies**: Check for outdated or vulnerable packages (`npm audit`)
6. **Git Status**: Verify working directory is clean
7. **Docker**: If Dockerfile exists, verify it builds successfully

## Output

Print a checklist:
```
Deploy Readiness Check
  [PASS] Build succeeds
  [PASS] All tests pass (42/42)
  [WARN] 2 low-severity npm audit issues
  [PASS] No uncommitted changes
  [SKIP] No Dockerfile found

Result: READY (1 warning)
```

## Rules

- Never deploy — only check readiness
- Treat any FAIL as blocking
- Treat WARN as non-blocking but worth noting
- Skip checks that don't apply to the project