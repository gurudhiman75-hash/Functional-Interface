# SPA-FND-001 — FSR-001 Figure Series Proof

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_PROOF_AND_VISUAL_REVIEW`

FSR-001 is stacked on the user-approved Primitive Retrofit + FCL V2 exact head. It consumes Spatial Primitive Library V2 without allocating permanent QLs.

## Controlled proof corpus

```text
Questions:       10
Correct slots:   A3 / B3 / C2 / D2
Answer sequence: A B C D A B C D A B
```

Rule coverage:

1. main figure rotates 90° clockwise;
2. main figure rotates 90° anticlockwise;
3. main figure rotates 180°;
4. black marker moves clockwise;
5. black marker moves anticlockwise;
6. dot group moves clockwise;
7. dot group moves anticlockwise;
8. dot count increases by one;
9. main figure rotates clockwise while marker moves anticlockwise;
10. main figure rotates anticlockwise while dot group moves clockwise.

Representative V2 primitives include `L_SHAPE`, `ARROW_RIGHT`, `SEMICIRCLE`, `CIRCLE`, `SQUARE`, `DIAMOND`, `CHEVRON_RIGHT` and `T_SHAPE`.

## Safety architecture

- every question shows four observed frames and asks for the fifth;
- the intended rule must be the only rule in the FSR rule authority that reproduces all observed visible transitions;
- rule inference compares rendered semantic scene fingerprints, so hidden state cannot create false uniqueness;
- each observed transition is independently checked against rendered geometry:
  - main-figure rotation is recomputed through the shared affine transform engine;
  - marker motion is recovered from rendered marker coordinates;
  - dot-group motion is recovered from rendered dot centroids;
  - dot-count change is counted from rendered nodes;
- presentation profiles physically omit irrelevant markers or dots;
- every answer set has four visually unique options;
- distractors own visible misconceptions such as wrong rotation direction, opposite movement, no change and partial compound application.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

Required proof marker:

`PASS_SPA_FND_001_FSR_001_PROOF`

Merge, localisation, production synthesis and publication remain unauthorized.
