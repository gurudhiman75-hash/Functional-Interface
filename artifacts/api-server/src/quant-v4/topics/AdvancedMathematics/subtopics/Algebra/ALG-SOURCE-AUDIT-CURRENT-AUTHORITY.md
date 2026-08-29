# Algebra Current Source-Audit Authority

**Chapter:** Algebra  
**Design:** Revision 2  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Authority status:** ALL CHECKPOINTS FIRST-PASS AUDITED / SOURCE SATURATION NOT COMPLETE  

---

## 1. Purpose

This is the current cross-wave authority for Algebra after executable discovery and the first source/PYQ review of all 15 checkpoints.

It supersedes using the raw discovery count as a maturity signal.

This document does **not** allocate permanent QL IDs and does **not** authorize Question Studio, Question Bank, tests or public release.

---

## 2. Current executable candidate pool

The original design-led discovery produced 106 candidates. Source/PYQ review then exposed six additional evidence-backed representation/task gaps that were prototyped and tested:

### Wave 1 additions

1. CP-001 `expandAndSimplifyExpression`
2. CP-002 `findScaledReciprocalSquare`
3. CP-005 `findParameterAndCommonRemainderAcrossPolynomials`

### Wave 2 additions

4. CP-010 `constructEquationWithProductPlusMinusSumRoots`
5. CP-010 `constructEquationWithReciprocalThenShiftedRoots`
6. CP-011 `compareIrrationalConjugateRootSets`

Current provisional counts:

| CP | Provisional candidates |
|---|---:|
| CP-001 | 7 |
| CP-002 | 9 |
| CP-003 | 5 |
| CP-004 | 5 |
| CP-005 | 8 |
| CP-006 | 7 |
| CP-007 | 7 |
| CP-008 | 7 |
| CP-009 | 6 |
| CP-010 | 11 |
| CP-011 | 7 |
| CP-012 | 10 |
| CP-013 | 9 |
| CP-014 | 8 |
| CP-015 | 6 |
| **Total** | **112** |

At 50 deterministic seeds per candidate, the current checkpoint surface covers **5,600 generated states**.

**112 is a provisional executable inventory, not a permanent QL target.**

---

## 3. Source-audit files now present

- `ALG-SOURCE-PYQ-AUDIT-WAVE01-CP001-CP005.md`
- `ALG-SOURCE-PYQ-AUDIT-WAVE02-CP006-CP011.md`
- `ALG-SOURCE-PYQ-AUDIT-WAVE02-REMEDIATION-ADDENDUM.md`
- `ALG-SOURCE-PYQ-AUDIT-WAVE03-CP012-CP015.md`

All 15 checkpoints have therefore received at least one explicit KEEP / MERGE / MOVE / HOLD / GAP review.

---

## 4. Strong cross-wave semantic consolidation

The following merges/moves are already supported strongly enough that the future permanent model should not recreate the original one-candidate-per-form shape.

### Expressions / identities / polynomials

- undefined substitution belongs to CP-008 domain ownership, not a permanent CP-001 QL;
- plus/minus reciprocal square forms are one contract with sign state;
- plus/minus reciprocal cube forms are one contract with sign state;
- monic/non-monic quadratic factorisation is one factorisation contract with coefficient topology;
- common-content extraction is factorisation topology/pre-step;
- `x-k`, `x+k`, `ax+b` remainder questions are one linear-divisor remainder contract;
- factor condition / stated remainder / Boolean factor verification are target/edge states of the same remainder-condition family unless later evidence proves otherwise.

### Equations / quadratics / Vieta

- one-variable linear equation surface forms (both sides, brackets, fractional coefficients) are representation states;
- unique 2×2 system targets `(x,y)`, `x`, `x+y`, `x-y` share one solved-state contract;
- rational equation fraction count and cancelled/excluded-root outcomes belong to one original-domain solve contract;
- rational/repeated/irrational/no-real quadratic roots are root-state outcomes of one quadratic solve/classify contract;
- direct root sum/product are one direct-Vieta invariant family;
- square/cube/reciprocal symmetric root expressions are one derived-symmetric family with target topology;
- shifted, reciprocal, `P±S`, and reciprocal→shift equations belong to one transformed-root equation family with controlled transform topology;
- all Banking quadratic-comparison relation outputs belong to one comparison contract; rational/irrational roots are representation states.

