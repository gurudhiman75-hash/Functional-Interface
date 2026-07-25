# DIR-CP-002 Implementation Report

Status: first need-based English path runtime implemented on `feat/dir-cp-002-path-facing`.

## Implemented QLs

Only two QLs are currently justified:

| QL | Answer demand | Material difference |
|---|---|---|
| `DIR-QL-004` | Endpoint direction | Replays an ordered movement path and classifies the final coordinate from either query reference |
| `DIR-QL-005` | Endpoint direction plus final facing | Produces and validates a compound answer containing two independently derived state properties |

A standalone final-facing-after-path QL was not added because ordinary path distances would not contribute to that answer. Path length, names, individual turn combinations and wording remain generated-instance variation. No fixed solve-mode enum is used; runtime metadata reports `solveMode: null`.

## Exam-style statement contract

The earlier point-labelled, numbered-operation stems were rejected as instructional rather than exam-like.

Every generated stem now:

- is one continuous paragraph;
- states only the starting point and initial facing direction;
- gives the first distance;
- continues through right, left or about turns followed by the next distance;
- does not name artificial points `O`, `A`, `B`, and so on;
- does not number operations;
- does not disclose the compass direction after each turn or movement;
- asks directly for the final position from the start, the start from the final position, or the compound position/facing answer.

Representative form:

```text
Aman starts from a point facing South and walks 8 metres. Aman then turns right and walks 12 metres. In which direction is Aman's final position from the starting point?
```

The runtime test enforces one-line prose, exactly one disclosed compass direction in the stem, one `walks` clause per leg, and absence of instructional point labels or facing disclosures.

## Explanation order

Every explanation now follows this fixed editorial order:

1. `given` — three short lines containing the starting direction, simplified directional path and required quantity;
2. `diagram` — a visual representation before calculations;
3. `method` — the intended reasoning approach;
4. detailed solution steps;
5. the exact asked relation;
6. conclusion;
7. closest-trap rejection.

Example simplified path:

```text
9 m West → about-turn → 3 m East → right turn → 12 m South → left turn → 15 m East
```

The detailed steps then introduce `O`, `A`, `B`, and so on only inside the solution, where they help construct the diagram and coordinate calculation.

## Clear diagram contract

The diagram is emitted as both a machine-readable `PathDiagramSpec` and self-contained SVG.

To prevent text obstruction:

- route lines contain only small numbered markers;
- full movement descriptions are placed in a separate right-side legend;
- every legend row has an opaque white background and border;
- the exact asked relation is drawn as a curved dashed red arrow, away from straight route lines;
- its text appears in a separate bottom callout;
- compound questions show the final-facing arrow on the route and its text in the side legend;
- point letters remain inside high-contrast circles;
- no coordinate text is placed across route lines.

The generated HTML review file was visually inspected after CI generation. Adjacent short-leg labels no longer overlap each other or the diagram title.

## Runtime implemented

- deterministic two-to-five-leg cardinal paths;
- forward movement with right, left and about turns;
- bounded rejection of zero-displacement paths;
- both query-reference directions;
- compound endpoint/facing answers;
- independent path replay and coordinate/facing verification;
- misconception-driven distractors;
- chapter-registry discovery for `DIR-QL-004` and `DIR-QL-005`;
- 200-seed-per-QL exhaustive proof;
- HTML and JSONL editorial review export.

## Exact proof

GitHub Actions run `30150926436` passed on runtime head `3a1c1a304230ba06f4c3154d173f212b08222a3c`:

```text
DIR-001 strict typecheck:        passed
Foundation proof:                passed
DIR-CP-001 proof:                passed
DIR-CP-002 proof:                passed
Generated cases:                 400
Exam-style one-line stems:       passed
Only initial direction exposed:  passed
Given-first explanation order:   passed
Curved asked-relation arrow:     passed
Protected movement labels:       passed
Endpoint directions:             8 / 8
Final facings:                   North, East, South, West
Query references:                forward and reversed
Difficulty:                      Easy, Medium, Hard
Stem diversity:                  200 / 200 per QL
Answer positions:                112, 95, 87, 106
Max/min ratio:                   1.287
```

## Execution honesty

- Exact committed runtime tests: passed.
- Generated HTML/JSONL review export: passed.
- Visual inspection of endpoint and compound diagrams: completed for representative generated samples.
- Full English human review of all exported questions: still required.
- Hindi and Punjabi runtime: not started.
- Freeze-ready: no.

## Next boundary

Review the regenerated 10-question HTML corpus. Do not add another CP-002 QL merely for volume. If no new hidden-state, answer-demand, solver or renderer contract is found, merge CP-002 and proceed to `DIR-CP-003` for distance, displacement and shortest return.
