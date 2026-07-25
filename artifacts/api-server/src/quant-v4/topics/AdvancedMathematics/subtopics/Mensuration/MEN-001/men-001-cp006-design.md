# MEN-001 CP-006 — Boundary Conservation, Scaling & Unit Transformation

## Status

Runtime-proof design for the final planned checkpoint of MEN-001.

The current QL and solve-mode counts are an implementation snapshot, not quotas. Further expansion is justified only when it introduces a genuinely different governing equation, conserved quantity or transformation contract.

## Ownership

CP-006 owns plane-mensuration questions whose main difficulty is one of the following:

1. changing linear or square units correctly;
2. reconciling mixed units before using a mensuration formula;
3. applying or reversing similarity scale laws;
4. calculating area change from changes in one or both dimensions;
5. converting map or plan measurements into actual lengths or areas;
6. conserving a complete boundary while wire is reshaped into another standard figure;
7. comparing areas of figures with a common perimeter;
8. identifying the maximum rectangular area available from a fixed boundary.

## Current solve-contract inventory

### Unit conversion and mixed units

- centimetres to metres;
- metres to centimetres;
- square centimetres to square metres;
- square metres to square centimetres;
- rectangle area with one dimension in metres and the other in centimetres;
- rectangle perimeter with mixed length units;
- missing rectangle length from square-metre area and centimetre breadth;
- square area in square metres after converting a centimetre side.

### Similarity and scaling

- perimeter after a linear scale change;
- area after a linear scale change;
- linear scale factor from perimeter ratio;
- linear scale factor from area ratio;
- original area from scaled area and linear factor;
- area percentage increase after uniform enlargement;
- area percentage decrease after uniform reduction;
- net area percentage change when length increases and breadth decreases;
- new area after independent percentage changes in length and breadth.

### Map and plan scaling

- actual length from map length and scale;
- map length from actual length and scale;
- actual area from map area and linear scale;
- map area from actual area and linear scale;
- actual rectangular plot area from two plan dimensions.

### Boundary conservation and wire reshaping

- rectangle length from square wire and known breadth;
- square side from rectangular wire;
- circle radius from square wire;
- square side from circular wire;
- circle radius from rectangular wire;
- equilateral-triangle side from square wire;
- regular-hexagon side from square wire;
- square area from rectangular wire;
- rectangle breadth from circular wire and known length;
- circle area from square wire;
- square area from circular wire.

### Fixed-boundary area reasoning

- area increase when a rectangle is reshaped into a square with the same perimeter;
- maximum rectangular area for a fixed perimeter;
- circle-versus-square area difference at the same perimeter.

## Explanation contract

Every CP-006 QL has a human-authored contextual profile and solve-family working.

The normal explanation flow is:

1. identify the invariant or conversion being used;
2. state the relevant unit relation, scale law or conserved boundary;
3. calculate an intermediate converted measure or common boundary where needed;
4. substitute the generated values;
5. evaluate the target quantity;
6. state the answer in the context of the question.

This is not a rigid six-line template. Direct transformations normally render in five meaningful steps. Multi-stage percentage, plan-area, comparison and reverse-area questions retain six. Generic padding, decorative checks and automatic prose compaction are not used for CP-006.

## Diagram policy

All current CP-006 questions are text-sufficient. No question-stem diagram or explanation illustration is generated.

A future diagram is justified only if the transformation cannot be stated unambiguously in text. It must not be added merely to decorate a wire-reshaping or scale question.

## Explicit exclusions

- paths, flooring, fencing and rate applications remain with CP-004;
- composite, shaded, inscribed and regular-polygon decomposition remains with CP-005;
- theorem and property reasoning remains with Geometry;
- trigonometric side recovery remains with Trigonometry;
- three-dimensional similarity and volume scaling belong to a later solid-mensuration package;
- currency applications are not introduced merely to create story variation.

## Runtime and publication policy

- English only;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`;
- no Question Studio, generation-engine, admin or public mock-test routing during this checkpoint;
- circular transformations use explicit `π = 22/7` in every stem and solver state.
