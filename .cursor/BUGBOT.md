# Excalidraw BugBot Rules

Review PRs for real bugs and regressions. Keep comments high-signal, specific, and actionable.

## Focus areas

Check for issues in:

- Editor behavior: selection, undo/redo, tools, drag/resize/rotate, text editing, zoom, pan, and shortcuts.
- Scene/data safety: element updates, saved `.excalidraw` files, imports/exports, clipboard, and library items.
- State management: direct mutation, stale React state, missing history updates, or bypassing existing helpers.
- Collaboration: local/remote sync bugs, race conditions, presence updates, or overwriting local work.
- Accessibility: missing keyboard support, lost focus, incorrect labels, or clickable elements that should be buttons.
- Performance: expensive work during pointer move, drag, zoom, render, or full-scene scans.
- Security/privacy: unsafe URLs, unsanitized user content, risky file/embed handling, or leaking scene/user data.

## Commenting rules

Only comment when there is a concrete issue tied to the diff.

When commenting, explain:

1. What could break.
2. Where the risk is.
3. The smallest fix or verification needed.

## If the PR looks good

If no bugs or regressions are found, leave a brief summary of what was reviewed.

Example:

> No blocking issues found. I reviewed the changes for editor behavior, scene serialization, state/history updates, accessibility, and performance regressions.

## Avoid

- Style-only feedback.
- Broad refactor suggestions.
- Duplicate lint or formatting comments.
- Generic “add tests” comments.
- Speculative issues not tied to the PR.
