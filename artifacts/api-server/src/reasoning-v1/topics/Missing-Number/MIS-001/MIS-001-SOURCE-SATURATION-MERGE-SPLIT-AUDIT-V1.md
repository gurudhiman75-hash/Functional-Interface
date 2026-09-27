# MIS-001 Source-Saturation / Merge-Split Audit V1

Status: **PRACTICAL SOURCE SATURATION COMPLETE; FINAL MERGE-SPLIT RECHECK PASSED**

## 1. Governance basis

The MIS-001 blueprint requires permanent QLs to represent semantic exam patterns rather than constants, number tuples, renderer shapes, blank positions or difficulty labels. It also requires source saturation across SSC, Banking and Punjab-state material before permanent QL allocation.

The repository contains the full blueprint-derived runtime plus source-discovered extensions through CP028. Source crosswalk waves V1–V13 now provide growing SSC, RRB and Punjab-state evidence, but practical target-exam saturation has not yet been reached.

Therefore:

- chapter-wide semantic merge/split can be completed against the implemented blueprint;
- practical SSC/Banking/Punjab source saturation is complete through V15;
- permanent QL allocation remains blocked until English editorial freeze; source-thin MIS-CAND-034 and MIS-CAND-095 remain promotion-ineligible.

## 2. Runtime inventory

Current runtime review patterns:

- CP001: 8
- CP002: 7
- CP003: 10
- CP004: 9
- CP005: 8
- CP006: 7
- CP007: 7
- CP008: 6
- CP009: 6
- CP010: 6
- CP011: 4
- CP012: 5
- CP013: 2 source-discovered authorities
- CP014: 1 source-backed missing-corner runtime variant
- CP015: 3 SSC CHSL source-discovered authorities
- CP016: 1 SSC GD source-discovered authority
- CP017: 1 SSC CGL mixed whole-number/digit source-discovered authority
- CP018: 4 SSC CHSL source-discovered whole-number authorities
- CP019: 5 SSC CGL source-discovered runtime patterns (4 new authorities + 1 alias)
- CP020: 3 SSC root-extraction authorities
- CP021: 2 SSC source-discovered authorities
- CP022: 1 SSC arithmetic-mean authority
- CP023: 1 PSPCL mixed-root authority
- CP024: 1 SSC CGL second-input affine semantic authority
- CP025: 1 RRB linked-product renderer/role alias of PRODUCT
- CP026: 1 RRB opposite-square renderer/role alias of SQUARE_INPUT
- CP027: 1 SSC Stenographer sum-of-cubes semantic authority
- CP028: 1 SSC CGL signed square-root-combination semantic authority

**Total runtime patterns: 112**

## 3. Chapter-wide consolidation result

After normalization by semantic rule rather than checkpoint/renderer/query direction:

- runtime patterns: **112**
- canonical semantic authorities: **75**
- reuse / alias patterns: **37**
- permanent QLs allocated: **0**

The authoritative mapping lives in `semantic-authority-registry.ts`.

## 4. Major merge decisions

### CP004 → CP003 algebraic duplicates

- MIS-CAND-028 `a(a+b)` → MIS-CAND-021 `a²+ab`
- MIS-CAND-029 `b(a+b)` → MIS-CAND-022 `ab+b²`

These use the same visible inputs and the same underlying relation.

### CP005 triangle renderer consolidation

All eight CP005 candidates are renderer/role-map variants of existing arithmetic authorities:

- 035/036/037/038 → MIS-CAND-011 pair-product-adjust-third
- 039 → MIS-CAND-009 three-input sum
- 040/041 → MIS-CAND-012 pair-sum-times-third
- 042 → MIS-CAND-019 sum of squares

Triangle geometry remains a renderer and positional-role dimension, not a permanent semantic identity.

### CP006 circle/wheel consolidation

The following wheel patterns reuse earlier authorities:

