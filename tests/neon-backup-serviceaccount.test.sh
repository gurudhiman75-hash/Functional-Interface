#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/bin" "$WORK/state"
cat > "$WORK/bin/sleep" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
cat > "$WORK/bin/gcloud" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$FAKE_GCLOUD_LOG"
case "$*" in
  'config get-value project'*) echo sarbedutech ;;
  'secrets describe '*) ;;
  'secrets versions list '*) echo 2 ;;
  'storage buckets describe '*) printf '%s\n' '{"name":"sarbedutech","public_access_prevention":"enforced","uniform_bucket_level_access":true}' ;;
  'services enable '*) ;;
  'iam service-accounts describe '*)
    email="$4"
    key="${email%@*}"
    key="${key##*-}"
    countfile="$FAKE_GCLOUD_STATE/$key.count"
    count="$(cat "$countfile" 2>/dev/null || echo 0)"
    count=$((count + 1))
    printf '%s' "$count" > "$countfile"
    # First lookup fails (account not created), then 2 propagation reads fail.
    (( count >= 4 )) || exit 1
    ;;
  'iam service-accounts create '*) ;;
  'secrets add-iam-policy-binding '*|'storage buckets add-iam-policy-binding '*)
    email="$(printf '%s\n' "$*" | grep -o 'examtree-neon-backup@sarbedutech.iam.gserviceaccount.com' || true)"
    [[ -n "$email" ]]
    countfile="$FAKE_GCLOUD_STATE/policy.count"
    count="$(cat "$countfile" 2>/dev/null || echo 0)"
    count=$((count + 1))
    printf '%s' "$count" > "$countfile"
    # First policy API write still rejects SA, next succeeds.
    if (( count == 1 )); then
      echo 'ERROR: status code 400: Service account does not exist' >&2
      exit 1
    fi
    ;;
  'run jobs deploy '*)
    echo 'ERROR: status code 400: default Cloud Build service account does not exist' >&2
    exit 1
    ;;
  *) echo "UNEXPECTED FAKE GCLOUD CALL: $*" >&2; exit 4 ;;
esac
MOCK
chmod 700 "$WORK/bin/gcloud" "$WORK/bin/sleep"
export PATH="$WORK/bin:$PATH"
export FAKE_GCLOUD_LOG="$WORK/gcloud.log" FAKE_GCLOUD_STATE="$WORK/state"
if bash "$ROOT/ops/neon-daily-backup/deploy.sh" --apply >"$WORK/output.log" 2>&1; then
  echo 'FAIL: deployment proceeded despite mock build failure' >&2
  exit 1
fi
grep -q 'PASS: service account identity is visible: examtree-neon-backup@' "$WORK/output.log"
grep -q 'PASS: service account identity is visible: examtree-neon-scheduler@' "$WORK/output.log"
grep -q 'IAM policy grant not yet accepted; retrying' "$WORK/output.log"
grep -q 'stage: deploy Cloud Run backup job' "$WORK/output.log"
grep -q 'run jobs deploy' "$WORK/gcloud.log"
! grep -q 'scheduler jobs create' "$WORK/gcloud.log"
! grep -q 'run jobs execute' "$WORK/gcloud.log"
echo 'PASS: service account propagation retry and pre-schedule deployment failure handling'
