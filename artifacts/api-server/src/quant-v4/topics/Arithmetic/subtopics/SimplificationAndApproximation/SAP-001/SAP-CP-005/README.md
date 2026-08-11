# SAP-CP-005 — Structural Cancellation Candidate

**Branch:** `feat/sap-cp005-structural-cancellation-foundation`  
**Base:** SAP-CP-004 English candidate `87fbcfab53df2c3143fa092a6e323f6ccf0e3ad2`  
**Lifecycle:** provisional / inactive / no permanent QL allocation

## Purpose

This checkpoint implements SAP-CP-005 from the frozen scope authority. CP-005 owns cases where recognising a cancellation map, repeated factor/block, telescoping pattern, reciprocal structure or legal factorisation is the intended exam advantage.

The candidate deliberately does **not** activate Question Studio exposure or write any permanent QL registry entry while SAP-CP-004 remains a draft human-review candidate.

## Wave 1 — executable structural foundation

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

Candidate coordinates: `SAP-QL-072..SAP-QL-085`.

`authority.test.ts` executes 100 deterministic seeds for each solve mode: **1,400 packages**.

GitHub Actions proof:

```text
SAP-CP-005 foundation authority passed: 1400 deterministic cases across 14 solve modes.
```

## Wave 2 — structural strategy and compression

15. common-factor cancellation before multiplication;
16. repeated common-factor blocks;
17. symmetric fraction-pair expressions;
18. repeated-block compression after legal factor extraction;
19. selecting the best first cancellation step;
20. comparing raw and structurally simplified routes.

Candidate coordinates: `SAP-QL-086..SAP-QL-091`.

`authority-wave2.test.ts` executes 100 deterministic seeds for each solve mode: **600 packages**.

The strategy modes prove that:

- the nominated first reduction is a genuine complete common factor;
- raw exact evaluation and the structural route preserve the same value;
- efficiency claims are about smaller intermediate arithmetic, not a different mathematical result.

## Combined authority guarantees

Across both waves the candidate provides:

- exact `bigint` rational arithmetic;
- deterministic generation;
- four unique options with one correct answer;
- misconception-linked wrong options;
- explicit learner-visible cancellation/structure maps;
- independent unsimplified exact verification;
- non-collapsed variable pools;
- forward, inverse, diagnosis and strategy task directions;
- no internal/runtime vocabulary in learner-facing text;
- inactive candidate lifecycle;
- no Question Studio, bank, test or publish exposure.

## Source-guarded hold

One frozen CP-005 family remains intentionally **unimplemented**:

- source-backed numeric partial-fraction telescoping.

The source/ownership audit permits telescoping numeric forms only when source-backed. A verified source fixture for this specific partial-fraction subfamily has not yet been registered in the executable evidence available to this checkpoint. It must not be invented merely to claim scope completion.

## Still deferred before release

- verified source fixture + implementation for numeric partial-fraction telescoping;
- full editorial/remediation pass;
- 300-question human review export across the final admitted CP-005 set;
- permanent QL allocation;
- Question Studio activation.

Proposed IDs `SAP-QL-072..SAP-QL-091` remain **candidate coordinates only**. Every lifecycle object keeps `permanentQlId: null`.