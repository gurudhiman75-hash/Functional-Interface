# MEN-CP-011 — Direct-Source Normalisation Readiness Audit V2

## Status

```text
Authority:                         MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V2
Live runtime families:             28
Attached source references:        13
Direct task matches pending review: 5
Representation-only support:        8
Directly normalised:                0
Missing direct references:         15
Permanent QLs:                      0
Question Studio:                    disabled
Question Bank:                      NOT_STORED
Test eligibility:                   INELIGIBLE
Publication:                        false
```

This audit remains fail-closed. It separates four claims that must not be confused:

1. the formula and solver are executable and independently verified;
2. the family belongs to MEN-CP-011 rather than a neighbouring canonical problem;
3. a traceable source candidate has been attached with document, edition, page, exemplar and immutable-extract identifiers;
4. the source is a direct task match and has received human source-review attestation.

The first two claims remain complete for all 28 live runtime families. The third is now complete for 13 families. The fourth remains incomplete for every family because no human source-review attestation has been recorded.

## Source used in this pass

```text
Document:  Quantitative Aptitude for Competitive Examinations (Fully Solved)
Author:    Dr. R.S. Aggarwal
Publisher: S Chand
Edition:   Revised and Enlarged Edition 2017; Reprint 2017
ISBN:      978-93-525-3402-9
Library:   FILE_LIBRARY:file_000000007a30824383471a9d268f3224
Section:   Volume and Surface Areas
```

The repository stores source metadata, page/question locators and immutable File Library extract identifiers. It does not reproduce the source questions.

## Classification contract

### Direct task match

`DIRECT_TASK_MATCH` means the located exemplar asks for the same decisive task contract as the runtime family. A direct match is still only `REFERENCE_ATTACHED_PENDING_REVIEW` until reviewer identity and review timestamp are present.

### Representation-only support

`REPRESENTATION_ONLY_SUPPORT` means the source validates the shape, variables, topology or governing relation but asks for a materially different target. Representation-only evidence can never satisfy the direct-normalisation gate by itself.

### Rejected mismatch

`REJECTED_MISMATCH` is reserved for an apparently related source that belongs to a different canonical problem or uses a different decisive contract. Rejected sources are not counted as attached evidence.

## Direct task matches pending review — 5

| Runtime family | Source locator | Why it is a direct task match |
|---|---|---|
| `MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME` | printed p. 783, Q152 | Direct hollow cylindrical material-volume task |
| `MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS` | printed p. 783, Q153 | Direct tube metal-volume task using diameter, thickness and length |
| `MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS` | printed p. 783, Q152–153 | Direct material-volume tasks with stated wall thickness |
| `MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA` | printed p. 783, Q151 | Direct whole-surface task for an iron pipe |
| `MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA` | printed p. 797, Q94 | Direct exposed-area adjustment after equal cubes are joined |

These entries remain pending because no reviewer identity or review timestamp is stored.

## Representation-only support — 8

| Runtime family | Source locator | Why it is not yet a direct task match |
|---|---|---|
| `MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME` | printed p. 783, Q156 | Source solves inverse outer radius, not inner radius |
| `MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA` | printed p. 783, Q151 | Outer curved wall is included, but not isolated as the target |
| `MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA` | printed p. 783, Q151 | Inner curved wall is included, but not isolated as the target |
| `MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA` | printed p. 783, Q151 | Both curved walls are included with annular ends in the requested total |
| `MEN-CP011-PROT-ONE-ANNULAR-END-AREA` | printed p. 783, Q151 | Annular ends are used, but one end is not the requested target |
| `MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA` | printed p. 783, Q151 | Both ends are used, but their combined area is not the requested target |
| `MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA` | printed p. 783, Q153 | Both-ends-open topology is explicit, but the target is volume |
| `MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME` | printed p. 783, Q153 | Thickness is supplied rather than recovered |

These entries still require a direct exemplar matching the exact runtime target.

## Families still missing a qualifying source — 15

```text
Open cylinder, one end open — exposed area
Pipe length from material volume
Hollow cube material volume
Hollow cuboid material volume
Spherical shell material volume
Hemispherical shell material volume
Cuboid on floor painted area
Open cylindrical container sheet cost
Inner cylindrical lining cost
Material-volume ratio
Material-volume percentage change
Explicit-inner conical shell material volume
Similar-wall conical shell material volume
Both conical curved surfaces
Inner conical lining cost from shell relation
```

The executable ledger identifies these families by prototype ID; the descriptions above are only a readable summary.

## Other located material not promoted

### Disha SSC Mathematics Guide

