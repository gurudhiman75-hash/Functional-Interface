# Question Studio: production full-chapter review-batch source release

## Goal
Enable **whole eligible chapters**, all registered canonical CPs in each explicitly approved package, and **bounded batches (1–20)** across quant-v4, reasoning-v1, language-v1 and knowledge-v1. The previous COM-001 one-question canary remains separate. This code does **not** grant permission to start generation, resume production queues or publish questions.

## What this source change implements
- A production admin-only POST `/api/admin/question-studio/runs/async-production-chapter` behind existing `authenticate` and `content.generation.run` RBAC.
- A **separate** `EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED=true` on the admin API and `EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED=true` plus a future 24h maximum expiry on each of admin API, signed receiver and private worker. All are absent/OFF by default.
- Explicit named package approval via JSON such as `[{"engineId":"reasoning-v1","packageId":"OPS-001","reviewOnly":true,"chapterWide":true}]`. No wildcard packages, duplicate approvals, extra keys or unreviewed dynamic CPs.
- `selectedCpIds:[]` means select from the complete **canonical** reviewed package; multiple selected CP IDs target a subset. It does not require one manual env entry for every CP. Selected CPs must be canonical. One package per run. Count 1..20.
- Language and difficulty must match the canonical package. Review-capable registered packages may have either `BANK_ONLY` or `REVIEW_ONLY` source lifecycles and may already be bank-writable/test-eligible. Every *new* chapter-run item is nevertheless saved as unreviewed with `REVIEW_ONLY`, `questionBankWritable:false`, and no student-publication authority. Canonical package admission still requires manual review metadata and no automatic public release.
- Admin route performs permission, idempotency and manifest checks **before** the existing transactional enqueue; no student question bank writes.
- The signed production receiver validates the persisted request **under its Neon row lock before claiming a task**; the private worker independently checks the request using an immutable registry-derived manifest built into its image. A unique DB-enqueue seed `qs-async:<run-UUID>` ties compute to its queued run.
- Old canary and single-CP review modes remain untouched unless the **separate chapter flag** is explicitly enabled.

### All eligible chapters (catalog-wide opt-in)

Instead of maintaining a manual list of four samples or a 100-entry scope array, production can explicitly opt into all eligible packages in the immutable canonical image manifest with:

```json
{"mode":"all-eligible-chapters","reviewOnly":true,"chapterWide":true}
```

The API, receiver, private worker, and dedicated dispatcher each resolve this selector against their own baked immutable manifest. Disabled, noncanonical, unreviewable and automatically publishable packages remain excluded. No dynamic/unreviewed CP IDs are included. Each request still selects one registered chapter/package and remains capped at 1–20 newly generated questions. The source catalog changes only with a separately reviewed and deployed image. Audit per-engine totals against the actual built manifest before activation. This changes no production settings by itself.

## Important deployment boundaries
1. Merge **does not deploy any Cloud Run service or Job**. Previously built images (tag 13f7d586db73) cannot contain these new chapter checks. New receiver and worker images, plus the admin API deployment, will be required after validation.
2. The Question Studio cockpit now includes a **default-OFF** `VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER=true` opt-in for chapter batches. It uses the new API client and existing review progress UI. The frontend switch must remain OFF until the authenticated admin API and private receiver/worker are deployed and separately approved; the normal Generate route is unchanged by default.
3. The existing production Cloud Tasks dispatcher is disabled and normal queue is paused. Do not resume either because this PR merged.
4. The historical COM-001 cleanup Job and minute Scheduler were designed for one pinned run with 15-minute expiry. They are **not** a proven continuous rollback plan for normal multi-run chapter generation. A separately designed normal-operation alerting/rollback and capacity plan is required before activation.
5. Validate the **actual baked canonical manifests**, not only synthetic unit fixtures, before approving chapters. Verify enabled packages, CP IDs, language, difficulty and content-review status. Stop for unsupported chapter selectors.
6. Validate admin RBAC, migrations, queue/outbox, task OIDC, seed consistency, worker token and exact persistence under release-like conditions before approving any production activation. Review-only persistence does not itself authorize approval/publishing.
7. Even after deploying, approval flags remain false and expiries absent. Use controlled, independently approved release windows and explicit production-change authorization.

## Request example (conceptual; disabled until release)
```json
{
  "request":{"engineId":"reasoning-v1","packageId":"OPS-001",
    "language":"en","difficulty":"Mixed","count":10},
  "count":10,"selectedCpIds":[]
}
```
`selectedCpIds:[]` = full registered package CP pool. Add `Idempotency-Key` header with a unique stable value; the server assigns deterministic seed and review-only run.

## Offline CI
`node --test tests/qs-prod-chapter-review-batches.test.mjs`. The relevant GitHub workflow checks syntax and four-engine policy contract. No live Cloud Run, Neon, Cloud Tasks, Scheduler or credentials are used.
