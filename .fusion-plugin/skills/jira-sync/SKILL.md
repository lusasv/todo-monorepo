---
name: Jira Sync
description: Sync task status with Jira
argument-hint: <jira-ticket>
---
Read or update a Jira ticket's status.

## Steps

1. Parse the Jira ticket key (e.g., PROJ-123)
2. If Jira MCP is available:
   - Fetch ticket details (summary, description, status, assignee)
   - Display current status
3. If argument includes "done" or "close":
   - Transition ticket to Done/Closed
4. If argument includes "comment":
   - Add a comment with the current work summary

## Rules

- Requires Jira MCP to be enabled
- Never change ticket assignee
- Always show current status before making changes
- If MCP is not available, inform the user