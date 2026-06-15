#!/usr/bin/env bash
# Check out the demo parachute (finished EXCL-9) and start the dev server.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "error: not inside a git repository" >&2
  exit 1
}
cd "$ROOT"

PARACHUTE_REF="${PARACHUTE_REF:-demo-excl-9-ready}"
CHECKOUT_ONLY=false
KILL_SERVERS=true

for arg in "$@"; do
  case "$arg" in
    --checkout-only) CHECKOUT_ONLY=true ;;
    --no-kill) KILL_SERVERS=false ;;
    -h | --help)
      echo "Usage: parachute-preview.sh [--checkout-only] [--no-kill]"
      echo "  Checks out \$PARACHUTE_REF (default: demo-excl-9-ready) and runs yarn start."
      echo "  --checkout-only   Switch branches only; do not start the dev server."
      echo "  --no-kill         Do not stop existing vite dev servers on :3000/:3001."
      exit 0
      ;;
    *)
      echo "error: unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

if ! git rev-parse "$PARACHUTE_REF" >/dev/null 2>&1; then
  echo "error: parachute ref '$PARACHUTE_REF' not found." >&2
  echo "  Create it with: git tag demo-excl-9-ready demo/excl-9-parachute" >&2
  exit 1
fi

echo "→ Checking out parachute: $PARACHUTE_REF"
git checkout "$PARACHUTE_REF"

echo "  commit: $(git rev-parse --short HEAD) ($(git log -1 --format='%s'))"

if [[ "$KILL_SERVERS" == true ]]; then
  echo "→ Stopping existing vite dev servers (if any)"
  pkill -f "excalidraw-app.*vite" 2>/dev/null || true
  pkill -f "node.*vite" 2>/dev/null || true
  sleep 1
fi

if [[ "$CHECKOUT_ONLY" == true ]]; then
  echo ""
  echo "Parachute checkout complete."
  echo "  Run: yarn start"
  exit 0
fi

echo "→ Starting dev server (Ctrl+C to stop)"
echo "  Open the Local URL below, draw a shape, select Dash-dot in Stroke style."
yarn start