The guide provides strong formula support for hollow-cylinder surfaces and material volume on printed p. 325, and hollow sphere/hemispherical-shell material volume on printed p. 326. The available extract did not establish a verified edition/year and did not provide direct exemplars for every runtime target. It was therefore not used to promote a family in this pass.

### Arun Sharma, Quantitative Aptitude for CAT, 8th edition (2018)

This source provides general mensuration formula authority and a hollow-vessel surface/painting context. It does not directly match the unresolved MEN-CP-011 material-volume and shell-derived targets, so it was retained as supporting research rather than ledger evidence.

### R.S. Aggarwal open-top cuboid tank sheet-cost example

The example is valid exam evidence for an open cuboid, but the live MEN-CP-011 cost runtime is an open cylinder. The cuboid example therefore cannot normalise the cylindrical family. Direct open-top cuboid sheet area is already owned by MEN-CP-007.

### R.S. Aggarwal conical-cavity example

The example describes a conical cavity cut from a solid cone. Its decisive contract is generic removal/composite geometry, owned by MEN-CP-013. It must not be used to normalise the explicit inner–outer conical shell families in MEN-CP-011.

## Evidence gate

A source candidate is counted as attached only when it contains:

- an accepted source type;
- stable document identifier and title;
- edition or year;
- chapter or section;
- page or equivalent stable locator;
- representative question/example locator;
- content hash or immutable extract identifier;
- direct-match or representation-only classification;
- written match rationale.

An entry can become `DIRECTLY_NORMALISED` only when all of the following also hold:

- classification is `DIRECT_TASK_MATCH`;
- reviewer identity is present;
- review timestamp is present;
- the executable completeness gate passes.

A filename, title, URL, formula-only mention or representation-only example is insufficient.

## Live-ledger lock

The registry remains generated from live runtime prototype registries. CI requires:

```text
Live prototypes:          28
Ledger prototypes:        28
Unique live prototypes:   28
Unique ledger prototypes: 28
Live/ledger sets match:   true
```

Any future MEN-CP-011 runtime family must receive a source decision in the same change.

## Current family-group counts

```text
Pipe material and inverse core:         4
Pipe surface exposure:                  6
Open-cylinder exposure:                 2
Additional pipe inverses:               2
Hollow rectangular solids:              2
Spherical shells:                       2
Hidden-face exposure:                   2
Sheet and lining cost:                  2
Material ratio and percentage change:   2
Conical material volume:                2
Conical surface and lining cost:        2
Total:                                 28
```

## Neighbour ownership closure

### MEN-CP-007 — Cube and cuboid surfaces

Retains direct cube/cuboid area, open-top box sheet area, painting and coating when no hollow material or inner–outer shell ledger is decisive.

### MEN-CP-008 — Cylinders and cones

Retains direct intact-cylinder or intact-cone measurement, slant-height recovery, canvas and direct one-cone lining calculations.

### MEN-CP-009 — Spheres and hemispheres

Retains direct solid sphere/hemisphere volume and surface calculations. MEN-CP-011 owns only inner–outer shell material or exposure transformations.

### MEN-CP-010 — Pyramids and frustums

Retains truncated-cone and frustum measurement. A frustum must not be relabelled as a hollow cone.

### MEN-CP-012 — Recasting and conservation

Retains melting, recasting and transformation questions whose decisive rule is volume conservation.

### MEN-CP-013 — Composite and removed solids

Retains generic drilled/removed solids and composite union/subtraction when no canonical hollow/open-surface relation governs the cavity.

## Current verdict

```text
Canonical ownership confirmed:      28 / 28
Executable formula authority:       28 / 28
Attached source references:         13 / 28
Direct matches pending review:       5 / 28
Representation-only support:         8 / 28
Directly normalised:                 0 / 28
Missing direct references:          15 / 28
Incomplete attached references:      0
False normalisation claims:           0
Neighbour boundaries recorded:       6
Source normalisation complete:       false
Permanent QL allocation allowed:     false
Publication eligible:                false
```

## Active blockers

```text
DIRECT_SOURCE_DOCUMENT_LOCATORS_MISSING
DIRECT_SOURCE_EXEMPLAR_LOCATORS_MISSING
DIRECT_TASK_MATCHES_STILL_REQUIRED
SOURCE_REVIEWER_ATTESTATION_MISSING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

## Next source pass

1. Human-review the five direct-task candidates and record reviewer/timestamp only after verifying the source pages.
2. Find direct target-matching exemplars for the eight representation-only families.
3. Locate qualifying sources for the remaining fifteen families.
4. Preserve all neighbouring-CP exclusions.
5. Re-run the completeness gate before any source-maturity promotion.

No runtime `sourceMaturity`, permanent QL, Question Studio, Question Bank, test or publication status is changed by this candidate-attachment pass.
