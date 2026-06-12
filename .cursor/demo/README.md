# Excalidraw SDLC demo baseline

## Git

| Ref | Purpose |
|-----|---------|
| `demo-start` branch | Check out before each demo run (GitHub default branch) |
| `demo-baseline` tag | Immutable save point (plan + reset skill, no ticket implementations) |

Reset code (local + GitHub `origin/demo-start` on **aeroos/excalidraw**): run `.cursor/skills/excalidraw-demo-reset/scripts/reset-demo.sh` or ask Cursor to **reset demo** (uses the **excalidraw-demo-reset** skill).

**Remote:** `origin` → **aeroos/excalidraw** (your fork; the only remote needed for demos).

**CI:** GitHub Actions are removed on `demo-start` so demo PRs are not blocked by upstream Lint / Semantic PR title / Coverage checks.

**Ticket work:** branch from `demo-start` (e.g. `cursor/excl-7-…`), open PR into `demo-start` — never commit implementations directly on `demo-start`.

## Jira space: Excalidraw (`EXCL`)

Board: https://alecroos.atlassian.net/jira/software/projects/EXCL/list

Reset moves **EXCL-1 … EXCL-8** back to **To Do**.

| Ticket | Summary | Suggested demo order |
|--------|---------|----------------------|
| [EXCL-7](https://alecroos.atlassian.net/browse/EXCL-7) | Set default canvas background to light blue tint | 1 (best quick visual, ~15 min) |
| [EXCL-6](https://alecroos.atlassian.net/browse/EXCL-6) | Enable grid by default on new scenes | 2 (quick visual) |
| [EXCL-8](https://alecroos.atlassian.net/browse/EXCL-8) | Increase default stroke width to 2px | 3 (quick visual) |
| [EXCL-2](https://alecroos.atlassian.net/browse/EXCL-2) | Add unit tests for normalizeInputColor | 4 (cloud agent) |
| [EXCL-4](https://alecroos.atlassian.net/browse/EXCL-4) | Add keyboard shortcut for wrap selection in frame | 5 |
| [EXCL-5](https://alecroos.atlassian.net/browse/EXCL-5) | Fix duplicate selection over-selecting group siblings | 6 |
| [EXCL-3](https://alecroos.atlassian.net/browse/EXCL-3) | Add Playwright smoke test | 7 |
| [EXCL-1](https://alecroos.atlassian.net/browse/EXCL-1) | Add triangle shape tool | 8 |

Plan file: `.cursor/plans/sdlc_demo_tickets_964657cf.plan.md`
