# SPA-FND-001 — Production Scale V2

## Status

`REMEDIATED_IMPLEMENTATION_PASSED_AWAITING_EXACT_HEAD_PROOF_AND_USER_APPROVAL`

This slice is stacked on Production Synthesis V1 exact head `0bb9fbe50682b36599852a337cced76c8d1141af`. Production Synthesis V1 remains unmerged and was not reclassified as user-approved by this continuation.

## Goal

Prove that the spatial synthesis architecture can produce a Question-Studio-sized review bank without counting option shuffles, globally rotated copies, machine-only structural differences, or retry luck as new content.

Final stress scale:

```text
FAN-001: 500 unique accepted candidates
FCL-001: 500 unique accepted candidates
FSR-001: 500 unique accepted candidates
Total:   1,500
Correct slots/chapter: A125 / B125 / C125 / D125
```

## FCL capacity expansion

The V1 strict canonical primitive-ID catalog has finite capacity and cannot honestly support a 500-question FCL stress batch. V2 expands only from canonical safe quartets into rendered primitive instances.

Each canonical primitive may contribute only visually distinct quarter-turn instances. A circle or other quarter-turn-invariant primitive therefore remains one visual instance; orientation-sensitive primitives may contribute more.

Every expanded quartet is re-audited using instance-aware vertical/horizontal/180° symmetry plus `VISIBLE_ORIENTATION_CLASS`. A quartet is rejected when a learner could answer it through a simpler three-upright/one-rotated cue or another competing visible minority.

### Global-rotation identity

Rotating all four classification options together does not create a new question. For each candidate quartet, V2 renders common 0°, 90°, 180° and 270° rotations, sorts the option fingerprints and chooses the canonical minimum as `globalRotationOrbitFingerprint`.

FCL content identity includes this orbit fingerprint, so globally rotated copies deduplicate to one content item.

### Perceptual alias remediation

The first technically green 1,500-candidate artifact was **not accepted** after manual review. A branch-junction representative contained two options that were structurally different to the scene graph but too similar at learner scale. Semantic scene fingerprints alone were therefore insufficient as a production uniqueness guarantee.

V2 now adds a vector perceptual similarity layer:

- line/polyline/polygon/circle/arc strokes are sampled into a normalized raster representation;
- node segmentation and minor absolute-size differences do not create artificial visual distance;
- aspect ratio and orientation remain visible;
- Dice/Jaccard overlap is computed pairwise;
- essentially identical silhouettes are rejected regardless of property truth;
- highly similar options with the same intended property value are rejected as same-role near aliases;
- every delivered FCL quartet is independently required to report zero perceptual alias pairs.

The scale target was **not lowered** after adding this stricter gate.

Final strict instance/global-rotation-normalized FCL capacity after perceptual remediation:

```text
Canonical V1 total:         158
Instance V2 total:          980

EVEN_SIDED_POLYGON           14
VERTICAL_SYMMETRY           342
HORIZONTAL_SYMMETRY          36
HALF_TURN_SYMMETRY           12
QUARTER_TURN_SYMMETRY         6
HAS_BRANCH_JUNCTION           10
HAS_TRUE_CROSSING              6
PARTITIONED_FIGURE             2
HALF_TURN_ONLY               112
TWO_FREE_TERMINALS            56
CLOSED_SHAPE                 302
POLYGON                       82
```

Final 500-question FCL allocation remains capacity-aware:

```text
EVEN_SIDED_POLYGON           14
VERTICAL_SYMMETRY            92
HORIZONTAL_SYMMETRY          36
HALF_TURN_SYMMETRY           12
QUARTER_TURN_SYMMETRY         6
HAS_BRANCH_JUNCTION           10
HAS_TRUE_CROSSING              6
PARTITIONED_FIGURE             2
HALF_TURN_ONLY                92
TWO_FREE_TERMINALS            56
CLOSED_SHAPE                  92
POLYGON                       82
```

## FSR scale remediation

The first V2 stress implementation reused random V1 FSR attempts and failed honestly at `480 / 500` after 20,000 attempts. All inherited spatial layers had passed; the failure was isolated to the new scale gate.

