# SAP-CP-006 — Missing Values, Equality, Comparison and Exact Synthesis

**Branch:** `feat/sap-cp006-exact-synthesis-foundation`  
**Base:** SAP-CP-005 inactive English-review candidate  
**Lifecycle:** provisional / inactive / no permanent QL allocation / human semantic review required

## Purpose

CP-006 combines earlier exact-arithmetic authorities without becoming a general algebra checkpoint. The unknown or learner task must cross an earlier checkpoint boundary, or comparison, ordering, synthesis, verification or bounded data sufficiency itself must be the learner objective.

Executable CP-003, CP-004 and CP-005 ordinary authorities are stable enough for provisional CP-006 implementation. CP-006 is **not** permanently allocated, activated or finally source-frozen while the dependent CP-004/CP-005 human semantic gates remain open.

## Current solve identities — 21

### Foundation — SAP-QL-092..SAP-QL-103

1. missing addend in a mixed fraction-percentage equality;
2. missing factor in a mixed exact expression;
3. missing divisor in a mixed exact expression;
4. missing complete bracket value in a composed expression;
5. missing decimal in a mixed fraction/percentage equality;
6. bounded missing exponent inside a factorial-plus-power composition;
7. comparison of two cross-representation exact expressions;
8. ordering four exact values shown in mixed representations;
9. selecting an equivalent exact expression;
10. selecting the correct exact simplification statement;
11. candidate verification by substitution;
12. exact two-statement synthesis.

### Inverse-synthesis wave two — SAP-QL-104..SAP-QL-111

13. missing mixed minuend;
14. missing mixed subtrahend;
15. missing mixed dividend;
16. missing denominator in a cross-family fraction-of expression;
17. composed missing radicand;
18. composed missing factorial input;
19. value making two exact arithmetic sides equal;
20. fixed mixed operand missing inside a bracket/division structure.

### Data-sufficiency wave three — SAP-QL-112

21. four-class exact-arithmetic data sufficiency over bounded integer `x = 1..6`.

QL-112 is intentionally arithmetic-only. Its statements use exact values and numeric bounds (`=`, `>`, `<`, `≥`, `≤`) after reducing a mixed fraction/percentage expression. Divisibility, parity and remainder predicates are excluded so the solve identity does not drift into Number System.

These are **candidate coordinates only**. The permanent registry remains unchanged and Question Studio exposure is disabled.

## Presentation variants without new QLs

`SAP-QL-099` owns ordering as one solve identity and includes both inline and small-table presentations. The table wrapper is presentation diversity only; it is not a separate mathematical QL or a Data Interpretation claim.

## Executable proof status

- foundation authority: **1,200 deterministic cases** across 12 identities;
- wave-two inverse authority: **800 deterministic cases** across 8 identities, with independent option substitution;
- arithmetic-only QL-112 v3 authority: **400 deterministic cases**, exactly 100 per data-sufficiency class and 100 per A/B/C/D answer position;
- dedicated QL-099 / QL-103 decoupling authority: proves mathematical state is not tied to answer position;
- final human-review authority: **300 unique English questions across all 21 identities**, with exactly 75 correct answers in each A/B/C/D position and no three-position answer streak.

The final review selector also enforces bounded-domain diversity instead of accepting mathematically correct but repetitive samples:

- QL-098 contains all three comparison outcomes `<`, `=` and `>`;
- QL-099 exercises multiple orderings drawn from a 24-permutation label space and alternates inline/table presentation;
- QL-103 contains all four statement truth outcomes;
- QL-109 deliberately cycles factorial inputs `3, 4, 5, 6`;
- QL-112 deliberately cycles all four data-sufficiency classes.

## Editorial remediation already applied

The human-review path is not a raw runtime dump. Current review-facing generators:

- use exam-style fraction-of and percentage-of constructions instead of mini algebra equations where possible;
- keep equivalent/simplified fraction answers in lowest terms;
- replace arbitrary nearby-number distractors with error-linked distractors;
- avoid tautological explanation wording;
- independently decouple mathematical state from answer-option placement;
- keep the ordering/table and data-sufficiency wrappers inside exact-arithmetic ownership.

## Boundary guards

This checkpoint does not claim:

- simple missing fraction component ownership (CP-002);
- simple missing decimal/percentage representation ownership (CP-003);
- direct isolated missing exponent/radicand ownership (CP-004);
- missing factor directly visible from a CP-005 cancellation map;
- general linear/quadratic/polynomial equation solving (Algebra);
- coded operators (Reasoning OPS);
- Number-System divisibility/remainder data sufficiency;
- substantive Data Interpretation caselets.

Every inverse task must be provable by direct substitution or bounded independent enumeration. Comparison, ordering, statement and data-sufficiency tasks must be independently evaluated from their visible exact arithmetic.

## Current review gate

CP-006 is now an **inactive human-review candidate**, not a release candidate.

Before permanent allocation or activation:

1. human semantic/exam-readiness approval of the 300-question review set;
2. dependent CP-004 and CP-005 semantic gates must be resolved in order;
3. permanent QL allocation must occur through the registry rather than candidate coordinates;
4. Question Studio, bank, tests and publication surfaces must then be activated explicitly.

Until those gates are satisfied, all candidate packages retain:

- `permanentQlId: null`;
- `contentStatus: "ENGLISH_REVIEW_CANDIDATE"`;
- `active: false`;
- `questionStudioDiscoverable: false`;
- `questionBankWritable: false`;
- `testEligible: false`;
- `publiclyPublishable: false`.
