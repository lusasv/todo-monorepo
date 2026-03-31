---
name: Test Runner
description: Run tests and report results
argument-hint: <test-pattern>
---
Run the project's test suite and report results.

## Steps

1. Detect the test framework:
   - Look for `jest`, `vitest`, `playwright`, `pytest`, `mocha` in package.json or project files
2. Run the appropriate test command:
   - Jest/Vitest: `npm test` or `npx jest {pattern}` or `npx vitest run {pattern}`
   - Playwright: `npx playwright test {pattern}`
   - pytest: `python -m pytest {pattern}`
3. If a pattern argument is provided, run only matching tests
4. If no argument, run the full suite
5. Report: total, passed, failed, skipped
6. If tests fail, show the failure details

## Rules

- Never modify test files — only run them
- If the test framework is not installed, inform the user
- Capture both stdout and stderr
- Set a timeout of 5 minutes per test run