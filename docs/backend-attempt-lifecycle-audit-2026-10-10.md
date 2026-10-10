# Backend attempt lifecycle audit — 10 October 2026

Scope: Examtree canonical Neon staging/test dataset and API. No frontend changes.

## Directly checked

- 23 attempts: 15 `evaluated`, 8 `in_progress`.
- Eight in-progress attempts have no activity in >30 days, and none is marked abandoned.
- Three of those eight stale attempts retain one saved draft answer; do not
  silently discard their snapshots or convert them to scores.
- Before recovery, eight evaluated attempts lacked canonical `learning.attempt_responses` rows.
- Seven historical single-question result snapshots contained exactly one
  `questionReview` with the original selected index; each was matched against
  its published test version, stable question ID, immutable question stem,
  section, complete ordered option list, answer key and raw score.
- The eighth historical evaluated attempt does **not** contain `questionReview`.
  It has only aggregate score/count fields. Individual response reconstruction
  would be speculative and must not be performed.

## Completed data repair

Executed `docs/database-migrations/2026-10-10-legacy-attempt-response-recovery.sql`
against the existing Neon branch. Atomic output:

```
verified_candidates = 7
responses_inserted = 7
audit_events_written = 7
```

Post-transaction verification:

- 15 evaluated attempts, 68 response rows in total.
- 14 evaluated attempts now have individual responses; one 2026-07-18 legacy
  result still has no recoverable question-level evidence.
- Seven recovered rows: 2 correct, 4 incorrect, 1 unanswered.
- All original attempt score fields and result snapshots were preserved.
- Exact per-question answer times are unknown for historical records: saved
  `time_spent_seconds = 0`, `answered_at = NULL`, plus provenance annotation
  `recoverySource = legacy_result_snapshot.questionReview`.
- Seven distinct `platform.audit_events` record this recovery.

## Stale session policy (existing backend)

`artifacts/api-server/src/routes/admin-attempts.ts` **already** supports:

- `GET /api/admin/attempts?status=stale` (permission: `users.students.read`)
- `POST /api/admin/attempts/:attemptId/actions/abandon` with a >=20-character
  reason and optimistic `expectedUpdatedAt` (permission:
  `users.students.manage`)
- `POST /api/admin/attempts/bulk/actions/abandon` with reason and IDs.

Abandonment updates the status and audit trail; does **not** rewrite snapshots
or scores. **No stale attempt was automatically abandoned during this audit.**
A reviewer can inspect the three saved-answer drafts before choosing whether
to abandon them. Re-attempt limits still count historical attempts; confirm
the desired paid-exam policy before modifying that behavior.

## API correctness safeguard

The student `GET` and `PATCH /api/attempt-sessions/:id` routes now
reject a previously abandoned or otherwise inactive session with HTTP 409
`ATTEMPT_SESSION_NOT_ACTIVE`, retaining the existing submitted-result
behavior for `evaluated` / `practice_evaluated`. Previously, GET could
expose an archived draft as though it were resumable. This is unit-tested.

## Next audit scope

- Review outbox dispatch and stale scheduled/background work without enabling
  a second poller on Render and Cloud Run simultaneously.
- Check Cashfree payment-event and refund reconciliation consistency.
- Validate session abandonment via authenticated admin API after deploying this
  code; live UI verification intentionally deferred.
- Do not claim the one evidence-deficient 2026-07-18 question response has
  been recovered, and do not retroactively invent per-question time histories.
