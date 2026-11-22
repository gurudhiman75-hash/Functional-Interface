#!/usr/bin/env bash
# READ-ONLY ExamTree Cloud Run inspection. Run in Cloud Shell (project sarbedutech).
#
# Uses only `gcloud ... describe|list`. It never deploys, changes traffic, edits
# secrets, starts jobs or touches the database. Secret VALUES are never read:
# for secret-backed variables only the Secret Manager *name* is printed, and
# plain variable values are printed only for an allowlist of non-sensitive flags.
#
# Answers: which revision serves students, which revision carries the
# `admin-candidate` tag (Cloudflare sends /api/admin/* there), which commit each
# was built from, which safety flags are set, and whether staging uses its own
# database secret.
#
#   bash scripts/inspect-examtree-cloudrun-readonly.sh | tee /tmp/cloudrun-inspect.txt
set -uo pipefail
set +x

PROJECT=sarbedutech
REGION=asia-south1
SERVICES=(examtree-api examtree-api-staging)

if [[ "$(gcloud config get-value project 2>/dev/null)" != "$PROJECT" ]]; then
  echo "REFUSED: gcloud project must be $PROJECT (run: gcloud config set project $PROJECT)" >&2
  exit 2
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "== inspected at $(date -u +%Y-%m-%dT%H:%M:%SZ) project=$PROJECT region=$REGION"
echo "== local checkout: $(git rev-parse --short HEAD 2>/dev/null || echo n/a) ($(git branch --show-current 2>/dev/null || echo n/a))"

for service in "${SERVICES[@]}"; do
  echo
  echo "================ service: $service ================"
  if ! gcloud run services describe "$service" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/$service.json" 2> "$TMP/$service.err"; then
    echo "UNAVAILABLE: could not describe $service ($(head -c 200 "$TMP/$service.err" | tr '\n' ' '))"
    continue
  fi
  gcloud run revisions list --service="$service" --project="$PROJECT" --region="$REGION" --limit=8 --format=json > "$TMP/$service.revisions.json" 2>/dev/null || echo "[]" > "$TMP/$service.revisions.json"
  python3 - "$TMP/$service.json" "$TMP/$service.revisions.json" <<'PY'
import json, re, sys

service = json.load(open(sys.argv[1]))
try:
    revisions = json.load(open(sys.argv[2]))
except ValueError:
    revisions = []

SAFE_FLAG = re.compile(
    r"^(EXAMTREE_[A-Z0-9_]+|GENERATION_JOB_WORKER_ENABLED|OUTBOX_PUBLISHER_ENABLED|"
    r"AI_EXTRACTION_PROVIDER|NODE_ENV|FIREBASE_PROJECT_ID)$")
SENSITIVE = re.compile(r"KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|DATABASE|DSN", re.I)


def commit_of(image):
    # Images are tagged with the full commit SHA by the deploy scripts.
    tag = (image or "").rsplit(":", 1)[-1]
    return tag[:12] if re.fullmatch(r"[0-9a-f]{40}", tag or "") else f"(tag: {tag or 'n/a'})"


status = service.get("status", {})
print(f"url:                  {status.get('url')}")
print(f"latestReadyRevision:  {status.get('latestReadyRevisionName')}")
print(f"latestCreated:        {status.get('latestCreatedRevisionName')}")

print("\ntraffic:")
for t in status.get("traffic", []):
    target = t.get("revisionName") or "LATEST"
    tag = f"  tag={t['tag']}" if t.get("tag") else ""
    url = f"  url={t['url']}" if t.get("url") else ""
    print(f"  {t.get('percent', 0):>3}%  {target}{tag}{url}")

print("\nrecent revisions (newest first):")
for r in sorted(revisions, key=lambda x: x.get("metadata", {}).get("creationTimestamp", ""), reverse=True):
    meta = r.get("metadata", {})
    containers = (r.get("spec", {}).get("containers") or [{}])
    image = containers[0].get("image", "")
    ready = next((c.get("status") for c in r.get("status", {}).get("conditions", []) if c.get("type") == "Ready"), "?")
    print(f"  {meta.get('name')}  created={meta.get('creationTimestamp')}  ready={ready}  commit={commit_of(image)}")

containers = service.get("spec", {}).get("template", {}).get("spec", {}).get("containers", [])
if containers:
    c = containers[0]
    print(f"\nlatest template image commit: {commit_of(c.get('image'))}")
    res = (c.get("resources") or {}).get("limits") or {}
    print(f"resources: {res}")
    env = c.get("env", [])
    flags, plain_names, secret_refs = {}, [], {}
    for e in env:
        name = e.get("name", "")
        ref = (e.get("valueFrom") or {}).get("secretKeyRef")
        if ref:
            secret_refs[name] = ref.get("name")
        elif SAFE_FLAG.match(name) and not SENSITIVE.search(name):
            flags[name] = e.get("value")
        else:
            plain_names.append(name)
    print("\nnon-sensitive flags (values shown):")
    for k in sorted(flags):
        print(f"  {k}={flags[k]}")
    print("\nsecret-backed variables (Secret Manager NAME only, never values):")
    for k in sorted(secret_refs):
        print(f"  {k} -> secret:{secret_refs[k]}")
    print("\nother plain variables (names only, values withheld):")
    print("  " + ", ".join(sorted(plain_names)) if plain_names else "  (none)")
    sa = service.get("spec", {}).get("template", {}).get("spec", {}).get("serviceAccountName")
    print(f"\nservice account: {sa}")
PY
done

echo
echo "================ cloud run jobs ================"
gcloud run jobs list --project="$PROJECT" --region="$REGION" --format="table(metadata.name,status.latestCreatedExecution.name,status.latestCreatedExecution.completionTimestamp)" 2>&1 | head -20

echo
echo "================ scheduler jobs ================"
gcloud scheduler jobs list --project="$PROJECT" --location="$REGION" --format="table(name.basename(),schedule,state,lastAttemptTime)" 2>&1 | head -20

echo
echo "== done (read-only). Remove tokens/URLs you consider private before pasting this output."
