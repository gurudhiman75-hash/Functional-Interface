# PNC-CP-003 Implementation Report

> **Package:** `PNC-001 — Permutation & Combination Core`  
> **Canonical problem:** `PNC-CP-003 — Unrestricted Unordered Selection of Distinct Objects`  
> **Current CP QLs:** `PNC-QL-067` through `PNC-QL-074`  
> **Branch:** `feat/pnc-cp003-unrestricted-combinations-proof`  
> **Draft stacked PR:** `#91`  
> **Base checkpoint:** green CP-002 unrestricted-permutation branch  
> **Status:** runtime proof complete  
> **Date:** 2026-07-24

---

## 1. Need-Based Ownership Decision

CP-003 was not created from a predetermined chapter sequence or QL quota. A coverage review compared the existing exact-factorial and `nPr` runtime against previously reviewed SSC-oriented P&C material. The highest-value missing foundational contract was unordered selection, where only the selected set matters and order does not.

A new CP was justified because this family introduces:

- `orderMatters = false`;
- exact `nCr` authority;
- division of an ordered `nPr` count by the `r!` internal orders of each set;
- symmetry between `r` and `n-r`;
- combination-versus-permutation misconceptions;
- inverse-search ambiguity that requires an explicit domain.

The package remains `PNC-001`; the runtime is still coherent and reviewable, so a package split is not justified.

The decision is recorded in `pnc-cp003-unrestricted-combinations-gap-matrix.md`.

---

## 2. Admitted QLs

Eight QLs were admitted because each contributes a material direction:

| QL | Direction |
|---|---|
| `PNC-QL-067` | select `r` students from `n` students |
| `PNC-QL-068` | form a committee without assigned offices |
| `PNC-QL-069` | select an unordered team |
| `PNC-QL-070` | count unordered pairs/handshakes |
| `PNC-QL-071` | count unordered triples/triangles |
| `PNC-QL-072` | recover `n` from an exact `nCr` target |
| `PNC-QL-073` | recover `r` in the stated lower-half domain |
| `PNC-QL-074` | recover the complementary index using `nCr = nC(n-r)` |

The count of eight is a checkpoint result, not a CP target or ceiling.

---

## 3. Active CP-003 Solve Modes

| Mode | Current QLs | Contract |
|---|---:|---|
| `selectRFromNDistinctObjects` | 5 | direct unordered selection of distinct objects |
| `recoverCombinationParameter` | 2 | bounded exact recovery of missing `n` or lower-half `r` |
| `recoverComplementaryCombinationIndex` | 1 | recover `n-r` using combination symmetry |

Student, committee, team, pair and triangle contexts reuse the same direct mode because their mathematical state and evidence are identical once `r` is established.

No conditional committee, repeated-object, digit, circular, grouping or restricted-selection mode was declared.

---

## 4. Runtime Delivered

- CP-specific human-owned question and task-registry companion libraries;
- global composition and parity validation across base and companion libraries;
- exact `combinationExact(n, r)` using symmetry-reduced exact arithmetic;
- deterministic direct, inverse and symmetry parameters;
- explicit QL-to-CP inference and CP-filtered random generation;
- authoritative direct `nCr`, inverse and symmetry solvers;
- independent increasing-index subset enumeration;
- bounded inverse search for `n` or lower-half `r`;
- normalized evidence containing `n`, `r`, ordered precursor, `r!`, target and symmetry partner;
- evidence-driven explanations;
- combination/permutation misconception distractors;
- exact domain, target-reconstruction and symmetry validators;
- three-CP pipeline routing.

---

## 5. Verification

The stacked checkpoint passed:

| Gate | Result |
|---|---|
| Strict targeted TypeScript compilation | PASS |
| esbuild proof-test bundle | PASS |
| Current 74-QL audit | PASS |
| CP-003 deterministic generation | PASS |
| Exact solver / independent subset enumeration agreement | PASS |
| Lower-half inverse-domain enforcement | PASS |
| Combination target reconstruction | PASS |
| Complementary-index symmetry | PASS |
| Four unique positive options | PASS |
| Correct answer exactly once | PASS |
| Placeholder resolution | PASS |
| Exact duplicate English templates | 0 |

Current package test volume:

- 74 active QLs;
- 12 seed cases per QL;
- 888 seed cases;
- every seed generated twice;
- explicit assertions for all 16 current solve modes and CP-003 routing.

Successful pre-report workflow run: `30071411996`.

---

## 6. Safety State

- English only;
- `publiclyPublishable: false`;
- maturity `RUNTIME_PROOF`;
- no generation-engine routing;
- no admin or production changes;
- PR remains draft and stacked on the CP-002 branch.

---

## 7. Next Decision

There is no automatic CP-004 or fixed QL allocation. A fresh coverage review must determine whether the next material gap is conditional selection, repeated objects, digit formation, restricted arrangements, or another family, and which exact contracts are justified.