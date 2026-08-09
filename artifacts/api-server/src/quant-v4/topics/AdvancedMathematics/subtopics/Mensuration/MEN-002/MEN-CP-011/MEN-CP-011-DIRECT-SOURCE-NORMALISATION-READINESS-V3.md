# MEN-CP-011 — Direct-Source Normalisation Readiness V3

## Status

```text
Authority:                          MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V3
Live runtime families:              28
Attached source references:         15
Direct task matches pending review:  7
Representation-only support:         8
Directly normalised:                 0
Missing direct references:          13
Incomplete attached references:      0
False normalisation claims:           0
Permanent QLs:                        0
Question Studio:               disabled
Question Bank:               NOT_STORED
Test eligibility:             INELIGIBLE
Publication:                       false
```

V3 inherits all 13 traceable V2 source attachments and adds two direct shell exemplars. It does not rewrite or weaken the V2 evidence classification.

## New direct shell exemplars

### Spherical-shell material volume

```text
Prototype: MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME
Source:    Dr. R.S. Aggarwal, Quantitative Aptitude for Competitive Examinations (Fully Solved)
Edition:   Revised and Enlarged Edition 2017; Reprint 2017
ISBN:      978-93-525-3402-9
Chapter:   Volume and Surface Areas
Page:      printed p. 786
Exemplar:  Question 226
Status:    REFERENCE_ATTACHED_PENDING_REVIEW
Match:     DIRECT_TASK_MATCH
```

The exemplar gives the external diameter and uniform thickness of a hollow spherical metallic ball and asks for the volume of metal used. This is the same target and governing outer-minus-inner spherical-volume operation as the runtime family.

### Hemispherical-shell material volume

```text
Prototype: MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME
Source:    Dr. R.S. Aggarwal, Quantitative Aptitude for Competitive Examinations (Fully Solved)
Edition:   Revised and Enlarged Edition 2017; Reprint 2017
ISBN:      978-93-525-3402-9
Chapter:   Volume and Surface Areas
Page:      printed p. 788
Exemplar:  Question 261
Status:    REFERENCE_ATTACHED_PENDING_REVIEW
Match:     DIRECT_TASK_MATCH
```

The exemplar gives the inside radius and uniform thickness of a steel hemispherical bowl and asks for the volume of steel used. This is the same target and governing outer-minus-inner hemispherical-volume operation as the runtime family.

## Why these remain pending

Both entries contain:

- accepted source type;
- stable File Library document identifier;
- title, edition and ISBN;
- chapter;
- printed page;
- exact question locator;
- immutable extract identifier;
- direct-task rationale.

They do not contain:

- a human reviewer identity;
- a source-review timestamp.

The executable gate therefore keeps both entries at:

```text
REFERENCE_ATTACHED_PENDING_REVIEW
```

and rejects any claim of:

```text
DIRECTLY_NORMALISED
```

## Evidence deliberately not promoted

Disha's SSC Mathematics Guide independently confirms the hollow-sphere and hemispherical-bowl formulas. It is retained as supporting formula authority, but V3 uses the stronger R.S. Aggarwal question-level exemplars for the candidate ledger.

No source was promoted for:

- hollow cube or cuboid material volume;
- one-end-open cylindrical exposure;
- cylindrical lining cost;
- hollow-solid ratio or percentage-change tasks;
- conical-shell volume, surfaces or lining cost.

## Lifecycle decision

This source pass does not allocate permanent QLs, freeze English, activate Question Studio, write to the Question Bank, enable tests, localise content or permit publication.
