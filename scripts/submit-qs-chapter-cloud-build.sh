#!/usr/bin/env bash
set -euo pipefail
# One operator-executed, artifact-build-only command.
# NEVER deploys Cloud Run, changes traffic, resumes queue or enables generation.
PROJECT=sarbedutech
REGION=asia-south1
REPO=examtree-workers
BASE=0c27641be97cdbfc310bde31ee760314ea888fcc
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(git branch --show-current)" != "New-main" ]]; then
  echo "STOP: check out the New-main release branch first." >&2; exit 2
fi
if ! git merge-base --is-ancestor "$BASE" HEAD; then
  echo "STOP: release manifest fix is not in this checkout. Pull New-main first." >&2; exit 2
fi
if [[ -n "$(git status --porcelain --untracked-files=normal)" ]]; then
  echo "STOP: checkout has local/untracked changes. Do not upload an unverified build context." >&2; exit 2
fi
if ! git rev-parse --verify origin/New-main >/dev/null 2>&1 ||
   [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/New-main)" ]]; then
  echo "STOP: local New-main differs from the fetched origin; pull --ff-only first." >&2; exit 2
fi
if ! command -v gcloud >/dev/null 2>&1; then
  echo "STOP: gcloud CLI is required; run this in Google Cloud Shell." >&2; exit 2
fi
if ! gcloud artifacts repositories describe "$REPO" --location "$REGION" \
  --project "$PROJECT" --format='value(name)' >/dev/null; then
  echo "STOP: existing Artifact Registry repository unavailable. No resources created." >&2; exit 2
fi
SHA="$(git rev-parse HEAD)"
echo "Building exactly three review-only candidate images at commit $SHA"
echo "Build only: no changes to Cloud Run, Neon, Cloud Tasks, Scheduler or live traffic."
gcloud builds submit . \
  --project "$PROJECT" --region "$REGION" \
  --config cloudbuild.examtree-qs-chapter-images.yaml \
  --ignore-file Dockerfile.question-studio-worker.dockerignore \
  --substitutions "_RELEASE_SHA=$SHA"
echo "IMAGE BUILD SUBMISSION COMPLETE for $SHA; production generation remains OFF."
