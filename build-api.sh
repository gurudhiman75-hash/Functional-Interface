#!/bin/bash
set -e

# Install pnpm via corepack (included with Node 18+)
corepack enable
corepack prepare pnpm@10.33.0 --activate

# Install all deps including devDependencies (esbuild needed for build)
pnpm install --no-frozen-lockfile --prod=false

# Build the frontend first (Vite → artifacts/examtree/dist/public)
# VITE_API_BASE_URL is /api since the API server serves both on the same origin
VITE_API_BASE_URL=/api pnpm --filter examtree build

# Build the API server using esbuild (skips typecheck)
node artifacts/api-server/build.mjs
