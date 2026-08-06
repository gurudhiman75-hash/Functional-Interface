# MEN-CP-011 — Phase 2C Surface-Area Families

## Status

```text
Checkpoint:                  MEN-CP-011
Phase:                       PHASE-2C
Surface authority:           MEN-CP011-PHASE2C-SURFACE-AREA-V1
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               NOT_STORED
Test eligibility:            INELIGIBLE
Public publication:          false
```

Phase 2C adds the missing exposure-based surface-area reasoning for a hollow cylindrical pipe. It does not freeze permanent QLs or claim complete chapter readiness.

## Prototype families

```text
MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA
MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA
MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA
MEN-CP011-PROT-ONE-ANNULAR-END-AREA
MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA
MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA
```

The six families distinguish the exact exposed surfaces before calculation:

- outside curved wall only;
- inside curved wall only;
- both curved walls, excluding ends;
- one annular end only;
- both annular ends only;
- complete exposed area: two curved walls plus two annular ends.

## Formula authority

```text
Outer curved wall:       2πRh
Inner curved wall:       2πrh
Both curved walls:       2πh(R + r)
One annular end:         π(R² − r²)
Both annular ends:       2π(R² − r²)
Complete tube surface:   2πh(R + r) + 2π(R² − r²)
```

The complete-area family is intentionally represented as a surface ledger, not as a memorised one-line formula. The learner must identify which of the four exposed surfaces are included.

## State and unit authority

Phase 2C reuses:

```text
Physical-state authority:   MEN-CP011-PHASE2A-STATE-POOL-V1
Measurement authority:      MEN-CP011-PHASE2B-UNIT-REPRESENTATION-V1
```

Therefore all six surface families support:

- radii and length in centimetres, answer in cm²;
- radii and length in metres, answer in m²;
- radii in centimetres and length in metres, converted to cm²;
- radii in metres and length in centimetres, converted to cm².

Mixed-unit questions convert every length to one calculation unit before formula use. Curved areas apply one radial and one axial conversion factor; annular areas apply the squared radial conversion factor.

## Misconception authority

The option engine distinguishes common exam errors, including:

- using only the outer curved wall;
- using only the inner curved wall;
- omitting annular ends;
- using one annular end instead of two;
- treating an annulus as a full outer disc;
- adding the inner and outer discs;
- squaring wall thickness;
- subtracting curved radii where exposed curved areas must be added;
- using complete surface area when only a subset is requested.

Internal misconception codes remain admin-only.

## Diagram and rendering boundary

- Attempt mode remains text-complete and diagram-free.
- Practice mode may show the approved responsive tube diagram with surface-focus metadata.
- Solution mode shows the same geometry and a concise learner explanation.
- Admin mode exposes the full surface ledger, misconception codes and independent verifier.
- The existing white-background, centre-connected, detached-label diagram geometry is retained.

## Review matrix

The Phase 2C review constructor requires:

```text
Surface prototypes:          6
Records per prototype:       12
Total review records:        72
Unique physical states:      72
Measurement profiles:        4
Records per profile:         18
Records per prototype/profile cell: 3
Correct positions:           A18 B18 C18 D18
```

It also rejects exact duplicate stems, exact stem-option duplicates, normalized stem repetition above three, shared prototype answer-position sequences, invalid surface-ledger selections and learner-facing internal codes.

## Remaining blockers

```text
CHAPTER_COVERAGE_INCOMPLETE
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

Phase 2C closes the principal hollow-pipe surface-exposure gap, but a chapter-wide coverage audit and English manual review are still required before permanent QL allocation or any product publication.
