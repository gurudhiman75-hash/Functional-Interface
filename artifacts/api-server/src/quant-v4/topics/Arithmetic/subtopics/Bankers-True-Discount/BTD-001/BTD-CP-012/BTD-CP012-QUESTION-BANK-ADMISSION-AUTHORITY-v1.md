# BTD-001 CP012 — Question Bank Admission Authority v1

## Scope

CP012 authorizes **Question Bank admission only after manual Question Studio approval** for the frozen BTD-001 English, Hindi and Punjabi packages.

It does not authorize tests, mock tests, automatic student publication or public publication.

## Upstream authorities

- CP010 multilingual Question Studio frozen learner-content authority.
- CP011 deterministic Question Bank admission-readiness contract.
- 20 permanent BTD QLs across `en`, `hi`, `pa`.

## Admission lifecycle

- `manualApprovalRequired = true`
- generated items begin as `unreviewed`
- required admission status = `approved`
- `questionBankAdmissionApproved = true`
- `questionBankStatus = READY_FOR_STORAGE`
- `questionBankWritable = true`
- `questionBankAcceptanceMode = BANK_ONLY`
- `questionBankAcceptanceAuthority = BTD-001-CP012-BANK-ONLY-AFTER-MANUAL-STUDIO-APPROVAL-v1`
- `testEligibility = INELIGIBLE`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- `contentMutationAuthorized = false`

## Deduplication contract

CP011's frozen-content `admissionKey` becomes the stable provider identity for CP012 bank admission.

The approval path uses `convertApprovedGenerationItemDedupSafe`:

1. read the approved generation item under row lock;
2. require BANK_ONLY admission semantics for keyed dedup;
3. acquire a PostgreSQL transaction advisory lock on the admission key;
4. look for an already-approved Question Bank version with the same stable provider identity and package;
5. if present, link the generation item to that existing question/version instead of inserting a duplicate;
6. otherwise delegate to the established Question Bank converter.

Packages without an explicit admission key retain the established converter behavior.

## Initial exact-head certification

Functional head: `3ce04004ccc767886dc7c5582efd804bffd55f1f`

Workflow run `33297251103`, job `99218940604`: **SUCCESS**.

The workflow re-proved CP011 first and then certified CP012 over 6,000 Question Studio admission candidates:

- learner parity checks: 12,000
- CP011 readiness identity checks: 30,000
- deterministic replay checks: 6,000
- approval-policy checks: 12,000
- converter-eligibility checks: 12,000
- normalized Question Bank payload checks: 60,000
- lifecycle checks: 72,000
- native JSON checks: 12,000
- unique admission keys in the CP012 seed corpus: 5,909
- safe finite-pool repeats: 91
- unsafe admission-key collisions: 0
- minimum QL × language uniqueness: 92/100
- dedup reuse-path SQL proof: PASS
- admission routing/static guards: PASS
- API build: PASS
- exact-head assertion: PASS

Evidence artifact: `9727816273`

Artifact SHA256: `152293c79fe42a0677f73b671da486fff5273e16c43314619b2eada36ac92c35`

## Boundary

CP012 is an admission checkpoint, not a delivery checkpoint. A BTD question accepted into Question Bank remains ineligible for scored tests, mock tests, automatic publication and public publication until a later separately certified lifecycle checkpoint.
