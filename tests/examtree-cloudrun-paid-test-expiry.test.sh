#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="$ROOT/scripts/verify-examtree-cloudrun-paid-test-expiry.sh"
bash -n "$FILE"
for required in \
  'set +x' \
  'read -r -s -p' \
  'curl --config -' \
  '--request GET' \
  '/api/commerce/access/tests/' \
  '/api/tests/' \
  'paidAccessRequired' \
  'entitlement_required' \
  '"$STATUS" == 403' \
  'FIREBASE_TOKEN=""'; do
  grep -F -- "$required" "$FILE" >/dev/null || {
    echo "FAIL: paid-test expiry acceptance guard missing: $required" >&2; exit 1;
  }
done
if grep -E -- '--request (POST|PUT|PATCH|DELETE)|gcloud run jobs execute|gcloud scheduler jobs create|curl .*--data' "$FILE" | grep -v '^[[:space:]]*#'; then
  echo 'FAIL: paid-test expiry regression unexpectedly mutated test/payment state' >&2; exit 1;
fi
python3 - "$ROOT/artifacts/api-server/src/routes/canonical-commerce-access-guard.ts" "$FILE" <<'PY'
from pathlib import Path
import sys
guard=Path(sys.argv[1]).read_text()
smoke=Path(sys.argv[2]).read_text()
assert 'router.get("/commerce/access/tests/:id", authenticate' in guard
assert 'res.status(200).json({ allowed: false, paidAccessRequired: true' in guard
assert 'router.get("/tests/:id", authenticate' in guard
assert 'paidAccessRequired' in smoke and 'entitlement_required' in smoke
print('PASS: paid-test expiry negative smoke agrees with canonical access guard')
PY
