# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V2
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

This document supersedes the original pipe-core-only V1 snapshot. The executable V2 audit derives its evidence from every currently implemented MEN-CP-011 review generator rather than relying on historical hard-coded totals.

## Current executable boundary

The chapter now contains 18 direct review-only runtime families across six executable waves.

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

The direct open-top cuboid sheet-area candidate is not duplicated. It remains owned by the existing `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` authority.

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

## V2 review matrix

The current executable audit constructs 264 records:

```text
Pipe material and inverse core:       48
Pipe surface exposure:                72
Open-cylinder exposure:               32
Inverse thickness and length:         32
Hollow cube and cuboid:               32
Spherical and hemispherical shells:   48
Total:                               264
Correct positions:                   A66 B66 C66 D66
Direct runtime families:              18
```

The audit requires:

- 264 unique exact stems;
- 264 unique stem-and-option packages;
- four unique options and one correct answer per item;
- independent mathematical verification for every item;
- three natural wrong-option explanations per item;
- complete learner/admin rendering separation;
- all discovery lifecycle locks;
- technically clean learner MathJax and prose.

## Coverage progress against the initial 20 candidates

```text
Implemented, equivalent or correctly reassigned: 14 / 20
Still missing:                                  6 / 20
```

The remaining initial candidates are:

```text
MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA
MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA
MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST
MEN-CP011-PROT-INNER-LINING-COST
MEN-CP011-PROT-MATERIAL-VOLUME-RATIO
MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE
```

The pipe-length inverse is an additional discovered family beyond the original 20-candidate architecture list.

## Coverage verdict

Covered:

- hollow-pipe material volume and inverse inner radius;
- pipe thickness and length inverses;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π and declared `22/7` arithmetic;
- declared `π = 3.14`, represented exactly as `157/50`, in the shell slice;
- prompt/solution diagram separation and learner/admin isolation.

Still missing:

- joined and placed solids with hidden contact faces;
- conical shells as an additional discovery axis;
- sheet cost, lining cost, rates, counts, ratios and percentage-change applications;
- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions.

Therefore `CHAPTER_COVERAGE_INCOMPLETE` remains active.

## English verdict

The V2 audit checks the complete current corpus for malformed TeX, unbalanced delimiters, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness is necessary but does not itself prove final SSC/banking editorial quality. Human review remains required for:

- real-exam naturalness;
- stem economy and clarity;
- option plausibility;
- explanation usefulness;
- terminology consistency;
- difficulty calibration;
- context variety;
- final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The current workflow produces:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
```

The JSON artifact contains all 264 review rows. The Markdown artifact records the current verdict, coverage ledger and representative evidence from all 18 runtime families.

## Active blockers

```text
CHAPTER_COVERAGE_INCOMPLETE
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Joined cubes and placed-cuboid hidden-face exposure.
2. Open-container sheet cost and inner-lining cost.
3. Material-volume ratio and percentage-change families.
4. Conical-shell ownership and executable discovery.
5. Direct source normalisation and chapter-wide ownership audit.
6. Human English review, compression and only then permanent QL allocation.
