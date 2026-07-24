# PNC-CP-004 Implementation Report

> **Package:** `PNC-001 — Permutation & Combination Core`  
> **Canonical problem:** `PNC-CP-004 — Repeated Objects, Word Arrangements & Multisets`  
> **Current CP QLs:** `PNC-QL-075` through `PNC-QL-082`  
> **Branch:** `feat/pnc-cp004-repeated-objects-proof`  
> **Draft stacked PR:** `#93`  
> **Base checkpoint:** green CP-003 unrestricted-combination branch  
> **Status:** runtime proof complete  
> **Date:** 2026-07-24

## 1. Need-Based Ownership Decision

The existing package supported factorials, distinct-object permutations and distinct-object combinations, but every arrangement contract assumed that all objects were distinguishable. Reviewed P&C references and the ExamTree counting-state model identify repeated letters and identical objects as the next foundational gap.

CP-004 was justified because it introduces:

- identical-multiplicity state;
- exact correction for indistinguishable swaps;
- fixed-position multiplicity reduction;
- multiset-specific misconception distractors;
- an independent unique-string enumeration contract.

The package remains `PNC-001`; a new package boundary is not justified.

## 2. Admitted QLs

| QL | Direction |
|---|---|
| `PNC-QL-075` | APPLE: one repeated category |
| `PNC-QL-076` | BALLOON: two repeated categories |
| `PNC-QL-077` | MISSISSIPPI: three repeated categories |
| `PNC-QL-078` | repeated coloured flags plus distinct flags |
| `PNC-QL-079` | fix a unique letter first |
| `PNC-QL-080` | fix one copy of a repeated letter first |
| `PNC-QL-081` | recover the identical-swap overcount factor |
| `PNC-QL-082` | recover one bounded missing multiplicity |

The count of eight is a checkpoint result, not a target or ceiling.

## 3. Active CP-004 Solve Modes

| Mode | Current QLs | Contract |
|---|---:|---|
| `arrangeAllMultisetObjects` | 4 | divide `n!` by all repeated multiplicity factorials |
| `arrangeMultisetAfterFixingPosition` | 2 | fix one object and arrange the reduced multiset |
| `findMultisetOvercountFactor` | 1 | compute the product of multiplicity factorials |
| `recoverMultisetMultiplicity` | 1 | bounded exact inverse search |

No together/apart, digit, circular, grouping or partial-multiset mode was declared.

## 4. Runtime Delivered

- CP-specific human-owned question and registry libraries;
- exact multiset permutation and overcount-factor helpers;
- deterministic fixed-word and generated multiset parameters;
- authoritative direct, fixed-position, overcount and inverse solvers;
- independent recursive enumeration of unique multiset strings;
- evidence containing total/remaining objects, multiplicities, numerator, denominator and inverse target;
- evidence-driven explanations;
- multiset-specific distractors;
- exact domain, fixed-position and target-reconstruction validation;
- four-CP pipeline routing.

## 5. Verification

The checkpoint passed:

| Gate | Result |
|---|---|
| Strict targeted TypeScript compilation | PASS |
| esbuild proof-test bundle | PASS |
| Current 82-QL audit | PASS |
| 984 deterministic seed cases | PASS |
| Solver / recursive multiset enumeration agreement | PASS |
| Fixed-position multiplicity reduction | PASS |
| Overcount-factor reconstruction | PASS |
| Bounded inverse target reconstruction | PASS |
| Four unique positive options | PASS |
| Placeholder resolution | PASS |
| Exact duplicate English templates | 0 |

Successful pre-report workflow run: `30075581021`.

## 6. Safety State

- English only;
- `publiclyPublishable: false`;
- maturity `RUNTIME_PROOF`;
- no generation-engine routing;
- no admin or production changes;
- PR remains draft and stacked on the CP-003 branch.

## 7. Next Decision

There is no automatic next CP or QL allocation. A fresh coverage review must compare digit formation, basic restrictions, circular arrangements, category-constrained selection and other remaining families before any new contract is admitted.
