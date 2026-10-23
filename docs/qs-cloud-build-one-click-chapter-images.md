# One-click Cloud Build for Question Studio chapter release

Use the **manual** Cloud Build trigger `examtree-qs-three-image-build` in Google Cloud project `sarbedutech`, region `asia-south1`.

## Configure the trigger once
1. Cloud Build → Triggers → **Create trigger**.
2. Name `examtree-qs-three-image-build`; Region `asia-south1`.
3. Event: **Manual invocation** (not branch push).
4. Repository: the existing connected `gurudhiman75-hash/Functional-Interface`.
5. Build configuration: **Cloud Build configuration file**, path `cloudbuild.examtree-qs-chapter-build-only.yaml`.
6. Branch/reference: `New-main`. Select an existing build service account that can read source, write Cloud Logging, and push to Artifact Registry repository `examtree-workers`; do not grant deployment permissions.
7. Save, choose **Run** exactly once. Keep the source revision that Cloud Build reports; every image is tagged with that checked-out `$COMMIT_SHA`.

This single build validates the new chapter-review tests and builds/pushes three images:
- `examtree-qs-receiver-prod:$COMMIT_SHA`
- `examtree-universal-prod:$COMMIT_SHA`
- `examtree-api:$COMMIT_SHA`

All images go to `asia-south1-docker.pkg.dev/sarbedutech/examtree-workers/`.

### Non-negotiable boundary
**Build only.** Do not deploy these images to Cloud Run or change traffic until the release is separately approved. This build does not touch Cloud Tasks, the production queue, environment approvals, Neon, IAM, or the disabled cleanup Scheduler. The existing single-run cleanup mechanism is NOT a sufficient rollback plan for normal multi-run chapter generation. Record the immutable `@sha256:` digests from Cloud Build output; use digests rather than floating tags for any later controlled deployment.

Cloud Build using a GitHub-triggered source always tags the checked-out commit. Do not run an obsolete trigger tied to a different build config or rely on the earlier pre-build release SHA.
