# BTD-001 CP016 Mock-Test Eligibility Readiness Authority v1

Status: **READY FOR EXPLICIT MOCK-TEST ELIGIBILITY APPROVAL — NOT YET MOCK ELIGIBLE**

## Scope

CP016 proves that the CP015 scored-test eligible BTD projections can be safely promoted to mock-test eligibility in a later checkpoint without changing frozen learner content or opening public delivery.

It also closes a platform enforcement gap in the canonical test-series path: generated questions explicitly carrying `mockTestEligible=false` now block test-series membership/readiness. Legacy questions with no generation mock flag remain compatible with the historical pipeline.

## Upstream authority

- CP015 scored-test authority: `BTD-001-CP015-SCORED-TEST-ELIGIBILITY-v1`
- CP015 exact head: `3b9e2c6282ee7f3ee09e163a4862381807802779`
- CP015 is scored-test eligible and internally published while remaining mock-ineligible and non-public.

## Certified readiness corpus

Exact executable head before this authority note: `f8f710492831f785e1bbc403361727bdb650c62b`

Workflow run: `33308802299`
Job: `99249992349`
Result: **SUCCESS**

Audit results:
- 20 permanent QLs
- 2 independent exam scopes
- 50 seeds per QL per exam
- 2,000 mock-readiness plans
- 2,000 deterministic replay checks
- 10,000 placement checks
- 12,000 CP015 scored-source checks
- 8,000 multilingual source-authority checks
- 16,000 mock-boundary checks
- 8 canonical test-series policy cases
- 1,990 unique projection bundle keys
- 10 safe finite-pool repeats
- 0 unsafe projection collisions
- minimum QL × exam uniqueness: 48/50
- API build: PASS
- exact-head assertion: PASS

Evidence artifact: `9731340998`
Digest: `sha256:4658ab845b3d34b5d0e09d1157bc2d4c9c540718da0789c591e083ca395423fc`

## Canonical test-series enforcement

`admin-test-series.ts` now treats generated mock eligibility as an explicit release gate:

- `mockTestEligible=false` on any generated question in a member test blocks test-series create/update;
- series detail/list readiness reports the count of explicitly mock-ineligible generated questions;
- `mockTestEligible=true` may proceed to the existing test-series QA/release pipeline;
- missing generation mock flag is treated as legacy content and remains governed by legacy rules;
- existing test lifecycle requirements (`qa_approved`, `scheduled`, `live`, `completed`) remain unchanged.

This means a later BTD mock grant is enforceable rather than merely descriptive metadata.

## Approval boundary

CP016 itself does **not** grant mock-test eligibility:

- `mockTestEligibilityApprovalGranted = false`
- `mockTestEligible = false`
- `projectionMockEligibilityMutationAuthorized = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- frozen Question Bank learner content remains immutable

A later CP017 may change only the eligible projection's mock-release metadata after explicit approval, while preserving scored-test eligibility and all public-delivery locks.
