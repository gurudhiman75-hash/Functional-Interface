# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V6
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

The executable V6 audit derives evidence from every currently implemented MEN-CP-011 review generator. It replaces the 24-family V5 snapshot after adding explicit-inner and declared-similar conical material-volume families.

## Current executable boundary

The chapter now contains 26 direct review-only runtime families across ten executable waves:

```text
Pipe material and inverse core:         4
Hollow-pipe surface exposure:           6
Open-cylinder exposure:                 2
Additional pipe inverses:               2
Hollow cube and cuboid:                  2
Spherical and hemispherical shells:      2
Joined and placed hidden faces:          2
Open-sheet and inner-lining cost:        2
Material ratio and percentage change:    2
Conical material volume:                 2
Total direct runtime families:          26
```

The direct open-top cuboid sheet-area candidate remains owned by `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` and is not duplicated.

## V6 review matrix

```text
Pipe material and inverse core:        48
Pipe surface exposure:                 72
Open-cylinder exposure:                32
Inverse thickness and length:          32
Hollow cube and cuboid:                32
Spherical and hemispherical shells:    48
Joined and placed hidden faces:        32
Cost and inner lining:                 32
Material ratio and percentage change:  32
Conical material volume:               48
Total:                                408
Correct positions:                    A102 B102 C102 D102
Direct runtime families:               26
```

The audit requires:

- 408 unique exact stems;
- 408 unique stem-and-option packages;
- four unique options and one correct answer per item;
- independent mathematical verification for every item;
- three natural wrong-option explanations per item;
- complete learner/admin rendering separation;
- all discovery lifecycle locks;
- technically clean, balanced and non-nested learner MathJax.

## Initial 20-candidate architecture status

```text
Implemented, equivalent or correctly reassigned: 20 / 20
Unresolved initial candidates:                    0 / 20
```

Additional discovered families now include pipe-length inverse and two conical material-volume relations. Completing the initial list and adding these discoveries does not itself grant chapter freeze.

## Conical ownership boundary

The merged conical ownership audit establishes:

```text
Direct intact cone measurement/canvas: MEN-CP-008
Frustum or truncated cone:              MEN-CP-010
Explicit inner–outer conical shell:     MEN-CP-011
Recasting or conservation:              MEN-CP-012
Composite drilled conical void:         MEN-CP-013
Ambiguous or invalid geometry:          REJECT_UNDERSPECIFIED
```

A single scalar cone thickness must never silently produce both `r = R − t` and `h = H − t`.

## Conical material coverage added in V6

### Explicit inner conical cavity

The canonical state supplies outer radius and height, inner radius and height, shared base-plane topology and common axis. The solver uses:

```text
Vmaterial = (1/3)π(R²H − r²h)
```

The inner dimensions are read directly; no thickness relation is invented.

### Declared similar-wall cavity

The canonical state declares an exact linear scale `k = p/q` and verifies:

```text
r = kR
h = kH
```

The ordinary outer-minus-inner method is checked independently through:

```text
Vmaterial = Vouter(1 − k³)
```

The relationship is explicit in the state, stem, diagram and explanation.

## Coverage verdict

Covered:

- hollow-pipe material volume, inverse radius, thickness and length;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- joined cubes and floor-placed cuboid hidden-face exposure;
- open-container sheet cost and inner-lining cost;
- material-volume ratio and percentage-change applications;
- explicit-inner and declared-similar hollow-cone material volume;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π, declared `22/7` and declared `3.14 = 157/50`;
- prompt/solution diagram separation and learner/admin isolation.

Still pending before chapter freeze:

- conical-shell curved-area and shell-derived inner-lining-cost families;
- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions;
- permanent QL allocation and multilingual parity proof.

The chapter therefore remains **not frozen**.

## English verdict

The V6 audit checks the complete current corpus for malformed TeX, nested or unbalanced MathJax, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness does not grant final SSC/banking editorial approval. Human review remains required for real-exam naturalness, stem economy, option plausibility, explanation usefulness, terminology consistency, difficulty calibration, context variety and final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The workflows produce:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
men-cp011-conical-material-wave01.test.log
men-cp011-conical-material-wave01-review.log
men-cp011-conical-material-wave01-review.json
men-cp011-conical-material-wave01-review.md
```

The chapter-wide JSON artifact contains all 408 review rows. The dedicated conical-material artifact contains the balanced 48-record slice and its 384-package proof log.

## Active blockers

```text
CONICAL_SURFACE_AND_COST_FAMILIES_PENDING
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Conical-shell curved-area and shell-derived inner-lining-cost families.
2. Direct source normalisation and chapter-wide ownership audit.
3. Human English review and permanent-family compression.
4. Permanent QL allocation, localisation and multilingual parity proof.
