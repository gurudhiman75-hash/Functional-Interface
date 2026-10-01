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

- deterministic 6–7 person circular arrangements with centre/outward mixed facings;
- known-facing, inferred-facing, opposite/gap and conditional-orientation blueprint families;
- complete solution state includes both clockwise order and person facing;
- reference-person-facing left/right semantics;
- independent production solver and oracle;
- every displayed clue is sensitivity-bearing;
- four-child caselets with distinct answer-determining facts;
- wrong-facing counterfactual metadata for misconception validation;
- 48-caselet English review export.

Named authorities: `SEA-PBA-017` through `SEA-PBA-020`.

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
```

## Current audit status

SEA-001 content deep audit is closed under `SEA-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md`.

Permanent QLs remain:

- `SEA-QL-001` — endpoint identification;
- `SEA-QL-002` — person at relative position;
- `SEA-QL-003` — describe relative position / definitely-true relation shell;
- `SEA-QL-004` — immediate-neighbour pair;
- `SEA-QL-005` — linear number-between;
- `SEA-QL-006` — directional circular number-between;
- `SEA-QL-007` — opposite person;
- `SEA-QL-008` — directional sequence;
- `SEA-QL-009` — facing-state resolution.

Frozen multilingual authority:

- English: 324 reviewed items;
- Hindi: 324 parity-locked native items;
- Punjabi: 324 parity-locked native items;
- blueprint authorities: 20 / 20;
- permanent QLs: 9 / 9;
- difficulty: structural `EASY / MEDIUM / HARD`;
- solved diagrams: `EXPLANATION_ONLY`;
- untranslated Latin prose in Hindi/Punjabi learner surfaces: 0.

SEA-001 is registered in the normal Question Studio workflow through
`SEA_001_QUESTION_STUDIO_REVIEW_V1`. The current adapter deliberately exposes
the frozen multilingual review pool; it does not claim learner-release authority.

SEA-002 and SEA-003 remain the owners for parallel rows, polygonal/multi-ring seating, attribute-linked seating, vacancies and other advanced families.

## Lifecycle

```text
Permanent QLs:                9
Permanent range:              SEA-QL-001..009
English freeze:               FROZEN
Hindi/Punjabi freeze:         FROZEN
Question Studio registered:   true
Question Studio mode:         REVIEW_ONLY
Question Bank writes:         false
Test/mock eligibility:        false
Public publication:           false
Automatic student release:    false
```

`assertSea001ActivationAllowed` continues to block downstream learner-delivery activation. Question Studio registration authorizes review only.
