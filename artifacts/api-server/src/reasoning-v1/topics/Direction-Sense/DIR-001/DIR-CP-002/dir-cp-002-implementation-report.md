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

## Runtime implemented

- deterministic two-to-five-leg cardinal paths;
- relative forward movement with right, left and about turns;
- bounded deterministic rejection of zero-displacement paths;
- endpoint query in both final-from-start and start-from-final directions;
- compound endpoint/facing answer contract;
- independent path replay that does not call the production `solvePath` function;
- coordinate and facing agreement checks;
- misconception-driven direction and compound distractors;
- structured prompts and value-grounded coordinate explanations;
- chapter-registry discovery for `DIR-QL-004` and `DIR-QL-005`;
- 200-seed-per-QL exhaustive test.

## Logic-audit results

A source-equivalent audit of the committed deterministic algorithm covered 400 generated cases:

```text
QL count:                    2
Seeds per QL:                200
Generated cases:             400
Endpoint-direction coverage: 8 / 8
Final-facing coverage:       North, East, South, West
Query-reference coverage:    forward and reversed
Difficulty coverage:         Easy, Medium, Hard
Stem diversity:              200 / 200 for each QL
Answer positions:            112, 95, 87, 106
Max/min ratio:               1.287
Required ratio:              below 1.35
```

The audit also verified deterministic reconstruction, non-zero endpoint paths, option uniqueness and independent state agreement in the equivalent runtime model.

## Execution honesty

- Tests written: yes.
- Source-equivalent deterministic logic audit: passed.
- Exact committed test from a checked-out repository: not executed because the execution sandbox could not resolve `github.com` for the sparse clone.
- GitHub Actions: pending after draft PR creation.
- English human editorial review: not complete.
- Hindi and Punjabi runtime: not started.
- Freeze-ready: no.

## Next need-based decision

Do not add another CP-002 QL merely for volume. First inspect exam material for another path question whose hidden state, answer demand, independent solver or option contract is materially distinct. Otherwise complete English editorial review of these two QLs and proceed to `DIR-CP-003` for distance, displacement and shortest return.
