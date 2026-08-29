# Algebra Source / PYQ Audit — Wave 3 (ALG-CP-012 through ALG-CP-015)

**Chapter:** Algebra  
**Runtime package:** `ALG-002`  
**Audit wave:** 03  
**Scope:** CP-012 Inequalities / Extrema → CP-015 Mixed Synthesis  
**Status:** SOURCE-AUDIT FIRST PASS / NOT SOURCE-SATURATED  
**Original discovery candidates reviewed:** 33  

---

## 1. Authority and safety

This file reviews the final four executable-discovery checkpoints against retrieved SSC/Banking evidence and the chapter's permanent-contract rules.

It does **not** authorize permanent QL IDs.

Allowed dispositions:

- `KEEP_SOURCE_BACKED`
- `KEEP_PROVISIONAL`
- `MERGE_VARIANT`
- `MOVE`
- `HOLD`
- `DROP`
- `GAP_ADD`

All current candidates remain `UNVERIFIED_DRAFT` with `permanentQlId: null`.

---

## 2. Evidence result by family

### Strong direct evidence found

- SSC CGL previous-paper questions directly test quadratic inequality / range conditions such as a quadratic expression being `< 0` and asking the allowed parameter range.
- SSC CGL previous-paper questions directly test minimum value of quadratic expressions.
- Banking / SBI data-sufficiency questions directly use two numbered statements/equations and the standard sufficiency decision topology.

### Evidence not yet strong enough in this pass

- No comparably strong target-exam PYQ set was found for treating absolute-value equations/inequalities as a standalone permanent Algebra family.
- No direct evidence justifies making the CP-015 mixed-synthesis compositions into independent permanent QLs. They are better treated as controlled composition / presentation over already-owned contracts unless later source saturation proves otherwise.

This asymmetry is intentional: executable completeness is not the same as exam-source authority.

---

## 3. Semantic rules established in Wave 3

### 3.1 Inequality sign / endpoint choice is state, not QL identity

`>`, `≥`, `<`, `≤`, positive/negative coefficient, root inclusion/exclusion and repeated-root behavior are essential generation states, but they do not each create a new permanent QL.

### 3.2 Quadratic extrema share one contract

Minimum versus maximum is determined by the sign of the leading coefficient. The tested reasoning contract is finding the vertex/extremum, not two unrelated QLs.

### 3.3 QC answer relation is an output state

Exact quantity comparison, determinate possibility sets and indeterminate possibility sets all belong to one quantity-comparison evidence contract. The relation returned is answer state.

### 3.4 DS verdict is an output state

Statement I alone, Statement II alone, either alone, both together, and not sufficient are the five output states of one data-sufficiency evidence contract. They must not become five permanent QLs.

### 3.5 Mixed synthesis is composition, not new mathematics

CP-015 deliberately combines at most two already-proven engines. Unless a source shows that a composition has an independent stable exam contract, learner-facing ownership stays with the underlying CPs and CP-015 remains a generation/presentation layer.

---

## 4. Candidate-by-candidate review

## ALG-CP-012 — Inequalities, quadratic sign and extrema

| Candidate | Solve mode | Wave-3 disposition | Reason |
|---|---|---|---|
| CAND-001 | `solveLinearInequality` | `KEEP_PROVISIONAL` (merge anchor) | Core inequality contract; direct SSC coverage should be expanded before freeze. |
| CAND-002 | `solveLinearInequalityWithNegativeCoefficient` | `MERGE_VARIANT → CAND-001` | Sign reversal on division is essential state, not separate QL identity. |
| CAND-003 | `solveCompoundLinearInequality` | `KEEP_PROVISIONAL` | Constraint intersection is materially deeper than one boundary; retain pending broader PYQ saturation. |
| CAND-004 | `solveQuadraticPositiveRegion` | `KEEP_SOURCE_BACKED` (quadratic-inequality anchor) | SSC range/inequality PYQs directly support sign-region reasoning. |
| CAND-005 | `solveQuadraticNonPositiveRegion` | `MERGE_VARIANT → CAND-004` | Inequality direction and endpoint inclusion are state. |
| CAND-006 | `solveRepeatedRootQuadraticInequality` | `MERGE_VARIANT → CAND-004` | Repeated root is discriminant/root-topology state inside the same quadratic inequality contract. |
| CAND-007 | `findQuadraticMinimum` | `KEEP_SOURCE_BACKED` (extremum anchor) | Direct SSC minimum-value PYQ support. |
| CAND-008 | `findQuadraticMaximum` | `MERGE_VARIANT → CAND-007` | Minimum/maximum is controlled by leading-coefficient sign. |
| CAND-009 | `findParameterRangeForGlobalQuadraticSign` | `KEEP_SOURCE_BACKED` | Direct discriminant/sign parameter direction is a distinct target from solving an x-interval. |
| CAND-010 | `countIntegerSolutionsInQuadraticInterval` | `MERGE_VARIANT → CAND-004` | Integer count is target/presentation over the solved exact interval; retain as generation target, not a new QL by default. |

