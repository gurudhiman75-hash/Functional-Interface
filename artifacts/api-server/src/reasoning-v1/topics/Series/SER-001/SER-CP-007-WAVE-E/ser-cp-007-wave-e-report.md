# SER-CP-007 Wave E — moving markers and positional substitution

## Result

```text
Status:                       PASS_SER_CP007_WAVE_E_MARKER_AND_POSITIONAL_SUBSTITUTION_DISCOVERY
Source-shaped probes:         9
Canonical authorities in pool: 3
New provisional authorities:  2
Temporary templates:         36
Seeds per template:         120
Generated questions:      4,320
Permanent QLs:                0
```

## Source-backed candidate result

Wave E retains two new provisional solve authorities:

```text
MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
PROGRESSIVE_POSITIONAL_SUBSTITUTION
```

The first covers a single marker, a multi-letter marker block, case-state markers, fixed edge tokens, multiple movement directions, step sizes and wrap/non-wrap domains over fixed or periodic frames.

The second covers fixed-width replacement in which the boundary between a source pattern and a target pattern moves progressively from the left or right.

## Collision result

The uniform `X/x` moving-marker surface is not retained as a second authority:

```text
UNIFORM_FRAME_CASE_MARKER_ROTATION
  -> CYCLIC_CLUSTER_PERMUTATION
```

For all 480 questions from that probe, independent inference proves both the moving-marker description and a whole-token cyclic rotation. The existing cyclic authority therefore owns the surface.

The retained marker and substitution families pass negative collision proof against:

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
COLUMNWISE_FIXED_CLUSTER_MOVEMENT
COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT
EDGE_DELETION_WORD_SEQUENCE
CUMULATIVE_PREFIX_CLUSTER
PATTERNED_INTERIOR_INSERTION_GROWTH
```

All Wave E terms preserve fixed width, so deletion, insertion and cumulative growth do not own them. Retained marker instances rebuild the non-marker frame rather than applying one repeated complete-token permutation. Positional substitution persistently converts new positions rather than moving one marker.

## Task proof

```text
NEXT_TERM:       1,080
MISSING_TERM:    1,080
PREVIOUS_TERM:   1,080
WRONG_TERM:      1,080
```

Previous-term and interior-missing instances are generated only from reversible bounded parameter sets. Each displayed sequence has one independently recoverable answer under the retained pool.

## Authority proof

```text
MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME: 2,400
PROGRESSIVE_POSITIONAL_SUBSTITUTION:              1,440
CYCLIC_CLUSTER_PERMUTATION collision evidence:      480
```

```text
PROVISIONAL_RETAIN_CP007:             3,840
COLLIDE_EXISTING_CP007_AUTHORITY:       480
```

## Solver and diversity proof

```text
Independent solver proofs:       4,320
Marker reconstruction proofs:    2,880
Substitution reconstruction:     1,440
Rotation collision proofs:         480
Answer positions: [1080, 1080, 1080, 1080]
Difficulty/template: 40 easy / 40 medium / 40 hard
```

Retained templates reach at least 95 distinct mathematical fingerprints across 120 seeds. The intentionally narrow uniform-frame collision probe reaches at least 45 while varying width, direction, start position, task and answer state.

## Learner presentation proof

```text
Exact generated reviews: 4,320
Exported review samples:     72
Choices:                   1–4
A-D option labels:           0
Blocked technical terms:     0
```

Every explanation uses `Rule`, `Solution`, `Quick Method` and `Common Mistake`. Marker explanations show positions explicitly; substitution explanations show the moving boundary and retain constant term width.

## Cross-chapter and lifecycle proof

All questions remain autonomous cluster sequences rather than code mappings, analogy transfers or classification tasks.

```text
Permanent QLs:               0
Question Studio visible:     0
Question Bank writable:      0
Test eligible:               0
Publicly publishable:        0
Localization started:        0
```

## Current boundary

Wave E closes the two source-backed gaps that reopened the Wave-D saturation claim. It does not authorize English freeze by itself.

The chapter must now return to the uploaded references and rerun the source-to-authority and collision ledger with all five waves included.

```text
Next authority: SER_CP007_POST_WAVE_E_SOURCE_LEDGER_AND_COLLISION_AUDIT
```
