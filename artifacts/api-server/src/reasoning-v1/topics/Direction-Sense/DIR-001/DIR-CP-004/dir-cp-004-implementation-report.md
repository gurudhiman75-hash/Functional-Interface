# DIR-CP-004 Implementation Report

Status: English runtime implemented on a feature branch; manual editorial approval pending.

## Ownership

`DIR-CP-004` owns static relative-position graphs and named point relations. It does not own ordered movement paths (`DIR-CP-002/003`), multiple independent movers (`DIR-CP-005`), coded direction language (`DIR-CP-006`), or advanced contradiction/inverse caselets (`DIR-CP-008`).

## Need-based QLs

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-011` | direction between two entities | branched static graph and arbitrary pair query |
| `DIR-QL-012` | direction plus shortest distance | combined qualitative/numeric graph answer and direct query-line derivation |
| `DIR-QL-013` | entity at a supplied relation | inverse entity lookup with entity-valued options |
| `DIR-QL-014` | collinear group | three-entity line classification rather than pairwise direction |
| `DIR-QL-015` | coincident pair | two independent graph paths resolve to one position and require grouped-node rendering |

Missing-relation reconstruction and contradiction identification were not added because they belong to advanced inverse synthesis rather than ordinary point relations.

## Runtime model

- deterministic connected branched trees;
- four to five relation statements and five or six named entities;
- cardinal relation edges with all eight derived query directions;
- exact axis and Pythagorean distances;
- foundation graph solver plus independent BFS verifier;
- unique inverse lookup, collinear group and coincidence pair;
- misconception-labelled four-option construction;
- `solveMode: null` under the open optional policy.

## Learner-facing contract

1. one natural continuous paragraph of static relation statements;
2. one plain placement sentence per relation;
3. one direct result sentence;
4. a shortest-distance calculation only when asked;
5. one concise conclusion;
6. a plain named-point diagram at the end.

`DIR-QL-011` and `DIR-QL-013` now include a light dashed target-reference guide so the asked relation is immediately visible. `DIR-QL-012` retains the stronger dashed shortest-distance line and protected value key. The ordinary relation guide is visually lighter than the shortest-distance line.

For a two-component shortest distance, the calculation shows the complete progression, for example `√(6² + 8²) = √(36 + 64) = √100 = 10 metres`. Axis-aligned cases explain that only one net direction remains.

The SVG layer order is deliberate: relation edges first, query guide second, distance-label boxes third, and named nodes last. This keeps the guide visible even when it overlaps a direct relation edge while preventing it from crossing label text. Collinearity uses one extended light alignment guide. Coincident names share one readable rounded node.

Node sizes adapt to name length. Relation-distance labels are placed by a collision-aware layout pass and cannot touch named nodes, overlap one another, or enter the shortest-distance key zone.

## Independent review refinements

An independent 25-question mathematical review confirmed every displayed answer, coordinate relation, distance, collinear group and coincident pair. Its two presentation recommendations were implemented systemically:

- target-reference guides for relation-direction and entity-lookup diagrams;
- explicit addition of squared components in Pythagorean shortest-distance working.

A final visual audit then caught and fixed the direct-edge layering case in `DIR-QL-013`; the guide is now visibly dashed above the solid edge.

## Proof

The checkpoint proof generates `120` seeds per QL (`600` cases total) and checks deterministic replay, strict option uniqueness, independent-solver agreement, all-eight-direction coverage for `DIR-QL-011/012`, unique entity lookup, exact collinearity, unique coincidence, graph-traversable placement explanations, explanation/diagram parity, adaptive node sizing, distance-label collision freedom, reserved key zones, exact guide counts, guide type, guide layer order, expanded Pythagorean working, stem diversity and balanced answer positions.

## State

- English mathematical review: passed.
- English manual product approval: pending.
- Hindi: not started.
- Punjabi: not started.
- Question Studio exposure: not enabled.
- Freeze status: not claimed.
