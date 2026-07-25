# Question Analytics freeze-readiness

## Decision

Question Analytics is source freeze-ready for its declared canonical scope.

Production release remains unverified until the API and admin application build successfully against the deployed schema and authenticated live queries complete.

## Canonical scope

Question Analytics reads completed `learning.attempts` and immutable publication/question records. It provides:

- exposure, answer, skip, correctness, facility and flag aggregates
- immutable option-selection distributions
- direct question linkage for snapshot contract v2
- collision-safe stable-ID reconstruction for legacy snapshots
- per-question timing only when `timeTakenSeconds` is persisted
- publication and per-question quality diagnostics
- read-only anomaly flags and bounded scan disclosures

Discrimination remains intentionally unavailable. No statistically validated discrimination cohort contract has been implemented.

## Runner snapshot contract v2

New submissions persist:

- `snapshotVersion: 2`
- `linkageContract: direct_question_version_v2`
- `testPublicationId`
- `testVersionId`
- legacy numeric `questionId`
- immutable `questionVersionId`
- immutable `testQuestionId`
- immutable `testSectionId`
- selected option index and option key
- correct option index and option key
- optional `timeTakenSeconds`

The legacy numeric question ID remains only for backward compatibility.

## Linkage precedence

Analytics resolves snapshot items in this order:

1. exact immutable `testQuestionId`
2. immutable `questionVersionId`
3. legacy stable numeric ID when the publication mapping is collision-free
4. exclusion with an explicit unmatched count

Evidence is never assigned to a guessed question.

## Immutable scoring source

Question Analytics calculates correctness against `content.question_options.is_correct` for the immutable question version. Snapshot answer-key fields are treated as evidence to validate, not as the canonical scoring source.

Snapshot answer-key disagreement is surfaced as a quality failure.

## Quality diagnostics

The quality workspace detects:

- missing or malformed `questionReview`
- unmatched snapshot items
- publication questions missing from completed snapshots
- invalid selected option keys or indexes
- snapshot answer-key disagreement
- direct identifier disagreement
- duplicate snapshot items
- stable-ID collisions between distinct question versions
- duplicate question-version placements in one publication
- legacy linkage usage
- limited exposure samples
- attempt-scan and visible-result truncation

Diagnostics never mutate questions, attempts, publications or result snapshots.

## Safety boundaries

- API routes require `users.students.read`.
- Analytics and quality routes are read-only.
- Static `/questions/quality` routing precedes the dynamic question-version route.
- The dynamic detail route precedes the collection route.
- Completed-attempt scans are capped at 10,000 rows and disclose truncation.
- Publication quality tables display at most 250 rows while retaining complete summary totals within the bounded scan.
- Prototype Question Analytics datasets are prohibited by the executable validator.

## Executable validation

Run:

```bash
node .github/scripts/validate-question-analytics.mjs
```

The validator checks:

- runner snapshot v2 fields
- direct-first and collision-safe legacy linkage
- immutable answer-key scoring
- quality diagnostics
- route ordering
- read-only analytics behavior
- admin routes and navigation
- timing and discrimination scope disclosures
- absence of prototype analytics data

## Production release checklist

Before production sign-off:

1. Run the Question Analytics GitHub Actions workflow successfully.
2. Build the API server.
3. Typecheck, test and build the admin application.
4. Submit a new canonical attempt and verify snapshot v2 fields.
5. Verify direct linkage counts increase for the new attempt.
6. Verify a legacy snapshot still resolves through stable-ID reconstruction.
7. Verify malformed, invalid-option and answer-key mismatch fixtures are surfaced but excluded from normal metrics where appropriate.
8. Verify `/api/admin/analytics/questions/quality` cannot be captured by the dynamic UUID route.
9. Verify `users.students.read` enforcement with permitted and denied administrator accounts.
10. Review query latency and memory use with realistic production attempt volume.

## Freeze rule

After production verification, change this module only for:

- confirmed correctness defects
- schema compatibility changes
- performance hardening that preserves metrics
- an explicitly designed and separately validated discrimination contract
