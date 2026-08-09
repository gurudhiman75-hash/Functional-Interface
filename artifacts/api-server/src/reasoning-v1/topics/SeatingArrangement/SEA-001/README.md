# SEA-001 — Linear and Circular Seating Foundations

Executable discovery implementation governed solely by **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

## Implemented checkpoints

### `SEA-CP-001` — Single row, same facing

- 5–7 persons, all north or all south;
- typed end, middle, relative, adjacency and exact-gap constraints;
- deterministic hidden-state-first generation;
- production solver plus independent permutation oracle;
- three-child caselets, method-derived options, explanations and row diagrams.

Named authorities: `SEA-PBA-001` through `SEA-PBA-004`.

### `SEA-CP-003` — Circular, facing centre

- deterministic 6–10 person centre-facing circles;
- guarded odd 7/9 variants with no opposite clue or query;
- clockwise/anticlockwise, centre-facing left/right, adjacency, opposite and directional-gap constraints;
- rotational solution-class canonicalisation;
- explicit entrance/stage/door landmark anchoring only for `SEA-PBA-012`;
- production person-assignment solver plus independently structured seat-filling oracle;
- four-child passages using at least four distinct query contracts;
- child-position answer-distribution proof;
- SVG and text cyclic diagrams;
- 48-caselet JSON/CSV/HTML English review export.

Named authorities:

- `SEA-PBA-009` — centre-facing opposite-anchor cycle;
- `SEA-PBA-010` — centre-facing linked clockwise block;
- `SEA-PBA-011` — centre-facing gap and adjacency mix;
- `SEA-PBA-012` — centre-facing external-landmark anchor with elimination.

## Wave 4 verification hardening

Completed verification contracts include:

- generic production-model/independent-oracle agreement;
- entity-renaming, clue-order, rotation and supportive-clue metamorphic proofs;
- displayed-clue sensitivity checks;
- independent option-misconception recomputation;
- locked parent/child Question Studio projection;
- proof-event-based teaching-trace compilation;
- dedicated CI proof and evidence record.

## Run proofs

```bash
node --experimental-strip-types foundation-proof.test.ts
node --experimental-strip-types cp003-proof.test.ts
node --experimental-strip-types wave4-verification-proof.test.ts
```

## Generate CP-003 review evidence

```bash
SEA_CP003_REVIEW_OUTPUT_DIR=./dist/sea-cp003-review \
  node --experimental-strip-types cp003-review-export.ts
```

## Next authority wave

Wave 5 completes `SEA-001` in this order:

1. `SEA-CP-002` — single-row mixed facing;
2. `SEA-CP-004` — circular, facing outward;
3. `SEA-CP-005` — circular, mixed facing.

Full saturation, manual English review, merge/split/inverse/gap audits, permanent allocation and English freeze remain later Wave 5 gates.

## Lifecycle

This package remains internal executable discovery only:

```text
Permanent QLs:                0
Question Studio public view:  false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

Do not bypass `assertSea001ActivationAllowed`. Remaining SEA-001 checkpoints, source and gap audits, manual freezes and product approvals remain mandatory.
