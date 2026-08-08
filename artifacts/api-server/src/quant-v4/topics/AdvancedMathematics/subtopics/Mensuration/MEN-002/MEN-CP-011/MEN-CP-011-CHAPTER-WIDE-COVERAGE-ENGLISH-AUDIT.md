# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V3
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

The executable V3 audit derives its evidence from every currently implemented MEN-CP-011 review generator. It replaces the earlier 18-family V2 snapshot after adding joined and placed-solid hidden-face exposure.

## Current executable boundary

The chapter now contains 20 direct review-only runtime families across seven waves.

### Pipe material volume and inverse core — 4 families

```text
MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS
MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS
MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME
```

### Hollow-pipe surface exposure — 6 families

```text
MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA
MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA
MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA
MEN-CP011-PROT-ONE-ANNULAR-END-AREA
MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA
MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA
```

### Open-cylinder exposure — 2 families

```text
MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA
MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA
```

The direct open-top cuboid sheet-area candidate remains owned by the existing `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` authority and is not duplicated.

### Additional pipe inverses — 2 families

```text
MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME
MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME
```

### Hollow rectangular solids — 2 families

```text
MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME
```

### Spherical shells — 2 families

```text
MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME
MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME
```

### Hidden-face exposure — 2 families

```text
MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA
MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA
```

## V3 review matrix

The current executable audit constructs 296 records:

```text
Pipe material and inverse core:       48
Pipe surface exposure:                72
Open-cylinder exposure:               32
Inverse thickness and length:         32
Hollow cube and cuboid:               32
Spherical and hemispherical shells:   48
Joined and placed hidden faces:       32
Total:                               296
Correct positions:                   A74 B74 C74 D74
Direct runtime families:              20
```

The audit requires:

- 296 unique exact stems;
- 296 unique stem-and-option packages;
- four unique options and one correct answer per item;
- independent mathematical verification for every item;
- three natural wrong-option explanations per item;
- complete learner/admin rendering separation;
- all discovery lifecycle locks;
- technically clean learner MathJax and prose.

## Coverage progress against the initial 20 candidates

```text
Implemented, equivalent or correctly reassigned: 16 / 20
Still missing:                                  4 / 20
```

The remaining initial candidates are:

```text
MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST
MEN-CP011-PROT-INNER-LINING-COST
MEN-CP011-PROT-MATERIAL-VOLUME-RATIO
MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE
```

The pipe-length inverse remains an additional discovered family beyond the original 20-candidate list.

## Hidden-face coverage added in V3

### Joined cubes

The runtime covers rows, one-layer rectangular arrangements and three-dimensional blocks. It proves the hidden-contact ledger:

```text
exposed faces = 6N − 2J
```

and independently reconstructs the result from the bounding cuboid:

```text
A = 2a²(xy + yz + zx)
```

### Cuboid placed on a floor

The floor-contact base contributes zero painted area:

```text
painted area = LB + 2LH + 2BH
```

The independent shortcut is total surface area minus one `LB` base.

## Coverage verdict

Covered:

- hollow-pipe material volume, inverse radius, thickness and length;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- joined cubes and floor-placed cuboid hidden-face exposure;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π, declared `22/7` and declared `3.14 = 157/50`;
- prompt/solution diagram separation and learner/admin isolation.

Still missing:

- open-container sheet cost and inner-lining cost;
- material-volume ratio and percentage-change applications;
- conical shells as an additional discovery axis;
- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions.

Therefore `CHAPTER_COVERAGE_INCOMPLETE` remains active.

## English verdict

The V3 audit checks the complete current corpus for malformed TeX, unbalanced delimiters, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness does not by itself grant final SSC/banking editorial approval. Human review remains required for real-exam naturalness, stem economy, option plausibility, explanation usefulness, terminology, difficulty, context variety and final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The workflow produces:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
```

The JSON artifact contains all 296 review rows. The Markdown artifact records the coverage ledger and representative evidence from all 20 runtime families.

## Active blockers

```text
CHAPTER_COVERAGE_INCOMPLETE
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Open-container sheet cost and inner-lining cost.
2. Material-volume ratio and percentage-change families.
3. Conical-shell ownership and executable discovery.
4. Direct source normalisation and chapter-wide ownership audit.
5. Human English review, compression and only then permanent QL allocation.
