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

echo "[current-affairs-worker] compile primary-source fact enrichment worker"
pnpm --dir artifacts/api-server exec esbuild \
  src/current-affairs/primary-enrichment-worker.ts \
  --bundle \
  --packages=external \
  --platform=node \
  --format=esm \
  --sourcemap \
  --outfile=dist/current-affairs-primary-enrichment-worker.mjs

echo "[current-affairs-worker] compile intelligence/daily orchestration worker"
pnpm --dir artifacts/api-server exec esbuild \
  src/current-affairs/daily-worker.ts \
  --bundle \
  --packages=external \
  --platform=node \
  --format=esm \
  --sourcemap \
  --outfile=dist/current-affairs-daily-worker.mjs

echo "[current-affairs-worker] compile in-app notification scheduler"
pnpm --dir artifacts/api-server exec esbuild \
  src/current-affairs/notification-worker.ts \
  --bundle \
  --packages=external \
  --platform=node \
  --format=esm \
  --sourcemap \
  --outfile=dist/current-affairs-notification-worker.mjs

echo "[current-affairs-worker] compile production readiness/recovery worker"
pnpm --dir artifacts/api-server exec esbuild \
  src/current-affairs/production-ops-worker.ts \
  --bundle \
  --packages=external \
  --platform=node \
  --format=esm \
  --sourcemap \
  --outfile=dist/current-affairs-production-ops-worker.mjs

echo "[current-affairs-worker] complete"
