# Trigonometry Quant V4 Authority Lock

Status: **Phase 0 design lock**. This file authorizes architecture and numbering only. It does **not** claim runtime implementation, publication, Question Studio registration, or exam-mix activation.

## Student-facing family

- `Trigonometry` is a separate Advanced Mathematics family.
- Mensuration remains a separate measurement family.
- Geometry remains the owner of theorem/property reasoning.
- Heights & Distances is part of Trigonometry, not Mensuration.

## Runtime packages

### `TRG-001` — Trigonometric Ratios, Exact Values & Identities

1. `TRG-CP-001` — Right-Triangle Ratios, Reciprocals & Side Recovery — 24 QLs.
2. `TRG-CP-002` — Standard Angles & Exact Evaluation — 24 QLs.
3. `TRG-CP-003` — Angle Measures, Complementary Relations & Reduction — 24 QLs.
4. `TRG-CP-004` — Fundamental Identities & Expression Simplification — 24 QLs.
5. `TRG-CP-005` — Derived Ratios, Algebraic Relations & Controlled Equations — 24 QLs.
6. `TRG-CP-006` — Mixed Exam Expressions & Controlled Applications — 24 QLs.

Production target: **144 English QLs** using package-local contiguous IDs `TRG-001-QL-001...TRG-001-QL-144`.

### `TRG-002` — Heights & Distances Applications

7. `TRG-CP-007` — Single-Observation Elevation & Depression — 24 QLs.
8. `TRG-CP-008` — Shadows, Ladders, Poles & Broken Objects — 24 QLs.
9. `TRG-CP-009` — Two-Observation & Moving-Point Systems — 24 QLs.
10. `TRG-CP-010` — Observer Height, Opposite-Side & Composite Sight-Line Systems — 24 QLs.

Production target: **96 English QLs** using package-local contiguous IDs `TRG-002-QL-001...TRG-002-QL-096`.

## Chapter total

- Packages: **2**
- Canonical problems: **10**
- English production QLs: **240**
- Primary English human review target: **240 / 240 QLs**

## Degree/radian decision

Degree and radian measures are first-class Trigonometry coverage.

`TRG-CP-003` owns:

- degree-to-radian and radian-to-degree conversion;
- standard exact radian forms such as `pi/6`, `pi/4`, `pi/3`, `pi/2` and `pi`;
- complementary relations;
- controlled reduction through `90°`, `180°`, `270°`, `360°` and periodic equivalents;
- reference-angle/quadrant sign reasoning where needed by competitive-exam questions.

Radians do not authorize advanced unit-circle theory, graph-heavy theory, calculus, or general trigonometric-equation coverage.

## Exact-answer authority

Published mathematics must preserve exact form until approximation is explicitly requested.

Required canonical answer forms:

- integer;
- rational;
- surd;
- rational-surd;
- rational multiple of `pi`;
- explicitly intentional undefined trig value where the question asks about domain/undefinedness.

Examples such as `sqrt(3)/2`, `sqrt(3)/3`, `20sqrt(3)` and `pi/6` must not be replaced by floating-point approximations in the authoritative solution.

Equivalent exact forms must normalize to one mathematical value. For example `1/sqrt(3)` and `sqrt(3)/3` cannot appear as distinct answer options.

## Canonical-state rule

Stem, solver, explanation, distractors and future diagrams must derive from one canonical mathematical state.

For `TRG-002`, the canonical state must explicitly model observer positions, vertical objects, ground line, eye height when applicable, sight lines, angles and horizontal separations. Prose is never the mathematical authority.

## Independent verification rule

Independent mathematical verification is mandatory from the first runtime proof.

- `TRG-CP-001`: side-ratio/Pythagorean reconstruction.
- `TRG-CP-002`: reconstruction from canonical special triangles rather than merely re-reading the production lookup table.
- `TRG-CP-003`: normalized-angle evaluation.
- `TRG-CP-004...006`: independent algebraic/numerical checks at safe non-singular angles where applicable.
- `TRG-002`: independent coordinate-geometry reconstruction of heights, distances and sight-line angles.

