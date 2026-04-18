#!/bin/bash
set -e

# Install pnpm via corepack (included with Node 18+)
corepack enable
corepack prepare pnpm@10.33.0 --activate

# Install all deps including devDependencies (esbuild needed for build)
pnpm install --no-frozen-lockfile --prod=false

# Build only the API server using esbuild (skips typecheck)
node artifacts/api-server/build.mjs
