# Algebra P2 Productionization V1

Status: IMPLEMENTED CANDIDATE / CI REQUIRED

## Scope

This checkpoint completes the next lifecycle step for the already-frozen Algebra chapter without changing the approved mathematical or multilingual source authorities.

Source authority now uses:
- 43 permanent QLs (`ALG-QL-001..043`)
- 109 mapped learner variants
- English V4 chapter source: 31 targeted remediations over 78 unchanged V3 variants
- Hindi/Punjabi V3 chapter source: the same 31 mathematical states localized over 78 unchanged V2 variants
- canonical-answer parity locked across English/Hindi/Punjabi
- deterministic solver/source state retained

## Delivery V5

`ALGEBRA-FROZEN-QUESTION-STUDIO-DELIVERY-V5-CENTRAL-OPTION-CONTRACT`

The previous Question Studio delivery exposed four options for every package-level exam profile. That is not valid for the central Quant V4 banking contract.

V5 therefore maps Algebra delivery to the central option-count authority:
- `SSC_CORE` -> `SSC_CGL_CHSL` -> 4 options
- `SSC_ADVANCED` -> `SSC_CGL_JSO` -> 4 options
- `BANKING_PRELIMS` -> `BANKING_PRELIMS` -> 5 options
- `BANKING_MAINS` -> `BANKING_MAINS` -> 5 options
- `PUNJAB_STATE` -> `GENERIC_PRACTICE` option-count contract -> 4 options

The old `BANKING` request alias is accepted by the route and normalized to `BANKING_PRELIMS` for backward compatibility. It is not advertised as a current selectable profile.

V5 reconstructs only the delivery option envelope. The active learner source is now the chapter-level English V4 / multilingual V3 source layer. Permanent QL/prototype identity, canonical-answer parity, source-state seed and lifecycle locks remain preserved.

## BANK_ONLY lifecycle

New Algebra Question Studio runs use the shared:

`QUESTION-STUDIO-STANDARD-BANK-ONLY-V1`

This permits a manually approved generation item to enter canonical Question Bank through the shared approval/converter path.

Enabled:
- Question Studio discovery
- review-run persistence
- manual editorial approval
- shared Question Bank conversion after approval

Still locked:
- scored-test eligibility
- mock-test eligibility
- automatic publication
- public/student publication
- production release authorization

Algebra does not implement a chapter-specific Question Bank route and does not write canonical Question Bank tables directly.

## Legacy persisted review items

Existing Algebra review items created under the old review-only lifecycle remain `NOT_STORED` / non-writable. They are not silently promoted. Only newly generated V5 BANK_ONLY items carry `READY_FOR_STORAGE` and are eligible for shared conversion after manual approval.

## Required proof

Before review-ready status:
1. API build passes.
2. Admin build passes.
3. Frozen V4 source audit stays green.
4. V5 exercises every permanent mapped variant across all supported profiles/languages and conforms to central 4/5-option contracts.
5. BANK_ONLY audit proves all permanent QLs can normalize through the shared converter.
6. Full-release negative control remains blocked by scored/public locks.
7. Route contract proves there is no Algebra-specific Question Bank conversion/persistence path.

## Next gate

After this checkpoint, Algebra may populate Question Bank only by explicit manual approval of V5 BANK_ONLY review items. A later, separate checkpoint is required before any scored-test, mock-test or public release activation.


## Source upgrade checkpoint

Active Question Studio source authority:
- English: `ALG-EN-v4-chapter-review-candidate`
- Hindi/Punjabi: `ALG-ML-v3-chapter-review-candidate`

The source upgrade changes learner content only for the 31 audited remediation variants. The other 78 mapped variants remain byte-for-byte on their prior frozen learner source.

The Question Studio lifecycle remains `BANK_ONLY`:
- manual approval required;
- scored-test eligibility remains disabled;
- mock-test eligibility remains disabled;
- public/student publication remains disabled;
- production release authorization remains disabled.
