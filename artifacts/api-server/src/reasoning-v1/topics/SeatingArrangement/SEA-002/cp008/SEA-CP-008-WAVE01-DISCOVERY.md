# SEA-002 / SEA-CP-008 — Square Seating Wave 01 Discovery

Status: **DISCOVERY OPEN / NO PERMANENT QL ALLOCATION / NO PRODUCT ACTIVATION**

`SEA-CP-008` owns square-table seating only. It begins after CP007's authoring surface is review-ready, but it does not depend on CP007 being product-activated.

## Hard boundary

In scope:

- square perimeter topology;
- corner versus side-seat semantics;
- clockwise/anticlockwise and person-relative left/right around a square;
- opposite positions across the square;
- same-side / opposite-side relations where the source schema uses multiple persons per side;
- inward/outward facing, including role-determined and mixed individual facing;
- 8-seat and larger square variants only when source evidence shows the same square solve topology.

Out of scope:

- rectangular and other regular-polygon tables (`SEA-CP-009`);
- concentric / inner-outer rings and dual groups (`SEA-CP-010`);
- attribute overlays as separate solve authorities;
- statement wrappers, Data Sufficiency shells, exchanges/rotations and hypotheticals unless separately opened;
- any permanent `SEA-QL-029+` allocation before saturation + independent uniqueness proof.

## Source-backed temporary prototype inventory

| Prototype | Temporary schema | Discovery question |
|---|---|---|
| `SEA-CP008-PROT-001` | 8 seats: 4 corners + 4 side middles; corners inward, middles outward | baseline alternating-role square authority |
| `SEA-CP008-PROT-002` | 8 seats: same geometry; corners outward, middles inward | configuration variant or distinct solve mode? |
| `SEA-CP008-PROT-003` | 8 seats: two persons on each side, all inward | does side-pair structure require its own authority? |
| `SEA-CP008-PROT-004` | 8 seats: two persons on each side, mixed individual facing | facing-inference overlay or distinct authority? |
| `SEA-CP008-PROT-005` | 12 seats: one corner seat + two side seats per side, role-based facing | scale variant or genuinely different square solve mode? |

No prototype is a permanent authority yet.

## Provisional merge hypotheses

1. `PROT-001` and `PROT-002` should merge if reversing the corner/middle facing rule changes only parameters, not the deduction graph.
2. `PROT-003` should remain separate from alternating corner/middle geometry if same-side pairing and opposite-side correspondence are solution-essential.
3. `PROT-004` should merge with `PROT-003` only if mixed facing can be expressed as a bounded facing overlay without changing the seat-topology solve contract.
4. `PROT-005` should merge into the alternating-role family only if 12-seat scale preserves the same corner/side and opposite mapping semantics without a new solve operation.

## Discovery gates before permanent IDs

A candidate authority may survive only after all of the following:

- source coverage across more than one exam/prep lineage;
- topology semantics are explicit and diagrammable;
- independent solver reconstructs unique relative arrangements across a production-sized seed set;
- corner/side role, opposite mapping, left/right and facing rules are proved rather than assumed;
- learner questions are non-direct and exam-natural;
- explanation path teaches the square-specific deduction, not generic circular boilerplate;
- no overlap with CP007 parallel rows or CP009 rectangle/polygon families.

Until those gates pass:

```text
permanent QL allocation      false
Question Studio              false
Question Bank writable       false
test/mock eligible           false
production staging           false
public delivery              false
next candidate QL            SEA-QL-029 (RESERVED ONLY AS NEXT FREE ID, NOT ALLOCATED)
```
