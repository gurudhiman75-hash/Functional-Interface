# Algebra HOLD Resolution — Saturation Pass 02

**Chapter:** Algebra  
**Date:** 18 August 2026  
**Status:** SOURCE-SATURATION PASS / NOT A PERMANENT QL FREEZE

## 1. Purpose

Pass 02 strengthens the remaining Banking evidence surface and separates source-backed exam contracts from correctness-only engine states.

## 2. New evidence ledger

| ID | Provenance | Evidence |
|---|---|---|
| `ALG-HR2-S01` | Testbook Banking/Insurance Quant practice taxonomy | Banking/Insurance explicitly exposes Quadratic Equations, Data Sufficiency and Comparison of Quantities as separate Quant practice families |
| `ALG-HR2-S02` | Banking/Insurance Quadratic Equations practice | dedicated Bank PO/Clerk quadratic-equation practice surface across multiple levels |
| `ALG-HR2-S03` | Comparison of Quantity competitive-exam guide | explicitly includes quadratic-equation-based quantity comparison as a recurring comparison topology |
| `ALG-HR2-S04` | IBPS PO Quant question collection | direct Banking data-sufficiency questions with multi-statement sufficiency verdicts |
| `ALG-HR2-S05` | RPF SI Data Sufficiency question collection | direct DS task using algebraic identities (`p+q`, `pq`, target `p²-q²`) |
| `ALG-HR2-S06` | Banking quantitative-aptitude preparation taxonomy | lists Data Sufficiency and Quadratic Equation / Comparison of Quantities among major Banking Quant topics |

Source URLs:

- S01: https://testbook.com/bank-insurance-exams-questions
- S02: https://testbook.com/bank-insurance-exams-quadratic-equations-questions--cq
- S03: https://testbook.com/maths/comparision-of-quantity
- S04: https://testbook.com/questions/ibps-po-quant-questions--649c35494183bab5c2854b95
- S05: https://testbook.com/questions/rpf-si-data-sufficiency-questions--65fc378c560c427649866fda
- S06: https://testbook.com/blog/how-to-prepare-quantitative-aptitude-for-banking-exams/

## 3. CP-014 resolution

### Algebra Quantity Comparison

**Resolution:** `KEEP_SOURCE_BACKED CONTRACT`

Reason: comparison of quantities is a Banking quant family in its own right, and quadratic-equation comparison is explicitly a recognized comparison topology. Algebra QC should therefore remain a permanent-contract candidate, with relation outcomes (`>`, `<`, `=`, `≥`, `≤`, indeterminate) as answer states rather than separate QLs.

### Algebra Data Sufficiency

**Resolution:** `KEEP_SOURCE_BACKED CONTRACT`

Reason: Banking/IBPS directly uses multi-statement data sufficiency, and comparable recruitment-exam DS evidence shows algebraic identities used as the mathematical engine. Keep the five DS verdicts as answer states of one DS contract; do not allocate one QL per verdict.

## 4. CP-006 / CP-008 resolution after saturation attempt

### CP-006 ordinary one-variable linear equation

**Resolution:** `KEEP_PROVISIONAL CONTRACT`

The mathematical family is unquestionably in the target syllabus and the engine is complete, but this pass did not produce a sufficiently clean shift-tagged fixture ledger for each representation form. Surface forms remain variants of one contract; no additional standalone contracts are justified.

### CP-008 rational equations / domain filtering

**Resolution:** `KEEP_PROVISIONAL CONTRACT + DOMAIN ENGINE MANDATORY`

The original-domain model remains non-negotiable correctness infrastructure. Fraction count, cancellation, excluded roots, no-valid-root and identity-on-domain are representation/outcome states, not separate permanent QLs. Direct SSC/Banking source saturation for rational-equation-specific topology should continue before final freeze.

## 5. Banking surd-input boundary

No new source in Pass 02 justifies expanding Banking quadratic comparison to equations whose *coefficients* contain unlike surds. Keep current exact rational-coefficient equations with rational or exact conjugate-surd roots. Unsupported unlike-radicand comparison remains outside freeze scope.

## 6. Result of Pass 02

Resolved/strengthened:

- CP-014 Quantity Comparison → source-backed contract;
- CP-014 Data Sufficiency → source-backed contract;
- CP-006 representation splits → confirmed as variants of one provisional contract;
- CP-008 domain/excluded-root forms → confirmed as states of one provisional contract;
- Banking surd-input expansion → no evidence-based need; retain boundary.

Remaining pre-freeze work:

1. normalize the full source fixture ledger by retained semantic contract;
2. derive one final cross-CP KEEP/MERGE/MOVE/DROP matrix;
3. count retained permanent-contract candidates after merges;
4. run a final source-gap audit against that smaller contract list;
5. only then allocate permanent QL IDs.

Permanent QLs remain `0`; Question Studio and release surfaces remain locked.
