# MEN-CP-007 — Cubes, Cuboids & Prisms

## Status

**Executable-discovery plan.**

This plan authorises non-QL prototype implementation for MEN-CP-007. It does not freeze permanent QLs, solve modes, checkpoint counts or difficulty distributions.

## Ownership hypothesis

MEN-CP-007 owns the base measurement systems of cubes, cuboids and right prisms:

- direct and inverse volume;
- lateral and total surface area;
- base-area extrusion;
- face and space diagonals;
- contained-rod length;
- basic cutting, stacking and count states;
- shape-specific scaling;
- unit and cost applications.

The following remain subject to reassignment:

- surface-exposure transformations across joined, open or painted solids may belong to MEN-CP-011;
- recasting belongs to MEN-CP-012;
- inscribed/composite solids and displacement belong to MEN-CP-013;
- theorem-only diagonal reasoning belongs to Geometry unless the decisive task is measurement.

## Non-QL prototype rule

Prototype IDs use a temporary namespace:

```text
MEN-CP007-PROT-...
```

They must not receive `MEN-002-QL-*` IDs until exhaustive source, inverse, representation, edge and merge/split audits close.

## Canonical formula inventory

### Cube

```text
Volume:                 V = a³
Lateral surface area:   LSA = 4a²
Total surface area:     TSA = 6a²
Face diagonal:          d_f = a√2
Space diagonal:         d_s = a√3
```

### Cuboid

```text
Volume:                 V = lbh
Lateral surface area:   LSA = 2h(l + b)
Total surface area:     TSA = 2(lb + bh + hl)
Face diagonals:         √(l²+b²), √(b²+h²), √(h²+l²)
Space diagonal:         d = √(l²+b²+h²)
```

### Right prism

```text
Volume:                 V = base area × prism height
Lateral surface area:   LSA = base perimeter × prism height
Total surface area:     TSA = LSA + 2 × base area
```

Formula inventory is not a solve-mode inventory. Distinct QLs are discovered from reasoning contracts, evidence direction, answer semantics, representation and misconceptions.

## First-wave prototype candidates

The first wave should implement a deliberately broad but non-final set of contracts.

### A. Direct cube and cuboid measurement

- cube volume from side;
- cube LSA from side;
- cube TSA from side;
- cuboid volume from length, breadth and height;
- cuboid LSA from dimensions;
- cuboid TSA from dimensions;
- comparison of volume/LSA/TSA for two solids;
- direct capacity of a cuboidal box or tank where no displacement/rate logic is involved.

### B. Inverse dimensions

- cube side from volume;
- cube side from TSA or LSA;
- cuboid missing length/breadth/height from volume;
- cuboid missing dimension from LSA;
- cuboid missing dimension from TSA with a bounded exact domain;
- prism height from volume and base area;
- prism base area from volume and height;
- prism base perimeter from LSA and height.

Inverse candidates must be retained separately only when they materially change reasoning, admissibility or misconception structure.

### C. Diagonal and contained-object states

- cube face diagonal;
- cube space diagonal;
- cube side from face or space diagonal;
- cuboid space diagonal;
- missing cuboid dimension from space diagonal and two known dimensions;
- longest rod or pole that fits inside a cuboidal box/room;
- largest square sheet on a cuboid face only where the measurement task remains MEN-CP-007.

### D. Prism extrusion

- triangular-prism volume from triangle base/height and prism length;
- regular-hexagonal-prism volume from side and prism height;
- prism volume from declared base area;
- prism LSA from base perimeter and height;
- prism TSA from base area, perimeter and height;
- inverse prism height/base measure;
- comparison between prisms with equal base area, equal height or equal volume.

The base-shape formula may be imported from MEN-001 as a shared exact relation, but the QL belongs to MEN-CP-007 when the decisive reasoning is 3D extrusion.

### E. Cutting, stacking and count

- number of equal cubes cut from a cuboid;
- number of smaller cubes formed from a larger cube;
- count under exact side divisibility;
- volume conservation check for cutting without material loss;
- total count from layer/row/column structure;
- dimensions of a new cuboid formed by stacking equal cubes;
- change in exposed surface after simple stacking, provisionally retained for CP-011 ownership review;
- minimum/maximum count only when the domain and orientation are explicitly bounded.

Fractional-object answers are invalid unless the stem asks for unused material or remainder.

### F. Open/closed and material applications

- open-top cuboidal box sheet area;
- box without lid;
- closed carton surface area;
- wooden block painting/polishing;
- room wall area excluding floor/ceiling only when the decisive surface accounting is simple;
- cost from area rate;
- cost from volume rate;
- material volume of a simple rectangular slab;
- open/closed variants retained provisionally pending CP-011 audit.

### G. Scaling and percentage change

- all dimensions scaled by factor `k`;
- volume ratio from side ratio;
- surface-area ratio from side ratio;
- side ratio from volume ratio;
- side ratio from surface-area ratio;
- percentage volume change under one, two or three dimension changes;
- cube volume percentage change under side increase/decrease;
- cuboid volume percentage change under independent dimension changes;
- surface-area percentage change only where the exact topology remains stable.

### H. Unit and capacity representations

- `cm³ ↔ m³`;
- `cm³ ↔ litre`;
- `m³ ↔ litre`;
- mixed linear units before volume calculation;
- capacity from internal dimensions;
- external dimensions must not be used for capacity unless wall thickness is zero or explicitly ignored;
- dimensional-unit trap audit.

## Canonical state proposal

