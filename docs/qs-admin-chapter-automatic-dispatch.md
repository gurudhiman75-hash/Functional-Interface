# Admin chapter review: automatic dispatch using the existing job

This source change is not a production deployment or authorization to generate.
Reuse project `sarbedutech`, region `asia-south1`, the existing
`examtree-qs-chapter-dispatch-prod` job, dedicated `examtree-qs-chapter-prod`
queue, signed receiver, private worker, rollback controller and Pages frontend.
No queue, identity, scheduler, schema, traffic or publication changes are made.

## Request path

1. The opted-in cockpit defaults to chapter review, lists eligible canonical
   packages from all four engines, excludes dynamic CP candidates, and accepts
   integer batches 1–20. BANK_ONLY source chapters remain eligible as review
   inputs. Existing review listings and normal/staging modes are retained.
2. Admin RBAC, exact immutable manifest membership, release scope/expiry and
   idempotency are validated. The existing Neon transaction commits the run,
   idempotency record and distinct chapter outbox event.
3. Only after commit, the API calls Cloud Run v2 `jobs:run` for the fixed existing
   dispatcher. Its execution override contains ONLY the server-assigned run UUID.
   It does not update the job template, override approvals, queue configuration,
   release scope/expiry, credentials, task count, or retry policy.
4. The existing dispatcher validates its identity and independent release gates,
   locks the exact chapter outbox event, validates the seeded persisted snapshot,
   and creates a deterministically named signed Cloud Task. The receiver and
   worker independently revalidate scope and commit candidates to review only.
5. The cockpit polls existing read-only progress and opens the review view.
   A successful Run API response confirms execution acceptance, not generation
   completion or queue readiness.

## Failure recovery

If the Run API times out or denies execution after commit, enqueue still returns
its durable receipt with `dispatchRequested:false`. The cockpit saves the resume
link and explicitly reports unconfirmed dispatch. `Retry saved run dispatch`
starts the same job for that saved run, without creating another batch. A lost
initial HTTP response can also be retried with the same idempotency key.

The retry endpoint requires generation-run permission, both stored owner IDs,
chapter outbox membership and current seeded canonical scope. It only launches
queued runs; running/terminal runs are returned without another execution. Reads
and polling never start jobs. Repeated or ambiguously acknowledged executions
are safe at the outbox/task layer: row locks, deterministic task names, receiver
leases and review-commit idempotency remain the authority. They can still incur
job startup overhead; this is not an exactly-once job execution guarantee.

The durable outbox remains the recovery authority after API interruption.
Recovery is an admin action in the panel; no always-on poller or new scheduler
is introduced. The existing dispatcher retry backoff can require waiting before
retrying. A paused queue stays paused; the panel cannot bypass it.

## One-time deployment review (do not apply automatically)

- Review and deploy compatible API/receiver/worker policy artifacts: the shared
  package-key policy now admits exact canonical lowercase language slugs and
  namespaced reasoning IDs, while CP IDs remain strict. Pin reviewed digests;
  keep the existing rollback controller and baseline pins intact. The dispatcher
  also embeds the shared policy and needs the same policy version for those IDs.
- Verify the existing API runtime service account has `run.jobs.run` and
  `run.jobs.runWithOverrides` on ONLY `examtree-qs-chapter-dispatch-prod`.
  Basic Cloud Run invoker permission alone may not allow execution overrides.
  Do not grant project-wide administration or change IAM as part of this PR.
- On the API, the new
  `EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED=true` gate must be
  separately approved once. Absent it, requests fail before enqueue. Existing
  chapter route/release/queue/outbox gates and bounded release expiry still apply.
- Preserve the job's existing independent gates, one task, maxRetries=0, fixed
  queue/receiver/OIDC identity and immutable manifest. The run UUID is supplied
  per execution automatically; no operator edits to the job template are needed.
- Use the existing catalog-wide scope selector
  `{"mode":"all-eligible-chapters","reviewOnly":true,"chapterWide":true}` only
  within the separately approved release window on all participating components.
  Confirm baked manifests agree. This PR does not broaden live release scope.
- Keep the existing Pages build opt-in
  `VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER=true` only on the approved admin
  frontend. Verify the Pages QS proxy reaches the correct deployed API.
- Independently verify rollback still disables chapter approvals and pauses the
  dedicated queue. The launcher rechecks the existing release approval and expiry;
  it cannot resume queues, change traffic, publish questions or disable rollback.

No production generation was used for validation. Local checks cover mocked
API-to-job HTTP, failure recovery, canonical catalog admission, existing receiver
and worker guards, frontend client behavior, admin tests and build. Actual Neon,
OIDC, Cloud Run permission and review persistence acceptance remain release gates.

## Validation at base `2717d403bebf`

- 59 focused backend/policy/local HTTP checks passed, including disabled receiver
  boot and every eligible chapter in the generated canonical catalog: quant 17,
  reasoning 21, language 14, knowledge 86 (138 total).
- All 232 admin tests and the admin TypeScript/production asset build passed.
- Full API typechecking remains blocked by 23 pre-existing syntax diagnostics
  in four unchanged source/test files (polity CP025, mensuration localization,
  and simplification SAP CP004/CP005). Their bytes match the base commit.
- Self-review covered fixed job identity, UUID-only execution overrides, commit
  ordering, failure receipts, owner/RBAC checks, exact manifest admission and
  unchanged publication/queue/rollback boundaries. Human PR review and live
  release acceptance are still required.
