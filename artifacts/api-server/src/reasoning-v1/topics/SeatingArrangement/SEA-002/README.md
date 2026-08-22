# SEA-002 — Parallel Rows, Polygonal and Multi-Ring Seating

Status: **CP006 ENGLISH FROZEN / PERMANENT QLs ALLOCATED INACTIVE**

SEA-002 is the advanced-topology package in `REAS-SEA`. It starts only after the SEA-001 learner authorities are frozen and the SEA-001 Question Studio review-only gate is green.

## Approved V3 checkpoint boundary

| Checkpoint | Ownership |
|---|---|
| `SEA-CP-006` | Two parallel rows facing each other |
| `SEA-CP-007` | Parallel rows with mixed, same-direction or otherwise non-uniform facing |
| `SEA-CP-008` | Square seating |
| `SEA-CP-009` | Rectangular and regular-polygon seating |
| `SEA-CP-010` | Concentric circles and dual-group seating |

SEA-002 must prove row/position alignment, opposite and diagonal relations, corners versus side seats, perimeter order on non-circular tables, topology-specific symmetry, inner/outer-ring correspondence and diagram correctness.

## CP006 frozen authorities

`SEA-CP-006` retains four permanent solve authorities:

- `SEA-QL-021` ← `SEA-PBA-021` — fixed row membership with opposites
- `SEA-QL-022` ← `SEA-PBA-022` — row membership partly inferred
- `SEA-QL-023` ← `SEA-PBA-023` — same-row chains linked by opposite seats
- `SEA-QL-024` ← `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint mix

Final merge/split audit retains all four with no merge or split. Widths 3+3 through 6+6 remain size variants, not separate authorities. The next available permanent seating ID is `SEA-QL-025`.

## CP006 topology contract

- two equal rows of 3–6 seats;
- top row faces south;
- bottom row faces north;
- internally, opposite seats share the same coordinate column;
- person-relative left/right is evaluated from the reference person's facing;
- internally, diagonal means other row plus an adjacent coordinate, never the opposite coordinate;
- every displayed clue is typed and independently checked against the hidden state;
- ordinary caselets require one unique arrangement;
- each passage carries four child questions with diverse query contracts;
- source-natural exam cases retain a source clue that is solution-essential rather than decorative.

## CP006 learner presentation contract

Questions use compact exam-style SSC/Banking language. Internal engine language such as solver/oracle/blueprint/fingerprint/observer coordinates is prohibited from learner-facing prose.

Shared solutions use simple teacher-style English and use **position** consistently for learner-facing seat numbering:

- one compact opening frame: positions numbered left-to-right, upper row south-facing, lower row north-facing, same position in the two rows = facing pair;
- no generic multi-paragraph “draw the rows / remember the direction rule” opening;
- row groups marked without prematurely fixing exact positions;
- candidate Case 1 / Case 2 / Case 3 shown whenever the clues genuinely create alternatives;
- later conditions visibly reject the wrong cases;
- deductions expressed with concrete `row` and `position` wording;
- `Position:` used for the outcome of a deduction instead of an abstract `Result:` label;
- person-relative deductions state the reference row/facing/position and then the resulting target position;
- diagrams use `Positions:` and `P1`, `P2`, ... rather than learner-facing column labels;
- final two-row arrangement shown after the deductions;
- generic closing filler after the final arrangement is removed;
- repeated row-membership narration is grouped rather than restating one sentence per person;
- the English review gate rejects any learner-facing `column` / `columns` wording.

The approved 100-caselet review corpus has 100/100 detailed position-first solutions and 88/100 explicit case-formation solutions. The remaining 12 are direct-placement solutions where no useful trial-case split exists.

## Signed English review

Approved review fingerprint:

`07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e`

Approved artifact: `cp006-english-review-100`, artifact ID `9474071929`.

Approved artifact ZIP digest:

`sha256:7e37d79da61f4b4edca8601e353cd1cf4b8fc1b85fa427dfd89591fa7f747ccc`

Reviewer: `gurudhiman75-hash`

Reviewed at: `2026-08-22T15:37:00+05:30`

Approval decision: `100_ACCEPT_0_REWRITE_0_REJECT`.

The approval is stored separately from the immutable review artifact. The freeze proof recalculates the full 100-caselet fingerprint and fails if the reviewed content changes.

## Lifecycle locks

```text
technical CP006             complete
permanent QLs               SEA-QL-021..SEA-QL-024 allocated inactive
solve inventory             frozen
query mix                   frozen
English signed freeze       true
Hindi/Punjabi freeze        false
Question Studio registered  false
Question Bank writable      false
mock-test eligible          false
production staging          false
public delivery             false
next permanent seating ID   SEA-QL-025
```

English approval does **not** activate downstream delivery. Localization, Question Studio, Question Bank, mocks, staging and public delivery require their own later gates.
