# MEN-001 CP-004 Content Audit

## Checkpoint

`MEN-CP-004 — Paths, Borders, Flooring, Fencing and Cost Applications`

This checkpoint extends the existing MEN-001 runtime proof. It does not publish questions or wire them into Question Studio or public generation routing.

## Final current coverage

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
- tile count for an inside rectangular border;
- uncovered floor area after placing a rectangular mat;
- painting cost after excluding a rectangular door;
- paving-tile count for an outside rectangular path;
- fencing cost for multiple complete rounds.

The current authority range is `MEN-001-QL-301` through `MEN-001-QL-324`.
The inventory contains 24 English QLs across 23 registered solve modes. These figures describe this checkpoint; the runtime remains registry-derived rather than dependent on a hardcoded package total.

## Ownership and separation

- English stems and explanation strategies are human-owned.
- Every QL declares exactly three named misconception strategies.
- Question-stem diagrams remain `NONE`; all required measurements are textual.
- Explanation illustrations are restricted to path/border states where outer-versus-inner geometry materially clarifies the solution.
- Tile count uses a first-class `COUNT / TILES / tiles` answer contract.
- CP-006 retains ownership of mixed-unit conversion, scaling and boundary-conservation transformations.

## Exact-state and realism policy

- all generated dimensions, rates, counts and costs are positive;
- path and border areas are exact outer-minus-inner differences;
- circular states preserve integer values under `π = 22/7`;
- circular path width is limited to 7 m and remains proportionate to the retained radius;
- floor and border areas divide exactly by tile area;
- metre-based outside-path paving uses realistic `1 m × 0.5 m` slabs;
- wall and door states use realistic exam-context dimensions;
- gates are strictly smaller than their enclosing boundary;
- all costs and counts remain exact integers.

## Runtime proof

Final verified branch head:

`d0cc90a570185765d8854626b2d00a972fb6652d`

Successful dedicated workflow run:

`30100794518`

The package-wide workflow verified:

1. QL, task-registry and solve-mode exhaustiveness;
2. deterministic generation across all 99 active QLs;
3. 1,980 generated runtime cases at 20 seeds per QL;
4. exact answer and unit compatibility, including tile counts;
5. four unique misconception-derived options with no generic fallback;
6. path-area, tile-count, cost and gate-conservation invariants;
7. explicit π policy for circular application questions;
8. explanation-illustration necessity, accessibility and font neutrality;
9. generation and upload of 297 human-review samples.

## Deliberately excluded

- mixed centimetre/metre conversion;
- scale-factor transformations;
- perimeter-preserving reshaping;
- Hindi and Punjabi content;
- production SVG/UI rendering;
- Question Studio and generation-engine integration;
- public publication or mock-test exposure.
