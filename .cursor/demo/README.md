# Excalidraw SDLC demo baseline

## Git

| Ref | Purpose |
|-----|---------|
| `demo-start` branch | Check out before each demo run |
| `demo-baseline` tag | Immutable save point (plan + reset skill, no ticket implementations) |

Reset code (local + GitHub `aeroos/demo-start`): run `.cursor/skills/excalidraw-demo-reset/scripts/reset-demo.sh` or ask Cursor to **reset demo** (uses the **excalidraw-demo-reset** skill).

## Jira space: Excalidraw (`EXCL`)

Board: https://alecroos.atlassian.net/jira/software/projects/EXCL/list

| Ticket | Summary | Suggested demo order |
|--------|---------|----------------------|
| [EXCL-2](https://alecroos.atlassian.net/browse/EXCL-2) | Add unit tests for normalizeInputColor | 1 (best for cloud agent) |
| [EXCL-4](https://alecroos.atlassian.net/browse/EXCL-4) | Add keyboard shortcut for wrap selection in frame | 2 |
| [EXCL-5](https://alecroos.atlassian.net/browse/EXCL-5) | Fix duplicate selection over-selecting group siblings | 3 |
| [EXCL-3](https://alecroos.atlassian.net/browse/EXCL-3) | Add Playwright smoke test | 4 |
| [EXCL-1](https://alecroos.atlassian.net/browse/EXCL-1) | Add triangle shape tool | 5 |

Plan file: `.cursor/plans/sdlc_demo_tickets_964657cf.plan.md`
