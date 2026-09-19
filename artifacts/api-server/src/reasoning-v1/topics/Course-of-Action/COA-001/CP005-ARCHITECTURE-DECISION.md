# COA-001 / CP005 — Paired-course architecture decision

Status: **IMPLEMENTED / HUMAN REVIEW REQUIRED**

## Decision

The paired-course form (`Only I / Only II / Both / Neither`) is a **presentation dimension**, not a separate learner operation.

The same pair renderer is already required for the semantic operations implemented in:

- COA-QL-001 direct remedial action;
- COA-QL-002 preventive / risk-reduction action;
- COA-QL-003 verification before irreversible action;
- COA-QL-004 administrative / institutional response;
- COA-QL-005 constraint-aware action;
- COA-QL-006 proportionality and overreaction.

Creating another large semantic authority pool under COA-QL-007 would duplicate those operations and make the chapter harder to audit. CP005 therefore does **not** add new QL007 semantic scenarios.

The approved CP001 calibration examples that were provisionally labelled COA-QL-007 are preserved byte-for-byte as legacy calibration authority. They are not expanded or silently relabelled while CP001 remains an approved baseline.

## Implemented presentation layer

`cp005-paired-presentation.ts` renders the existing semantic authority while preserving:

- semantic QL identity;
- semantic authority id;
- independent verdict of Course I and Course II;
- answer class;
- explanation authority;
- action order semantics.

The renderer can vary Course I / Course II order and option ordering without changing the semantic fingerprint.

### Four-way profiles

1. `TWO_ACTION_FOUR_WAY_STANDARD`
   - Only I
   - Only II
   - Both
   - Neither
   - status: provisional, not source-certified.

2. `TWO_ACTION_FOUR_WAY_NEITHER_BEFORE_BOTH`
   - internal anti-position-gaming variation only.

3. `TWO_ACTION_FOUR_WAY_BOTH_FIRST`
   - internal anti-position-gaming variation only.

The two internal permutations are QA/rendering capabilities. They must not be promoted as exam-backed formats until source review supports them.

## Five-way profile safety decision

`TWO_ACTION_FIVE_CODE` is declared but **blocked pending source audit**.

CP005 does not manufacture an `Either I or II follows` answer from ordinary four-way authorities. Such an answer requires a different semantic relationship: the two courses must form a genuine exclusive-alternative pair rather than two independently judged actions.

A dedicated source audit must first establish that this presentation is materially present in target Course-of-Action questions. If it is present, a separate exclusive-alternative authority type and proof will be required before the profile can generate learner-facing questions.

## QL allocation consequence

COA-QL-007 remains a **provisional legacy identifier**, not a frozen permanent semantic QL.

The permanent QL allocation is still unfrozen and CP008 source saturation may:

- retire QL007 as a semantic QL and keep paired-course handling entirely in presentation metadata; or
- redefine it only if real-paper evidence proves a distinct learner operation that is not already represented by QL001–QL006/QL008–QL009.

This correction prevents cosmetic QL fragmentation and keeps semantic diversity separate from answer-code diversity.

## Lifecycle

- CP001 English: APPROVED
- CP002 English: APPROVED
- CP003 English: HUMAN REVIEW PENDING
- CP004 English: HUMAN REVIEW PENDING
- CP005 paired presentation: HUMAN REVIEW PENDING
- five-way Course-of-Action profile: BLOCKED_PENDING_SOURCE_AUDIT
- Question Studio: CLOSED
- Question Bank writes: CLOSED
- test/mock eligibility: CLOSED
- public/student delivery: CLOSED
