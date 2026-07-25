# Attempt Administration freeze-readiness audit

Date: 2026-07-25

## Scope

This audit covers the canonical Attempt Administration surfaces under:

- `artifacts/api-server/src/routes/admin-attempts.ts`
- `artifacts/api-server/src/routes/admin-attempt-integrity.ts`
- `artifacts/api-server/src/routes/admin-attempt-investigations.ts`
- `artifacts/api-server/src/routes/admin-attempt-exports.ts`
- `artifacts/admin-app/src/pages/users/AttemptsWorkspacePage.tsx`
- `artifacts/admin-app/src/pages/users/AttemptInvestigationsPage.tsx`
- `artifacts/admin-app/src/pages/users/AttemptExportsPage.tsx`

## Canonical data contract

Attempt Administration reads `learning.attempts` and joins immutable `assessment.test_publications`, `assessment.tests`, and `assessment.test_versions`. Student identity comes from `identity.users` and `identity.student_profiles`. Administrative notes, investigations, abandonment evidence, and export history are stored as immutable `platform.audit_events`.

The module does not provide score correction, response rewriting, result-snapshot replacement, attempt deletion, or test-publication mutation.

## Supported workflows

- Search and inspect canonical attempts.
- Detect stale in-progress sessions using the larger of six hours or twice the published test duration.
- Abandon genuinely stale attempts with row locking, optimistic concurrency, a mandatory reason, and immutable audit evidence.
- Scan recent attempts for lifecycle, score, response-count, snapshot, and timing anomalies.
- Add immutable investigation notes.
- Open, assign, resolve, or reject structured investigation cases.
- Export a privacy-scoped JSON evidence package with an immutable export event.

## Freeze fixes completed

- Specific `/exports`, `/investigations`, and `/integrity` routers are mounted before the generic `/:attemptId` route.
- Investigation summary counts are calculated globally and no longer shrink when queue filters are applied.
- A source-level freeze validator checks route ordering, RBAC, privacy exclusions, audit events, migration idempotency, admin routing, and the absence of score-evidence mutations.
- The abandonment migration detects the actual `learning.attempts.status` type and adds `abandoned` only when it is enum-backed.

## Remaining release blockers

The implementation is freeze-ready at source level, but not production-verified. Release still requires:

1. Apply `docs/database-migrations/2026-07-25-attempt-abandonment-status.sql` to the target database.
2. Verify that the production `learning.attempts.status` column accepts `abandoned`.
3. Run the API build, admin typecheck, admin tests, admin build, and source-level freeze validator.
4. Exercise authenticated read, stale abandonment, investigation lifecycle, review note, and evidence export against a non-production test attempt.
5. Confirm that export responses are not cached by the deployed proxy/CDN.
6. Confirm that no role lacking `users.students.manage` can execute abandonment, notes, investigation mutations, or exports.

## Freeze decision

**Source implementation: freeze-ready.**

**Production release: blocked pending migration, CI, deployment, and authenticated end-to-end verification.**

Until those checks pass, Attempt Administration must not be described as production-verified.
