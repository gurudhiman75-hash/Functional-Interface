# QS persistent review-only production admission (source-only)

This implementation replaces repeat release-window refreshes with a **separately opted-in persistent review-only mode**. It does not itself approve any generation or change any deployed Cloud Run service.

## Admission policy

- The shared `productionChapterReleaseActive` policy accepts the persistent path only with `EXAMTREE_API_RUNTIME=cloud-run`, `EXAMTREE_API_STAGING=false`, `EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED=true`, `EXAMTREE_QS_PRODUCTION_PERSISTENT_REVIEW_ENABLED=true`, and `EXAMTREE_QS_PRODUCTION_CANARY_ONLY` not equal to `true`.
- The **legacy** chapter release remains time-limited to 24 hours when the persistent flag is absent/false; the old single-run canary remains separate.
- The new persistent flag has no default grant. All existing API route, async queue, outbox, dispatcher Job, receiver, worker, Cloud Tasks OIDC, canonical manifest/scope, CP eligibility, admin RBAC and manual-review gates still apply independently.
- A new parent may request up to 250 questions, but each isolated child is still limited to 20 and requires an explicit admin launch. Student publication remains forbidden in this pathway.
- To stop generation: **pause both production queues, disable both dispatchers**, then turn all service approvals and `EXAMTREE_QS_PRODUCTION_PERSISTENT_REVIEW_ENABLED` back to `false`. Pause prevents new deliveries but does not cancel in-flight requests.
- The release-pinned rollback controller now recognizes this persistent mode and explicitly turns the new flag off on recovery. Its historical `--apply` job is still controlled by an independent expiry/approval window; no timer is armed by this code change. Preserve known-good revisions and maintain a reviewed manual recovery procedure.

## Before actual activation

1. Merge only after Node + Python rollback tests and production safety review pass.
2. Rebuild/redeploy **API, receiver, worker, chapter dispatcher and rollback controller** from the exact approved commit as appropriate. Production services do not take source changes automatically. A code-only PR or flag update cannot enable the new mode on the previously deployed images.
3. Verify each service runtime identity, secret bindings, queue retry/idempotency contracts, installed dispatcher Job image, release pins and the absence of unintended tagged candidate exposure.
4. Confirm matching canonical manifest and review-only scope across components. Review frontend feature flags and admin UI RBAC.
5. Do one deliberately scoped admin-run operation and inspect its durable run/review records before raising volume. Never automatically publish generated questions.
6. Keep a tested, executable manual restoration path for the known-good service revisions. The existing timed rollback proof covered disabled-state recovery, **not** arbitrary active bulk-generation failure.

This source-only change intentionally **does not** resume queues, enable approvals, execute dispatchers, create tasks or switch Cloud Run traffic.
