# Algebra Final Source Fixture Ledger

**Authority target:** `F-C001..F-C040` from `ALG-FINAL-RETAINED-CONTRACT-MATRIX.md`  
**Status:** `FINAL_FIXTURE_NORMALIZATION_CANDIDATE`  
**Date:** 18 August 2026

This ledger normalizes source evidence by retained semantic contract rather than by executable candidate count.

Evidence levels:

- `DIRECT_PYQ` — explicit previous/official paper provenance;
- `TARGET_TAXONOMY` — target-exam practice/syllabus taxonomy directly names the family;
- `COMPARABLE_PYQ` — official recruitment/state/teaching/Railway paper supports the same mathematical contract;
- `INTERNAL_MERGE_EVIDENCE` — no independent source required because the item is only a representation/answer state of an already sourced contract.

Existing evidence IDs refer to the Wave-1/2/3 and HOLD-resolution authority files already in this directory.

---

## Final supplemental evidence added during freeze pass

| ID | Provenance | Supports |
|---|---|---|
| `ALG-FRZ-S01` | RRB Group D, 12 Sep 2022 Shift 3 Official Paper — `6x - 39 = 339` | one-variable linear equation |
| `ALG-FRZ-S02` | RRB NTPC UG, 02 Sep 2025 Shift 3 Official Paper — bracketed expression reducing exactly to a linear equation | linear equation representation depth |
| `ALG-FRZ-S03` | RRB JE CBT-1 2025, held 19 Feb 2026 Shift 3 — rational equation `(x-3)/(x-4) + (x-6)/(x-5) = 5/2` | rational equation topology / denominator domain |
| `ALG-FRZ-S04` | Testbook SSC Exams Algebra taxonomy — Previous Year Qs + Linear Equation in 1 or 2 Variable | linear-equation target taxonomy |
| `ALG-FRZ-S05` | Testbook Banking Quant syllabus — Algebra includes Linear Equations in One Variable, Linear Inequations, Linear Equations in Two Variables, Quadratic Equation | linear equation / inequality target taxonomy |
| `ALG-FRZ-S06` | EMRS TGT Math, 24 Dec 2023 Official Paper — `|3-4x| ≥ 9` | absolute-value inequality |
| `ALG-FRZ-S07` | DSSSB PGT Maths, 18 Jul 2025 Shift 2 — `|x| ≤ 7` | absolute-value inequality bounded form |
| `ALG-FRZ-S08` | SSC CGL 2022 Tier-I, 12 Dec 2022 Shift 4 — equation whose roots are `α², β²` | transformed-root equation / Vieta |
| `ALG-FRZ-S09` | UPPSC LT Grade Assistant Teacher Science, 29 Jul 2018 — one root given, find other root | direct-Vieta missing-root variant |
| `ALG-FRZ-S10` | OSSC CGLRE Mains, 31 Aug 2024 — reciprocal-root condition determines parameter | quadratic root-condition parameter |
| `ALG-FRZ-S11` | RRB NTPC CBT-I, 01 Apr 2021 Shift 2 — `a² ≤ 5a`, count positive integer solutions | quadratic inequality / interval count |
| `ALG-FRZ-S12` | Banking/Insurance practice taxonomy — Quadratic Equations, Data Sufficiency, Comparison of Quantities | Banking comparison / QC / DS |
| `ALG-FRZ-S13` | SSC CGL Algebra collection updated Aug 2026 | final gap-scan corpus: coefficient extraction, scaled reciprocal transform, factorisation, reciprocal/quadratic transforms, transformed roots |

URLs:

- FRZ-S01: https://testbook.com/question-answer/if-39-less-than-6-times-a-certain-number-is-339-t--635ac525f401584323cd5087
- FRZ-S02: https://testbook.com/question-answer/find-the-value-of-x-satisfying-44x2-5--68ddd9dee11666d01cbd69f8
- FRZ-S03: https://testbook.com/question-answer/find-the-discriminat-of-the-equationfrac--69ae6f60180e4beeca37a9a6
- FRZ-S04: https://testbook.com/ssc-exams-algebra-questions--cq
- FRZ-S05: https://testbook.com/bank-exams/quantitative-aptitude
- FRZ-S06: https://testbook.com/question-answer/the-solution-set-of-3-4x-9-is--6593f61c8aebfdacdcfa1427
- FRZ-S07: https://testbook.com/question-answer/the-inequality-x-7-has-the-solution-_____--68aed78f841725c93d44818b
- FRZ-S08: https://testbook.com/question-answer/if-are-the-roots-of-6x2--63ab329b7913d3b8def0dab3
- FRZ-S09: https://testbook.com/question-answer/if-one-of-the-roots-of-the-quadratic-equation-2x2--684bc0e6f62192297dd8cfdc
- FRZ-S10: https://testbook.com/question-answer/if-one-of-the-roots-of-the-quadratic-equation-4x2--671b786fe23f050546f7b030
- FRZ-S11: https://testbook.com/question-answer/for-how-many-positive-integers-a-it-is-t--627e35f021828bbc71ec4405
- FRZ-S12: https://testbook.com/bank-insurance-exams-questions
- FRZ-S13: https://testbook.com/questions/ssc-cgl-algebra-questions--637ef17e14906c7733f9a292

---

## Contract-by-contract normalized evidence

### ALG-001

| Contract | Evidence authority | Level | Freeze note |
|---|---|---|---|
| `F-C001` coefficient extraction | `ALG-W1-S01`, `ALG-FRZ-S13` | DIRECT_PYQ / corpus | retained |
| `F-C002` simplify / expand | `ALG-W1-S08` | DIRECT_PYQ | retained |
| `F-C003` evaluate one-variable expression | `ALG-W1-S02` | DIRECT_PYQ | retained |
| `F-C004` evaluate multi-variable expression | `ALG-W1-S03` | DIRECT_PYQ | retained |
| `F-C005` square-sum identity | Wave-1 SSC identity fixtures | DIRECT_PYQ | retained |
| `F-C006` cube-sum identity | Wave-1 SSC identity fixtures | DIRECT_PYQ | retained |
| `F-C007` reciprocal square transform | Wave-1 SSC reciprocal fixtures | DIRECT_PYQ | plus/minus is state |
| `F-C008` reciprocal cube transform | `ALG-W1-S04`, `ALG-W1-S05`, `ALG-W1-S07` | DIRECT_PYQ | retained |
| `F-C009` higher reciprocal power | `ALG-W1-S06`, SSC reciprocal corpus | DIRECT_PYQ | retained |
| `F-C010` scaled reciprocal transform | `ALG-W1-S13`, `ALG-FRZ-S13` | DIRECT_PYQ | retained |
| `F-C011` symmetric square/pairwise-product conversion | `ALG-W1-S08` | DIRECT_PYQ | retained |
| `F-C012` zero-sum cubic identity | `ALG-W1-S09` | DIRECT_PYQ | retained |
| `F-C013` cyclic reciprocal relation | `ALG-W1-S15`, HOLD Pass 01 | DIRECT_PYQ | owner CP-003 |
| `F-C014` identity-form recognition/factorisation | `ALG-HR1-S01`, `ALG-HR1-S02`, Wave-1 identity evidence | DIRECT_PYQ | difference-square/perfect-square are identity states |
| `F-C015` generic quadratic factorisation | `ALG-W1-S10` | DIRECT_PYQ | monic/non-monic state |
| `F-C016` linear-divisor remainder | `ALG-W1-S12` | DIRECT_PYQ | `x±k`, `ax+b` state |
| `F-C017` parameter from remainder/factor condition | `ALG-W1-S11` | DIRECT_PYQ | factor = remainder-zero state |
| `F-C018` two parameters from two conditions | Wave-1 source audit + exact executable proof | DIRECT/DERIVED FIXTURE | retained as distinct two-constraint inference |
| `F-C019` parameter + common remainder across polynomials | `ALG-W1-S14` | DIRECT_PYQ | retained |

