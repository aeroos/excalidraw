---
name: excalidraw-demo-reset
description: >-
  Resets the Excalidraw monorepo and Jira EXCL tickets to the SDLC demo baseline.
  Use when the user says reset demo, demo start, demo baseline, practice demo again,
  or wants a clean slate before re-running the Excalidraw + Jira MCP demo.
---

# Excalidraw demo reset

Returns the workspace to a repeatable demo starting point: **local + GitHub** code on `demo-start` @ `demo-baseline`, plus Jira tickets in **To Do**.

## Step 1 — Reset git (always run)

From repo root, execute:

```bash
bash .cursor/skills/excalidraw-demo-reset/scripts/reset-demo.sh
```

This:

1. Checks out `demo-start` and `git reset --hard demo-baseline`
2. Removes untracked demo artifacts (`e2e/`, `playwright.config.ts`, `test-results/`)
3. **Force-pushes** `demo-baseline` → `demo-start` on remote **`aeroos`** (reverts cloud agent commits on GitHub)

Use `--no-push` to reset locally only. Override remote with `DEMO_REMOTE=origin`.

Verify: `git status --short` should be clean (aside from `.cursor/` untracked files).

## Step 2 — Reset Jira tickets (when Atlassian MCP is available)

Cloud ID: `a698387e-120a-4b00-a93f-2a0356ecc090` (alecroos.atlassian.net)

For each issue **EXCL-1** through **EXCL-5**:

1. `getJiraIssue` — skip if status is already **To Do**
2. `getTransitionsForJiraIssue` — find transition to **To Do** (may be named "To Do", "Reopen", or "Backlog" depending on board)
3. `transitionJiraIssue` with that transition id

If a ticket is **Done**, you may need a backward transition first. Transition all five before the next demo run.

Project board: https://alecroos.atlassian.net/jira/software/projects/EXCL/list

## Step 3 — Confirm baseline

Report to the user:

- Git local: on `demo-start` @ `demo-baseline`
- Git remote: `aeroos/demo-start` matches `demo-baseline` (unless `--no-push`)
- Jira: EXCL-1 … EXCL-5 status (all should be To Do)
- Recommended first demo ticket: **EXCL-2** (unit tests; best for cloud agent)

Reference: [.cursor/demo/README.md](../../demo/README.md)

## Do not

- Push outside `reset-demo.sh` unless the user asks
- Delete the Jira project or tickets
- Remove `.cursor/plans/` or this skill
