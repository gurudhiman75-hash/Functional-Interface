# MEN-CP-011 — Executable Discovery Plan

## Status

**Executable non-QL discovery authority.**

```text
Package:             MEN-002
Canonical problem:   MEN-CP-011 — Surface Exposure, Open/Closed & Hollow Solids
Language:            English
Permanent QLs:       0
Publication:         disabled
Question Studio:     disabled
Question Bank:       NOT_STORED
Test eligibility:    INELIGIBLE
```

This plan authorises temporary executable prototypes and review-only proof artifacts. It does not freeze QL counts, solve-mode counts, difficulty distributions, cross-shape family boundaries or publication.

## Discovery objective

Discover the complete competitive-exam measurement system in which **surface exposure, missing faces, hollow material or wall thickness** is the decisive reasoning transformation.

Coverage must include:

- open-top, open-bottom, lidless and partially open containers;
- external, internal and combined exposed surface area;
- hollow cubes, cuboids, cylinders, cones, spheres and hemispheres;
- pipes, shells, tubes, vessels and hollow blocks;
- material volume as outer solid minus inner void;
- uniform thickness and inverse-thickness tasks;
- outer/inner radius, diameter, side, length, breadth and height representations;
- joined, stacked, cut, placed or painted solids where hidden faces change exposure;
- coating, plating, polishing, paint, sheet and material-cost applications;
- direct, inverse, ratio, percentage, count and cost tasks;
- exact π, declared `22/7` and declared `3.14` policies;
- source, topology, inverse, unit, representation, misconception and ownership audits.

QL and solve-mode counts are not predetermined. They may be frozen only after source, topology, inverse, edge, representation and ownership audits find no meaningful uncovered reasoning contract.

## Ownership boundary

MEN-CP-011 owns a question when the decisive learner task is one or more of:

- deciding which faces or curved surfaces are exposed;
- subtracting an inner void from an outer solid;
- distinguishing inner from outer surface area;
- using uniform wall thickness to connect inner and outer dimensions;
- accounting for faces hidden by joining, stacking, placement or contact;
- calculating coating, plating, paint or material only on included surfaces.

Reassign when another transformation dominates:

- simple direct CSA/TSA/volume of one intact cube, cuboid, prism, cylinder or cone -> base-shape CP (`MEN-CP-007` or `MEN-CP-008`);
- simple sphere/hemisphere surface or volume -> `MEN-CP-009`;
- pyramid/frustum measurement -> `MEN-CP-010`;
- melting, recasting or conservation of material between shapes -> `MEN-CP-012`;
- drilled or removed solids where composite subtraction/containment is the main reasoning rather than wall thickness -> `MEN-CP-013`;
- two-dimensional annular paths -> `MEN-001`;
- fill/empty rates -> Pipes & Cisterns.

A hollow cylinder or pipe belongs here even though its outer and inner components are cylinders, because the decisive reasoning is **material remaining after removing the inner cylindrical void**.

## Canonical state

Every generated state must derive stem, solver, verifier, options, explanation and diagram from one authority.

```ts
interface MenCp011State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  prototypeId: MenCp011PrototypeId;
  solveMode: MenCp011SolveMode;
  language: "en";
  seed: string;

  outerShape: "CUBE" | "CUBOID" | "CYLINDER" | "CONE" | "SPHERE" | "HEMISPHERE";
  innerShape: null | "CUBE" | "CUBOID" | "CYLINDER" | "CONE" | "SPHERE" | "HEMISPHERE";
  topology: "OPEN" | "CLOSED" | "HOLLOW" | "JOINED" | "PLACED" | "PARTIALLY_EXPOSED";
  operation: "DIRECT" | "INVERSE" | "SUBTRACT" | "EXPOSE" | "HIDE" | "SCALE";

  outerDimensions: DimensionState;
  innerDimensions: DimensionState | null;
  thickness: LengthValue | null;
  openFaces: SurfaceId[];
  closedFaces: SurfaceId[];
  exposedSurfaces: SurfaceId[];
  hiddenSurfaces: SurfaceId[];

  target: "LENGTH" | "AREA" | "VOLUME" | "COST" | "RATE" | "COUNT" | "RATIO" | "PERCENT";
  piPolicy: "EXACT_PI" | "PI_22_OVER_7" | "PI_3_14";
  unitSystem: Men002UnitSystem;
  lifecycle: Men002Lifecycle;
}
```

The state must never infer an inner dimension merely because an outer dimension is known. Every inner/outer relation must be explicit:

```text
inner radius = outer radius − thickness
outer radius = inner radius + thickness
inner side   = outer side − 2 × thickness
outer side   = inner side + 2 × thickness
```

The factor `2 × thickness` is required when thickness occurs on both opposite sides of a linear dimension.

## Topology and surface ledger

Every prototype must maintain an auditable surface ledger.

