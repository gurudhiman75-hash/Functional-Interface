#!/usr/bin/env bash
# Build or deploy the isolated Question Studio admin UI to its OWN Pages project.
# Never deploy into Examtree's existing live Cloudflare Pages project.
set -euo pipefail
set +x
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
MODE="${MODE:-check}"
PROJECT=examtree-qs-admin-preview
EXPECTED_API_PREFIX="https://examtree-qs-admin-api-staging-"
API_ORIGIN="${EXAMTREE_QS_ADMIN_API_ORIGIN:-}"
[[ "$MODE" == check || "$MODE" == build || "$MODE" == deploy ]] || {
  echo "STOP: MODE must be check, build or deploy"; exit 2;
}
if [[ "$API_ORIGIN" != "$EXPECTED_API_PREFIX"*.run.app || "$API_ORIGIN" == *"/"*"/"*"/"* ]]; then
  echo "STOP: EXAMTREE_QS_ADMIN_API_ORIGIN must be the dedicated staging Cloud Run HTTPS origin, with no path"; exit 2;
fi
# Parse and constrain the full hostname; cannot accidentally compile a Render
# or production API upstream into the admin preview.
API_ORIGIN="$API_ORIGIN" python3 -c '
import os,sys
from urllib.parse import urlsplit
x=urlsplit(os.environ["API_ORIGIN"])
host=x.hostname or ""
if not (x.scheme=="https" and host.startswith("examtree-qs-admin-api-staging-")
 and host.endswith(".run.app") and not x.username and not x.password
 and x.path in ("","/") and not x.query and not x.fragment):
 sys.exit("STOP: dedicated staging API hostname validation failed")
'
for key in VITE_FIREBASE_API_KEY VITE_FIREBASE_AUTH_DOMAIN VITE_FIREBASE_PROJECT_ID \
           VITE_FIREBASE_STORAGE_BUCKET VITE_FIREBASE_MESSAGING_SENDER_ID VITE_FIREBASE_APP_ID; do
  [[ -n "${!key:-}" ]] || { echo "STOP: missing public Firebase Vite build setting $key"; exit 2; }
done
[[ "${VITE_FIREBASE_PROJECT_ID}" == sarbedutech ]] || {
  echo "STOP: Firebase project must match sarbedutech"; exit 2;
}
echo "PASS: API is isolated Cloud Run staging, Firebase frontend config present"
echo "Isolated Cloudflare Pages project: $PROJECT"
if [[ "$MODE" == check ]]; then
  echo "CHECK ONLY: no installation, build or Cloudflare actions"
  exit 0
fi
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile --filter @workspace/examtree-admin...
export VITE_API_URL="$API_ORIGIN/api"
export VITE_QUESTION_STUDIO_ASYNC_STAGING=true
export EXAMTREE_RENDER_BUILD=1
pnpm --dir artifacts/admin-app exec vite build

PREVIEW_DIR="$(mktemp -d)"
trap 'rm -rf "$PREVIEW_DIR"' EXIT
mkdir -p "$PREVIEW_DIR/public/admin" "$PREVIEW_DIR/functions/admin"
cp -a artifacts/admin-app/dist/public/. "$PREVIEW_DIR/public/admin/"
cp 'functions/admin/[[path]].js' "$PREVIEW_DIR/functions/admin/[[path]].js"
cat > "$PREVIEW_DIR/public/index.html" <<'HTML'
<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=/admin/">
<title>ExamTree QS Admin Staging</title>
</head><body><a href="/admin/">Open isolated staging admin</a></body></html>
HTML
cat > "$PREVIEW_DIR/public/_routes.json" <<'JSON'
{"version":1,"include":["/admin/*"],"exclude":["/admin/assets/*","/admin/index.html"]}
JSON
test -f "$PREVIEW_DIR/public/admin/index.html"
echo "PASS: isolated admin-only Pages payload built"
if [[ "$MODE" == build ]]; then
  echo "BUILD ONLY: nothing deployed"
  exit 0
fi
[[ "${EXAMTREE_QS_ADMIN_PREVIEW_DEPLOY_APPROVED:-}" == yes ]] || {
  echo "STOP: EXAMTREE_QS_ADMIN_PREVIEW_DEPLOY_APPROVED=yes required"; exit 2;
}
(
  cd "$PREVIEW_DIR"
  npx --yes wrangler pages deploy ./public --project-name="$PROJECT" --branch=main
)
echo "PASS: isolated Pages project deployment submitted"
echo "Preview URL: https://$PROJECT.pages.dev/admin/"
echo "Check Firebase Authentication authorized domains before sign-in."
