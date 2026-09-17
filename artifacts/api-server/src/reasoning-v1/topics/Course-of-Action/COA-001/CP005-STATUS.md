# COA-001 / COA-CP-005 — Status

Status: **APPROVED / FROZEN**

Approved by product owner on 2026-09-17.

## Scope completed

CP005 implements the paired-course presentation layer without creating a duplicate semantic QL pool.

- paired rendering over COA-QL-001..006;
- independent Course I / Course II verdict preservation;
- action-order swapping with answer-class correction;
- three four-way option-order profiles for review/anti-position-gaming;
- four instruction surfaces;
- semantic fingerprint kept separate from presentation fingerprint;
- explicit fail-closed block on unsupported five-way `Either I or II` generation;
- executable proof for semantic invariance, reachability, profile mapping and QL007 non-expansion;
- review pack: `COA-CP-005-ENGLISH-REVIEW.md`.

## Approved architecture correction

The original roadmap treated COA-QL-007 (paired courses) as a potential semantic QL. CP005 established that the paired I/II structure is already a presentation used across QL001–QL006, not a new learner operation.

Therefore the approved state is:

- no new CP005 semantic authorities are added under QL007;
- approved CP001 legacy QL007 calibration examples remain unchanged;
- QL007 is not frozen as a permanent semantic QL;
- CP008 source audit will decide whether QL007 is retired, redefined from evidence, or retained only as a legacy calibration identifier;
- `TWO_ACTION_FIVE_CODE` remains blocked until source evidence establishes a genuine Course-of-Action `Either I or II` semantic class.

See `CP005-ARCHITECTURE-DECISION.md`.

## Lifecycle

- CP001 English: APPROVED
- CP002 English: APPROVED
- CP003 English: HUMAN REVIEW PENDING
- CP004 English: HUMAN REVIEW PENDING
- CP005 paired presentation: APPROVED / FROZEN
- QL allocation: NOT FROZEN
- five-way COA profile: BLOCKED_PENDING_SOURCE_AUDIT
- Question Studio: CLOSED
- Question Bank writes: CLOSED
- test/mock eligibility: CLOSED
- Hindi/Punjabi: NOT STARTED
- public/student delivery: CLOSED

Approval of CP005 does not imply approval of CP003 or CP004 and does not promote any lifecycle gate.