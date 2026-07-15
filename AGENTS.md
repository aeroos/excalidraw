# AGENTS.md

## Cursor Cloud specific instructions

### Monorepo overview

Excalidraw is a Yarn 1 workspaces monorepo. The main surfaces are:

- **`excalidraw-app/`** — full web app (excalidraw.com client)
- **`packages/*`** — library packages (`@excalidraw/excalidraw`, `common`, `element`, `math`, `utils`)
- **`examples/*`** — integration demos (optional)

See `CLAUDE.md` and `dev-docs/docs/introduction/development.mdx` for standard dev commands.

### Running the app

```bash
yarn start   # Vite dev server for excalidraw-app
```

- Default dev URL: **http://localhost:3001** (set by root `.env.development` via `VITE_APP_PORT=3001`).
- Docs mention port 3000 as a fallback when `VITE_APP_PORT` is unset.
- No package prebuild is required for `yarn start`; Vite resolves workspace packages via aliases.

Start the dev server in a **tmux** session if it needs to stay running in the background.

### Lint / test / typecheck

| Command | Purpose |
|---------|---------|
| `yarn test:typecheck` | TypeScript (`tsc`) |
| `yarn test:code` | ESLint |
| `yarn test:other` | Prettier check |
| `yarn test:app --watch=false` | Vitest unit/integration tests (103 files) |
| `yarn test:all` | Full CI gate (typecheck + lint + prettier + tests) |
| `yarn fix` | Auto-fix formatting and lint |

Before committing, the project expects `yarn test:update` (see `CLAUDE.md`).

### Optional services (not required for basic dev)

These are **not** in this repo and are not needed to draw, export, or run the test suite:

| Feature | External dependency | Default |
|---------|---------------------|---------|
| Real-time collaboration | [excalidraw-room](https://github.com/excalidraw/excalidraw-room) on port 3002 | Optional |
| Share links / libraries | Remote APIs (`json-dev.excalidraw.com`, Firebase) | Enabled in dev via `.env.development` |
| AI diagram-to-code | Local service on port 3016 | Optional |

Drawing, local storage, export, and most editor features work with **`yarn start` only**.

### Gotchas

- **Node ≥ 18**, **Yarn 1.22.x** (pinned in root `package.json` as `packageManager`).
- Husky pre-commit hook exists but `lint-staged` is commented out in `.husky/pre-commit`.
- Vitest may log `Error JSON parsing firebase config` in stderr during app tests; tests still pass.
- Do not run `examples/with-script-in-browser` alongside the main app — both default to port 3001.
- `yarn start:example` requires `yarn build:packages` first (handled by that script).