```ts
interface SurfaceLedgerEntry {
  surfaceId: string;
  shapeOwner: string;
  kind: "PLANE" | "CURVED";
  location: "OUTER" | "INNER" | "CUT" | "JOIN";
  areaExpression: ExactExpression;
  status: "EXPOSED" | "HIDDEN" | "OPEN" | "ABSENT";
  contributionSign: 1 | -1 | 0;
  reason: string;
}
```

Required invariants:

- an absent/open face contributes zero material and zero exposed face area;
- a hidden contact face does not contribute to exposed area;
- a hollow object's material volume is outer volume minus inner void volume;
- internal and external surface areas remain separate until the target explicitly combines them;
- joined solids must remove both touching faces from the external exposed-area total;
- a vessel's open mouth is not a material face;
- a base is included only when the physical context and generated state say it exists.

## Exact arithmetic policy

- Preserve reduced rational values, exact π multiples and exact surds.
- `π = 22/7` is exact rational arithmetic.
- `π = 3.14` is exact `157/50`, not floating-point authority.
- Options are compared structurally after exact simplification.
- No final decimal is introduced unless the generated state explicitly requests approximation.
- All inverse states must have one physically admissible positive answer.

### Difference-of-squares authority

For hollow circular solids, the standard calculation is:

```text
R² − r² = (R − r)(R + r)
```

This identity is mandatory in the Exam Speed tier whenever both `R` and `r` are known or can be recovered without extra algebra.

Example:

```text
25² − 21² = (25 − 21)(25 + 21) = 4 × 46 = 184
```

It must not replace the conceptual explanation that material volume equals outer volume minus inner void.

## Dimensional unit policy

Every value carries dimension metadata.

```text
LENGTH      L
AREA        L²
VOLUME      L³
COUNT       dimensionless integer
COST        currency
RATE        currency per L² or currency per L³
RATIO       dimensionless
PERCENT     dimensionless percentage
```

Required unit rules:

- thickness, radius, diameter, length, breadth and height use linear units;
- cross-sectional ring area uses square units;
- material volume uses cubic units;
- coating/paint area must match the denominator of its rate;
- `1 m = 100 cm`, `1 m² = 10,000 cm²`, `1 m³ = 1,000,000 cm³`;
- no linear conversion factor may be used directly for area or volume;
- all worked steps must retain, transform or explicitly cancel units.

## Candidate reasoning families

The following are discovery axes, not frozen QLs.

### A. Open and closed containers

- cube/cuboid box without lid: sheet area;
- open-top rectangular tank: internal or external area;
- cylinder open at one end: CSA plus one base;
- cylinder open at both ends: curved area only;
- hemispherical bowl: inner curved area;
- conical vessel without base: curved area;
- missing-face inverse: recover dimension from open-container area;
- cost of sheet, paint or lining for selected surfaces.

### B. Hollow material volume

- hollow cylinder/pipe from outer radius, inner radius and length;
- hollow cylinder from outer/inner diameters;
- pipe from outer radius and uniform thickness;
- hollow cuboid/block from outer and inner dimensions;
- hollow cube from outer side and thickness;
- spherical shell from outer and inner radii;
- hemispherical shell and bowl material volume;
- conical shell subject to physically valid thickness representation;
- inverse radius, inner radius, length or thickness from material volume.

### C. Inner and outer surface area

- external curved surface only;
- internal curved surface only;
- both internal and external curved surfaces;
- end-ring areas for a hollow pipe;
- total surface area of a closed hollow tube including annular ends;
- lining versus outer painting;
- rate/cost with different inner and outer rates;
- inverse dimensions from combined surface evidence.

### D. Exposure after joining or placement

- cubes joined in a row, rectangle or block;
- cuboids joined face-to-face;
- solids placed on a floor: bottom face hidden;
- painted stack with selected faces exposed;
- cut cube/cuboid and newly exposed faces;
- count of painted faces by exposure category;
- number of small cubes with 0/1/2/3 painted faces where measurement is dominant;
- reverse tasks from exposed area or painted-face count.

### E. Scaling and percentage change

- thickness change with fixed outer dimensions;
- inner radius change with fixed outer radius;
- material-volume ratio of similar shells;
- percentage change in material volume;
- area change after opening or closing a face;
- comparison of open and closed surface areas;
- ratio of inner to outer curved area.

### F. Cost and material applications

- metal used in pipe/shell;
- mass only when density is an explicit, simple representation attached to decisive material volume;
- paint or polish on selected outer surfaces;
- lining or coating inner surfaces;
- plating both inner and outer surfaces;
- sheet required for open container;
- wastage percentage only when explicitly parameterised;
- number of sheets/tiles/plates subject to whole-item admissibility.

## Initial executable prototype wave

The first temporary wave establishes architecture and reveals gaps. Its size is not a chapter quota.

```text
MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA
MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA
MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA
MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS
MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS
MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME
MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-PIPE-CURVED-AREA-BOTH-SIDES
MEN-CP011-PROT-HOLLOW-PIPE-TSA-WITH-ANNULAR-ENDS
MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME
MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME
MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME
MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA
MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA
MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST
MEN-CP011-PROT-INNER-LINING-COST
MEN-CP011-PROT-MATERIAL-VOLUME-RATIO
MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE
```

