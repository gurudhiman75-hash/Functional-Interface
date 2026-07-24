# P&C Family Current-State Amendment — CP-004 Digit & Code Runtime Proof

> Date: 2026-07-24  
> This amendment records current implementation state under the fixed two-package, twelve-CP roadmap.

## Roadmap state

### Package `PNC-001`

- `PNC-CP-001`: runtime proof;
- `PNC-CP-002`: runtime proof;
- `PNC-CP-003`: runtime proof;
- `PNC-CP-004`: runtime proof;
- `PNC-CP-005`: partial CP runtime proof for repeated-object/multiset coverage;
- `PNC-CP-006`: pending.

### Package `PNC-002`

`PNC-CP-007` through `PNC-CP-012` remain pending.

## Current package snapshot

- active implemented CPs: 5;
- current English QLs: `PNC-QL-001` through `PNC-QL-094`;
- current QL count: 94;
- current solve modes: 30;
- observed difficulty: 37 Easy / 39 Medium / 18 Hard;
- publication state: `publiclyPublishable: false`.

## CP-004 checkpoint

Current CP-004 QLs are `PNC-QL-083` through `PNC-QL-094`. They cover leading zero, repetition policy, parity, divisibility by 5, controlled thresholds, alphanumeric stages, inverse code alphabet size and exactly-one-pair codes.

Verification run `30078944764` passed strict TypeScript, bundling, the 94-QL audit and 1,128 deterministic seed cases.

## Governance retained

- package and CP ownership boundaries are fixed at two packages × six CPs;
- QL totals and terminal IDs are not fixed;
- solve-mode inventories are not fixed in advance;
- difficulty counts are descriptive snapshots;
- additional QLs require a material coverage distinction;
- CP-006 is the only wholly pending CP in package PNC-001.
