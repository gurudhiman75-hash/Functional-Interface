# SEA-002 — Parallel Rows, Polygonal and Multi-Ring Seating

Status: **CP006 TECHNICALLY COMPLETE / SIGNED ENGLISH FREEZE PENDING**

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

## CP006 retained authorities

`SEA-CP-006` technical discovery/implementation is complete with four provisional authorities:

- `SEA-PBA-021` — fixed row membership with opposites
- `SEA-PBA-022` — row membership partly inferred
- `SEA-PBA-023` — same-row chains linked by opposite seats
- `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint mix

Final merge/split audit retains all four. These remain **provisional PBA IDs, not permanent `SEA-QL-*` IDs**, until the exact pinned English review artifact receives signed owner approval.

## CP006 topology contract

- two equal rows of 3–6 seats;
- top row faces south;
- bottom row faces north;
- opposite seats share a vertical column;
- person-relative left/right is evaluated from the reference person's facing;
- diagonal means other row plus an adjacent column, never the same column;
- every displayed clue is typed and independently checked against the hidden state;
- ordinary caselets require one unique arrangement;
- each passage carries four child questions with diverse query contracts;
- source-natural exam cases retain a source clue that is solution-essential rather than decorative.

## CP006 learner presentation contract

Questions use compact exam-style SSC/Banking language. Internal engine language such as solver/oracle/blueprint/fingerprint/observer coordinates is prohibited from learner-facing prose.

Solutions use simple teacher-style English and are deliberately more detailed than the passage:

- direction rule first;
- row groups marked without prematurely fixing order;
- candidate Case 1 / Case 2 / Case 3 shown whenever the clues genuinely create alternatives;
- later conditions visibly reject the wrong cases;
- remaining deductions shown step by step with short results;
- final two-row arrangement shown before answering the child questions;
- repeated row-membership narration is grouped instead of restating one sentence per person.

The pinned 100-caselet review corpus has 100/100 detailed solutions and 88/100 explicit case-formation solutions. The remaining 12 are direct-placement solutions where no useful trial-case split exists.

Current pinned review fingerprint:

`37384b1a30e13a33bffe101d2906af56595f195d3d91238d8c571d67a5d07e6c`

## Lifecycle locks

```text
technical CP006             complete
permanent QLs               none
English signed freeze       false
Hindi/Punjabi freeze        false
Question Studio registered  false
Question Bank writable      false
mock-test eligible          false
production staging          false
public delivery             false
```

The next available permanent seating ID after SEA-001 is `SEA-QL-021`. Permanent mapping for PBA-021..024 remains blocked until signed review of the exact pinned CP006 artifact.
