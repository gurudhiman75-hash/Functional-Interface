# COA-001 / COA-CP-010 — Status

Status: **APPROVED / FROZEN**

## Frozen upstream authority

- CP001–CP008 English: **APPROVED / FROZEN**
- English taxonomy: **FINAL-FROZEN**
- CP009 Hindi/Punjabi corpus: **APPROVED / FROZEN**
- frozen semantic authorities: **130**
- localized Hindi/Punjabi learner surfaces: **260**

CP010 does not alter English or localized semantic content.

## Question Studio registration

COA-001 is now registered as a Question Studio package.

Package:
- package ID: `COA-001`
- engine: `reasoning-v1`
- topic: `Reasoning`
- subtopic: `Course of Action`
- languages: `en`, `hi`, `pa`
- difficulties: `Easy`, `Medium`, `Hard`
- runtime: `review-only`

Active semantic QLs exposed to Question Studio:
- COA-QL-001
- COA-QL-002
- COA-QL-003
- COA-QL-004
- COA-QL-005
- COA-QL-006
- COA-QL-008
- COA-QL-009

`COA-QL-007` is explicitly rejected as a semantic selector. Its two legacy calibration states remain in the frozen corpus only for backward compatibility.

## Supported presentation profiles

- `TWO_ACTION_FOUR_WAY`
- `TWO_ACTION_FIVE_CODE`
- `THREE_ACTION_COMBINATION`

Five-code generation can reach the dedicated mutually-exclusive `Either I or II` authorities. It never maps an ordinary independent-verdict authority to `Either`.

Three-action generation preserves the frozen truth mask and only varies the authored option ordering.

`SINGLE_BEST_ACTION` remains outside COA and belongs to the Decision Making / situational-judgment boundary.

## Routing

CP010 is connected to both current Question Studio paths:

1. the generic `reasoning-v1` engine registry;
2. the shared generation facade used by the live admin Question Studio route.

The live admin route recognizes COA requests by package, QL/checkpoint selector, or Course-of-Action subtopic and records review runs under provider model `reasoning-v1-coa-001`.

## Lifecycle

Question Studio review generation is deliberately separated from production eligibility.

Current state:

- Question Studio discoverable: **YES**
- Question Studio generation: **ENABLED**
- review-only: **YES**
- review-run persistence: **ALLOWED**
- canonical question persistence: **CLOSED**
- Question Bank writes: **CLOSED**
- test eligibility: **CLOSED**
- mock-test eligibility: **CLOSED**
- public/student publication: **CLOSED**
- automatic learner publication: **CLOSED**

Review runs may be stored in the existing generation-review tables. This is not Question Bank promotion.

## Proof coverage

`cp010-question-studio-proof.test.ts` verifies:

- all 8 active QLs are selectable;
- retired QL007 is rejected;
- English/Hindi/Punjabi generation;
- Easy/Medium/Hard filtering without relabelling;
- deterministic replay;
- four-way presentation;
- five-code presentation;
- genuine exclusive-Either reachability;
- three-action combination masks and answer indices;
- Question Studio visibility and registration;
- generic `reasoning-v1` adapter routing;
- Question Bank/test/mock/public lifecycle locks.

## Files

- `cp010-question-studio-integration.ts`
- `cp010-question-studio-proof.test.ts`
- `COA-CP-010-QUESTION-STUDIO-REVIEW.md`
- `CP010-STATUS.md`
- `.github/workflows/coa-cp010-question-studio.yml`

Shared runtime files updated:
- `src/question-studio/engines/reasoning-v1-adapter.ts`
- `src/question-studio/shared-generation-engine.ts`
- `src/routes/admin-question-studio-average.ts`

## Approval gate

CP010 is **APPROVED / FROZEN**.

Approved by the product owner on **2026-09-18** after review of package naming/discoverability, QL and profile selection, learner-facing output shape, and the review-only lifecycle boundary.

CP010 approval authorizes moving to **CP011 final editorial/diversity freeze**. It does not open Question Bank, tests/mocks, or public/student delivery.