### Inequalities / evidence / synthesis

- sign reversal in a linear inequality is representation state;
- positive/non-positive/repeated-root quadratic inequality forms are one quadratic sign-region contract;
- quadratic minimum/maximum is one extremum contract with leading-sign state;
- integer-count targets over solved intervals are target variants, not separate contracts by default;
- QC determinate/indeterminate relations are output states of one QC contract;
- all five data-sufficiency verdicts are output states of one DS contract;
- CP-015 is composition/presentation over earlier owners and currently justifies **zero permanent CP-015 QLs**.

---

## 5. Explicit unresolved HOLDs

Permanent allocation remains blocked by the following unresolved evidence/ownership questions.

### Wave 1 / ALG-001

- CP-001 missing coefficient from known evaluation: direct source strength / ownership unresolved;
- CP-002 sum+difference → difference-of-squares target: direct source strength unresolved;
- CP-003 pairwise-difference-square target: direct source strength unresolved;
- cyclic reciprocal relation: ownership across CP-002 / CP-003 / CP-015 unresolved;
- perfect-square factorisation versus generic quadratic factorisation: final split depends on source-frequency/recognition-task evidence.

### Wave 2 / ALG-002 equations

- CP-006 degenerate linear classification: exam-facing contract or engine-only state;
- CP-006 parameter from known solution: ownership/source evidence unresolved;
- CP-007 degenerate system classification: exam-facing contract or engine-only state;
- CP-007 parameter for consistency/inconsistency: source strength unresolved;
- CP-008 standalone excluded-value task and identity-on-domain: source strength unresolved;
- CP-006–008 generally need a broader direct target-exam fixture corpus before permanent freeze;
- CP-009 coefficient from known root: source/ownership saturation incomplete.

### Banking representation

- exact irrational-root comparison is implemented and green;
- quadratics whose **input coefficients themselves contain surds** remain unsupported by the rational-coefficient quadratic model;
- unlike-radicand exact surd comparison remains deliberately unsupported until source evidence requires it.

### Wave 3

- CP-013 absolute-value engine is correct and green but remains source-evidence HOLD for permanent QLs;
- CP-014 DS is source-backed for Banking; broader QC source mapping is still desirable;
- CP-015 remains composition/presentation unless later PYQs prove an independent stable contract.

---

## 6. Current source-backed anchors

The first-pass audit already gives strong evidence for keeping these broad reasoning families in the final audited pool:

- expression substitution/evaluation and expansion/simplification,
- reciprocal/identity transformations including scaled reciprocal form,
- core symmetric identities,
- quadratic factorisation,
- Remainder/Factor Theorem including parameter/equal-remainder forms,
- quadratic solving/classification,
- equal-root/discriminant parameter reasoning,
- direct and derived Vieta reasoning,
- transformed-root equation construction,
- Banking quadratic comparison,
- quadratic inequality/sign-region reasoning,
- quadratic extrema,
- global-sign parameter constraints,
- Banking data sufficiency.

This list is an **anchor list**, not a permanent ID list.

---

## 7. Mandatory saturation gate before permanent QLs

Permanent QL allocation remains blocked until all of the following are complete:

1. each HOLD is resolved to KEEP / MERGE / MOVE / DROP;
2. source fixture ledger records exam, year/date/shift where provenance is available;
3. SSC and Banking coverage are both checked rather than inferring one from the other;
4. cross-chapter ownership is resolved for parameter/evaluation/synthesis overlaps;
5. source-backed missing-family search yields no unexplained gap;
6. final semantic merge/split matrix is approved;
7. audited permanent contract list replaces the provisional candidate pool.

Only then should permanent QL IDs be allocated.

---

## 8. Current decision

**Executable discovery:** COMPLETE.  
**Current provisional candidates:** 112.  
**First-pass source audit across CP-001…015:** COMPLETE.  
**Source saturation:** NOT COMPLETE.  
**Permanent Algebra QLs:** 0.  
**Question Studio:** LOCKED.  
**Question Bank / test eligibility / public release:** LOCKED.  
**PR #867:** MUST REMAIN DRAFT.
