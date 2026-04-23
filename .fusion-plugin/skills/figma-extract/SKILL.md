---
name: Figma Extract
description: Extract design specs from a Figma URL
argument-hint: <figma-url>
---
Extract design specifications from a Figma file URL for development reference.

## Steps

1. Parse the Figma URL to get file key and node IDs
2. Use the Figma MCP tools (if available) to fetch:
   - Component structure
   - Colors and typography
   - Spacing and dimensions
   - Assets and icons
3. Generate a design spec document with:
   - Component hierarchy
   - CSS-ready values (colors, fonts, spacing)
   - Responsive breakpoints (if defined)

## Output

Write the spec to `docs/figma-spec-{component}.md` or print to console.

## Rules

- Requires Figma MCP to be enabled
- If MCP is not available, inform the user to enable it in Settings
- Convert Figma measurements to rem/px consistently
- Extract only the relevant node, not the entire file