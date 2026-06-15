---
name: prepare-pr
description: Use before opening a pull request. Verifies evidence, then drafts a reviewable PR description so senior reviewers spend minimal attention.
---

# Prepare PR

Use this skill once an implementation is complete and you are ready to open a PR.

**Demo repo PR target:** base `demo-start`, head `<feature-branch>`. Never open a PR with `demo-start` as both base and head. Default to `--draft` unless the user asks otherwise.

Steps:
1. Run yarn test for the affected package and yarn test:typecheck. Do not proceed until both pass. Run yarn test:update only if a snapshot change is intentional.
2. Re-read the diff. Confirm it is minimal and scoped to the ticket, with no unrelated changes or reformatting.
3. Confirm the accessibility floor was met (accessible name and role, no color-only encoding, keyboard operability, tests).
4. Draft a PR description with: the linked ticket, a one-paragraph summary of the change, what was validated (tests run, behavior checked in the browser), and any remaining human judgment needed.
5. Keep the title short and convention-matching. Flag explicitly if anything is out of scope or deferred.
6. List the specific things a reviewer should focus on, so review attention goes to judgment, not to hunting.
