#!/bin/bash
set -euo pipefail

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
  pnpm --dir artifacts/api-server exec esbuild notes-studio-migrate.ts \
    --bundle --packages=external --platform=node --format=esm \
    --outfile=dist/notes-studio-migrate.mjs
  (cd artifacts/api-server && node dist/notes-studio-migrate.mjs)

  # Notes Studio v2 is intentionally isolated from the legacy schema and ledger.
  # Compile and execute its own ordered migrator before the v2 API can be served.
  echo "[render-build] verify Notes Studio v2 schema"
  pnpm --dir artifacts/api-server exec esbuild notes-studio-v2-migrate.ts \
    --bundle --packages=external --platform=node --format=esm \
    --outfile=dist/notes-studio-v2-migrate.mjs
  (cd artifacts/api-server && node dist/notes-studio-v2-migrate.mjs)
fi

# Build the student app. Its build also generates the public prerender files.
echo "[render-build] build student app"
pnpm --dir artifacts/examtree build

# Render deploys the already typechecked admin bundle. Do not run the admin
# package's `tsc -b --force` here: that is a CI/development validation concern
# and is one of the highest-heap Node phases in the production deploy path.
# Source maps are also disabled for this deploy-only Vite build.
#
# The Render service serves both the admin SPA and the API. Force the production
# admin bundle to use same-origin /api even if the Render environment still has
# a legacy VITE_API_URL configured. Otherwise the SPA can load successfully
# while browser requests fail at DNS/CORS before reaching this deployment.
echo "[render-build] build admin app"
VITE_API_URL=/api EXAMTREE_RENDER_BUILD=1 pnpm --dir artifacts/admin-app exec vite build

# Assemble the single static tree served by the API service.
echo "[render-build] assemble hosting tree"
node scripts/assemble-hosting.mjs

# Production only starts dist/index.mjs. Use the runtime-only bundler instead
# of build.mjs, which intentionally also emits migration scripts, validators,
# stress tools and quant test harnesses for development/CI use.
echo "[render-build] build API runtime"
node artifacts/api-server/build-runtime.mjs

echo "[render-build] complete"
