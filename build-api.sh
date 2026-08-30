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

# Production code already depends on content.learning_resources. Verify that
# foundation before compiling the deployed apps. If an older production DB is
# missing it, apply the existing idempotent checked-in migration and verify it.
echo "[render-build] verify learning resources schema"
pnpm --dir artifacts/api-server exec node ensure-learning-resources.mjs

# Build the student app. Its build also generates the public prerender files.
echo "[render-build] build student app"
pnpm --dir artifacts/examtree build

# Render deploys the already typechecked admin bundle. Do not run the admin
# package's `tsc -b --force` here: that is a CI/development validation concern
# and is one of the highest-heap Node phases in the production deploy path.
# Source maps are also disabled for this deploy-only Vite build.
echo "[render-build] build admin app"
EXAMTREE_RENDER_BUILD=1 pnpm --dir artifacts/admin-app exec vite build

# Assemble the single static tree served by the API service.
echo "[render-build] assemble hosting tree"
node scripts/assemble-hosting.mjs

# Production only starts dist/index.mjs. Use the runtime-only bundler instead
# of build.mjs, which intentionally also emits migration scripts, validators,
# stress tools and quant test harnesses for development/CI use.
echo "[render-build] build API runtime"
node artifacts/api-server/build-runtime.mjs

echo "[render-build] complete"
