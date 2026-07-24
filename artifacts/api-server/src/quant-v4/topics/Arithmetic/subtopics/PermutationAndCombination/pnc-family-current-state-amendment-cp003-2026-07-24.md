# P&C Family Current-State Amendment — CP-003 — 2026-07-24

> **Applies to:** the need-based P&C family design and earlier current-state amendments  
> **Purpose:** Supersede implementation snapshots only  
> **Governance effect:** None; no fixed totals or future-mode inventories are introduced

## Current package state

- active package: `PNC-001`;
- active CPs: `PNC-CP-001`, `PNC-CP-002`, `PNC-CP-003`;
- current English QLs: `PNC-QL-001` through `PNC-QL-074`;
- current QL count: 74;
- current active solve modes: 16;
- current observed difficulty: 34 Easy, 29 Medium, 11 Hard;
- maturity: `RUNTIME_PROOF`;
- publicly publishable: `false`;
- generation-engine routing: not added;
- Hindi/Punjabi: not implemented.

## Newly active CP

```text
PNC-CP-003 — Unrestricted Unordered Selection of Distinct Objects
```

Its current admitted QLs are `PNC-QL-067` through `PNC-QL-074`, supported by:

- `selectRFromNDistinctObjects`;
- `recoverCombinationParameter`;
- `recoverComplementaryCombinationIndex`.

These modes were introduced only because the admitted QLs require distinct order-insensitive `nCr`, inverse-domain and symmetry contracts.

## Verification snapshot

The three-CP package passed:

- strict targeted TypeScript compilation;
- esbuild proof-test bundling;
- current 74-QL registry, placeholder and duplicate audit;
- 888 seed cases, each generated twice;
- independent subset-enumeration agreement;
- lower-half inverse-domain enforcement;
- exact combination target reconstruction;
- complementary-index symmetry;
- CP-specific random routing.

Successful pre-amendment workflow run: `30071411996`.

## Continuing rule

The current numbers are implementation facts, not targets. A later QL, mode, CP or package requires a fresh documented need. Conditional selection, repeated objects, digit restrictions and restricted/circular arrangements are only deferred candidates until such a review is completed.