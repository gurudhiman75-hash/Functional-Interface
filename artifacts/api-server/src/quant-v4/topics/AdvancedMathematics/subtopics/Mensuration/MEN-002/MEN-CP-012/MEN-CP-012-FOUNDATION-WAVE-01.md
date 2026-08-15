# MEN-CP-012 — Recasting, Melting & Volume Conservation — Foundation Wave 01

Authority: `MEN-CP012-FOUNDATION-WAVE-01-V1`

## Status

Executable discovery only.

This wave does **not** freeze permanent QLs, Question Studio discovery, Question Bank storage, scored-test eligibility, or publication.

## Governing rule

Recasting conserves **material volume** unless the stem explicitly declares loss or wastage.

Surface area is never conserved merely because a solid is melted, drawn, rolled, or recast.

For loss-aware states:

```text
usable source material = source volume × retained fraction
retained fraction = 1 − loss fraction
usable source material = total target material
```

Every Wave 01 state stores a conservation statement and an explicit loss fraction; zero-loss questions store loss as exactly zero.

## Wave 01 executable inventory

16 prototypes are intentionally kept separate during discovery:

1. sphere → many smaller spheres: count;
2. cylinder → many spheres: count;
3. cube → many smaller cubes: count;
4. cylinder → cone: target height;
5. cone → cylinder: target height;
6. cuboid → cube: cube side;
7. sphere → cylinder: target height;
8. cylindrical rod → thinner wire: length;
9. rod → wire with cm-to-m answer conversion;
10. two source spheres → one cylinder;
11. cube → smaller cubes with explicit wastage;
12. inverse source-cylinder height with explicit wastage;
13. hollow-cylinder material → solid cylinders;
14. slab → thinner sheet with volume conservation;
15. metre-scale cube → centimetre-scale cubes;
16. many cones → one cylinder.

## Provisional reasoning clusters

These are discovery clusters, **not permanent QLs**:

```text
ONE_TO_MANY_COUNT
ONE_TO_ONE_INVERSE
WIRE_SHEET_DRAWING
COMBINED_SOURCE_SOLIDS
WASTAGE_CONSERVATION
HOLLOW_TO_SOLID_CONSERVATION
UNIT_CONVERSION
```

Wave 02 must determine which prototypes are true reasoning identities and which are merely shape/context representations of a smaller permanent family.

## Ownership boundaries

CP-012 owns the decisive **material-conservation transformation**.

- Simple direct source/target shape formula questions stay with CP-007/008/009/010.
- Hollow geometry by itself stays with CP-011; when a hollow object's material is melted and recast, CP-012 owns the conservation transformation.
- Composite/immersed/displacement states stay with CP-013 unless recasting itself is the decisive reasoning.
- Density/mass problems remain outside MEN-002 unless the decisive task is geometric volume conservation.

## Exam-realism rules from Wave 01 onward

- stems must say whether material loss is zero or nonzero;
- dimensions must lead to clean competitive-exam arithmetic unless approximation is explicitly requested;
- count answers must be positive integers;
- wire/sheet questions must conserve cross-sectional area × length or area × thickness as appropriate;
- unit conversion must occur at a declared stage and must not confuse linear and cubic conversion factors;
- distractors should reflect wrong volume ratio, missed conservation factor, or source/target inversion—not random arithmetic noise;
- explanations must show the actual conservation equation and numeric substitution.

## Proof target

```text
16 prototypes × 64 deterministic seeds = 1,024 proof packages
16 prototypes × 4 answer positions = 64 human-review records
```

Required Wave 01 gates:

- deterministic replay;
- exact answer replay;
- four unique options;
- exactly one correct option;
- A/B/C/D reachability for every prototype;
- 16/16/16/16 review-position balance;
- exact conservation verification;
- explicit loss metadata;
- no permanent QL allocation;
- no Question Studio / Question Bank / test / publication activation.

## Next checkpoint

After Wave 01 passes and the 64-question review is inspected, Wave 02 should expand source/exam coverage around:

- sphere/cylinder/cone/cube cross-shape count and inverse forms;
- mixed source solids;
- partial wastage and yield percentage;
- wire diameter versus radius phrasing;
- rod/sheet thickness transformations;
- capacity-unit recasting where legitimate;
- hollow-to-solid material transformations;
- reverse questions asking source count/dimension;
- source-backed SSC and other exam patterns;
- merge/split/reassign audit against CP-011 and CP-013.
