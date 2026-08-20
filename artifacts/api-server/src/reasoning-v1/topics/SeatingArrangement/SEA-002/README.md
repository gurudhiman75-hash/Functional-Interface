# SEA-002 — Parallel Rows, Polygonal and Multi-Ring Seating

Status: **DISCOVERY / NO PERMANENT QLs**

SEA-002 is the advanced-topology package in `REAS-SEA`. It starts only after the SEA-001 learner authorities are frozen and the SEA-001 Question Studio review-only gate is green.

## Approved V3 checkpoint boundary

| Checkpoint | Ownership |
|---|---|
| `SEA-CP-006` | Two parallel rows facing each other |
| `SEA-CP-007` | Parallel rows with mixed, same-direction or otherwise non-uniform facing |
| `SEA-CP-008` | Square seating |
| `SEA-CP-009` | Rectangular and regular-polygon seating |
| `SEA-CP-010` | Concentric circles and dual-group seating |

SEA-002 must prove row/column alignment, opposite and diagonal relations, corners versus side seats, perimeter order on non-circular tables, topology-specific symmetry, inner/outer-ring correspondence and diagram correctness.

## Current implementation wave

Only `SEA-CP-006` is being implemented in this branch.

Approved provisional discovery authorities:

- `SEA-PBA-021` — fixed row membership with opposites
- `SEA-PBA-022` — row membership partly inferred
- `SEA-PBA-023` — same-row chains linked by opposite seats
- `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint mix

These are **provisional discovery IDs, not permanent `SEA-QL-*` IDs**. Permanent allocation remains blocked until source audit, prototype saturation, solver/oracle agreement, query audit, merge/split audit, inverse audit, gap audit and discovery freeze.

## CP-006 topology contract

- two equal rows of 3–6 seats;
- top row faces south;
- bottom row faces north;
- displayed columns are observer coordinates;
- opposite seats share a column;
- person-relative left/right is evaluated from the reference person's facing;
- diagonal means other row plus an adjacent column, never the same column;
- every displayed clue is typed and independently checked against the hidden state;
- ordinary caselets require one unique arrangement;
- each passage carries 3–5 child questions from at least three query contracts;
- at least one child must test opposite/corresponding or another cross-row fact.

## Lifecycle locks

```text
permanent QLs              none
English freeze             false
Hindi/Punjabi freeze       false
Question Studio registered false
Question Bank writable     false
mock-test eligible         false
production staging         false
public delivery            false
```
