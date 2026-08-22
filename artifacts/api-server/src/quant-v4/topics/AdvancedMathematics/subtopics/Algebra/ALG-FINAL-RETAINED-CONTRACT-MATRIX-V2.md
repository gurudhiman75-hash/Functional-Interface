# Algebra Final Retained Semantic Contract Matrix V2

**Chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Status:** `V2_PRE_ENGLISH_FREEZE_AUTHORITY`  
**Permanent semantic contracts:** 43  
**Permanent ID range:** `ALG-QL-001..ALG-QL-043`  
**Date:** 18 August 2026

---

## 1. V2 decision

The V1 40-contract freeze was reopened before English freeze after a current-PYQ scan exposed three genuine missing contracts. Existing IDs `ALG-QL-001..ALG-QL-040` retain their identity and meaning. V2 appends only:

- `F-C041 / ALG-QL-041` — solve a unique 3×3 linear system;
- `F-C042 / ALG-QL-042` — direct cubic Vieta invariant;
- `F-C043 / ALG-QL-043` — symmetric positive-variable extremum under a fixed-sum constraint.

No V1 ID is renumbered or repurposed.

---

## 2. Final V2 retained contracts

### ALG-001 — 19 contracts

| Freeze key | QL | CP | Contract |
|---|---|---|---|
| F-C001 | ALG-QL-001 | CP-001 | coefficient extraction |
| F-C002 | ALG-QL-002 | CP-001 | simplify / expand algebraic expression |
| F-C003 | ALG-QL-003 | CP-001 | evaluate one-variable expression |
| F-C004 | ALG-QL-004 | CP-001 | evaluate multi-variable expression |
| F-C005 | ALG-QL-005 | CP-002 | square-sum identity from sum/product |
| F-C006 | ALG-QL-006 | CP-002 | cube-sum identity from sum/product |
| F-C007 | ALG-QL-007 | CP-002 | reciprocal square transform |
| F-C008 | ALG-QL-008 | CP-002 | reciprocal cube transform |
| F-C009 | ALG-QL-009 | CP-002 | higher reciprocal power via recurrence |
| F-C010 | ALG-QL-010 | CP-002 | scaled reciprocal transform |
| F-C011 | ALG-QL-011 | CP-003 | symmetric square / pairwise-product conversion |
| F-C012 | ALG-QL-012 | CP-003 | zero-sum cubic identity |
| F-C013 | ALG-QL-013 | CP-003 | cyclic reciprocal multi-variable relation |
| F-C014 | ALG-QL-014 | CP-004 | identity-form recognition / factorisation |
| F-C015 | ALG-QL-015 | CP-004 | generic quadratic factorisation |
| F-C016 | ALG-QL-016 | CP-005 | remainder under a linear divisor |
| F-C017 | ALG-QL-017 | CP-005 | parameter from remainder/factor condition |
| F-C018 | ALG-QL-018 | CP-005 | two parameters from two remainder/factor conditions |
| F-C019 | ALG-QL-019 | CP-005 | parameter plus common remainder across two polynomials |

### ALG-002 — 24 contracts

| Freeze key | QL | CP | Contract |
|---|---|---|---|
| F-C020 | ALG-QL-020 | CP-006 | solve one-variable linear equation |
| F-C021 | ALG-QL-021 | CP-007 | solve unique 2×2 linear system |
| F-C022 | ALG-QL-022 | CP-007 | classify 2×2 system solution state |
| F-C023 | ALG-QL-023 | CP-007 | parameter for system consistency/inconsistency |
| F-C024 | ALG-QL-024 | CP-008 | solve rational equation with original-domain filtering |
| F-C025 | ALG-QL-025 | CP-009 | solve/classify quadratic across root states |
| F-C026 | ALG-QL-026 | CP-009 | parameter for equal roots |
| F-C027 | ALG-QL-027 | CP-009 | parameter/coefficient from root condition |
| F-C028 | ALG-QL-028 | CP-010 | direct quadratic Vieta invariant / infer missing root |
| F-C029 | ALG-QL-029 | CP-010 | derived symmetric quadratic-root expression |
| F-C030 | ALG-QL-030 | CP-010 | construct quadratic from sum/product |
| F-C031 | ALG-QL-031 | CP-010 | construct quadratic under controlled root transformation |
| F-C032 | ALG-QL-032 | CP-011 | Banking comparison of all admissible quadratic roots |
| F-C033 | ALG-QL-033 | CP-012 | solve linear inequality constraints |
| F-C034 | ALG-QL-034 | CP-012 | solve quadratic inequality / sign region |
| F-C035 | ALG-QL-035 | CP-012 | find quadratic extremum |
| F-C036 | ALG-QL-036 | CP-012 | parameter range for global quadratic sign |
| F-C037 | ALG-QL-037 | CP-013 | solve absolute-value equation |
| F-C038 | ALG-QL-038 | CP-013 | solve absolute-value inequality |
| F-C039 | ALG-QL-039 | CP-014 | quantity comparison across admissible states |
| F-C040 | ALG-QL-040 | CP-014 | algebraic data sufficiency |
| F-C041 | ALG-QL-041 | CP-007 | solve unique 3×3 linear system |
| F-C042 | ALG-QL-042 | CP-010 | direct cubic Vieta invariant |
| F-C043 | ALG-QL-043 | CP-012 | symmetric positive-variable fixed-sum extremum |

---

## 3. Important V2 state rules

`ALG-QL-042` is one cubic-Vieta contract, not one QL per invariant. Supported direct invariant states are:

- sum of three roots;
- sum of pairwise products;
- product of three roots.

It does not authorize a general cubic-equation solver.

`ALG-QL-043` is one fixed-sum symmetric-extremum contract. Source-backed current states include:

- minimum reciprocal sum for positive variables;
- minimum square sum for positive variables.

Equality-state topology (`x=y=z=S/3`) is metadata, not a second QL.

`ALG-QL-041` is separate from `ALG-QL-021` because the learner-facing system topology changes from two equations/two variables to three equations/three variables and the answer is an ordered triple.

---

## 4. Explicit non-permanent composition

CP-015 retains zero permanent QLs.

The SSC MTS bounded question “positive integer + its cube = constant” is represented by CP-015 composition candidate `ALG-CP015-CAND-007`. It uses bounded positive-integer root verification and does not expand the permanent scope to a general cubic solver.

---

## 5. V2 count authority

```text
Permanent ALG-001 contracts   19
Permanent ALG-002 contracts   24
--------------------------------
Permanent Algebra contracts   43
CP-015 permanent contracts     0
```

The count is source/semantic-derived, not quota-driven.

All downstream lifecycle surfaces remain locked until permanent-English, multilingual and Question Studio gates pass.