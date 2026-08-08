# MEN-CP-011 — Current Chapter-Wide Coverage and English Audit

## Status

```text
Audit authority:              MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V4
Permanent QLs:                0
English freeze:               not granted
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
```

The executable V4 audit derives evidence from every currently implemented MEN-CP-011 review generator. It replaces the 20-family V3 snapshot after adding open-container sheet cost and inner-lining cost.

## Current executable boundary

The chapter now contains 22 direct review-only runtime families across eight executable waves:

```text
Pipe material and inverse core:        4
Hollow-pipe surface exposure:          6
Open-cylinder exposure:                2
Additional pipe inverses:              2
Hollow cube and cuboid:                 2
Spherical and hemispherical shells:     2
Joined and placed hidden faces:         2
Open-sheet and inner-lining cost:       2
Total direct runtime families:         22
```

The direct open-top cuboid sheet-area candidate remains owned by the existing `MEN-CP-007 / MEN-CP007-PROT-OPEN-TOP-BOX-AREA` authority and is not duplicated.

## V4 review matrix

```text
Pipe material and inverse core:       48
Pipe surface exposure:                72
Open-cylinder exposure:               32
Inverse thickness and length:         32
Hollow cube and cuboid:               32
Spherical and hemispherical shells:   48
Joined and placed hidden faces:       32
Cost and inner lining:                32
Total:                               328
Correct positions:                   A82 B82 C82 D82
Direct runtime families:              22
```

The audit requires:

- 328 unique exact stems;
- 328 unique stem-and-option packages;
- four unique options and one correct answer per item;
- independent mathematical verification for every item;
- three natural wrong-option explanations per item;
- complete learner/admin rendering separation;
- all discovery lifecycle locks;
- technically clean learner MathJax and prose.

## Coverage progress against the initial 20 candidates

```text
Implemented, equivalent or correctly reassigned: 18 / 20
Still missing:                                  2 / 20
```

The remaining initial candidates are:

```text
MEN-CP011-PROT-MATERIAL-VOLUME-RATIO
MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE
```

The pipe-length inverse remains an additional discovered family beyond the original 20-candidate list.

## Cost coverage added in V4

### Open-container sheet cost

```text
sheet area = 2πrh + πr² = πr(2h+r)
sheet cost = sheet area × rate per m²
```

The top is open and contributes zero material area.

### Inner-lining cost

```text
lining area = inner curved wall + inner bottom
lining cost = lining area × rate per m²
```

The open mouth is absent and receives no lining.

Both cost families use exact declared numeric π policies (`22/7` and `3.14 = 157/50`) and exact rupee answers.

## Coverage verdict

Covered:

- hollow-pipe material volume, inverse radius, thickness and length;
- inner, outer, combined and annular-end pipe surfaces;
- one-end-open and both-ends-open cylinders;
- hollow cube and hollow cuboid material volume;
- spherical and hemispherical shell material volume;
- joined cubes and floor-placed cuboid hidden-face exposure;
- open-container sheet cost and inner-lining cost;
- centimetre, metre and mixed-unit profiles where applicable;
- exact π, declared `22/7` and declared `3.14 = 157/50`;
- prompt/solution diagram separation and learner/admin isolation.

Still missing:

- material-volume ratio and percentage-change applications;
- conical shells as an additional discovery axis;
- direct source normalisation and neighbouring-CP ownership closure;
- human English approval and permanent-family merge/split decisions.

Therefore `CHAPTER_COVERAGE_INCOMPLETE` remains active.

## English verdict

The V4 audit checks the complete current corpus for malformed TeX, unbalanced delimiters, learner-visible internal codes, duplicate stems/packages, option defects, missing wrong-option explanations, lifecycle leakage and learner/admin surface leakage.

Automated technical cleanliness does not grant final SSC/banking editorial approval. Human review remains required for real-exam naturalness, stem economy, option plausibility, explanation usefulness, terminology, difficulty, context variety and final permanent QL compression.

English remains **unfrozen**.

## Audit artifacts

The workflow produces:

```text
men-cp011-chapter-wide-english-audit.log
men-cp011-chapter-wide-english-audit.json
men-cp011-chapter-wide-english-review.md
```

The JSON artifact contains all 328 review rows. The Markdown artifact records the coverage ledger and representative evidence from all 22 runtime families.

## Active blockers

```text
CHAPTER_COVERAGE_INCOMPLETE
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

No permanent QL allocation, localisation, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised.

## Recommended next implementation order

1. Material-volume ratio and percentage-change families.
2. Conical-shell ownership and executable discovery.
3. Direct source normalisation and chapter-wide ownership audit.
4. Human English review, compression and only then permanent QL allocation.
