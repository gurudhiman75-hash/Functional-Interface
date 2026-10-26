#!/usr/bin/env bash
# Read-only external/browser-preflight probe. Does not authenticate, enqueue, mutate DB, or deploy.
set -euo pipefail
set +x
ORIGIN="https://examtree-qs-admin-api-staging-1083299267005.asia-south1.run.app"
PREVIEW="https://examtree-qs-admin-preview.pages.dev"
DIR="$(mktemp -d)"
trap 'rm -rf "$DIR"' EXIT
CHECK_FAILED=0
echo "Probing dedicated isolated Cloud Run staging API, not production"
echo "Origin: $ORIGIN"
echo "Preview browser origin: $PREVIEW"
echo "::group::Unauthenticated health (GET)"
HEALTH="$(curl --silent --show-error --location --max-time 25 -o "$DIR/health-body" -D "$DIR/health-headers" -w '%{http_code}' "$ORIGIN/health")" || HEALTH="000"
echo "GET /health HTTP $HEALTH"
if [[ "$HEALTH" != 200 ]]; then
  echo "::error::The dedicated staging Cloud Run API is not publicly healthy (HTTP $HEALTH). Check service existence, IAM public invoker, current revision, and DNS before changing Pages routing."
  CHECK_FAILED=1
fi
echo "::endgroup::"
echo "::group::Browser authorization preflight (OPTIONS)"
PREFLIGHT="$(curl --silent --show-error --max-time 25 -X OPTIONS \
  -H "Origin: $PREVIEW" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization" \
  -o "$DIR/options-body" -D "$DIR/options-headers" -w '%{http_code}' \
  "$ORIGIN/api/admin/session/bootstrap")" || PREFLIGHT="000"
echo "OPTIONS /api/admin/session/bootstrap HTTP $PREFLIGHT"
if [[ "$PREFLIGHT" != 200 && "$PREFLIGHT" != 204 ]]; then
  echo "::error::Browser preflight rejected/unreachable (HTTP $PREFLIGHT). Verify dedicated Cloud Run service and CORS_ORIGINS includes preview hostname."
  CHECK_FAILED=1
fi
if ! grep -iq "^access-control-allow-origin: $PREVIEW" "$DIR/options-headers"; then
  echo "::error::Missing/mismatched Access-Control-Allow-Origin for isolated admin preview."
  CHECK_FAILED=1
fi
if ! grep -iq '^access-control-allow-headers:.*authorization' "$DIR/options-headers"; then
  echo "::error::Missing Access-Control-Allow-Headers authorization for Firebase ID token."
  CHECK_FAILED=1
fi
echo "::endgroup::"
if [[ "$CHECK_FAILED" != 0 ]]; then
  echo "FAIL: isolated staging API browser connectivity; no configuration changes made"
  exit 1
fi
echo "PASS: isolated staging API health and browser preflight"
