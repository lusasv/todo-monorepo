---
name: Analyze Codebase
description: Deep analysis of project structure, patterns, and health
---
Perform a comprehensive analysis of the current codebase.

## Analysis Areas

1. **Structure**: Folder organization, module boundaries, entry points
2. **Dependencies**: Count, outdated packages, heavy dependencies
3. **Code Quality**: Duplicated patterns, god files (>500 lines), circular dependencies
4. **Test Coverage**: Test file count, frameworks used, coverage gaps
5. **Tech Debt**: TODO/FIXME/HACK comments, deprecated APIs, legacy patterns
6. **Security**: Exposed secrets, missing input validation, unsafe patterns

## Output

Print a structured report:
```
Codebase Analysis
=================

Structure: {files} files, {dirs} directories
Languages: TypeScript (78%), CSS (15%), HTML (7%)
Dependencies: {count} ({outdated} outdated)

Top Issues:
1. [HIGH] 3 files over 500 lines — consider splitting
2. [MED] 12 TODO comments found
3. [LOW] 2 unused dependencies

Recommendations:
- Extract shared utils from duplicated patterns in X and Y
- Add tests for uncovered module Z
```

## Rules

- Be factual — cite specific files and line counts
- Prioritize findings by impact
- Keep recommendations actionable
- Do NOT modify any files