# MIS-001 — Deep Audit Wave 02 — Source Saturation & Ownership

Date: 2026-09-27  
Status: **SOURCE AUDIT COMPLETE / TWO SOURCE-THIN HOLDS / FORMULA-LEVEL MERGE-SPLIT PENDING**

## Decision

The current 83 runtime patterns are **not** equivalent to 83 learner skills and the 70 current semantic-authority IDs are **not** automatically 70 permanent QLs.

Source review confirms that SSC Missing Number questions genuinely use:

- simple sums, differences, products and division;
- three-input and compound arithmetic;
- squares, cubes, roots and mixed powers;
- triangle, circle/sector, box and matrix layouts;
- row/column/diagonal pairings;
- sum/difference of pair-products;
- digit-sum style relationships;
- inverse questions where an input rather than the result is missing;
- multiple completed examples to disambiguate the intended rule.

The chapter therefore has strong breadth, but permanent identity must be based on **learner reasoning topology and answer semantics**, not on each exact formula.

## Direct previous-paper anchors reviewed

The source ledger includes previous-paper examples from SSC CPO, CGL, CHSL, GD and Stenographer exams, including:

- SSC CPO 6 June 2016: sum of paired products in a square;
- SSC CGL 9 August 2017: paired products summed in a figure;
- SSC GD 3 March 2019: difference of paired products followed by a multiplier;
- SSC GD 6 March 2019: product relation across figure sectors;
- SSC GD 11 March 2019: consecutive squares;
- SSC Stenographer 14 September 2017: sum of triangle vertices multiplied by a constant;
- SSC CHSL 1 November 2015: sum of squares;
- SSC CHSL 20 January 2017: inverse recovery inside a sum-of-squares table;
- SSC CHSL 16 October 2020: square of a sum;
- SSC CHSL 11 January 2017: mixed cube-plus-square relation;
- SSC CGL 2010: digit-sum relationship;
- SSC CGL 16 August 2021: ordinary arithmetic combined with a product-of-digits term.

These establish source-backed **families**. They do not prove that every algebraically different formula deserves an independent QL.

## Invalid implementation removed

### MIS-CAND-078 — a×b + |a−b|

The prototype displayed three inputs but its implemented rule ignored the third input. This violates the chapter requirement that every displayed input participate in the reasoning.

Decision: **EXCLUDE FROM RUNTIME**.

The audit does not invent a replacement formula to preserve the candidate count.

## Holds

### MIS-CAND-034 — small factorial

Factorials appear in preparation guidance, but the audit did not recover sufficiently strong direct competitive-exam Missing Number figure evidence for this exact family.

Decision: **SOURCE_THIN_HOLD / NO PERMANENT QL**.

The generator may remain available in review-only discovery, but it cannot contribute to frozen source-backed breadth yet.

### MIS-CAND-072 — number + reversed number

Digit reversal is a known reasoning mechanism, but direct Missing Number authority for the exact `number + reversed number` construction was not established in this pass.

Decision: **SOURCE_THIN_HOLD / NO PERMANENT QL**.

## Reuse-only patterns

The 13 Wave-1 reuse-only patterns remain non-owning. Inverse location, repeated-group disambiguation and alternate box pairing do not create a new skill merely because the learner-visible arrangement changes.

## Ownership boundary

Number-series recurrence questions stay in **Series**, not MIS-001.

The following also do not independently create QLs:

- renderer change;
- triangle vs box when reasoning is identical;
- different numeric values;
- changing which position contains the question mark;
- increasing completed-example count;
- changing one algebraic formula inside the same source-backed reasoning topology.

## Next wave

`FORMULA_TO_LEARNER_SKILL_MERGE_SPLIT`

Wave 03 must compress retained formulas into stable learner-skill contracts while preserving enough parameterization to reproduce real SSC question breadth.

Permanent QL allocation remains blocked until that reconciliation passes.
