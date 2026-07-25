# DIR-CP-003 Implementation Report

Status: runtime implemented on a feature branch; English editorial review pending.

## Scope

`DIR-CP-003` owns numeric distance, displacement and inverse-distance questions for a single ordered path.

The obsolete fixed allocation in the original design was not followed. A gap audit produced five materially distinct QLs:

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-006` | shortest distance | numeric displacement magnitude rather than direction |
| `DIR-QL-007` | direction and shortest distance | combined qualitative/numeric answer and reference reversal |
| `DIR-QL-008` | total distance and displacement | accumulated path length must be distinguished from resultant displacement |
| `DIR-QL-009` | missing movement distance | inverse reconstruction from a supplied endpoint |
| `DIR-QL-010` | non-integer shortest distance | simplified-radical or one-decimal display contract |

Shortest return is handled as reference reversal inside `DIR-QL-007`; it does not receive a duplicate QL. Axis-aligned and exact Pythagorean displacement share `DIR-QL-006` because they use the same hidden state, answer demand and solver entry point.

## Generation model

- cardinal movement legs only for numeric-distance questions;
- deterministic axis and reviewed Pythagorean profiles;
- exact internal coordinates and no premature rounding;
- non-square integer squared distances for controlled radical/decimal questions;
- one positive unknown orthogonal movement for inverse questions;
- independent replay and inverse solvers;
- four unique misconception-based options;
- natural one-paragraph exam stems.

## Explanation and diagram contract

The learner-facing explanation follows the approved CP-002 style:

1. one brief starting sentence;
2. one plain sentence per movement leg;
3. one net-movement sentence;
4. one direct conclusion;
5. one plain route diagram at the end.

The diagram is reused from the approved plain path renderer and contains only Start, Finish, route arrows, distances, turn points and a small compass. It does not contain coordinate calculations, answer arrows, final-facing arrows, legends or embedded solution commentary.

## Validation

The checkpoint proof generates `120` seeds per QL (`600` cases total) and checks:

- deterministic replay;
- continuous `DIR-QL-006` through `DIR-QL-010` allocation;
- material-need evidence and open `solveMode` policy;
- four unique options with one correct answer;
- independent-solver agreement;
- movement/explanation/diagram parity;
- axis and Pythagorean coverage;
- all eight direction-distance answers;
- both query references;
- inverse single-unknown uniqueness;
- radical and one-decimal display modes;
- Easy, Medium and Hard coverage;
- answer-position balance and stem diversity.

## Editorial and localization state

- English runtime: implemented, awaiting manual editorial approval.
- Hindi: not started.
- Punjabi: not started.
- Question Studio exposure: not enabled.
- Freeze status: not claimed.
