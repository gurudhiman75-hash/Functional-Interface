# MIS-001 Source-Saturation / Merge-Split Audit V1

Status: **MERGE-SPLIT COMPLETE AGAINST THE IMPLEMENTED BLUEPRINT; EXTERNAL SOURCE SATURATION PENDING**

## 1. Governance basis

The MIS-001 blueprint requires permanent QLs to represent semantic exam patterns rather than constants, number tuples, renderer shapes, blank positions or difficulty labels. It also requires source saturation across SSC, Banking and Punjab-state material before permanent QL allocation.

The repository currently contains the full MIS-001 executable blueprint implementation through CP012, but no MIS-001-specific SSC/Banking/Punjab source pack or source-family crosswalk was found on `New-main`.

Therefore:

- chapter-wide semantic merge/split can be completed against the implemented blueprint;
- external source saturation cannot yet be claimed;
- permanent QL allocation remains blocked.

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

**Total runtime patterns: 85**

## 3. Chapter-wide consolidation result

After normalization by semantic rule rather than checkpoint/renderer/query direction:

- runtime patterns: **85**
- canonical semantic authorities: **52**
- reuse / alias patterns: **33**
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

## 5. Families deliberately not merged

The audit does **not** merge rules merely because algebraic identities can rewrite them when the visible structure materially changes the inference pattern.

Examples retained separately include:

- `n(n+1)` / `n(n−1)` structured-number relations;
- consecutive products/sums;
- triangular-number and factorial-derived structures;
- digit-property operations;
- four-input pair-sum difference;
- compound two-stage relations where multiple visible roles matter.

## 6. Source-thin / hold items

MIS-CAND-034 `SMALL_FACTORIAL` remains explicitly `sourceThin: true`.

No permanent QL should be allocated to a source-thin authority until target-exam evidence supports it.

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

- MIS-001-specific SSC source crosswalk
- MIS-001-specific Banking source crosswalk where applicable
- MIS-001-specific Punjab-state source crosswalk
- English editorial freeze after source reconciliation
- permanent QL allocation
- Hindi localization
- Punjabi localization
- three-language parity
- final difficulty audit after QL freeze
- large-corpus production eligibility audit

## 9. Allocation gate

**Permanent QL allocation remains BLOCKED.**

Source discovery has now started in `MIS-001-SOURCE-CROSSWALK-V1`.

Wave 1 confirms SSC repeated-figure evidence for pair-product sum and sum-of-squares, while also documenting Punjab/Banking search results that correctly route to Series or Number Matrix rather than MIS-001.

Required next checkpoint:

`MIS-001-SOURCE-CROSSWALK-V3`

For each observed target-exam source family record:

- source/exam
- year/shift when known
- rendered form
- normalized semantic rule
- canonical candidate authority
- duplicate / new / boundary-routed status
- frequency confidence
- source-thin flag

Only after that crosswalk reaches practical saturation should the 50 current canonical authorities be retained, merged further, split, rejected or promoted into permanent QLs.
