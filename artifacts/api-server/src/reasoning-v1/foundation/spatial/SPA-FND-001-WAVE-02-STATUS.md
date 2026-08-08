# SPA-FND-001 Wave 02 — Seeded Mirror/Water Proof

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

This wave is stacked on the validated visual foundation. It remains prototype evidence only and does not allocate permanent Question Logic IDs.

## Implemented

- deterministic string-seed hashing and xorshift generation;
- deterministic integer selection, pooling and Fisher–Yates option shuffling;
- seeded asymmetric geometric-composition construction;
- retry-based rejection of invalid or symmetric source scenes;
- separate `MIR-001` and `WAT-001` prototype wrappers;
- vertical-reflection Mirror authority;
- horizontal-reflection Water authority;
- independently computed correct scene;
- misconception-owned distractors:
  - axis confusion;
  - 180-degree rotation substituted for reflection;
  - partial reflection of only the distinguishing marker;
- pre-option semantic collision rejection;
- structured solver evidence;
- three-step explanation evidence:
  - observe axis;
  - apply coordinate reflection;
  - verify option and reject traps;
- deterministic sanitised SVG proof for every source and option scene.

## Initial proof corpus

```text
Mirror Images: 12
Water Images:   8
Total:         20
Correct slots: A5 / B5 / C5 / D5
```

Every question has:

- one asymmetric source scene;
- four semantically distinct options;
- one and only one true requested reflection;
- three named misconception options;
- deterministic regeneration from the same seed;
- no permanent QL;
- no Question Studio discovery;
- no Question Bank or test eligibility.

## Explicitly deferred

- production exam checkpoint design;
- glyph and digit question corpora;
- analog-clock proof questions;
- learner-facing final English explanation rendering;
- Hindi/Punjabi content;
- Question Studio integration;
- remaining Figure Analogy, Classification and Series proof questions;
- full 48-question cross-chapter runtime proof.

## Expected proof statuses

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
```
