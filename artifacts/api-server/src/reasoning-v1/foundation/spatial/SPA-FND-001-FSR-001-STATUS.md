# SPA-FND-001 — FSR-001 Figure Series Proof

## Status

`FSR_001_IMPLEMENTATION_AND_VISUAL_PROOF_PASSED_AWAITING_USER_APPROVAL`

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

Representative V2 primitives include `L_SHAPE`, `ARROW_RIGHT`, `SEMICIRCLE`, `CIRCLE`, `PENTAGON`, `V_SHAPE`, `DIAMOND`, `CHEVRON_RIGHT` and `T_SHAPE`.

## Safety architecture

- every question shows four observed frames and asks for the fifth;
- the intended rule must be the only presentation-compatible rule in the FSR rule authority that reproduces all observed visible transitions;
- rule inference compares rendered semantic scene fingerprints, so hidden state cannot create false uniqueness;
- a candidate rule is excluded when it requires a marker or dot role that is not visible in that question;
- each observed transition is independently checked against rendered geometry:
  - main-figure rotation is recomputed through the shared affine transform engine;
  - marker motion is recovered from rendered marker coordinates;
  - dot-group motion is recovered from rendered dot centroids;
  - dot-count change is counted from rendered nodes;
- presentation profiles physically omit irrelevant markers or dots;
- every answer set has four visually unique options;
- distractors own visible misconceptions such as wrong rotation direction, opposite movement, no change and partial compound application;
- learner explanations describe the visible pattern, apply the next step and explicitly evaluate A, B, C and D.

## Self-review corrections

The first two technically failing FSR runs were retained as useful negative evidence rather than bypassed.

### Hidden-role inference

The first run rejected Q1 because a rotation-only series was also explainable internally as rotation plus movement of a hidden marker. The inference boundary was corrected so a rule can be considered only when all visual roles it requires are actually present.

### Rotationally symmetric stimulus ambiguity

The next run rejected Q5 because a square makes `MOVE_MARKER_CCW` visually indistinguishable from `ROTATE_90_CW_MOVE_MARKER_CCW`. The same defect would have affected the clockwise dot-motion example using a circle.

The proof corpus was therefore corrected before acceptance:

```text
Q5 marker-only stimulus: SQUARE -> PENTAGON
Q6 dot-only stimulus:    CIRCLE -> V_SHAPE
```

These orientation-sensitive primitives make an unintended extra 90° rotation visibly detectable.

### Learner explanation remediation

The first green artifact used a generic final sentence for distractor rejection. This was superseded. Every final explanation now names and evaluates all four actual answer choices.

## Validated implementation proof

```text
Implementation head: 4ac50c27734b796eb17784e4ead248004ae09d34
Workflow:            Validate SPA-FND-001 FSR-001 proof
Run:                 31462027618 — PASS
Artifact:            spa-fsr-001-editorial-review
Artifact ID:         9090133119
Digest:              sha256:ab7e12f4bcd36fc7b27948093b735c1612723619397a8e9fd9f2e6ed3f512ac3
Status:              PASS_SPA_FND_001_FSR_001_PROOF
```

Passed regression layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2
PASS_SPA_FND_001_PRIMITIVE_RETROFIT_FCL_V2
PASS_SPA_FND_001_FSR_001_PROOF
```

## Manual visual and editorial review

The complete ten-question artifact was inspected as desktop contact sheets and again with each frame/option rendered at approximately 75 pixels.

Confirmed:

- Q1: L-shape turns 90° clockwise consistently;
- Q2: arrow turns 90° anticlockwise consistently;
- Q3: semicircle alternates by a complete 180° turn;
- Q4: marker alone moves clockwise around a fixed circle;
- Q5: marker alone moves anticlockwise around a fixed pentagon, with any extra 90° pentagon rotation visibly distinguishable;
- Q6: dot group alone moves clockwise around a fixed V-shape, with any extra 90° V-shape rotation visibly distinguishable;
- Q7: dot group alone moves anticlockwise around the fixed diamond;
- Q8: dot count progresses visibly 1 -> 2 -> 3 -> 4 -> 5;
- Q9: both clockwise chevron rotation and anticlockwise marker movement are required; each partial-rule distractor is visibly incomplete;
- Q10: both anticlockwise T-shape rotation and clockwise dot-group movement are required; each partial-rule distractor is visibly incomplete;
- all option sets remain distinct and readable at the small review size;
- all final learner explanations match the rendered series and actual A-D choices.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

This status update is documentation-only relative to the validated implementation head. Its resulting exact branch head must pass the same full workflow before FSR-001 is presented for user approval. Merge, localisation, production synthesis and publication remain unauthorized.
