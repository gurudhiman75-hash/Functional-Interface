#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/bin"
cat > "$WORK/bin/gcloud" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$FAKE_LOG"
case "$*" in
  "config get-value project") printf '%s\n' sarbedutech ;;
  "scheduler jobs describe examtree-neon-backup-daily-trigger "*) printf '%s\n' ENABLED ;;
  "scheduler jobs describe examtree-neon-backup-freshness-trigger "*) exit 1 ;;
  "iam service-accounts describe "*) ;;
  "iam service-accounts create "*) ;;
  "monitoring policies list "*) echo 'Examtree - daily Neon backup failed' ;;
  "storage buckets add-iam-policy-binding "*) ;;
  "run jobs deploy "*) ;;
  "run jobs add-iam-policy-binding "*) ;;
  "run jobs execute "*)
    echo 'ERROR: test-only simulated read-only freshness probe failed' >&2
    exit 1
    ;;
  *) echo "FAIL: unexpected command: $*" >&2; exit 4 ;;
esac
MOCK
chmod 0700 "$WORK/bin/gcloud"
export FAKE_LOG="$WORK/calls.log"
export PATH="$WORK/bin:$PATH"
export FRESHNESS_ALERT_CHANNEL='projects/sarbedutech/notificationChannels/3875048863295925837'

if bash "$ROOT/ops/neon-backup-freshness/deploy.sh" --apply > "$WORK/output.log" 2>&1; then
  echo 'FAIL: watchdog deployment should not succeed if first probe fails' >&2
  exit 1
fi
grep -q 'backup freshness deployment stopped at: check real private daily backup objects today' "$WORK/output.log"
grep -q 'run jobs execute examtree-neon-backup-freshness' "$WORK/calls.log"
if grep -q 'scheduler jobs create' "$WORK/calls.log" || grep -q 'monitoring policies create' "$WORK/calls.log"; then
  echo 'FAIL: unexpected schedule or alert after first probe failure' >&2
  exit 1
fi
echo 'PASS: unreadable/missing backup stops watchdog deployment before alert or schedule creation.'
