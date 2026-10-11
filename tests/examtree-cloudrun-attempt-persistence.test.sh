#!/usr/bin/env bash
set -euo pipefail
FILE="scripts/verify-examtree-cloudrun-attempt-persistence.sh"
bash -n "$FILE"
grep -Fq 'EXAMTREE_ATTEMPT_WRITE_APPROVED' "$FILE"
grep -Fq 'WRITE-DISPOSABLE-ATTEMPT' "$FILE"
grep -Fq 'paidAccessRequired' "$FILE"
grep -Fq 'read -r -s' "$FILE"
grep -Fq 'request PATCH' "$FILE"
grep -Fq 'request GET "/api/attempts/' "$FILE"
grep -Fq 'STATUS="$(request POST /api/attempts "$PAYLOAD")"' "$FILE"
if grep -Eq 'curl .*--insecure|set -x|gcloud secrets versions access|/refund|cashfree/orders' "$FILE"; then
  echo 'FAIL: unsafe verification script operation' >&2
  exit 1
fi
echo 'PASS: opt-in staging attempt smoke syntax and safety guards'
