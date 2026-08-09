# MEN-CP-011 — Direct-Source Human Review Batch V1

## Status

```text
Authority:                          MEN-CP011-DIRECT-SOURCE-HUMAN-REVIEW-BATCH-V1
Inherited source authority:         MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4
Live runtime families:              28
Attached source references:         17
Direct candidates in review batch:   8
Representation-only support:         9
Missing direct references:          11
Pending human reviews:               8
Approved human reviews:              0
Promotion-ready candidates:          0
Directly normalised:                 0
Permanent QLs:                       0
Publication eligible:            false
```

## Decision

The source-discovery passes have produced eight traceable `DIRECT_TASK_MATCH` candidates. The next truthful blocker is human verification. This batch converts those candidates into a controlled review queue without pretending that review has already occurred.

No reviewer name or timestamp is prefilled. No candidate is promoted by this change.

## Included candidates

1. `MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME`
2. `MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS`
3. `MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS`
4. `MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA`
5. `MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA`
6. `MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME`
7. `MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME`
8. `MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME`

The executable batch is generated from the V4 source ledger rather than from a separately typed candidate list. It therefore fails if a candidate is silently added, removed or reclassified upstream.

## Mandatory human checks

Every candidate must pass all six checks:

### 1. Source locator resolves

Open the recorded edition and verify the page, question/example and immutable extract locators.

### 2. Exemplar target matches

The source must ask for the same final mathematical quantity as the live family. A related shape or formula is not enough.

### 3. Governing operation matches

The decisive operation or surface ledger must match the runtime family.

### 4. Given/unknown contract is aligned

The source must support the family’s actual given/unknown structure, including any inverse target or included-face topology.

### 5. Canonical ownership is confirmed

The source must remain inside MEN-CP-011 after applying the boundaries with MEN-CP-007, 008, 009, 010, 012 and 013.

### 6. Exam representation is appropriate

The representation must be suitable for the intended SSC, banking or state-exam pool rather than a formula-only or artificial construction.

## Fail-closed rules

A candidate is promotion-ready only when:

- its decision is `APPROVED`;
- all six checks are explicitly `true`;
- reviewer identity is stored;
- review timestamp is stored;
- review notes are stored;
- the underlying evidence remains a complete `DIRECT_TASK_MATCH`.

A failed or missing check blocks promotion.

Representation-only evidence remains ineligible even if reviewer metadata is attached. The executable test attempts this illegal relabelling and requires the promotion gate to reject it.

## Source-search closure for this pass

The latest targeted search covered:

- hollow-cube material volume;
- one-end-open cylinder area;
- inverse pipe length;
- cuboid-on-floor painted area;
- open cylindrical sheet cost;
- hollow-material ratios and percentage change;
- explicit conical-shell volume and surface applications.

No additional reference met the direct-task, stable-locator and ownership requirements. Therefore the V4 counts remain unchanged rather than being padded with weak or mismatched evidence.

## Separate future actions

After genuine human review:

1. write approved reviewer metadata back to the canonical source ledger;
2. rerun the complete-evidence gate;
3. retain rejected or corrected candidates with reasons;
4. continue source discovery for the eleven missing families;
5. complete manual English review;
6. model and allocate permanent QLs;
7. complete Hindi and Punjabi parity;
8. separately enable Question Studio, Question Bank, tests and publication.

## Lifecycle lock

```text
Permanent QLs:      0
Question Studio:    disabled
Question Bank:      NOT_STORED
Test eligibility:   INELIGIBLE
Public publication: false
English freeze:     pending
Multilingual parity: pending
```

This batch is a review instrument, not a release approval.
