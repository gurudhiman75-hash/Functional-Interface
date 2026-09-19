# COA-001 / COA-CP-012 — Internal Eligibility Evaluation

Status: **TECHNICALLY QUALIFIED CANDIDATE / PRODUCT-OWNER APPROVAL PENDING**

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

## Non-activating candidate state

Until explicit CP012 product-owner approval:

- live Question Studio authority remains **CP011**
- review-only remains **TRUE**
- manual approval remains **REQUIRED**
- canonical Question Bank persistence remains **CLOSED**
- `questionBankWritable = false`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `publicReleaseAuthorized = false`
- `studentDeliveryAuthorized = false`
- learner release remains **LOCKED**

The CP012 candidate can be generated explicitly for proof/review through `cpId = COA-CP-012`, but it is not the implicit live runtime authority.

## Eligibility evidence inherited from CP011

- English taxonomy final-frozen;
- Hindi/Punjabi approved/frozen;
- 118 active ordinary authorities;
- 10 source-backed profile authorities;
- QL answer-class balance;
- at least 10 domains per active QL;
- no exact active statement duplication;
- Question Studio semantic anti-repetition gate;
- QL008 Medium/Hard-only integrity;
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

## Approval decision

If CP012 is approved, the next lifecycle overlay may set:

- `reviewOnly = false`
- `manualApprovalRequired = false`
- `persistenceAllowed = true`
- `questionBankStatus = WRITABLE`
- `questionBankWritable = true`
- `testEligibility = ELIGIBLE`
- `testEligible = true`
- `mockTestEligible = true`

while preserving:

- `publiclyPublishable = false`
- `publicReleaseAuthorized = false`
- `studentDeliveryAuthorized = false`
- `automaticStudentPublication = false`

Approval must be explicit. Green CI alone does not activate internal eligibility.
