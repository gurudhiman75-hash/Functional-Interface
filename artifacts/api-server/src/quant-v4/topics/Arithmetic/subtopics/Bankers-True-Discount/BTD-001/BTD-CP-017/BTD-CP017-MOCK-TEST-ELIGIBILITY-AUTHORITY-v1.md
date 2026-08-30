# BTD-001 CP017 Mock-Test Eligibility Authority v1

Status: **MOCK-TEST ELIGIBILITY AUTHORIZED FOR CERTIFIED BTD TEST PROJECTIONS**

CP017 is a guarded metadata/lifecycle transition on an already materialized and CP015 scored-test-eligible BTD projection. It does not mutate learner content and does not open standalone/public delivery.

## Preconditions enforced by the mutation service

The concrete projection is row-locked and must prove all of the following before mock-test eligibility can be enabled:

- package identity is `BTD-001`;
- projection is the canonical English `TEST_PROJECTION` base row;
- projection was materialized under the CP014 authority;
- deterministic `BTD-TEST-BUNDLE-*` provenance is present;
- CP015 scored-test eligibility is already active;
- question status is `published` and approved/published version IDs agree;
- optimistic `lock_version` matches;
- exam version remains active;
- all taxonomy nodes remain active and mapped to that exam;
- English stem/explanation/options remain complete with exactly one correct option;
- exactly one approved, complete Hindi translation exists;
- exactly one approved, complete Punjabi translation exists;
- translated option counts match the English base;
- public and automatic-publication gates are still closed.

The transition changes only mock-test delivery metadata:

- `testEligibility = ELIGIBLE` remains unchanged;
- `testEligible = true` remains unchanged;
- `mockTestEligible = true`;
- `mockTestEligibilityAuthority = BTD-001-CP017-MOCK-TEST-ELIGIBILITY-v1`;
- `publiclyPublishable = false`;
- `automaticStudentPublication = false`.

Audit event: `content.question.btd_mock_test_eligibility_enabled`.

Canonical test-series QA/release requirements remain in force through the CP016 enforcement layer.

## Certification evidence

Initial exact-head certification:

- head: `d29d19613c6a4b47d104b201ef4607c939eece22`
- workflow run: `33314850444`
- job: `99266281574`
- result: **SUCCESS**
- artifact: `9733125027`
- digest: `sha256:9caf18f2670da197ee4d3579ca2407f0985e964374bdf61ae950748c441521d1`

The workflow re-proved CP016 before CP017 and then certified:

- 20 permanent QLs;
- 2 exam scopes;
- 50 seeds per QL per exam;
- 2,000 mock-test eligibility plans;
- 2,000 deterministic replay checks;
- 12,000 placement checks;
- 12,000 source-state checks;
- 12,000 target-state checks;
- 8,000 multilingual source-authority checks;
- 6,000 canonical test-series policy checks;
- 1,988 unique projection bundle keys;
- 12 safe deterministic finite-pool repeats;
- 0 unsafe projection-key collisions;
- minimum QL × exam uniqueness: 48/50;
- guarded mutation/static downstream-lock checks: PASS;
- API build: PASS;
- exact-head assertion: PASS.

## Remaining lifecycle boundary

CP017 does **not** authorize standalone/public release. Public delivery remains a later independent checkpoint.

No production projection was mutated during certification and no PR merge is authorized by this checkpoint.
