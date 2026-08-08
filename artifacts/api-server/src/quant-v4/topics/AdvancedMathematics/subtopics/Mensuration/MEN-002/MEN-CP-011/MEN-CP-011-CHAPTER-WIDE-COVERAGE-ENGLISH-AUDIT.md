# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V5
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

The executable V5 audit derives evidence from every currently implemented MEN-CP-011 review generator. It replaces the 22-family V4 snapshot after adding material-volume ratio and percentage-change applications.

## Current executable boundary

The chapter now contains 24 direct review-only runtime families across nine executable waves:

```text
Pipe material and inverse core:        4
Hollow-pipe surface exposure:          6
Open-cylinder exposure:                2
Additional pipe inverses:              2
Hollow cube and cuboid:                 2
Spherical and hemispherical shells:     2
Joined and placed hidden faces:         2
Open-sheet and inner-lining cost:       2
Material ratio and percentage change:   2
Total direct runtime families:         24
```

The direct open-top cuboid sheet-area candidate remains owned by the existing `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` authority and is not duplicated.

## V5 review matrix

```text
Pipe material and inverse core:       48
Pipe surface exposure:                72
Open-cylinder exposure:               32
Inverse thickness and length:         32
Hollow cube and cuboid:               32
Spherical and hemispherical shells:   48
Joined and placed hidden faces:       32
Cost and inner lining:                32
Material ratio and percentage change: 32
Total:                               360
Correct positions:                   A90 B90 C90 D90
Direct runtime families:              24
```

The audit requires:

- 360 unique exact stems;
- 360 unique stem-and-option packages;
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

The pipe-length inverse remains an additional discovered family beyond the original 20-candidate list.

Completing the initial architecture list does not itself grant chapter freeze. Additional discovery, ownership, editorial and lifecycle gates remain active.

## Ratio and percentage coverage added in V5

### Material-volume ratio

For two hollow pipes:

```text
V_A : V_B
= πh_A(R_A²-r_A²) : πh_B(R_B²-r_B²)
= h_A(R_A²-r_A²) : h_B(R_B²-r_B²)
```

The common `π` cancels. Each pipe's own length remains part of its material coefficient.

### Percentage decrease after bore widening

With the outer radius and length fixed:

```text
old coefficient = R²-r_old²
new coefficient = R²-r_new²
percentage decrease = [(old-new)/old] × 100
```

The common `πh` cancels. The lost material coefficient can be computed through the difference-of-squares identity.

## Coverage verdict

Covered within the initial architecture:

- hollow-pipe material volume, inverse radius, thickness and length;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- joined cubes and floor-placed cuboid hidden-face exposure;
- open-container sheet cost and inner-lining cost;
- material-volume ratio and percentage-change applications;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π, declared `22/7` and declared `3.14 = 157/50`;
- prompt/solution diagram separation and learner/admin isolation.

Still pending before chapter freeze:

- conical-shell ownership and safe executable discovery;
- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions;
- permanent QL allocation and multilingual parity proof.

Therefore the broader chapter remains **not frozen** even though the initial 20-candidate architecture is complete.

## English verdict

The V5 audit checks the complete current corpus for malformed TeX, nested or unbalanced MathJax, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness does not grant final SSC/banking editorial approval. Human review remains required for real-exam naturalness, stem economy, option plausibility, explanation usefulness, terminology, difficulty, context variety and final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The workflows produce:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
men-cp011-ratio-percent-wave01-review.log
men-cp011-ratio-percent-wave01-review.json
men-cp011-ratio-percent-wave01-review.md
```

The chapter-wide JSON artifact contains all 360 review rows. The dedicated ratio/percentage artifact contains the balanced 32-record final-wave evidence.

## Active blockers

```text
CONICAL_SHELL_OWNERSHIP_PENDING
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Conical-shell ownership and safe executable discovery.
2. Direct source normalisation and chapter-wide ownership audit.
3. Human English review and permanent-family compression.
4. Permanent QL allocation, localisation and multilingual parity proof.
