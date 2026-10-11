#!/usr/bin/env bash
set -euo pipefail
file=scripts/verify-examtree-cloudrun-scored-attempt.sh
bash -n "$file"
grep -Fq 'EXAMTREE_ATTEMPT_WRITE_APPROVED' "$file"
grep -Fq 'SCORE-DISPOSABLE-ATTEMPT' "$file"
grep -Fq 'paidAccessRequired' "$file"
grep -Fq 'read -r -s' "$file"
grep -Fq '1.5' "$file"
grep -Fq 'repeat submission idempotent' "$file"
if grep -Eq 'set -x|--insecure|cashfree|refund|gcloud secrets versions access' "$file"; then
 echo 'FAIL: unsafe smoke workflow' >&2
 exit 1
fi
echo 'PASS: opt-in scored attempt gate syntax and safety constraints'
