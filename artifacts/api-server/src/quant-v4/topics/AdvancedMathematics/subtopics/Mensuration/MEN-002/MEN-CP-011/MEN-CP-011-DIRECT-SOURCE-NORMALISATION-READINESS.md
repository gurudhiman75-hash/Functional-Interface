# MEN-CP-011 — Direct-Source Normalisation Readiness Audit

## Status

```text
Authority:             MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V1
Live runtime families: 28
Directly normalised:   0
Missing references:   28
Permanent QLs:         0
Question Studio:       disabled
Question Bank:         NOT_STORED
Test eligibility:      INELIGIBLE
Publication:           false
```

This audit is intentionally fail-closed. It separates three different claims that must not be confused:

1. the formula and solver are executable and independently verified;
2. the family belongs to MEN-CP-011 rather than a neighbouring canonical problem;
3. a direct book, paper or approved extract has been attached with a stable locator and reviewed.

The first two claims are complete for all 28 live runtime families. The third is not complete because no concrete direct-source references are stored in the repository ledger.

## Why this gate is required

A mathematically correct generated family can still be unsuitable for final SSC/banking use when:

- the representation is not evidenced in recognised exam-preparation material;
- the difficulty or wording pattern is architecture-derived rather than source-observed;
- an application belongs to a neighbouring canonical problem;
- a formula-only reference exists but no representative question pattern is attached;
- a copied source cannot be traced to an edition, page or immutable extract.

Therefore formula proof does not grant source normalisation, permanent QLs or publication.

## Live-ledger lock

The readiness registry is generated from the live runtime prototype registries. CI requires:

```text
Live prototypes:          28
Ledger prototypes:        28
Unique live prototypes:   28
Unique ledger prototypes: 28
Live/ledger sets match:   true
```

Any future MEN-CP-011 runtime family must be added to the source ledger in the same change. Silent families are forbidden.

## Evidence required for each family

A family may move from:

```text
MISSING_DIRECT_REFERENCE
```

to:

```text
REFERENCE_ATTACHED_PENDING_REVIEW
```

only when a candidate reference contains:

- an accepted source type;
- stable document identifier;
- document title;
- edition or year;
- chapter or section;
- page or equivalent stable locator;
- representative question/example locator;
- content hash or immutable extract identifier.

It may move to:

```text
DIRECTLY_NORMALISED
```

only after reviewer identity and review timestamp are also present and the executable completeness gate passes.

## Accepted source types

```text
OFFICIAL_EXAM_PAPER
ESTABLISHED_EXAM_PREP_BOOK
STANDARD_MATHEMATICS_TEXTBOOK
APPROVED_INTERNAL_SOURCE_EXTRACT
```

A URL, filename or book title alone is insufficient. A source must be locatable and tied to the specific family pattern.

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

All 28 currently have:

```text
Formula authority: EXECUTABLE_AND_INDEPENDENTLY_VERIFIED
Ownership status:  CANONICAL_OWNER_CONFIRMED
Source status:     MISSING_DIRECT_REFERENCE
```

## Neighbour ownership closure

### MEN-CP-007 — Cube and cuboid surfaces

Retains direct cube/cuboid area, open-top box sheet area, painting and coating when no hollow material or inner–outer shell ledger is decisive.

The existing open-top cuboid sheet-area authority must not be duplicated in MEN-CP-011.

### MEN-CP-008 — Cylinders and cones

Retains direct intact-cylinder or intact-cone measurement, slant-height recovery, canvas and direct one-cone lining calculations.

A lining task belongs to MEN-CP-011 only when the inner lining is derived from an explicit inner–outer shell relation.

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
Canonical ownership confirmed:    28 / 28
Executable formula authority:     28 / 28
Directly normalised:               0 / 28
Missing direct references:        28 / 28
False normalisation claims:        0
Neighbour boundaries recorded:     6
Source normalisation complete:     false
Permanent QL allocation allowed:   false
Publication eligible:              false
```

## Active blockers

```text
DIRECT_SOURCE_DOCUMENT_LOCATORS_MISSING
DIRECT_SOURCE_EXEMPLAR_LOCATORS_MISSING
SOURCE_REVIEWER_ATTESTATION_MISSING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

## Next source pass

When the source library is accessible, the next pass should:

1. attach candidate references family-group by family-group;
2. record page and exemplar locators rather than broad book titles;
3. classify each exemplar as direct match, representation-only support or rejected mismatch;
4. retain neighbouring-CP exclusions;
5. run the completeness gate;
6. send only fully evidenced entries for human source review.

No runtime `sourceMaturity` status should be promoted before this ledger contains reviewed evidence.
