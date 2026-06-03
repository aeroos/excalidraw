#!/usr/bin/env bash
# Reset Excalidraw repo to demo-baseline (clean code, plan + skill preserved).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "error: not inside a git repository" >&2
  exit 1
}
cd "$ROOT"

if ! git rev-parse demo-baseline >/dev/null 2>&1; then
  echo "error: tag demo-baseline not found. Run demo setup from demo-start branch first." >&2
  exit 1
fi

echo "→ Checking out demo-start and resetting to demo-baseline"
git checkout demo-start
git reset --hard demo-baseline

echo "→ Removing untracked demo artifacts"
git clean -fd \
  -e .cursor \
  -- e2e playwright.config.ts test-results 2>/dev/null || git clean -fd

# Explicit paths in case git clean patterns miss them
rm -rf e2e test-results 2>/dev/null || true
rm -f playwright.config.ts 2>/dev/null || true

echo ""
echo "Demo reset complete."
echo "  branch: $(git branch --show-current)"
echo "  commit: $(git rev-parse --short HEAD) (demo-baseline)"
git status --short
