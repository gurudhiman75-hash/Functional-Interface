# Algebra Executable Discovery Completion Authority

**Chapter:** Algebra  
**Design:** Revision 2 (`ALG-END-TO-END-DESIGN.md`)  
**Learner-facing chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Authority status:** EXECUTABLE-DISCOVERY COMPLETE / SOURCE AUDIT IN PROGRESS  

## 1. What this document authorizes

This document records completion of executable discovery for ALG-CP-001 through ALG-CP-015 and tracks source-audit gap prototypes added afterward.

It does **not** authorize permanent Algebra QL allocation, a frozen QL count, source/PYQ saturation, Question Studio promotion, Question Bank/test eligibility, or public release.

Every current candidate remains `UNVERIFIED_DRAFT` with `permanentQlId: null`.

## 2. Current provisional inventory

The original design-led executable discovery completed with **106 candidates**. Source/PYQ Audit Wave 1 then exposed three source-backed missing contracts that were prototyped and independently tested:

- CP-001 `expandAndSimplifyExpression`,
- CP-002 `findScaledReciprocalSquare`,
- CP-005 `findParameterAndCommonRemainderAcrossPolynomials`.

Current checkpoint counts are therefore:

| Checkpoint | Runtime scope | Provisional families |
|---|---|---:|
| ALG-CP-001 | Expressions and substitution | 7 |
| ALG-CP-002 | Identities and transformed values | 9 |
| ALG-CP-003 | Three-variable symmetric identities | 5 |
| ALG-CP-004 | Polynomial operations and factorisation | 5 |
| ALG-CP-005 | Remainder and Factor Theorem | 8 |
| ALG-CP-006 | One-variable linear equations | 7 |
| ALG-CP-007 | Simultaneous linear equations | 7 |
| ALG-CP-008 | Algebraic fractions and rational equations | 7 |
| ALG-CP-009 | Quadratic equations | 6 |
| ALG-CP-010 | Vieta, root relationships and transformations | 9 |
| ALG-CP-011 | Banking quadratic comparison | 6 |
| ALG-CP-012 | Inequalities, quadratic sign and extrema | 10 |
| ALG-CP-013 | Absolute-value equations and inequalities | 9 |
| ALG-CP-014 | Quantity comparison and data sufficiency | 8 |
| ALG-CP-015 | Mixed synthesis and bounded caselets | 6 |
| **Current provisional total** |  | **109** |

At 50 deterministic seeds per current candidate, the checkpoint guards cover **5,450 generated states**.

**109 is not a permanent QL target.** Wave 1 has already identified semantic merges and an ownership move, so the eventual audited permanent contract count is expected to differ.

## 3. Correctness architecture reached

The chapter has reusable exact primitives for bigint rational arithmetic; expression evaluation; polynomial arithmetic/factorisation/division; linear equations and 2×2 systems; exact quadratic roots including quadratic surds; Newton/power-sum recurrence; Vieta/root transformations; original-domain rational equations; exhaustive Banking root-set comparison; exact intervals/inequalities/extrema; absolute value; and QC/DS evidence classification.

Source-remediation candidates are tested through the same deterministic and independent-verification checkpoints as design-led candidates.

## 4. Source-audit status

`ALG-SOURCE-PYQ-AUDIT-WAVE01-CP001-CP005.md` is the first formal source/PYQ review. It established evidence-backed KEEP/MERGE/MOVE/HOLD decisions for all 31 original CP-001…005 candidates and exposed source gaps.

Three gaps have now been remediated as provisional executable candidates. The cyclic reciprocal relation remains on ownership hold pending comparison across CP-002, CP-003 and CP-015.

Wave 1 is **not yet source-saturated**. Permanent IDs remain blocked.

## 5. Mandatory source/PYQ phase

For each candidate, the audit must establish one of:

1. **KEEP** — source-supported distinct mathematical task contract,
2. **MERGE** — same reasoning contract; difference belongs in generation state/variant,
3. **SPLIT** — source evidence contains materially different contracts hidden inside one candidate,
4. **MOVE** — learner-facing ownership belongs elsewhere,
5. **DROP** — unsupported, out-of-scope, or unnecessary.

The audit must also search for missing source-supported contracts, not merely validate the current inventory.

## 6. Required audit dimensions

Every checkpoint must be checked across target direction, structural topology, constraint topology, edge state, representation/presentation mode, SSC vs Banking relevance, chapter ownership, and answer/evidence topology.

A presentation-only change must not create a permanent QL unless it changes the independently tested reasoning/evidence contract.

## 7. Freeze gate

Permanent QL allocation remains blocked until the source corpus is recorded, candidate-to-source evidence exists, merge/split/move/drop review is complete, missing-family search is complete, cross-chapter ownership is resolved, and the final discovery matrix has no unexplained gaps.

Only after that gate should Algebra proceed to permanent QL IDs, production generators, multilingual packages, Question Studio integration and release gates.

## 8. Current decision

**Design-led executable discovery:** COMPLETE (106 candidates).  
**Source-discovered executable remediation:** 3 additional candidates; green.  
**Current provisional candidate pool:** 109.  
**Source/PYQ saturation:** IN PROGRESS / NOT COMPLETE.  
**Permanent Algebra QLs:** 0.  
**Question Studio / Question Bank / public release:** LOCKED.
