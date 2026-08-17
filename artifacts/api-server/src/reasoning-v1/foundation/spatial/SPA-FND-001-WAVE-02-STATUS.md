# SPA-FND-001 Wave 02 — Seeded Mirror/Water Proof

## Status

`EXACT_HEAD_CI_PASSED`

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
Unique sources: 20
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

## Exact-head validation

```text
Workflow: Validate SPA-FND-001 Mirror Water proof
Run:      31237414816
Result:   PASS
```

Passed proof statuses:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
```

The workflow built the API server, reran the complete foundation regression proof, bundled the seeded corpus proof and executed all 20 questions successfully.

## Additive Primitive Library V2 enhancement

A later descendant branch does **not** replace this approved 20-question baseline. It adds a reusable canonical-primitive instance layer and exposes a 17-primitive MIR/WAT eligibility pool.

Controlled descendant proof adds:

```text
MIR-001 V2 examples: 4
WAT-001 V2 examples: 4
```

The examples include open figures, polygons, an arrow, a semicircle and a spoke structure. Correct Mirror and Water scenes are independently recomputed from the canonical primitive geometry, and every four-option set is semantic-fingerprint unique.

The validated descendant implementation proof is recorded in `SPA-FND-001-PRIMITIVE-RETROFIT-FCL-V2-STATUS.md`. This note is additive historical linkage only; the original Wave 02 status above remains unchanged.

## Explicitly deferred

- production exam checkpoint design;
- learner-facing final English explanation rendering;
- Hindi/Punjabi content;
- Question Studio integration;
- full production-scale spatial synthesis.
