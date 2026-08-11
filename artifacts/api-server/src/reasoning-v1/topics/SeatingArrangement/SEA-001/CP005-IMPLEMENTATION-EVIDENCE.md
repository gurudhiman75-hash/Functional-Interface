# SEA-001 / SEA-CP-005 — Circular Mixed Facing: Implementation Evidence

## Authority

Implemented solely under the merged V3 Seating Arrangement master design.

```text
Checkpoint:          SEA-CP-005 — Circular, Mixed Facing
Package:             SEA-001 — Linear and Circular Seating Foundations
Difficulty floor:    Medium
Permanent QLs:       0
Lifecycle:           internal executable discovery only
```

Named provisional blueprint authorities implemented:

- `SEA-PBA-017` — mixed-facing known-direction ring;
- `SEA-PBA-018` — mixed-facing inferred-direction ring;
- `SEA-PBA-019` — mixed-facing opposite and gap chain;
- `SEA-PBA-020` — mixed-facing conditional orientation.

## Correctness contracts

- Every model contains both centre-facing and outward-facing persons.
- Facing assignment is part of the solved state, not decorative metadata.
- Person-relative left/right always uses the **reference person's** solved facing.
- Centre-facing: left = clockwise, right = anticlockwise.
- Outward-facing: left = anticlockwise, right = clockwise.
- Ordinary CP-005 caselets require exactly one circular arrangement/facing state up to rotation.
- Production solving and an independently structured seat-filling oracle must return identical canonical model keys.
- Every displayed clue is sensitivity-bearing: removing it must destroy the unique-state outcome.
- Odd circles structurally forbid opposite clues and opposite-seat questions.
- `SEA-PBA-020` uses a typed facing-conditional orientation clue; it is not a free-form conditional sentence.

## Query and option evidence

Each generated passage contains four children across distinct answer-determining facts:

- `SEA-QC-003` — second left of a named reference person;
- `SEA-QC-005` — immediate right of a named reference person;
- `SEA-QC-006` — immediate neighbours;
- `SEA-QC-010` — opposite occupant on even circles, or `SEA-QC-020` clockwise sequence on odd circles.

The first two questions store and verify an explicit **opposite-facing counterfactual**. The counterfactual must differ from the correct answer, proving that the question genuinely tests the reference person's facing rather than a facing-insensitive fact.

All options are semantically fingerprinted, exactly one is correct, and distractors are derived from reproducible misconception recomputations.

## Executable proof

Default command:

```bash
node --experimental-strip-types cp005-proof.test.ts
```

Default proof volume:

```text
Blueprints:                         4
Caselets per blueprint:           100
Total deterministic caselets:     400
Child questions per caselet:        4
Total child questions:            1600
Facing-sensitive child questions:  800
```

The proof also replays every seed deterministically, checks every displayed clue for necessity, audits odd-seat opposite guards, checks blueprint signatures, and requires all four answer positions to be reachable independently at each child position.

## English review evidence

```bash
SEA_CP005_REVIEW_OUTPUT_DIR=./dist/sea-cp005-review \
  node --experimental-strip-types cp005-review-export.ts
```

The review export contains 48 caselets (12 per named blueprint authority) in JSON, CSV and HTML, including solved facing labels, child explanations and opposite-facing counterfactuals.

## Lifecycle

CP-005 completion does **not** allocate permanent QLs or activate product delivery.

```text
Permanent QLs:                0
Question Studio public view:  false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

SEA-001 still requires package-level saturation, English manual review, merge/split/inverse/gap audits, permanent QL allocation and English freeze before any later product gate can open.
