#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="$ROOT/scripts/verify-examtree-cloudrun-authenticated.sh"
bash -n "$FILE"
for expected in \
  'set +x' \
  'read -r -s -p' \
  'curl --config -' \
  '--request GET' \
  '/api/me/profile' \
  '/api/commerce/purchases' \
  '/api/admin/commerce/orders/reconciliation/health' \
  '[[ "$status" == 403 ]]' \
  'requiresProviderVerification' \
  "identity mapping"; do
  grep -F -- "$expected" "$FILE" >/dev/null || { echo "FAIL: expected guard missing: $expected" >&2; exit 1; }
done
if grep -E -- 'curl .*--(data|data-raw|form)|--request (POST|PUT|PATCH|DELETE)|gcloud run jobs execute|gcloud scheduler jobs create|createCashfreeRefund' "$FILE" | grep -v '^#'; then
  echo 'FAIL: auth verification script includes a financial write request or background activation' >&2
  exit 1
fi
python3 - "$FILE" <<'PY'
import sys
from pathlib import Path
s=Path(sys.argv[1]).read_text()
assert "echo \"$STUDENT_TOKEN\"" not in s
assert "echo \"$ADMIN_TOKEN\"" not in s
assert "set -x" not in s
assert 'TMP="$(mktemp -d)"' in s
assert "rm -rf \"$TMP\"" in s
assert "identity mapping" in s
print("PASS: hidden Firebase bearer handling; no explicit finance or attempt mutation")
PY
