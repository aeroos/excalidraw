---
name: excalidraw-demo-reset
description: >-
  Resets the Excalidraw monorepo, Jira EXCL tickets, and Linear EXCL issues to the
  SDLC demo baseline. Use when the user says reset demo, demo start, demo baseline,
  practice demo again, or wants a clean slate before re-running the Excalidraw demo.
---

# Excalidraw demo reset

Returns the workspace to a repeatable demo starting point: **local + GitHub** code on `demo-start` @ `demo-baseline`, plus Jira and Linear tickets in **To Do** / **Todo**.

## Step 1 — Reset git (always run)

From repo root, execute:

```bash
bash .cursor/skills/excalidraw-demo-reset/scripts/reset-demo.sh
```

This:

1. Checks out `demo-start` and `git reset --hard demo-baseline`
2. Removes untracked demo artifacts (`e2e/`, `playwright.config.ts`, `test-results/`)
3. **Force-pushes** `demo-baseline` → `demo-start` on **`origin`** (`aeroos/excalidraw` on GitHub; reverts cloud agent commits on `demo-start`)

Use `--no-push` to reset locally only.

Verify: `git status --short` should be clean (aside from `.cursor/` untracked files).

## Step 2 — Reset Jira tickets (when Atlassian MCP is available)

Cloud ID: `a698387e-120a-4b00-a93f-2a0356ecc090` (alecroos.atlassian.net)

For each issue **EXCL-1** through **EXCL-10**:

1. `getJiraIssue` — skip if status is already **To Do**
2. `getTransitionsForJiraIssue` — find transition to **To Do** (may be named "To Do", "Reopen", or "Backlog" depending on board)
3. `transitionJiraIssue` with that transition id

If a ticket is **Done**, you may need a backward transition first. Transition all ten before the next demo run.

Project board: https://alecroos.atlassian.net/jira/software/projects/EXCL/list

## Step 3 — Reset Linear issues (when Linear MCP is available)

Team: **Excalidraw**

For each issue **EXCL-1** through **EXCL-10**:

1. `get_issue` with `id: "EXCL-N"` — skip if status is already **Todo**
2. `save_issue` with `id: "EXCL-N"` and `state: "Todo"` to move it back to Todo

Do not delete issues. Only reset status. If Linear MCP needs auth, run `mcp_auth` first.

Team board: https://linear.app/field-engineering-scratch/team/EXCL

## Step 4 — Confirm baseline

Report to the user:

- Git local: on `demo-start` @ `demo-baseline`
- Git remote: `origin/demo-start` (`aeroos/excalidraw` on GitHub) matches `demo-baseline` (unless `--no-push`)
- Jira: EXCL-1 … EXCL-10 status (all should be To Do)
- Linear: EXCL-1 … EXCL-10 status (all should be Todo)
- Recommended demo tickets: **EXCL-7** (quick visual, ~15 min) or **EXCL-2** (unit tests; cloud agent)

Reference: [.cursor/demo/README.md](../../demo/README.md)

## Do not

- Push outside `reset-demo.sh` unless the user asks
- Delete the Jira project, Linear team, or tickets
- Remove `.cursor/plans/` or this skill