The verifier may use floating point as a tolerance-based checker. Published answers remain exact whenever the problem admits an exact answer.

## Diagram policy

### `TRG-001`

- diagram optional for most symbolic questions;
- diagram useful for side-role and right-triangle reconstruction questions;
- symbolic identity/standard-value questions normally require no diagram.

### `TRG-002`

Diagram is a first-class requirement for substantive application questions.

Approved strategy families include:

- single elevation;
- single depression;
- shadow;
- ladder;
- broken tree;
- guy wire;
- two observations on same side;
- observer moves closer/farther;
- opposite-side observations;
- observer height;
- building-to-building;
- combined elevation/depression;
- river/horizontal-separation forms.

Diagram labels, geometry and values must be generated from the same canonical state as the solver.

## Ownership boundaries

### Geometry owns

- pure Pythagoras questions;
- similarity/congruence;
- triangle/circle theorem reasoning;
- theorem-first angle/property questions.

Trigonometry may consume Pythagoras or a geometry fact as a support step when the actual target is trigonometric.

### Mensuration owns

- perimeter and area as primary measurement targets;
- surface area, volume and capacity.

Exception: triangle area through `1/2 ab sin C` is an explicitly controlled Trigonometry application.

### Algebra owns

Generic algebraic manipulation. Trigonometry owns an algebraic equation only when the decisive mathematical relation is trigonometric.

### Time, Speed & Distance owns

Ordinary motion. Bearings, navigation vectors and general 2D heading/wind systems are not part of the initial Trigonometry production scope.

## Initial exclusions

The first production chapter does not include as major families:

- inverse trigonometric functions;
- general solutions of trigonometric equations;
- trigonometric graphs;
- Euler formula or complex-number trigonometry;
- hyperbolic functions;
- calculus applications;
- proof-heavy advanced identities;
- trigonometric inequalities;
- sine rule/cosine rule as independent major families;
- 3D trigonometry;
- spherical trigonometry;
- navigation/bearings systems.

## Language policy

- English is the only publishable language during runtime proof/MVP/production build.
- Hindi and Punjabi may receive structural contracts later but remain disabled until separately authored/reviewed and approved.
- No unsupported-language placeholders may be exposed to Question Studio or Test Builder.

## Activation lock

During implementation, Trigonometry remains:

- unpublished;
- test-ineligible;
- absent from production Question Studio registration;
- absent from production Test Builder discovery;
- absent from exam-mix allocation.

Activation requires a later explicit approval after engineering, mathematical, diagram and editorial gates pass.

## Implementation sequence

1. Phase 0 — freeze package/CP/QL architecture, coverage, authority boundaries and exclusions.
2. Phase 1 — build exact-number, angle, standard-value and expression foundations.
3. Phase 2 — prove `TRG-001` with forced representative QLs across all six CPs.
4. Phase 3 — expand `TRG-001` to 72-Ql MVP and review.
5. Phase 4 — complete `TRG-001` to 144 QLs.
6. Phase 5 — build `TRG-002` canonical spatial/diagram foundation.
7. Phase 6 — prove `TRG-002` across all four CPs.
8. Phase 7 — expand `TRG-002` to 48-Ql MVP and review.
9. Phase 8 — complete `TRG-002` to 96 QLs.
10. Phase 9 — chapter-wide canonical, residual, diversity, diagram, duplicate and explanation QA.
11. Phase 10 — freeze candidate and explicit product-owner approval.
12. Phase 11 — English Question Studio registration only after approval.
13. Phase 12 — Hindi/Punjabi localization as a separate acceptance project.

## Phase 0 completion condition

Phase 0 is complete only when the repository contains and agrees on:

- this authority lock;
- machine-readable Phase 0 manifest;
- `TRG-001` and `TRG-002` archetypes;
- complete package-local QL ledgers;
- cross-chapter authority map;
- implementation checkpoint plan;
- zero production registration/activation changes.
