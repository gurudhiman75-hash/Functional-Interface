# Question Studio — production Cloud Tasks infrastructure preparation (NOT activated)

Project: sarbedutech | region: asia-south1 | GitHub: New-main | 2026-10-15

## Database: READ-ONLY verification completed via Neon connector
ExamTree Neon project: `empty-sunset-07552954`.

| Branch | ID | generation_runs | task_leases | enqueue_idempotency | outbox |
| --- | --- | --- | --- | --- | --- |
| main (default) | br-morning-bar-atttdxj4 | present | **ABSENT** | **ABSENT** | present |
| isolated QS validation | br-flat-credit-atqi4rqe | present | present | present | present |

Both checks inspected `neondb` with SELECT/to_regclass, **no migrations or mutations**. Thus **main is NOT ready to receive async queue tasks**, despite successful staging validation.

Neon `main` currently reports `protected=false`. Before any production migrations, review Neon branch protection and make a fresh restorable backup; obtain explicit database-change approval. No production Neon SQL writes are authorized by infrastructure preparation.

## Read-only by default Cloud Tasks / IAM preparation
`scripts/bootstrap-qs-cloud-tasks-production.sh` defaults to `MODE=check`, validates Google project selection and enabled Cloud Tasks API, then reads existence/state of:
- production queue `examtree-qs-prod` in `asia-south1`;
- dispatcher identity `examtree-qs-dispatch-prod@sarbedutech.iam.gserviceaccount.com`;
- task OIDC identity `examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com`.

No Google Cloud administration connection is available in this chat; the CLI preflight is **not** evidence those resources exist.

Only when explicitly approved in the correct project, setting all three of `MODE=provision`, `EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED=yes`, and `EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED=yes` provisions the two dedicated identities and a **new PAUSED queue**, bounded at 1 dispatch/s, concurrency 1, max attempts 3. It refuses to modify an existing queue. **No IAM grants are applied** (even prod SA roles), so the queue has no approved producer or consumer at this stage. The script prints and checks that the queue is PAUSED; if not, it fails.

Do NOT run provision before reviewing the script and intentionally approving creation. This creates cloud resources that may incur future costs even while paused.

## Remaining release gates (not covered here)
1. Validate dedicated production Artifact Registry repositories, Cloud Run service/job identities and Secret Manager bindings **without exposing connection strings**. Staging identities and URLs are forbidden.
2. Separate Cloud Run receiver: `examtree-qs-receiver-prod` private invocation with `roles/run.invoker` for only the task OIDC identity, live audience verification. Production worker with isolated credentials and route.
3. Scoped queue `roles/cloudtasks.enqueuer` to the dispatcher identity only, and narrowly scoped `roles/iam.serviceAccountUser` only if the Cloud Tasks API actually requires it.
4. Verify both additive migrations on a newly created temporary Neon branch, backups, and production schema-change approval **before** applying to main. Never point staging workers at main.
5. Production monitoring, immutable image SHA/deploy evidence, one disposable production canary to Review only, review/polling UI readiness, load/soak, budgets, explicit traffic approval.

NEVER create or activate a Scheduler in this phase. Existing synchronous Generate remains the default, no student publication, no production Cloud Run execution, no Cashfree or migration impact.