```ts
interface MenCp007State {
  prototypeId: string;
  seed: string;
  shape: "CUBE" | "CUBOID" | "RIGHT_PRISM";
  dimensions: {
    side?: ExactValue;
    length?: ExactValue;
    breadth?: ExactValue;
    height?: ExactValue;
    baseArea?: ExactValue;
    basePerimeter?: ExactValue;
  };
  surfaceState: {
    openFaces: readonly FaceId[];
    includedFaces: readonly FaceId[];
    internal: boolean;
  };
  transformation?:
    | { kind: "SCALE"; factors: readonly ExactValue[] }
    | { kind: "CUT"; smallDimensions: readonly ExactValue[] }
    | { kind: "STACK"; arrangement: readonly number[] };
  target: MenCp007Target;
  units: Men002UnitSystem;
}
```

## First-wave target semantics

At minimum, prototype discovery must reach:

```text
VOLUME
CAPACITY
SURFACE_AREA
LATERAL_SURFACE_AREA
TOTAL_SURFACE_AREA
LENGTH
DIAGONAL
COUNT
COST
RATE
PERCENT_CHANGE
RATIO
```

No semantic is retained merely to increase inventory. Each must demonstrate a distinct learner task and valid source/exam role.

## Exact generation strategy

- Generate intended answers first, then derive compatible dimensions.
- Prefer exact integer, rational or surd outputs.
- Use perfect cubes for basic inverse cube-side states unless the exam family explicitly supports surd/decimal answers.
- For space-diagonal inverse states, generate Pythagorean-compatible triples or exact surd states deliberately.
- For cuboid TSA inverses, require exactly one positive admissible dimension in the declared domain.
- Cutting/count states must enforce exact divisibility unless remainder is an explicit target.
- Cost states must preserve the currency provided in the stem and use matching area/volume rate units.

## Independent verification

Examples of materially separate verification:

- direct volume solver `lbh`; verifier reconstructs the expected product from face-area × perpendicular height;
- inverse dimension solver algebraically divides; verifier substitutes the candidate dimension into the original volume or surface relation;
- diagonal solver uses exact square root; verifier checks squared-length identity;
- count solver divides dimension-wise; verifier reconstructs total small-solid volume and arrangement count;
- scaling solver uses power law; verifier recalculates all scaled dimensions and recomputes the measure;
- unit conversion solver applies exact factor; verifier converts back to the original unit.

## Misconception registry seed

The first wave must generate and validate distractors for:

- area used instead of volume;
- missing one dimension in volume;
- LSA/TSA confusion;
- one face or one pair of faces omitted;
- factor `2` omitted in cuboid TSA/LSA;
- cube `a²` used instead of `a³`;
- cube `6a³` used as TSA;
- face diagonal used instead of space diagonal;
- `a√2` versus `a√3` confusion;
- cuboid diagonal missing one squared dimension;
- linear scaling used for area or volume;
- area scaling `k²` used for volume instead of `k³`;
- linear unit factor used for cubic conversion;
- external dimensions used for internal capacity;
- total volume divided by one small side instead of small-cube volume;
- sum of dimensions used instead of product;
- fractional cube count accepted;
- wrong cost rate dimension.

Every distractor must be tied to a generated wrong value, not merely a generic warning.

## Explanation requirements

Each prototype must render:

1. **Core Concept** — what is being measured and why the formula applies;
2. **Step-by-Step Solution** — dimensions, formula, substitution, simplification, units and contextual result;
3. **Exam Speed Shortcut** — cancellation, ratio, known diagonal relation, dimension-wise counting or scale power;
4. **Common Traps & Distractors** — all three displayed wrong options with concrete corrections.

Examples:

- For a cube diagonal, explain that the space diagonal crosses three mutually perpendicular directions, so `d² = a² + a² + a²`.
- For a prism, explain that volume is the same base area repeated through the prism height.
- For cutting, explain both dimension-wise count and volume-conservation cross-check.
- For open boxes, identify exactly which face is missing before adding areas.

## Diagram requirements

Mandatory or strongly preferred for:

- face versus space diagonal;
- longest rod in a cuboid;
- open-top/without-lid boxes;
- cutting and stacking arrangements;
- triangular or regular-polygon prisms;
- included/excluded face questions.

Labels must be generated from canonical dimensions. Decorative perspective must never imply false equality or hidden dimensions.

## Review export

The first executable checkpoint must export deterministic English review samples containing:

- prototype ID;
- seed;
- stem;
- diagram when required;
- four options;
- correct answer separated from learner view;
- four-tier explanation;
- solve mode;
- target semantic;
- exact canonical state;
- independent-verifier evidence;
- misconception IDs aligned to shuffled distractors;
- lifecycle locks.

## Required first-wave audits

1. deterministic regeneration;
2. solver/verifier agreement;
3. exact arithmetic and surd normalisation;
4. four unique options and one correct answer;
5. all four answer positions;
6. positive and physically admissible dimensions;
7. direct/inverse coverage;
8. cube/cuboid/prism ownership coverage;
9. LSA/TSA/open-face distinction;
10. diagonal distinction;
11. cutting/count exactness;
12. unit and capacity safety;
13. scaling power-law safety;
14. cost/rate unit safety;
15. teacher-style explanation quality;
16. diagram-state parity;
17. stem and mathematical-fingerprint diversity;
18. source and legacy traceability;
19. merge/split classification;
20. publication-lock validation.

## First implementation checkpoint

Implement an initial **non-final prototype foundation** spanning the major reasoning families above. The initial count must be whatever is necessary to establish architecture and expose gaps; it must not be treated as the final CP-007 inventory.

After the first runtime proof:

- inspect the review pack manually;
- classify every prototype as retain, merge, split, defer, reassign or reject;
- run the first source and inverse gap wave;
- do not allocate permanent `MEN-002-QL-*` IDs yet.
