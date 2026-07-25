# DIR-CP-004 Implementation Report

Status: English runtime implemented on a feature branch; manual editorial review pending.

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

The diagram contains named nodes, light relation arrows, small distance labels and a compass. Direction-distance questions add a dashed query line and protected shortest-distance key. Collinearity uses one extended light alignment guide. Coincident names share one readable rounded node.

Node sizes adapt to name length. Relation-distance labels are placed by a collision-aware layout pass and cannot touch named nodes, overlap one another, or enter the shortest-distance key zone. The query shortcut is drawn behind relation labels so no dashed line crosses their text.

## Proof

The checkpoint proof generates `120` seeds per QL (`600` cases total) and checks deterministic replay, strict option uniqueness, independent-solver agreement, all-eight-direction coverage for `DIR-QL-011/012`, unique entity lookup, exact collinearity, unique coincidence, graph-traversable placement explanations, explanation/diagram parity, adaptive node sizing, distance-label collision freedom, reserved key zones, renderer-specific overlays, stem diversity and balanced answer positions.

## State

- English editorial review: pending.
- Hindi: not started.
- Punjabi: not started.
- Question Studio exposure: not enabled.
- Freeze status: not claimed.
