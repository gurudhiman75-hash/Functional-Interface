# DI-001 Table Interpretation — Permanent English Controlled Review

`PERMANENT_ENGLISH_CONTROLLED_REVIEW` — the approved V2 table question layer is promoted to permanent Question Studio review authority while all learner-delivery gates remain closed.

## Authority

- Release: `DI-001-PERMANENT-ENGLISH-REVIEW-P1`
- Canonical problem: `DI-CP-001`
- Question Studio runtime: `DI001_PERMANENT_ENGLISH_REVIEW_P1`
- Permanent QLs: `DI-QL-027` through `DI-QL-036`
- Question Studio discovery: enabled in `CONTROLLED_REVIEW`
- English editorial status: `ENGLISH_REVIEW_APPROVED`
- Localization: not started

## Certified V2 task families

Easy: direct selected-candidate reading, total applicants, highest selected count.

Medium: selected-count difference, selection percentage, applicant ratio, average selected candidates.

Hard: overall selection percentage from combined totals, selected-to-not-selected ratio, difference between two independently calculated selection rates.

Each five-question V2 set contains five distinct task families with exactly 1 Easy + 2 Medium + 2 Hard. SSC CGL Tier I uses four options; Banking Prelims uses five.

## Content authority

The approved V2 layer retains the deterministic Phase-0 mathematical table state while replacing the narrow fixed-question surface with broader exam-style task selection, multiple stem surfaces, misconception-owned distractors, simple question-specific explanations and working tables where multi-step reasoning benefits from them.

The dedicated approval proof covered 240 sets / 1,200 questions across SSC CGL Tier I and Banking Prelims with deterministic replay, independent verification, option uniqueness, task/difficulty contracts, stem-surface coverage, mathematical-state diversity and cross-profile semantic parity.

## Lifecycle locks

- `questionStudioDiscoverable: true` in controlled-review mode only
- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`

Promotion to controlled Question Studio review does not authorize Question Bank writes, tests, mocks, public publication or automatic student publication.
