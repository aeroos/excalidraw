---
name: robust-plan
description: >-
  Use when asked to plan a ticket or feature before implementation. Produces a
  tightly scoped, verifiable implementation plan and does not edit code. Includes
  demo git workflow — branch from demo-start, implement on a feature branch, PR
  into demo-start.
---

# Create plan

Turn a ticket into an implementation plan the agent can execute and verify against. Do not modify code or create branches while planning.

Reference: [.cursor/demo/README.md](../../demo/README.md)

## Steps

### 0. Branch setup (read-only checks)

Before researching implementation details:

1. Run read-only git checks: `git branch --show-current`, `git status --short`.
2. Confirm the **integration base** is `demo-start` (this repo's default branch on `aeroos/excalidraw`).
3. Propose a **feature branch** name: `cursor/excl-<N>-<short-slug>` (e.g. `cursor/excl-9-dash-dot-stroke`).
4. If the user asked to start fresh or redo a ticket, note that **demo reset** should run before branching:
   `bash .cursor/skills/excalidraw-demo-reset/scripts/reset-demo.sh`
5. If currently on `demo-start`, the plan must treat branch creation as the **first implementation step** — do not plan to commit ticket work directly on `demo-start`.
6. Do **not** run `git checkout -b` or other mutating git commands during planning.

### 1. Research

Research the repo first using read-only exploration. Locate the exact files, components, and patterns the change will touch.

### 2. Scope

Restate the ticket as a tightly scoped objective. Explicitly list what is in scope and what is out of scope, to prevent scope creep.

Include in **out of scope**: committing ticket implementations on `demo-start`; opening a PR where base and head are the same branch.

### 3. Implementation details

List the specific files to change and why, the expected UI and behavior, the accessibility impact, and a test strategy that matches this repo's conventions.

### 4. Success criteria

Define verifiable success criteria: concrete, checkable outcomes the agent can confirm when done. Name the specific tests that should pass, the behavior that should be observable, and the file set the diff should stay within.

Always include:

- Feature branch created from `demo-start` (implementation not on `demo-start`)
- Draft PR opened: base `demo-start`, head `<feature-branch>` (use `gh pr create --draft`)

### 5. Questions

Flag any ambiguity as a question before proceeding. Do not guess on anything that would change the shape of the implementation.

### 6. Output

Output the plan as markdown the user can edit directly. Keep it short enough to review in one pass.

Every plan **must** include a **Branch setup** section near the top:

```markdown
## Branch setup

| Item | Value |
|------|-------|
| Ticket | EXCL-N |
| Base branch | `demo-start` |
| Feature branch | `cursor/excl-N-<short-slug>` |
| PR | draft; base `demo-start` ← head `<feature-branch>` |

**Before editing code (first implementation step):**
1. `git checkout demo-start && git pull origin demo-start`
2. `git checkout -b cursor/excl-N-<short-slug>`

**Out of scope:** Committing on `demo-start`
```

Then continue with objective, scope, files, tests, and success criteria as usual.
