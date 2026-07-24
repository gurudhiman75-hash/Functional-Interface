# MEN-001 / MEN-CP-003 Content Audit

## Ownership

`MEN-CP-003 — Circles, Arcs, Sectors & Annular Regions`

This checkpoint remains inside `MEN-001 — Plane Mensuration & Boundary Transformations`. It does not claim path, border, flooring, fencing, scaling or unit-conversion ownership belonging to later CPs.

## Current admitted coverage

The active checkpoint contains 23 English QLs. This is a coverage observation, not a quota or terminal count.

The QLs cover:

- circumference from radius or diameter;
- circle area and reverse radius recovery;
- circle area recovered from circumference;
- semicircle and quadrant area/perimeter;
- arc length;
- sector area and perimeter;
- central-angle recovery from arc length or sector area;
- annular area and reverse outer-radius recovery;
- wheel distance from complete revolutions.

The runtime contains 18 CP-003 solve modes because the admitted QLs require distinct generation, solver, evidence and validation contracts.

## Mathematical policy

- Every CP-003 stem explicitly states `π = 22/7`.
- Solver evidence records the same policy.
- Deterministic state families are selected so canonical answers remain exact integers.
- Radius, diameter, circumference, area, angle and annular-order invariants are independently validated.
- Central-angle answers use an explicit degree dimension and unit contract.

## Question and illustration policy

All current stems state every required measurement textually, so question diagrams remain disabled.

Explanation-only illustrations are used where they materially improve reasoning:

- semicircle/quadrant boundary = curved part plus straight edges;
- arc/sector = central-angle fraction of a circle;
- annulus = outer circle minus inner circle.

Unknown quantities remain symbolic before calculation. Illustration payloads are structured, accessible, font-neutral and marked not to scale.

## Distractor policy

Each QL declares exactly three misconception strategies. Strategies model formula or interpretation errors such as:

- radius/diameter confusion;
- circumference/area confusion;
- missing `2`, `π`, square or square root;
- using 180 instead of 360 for arc/sector fractions;
- omitting straight edges from partial-circle perimeter;
- adding circle areas instead of subtracting them for an annulus;
- multiplying revolutions by radius or diameter rather than circumference.

Generic answer offsets and fallback options are prohibited. Runtime generation rejects duplicate distractors and correct-answer collisions.

## Maturity and exposure

- maturity: `RUNTIME_PROOF`
- language: English only
- publicly publishable: false
- Question Studio routing: not enabled
- public mock-test routing: not enabled

## Remaining maturity gates

- successful full MEN-001 workflow across every active CP and QL;
- human review of generated circle questions and explanations;
- browser review of the three new explanation-illustration families;
- editorial acceptance before any preview or publication wiring.
