---
name: robust-plan
description: Use when asked to plan a ticket or feature before implementation. Produces a tightly scoped, verifiable implementation plan and does not edit code.
---

# Create plan

Turn a ticket into an implementation plan the agent can execute and verify against. Do not modify code while planning.

Steps:
1. Research the repo first using read-only exploration. Locate the exact files, components, and patterns the change will touch.
2. Restate the ticket as a tightly scoped objective. Explicitly list what is in scope and what is out of scope, to prevent scope creep.
3. List the specific files to change and why, the expected UI and behavior, the accessibility impact, and a test strategy that matches this repo's conventions.
4. Define verifiable success criteria: concrete, checkable outcomes the agent can confirm when done. Name the specific tests that should pass, the behavior that should be observable, and the file set the diff should stay within.
5. Flag any ambiguity as a question before proceeding. Do not guess on anything that would change the shape of the implementation.
6. Output the plan as markdown the user can edit directly. Keep it short enough to review in one pass.
