#!/usr/bin/env bash
# One-time, interactive ONLY. Copies an existing authorized OpenAI API key
# into the production Google Secret Manager secret without displaying it.
# It does not alter Render, Cloud Run, worker, payment or frontend settings.
set -euo pipefail
set +x
PROJECT=sarbedutech
NAME=examtree-openai-api-key
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: select Google Cloud project sarbedutech" >&2; exit 2;
}
if gcloud secrets describe "$NAME" --project="$PROJECT" >/dev/null 2>&1; then
  if [[ -n "$(gcloud secrets versions list "$NAME" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]]; then
    echo "PASS: production provider secret already has an enabled version. No change."
    exit 0
  fi
  MODE=add
else
  MODE=create
fi
[[ -t 0 ]] || {
  echo "REFUSED: interactive Cloud Shell terminal required; do not pipe the key or pass it as an argument." >&2
  exit 2
}
echo "Use your existing authorized OpenAI API key, which may already be configured on Render."
echo "Key entry is hidden and is never written to GitHub or console output."
IFS= read -r -s -p "Paste existing OPENAI_API_KEY (hidden): " KEY
printf '\n'
trap 'unset KEY' EXIT
[[ ${#KEY} -ge 20 && "$KEY" != *[[:space:]]* ]] || {
  echo "REFUSED: empty, too short or whitespace-containing API key." >&2; exit 2;
}
if [[ "$MODE" == "create" ]]; then
  printf '%s' "$KEY" | gcloud secrets create "$NAME" \
    --project="$PROJECT" --replication-policy=automatic --data-file=- >/dev/null
else
  printf '%s' "$KEY" | gcloud secrets versions add "$NAME" \
    --project="$PROJECT" --data-file=- >/dev/null
fi
unset KEY
[[ -n "$(gcloud secrets versions list "$NAME" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]] || {
  echo "FAIL: secret version not enabled" >&2; exit 1;
}
echo "PASS: production OpenAI provider key stored in Secret Manager (value never shown)."
echo "No Cloud Run or Cloudflare changes were made."