- 043 → MIS-CAND-009 three-input sum
- 044 → MIS-CAND-050 four-input sum
- 045 → MIS-CAND-011 pair-product-adjust-third
- 047 → MIS-CAND-053 pair-product difference
- 048 → MIS-CAND-051 pair-product sum
- 049 → MIS-CAND-067 product of two pair sums

MIS-CAND-046 (difference of opposite-pair sums) remains distinct.

### CP007 pairing-map consolidation

Pair orientation is a role-map parameter:

- MIS-CAND-052 column product sum → MIS-CAND-051 pair-product sum
- MIS-CAND-055 diagonal product sum → MIS-CAND-051 pair-product sum
- MIS-CAND-056 diagonal product difference → MIS-CAND-053 pair-product difference

### CP008 inverse-query consolidation

Blank position and inverse direction do not create new semantic authorities:

- 057 → 001
- 058 → 003
- 060 → 017
- 061 → 012
- 062 → 011 after transitive triangle normalization

MIS-CAND-059 remains distinct because `a×b−b` was not already owned by an earlier canonical authority.

### CP009 pair/cross consolidation

- 063 → 051
- 065 → 051
- 066 → 051
- 068 → 054 because one pair is summed, the other differenced, then the two grouped values are multiplied; which pair gets +/− is a role-map parameter.

MIS-CAND-064 and MIS-CAND-067 remain distinct.

### CP012 advanced competition

All CP012 patterns are presentation/inference variants. They add evidence density and rule competition but no new arithmetic semantics:

- 079 → 001
- 080 → 017
- 081 → 051
- 082 → 075
- 083 → 051

### Source-discovered authorities after the blueprint merge/split pass

Target-exam discovery added semantic relations that were not present in the original blueprint-derived canonical inventory:

- MIS-CAND-084: pair product divided by an evidenced constant (currently source-backed at k=2);
- MIS-CAND-085: pair sum minus twice the absolute difference;
- MIS-CAND-087: pair product plus the first input;
- MIS-CAND-088: three-input product plus 1;
- MIS-CAND-089: three-input product minus 1;
- MIS-CAND-090: pair-product difference followed by an evidenced multiplier (currently k=2).

- MIS-CAND-091: mixed whole-number/digit rule `b − (a÷2) + digitProduct(a)`;
- MIS-CAND-092: `(a−1)(b−1)`;
- MIS-CAND-093: `a÷2 + b` with the divisor fixed to the evidenced context;
- MIS-CAND-094: equal-difference row continuation `2b−a`;
- MIS-CAND-095: `a+4b+1`, currently source-thin.

MIS-CAND-086 is not a new authority; the PSPCL missing-corner form reuses MIS-CAND-050.

- MIS-CAND-096: `((a+1)(b+1))/2`;
- MIS-CAND-098: `a³−b²`;
- MIS-CAND-099: `(a+b)×5+b`;
- MIS-CAND-100: `(a+b+c+d)×2`;
- MIS-CAND-101: `√(a×b)`;
- MIS-CAND-102: `√a−√b`;
- MIS-CAND-103: `∛a+∛b`;
- MIS-CAND-104: `∛|a−b|`;
- MIS-CAND-105: `(ab+1)c`;
- MIS-CAND-106: arithmetic mean `(a+b)/2`;
- MIS-CAND-107: PSPCL mixed-root `(√a+√b)c+2`;
- MIS-CAND-108: second-input affine transform `x→3x+1` applied twice across each row;
- MIS-CAND-111: sum of individual cubes `a³+b³`;
- MIS-CAND-112: signed exact-root combination `√a−√b+√c`.

Source-form additions that do **not** create semantic authorities:
- MIS-CAND-109 → MIS-CAND-003 PRODUCT: RRB linked shared-factor dual-product figure;
- MIS-CAND-110 → MIS-CAND-016 SQUARE_INPUT: RRB opposite-end square wheel.

MIS-CAND-097 remains an alias of MIS-CAND-059 because the stable subtraction constant is rule context, not a separate semantic identity.


