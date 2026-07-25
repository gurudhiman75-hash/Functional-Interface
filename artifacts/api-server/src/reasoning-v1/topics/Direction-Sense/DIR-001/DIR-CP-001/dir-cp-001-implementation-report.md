# DIR-CP-001 Implementation Report

Status: first need-based English runtime slice implemented on `feat/dir-001-foundation`.

## Implemented QLs

Only three QLs were created because these are the three currently proven, materially distinct orientation contracts:

| QL | Answer demand | Material difference |
|---|---|---|
| `DIR-QL-001` | Final facing | Forward composition of an ordered turn sequence |
| `DIR-QL-002` | Initial facing | Inverse reconstruction from final facing and the complete sequence |
| `DIR-QL-003` | Missing turn | A turn operation is reconstructed from governed candidates and proved unique |

Single versus multiple turns, 45° versus 90°/135°/180°, relative wording, degree wording, names and stem layouts remain generated-instance variation. They are not separate QLs.

No fixed solve-mode enum is used. The QLs declare solver capabilities, and generated metadata currently reports `solveMode: null`.

## Runtime responsibilities

- deterministic seeded generation;
- eight-direction initial and final facing;
- one to four ordered turns for forward and inverse questions;
- 45°, 90°, 135° and 180° turns;
- natural right, left and about-turn realization where applicable;
- independent forward, inverse and candidate-reconstruction solver functions;
- four unique misconception-driven options;
- answer shuffling with isolated streams by QL demand;
- instance-derived difficulty;
- structured prompts;
- value-grounded explanation steps;
- chapter-registry discovery;
- relation topology fingerprints invariant to names, relation ordering and equivalent reverse statements.

## Validation performed

A local source-equivalent reconstruction of the committed TypeScript was compiled with the repository's strict compiler settings and executed through the runtime assertions.

Results:

```text
QLs:                         3
Seeds per QL:                200
Generated cases:             600
Deterministic replay:        passed
Unique four-option contract: passed
Exactly one correct option:  passed
Independent solver checks:   passed
Direction coverage:          8 / 8
Turn-answer coverage:        left, right, about-turn
Difficulty coverage:         Easy, Medium, Hard
Stem diversity:
  DIR-QL-001                 200 / 200
  DIR-QL-002                 198 / 200
  DIR-QL-003                 165 / 200
Answer positions:            160, 156, 133, 151
Max/min ratio:               1.203
Required ratio:              below 1.35
Name-invariant fingerprints: passed
```

The first run exposed a 1.366 answer-position ratio because forward and inverse QLs shared the same option-shuffle stream. The streams were separated and the audit then passed at 1.203.

Editorial review also found that the missing-turn stem explicitly stated that a turn occurred while offering `No turn` as a distractor. The wording was corrected so the stem asks for the change in facing without revealing that a turn necessarily occurred.

A duplicate-audit review found that relation fingerprints originally included entity names. They now canonicalize solved coordinates and edges, so name-only rewrites, reordered relations and equivalent reverse statements produce the same topology fingerprint.

## Honest execution status

- Source-equivalent strict TypeScript compile: passed.
- Source-equivalent runtime proof: passed.
- Source-equivalent name-invariant fingerprint proof: passed.
- Exact test file executed from a checked-out repository: not yet.
- GitHub Actions / repository CI: not executed; no matching workflow ran for the draft PR.
- English human editorial approval: not complete.
- Hindi and Punjabi runtime: not started.
- Freeze-ready: no.

## Next need-based decision

Do not add another CP-001 QL merely to increase volume. First review real exam patterns for a fourth orientation contract. If no new hidden-state, answer-demand, solver, renderer or misconception contract is found, CP-001 should remain at three QLs and implementation should proceed to path-based CP-002.
