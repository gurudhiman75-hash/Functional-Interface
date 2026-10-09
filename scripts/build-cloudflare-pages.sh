#!/usr/bin/env bash
set -euo pipefail
# Cloudflare Pages serves static student/admin and prerendered marketing assets.
# API /api/* continues on Render via an isolated Cloudflare Pages Function.
cd "$(dirname "${BASH_SOURCE[0]}")/.."
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile \
  --filter @workspace/examtree... \
  --filter @workspace/examtree-admin...
# Override .env.production's direct Render URLs at Cloudflare build time.
export VITE_API_BASE_URL="/api"
export VITE_API_URL="/api"
export EXAMTREE_RENDER_BUILD=1
echo "[cloudflare-pages] Building student frontend"
pnpm --dir artifacts/examtree build
echo "[cloudflare-pages] Building admin frontend"
pnpm --dir artifacts/admin-app exec vite build
node scripts/assemble-hosting.mjs
DIST="artifacts/examtree/dist/public"
test -f "$DIST/index.html"
test -f "$DIST/admin/index.html"
test -f "$DIST/_redirects"
test -f "$DIST/_routes.json"
node --test tests/cloudflare-pages-proxy.test.mjs
node tests/cloudflare-pages-output.test.mjs
echo "[cloudflare-pages] Build complete: $DIST"
