---
name: frontend-accessibility-change
description: Use when adding or modifying an interactive frontend control (button, toggle, style option, menu item). Ensures the control is accessible and visually validated before a PR.
---

# Frontend accessibility change

Use this skill whenever you add or change an interactive frontend control.

Steps:
1. Identify the exact user-facing control being added or changed and the existing pattern it should match.
2. Confirm the control exposes an accessible role and an accessible name.
3. Confirm the control's state is distinguishable without relying on color alone (shape, pattern, label, or icon).
4. Check whether keyboard behavior is inherited from an existing component or needs explicit handling, and confirm a visible focus state.
5. Add or update role-based and name-based tests (Vitest + React Testing Library). Run yarn test and yarn test:typecheck.
6. Validate the visible behavior in the running app (yarn start, port 3000): exercise the control, confirm the visual result, and confirm keyboard operation.
7. Summarize any remaining human judgment required (visual polish, design-system alignment) in the PR description.