## 5. Families deliberately not merged

The audit does **not** merge rules merely because algebraic identities can rewrite them when the visible structure materially changes the inference pattern.

Examples retained separately include:

- `n(n+1)` / `n(n−1)` structured-number relations;
- consecutive products/sums;
- triangular-number and factorial-derived structures;
- digit-property operations;
- four-input pair-sum difference;
- compound two-stage relations where multiple visible roles matter.

### CP017 source discovery

SSC CGL 2020 Tier-I, held 16 Aug 2021 Shift 1, exposes a mixed whole-number / digit-property rule:

- MIS-CAND-091: `b − (a÷2) + digitProduct(a)`

This is not covered by the existing CP010 digit-property authorities because the whole-number division step and digit-product step are both solve-relevant. It remains a distinct source-backed semantic authority.

The SSC CHSL two-stage affine-row source (`x×4+3`, then `y×3+6`) remains on HOLD because the first stage is not required to compute the currently missing third value. It is source evidence, but not yet a justified permanent solve identity.

## 6. Source-thin / hold items

MIS-CAND-034 `SMALL_FACTORIAL` remains explicitly `sourceThin: true`.

No permanent QL should be allocated to a source-thin authority until target-exam evidence supports it.

MIS-CAND-095 is also explicitly source-thin pending recurrence beyond its current SSC CHSL source.

CP020 adds exact root-extraction authorities for √(ab), √a−√b and ∛a+∛b; these remain provisional until broader source saturation.

## 7. Boundary audit

Ownership remains:

- missing term in a sequence → Series
- `A:B::C:?` → Number Analogy
- repeated arithmetic groups/figures → Missing Number
- genuine row/column grid consistency → Number Matrix
- operator replacement → Mathematical Operations
- ordinary algebraic equation solving → Quant

Renderer alone does not determine ownership.

## 8. Coverage against blueprint

Executable coverage exists for:

- simple two-input arithmetic
- constants
- three-input relations
- squares/cubes/powers
- structured/consecutive numbers
- triangle, circle and box renderers
- missing-input/inverse queries
- pair/cross relations
- digit-property rules
- mixed two-stage relations
- advanced competing-rule questions
- Easy / Medium / Hard
- text and SVG renderers

Still pending before closure:

- additional SSC source waves until no meaningful new authority appears;
- additional Punjab-state repeated-group/figure source evidence;
- Banking repeated-group evidence if it exists (current previous-paper evidence mainly routes missing-number series to Quant);
- English editorial freeze after source reconciliation
- permanent QL allocation
- Hindi localization
- Punjabi localization
- three-language parity
- final difficulty audit after QL freeze
- large-corpus production eligibility audit

## 9. Allocation gate

**Permanent QL allocation remains BLOCKED.**

Source discovery has progressed through `MIS-001-SOURCE-CROSSWALK-V15`.

Recent saturation waves:
- V10 added arithmetic mean and PSPCL mixed-root semantic authorities;
- V11 added the second-input affine semantic authority plus two RRB source-form aliases;
- V12 added the sum-of-individual-cubes semantic authority;
- V13 added the signed exact-square-root combination `√a−√b+√c`.

Because successive deep waves are still exposing meaningful semantic gaps, practical source saturation is not yet proven.

V14 and V15 were consecutive zero-new target-exam waves after the V13/CP028 addition. The final merge/split recheck found no further merge/split action. Practical source saturation is complete.

Required next checkpoint:

`MIS-001-ENGLISH-EDITORIAL-FREEZE-V1`

For each observed target-exam source family record:

- source/exam
- year/shift when known
- rendered form
- normalized semantic rule
- canonical candidate authority
- duplicate / new / boundary-routed status
- frequency confidence
- source-thin flag

The final merge/split recheck retains 75 canonical authorities. Of these, 73 are promotion-ready and 2 remain source-thin holds. Permanent QL allocation waits for English editorial freeze.
