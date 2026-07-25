# DIR-CP-002 Implementation Report

Status: first need-based English path runtime implemented on `feat/dir-cp-002-path-facing`.

## Implemented QLs

Only two QLs are currently justified:

| QL | Answer demand | Material difference |
|---|---|---|
| `DIR-QL-004` | Endpoint direction | Replays an ordered movement path and classifies the final coordinate from either query reference |
| `DIR-QL-005` | Endpoint direction plus final facing | Produces and validates a compound answer containing two independently derived state properties |

A standalone final-facing-after-path QL was not added. In ordinary distance-bearing stems, displayed distances would not contribute to the facing answer, violating the chapter rule that displayed elements should have a reasoning role.

Single versus multiple turns, right/left/about turns, path length, query reversal, names and wording variants remain generated-instance variation.

No fixed solve-mode enum is used. Runtime metadata reports `solveMode: null`.

## Statement-quality correction

Compressed path prose was removed. Every stem now has this explicit structure:

1. name point `O` as the starting point;
2. state the initial facing direction;
3. label every reached point `A`, `B`, `C`, and so on;
4. state each movement as one numbered operation;
5. state that movement occurs without turning;
6. state each turn as a separate numbered operation;
7. state that a turn changes facing without changing position;
8. name the exact reference point and subject point in the final question.

The runtime no longer uses vague demands such as “Where is the final position relative to the start?” It asks forms such as:

```text
Taking point O as the reference point, in which direction is point B located?
```

or the explicitly reversed form:

```text
Taking point B as the reference point, in which direction is point O located?
```

## Explanation and diagram contract

Every explanation is point-wise and includes:

- numbered steps;
- a title for every step;
- the compass-coordinate convention;
- the coordinate before and after every movement;
- the displacement vector for every leg;
- an explicit statement that turns do not change coordinates;
- the before-facing, turn direction/angle and after-facing;
- separate resolution of the reference-to-subject relation;
- separate final-facing resolution for compound questions;
- a detailed conclusion that repeats the reference, subject and answer;
- misconception rejection;
- a final structured movement diagram.

The diagram is emitted both as a machine-readable `PathDiagramSpec` and a self-contained SVG. It contains:

- labelled points and coordinates;
- solid route arrows for actual movement;
- distance and compass-direction labels on each leg;
- a dashed red arrow for the exact relation asked;
- a purple final-facing arrow for compound questions;
- a warning that the diagram is not necessarily to scale.

The `diagram` field is deliberately the final explanation field, and the test enforces this ordering.

## Runtime implemented

- deterministic two-to-five-leg cardinal paths;
- relative forward movement with right, left and about turns;
- bounded deterministic rejection of zero-displacement paths;
- endpoint query in both final-from-start and start-from-final directions;
- compound endpoint/facing answer contract;
- independent path replay that does not call the production `solvePath` function;
- coordinate and facing agreement checks;
- misconception-driven direction and compound distractors;
- structured prompts with labelled points;
- chapter-registry discovery for `DIR-QL-004` and `DIR-QL-005`;
- 200-seed-per-QL exhaustive test;
- retained CI diagnostics for future editorial failures.

## Exact runtime-proof results

GitHub Actions run `30149562665` executed the committed branch and passed:

```text
DIR-001 strict typecheck:          passed
Foundation proof:                  passed
DIR-CP-001 proof:                  passed
DIR-CP-002 proof:                  passed
QL count:                          2
Seeds per QL:                      200
Generated cases:                   400
Unambiguous point-labelled stems:  passed
Detailed numbered explanations:    passed
Diagram-last contract:             passed
Diagram/answer relation parity:    passed
Endpoint-direction coverage:       8 / 8
Final-facing coverage:             North, East, South, West
Query-reference coverage:          forward and reversed
Difficulty coverage:               Easy, Medium, Hard
Stem diversity:                    200 / 200 for each QL
Answer positions:                  112, 95, 87, 106
Max/min ratio:                     1.287
Required ratio:                    below 1.35
```

The first strengthened run correctly rejected a conclusion that was mathematically correct but too terse. The conclusion was expanded to restate the reference point, subject point and answer direction, and the unchanged quality gate then passed.

## Execution honesty

- Tests written: yes.
- Exact committed tests in GitHub Actions: passed.
- GitHub Actions workflow: `Validate DIR-001 runtime proof`, run `30149562665`.
- English human editorial review: still required across exported samples.
- Hindi and Punjabi runtime: not started.
- Freeze-ready: no.

## Next need-based decision

Do not add another CP-002 QL merely for volume. First visually inspect the point-labelled statements, detailed explanations and SVG diagrams. If no additional hidden-state, answer-demand, solver or renderer contract is found, merge CP-002 and proceed to `DIR-CP-003` for distance, displacement and shortest return.
