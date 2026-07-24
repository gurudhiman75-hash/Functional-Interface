# MEN-001 CP-004 Content Audit

## Checkpoint

`MEN-CP-004 — Paths, Borders, Flooring, Fencing and Cost Applications`

This checkpoint extends the existing MEN-001 runtime proof. It does not publish questions or wire them into Question Studio or public generation routing.

## Current coverage

- outside and inside rectangular paths;
- outside and inside square borders;
- outside and inside circular paths under explicit `π = 22/7`;
- direct paving/path cost;
- reverse square-path width recovery;
- rectangular and square tile counts;
- tile purchase cost and area-rate flooring cost;
- rectangular fencing, gate exclusions and multiple wire rounds;
- circular fencing under explicit `π = 22/7`;
- reverse gate-width recovery;
- tile count for an inside rectangular border.

The inventory is coverage-driven. The current QL and solve-mode totals are checkpoint observations, not fixed quotas or terminal IDs.

## Ownership and separation

- English stems and explanation strategies are human-owned.
- Every QL declares exactly three named misconception strategies.
- Question-stem diagrams remain `NONE`; all required measurements are textual.
- Explanation illustrations are restricted to path/border states where outer-versus-inner geometry materially clarifies the solution.
- Tile count uses a first-class `COUNT / TILES / tiles` answer contract.
- CP-006 retains ownership of mixed-unit conversion, scaling and boundary-conservation transformations.

## Exact-state policy

- all generated dimensions, rates, counts and costs are positive;
- path and border areas are exact outer-minus-inner differences;
- circular states preserve integer values under `π = 22/7`;
- floor and border areas divide exactly by tile area;
- gates are strictly smaller than their enclosing boundary;
- all costs and counts remain exact integers.

## Required runtime proof

The package workflow must verify:

1. QL, task-registry and solve-mode exhaustiveness;
2. deterministic generation across every active QL;
3. exact answer and unit compatibility, including tile counts;
4. four unique options with no generic fallback;
5. path-area, tile-count, cost and gate-conservation invariants;
6. explicit π policy for circular application questions;
7. explanation-illustration necessity, accessibility and font neutrality;
8. successful generation of human-review exports.

## Deliberately excluded

- mixed centimetre/metre conversion;
- scale-factor transformations;
- perimeter-preserving reshaping;
- Hindi and Punjabi content;
- production SVG/UI rendering;
- Question Studio and generation-engine integration;
- public publication or mock-test exposure.
