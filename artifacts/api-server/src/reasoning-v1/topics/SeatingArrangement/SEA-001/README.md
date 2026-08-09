# SEA-001 — Linear and Circular Seating Foundations

Executable discovery foundation governed solely by **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

## Implemented in this checkpoint

- Wave 0 family/package/checkpoint manifest and hard lifecycle locks;
- deterministic seeded generation with bounded derived-seed retries;
- reusable finite-constraint types and seeded PRNG under `reasoning-v1/shared/constraint-core`;
- `SEA-CP-001` linear topology for 5–7 persons, all facing north or all facing south;
- typed absolute, end, middle, relative, adjacency, non-adjacency and exact-between constraints;
- hidden-state-first clue derivation;
- constrained clue selection and removal-based minimality pass;
- exact unique raw/semantic model for observer-fixed linear rows;
- production backtracking solver and independently coded Heap-permutation oracle;
- three-child passage assembly using three distinct query contracts;
- semantically unique four-option questions with method-derived misconceptions;
- proof events, student-facing arrangement explanation and text diagram;
- deterministic foundation proof and seed sweep.

## Named CP-001 blueprint authorities

- `SEA-PBA-001` — end anchor plus linked consecutive block;
- `SEA-PBA-002` — middle anchor plus exact-gap chain;
- `SEA-PBA-003` — two-end constraints plus adjacency elimination;
- `SEA-PBA-004` — negative adjacency plus only-remaining placement.

The master roadmap says Wave 2 should implement five provisional blueprints, but its blueprint inventory lists only the four authorities above for CP-001. The code records this as `SEA-AUTH-DISC-001` and does not invent a fifth authority.

## Run proof

```bash
node --experimental-strip-types foundation-proof.test.ts
```

## Lifecycle

This branch is internal executable discovery only:

```text
Permanent QLs:                0
Question Studio public view:  false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

Do not bypass `assertSea001ActivationAllowed`. Solve-inventory, query-mix, editorial, localisation and product gates must be approved separately.
