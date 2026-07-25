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

The learner-facing explanation follows the approved lightweight CP-002 style while visibly justifying the numeric result:

1. one brief starting sentence;
2. one plain sentence per movement leg;
3. one net horizontal/vertical movement sentence;
4. one direct shortest-distance calculation;
5. one direct conclusion;
6. one plain route diagram at the end.

For two non-zero net components, the calculation shows the straight-line step in the form `√(horizontal² + vertical²)` and then the integer, simplified-radical or one-decimal result. For an axis-aligned result, it explains that only one net direction remains after cancellation.

For `DIR-QL-006`, `DIR-QL-007`, `DIR-QL-008` and `DIR-QL-010`, the final diagram includes a light dashed Start-to-Finish line and a separate protected key containing `Shortest distance` and its value. The key contains no crossing line. `DIR-QL-009` does not show this overlay because its answer demand is the missing movement length rather than displacement.

The route diagram otherwise remains plain: Start, Finish, route arrows, distances, turn points and a small compass. It does not contain coordinates, final-facing arrows, heavy method boxes or embedded solution commentary.

## Validation

The checkpoint proof generates `120` seeds per QL (`600` cases total) and checks:

- deterministic replay;
- continuous `DIR-QL-006` through `DIR-QL-010` allocation;
- material-need evidence and open `solveMode` policy;
- four unique options with one correct answer;
- independent-solver agreement;
- movement/explanation/diagram parity;
- shortest-distance calculation presence for all displacement QLs;
- exact one-to-one Start-to-Finish dashed-line and key presence;
- no shortest-distance overlay for the inverse missing-movement QL;
- no line inside the shortest-distance key;
- reserved compass/footer zones and unobstructed key text;
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
