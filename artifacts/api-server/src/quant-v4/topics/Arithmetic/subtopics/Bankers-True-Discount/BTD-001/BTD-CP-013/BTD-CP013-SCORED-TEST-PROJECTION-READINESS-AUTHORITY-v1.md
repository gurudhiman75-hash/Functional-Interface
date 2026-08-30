# BTD-001 CP013 — Scored-Test Projection Readiness Authority v1

## Decision

BTD-001 is **ready for an explicit future scored-test projection materialization approval**, but this checkpoint does **not** grant that approval and does **not** make BTD questions test eligible.

Current delivery boundary remains:

- `testProjectionMaterializationApproved = false`
- `testEligibilityApprovalGranted = false`
- `testEligibility = INELIGIBLE`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- `contentMutationAuthorized = false`

## Architecture certified

CP012 remains the global, finite-pool Question Bank source authority. CP013 does not mutate that global admission identity to attach one exam.

Instead, a future scored-test delivery object is defined as an **exam-scoped projection** with a deterministic identity over:

1. the certified CP012 Question Bank admission key;
2. a canonical `examVersionId`;
3. a canonical primary taxonomy node.

This allows the same globally deduplicated bank question to support independent exam placements without overwriting or conflating its source identity.

No real exam or taxonomy IDs are assigned by CP013. No database row is materialized by CP013.

## Platform lifecycle separation

The platform previously coupled the internal scored-test gate and standalone/public publication gate even though blueprint assembly consumes `published` Question Bank versions.

CP013 separates those responsibilities:

- generated `testEligible=true, publiclyPublishable=false` content may pass the generation delivery portion of the question publication gate for internal scored-test use;
- generated `testEligible=false, publiclyPublishable=true` content may pass that portion for public-only delivery;
- generated `testEligible=false, publiclyPublishable=false` content remains blocked;
- legacy questions without explicit generation delivery flags retain legacy behavior;
- blueprint assembly independently excludes generated questions explicitly marked `testEligible=false`.

Therefore public-only generated content cannot leak into scored tests, and test-only generated content no longer requires standalone/public release permission.

BTD-001 itself remains `false/false` in CP013, so these platform changes do not activate BTD delivery.

## Exact-head validation authority

Initial certified head before this authority note:

`60723b0d3e2cdcaf8456e91ddac372ffda1c9b89`

Workflow run: `33299288423`
Job: `99224253149`
Result: **SUCCESS**

The cumulative workflow re-proved CP012 and then certified CP013 with:

- 3,000 frozen CP012 source candidates;
- 6,000 exam-scoped scored-test readiness projections;
- 9,000 source-payload parity checks;
- 6,000 deterministic replay checks;
- 9,000 cross-exam scope-isolation checks;
- 30,000 canonical placement checks;
- 48,000 lifecycle-lock checks;
- 24,000 JSON/deep-freeze checks;
- 6,000 unique projection keys;
- 0 safe projection repeats;
- 0 unsafe projection-key collisions;
- minimum QL × language uniqueness: 50/50;
- 6 delivery-policy truth-table cases;
- 4 blueprint-eligibility cases;
- 3 publication-gate decoupling cases;
- delivery-gate static guards: PASS;
- blueprint eligibility static guard: PASS;
- API build: PASS;
- exact-head assertion: PASS.

Initial evidence artifact: `9728415729`
SHA-256: `31d11d7bce9a94f3d1fbd8f63bf598b3ea381a7d63b6749eeb86d39d3488eec5`

A second cumulative run must certify the final head containing this authority note before the stacked PR is opened.

## Next lifecycle checkpoint

The next checkpoint may explicitly authorize and implement **exam-scoped scored-test projection materialization** using real canonical exam/taxonomy bindings. That is a separate lifecycle decision and is intentionally not implied by CP013 readiness.

Mock-test eligibility and standalone/public publication remain separate later gates.
