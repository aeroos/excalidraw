#!/usr/bin/env bash
# Reset Excalidraw repo to demo-baseline (local + GitHub demo-start).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "error: not inside a git repository" >&2
  exit 1
}
cd "$ROOT"

DEMO_BRANCH="${DEMO_BRANCH:-demo-start}"
DEMO_REMOTE="${DEMO_REMOTE:-origin}"
SKIP_REMOTE=false

for arg in "$@"; do
  case "$arg" in
    --no-push) SKIP_REMOTE=true ;;
    -h | --help)
      echo "Usage: reset-demo.sh [--no-push]"
      echo "  Resets $DEMO_BRANCH to demo-baseline locally and on \$DEMO_REMOTE (default: origin)."
      exit 0
      ;;
    *)
      echo "error: unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

if ! git rev-parse demo-baseline >/dev/null 2>&1; then
  echo "error: tag demo-baseline not found. Run demo setup from demo-start branch first." >&2
  exit 1
fi

echo "→ Checking out $DEMO_BRANCH and resetting to demo-baseline"
git checkout "$DEMO_BRANCH"
git reset --hard demo-baseline

echo "→ Removing untracked demo artifacts"
git clean -fd \
  -e .cursor \
  -- e2e playwright.config.ts test-results 2>/dev/null || git clean -fd

rm -rf e2e test-results 2>/dev/null || true
rm -f playwright.config.ts 2>/dev/null || true

if [[ "$SKIP_REMOTE" == false ]] && git remote get-url "$DEMO_REMOTE" &>/dev/null; then
  echo "→ Resetting remote $DEMO_BRANCH on $DEMO_REMOTE (cloud agents)"
  git push "$DEMO_REMOTE" demo-baseline:"$DEMO_BRANCH" --force
elif [[ "$SKIP_REMOTE" == false ]]; then
  echo "→ Skipping remote reset (git remote '$DEMO_REMOTE' not configured)"
fi

echo ""
echo "Demo reset complete."
echo "  branch: $(git branch --show-current)"
echo "  commit: $(git rev-parse --short HEAD) (demo-baseline)"
if [[ "$SKIP_REMOTE" == false ]] && git remote get-url "$DEMO_REMOTE" &>/dev/null; then
  echo "  remote: $DEMO_REMOTE/$DEMO_BRANCH"
fi
git status --short
