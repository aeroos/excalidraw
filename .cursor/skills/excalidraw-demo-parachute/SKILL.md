---
name: excalidraw-demo-parachute
description: >-
  Switches to the finished EXCL-9 parachute branch and starts the dev server for
  browser preview. Use when the user says demo parachute, parachute preview,
  show dash-dot, preview EXCL-9, or needs the fallback after a failed live demo build.
---

# Excalidraw demo parachute

Loads the **pre-built EXCL-9** implementation so the user can review dash-dot in the browser without remembering git commands.

## When to use

- Live demo build failed → pivot to review the finished feature
- User wants to preview dash-dot before or after a practice run
- User says: **demo parachute**, **parachute preview**, **show dash-dot**

## Step 1 — Run the script

From repo root:

```bash
bash .cursor/skills/excalidraw-demo-parachute/scripts/parachute-preview.sh
```

This:

1. Checks out tag `demo-excl-9-ready` (commit on `demo/excl-9-parachute`)
2. Stops stale vite servers on :3000 / :3001 (so the browser shows the right code)
3. Runs `yarn start` — open the **Local** URL printed in the terminal

**Checkout only** (no server):

```bash
bash .cursor/skills/excalidraw-demo-parachute/scripts/parachute-preview.sh --checkout-only
```

Override the ref: `PARACHUTE_REF=demo/excl-9-parachute bash .../parachute-preview.sh`

## Step 2 — Browser smoke check

1. Draw a rectangle
2. Select it
3. Properties panel → **Stroke style** → fourth button **Dash-dot**

## Does not

- Reset `demo-start` (use **excalidraw-demo-reset** for that)
- Delete or modify the parachute branch / PR
- Replace the live demo branch (`cursor/excl-9-live-demo`)

## Related

| Command / skill | Purpose |
|----------------|---------|
| **reset demo** (`excalidraw-demo-reset`) | Clean baseline on `demo-start` + Jira To Do |
| **demo parachute** (this skill) | Finished EXCL-9 for browser review |
| PR | https://github.com/aeroos/excalidraw/pull/10 |

Reference: [.cursor/demo/README.md](../../demo/README.md)
