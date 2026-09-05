#!/bin/bash
set -euo pipefail

# NODE_OPTIONS on Render is reserved for the production API runtime. Do not
# let a runtime heap cap constrain Vite/esbuild or migration subprocesses.
unset NODE_OPTIONS

# Install pnpm via corepack (included with Node 18+).
corepack enable
corepack prepare pnpm@10.33.0 --activate

# Render only deploys the student app, admin app and API runtime. Keep the
# install graph limited to those workspaces (plus their workspace deps) so the
# ever-growing chapter/test workspace cannot inflate production build memory.
echo "[render-build] install deployed workspace graph"
pnpm install \
  --frozen-lockfile \
  --prod=false \
  --force \
  --filter @workspace/examtree... \
  --filter @workspace/examtree-admin... \
  --filter @workspace/api-server...

# The GitHub Render-equivalent build intentionally has no production database
# credentials. Skip DB mutation only in that exact environment. Real Render is
# not GITHUB_ACTIONS, so a missing DATABASE_URL still fails closed inside the
# bootstrap scripts instead of silently deploying against an unknown schema.
if [[ "${GITHUB_ACTIONS:-}" == "true" && -z "${DATABASE_URL:-}" ]]; then
  echo "[render-build] GitHub Actions without DATABASE_URL; skip production schema bootstrap"
else
  # Production code already depends on content.learning_resources. Verify that
  # foundation before compiling the deployed apps. If an older production DB is
  # missing it, apply the existing idempotent checked-in migration and verify it.
  echo "[render-build] verify learning resources schema"
  pnpm --dir artifacts/api-server exec node ensure-learning-resources.mjs

  # Current Affairs has a cumulative, explicitly ordered schema. Apply only its
  # checked-in migrations through a dedicated ledger, under an advisory lock,
  # before any runtime that can generate yesterday's packs is deployed.
  echo "[render-build] verify Current Affairs schema"
  pnpm --dir artifacts/api-server exec node ensure-current-affairs.mjs

  # Legacy Notes Studio retains its existing ordered migration authority.
  echo "[render-build] verify Notes Studio schema"
  pnpm --dir artifacts/api-server exec esbuild notes-studio-migrate.ts --platform=node --packages=external --format=esm --outfile=dist/notes-studio-migrate.mjs
  pnpm --dir artifacts/api-server exec node dist/notes-studio-migrate.mjs

  # Notes Studio v2 is isolated from the legacy Notes Studio schema. Its
  # dedicated migrator owns only the notes_studio_v2 manifest + ledger and
  # verifies all relations/triggers before the API runtime is built.
  echo "[render-build] verify Notes Studio v2 schema"
  pnpm --dir artifacts/api-server exec esbuild notes-studio-v2-migrate.ts --platform=node --packages=external --format=esm --outfile=dist/notes-studio-v2-migrate.mjs
  pnpm --dir artifacts/api-server exec node dist/notes-studio-v2-migrate.mjs
fi

# Build the student and admin SPAs before the server. The server hosts both
# dist trees from the single Render service.
echo "[render-build] build student app"
pnpm --filter @workspace/examtree build

echo "[render-build] build admin app"
RENDER=true pnpm --filter @workspace/examtree-admin build

echo "[render-build] assemble hosting tree"
node scripts/assemble-hosting-tree.mjs

echo "[render-build] build API runtime"
pnpm --dir artifacts/api-server exec node build-runtime.mjs

echo "[render-build] complete"
