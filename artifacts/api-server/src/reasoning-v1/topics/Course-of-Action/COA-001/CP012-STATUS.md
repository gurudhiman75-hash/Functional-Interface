# COA-001 / COA-CP-012 — Internal Eligibility Evaluation

Status: **APPROVED / INTERNAL QUESTION BANK + TEST + MOCK ELIGIBILITY ENABLED**

Chapter status: **CLOSED**

## Source authority

CP012 is a lifecycle-only evaluation over the frozen CP011 surface.

Source:
- frozen checkpoint: `COA-CP-011`
- frozen Question Studio authority: `COA_CP011_FINAL_EDITORIAL_DIVERSITY_FREEZE_V1`
- content mutation allowed: **NO**

CP012 does not create, translate, rewrite, rebalance, or reorder learner-facing semantic content.

## Technical evaluation

The candidate is designed to prove that COA can be promoted to internal Question Bank/test/mock eligibility without changing the approved content.

Eligibility recommendation:
- internal Question Bank eligibility: **RECOMMENDED**
- internal test eligibility: **RECOMMENDED**
- internal mock eligibility: **RECOMMENDED**
- public release: **NOT AUTHORIZED**
- student delivery: **NOT AUTHORIZED**
- automatic student publication: **NOT AUTHORIZED**

## Approved internal lifecycle

Product-owner approval was recorded on **2026-09-19**.

Current lifecycle:
- live Question Studio authority: **CP012**
- review-only: **FALSE**
- manual approval required: **FALSE**
- canonical Question Bank persistence: **ENABLED**
- `questionBankWritable = true`
- `testEligible = true`
- `mockTestEligible = true`
- `publiclyPublishable = false`
- `publicReleaseAuthorized = false`
- `studentDeliveryAuthorized = false`
- `automaticStudentPublication = false`
- learner release: **INTERNAL_ELIGIBLE**

This is an internal lifecycle promotion only. It does not authorize public/student delivery.

## Eligibility evidence inherited from CP011

- English taxonomy final-frozen;
- Hindi/Punjabi approved/frozen;
- 118 active ordinary authorities;
- 10 source-backed profile authorities;
- QL answer-class balance;
- at least 10 domains per active QL;
- no exact active statement duplication;
- Question Studio semantic anti-repetition gate;
- QL008 calibrated difficulty integrity;
- deterministic EN/HI/PA generation;
- approved four-way, genuine Either five-code and three-action profiles;
- no Question Bank/test/mock/public gate leakage before CP012.

## CP012 proof

`cp012-internal-eligibility-proof.test.ts` checks:

- candidate content is byte-identical to CP011 for learner-facing fields;
- all lifecycle-only candidate metadata is additive;
- candidate generation is deterministic;
- EN/HI/PA parity survives;
- semantic capacity rules survive;
- candidate recommends internal eligibility but does not activate it;
- live Question Studio registry remains on CP011;
- public/student release remains locked.

## Approval record

Approved by the product owner on **2026-09-19**.

The approved lifecycle sets:
- `reviewOnly = false`
- `manualApprovalRequired = false`
- `persistenceAllowed = true`
- `questionBankStatus = WRITABLE`
- `questionBankWritable = true`
- `testEligibility = ELIGIBLE`
- `testEligible = true`
- `mockTestEligible = true`

and preserves:
- `publiclyPublishable = false`
- `publicReleaseAuthorized = false`
- `studentDeliveryAuthorized = false`
- `automaticStudentPublication = false`

Public/student release remains a separate gate.


## Chapter closure

COA-001 is closed for the current content-engine/internal lifecycle.

Closure basis:
- CP001–CP012 approved/frozen as applicable;
- final English taxonomy frozen;
- Hindi/Punjabi corpus frozen;
- Question Studio integration active;
- final editorial/diversity audit green;
- internal Question Bank/Test/Mock eligibility approved;
- CP010, CP011 and CP012 exact-head proofs green;
- production build, route registry, CI hygiene and branch topology green.

Public/student publication is deliberately outside this closure and remains locked behind a separate release authorization.
