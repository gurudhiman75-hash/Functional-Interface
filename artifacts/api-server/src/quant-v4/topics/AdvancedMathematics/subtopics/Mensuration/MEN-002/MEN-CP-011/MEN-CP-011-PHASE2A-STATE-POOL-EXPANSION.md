# MEN-CP-011 — Phase 2A Physical-State Pool Expansion

## Status

```text
Checkpoint:                 MEN-CP-011
Phase:                      PHASE-2A
State-pool authority:       MEN-CP011-PHASE2A-STATE-POOL-V1
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              NOT_STORED
Test eligibility:           INELIGIBLE
Public publication:         false
```

Phase 2A closes the immediate eight-state parity-fixture limitation without starting new surface-area families or allocating permanent QLs.

## Scope

The approved Wave 01 runtime originally selected one of eight dimension triples. Phase 2A preserves those eight independently validated radial proportions, then applies one of nine deterministic scale profiles:

```text
Radial scale:  1, 2 or 3
Height scale:  1, 3 or 4
```

This produces:

```text
8 base fixtures × 9 scale profiles = 72 unique physical states
23 distinct outer/inner radial pairs
8 distinct pipe lengths
```

All `22/7` cases remain integer-friendly because the original lengths are multiples of seven and the approved height scales preserve that property.

## Runtime transformation

The Phase 2A layer receives a fully validated Wave 01 package and expands it homogeneously:

```text
R' = radialScale × R
r' = radialScale × r
t' = radialScale × t
h' = heightScale × h

R'² − r'² = radialScale² × (R² − r²)
V' = radialScale² × heightScale × V
```

For inverse-radius questions, every length option is multiplied by the radial scale. For volume questions, every exact option is multiplied by the complete volume scale. Therefore misconception relationships and answer uniqueness are preserved rather than regenerated approximately.

## Diagram safety

The inner-to-outer radius ratio is unchanged, so the approved `TUBE_EXAMTREE_EXAM_READY_V2` geometry remains physically consistent. Only state-derived labels are replaced.

Required invariants remain:

- prompt and solution diagrams are separate;
- derived inner radius is `r = ?` before submission;
- solution diagram reveals the recovered value;
- radius guides remain centre-connected;
- labels remain detached;
- no fixed width or minimum width is introduced.

## Review-batch gate

The 48-record review constructor now requires:

- 48 unique physical states;
- no exact duplicate stems;
- no exact duplicate stem-option packages;
- normalized stem repetition no greater than three;
- three correct answers per option position inside every prototype;
- A/B/C/D totals of 12 each;
- four distinct prototype answer-position sequences.

## Closed blocker

The following blocker is removed after the Phase 2A proof:

```text
INSUFFICIENT_PHYSICAL_STATE_DIVERSITY
```

## Remaining blockers

Phase 2A does not claim chapter or publication readiness. The active blockers are:

```text
UNIT_REPRESENTATION_COVERAGE_INCOMPLETE
CHAPTER_COVERAGE_INCOMPLETE
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

The next phase must expand unit systems and missing hollow/open/exposure reasoning families. It must not allocate permanent QLs until the full chapter coverage and manual English audits are complete.
