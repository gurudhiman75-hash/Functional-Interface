#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHECK="$ROOT/ops/neon-daily-backup/check_bucket_security.py"

# Cloud SDK default normalized metadata: top-level snake_case fields.
printf '%s\n' '{"name":"sarbedutech","location":"US-EAST1","public_access_prevention":"enforced","uniform_bucket_level_access":true}' |
  python3 "$CHECK"

# Raw Cloud Storage JSON API: nested camelCase IAM fields.
printf '%s\n' '{"name":"sarbedutech","iamConfiguration":{"publicAccessPrevention":"enforced","uniformBucketLevelAccess":{"enabled":true}}}' |
  python3 "$CHECK"

# Accept alternative normalized nested IAM structure without bypassing checks.
printf '%s\n' '{"name":"sarbedutech","iam_configuration":{"public_access_prevention":"enforced","uniform_bucket_level_access":{"enabled":true}}}' |
  python3 "$CHECK"

reject() {
  local label="$1" body="$2"
  if printf '%s\n' "$body" | python3 "$CHECK" >/dev/null 2>&1; then
    echo "FAIL: unsafe backup bucket accepted ($label)" >&2
    exit 1
  fi
}
reject "public inherited" '{"name":"sarbedutech","public_access_prevention":"inherited","uniform_bucket_level_access":true}'
reject "uniform off" '{"name":"sarbedutech","public_access_prevention":"enforced","uniform_bucket_level_access":false}'
reject "missing access controls" '{"name":"sarbedutech"}'
reject "wrong bucket" '{"name":"sarbedutech.firebasestorage.app","public_access_prevention":"enforced","uniform_bucket_level_access":true}'
reject "deceptive truthy string" '{"name":"sarbedutech","public_access_prevention":"enforced","uniform_bucket_level_access":"false"}'
reject "malformed JSON" '{"name":"sarbedutech"'
echo 'PASS: GCS bucket normalized/raw IAM formats validated, unsafe configurations rejected.'
