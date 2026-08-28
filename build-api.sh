#!/bin/bash
set -euo pipefail

# Install pnpm via corepack (included with Node 18+).
corepack enable
corepack prepare pnpm@10.33.0 --activate

# Render preserves build caches between deploys. Force pnpm to relink the exact
# frozen dependency graph so stale React declaration symlinks cannot survive.
pnpm install --frozen-lockfile --prod=false --force

# Build the student and admin applications, then assemble a single static tree.
# Both applications call the API through the production Render origin.
pnpm run build:hosting

# Build the API server using the established esbuild production bundle.
API_PRODUCTION_ONLY=1 node artifacts/api-server/build.mjs