That failure was not fixed by raising the retry budget. V2 now compiles the complete safe initial-state catalog for every approved FSR rule using the real series generator, real distractor authority, real presentation profile, scene validation and exact content fingerprinting.

Safe contents are selected deterministically without replacement and family scheduling is capacity-aware. Answer delivery is regenerated at the required A/B/C/D slot and must preserve the same content fingerprint.

Exact FSR safe-state capacities:

```text
ROTATE_90_CW                         48
ROTATE_90_CCW                        48
ROTATE_180                           48
MOVE_MARKER_CW                      192
MOVE_MARKER_CCW                     192
MOVE_DOTS_CW                        768
MOVE_DOTS_CCW                       768
INCREASE_DOTS                       192
ROTATE_90_CW_MOVE_MARKER_CCW        192
ROTATE_90_CCW_MOVE_DOTS_CW          768
Total                              3216
```

This proves why the old equal 50-per-rule strategy could never reach 500: each pure rotation family has only 48 unique validated contents.

Final 500-question FSR allocation:

```text
ROTATE_90_CW                         48
ROTATE_90_CCW                        48
ROTATE_180                           48
MOVE_MARKER_CW                       51
MOVE_MARKER_CCW                      51
MOVE_DOTS_CW                         51
MOVE_DOTS_CCW                        51
INCREASE_DOTS                        51
ROTATE_90_CW_MOVE_MARKER_CCW         51
ROTATE_90_CCW_MOVE_DOTS_CW           50
```

FSR scale selection now completes `500 / 500` with zero duplicate retries and zero generator retries.

## Final implementation-head proof

Implementation head:

`c486e464e8bb045798078090b72e0a94a072d70b`

Workflow:

`Validate SPA-FND-001 Production Scale V2`

Run:

`31499266923` — PASS

Artifact:

```text
Name:   spa-production-scale-v2-review
ID:     9104351620
Digest: sha256:9d7f35578e77b7c328524633fb2bb13bb7df71d4cd85a2552e9999a7f1a0addd
```

Result:

```text
Accepted FAN: 500
Accepted FCL: 500
Accepted FSR: 500
Total:        1500

Attempts FAN/FCL/FSR: 532 / 500 / 500
Duplicate rejects:     32 / 0 / 0
Generator rejects:      0 / 0 / 0
Correct slots/chapter: A125 / B125 / C125 / D125
```

Marker:

`PASS_SPA_FND_001_PRODUCTION_SCALE_V2`

## Manual editorial review

The perceptual-remediated 26-family review was manually checked at approximately 100px desktop/review scale and approximately 74–82px mobile option scale.

Confirmed:

- all four FAN transform families remain complete and visually clear;
- all twelve FCL families show one defensible odd figure with no reviewed perceptual duplicate;
- branch-junction representative is visually distinct as `X / open-U / T / +`, with the open-U alone lacking a branch junction;
- true-crossing representative remains clear as crossing figures versus an arrow junction;
- partition, symmetry, polygon, topology and terminal-count families remain readable at mobile size;
- all ten FSR families are fully visible, including both compound rules;
- marker and dot movements remain legible at mobile size;
- generated review wording matches the rendered rule families.

## Required proof gates

- 500 accepted unique candidates in FAN, FCL and FSR;
- exact A125/B125/C125/D125 balance in every chapter;
- all 26 synthesis families represented;
- deterministic replay from the same seed prefix;
- alternate seed prefix changes delivery;
- FCL instance catalog capacity exceeds the canonical catalog and remains at least 500;
- no duplicate global-rotation-normalized FCL contents;
- instance-level property vector remains exactly 3/1;
- no competing instance descriptor;
- no disallowed student-visible orientation shortcut;
- zero delivered FCL perceptual alias pairs;
- crossing presentation remains free of vertical/horizontal/180° whole-figure symmetry;
- compiled capacity-aware FSR selection with zero retry pressure;
- responsive 26-family editorial review export;
- all prior spatial regression gates;
- lifecycle isolation.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

This slice remains a controlled proof. It does not authorize merge, permanent QL allocation, Question Studio activation, database writes, localisation, mock-test eligibility or publication. User approval remains pending.