### ALG-002

| Contract | Evidence authority | Level | Freeze note |
|---|---|---|---|
| `F-C020` solve one-variable linear equation | `ALG-FRZ-S01`, `ALG-FRZ-S02`, `ALG-FRZ-S04`, `ALG-FRZ-S05` | DIRECT_PYQ + TARGET_TAXONOMY | surface forms are states |
| `F-C021` solve unique 2×2 system | Wave-2 audit + SSC/Railway linear-system fixtures | DIRECT_PYQ | target expression is state |
| `F-C022` classify 2×2 system | `ALG-HR1-S03`, `ALG-HR1-S04` | DIRECT_PYQ | unique/no/infinite are answer states |
| `F-C023` parameter for system consistency | `ALG-HR1-S05` | DIRECT_PYQ | retained |
| `F-C024` rational equation + original-domain filtering | `ALG-FRZ-S03`, Wave-2 domain audit | DIRECT_PYQ + correctness authority | exclusions/cancellation are mandatory states |
| `F-C025` solve/classify quadratic | Wave-2 quadratic fixtures, Banking taxonomy | DIRECT_PYQ / TARGET_TAXONOMY | root type is state |
| `F-C026` parameter for equal roots | Wave-2 discriminant fixtures | DIRECT_PYQ | retained |
| `F-C027` quadratic parameter/root condition | `ALG-HR1-S06`, `ALG-FRZ-S10` | DIRECT_PYQ | known/common/reciprocal root condition is topology |
| `F-C028` direct Vieta / missing root | Wave-2 Vieta fixtures, `ALG-FRZ-S09` | DIRECT_PYQ / COMPARABLE_PYQ | sum/product/missing-root target states |
| `F-C029` derived symmetric root expression | Wave-2 Vieta fixtures | DIRECT_PYQ | target expression state |
| `F-C030` equation from sum/product | Wave-2 Vieta fixtures | DIRECT_PYQ | retained |
| `F-C031` transformed-root equation | `ALG-FRZ-S08`, Wave-2 remediation | DIRECT_PYQ | transform algebra state |
| `F-C032` Banking quadratic comparison | `ALG-HR2-S01..S03`, `ALG-FRZ-S12` | TARGET_TAXONOMY / practice corpus | relation output is state |
| `F-C033` linear inequality constraints | `ALG-FRZ-S05` | TARGET_TAXONOMY | simple/compound/sign reversal are states |
| `F-C034` quadratic inequality / sign region | Wave-3 SSC evidence, `ALG-FRZ-S11` | DIRECT_PYQ | integer count is target variant |
| `F-C035` quadratic extremum | Wave-3 direct SSC minimum-value fixture | DIRECT_PYQ | min/max is state |
| `F-C036` global quadratic sign parameter | Wave-3 direct discriminant/sign fixture | DIRECT_PYQ | retained |
| `F-C037` absolute-value equation | `ALG-HR1-S07`, `ALG-HR1-S08` | COMPARABLE_PYQ | equal-distance form merges here |
| `F-C038` absolute-value inequality | `ALG-FRZ-S06`, `ALG-FRZ-S07` | COMPARABLE_PYQ | bounded/exterior/count are states |
| `F-C039` quantity comparison | `ALG-HR2-S01`, `ALG-HR2-S03`, `ALG-FRZ-S12` | TARGET_TAXONOMY | relation output state |
| `F-C040` algebraic data sufficiency | `ALG-HR2-S04`, `ALG-HR2-S05`, `ALG-FRZ-S12` | DIRECT/TARGET EVIDENCE | five verdicts are answer states |

---

## Evidence-free contract check

Result: **0 retained contracts with no evidence path.**

Some contracts rely on target taxonomy or comparable recruitment papers rather than a shift-tagged SSC/Banking PYQ. That distinction is preserved in the `Level` column rather than hidden.

This ledger does not claim that every representation state has its own source fixture; representation states intentionally inherit authority from the semantic contract they belong to.
