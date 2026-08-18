# Algebra Executable Discovery Completion Authority

**Chapter:** Algebra  
**Design:** Revision 2 (`ALG-END-TO-END-DESIGN.md`)  
**Learner-facing chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Authority status:** EXECUTABLE-DISCOVERY COMPLETE / SOURCE AUDIT REQUIRED  

## 1. What this document authorizes

This document records completion of the **executable discovery implementation** for ALG-CP-001 through ALG-CP-015.

It does **not** authorize:

- permanent Algebra QL allocation,
- a frozen Algebra QL count,
- claims of PYQ/source saturation,
- Question Studio promotion,
- Question Bank/test eligibility,
- public release.

Every current Algebra candidate remains `UNVERIFIED_DRAFT` with `permanentQlId: null`.

## 2. Discovery inventory

| Checkpoint | Runtime scope | Provisional families |
|---|---|---:|
| ALG-CP-001 | Expressions and substitution | 6 |
| ALG-CP-002 | Identities and transformed values | 8 |
| ALG-CP-003 | Three-variable symmetric identities | 5 |
| ALG-CP-004 | Polynomial operations and factorisation | 5 |
| ALG-CP-005 | Remainder and Factor Theorem | 7 |
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
| **Total** |  | **106** |

The number **106 is a discovery-candidate count, not a permanent QL target**.

At 50 deterministic seeds per candidate, the checkpoint discovery guards cover **5,300 generated states**.

## 3. Correctness architecture reached

The chapter now has exact reusable primitives for:

- bigint rational arithmetic,
- expression evaluation,
- polynomial arithmetic, factorisation and exact linear division,
- exact linear equations and 2×2 systems,
- exact quadratic roots including quadratic surds,
- shared Newton/power-sum recurrence,
- Vieta and root transformations,
- original-domain rational-equation solving,
- exhaustive Banking root-set comparison,
- exact interval/inequality solving and extrema,
- absolute-value equations and interval unions,
- quantity-comparison and data-sufficiency evidence classification.

Checkpoint tests deliberately use alternate verification paths where practical rather than merely calling the production helper twice.

## 4. Discovery verification record

Dedicated executable guards have recorded green runs for the implemented checkpoint families, including:

- deterministic replay,
- source-maturity guards (`UNVERIFIED_DRAFT`),
- exact answer verification,
- edge-state checks,
- independent substitution/re-expansion/sign/domain/evidence checks appropriate to each checkpoint.

The repository-wide CI suite can re-run whenever shared Algebra files change; an in-progress rerun must never be represented as a new source-saturation or production-readiness claim.

## 5. Mandatory next phase: source/PYQ saturation

No candidate may receive a permanent QL ID until the source/PYQ phase completes.

For each candidate, the audit must establish one of:

1. **KEEP** — source-supported distinct mathematical task contract,
2. **MERGE** — same reasoning contract as another candidate; difference belongs in generation state/variant,
3. **SPLIT** — source evidence contains materially different reasoning contracts currently hidden inside one candidate,
4. **MOVE** — learner-facing ownership belongs to another ExamTree chapter,
5. **DROP** — unsupported, out-of-scope, or unnecessary candidate.

The audit must also search for **missing source-supported contracts** not represented by the 106 candidates.

## 6. Required source-audit dimensions

Every checkpoint must be checked across:

- target direction,
- structural topology,
- constraint topology,
- edge state,
- representation/presentation mode,
- SSC vs Banking relevance,
- chapter ownership boundary,
- answer/evidence topology.

A presentation-only change must not create a new permanent QL unless it changes the evidence contract or independently tested reasoning task.

## 7. Freeze gate

Permanent QL allocation remains blocked until all of the following are true:

- source corpus is recorded,
- candidate-to-source evidence map exists,
- merge/split/move/drop pass is complete,
- missing-family search is complete,
- cross-chapter ownership review is complete,
- final discovery matrix has no unexplained gaps,
- provisional count has been replaced by an audited permanent contract list.

Only after that gate should Algebra proceed to permanent QL IDs, production generators, multilingual packages, Question Studio integration and release gates.

## 8. Current decision

**Executable discovery: COMPLETE.**  
**Source/PYQ saturation: NOT YET COMPLETE.**  
**Permanent Algebra QLs: 0.**  
**Question Studio / Question Bank / public release: LOCKED.**
