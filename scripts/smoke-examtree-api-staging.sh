#!/usr/bin/env bash
set -euo pipefail
# Read-only/negative staging checks: no login token, no test attempts, no
# successful payment webhook, and no generation jobs are created.
URL="\${1:-}"
if [[ ! "$URL" =~ ^https://[a-zA-Z0-9.-]+\.run\.app$ ]]; then
  echo "Usage: bash scripts/smoke-examtree-api-staging.sh https://YOUR-SERVICE.run.app" >&2
  exit 2
fi
RESULT="$(mktemp)"
trap 'rm -f "$RESULT"' EXIT

curl --fail-with-body --silent --show-error --max-time 90 "$URL/health" --output "$RESULT"
node - "$RESULT" <<'NODE'
const fs = require("node:fs");
const body = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (body.status !== "ok") throw new Error("Unexpected health response");
console.log("PASS: API health");
NODE

RUN_STATUS="$(curl --silent --show-error --max-time 90 --output "$RESULT" --write-out '%{http_code}' \
  -H 'Content-Type: application/json' \
  -d '{"packageId":"NUM-001","engineId":"quant-v4","count":1,"language":"en","difficulty":"Easy","cpIds":["NUM-CP-001"]}' \
  "$URL/api/admin/question-studio/runs")"
if [[ "$RUN_STATUS" != 401 && "$RUN_STATUS" != 403 ]]; then
  echo "FAIL: unsigned Question Studio request returned HTTP $RUN_STATUS, expected 401 or 403" >&2
  exit 1
fi
echo "PASS: Question Studio denies unauthenticated generation ($RUN_STATUS)"

WEBHOOK_STATUS="$(curl --silent --show-error --max-time 90 --output "$RESULT" --write-out '%{http_code}' \
  -H 'Content-Type: application/json' -d '{"type":"PAYMENT_SUCCESS_WEBHOOK"}' \
  "$URL/api/billing/cashfree/webhook")"
if [[ "$WEBHOOK_STATUS" != 400 && "$WEBHOOK_STATUS" != 503 ]]; then
  echo "FAIL: unsigned payment webhook returned HTTP $WEBHOOK_STATUS, expected 400 or 503" >&2
  exit 1
fi
echo "PASS: Cashfree webhook rejects unsigned request ($WEBHOOK_STATUS)"
echo "EXAMTREE API NEGATIVE SMOKE PASSED"
