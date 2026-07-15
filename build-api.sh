#!/bin/bash
set -euo pipefail

# Install pnpm via corepack (included with Node 18+).
corepack enable
corepack prepare pnpm@10.33.0 --activate

# Install all dependencies, including build-time tooling.
pnpm install --frozen-lockfile --prod=false

# Build the student and admin applications, then assemble a single static tree.
# Both applications call the API through the production Render origin.
pnpm run build:hosting

# Build the API server using the established esbuild production bundle.
node artifacts/api-server/build.mjs
