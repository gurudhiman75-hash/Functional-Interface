# P&C Family Current-State Amendment — CP-002 — 2026-07-24

> **Applies to:** the need-based P&C family design and earlier current-state amendment  
> **Purpose:** Supersede implementation snapshots only  
> **Governance effect:** None; no fixed totals or future-mode inventories are introduced

## Current package state

- active package: `PNC-001`;
- active CPs: `PNC-CP-001`, `PNC-CP-002`;
- current English QLs: `PNC-QL-001` through `PNC-QL-066`;
- current QL count: 66;
- current active solve modes: 13;
- current observed difficulty: 31 Easy, 25 Medium, 10 Hard;
- maturity: `RUNTIME_PROOF`;
- publicly publishable: `false`;
- generation-engine routing: not added;
- Hindi/Punjabi: not implemented.

## Newly active CP

```text
PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects
```

Its current admitted QLs are `PNC-QL-059` through `PNC-QL-066`, supported by:

- `arrangeAllDistinctObjects`;
- `arrangeRFromNDistinctObjects`;
- `recoverPermutationParameter`.

These modes were introduced only because the admitted QLs require distinct order-sensitive `nPr` contracts.

## Verification snapshot

The two-CP package passed:

- strict targeted TypeScript compilation;
- esbuild proof-test bundling;
- current 66-QL registry, placeholder and duplicate audit;
- 792 seed cases, each generated twice;
- independent enumeration agreement;
- permutation inverse reconstruction;
- CP-specific random routing.

Successful pre-amendment workflow run: `30069922425`.

## Continuing rule

The current numbers are implementation facts, not targets. A later QL, mode, CP or package requires a fresh documented need. Unordered selection is only a deferred candidate until such a review is completed.