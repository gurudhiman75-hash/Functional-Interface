# Trigonometry Cross-Chapter Authority Map

Status: **Phase 0 design authority**.

Purpose: prevent duplicate QLs and ambiguous ownership while Trigonometry is implemented alongside Geometry, Mensuration, Algebra and Time/Speed/Distance.

## Trigonometry owns

- right-triangle side relationships when the requested target is a trigonometric ratio or trig-derived side;
- exact standard trigonometric values;
- degree/radian conversion used in trigonometric evaluation;
- complementary and controlled reduction relations;
- fundamental and controlled derived trigonometric identities;
- exact trig expression evaluation/simplification;
- finite standard-angle trig equations;
- triangle area specifically through `1/2 ab sin C` as a controlled trig application;
- angles of elevation and depression;
- heights and distances from one or more observations;
- shadows, ladders, guy wires and broken-object problems when the decisive relation is trigonometric;
- observer-height and opposite-side line-of-sight systems.

## Geometry owns

- pure Pythagoras questions whose target is a side/diagonal without a trig requirement;
- triangle congruence/similarity as primary target;
- theorem-based angle chasing;
- circle/chord/tangent/centre theorems;
- general geometric properties independent of trig ratios.

### Boundary rule

A Trigonometry QL may use Pythagoras or a geometry theorem as a support node. If the target can be fully answered as a pure Geometry question and trig adds no meaningful reasoning, the QL belongs to Geometry.

## Mensuration owns

- perimeter/circumference;
- area as a measurement target;
- surface area;
- volume;
- capacity;
- measurement cost/rate applications;
- recasting and displacement.

### Boundary rule

`1/2 ab sin C` is retained as controlled Trigonometry because the decisive operation is a trig value. Other routine triangle-area questions remain Mensuration/Geometry according to their target.

A tower/building question asking height from an angle of elevation belongs to Trigonometry even though the answer has a length unit.

## Algebra owns

- generic equations and simplification without a decisive trig relationship;
- polynomial/rational manipulation as primary target.

### Boundary rule

`a sin(theta) = b cos(theta)` belongs to Trigonometry because the intended reduction is to a trig ratio. Algebraic manipulation remains a support node.

## Ratio & Proportion owns

- abstract ratio/proportion/scaling as primary target.

### Boundary rule

A ratio such as opposite:adjacent used to derive `tan(theta)` belongs to Trigonometry. A generic proportionality question does not.

## Time, Speed & Distance owns

- ordinary linear motion;
- train/boat/race motion systems;
- time-distance-speed equations.

### Initial exclusion boundary

Navigation/bearings, wind vectors and general two-dimensional heading systems are not silently absorbed into Trigonometry Phase 0. They require a later explicit authority decision.

## Coordinate Geometry

Coordinate Geometry may provide an **independent verifier** for `TRG-002`, but that does not transfer student-facing ownership. Coordinate reconstruction is an internal QA mechanism unless the actual question explicitly asks for Cartesian methods.

## Diagram ownership

- Geometry owns theorem/property diagrams.
- Mensuration owns measurement/composite-shape diagrams.
- Trigonometry owns right-triangle ratio diagrams and line-of-sight/elevation/depression diagrams.

A shared low-level diagram renderer may be reused, but each family owns the semantic state and validation rules for its diagrams.

## Duplicate-prevention test questions

Before accepting a new Trigonometry QL, ask:

1. Is the decisive target trigonometric?
2. Would the question remain essentially unchanged if all trig language were removed?
3. Is a different family already the natural student-facing owner?
4. Is the new QL mathematically distinct, or only a context/numeric reskin?
5. Does it fit one of the locked `TRG-CP-001...010` families?

If answers indicate another family owns the problem, do not add the QL to Trigonometry.
