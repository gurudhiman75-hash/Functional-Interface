# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V7
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

The executable V7 audit derives evidence from every currently implemented MEN-CP-011 review generator. It replaces the 26-family V6 snapshot after adding conical-shell curved-area and shell-derived inner-lining-cost families.

## Current executable boundary

The chapter now contains 28 direct review-only runtime families across eleven executable waves:

```text
Pipe material and inverse core:          4
Hollow-pipe surface exposure:            6
Open-cylinder exposure:                  2
Additional pipe inverses:                2
Hollow cube and cuboid:                   2
Spherical and hemispherical shells:       2
Joined and placed hidden faces:           2
Open-sheet and inner-lining cost:         2
Material ratio and percentage change:     2
Conical material volume:                  2
Conical curved area and lining cost:      2
Total direct runtime families:           28
```

The direct open-top cuboid sheet-area candidate remains owned by `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` and is not duplicated.

## V7 review matrix

```text
Pipe material and inverse core:         48
Pipe surface exposure:                  72
Open-cylinder exposure:                 32
Inverse thickness and length:           32
Hollow cube and cuboid:                 32
Spherical and hemispherical shells:     48
Joined and placed hidden faces:         32
Cost and inner lining:                  32
Material ratio and percentage change:   32
Conical material volume:                48
Conical curved area and lining cost:    40
Total:                                 448
Correct positions:                     A112 B112 C112 D112
Direct runtime families:                28
```

The audit requires:

- 448 unique exact stems;
- 448 unique stem-and-option packages;
- four unique options and one correct answer per item;
- independent mathematical verification for every item;
- three natural wrong-option explanations per item;
- complete learner/admin rendering separation;
- all discovery lifecycle locks;
- technically clean, balanced and non-nested learner MathJax.

## Architecture and discovery status

```text
Initial candidates implemented, equivalent or reassigned: 20 / 20
Unresolved initial candidates:                              0 / 20
Conical ownership audit:                                   complete
Planned executable conical discovery:                      complete
```

Executable discovery completion does not grant chapter freeze. Source, editorial, compression, localisation and lifecycle gates remain open.

## Conical ownership boundary

```text
Direct intact cone measurement/canvas: MEN-CP-008
Frustum or truncated cone:              MEN-CP-010
Explicit inner–outer conical shell:     MEN-CP-011
Recasting or conservation:              MEN-CP-012
Composite drilled conical void:         MEN-CP-013
Ambiguous or invalid geometry:          REJECT_UNDERSPECIFIED
```

A single scalar cone thickness must never silently produce both `r = R − t` and `h = H − t`.

## Conical executable coverage

### Material volume

Covered through:

```text
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL
```

with:

```text
Vmaterial = (1/3)π(R²H − r²h)
```

and the independent similar-solids check:

```text
Vmaterial = Vouter(1 − k³)
```

### Both curved surfaces

Covered through:

```text
MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES
```

with:

```text
Aboth = πRL + πrl = π(RL + rl)
```

The inner wall is added because both curved surfaces are included.

### Inner lining cost from a shell relation

Covered through:

```text
MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL
```

The state declares exact similarity, verifies `r = kR`, `h = kH`, `l = kL`, and calculates:

```text
Cost = πrl × rate per m²
```

The independent check uses `Ainner = k²Aouter`. A direct one-cone lining problem without an inner–outer relation remains MEN-CP-008.

## Coverage verdict

Executable discovery now covers:

- hollow-pipe material volume, inverse radius, thickness and length;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- joined cubes and floor-placed cuboid hidden-face exposure;
- open-container sheet cost and inner-lining cost;
- material-volume ratio and percentage-change applications;
- explicit-inner and declared-similar hollow-cone material volume;
- both conical curved walls;
- shell-derived inner conical lining cost;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π, declared `22/7` and declared `3.14 = 157/50`;
- prompt/solution diagram separation and learner/admin isolation.

Still pending before chapter freeze:

- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions;
- permanent QL allocation;
- Hindi/Punjabi localisation and multilingual parity proof.

The chapter therefore remains **not frozen**.

## English verdict

The V7 audit checks the complete current corpus for malformed TeX, nested or unbalanced MathJax, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness does not grant final SSC/banking editorial approval. Human review remains required for real-exam naturalness, stem economy, option plausibility, explanation usefulness, terminology consistency, difficulty calibration, context variety and final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The workflows produce:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
men-cp011-conical-surface-cost-wave01.test.log
men-cp011-conical-surface-cost-wave01-review.log
men-cp011-conical-surface-cost-wave01-review.json
men-cp011-conical-surface-cost-wave01-review.md
```

The chapter-wide JSON artifact contains all 448 review rows. The dedicated conical surface/cost artifact contains the balanced 40-record slice and its 256-package proof log.

## Active blockers

```text
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Direct source normalisation and chapter-wide ownership audit.
2. Human English review and permanent-family compression.
3. Permanent QL allocation and English freeze.
4. Hindi/Punjabi localisation and multilingual parity proof.
