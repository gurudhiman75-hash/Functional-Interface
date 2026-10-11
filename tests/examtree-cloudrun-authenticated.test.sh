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
  '/api/users/me/profile' \
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
python3 - "$FILE" "$ROOT/artifacts/api-server/src/routes/index.ts" "$ROOT/artifacts/api-server/src/routes/student-profile.ts" <<'PY'
import sys
from pathlib import Path
s=Path(sys.argv[1]).read_text()
registry=Path(sys.argv[2]).read_text()
profile=Path(sys.argv[3]).read_text()
# Catch mismatched registry mounts before running the smoke with real Firebase
# bearer tokens. The compiled path is /api + /users + /me/profile.
assert 'router.use("/users", studentProfileRouter)' in registry
assert 'router.get("/me/profile",' in profile
assert 'expect_200 "student profile" "$STUDENT_TOKEN" /api/users/me/profile' in s
assert 'expect_200 "student profile" "$STUDENT_TOKEN" /api/me/profile' not in s
assert "echo \"$STUDENT_TOKEN\"" not in s
assert "echo \"$ADMIN_TOKEN\"" not in s
assert "set -x" not in s
assert 'TMP="$(mktemp -d)"' in s
assert "rm -rf \"$TMP\"" in s
assert "identity mapping" in s
print("PASS: hidden Firebase bearer handling; no explicit finance or attempt mutation")
PY