The count `20` describes only the first architecture wave. Additional prototypes must be discovered rather than forced into this list.

## Provisional merge hypotheses

- radius and diameter forms may merge as representation parameters when reasoning is unchanged;
- open-at-one-end and open-at-both-ends may merge through a surface ledger if distractor and explanation contracts remain stable;
- inner-only, outer-only and combined surface tasks may merge only if target semantics remain explicit;
- direct material volume and inverse thickness likely remain distinct because admissibility and algebra differ;
- cube/cuboid/cylinder/sphere shell families may share infrastructure but not necessarily one QL;
- cost may merge into its area or material-volume authority through a rate parameter when no new reasoning appears;
- joined-face exposure may remain separate from hollow-material subtraction;
- painted-small-cube count families require an ownership audit against logical counting and Geometry.

## Five-element explanation contract

Every English package must implement:

1. **Picture the Shape First**
   - hollow pipe: “Think of a thick solid rod with a smaller cylinder drilled straight through the centre.”
   - open container: identify the physically missing face;
   - joined solids: identify the two touching faces that become hidden.
2. **Main Rule and Variable Meanings**
   - explain outer solid minus inner void or exposed ledger before formula substitution;
   - define `R`, `r`, `h`, thickness and included surfaces.
3. **Unit-Preserving Worked Steps**
   - label lengths, ring areas, surfaces and material volume with `L`, `L²`, `L³` units at every stage.
4. **Exam Speed Trick**
   - use `(R-r)(R+r)` for `R²-r²`;
   - cancel `π`, common heights and unit factors before multiplication;
   - use surface ledgers instead of memorising many unrelated formulas.
5. **Coded Option Diagnostics**
   - explain every shuffled wrong option by its actual calculation;
   - append one stable public misconception code.

## Core misconception inventory

At minimum, discovery must test:

```text
[USED_OUTER_SOLID_VOLUME_ONLY]
[CALCULATED_INNER_VOID_ONLY]
[ADDED_INNER_AND_OUTER_VOLUMES]
[SWAPPED_INNER_OUTER_DIMENSIONS]
[USED_RADIUS_AS_DIAMETER]
[USED_DIAMETER_AS_RADIUS]
[SUBTRACTED_RADII_BEFORE_SQUARING]
[OMITTED_PI]
[OMITTED_LENGTH_OR_HEIGHT]
[USED_AREA_INSTEAD_OF_VOLUME]
[USED_VOLUME_INSTEAD_OF_AREA]
[FORGOT_OPEN_FACE]
[ADDED_MISSING_FACE]
[OMITTED_EXISTING_BASE]
[COUNTED_HIDDEN_JOIN_FACES]
[SUBTRACTED_ONLY_ONE_JOIN_FACE]
[OMITTED_INNER_SURFACE]
[OMITTED_OUTER_SURFACE]
[OMITTED_ANNULAR_ENDS]
[USED_SINGLE_THICKNESS_IN_TWO_SIDED_DIMENSION]
[USED_LINEAR_UNIT_CONVERSION_FOR_AREA]
[USED_LINEAR_UNIT_CONVERSION_FOR_VOLUME]
[ROUNDED_COUNT_DOWN]
[ACCEPTED_FRACTIONAL_ITEM_COUNT]
```

Internal prototype or fallback IDs must never appear in learner text.

## Diagram contract

A deterministic diagram is normally mandatory for CP-011.

### Hollow cylinder / pipe

Show:

- outer radius `R`;
- inner radius `r`;
- length/height `h`;
- wall thickness `t = R-r` when relevant;
- inner void visually distinct from material;
- physical units on every numeric callout;
- accessible text explaining that the central cylinder is empty.

### Open container

Show:

- all stated dimensions;
- missing/open face with dashed or absent boundary;
- included bases/sides;
- “not to scale” label.

### Joined or placed solids

Show:

- touching/hidden faces;
- exposed outer faces;
- repeated units or counts;
- no perspective that makes a hidden face look exposed.

Diagram labels, state values, stem values and explanation values must be identical. The validator must reject a diagram that invents an unknown dimension or drops the physical unit.

## Required proof

Every temporary prototype must pass:

- deterministic valid-state-first generation;
- exact canonical solver;
- materially separate independent verifier;
- positive and physically possible dimensions;
- explicit inner < outer constraints;
- thickness consistency;
- surface-ledger consistency;
- four unique dimensionally compatible options;
- all four answer positions;
- at least four natural stem forms;
- state-derived difficulty;
- declared π-policy validation;
- unit preservation at every worked step;
- mandatory five-element explanation validation;
- exact option-linked trap codes;
- deterministic unit-aware SVG review diagram;
- lifecycle and publication locks;
- production API build.

## Lifecycle safety

All discovery packages remain:

```text
reviewStatus:               UNREVIEWED
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No prototype becomes a permanent QL merely because runtime proof passes.
