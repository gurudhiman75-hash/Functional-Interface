#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="$ROOT/scripts/verify-examtree-cloudrun-staging-security.sh"
bash -n "$FILE"
for required in \
  'REQUIRED_COMMIT=038fe2d1d5ddcab77588fe2079d8f40075924f24' \
  'git -C "$ROOT" merge-base --is-ancestor' \
  '/api/commerce/purchases' \
  '/api/admin/commerce/orders/reconciliation/health' \
  '/api/commerce/access/tests/' \
  '/api/attempt-sessions/' \
  'Authorization: Bearer invalid-staging-token' \
  'Origin: https://examtree.in' \
  'Origin: https://unauthorized.example' \
  'checkoutProvider' \
  'get /api/commerce/products' \
  --request; do
  grep -F -- "$required" "$FILE" >/dev/null || {
    echo "FAIL: source-provenance or GET-only guard missing: $required" >&2
    exit 1
  }
done
if grep -E -- '--request (POST|PUT|PATCH|DELETE)|gcloud run jobs execute|gcloud scheduler jobs create|psql|refunds/[a-zA-Z0-9]+/reconcile' "$FILE" | grep -v '^[[:space:]]*#'; then
  echo 'FAIL: staging security smoke added a mutating command' >&2
  exit 1
fi
echo 'PASS: Cloud Run staging smoke syntax, pinned source and nonmutating requests'
