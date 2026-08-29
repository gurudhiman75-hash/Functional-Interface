#!/bin/bash
set -euo pipefail

corepack enable
corepack prepare pnpm@10.33.0 --activate

echo "[current-affairs-worker] install API workspace graph"
pnpm install \
  --frozen-lockfile \
  --prod=false \
  --force \
  --filter @workspace/api-server...

echo "[current-affairs-worker] compile scheduled feed worker"
pnpm --dir artifacts/api-server exec esbuild \
  src/current-affairs/feed-worker.ts \
  --bundle \
  --packages=external \
  --platform=node \
  --format=esm \
  --sourcemap \
  --outfile=dist/current-affairs-feed-worker.mjs

echo "[current-affairs-worker] complete"