### Provisional post-merge CP-012 shape

- solve linear inequality,
- solve compound linear inequality,
- solve quadratic inequality / sign region,
- find quadratic extremum,
- find parameter range for a quadratic to keep a specified global sign.

No new source-backed engine gap was found in this first pass.

---

## ALG-CP-013 — Absolute value

| Candidate | Solve mode | Wave-3 disposition | Reason |
|---|---|---|---|
| CAND-001 | `solveSimpleAbsoluteEquation` | `HOLD` (equation anchor) | Mathematically valid, but direct SSC/Banking PYQ evidence is not strong enough in this audit pass. |
| CAND-002 | `solveAffineAbsoluteEquation` | `MERGE_VARIANT → CAND-001` | Same two-branch absolute-equation contract; affine coefficients are topology. |
| CAND-003 | `solveZeroRhsAbsoluteEquation` | `MERGE_VARIANT → CAND-001` | RHS zero is edge state. |
| CAND-004 | `rejectNegativeRhsAbsoluteEquation` | `MERGE_VARIANT → CAND-001` | Negative RHS is impossibility edge state. |
| CAND-005 | `solveBoundedAbsoluteInequality` | `HOLD` (inequality anchor) | Exact interval engine is sound, but permanent exam ownership remains under-evidenced. |
| CAND-006 | `solveExteriorAbsoluteInequality` | `MERGE_VARIANT → CAND-005` | Inside/outside interval is operator state. |
| CAND-007 | `solveZeroBoundaryAbsoluteInequality` | `MERGE_VARIANT → CAND-005` | Zero threshold is edge state. |
| CAND-008 | `solveEqualAbsoluteDistances` | `HOLD` | Distinct geometric-distance interpretation, but direct target-exam evidence is not yet sufficient. |
| CAND-009 | `countIntegerSolutionsToAbsoluteInequality` | `MERGE_VARIANT → CAND-005` | Integer count is target over the same solved interval. |

### CP-013 decision

The absolute-value engine stays in the chapter foundation because it is correct, reusable and needed by synthesis. However, **engine presence does not imply permanent QLs**. CP-013 remains a source-evidence HOLD until stronger target-exam PYQs are mapped.

---

## ALG-CP-014 — Quantity comparison and data sufficiency

| Candidate | Solve mode | Wave-3 disposition | Reason |
|---|---|---|---|
| CAND-001 | `compareExactQuantities` | `KEEP_PROVISIONAL` (QC anchor) | Quantity-comparison evidence contract; broader target-exam source mapping still desirable. |
| CAND-002 | `compareDeterminatePossibilitySets` | `MERGE_VARIANT → CAND-001` | Multiple admissible states still resolve to one stable relation. |
| CAND-003 | `compareIndeterminatePossibilitySets` | `MERGE_VARIANT → CAND-001` | Indeterminate is an output/evidence state, not separate QL identity. |
| CAND-004 | `dataSufficiencyStatementIAlone` | `KEEP_SOURCE_BACKED` (single DS anchor) | Banking/SBI DS questions directly support statement sufficiency as an exam contract. |
| CAND-005 | `dataSufficiencyStatementIIAlone` | `MERGE_VARIANT → CAND-004` | Verdict state. |
| CAND-006 | `dataSufficiencyEitherAlone` | `MERGE_VARIANT → CAND-004` | Verdict state. |
| CAND-007 | `dataSufficiencyBothTogether` | `MERGE_VARIANT → CAND-004` | Verdict state. |
| CAND-008 | `dataSufficiencyNotSufficient` | `MERGE_VARIANT → CAND-004` | Verdict state. |

