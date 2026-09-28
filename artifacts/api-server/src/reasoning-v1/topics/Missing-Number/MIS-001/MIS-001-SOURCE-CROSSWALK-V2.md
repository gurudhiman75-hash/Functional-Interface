# MIS-001 Target-Exam Source Crosswalk V2

Status: **DISCOVERY WAVE 2 — TWO SOURCE-BACKED GAPS IMPLEMENTED; NOT SATURATED**

## 1. New SSC CGL evidence

### A. Product of pair divided by 2

Source evidence:
- SSC CGL 2016 Tier 1, September 2016 previous paper.
- Question form: `15 (105) 14, 13 (?) 12`.
- Verified solution: `(15×14)÷2 = 105`; `(13×12)÷2 = 78`.
- Independently mirrored by Prepp, Careers360 and Cracku.

Normalized semantic rule:

`result = (a×b) ÷ k`

Current evidenced context: `k = 2`.

Decision:
- existing MIS inventory had exact division `a÷b` and three-input `ab÷c`, but not a stable hidden/evidenced divisor over a two-input repeated group;
- add **MIS-CAND-084 / PAIR_PRODUCT_DIVIDE_CONSTANT**;
- execute only `k=2` until additional target-exam sources support a broader divisor pool;
- constant value remains rule context, not a separate future QL.

### B. Pair sum minus twice the absolute difference

Source:
- SSC CGL 2016 Tier 1, 29 Aug Evening Shift.
- Repeated-row examples:
  - `24 + 20 − 2(24−20) = 36`
  - `15 + 11 − 2(15−11) = 18`
  - `55 + 40 − 2(55−40) = 65`

Normalized semantic rule:

`result = a + b − 2|a−b|`

Decision:
- no existing authority expresses this coordinated sum/difference structure;
- add **MIS-CAND-085 / PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE**;
- keep it distinct from ordinary difference-plus-constant and from product-plus-difference.

## 2. Existing SSC authorities reconfirmed

Additional previous-paper sources continue to support existing authorities:

- SSC CGL 2016: repeated-column `(a×b)+c` → existing pair-product-adjust-third authority.
- SSC CGL 2016: perfect cube missing figure → existing cube authority.
- SSC CGL 2016: triangle/figure addition relationships → existing addition / role-map authorities.
- SSC CGL 2017: product relationships in grid form → boundary reviewed as Number Matrix when the question is fundamentally row/column grid consistency.

No extra renderer-specific QLs are created.

## 3. Boundary evidence remains important

Searches for "missing number" continue to return three materially different topics:

1. sequential missing term → Series;
2. genuine row/column grid consistency → Number Matrix;
3. repeated independent arithmetic groups / figures → MIS-001.

Examples from PSSSB/Punjab Police and Banking search results remain heavily dominated by Number Series. These are recorded as boundary evidence and must not be imported into MIS-001 merely because the phrase "missing number" appears.

## 4. Inventory after Wave 2

- runtime patterns: **85**
- canonical semantic authorities: **52**
- aliases / reuse variants: **33**
- source-discovered new authorities in this wave: **2**
- permanent QLs: **0**

## 5. Saturation status

### SSC
Status: **material coverage improving, not saturated**

SSC sources now support a wider subset of the implemented grammar and have exposed two genuine gaps that were implemented.

### Punjab state
Status: **boundary evidence strong; positive repeated-group/figure source evidence still insufficient**

### Banking
Status: **not saturated**

Banking public sources are still dominated by numerical series under the phrase "missing number". Practice-puzzle material exists, but identifiable previous-paper repeated-group evidence is still too thin for a saturation claim.

## 6. Next wave

Source Crosswalk V3 should:

- sample more SSC shifts to see whether any further semantic gaps emerge;
- find Punjab-state repeated-group/figure questions with identifiable paper provenance;
- find Banking repeated-group/figure questions with identifiable paper provenance;
- test source frequency of SMALL_FACTORIAL before promotion/rejection;
- look specifically for digit-property and inverse-input forms in target exams;
- stop only after additional source waves cease exposing meaningful new authorities or ownership corrections.

Permanent QL allocation remains blocked.
