# SAP-CP-005 — Structural Cancellation Foundation

**Branch:** `feat/sap-cp005-structural-cancellation-foundation`  
**Base:** SAP-CP-004 English candidate `87fbcfab53df2c3143fa092a6e323f6ccf0e3ad2`  
**Lifecycle:** provisional / inactive / no permanent QL allocation

## Purpose

This checkpoint begins the executable implementation of SAP-CP-005 from the frozen scope authority. CP-005 owns cases where recognising a cancellation map, telescoping pattern, reciprocal structure or legal factorisation is the intended exam advantage.

This foundation deliberately does **not** activate Question Studio exposure or write any permanent QL registry entry while SAP-CP-004 remains a draft human-review candidate.

## Executable solve modes in this slice

1. multi-fraction product-chain cancellation;
2. numeric factor extraction followed by cancellation;
3. ratio of products;
4. consecutive-integer product ratios;
5. long factorial ratios;
6. product/reciprocal cancellation chains;
7. numeric difference-of-squares reduction;
8. exact numeric conjugate products;
9. nested reciprocal chains;
10. bounded telescoping sums;
11. bounded telescoping products;
12. products of `1 ± 1/n` patterns;
13. missing factor recoverable from a cancellation state;
14. illegal cancellation across addition/subtraction diagnosis.

Proposed IDs `SAP-QL-072..SAP-QL-085` are **candidate coordinates only**. `lifecycle.permanentQlId` remains `null`.

## Authority guarantees

`authority.test.ts` executes 100 deterministic seeds for each solve mode (1,400 generated packages) and independently reconstructs the unsimplified exact value.

The authority checks:

- exact `bigint` rational arithmetic;
- deterministic generation;
- four unique options with one correct answer;
- misconception-linked wrong options;
- explicit cancellation/structure maps;
- independent direct evaluation versus the structural route;
- non-collapsed variable pools;
- no internal/runtime vocabulary in learner-facing text;
- inactive candidate lifecycle;
- no Question Studio, bank, test or publish exposure.

## Local proof

At foundation creation:

```text
SAP-CP-005 foundation authority passed:
1400 deterministic cases across 14 solve modes.
```

The TypeScript runtime also passes strict compilation under TypeScript 5.8.3 / ES2022.

## Still intentionally deferred

The following CP-005 authority families are not yet claimed complete by this foundation:

- repeated common-factor blocks as their own solve identity;
- source-backed numeric partial-fraction telescoping;
- symmetric fraction-pair expressions;
- repeated-block compression;
- selecting the best first cancellation step;
- comparing raw and structurally simplified routes;
- full editorial/remediation and 300-question human review export;
- permanent QL allocation and Question Studio activation.

These remain the next CP-005 implementation wave. No deferred family should be silently absorbed into one of the current prototypes without a merge/split review.
