#!/usr/bin/env bash
set -euo pipefail

# Explicit database migration step, separate from image building or serving
# HTTP requests. Never run against production without reviewed migrations,
# a current backup/PITR plan, and EXAMTREE_SCHEMA_MIGRATION_APPROVED=yes.
if [[ "\${EXAMTREE_SCHEMA_MIGRATION_APPROVED:-}" != "yes" || -z "\${DATABASE_URL:-}" ]]; then
  echo "Refusing schema migration. Set EXAMTREE_SCHEMA_MIGRATION_APPROVED=yes and DATABASE_URL securely." >&2
  exit 2
fi
ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile --filter @workspace/api-server...

pnpm --dir artifacts/api-server exec node ensure-learning-resources.mjs
pnpm --dir artifacts/api-server exec node ensure-student-exam-preferences.mjs
pnpm --dir artifacts/api-server exec node reconcile-mobile-home-catalogue.mjs
pnpm --dir artifacts/api-server exec node audit-catalogue.mjs
pnpm --dir artifacts/api-server exec node ensure-current-affairs.mjs
pnpm --dir artifacts/api-server exec node ensure-mobile-home.mjs
pnpm --dir artifacts/api-server exec esbuild notes-studio-migrate.ts --bundle \
  --packages=external --platform=node --format=esm --outfile=dist/notes-studio-migrate.mjs
(cd artifacts/api-server && node dist/notes-studio-migrate.mjs)
pnpm --dir artifacts/api-server exec esbuild notes-studio-v2-migrate.ts --bundle \
  --packages=external --platform=node --format=esm --outfile=dist/notes-studio-v2-migrate.mjs
(cd artifacts/api-server && node dist/notes-studio-v2-migrate.mjs)
echo "Examtree schema bootstrap completed for the explicitly selected database."
