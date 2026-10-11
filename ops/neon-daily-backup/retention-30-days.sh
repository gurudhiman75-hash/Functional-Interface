#!/usr/bin/env bash
set -euo pipefail
# Prefix-scoped retention; refuse to overwrite an existing lifecycle policy.
[[ "$#" -eq 1 && "${1:-}" == '--apply' ]] || {
  echo 'Usage: bash retention-30-days.sh --apply' >&2; exit 2;
}
BUCKET=sarbedutech
before="$(mktemp)"; config="$(mktemp)"
trap 'rm -f -- "$before" "$config"' EXIT
gcloud storage buckets describe "gs://$BUCKET" --format=json > "$before"
python3 - "$before" "$config" <<'PY'
import json,sys
bucket=json.load(open(sys.argv[1]))
if bucket.get('name')!='sarbedutech':
    sys.exit('Refusing to alter another bucket')
if bucket.get('lifecycle',{}).get('rule'):
    sys.exit('Existing lifecycle policy found: merge manually, do not overwrite.')
policy={'rule':[{'action':{'type':'Delete'},'condition':{'age':30,'matchesPrefix':['neon-backups/daily/']}}]}
with open(sys.argv[2],'w') as f: json.dump(policy,f)
PY
gcloud storage buckets update "gs://$BUCKET" --lifecycle-file="$config"
echo 'PASS: 30-day lifecycle applies to neon-backups/daily/ only.'
