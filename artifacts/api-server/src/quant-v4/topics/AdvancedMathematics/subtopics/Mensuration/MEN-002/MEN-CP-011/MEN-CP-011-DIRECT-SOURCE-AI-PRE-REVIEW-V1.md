# MEN-CP-011 — Direct-Source AI Pre-Review V1

## Status

```text
Source authority:                    MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V5
Inherited source authority:          MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4
AI pre-review authority:             MEN-CP011-DIRECT-SOURCE-AI-PRE-REVIEW-V1
Revised human-review batch:          MEN-CP011-DIRECT-SOURCE-HUMAN-REVIEW-BATCH-V2
Live runtime families:               28
Attached source references:          17
Direct matches pending human review:  4
Representation-only support:         13
Missing direct references:           11
Approved human reviews:               0
Directly normalised:                  0
```

## Purpose

The V4 source ledger correctly required human review, but its eight direct-task labels were still provisional. This pass compares each recorded source exemplar against the live prototype target, governing operation, given/unknown contract, ownership and intended exam representation.

This is an AI editorial pre-review. It is not human attestation. Reviewer identity and review timestamps remain empty.

## Retained as direct candidates

### Complete tube surface area

`MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA`

R.S. Aggarwal Question 151 asks for the whole surface of a hollow pipe. The decisive ledger is:

```text
outer curved wall
+ inner curved wall
+ two annular ends
```

That is the live prototype's exact final target and included-face topology. Conversion from exterior diameter and thickness to radii is subordinate to the surface-ledger task.

### Spherical-shell material volume

`MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME`

Question 226 asks for the volume of metal in a hollow spherical ball from external diameter and uniform thickness. The target and operation are directly aligned:

```text
outer sphere volume − inner sphere volume
```

### Hemispherical-shell material volume

`MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME`

Question 261 asks for the volume of steel in a hemispherical bowl from inside radius and uniform thickness. The final target and shell-subtraction operation match the live family.

### Hollow-cuboid material volume

`MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME`

Question 46 asks for the volume of wood in a covered cuboidal box. The worked solution reconstructs the outer dimensions and subtracts the inner cuboid volume. The family is not split by outer-dimension versus inner-dimension representation, so this remains a credible direct candidate.

## Downgraded to representation-only support

### Hollow cylinder from radii

`MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME`

Question 152 supplies girth and thickness, while the live prototype is explicitly the `RADII` representation and requires outer and inner radii. The governing formula matches, but the given/unknown contract does not.

Failed pre-review check:

```text
GIVEN_UNKNOWN_CONTRACT_ALIGNED
```

### Hollow cylinder from diameters

`MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS`

Question 153 supplies internal diameter and thickness. The live `DIAMETERS` prototype requires both external and internal diameters. This supports the mathematics but not the exact representation contract.

Failed pre-review check:

```text
GIVEN_UNKNOWN_CONTRACT_ALIGNED
```

### Pipe volume from outer radius and thickness

`MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS`

Questions 152 and 153 use thickness, but neither supplies the live prototype's outer-radius-plus-thickness contract. One supplies girth and the other internal diameter.

Failed pre-review check:

```text
GIVEN_UNKNOWN_CONTRACT_ALIGNED
```

### Joined-cubes exposed area

`MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA`

Question 94 asks for a ratio between the joined cuboid's surface area and the sum of the original cubes' surface areas. The live prototype asks for the exposed area itself. Contact-face reasoning is shared, but the final target is different.

Failed pre-review check:

```text
EXEMPLAR_TARGET_MATCHES
```

## Revised human-review queue

Only four candidates remain in Human Review Batch V2:

1. `MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA`
2. `MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME`
3. `MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME`
4. `MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME`

Each remains `PENDING`. A genuine human reviewer must still verify all six checks, add identity, timestamp and notes, and make an explicit decision.

## Fail-closed guarantees

- V4 remains preserved as historical authority.
- All 17 source references remain attached and traceable.
- Downgraded evidence cannot become complete direct evidence even if reviewer metadata is attached.
- No AI recommendation is stored as a human approval.
- The eleven missing-reference families remain missing.
- No permanent QL, Question Studio, Question Bank, test or publication state changes.

## Lifecycle

```text
Permanent QLs:      0
Question Studio:    disabled
Question Bank:      NOT_STORED
Test eligibility:   INELIGIBLE
Public publication: false
English freeze:     pending
Multilingual parity: pending
```