### CP-014 permanent-contract direction

At most two broad contracts are currently justified:

1. quantity comparison across all admissible states,
2. data sufficiency with the five standard verdict states.

Do not allocate one QL per verdict.

---

## ALG-CP-015 — Mixed synthesis and bounded caselets

| Candidate | Solve mode | Wave-3 disposition | Ownership |
|---|---|---|---|
| CAND-001 | `linearThenReciprocalTarget` | `MOVE / COMPOSITION` | CP-006 solve + CP-002 reciprocal target. |
| CAND-002 | `systemThenQuantityComparison` | `MOVE / COMPOSITION` | CP-007 system + CP-014 QC. |
| CAND-003 | `quadraticThenAbsoluteRootGap` | `MOVE / COMPOSITION` | CP-009 roots + CP-013 absolute target. |
| CAND-004 | `rationalEquationThenAbsoluteTarget` | `MOVE / COMPOSITION` | CP-008 rational solve + CP-013 absolute target. |
| CAND-005 | `factorDivisionThenEvaluateQuotient` | `MOVE / COMPOSITION` | CP-005 factor/division + CP-001 evaluation. |
| CAND-006 | `sharedSystemDerivedCaselet` | `MOVE / PRESENTATION` | CP-007 solved state reused for multiple targets; caselet packaging belongs to presentation/generation. |

### CP-015 decision

**No permanent CP-015 QLs are justified in Wave 3.**

Keep the generators as controlled synthesis/caselet infrastructure. Permanent ownership remains with the constituent mathematical contracts. If future PYQs reveal a repeated composition whose evidence cannot be represented by the owner contracts, it can be reconsidered as a source-backed gap.

---

## 5. Wave-3 consolidation summary

### Strong merges / moves

1. CP-012 positive/negative linear coefficient forms → one linear inequality contract.
2. CP-012 positive/non-positive/repeated-root quadratic inequalities → one quadratic inequality contract with sign/root/endpoint states.
3. CP-012 minimum/maximum → one extremum contract.
4. CP-012 integer count → target variant of solved interval.
5. CP-013 simple/affine/zero/negative-RHS equations → one absolute-equation contract if source evidence later clears HOLD.
6. CP-013 bounded/exterior/zero-threshold/count → one absolute-inequality contract if source evidence later clears HOLD.
7. CP-014 three QC candidates → one QC evidence contract.
8. CP-014 five DS candidates → one DS evidence contract.
9. CP-015 all six candidates → composition/presentation ownership; no permanent CP-015 QLs in the current audit model.

### Source-backed status

- CP-012 quadratic inequality / extrema / global-sign parameter direction: **source-backed**.
- CP-014 data sufficiency: **source-backed for Banking**.
- CP-013 absolute value: **HOLD pending stronger direct target-exam PYQ evidence**.
- CP-015 mixed synthesis: **no standalone permanent ownership justified**.

### Source-backed missing families

No strong missing CP-012–015 mathematical contract was identified in this first pass. Therefore Wave 3 does not add another provisional candidate at this stage.

---

## 6. Cross-wave implications

The source audit has now reviewed all 15 checkpoints at least once. Several implemented candidates are intentionally expected to merge or move before permanent allocation.

The current provisional executable count therefore must **not** be used as the future permanent QL count.

Before freeze, the project still needs:

1. Wave 1B: stronger evidence on held ALG-001 candidates / cyclic reciprocal ownership,
2. Wave 2B: stronger CP-006–008 source evidence and resolution of surd-coefficient Banking input,
3. Wave 3B: stronger absolute-value evidence or an explicit decision to keep CP-013 engine-only,
4. final cross-wave merge/split/move/drop matrix,
5. source fixture ledger with exam/date/shift provenance where available.

---

## 7. Current decision

**CP-012–015 executable discovery:** COMPLETE.  
**Wave-3 source audit:** FIRST PASS COMPLETE / NOT SATURATED.  
**New Wave-3 provisional gaps:** 0.  
**CP-015 permanent QLs currently justified:** 0.  
**Permanent Algebra QLs overall:** 0.  
**Question Studio / Question Bank / public release:** LOCKED.
