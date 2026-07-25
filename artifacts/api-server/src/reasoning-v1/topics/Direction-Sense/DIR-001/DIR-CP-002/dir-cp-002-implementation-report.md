# DIR-CP-002 Implementation Report

Status: English runtime implemented on `feat/dir-cp-002-path-facing`; human editorial review remains open.

## Implemented QLs

| QL | Answer demand | Material difference |
|---|---|---|
| `DIR-QL-004` | Endpoint direction | Replays an ordered path and answers either final-from-start or start-from-final |
| `DIR-QL-005` | Endpoint direction plus final facing | Produces a compound answer containing two independently derived state properties |

No standalone final-facing-after-path QL was added because ordinary path distances would not contribute to that answer.

## Exam-style question contract

Every stem is one continuous paragraph. It states:

- the starting facing direction;
- the first distance;
- each subsequent turn followed by the next distance;
- the exact relation or compound result required.

The stem does not use numbered instructions, point labels, coordinate language, or disclose the compass direction after each turn.

## Explanation contract

Every explanation now contains only:

1. one short opening sentence stating the initial facing and that the turns will be read in order;
2. one plain sentence per movement leg;
3. one direct conclusion;
4. one plain movement diagram as the final field.

Coordinate calculations, method boxes, trap discussions, step cards, and long formal solutions were removed from the learner-facing explanation.

Example movement walkthrough:

```text
First, Aman walks 8 metres South.
After turning right, Aman walks 12 metres West.
```

## Diagram contract

The diagram is intentionally limited to:

- a Start marker;
- a Finish marker;
- small dots at intermediate turns;
- one arrow per actual movement leg;
- the distance on each leg;
- a small compass;
- a not-to-scale note.

The diagram does not display the answer, requested relation, final-facing solution, coordinates, legends, or explanatory paragraphs.

To prevent visually misleading diagrams, generation rejects paths that:

- revisit any earlier point;
- retrace or overlap an earlier leg;
- cross a non-adjacent leg.

This means every accepted diagram is a simple non-self-intersecting route.

## Exact validation

GitHub Actions run `30151612613` passed on head `fe4aa5a51a58943e8aaf3a086b0d4df8fe8f0eea`:

- strict DIR-001 TypeScript check;
- foundation and CP-001 regression proofs;
- 400 deterministic CP-002 cases;
- continuous exam-style stems;
- exactly one initial compass direction disclosed in each stem;
- one movement explanation line per generated leg;
- no coordinate-heavy learner solution;
- diagram emitted last;
- unique route points;
- no overlapping or self-intersecting legs;
- no answer or final-facing annotation inside the SVG;
- all eight endpoint directions;
- all four final facings;
- both query references;
- Easy, Medium and Hard coverage;
- at least 180 unique stems per QL;
- answer-position balance below the required `1.35` ratio.

The generated 10-question HTML review corpus was also visually inspected. Route lines, distance labels, Start/Finish markers and the compass remained readable across the sampled path shapes.

## Execution honesty

- Tests written and run: yes.
- Review exporter run: yes.
- English human editorial acceptance: pending.
- Hindi and Punjabi runtime: not started.
- Freeze-ready: no.
