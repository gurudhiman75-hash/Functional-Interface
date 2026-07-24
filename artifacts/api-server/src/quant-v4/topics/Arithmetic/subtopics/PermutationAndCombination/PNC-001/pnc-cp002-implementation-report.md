# PNC-CP-002 Implementation Report

> **Package:** `PNC-001 — Permutation & Combination Core`  
> **Canonical problem:** `PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects`  
> **Current CP QLs:** `PNC-QL-059` through `PNC-QL-066`  
> **Branch:** `feat/pnc-cp002-unrestricted-permutations-proof`  
> **Draft stacked PR:** `#90`  
> **Base checkpoint:** green CP-001 factorial branch  
> **Status:** runtime proof complete  
> **Date:** 2026-07-24

---

## 1. Need-Based Ownership Decision

CP-002 was not preplanned from a fixed chapter map. A reference and runtime coverage review identified unrestricted ordered arrangements of distinct objects as the next material gap after factorial reasoning.

The family required a new CP because it introduces:

- a distinct object pool of size `n`;
- an ordered position count `r`;
- no-repetition selection;
- exact `nPr` authority;
- permutation-specific evidence and validation;
- bounded recovery of a missing permutation parameter.

The package remains `PNC-001`; the runtime is still coherent and reviewable, so a package split is not justified.

The decision is recorded in `pnc-cp002-unrestricted-permutations-gap-matrix.md`.

---

## 2. Admitted QLs

Eight QLs were admitted because each contributes a material direction:

| QL | Direction |
|---|---|
| `PNC-QL-059` | arrange all students in a row |
| `PNC-QL-060` | arrange all distinct books on a shelf |
| `PNC-QL-061` | arrange all distinct flags into signals |
| `PNC-QL-062` | form an ordered code by taking `r` from `n`, no repetition |
| `PNC-QL-063` | award gold, silver and bronze from finalists |
| `PNC-QL-064` | fill distinct offices from eligible candidates |
| `PNC-QL-065` | recover `n` from an exact `nPr` target |
| `PNC-QL-066` | recover `r` from an exact `nPr` target |

The count of eight is a checkpoint result, not a CP target or ceiling.

---

## 3. Active CP-002 Solve Modes

| Mode | Current QLs | Contract |
|---|---:|---|
| `arrangeAllDistinctObjects` | 3 | all `n` distinct objects fill all ordered positions |
| `arrangeRFromNDistinctObjects` | 3 | select and order `r` from `n` without repetition |
| `recoverPermutationParameter` | 2 | bounded exact recovery of missing `n` or `r` |

Medal, office and code contexts reuse the same partial-permutation mode because their mathematical state, evidence and validator invariants are identical.

No combination, repeated-object, digit, circular or restricted-arrangement mode was declared.

---

## 4. Runtime Delivered

- exact `permutationExact(n, r)` backed by exact factorial-quotient arithmetic;
- deterministic `n` and `r` generation from curated difficulty pools;
- explicit QL-to-CP inference when a QL ID is supplied;
- CP-filtered random generation;
- authoritative `nPr` solver;
- independent recursive enumeration without repetition;
- bounded inverse searches for either `n` or `r`;
- normalized evidence containing `n`, `r`, factors, target and recovered parameter;
- evidence-driven explanations;
- misconception distractors for factorial-only, unordered-selection, repetition and missing-factor errors;
- exact permutation domain and inverse reconstruction validators;
- two-CP pipeline routing.

---

## 5. Verification

The stacked checkpoint passed:

| Gate | Result |
|---|---|
| Strict targeted TypeScript compilation | PASS |
| esbuild proof-test bundle | PASS |
| Current 66-QL audit | PASS |
| CP-002 deterministic generation | PASS |
| Exact solver / independent enumeration agreement | PASS |
| Inverse target reconstruction | PASS |
| Four unique positive options | PASS |
| Correct answer exactly once | PASS |
| Placeholder resolution | PASS |
| Exact duplicate English templates | 0 |

Current package test volume:

- 66 active QLs;
- 12 seed cases per QL;
- 792 seed cases;
- every seed generated twice;
- explicit assertions for all 13 current solve modes and CP-002 routing.

Successful pre-report workflow run: `30069922425`.

---

## 6. Safety State

- English only;
- `publiclyPublishable: false`;
- maturity `RUNTIME_PROOF`;
- no generation-engine routing;
- no admin or production changes;
- PR remains draft and stacked on the CP-001 branch.

---

## 7. Next Decision

There is no automatic CP-003 or fixed QL allocation. A fresh coverage review must decide whether unordered selection (`nCr`) is the next highest-value gap and, if so, exactly which directions and solve contracts are justified.