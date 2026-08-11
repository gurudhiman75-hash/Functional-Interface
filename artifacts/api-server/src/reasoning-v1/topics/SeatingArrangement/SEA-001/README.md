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

### `SEA-CP-002` — Single row, mixed facing

- deterministic 6–8 person rows with genuinely mixed north/south facings;
- complete solution state includes both seat order and each person's facing;
- person-relative left/right always uses the reference person's facing;
- stated-facing and inferred-facing discovery variants;
- production facing-plus-placement backtracker and independently structured seat-filling oracle;
- every displayed clue is sensitivity-bearing under the unique-state policy;
- four-child passages covering second-left, immediate-right, neighbours and persons-between queries;
- facing-dependent explanations explicitly resolve the reference person's facing;
- physically valid numerical distractors and text row diagrams with facing arrows;
- 48-caselet JSON/CSV/HTML English review export.

Named authorities: `SEA-PBA-005` through `SEA-PBA-008`.

### `SEA-CP-003` — Circular, facing centre

- deterministic 6–10 person centre-facing circles;
- guarded odd 7/9 variants with no opposite clue or query;
- centre-facing left/right, adjacency, opposite and directional-gap constraints;
- rotational solution-class canonicalisation and explicit landmark anchoring;
- independent production solver and oracle;
- four-child passages, SVG/text diagrams and 48-caselet review export.

Named authorities: `SEA-PBA-009` through `SEA-PBA-012`.

### `SEA-CP-004` — Circular, facing outward

- deterministic 6–10 person outward-facing circles;
- outward rule encoded explicitly: left is anticlockwise and right is clockwise;
- separate clue evaluator and independent seat-filling oracle rather than reusing centre-facing direction logic;
- rotational solution classes, even/odd opposite guards and entrance/stage/door landmark variants;
- all four named authorities `SEA-PBA-013` through `SEA-PBA-016`;
- every displayed clue is sensitivity-bearing;
- each caselet contains a child whose answer differs under the incorrect centre-facing rule;
- wrong centre-facing result stored as a reproducible misconception counterfactual;
- four-child passages and 48-caselet JSON/CSV/HTML English review export.

Named authorities:

- `SEA-PBA-013` — outward-facing opposite-anchor cycle;
- `SEA-PBA-014` — outward left/right reversal-intensive chain;
- `SEA-PBA-015` — outward gap and neighbour mix;
- `SEA-PBA-016` — outward external-landmark anchor and reversal.

### `SEA-CP-005` — Circular, mixed facing

- deterministic 6–8 person circles with both centre-facing and outward-facing occupants;
- complete solution state includes rotational seating class plus every person's facing;
- person-relative left/right always uses the reference person's solved facing;
- four named authorities `SEA-PBA-017` through `SEA-PBA-020` covering stated facing, inferred facing, opposite/gap and conditional-orientation rings;
- production facing-plus-placement solver and an independently structured seat-filling oracle;
- strict rejection of accidental alternate-facing models;
- every displayed clue is sensitivity-bearing after generator-level clue minimisation;
- odd circles structurally prohibit opposite clues and opposite-seat child queries;
- facing-sensitive child questions store a reproducible opposite-facing counterfactual that must change the answer;
- four-child passages and 48-caselet JSON/CSV/HTML English review export.

Named authorities:

- `SEA-PBA-017` — mixed-facing known-direction ring;
- `SEA-PBA-018` — mixed-facing inferred-direction ring;
- `SEA-PBA-019` — mixed-facing opposite and gap chain;
- `SEA-PBA-020` — mixed-facing conditional orientation.

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
node --experimental-strip-types cp002-proof.test.ts
node --experimental-strip-types cp003-proof.test.ts
node --experimental-strip-types cp004-proof.test.ts
node --experimental-strip-types cp005-proof.test.ts
node --experimental-strip-types wave4-verification-proof.test.ts
```

## Generate English review evidence

```bash
SEA_CP002_REVIEW_OUTPUT_DIR=./dist/sea-cp002-review \
  node --experimental-strip-types cp002-review-export.ts

SEA_CP003_REVIEW_OUTPUT_DIR=./dist/sea-cp003-review \
  node --experimental-strip-types cp003-review-export.ts

SEA_CP004_REVIEW_OUTPUT_DIR=./dist/sea-cp004-review \
  node --experimental-strip-types cp004-review-export.ts

SEA_CP005_REVIEW_OUTPUT_DIR=./dist/sea-cp005-review \
  node --experimental-strip-types cp005-review-export.ts
```

## Remaining Wave 5 closure

All five executable SEA-001 checkpoints are now implemented. The package is **not yet frozen or product-active**.

Remaining Wave 5 gates are:

- full blueprint/query saturation and residual coverage audit;
- manual English review of the generated caselet corpus;
- merge/split, inverse and gap audits;
- permanent QL allocation only after discovery freeze;
- English freeze records.

Only after those gates pass can SEA-001 be considered technically/editorially frozen under the master authority.

## Lifecycle

This package remains internal executable discovery only:

```text
Permanent QLs:                0
Question Studio public view:  false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

Do not bypass `assertSea001ActivationAllowed`. Remaining SEA-001 saturation, source/gap audits, manual freezes and product approvals remain mandatory.
