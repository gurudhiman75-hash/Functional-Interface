# MEN-002 — Solid Mensuration, Recasting & Composite Solids

## Status

**End-to-end design and executable-discovery authority.**

This document begins MEN-002 as the Solid Mensuration package of the ExamTree Mensuration family. It authorises design and non-public executable discovery. It does **not** freeze QL counts, solve-mode counts, canonical-problem boundaries, difficulty distributions, Question Studio publication, Question Bank eligibility or public delivery.

## Package identity

```text
Package ID:           MEN-002
Student-facing name:  Solid Mensuration
Extended scope:       Solid Mensuration, Recasting & Composite Solids
QL namespace:         MEN-002-QL-001...
Initial language:     English
Publication:          disabled
```

MEN-001 remains the independent plane-mensuration package. MEN-002 reuses shared arithmetic, units, explanation, review and diagram infrastructure, but owns separate registries, solvers, validators, audits, review records and freeze records.

## Non-negotiable discovery rule

QLs and solve modes are **not predetermined**.

The final inventory must be discovered from exhaustive coverage of:

- concepts and shape properties used for measurement;
- direct tasks;
- reverse and inverse tasks;
- answer semantics;
- exposed-surface variants;
- open, closed and hollow variants;
- unit and capacity representations;
- recasting and volume conservation;
- composite and inscribed solids;
- tank, displacement and level-change states;
- scaling and percentage transformations;
- cost, count and material-use applications;
- source-backed competitive-exam patterns;
- legacy-family recovery;
- misconception and distractor boundaries;
- merge, split, defer, reassign and reject audits.

A count may be frozen only after source, topology, inverse, edge, representation and ownership audits find no meaningful uncovered family.

## Ownership boundary

MEN-002 owns real solid-measurement questions requiring one or more of:

- volume;
- capacity;
- curved or lateral surface area;
- total surface area;
- exposed or painted area;
- volume of material;
- solid diagonal or contained rod length;
- solid recasting or melting;
- composite-solid addition or subtraction;
- displacement or water-level change;
- shape-specific linear, area or volume scaling;
- solid-specific cost, coating, canvas, sheet, material or count applications.

MEN-002 does not own:

- pure theorem/property proofs — Geometry;
- trigonometric side recovery — Trigonometry;
- abstract scale ratios without a solid-measurement state — Ratio & Proportion;
- fill/empty rates — Pipes & Cisterns;
- fluid-flow time — Time & Work/Pipes;
- generic profit or loss after selling containers — Profit & Loss;
- mass-density questions where geometry is incidental — the future density/physical-units owner unless the decisive task is geometric volume;
- engineering formulae outside competitive-exam mensuration scope.

Static tank capacity, displacement and level change remain MEN-002. Rate-based tank filling and emptying remain outside MEN-002.

## Provisional canonical-problem ownership hypotheses

The Mensuration authority lock currently proposes seven MEN-002 canonical problems. They are working ownership hypotheses and remain open to merge, split or reassignment after executable discovery.

### MEN-CP-007 — Cubes, Cuboids & Prisms

Candidate domains:

- cube and cuboid volume;
- lateral and total surface area;
- missing dimension from volume or surface evidence;
- face diagonal and space diagonal;
- longest rod contained in a box;
- cubical and cuboidal room, box, brick, slab and block contexts;
- cutting, stacking and count-of-small-solids states;
- rectangular, triangular, regular-polygon and general right-prism volume;
- prism lateral/total surface area;
- dimension change and percentage change;
- cost of painting, polishing, covering, sheet, wood or material;
- open-top and partially open boxes where ownership does not belong to the shared exposed-surface CP.

### MEN-CP-008 — Cylinders & Cones

Candidate domains:

- cylinder volume, CSA and TSA;
- cone volume, CSA and TSA;
- radius, diameter, height and slant-height inverses;
- relation `l² = r² + h²`;
- cylindrical pipe, roller, drum, pillar, road roller and vessel contexts;
- conical tent, heap, cap and vessel contexts;
- sheet/canvas/paint/material applications;
- number of revolutions only where a solid roller's swept area or volume is decisive;
- dimension and percentage transformations;
- ratio/comparison states between cylinders and cones.

### MEN-CP-009 — Spheres & Hemispheres

Candidate domains:

- sphere surface area and volume;
- hemisphere CSA, TSA and volume;
- radius/diameter inverse states;
- hollow and shell variants where not reassigned to CP-011;
- spherical and hemispherical bowl, dome, ball and vessel contexts;
- paint, polish, material and capacity;
- equal-volume/equal-surface comparisons;
- scaling and percentage changes;
- sphere-inside-cube and cube-inside-sphere boundaries subject to CP-013 audit.

### MEN-CP-010 — Pyramids & Frustums

Candidate domains:

- right pyramids with square, rectangular, triangular or regular-polygon bases;
- volume and lateral/total surface area;
- slant-height recovery;
- frustum volume, curved/lateral area and total area;
- bucket, lampshade, truncated cone and truncated pyramid contexts;
- similar-solid section ratios;
- full-solid-minus-cut-solid derivations;
- inverse and ratio states;
- cost and material applications.

### MEN-CP-011 — Surface Exposure, Open/Closed & Hollow Solids

Candidate domains:

- open-top, open-bottom and partially open containers;
- painted/exposed faces after joining, cutting, stacking or placing;
- hollow cube, cuboid, cylinder, cone, sphere or hemisphere;
- thickness and material-volume states;
- internal versus external surface;
- boxes without lids;
- pipes, shells and vessels;
- multiple-face painting and count-by-face-exposure;
- joined cubes/cuboids and removed-face accounting;
- coating, plating, sheet and paint cost.

This CP is cross-shape and owns the **surface-exposure transformation** when that is the decisive reasoning. Simple direct CSA/TSA remains with the base-shape CP.

### MEN-CP-012 — Recasting, Melting & Volume Conservation

Candidate domains:

- one solid melted into another;
- many equal solids recast into one or vice versa;
- wire/rod/sheet drawing where volume is conserved;
- change of shape with unit conversion;
- count of resulting solids;
- missing dimension after recasting;
- loss/wastage percentage where explicitly stated;
- combined source solids;
- equal-volume comparisons;
- material conservation under hollow-to-solid or solid-to-hollow conversion where physically and mathematically valid.

Recasting preserves volume, not surface area. Every candidate must declare whether material loss is zero or explicitly parameterised.

### MEN-CP-013 — Composite/Inscribed Solids, Tanks & Displacement

Candidate domains:

- cone + hemisphere, cylinder + hemisphere, capsule, toy and monument shapes;
- added and removed solid regions;
- drilled, bored or carved solids;
- largest solid inscribed in another solid;
- cube/cuboid/cylinder/cone/sphere containment relations;
- tank capacity;
- water displaced by immersed solids;
- rise or fall of liquid level;
- multiple immersed objects;
- overflow states;
- partially filled tanks;
- conversion between litres, millilitres and cubic units;
- composite surface exposure where CP-011 ownership is not dominant.

## Shared mathematical state

Every generated question must derive from one canonical state. At minimum:

```ts
interface Men002SolidState {
  packageId: "MEN-002";
  cpId: string;
  qlId: string | null;
  solveMode: string;
  language: "en";
  seed: string;
  solids: SolidComponent[];
  operation: "DIRECT" | "INVERSE" | "ADD" | "SUBTRACT" | "RECAST" | "IMMERSE" | "SCALE";
  target: Men002Target;
  piPolicy: "EXACT_PI" | "PI_22_OVER_7" | "PI_3_14";
  unitSystem: Men002UnitSystem;
  lifecycle: Men002Lifecycle;
}
```

Each solid component must explicitly declare:

- shape;
- dimensions;
- orientation where relevant;
- open/closed faces;
- inner and outer dimensions for hollow solids;
- included and excluded surfaces;
- volume contribution sign;
- surface contribution sign;
- relationship to other components;
- source of every derived dimension.

## Exact arithmetic policy

- Preserve integers, reduced rational numbers, exact π multiples and exact surds.
- Do not use floating-point equality as mathematical authority.
- Do not round unless the stem explicitly requests an approximation.
- `π = 22/7` or `π = 3.14` is a declared generated-state choice, never an implicit formatter decision.
- Inverse states must be constructed so the intended answer is uniquely admissible in the declared domain.
- Independent verification must reconstruct the given evidence from the proposed answer or enumerate a bounded exact domain.

## Dimensional unit system

Every value carries dimension metadata:

```text
LENGTH      L
AREA        L²
VOLUME      L³
CAPACITY    L³ with litre/millilitre representation
COUNT       dimensionless integer
COST        currency
RATE        currency per L² or currency per L³ where appropriate
PERCENT     dimensionless percentage
SCALAR      dimensionless ratio or factor
```

Required conversions include:

- `1 m = 100 cm`;
- `1 m² = 10,000 cm²`;
- `1 m³ = 1,000,000 cm³`;
- `1 litre = 1,000 cm³`;
- `1 m³ = 1,000 litres`;
- millilitre/cubic-centimetre equivalence where exam-appropriate.

Conversion factors must be raised to the correct power. The validator must reject a linear conversion applied to area or volume.

## Solver architecture

Every retained solve mode requires:

1. **Canonical solver** — direct exact algebra from canonical state.
2. **Independent verifier** — a materially separate reconstruction, identity check or bounded enumeration.
3. **Admissibility validator** — positive dimensions, physical possibility, unit consistency, unique answer and non-degenerate state.
4. **Distractor generator** — misconception-labelled wrong answers derived from plausible wrong operations.
5. **Presentation renderer** — student-facing stem, options, diagram and explanation generated from the same state.

No verifier may trust the stored correct answer or simply repeat the canonical solver expression.

## Candidate solve-mode discovery axes

Discovery must cross the following axes rather than enumerate formula names only.

### Task direction

- find volume/capacity;
- find CSA/LSA/TSA/exposed area;
- find radius/diameter/height/slant height/side/length/breadth;
- find diagonal or contained rod;
- find count of smaller solids;
- find material volume or thickness;
- find liquid-level change;
- find cost/rate/count;
- compare two solids;
- find percentage change;
- identify an equal-volume/equal-area condition.

### Evidence direction

- direct dimensions;
- volume evidence;
- surface-area evidence;
- perimeter/base-area evidence;
- ratio evidence;
- percentage-change evidence;
- recasting evidence;
- displacement evidence;
- composite total/difference evidence;
- capacity and unit-conversion evidence.

### Shape state

- single solid;
- open or closed solid;
- hollow solid;
- joined solids;
- cut or drilled solid;
- inscribed/circumscribed solid;
- recast solid;
- immersed solid;
- scaled solid;
- repeated equal solids.

### Representation

- radius versus diameter;
- vertical height versus slant height;
- inner versus outer dimension;
- cubic unit versus litre;
- exact π versus declared numerical π;
- integer, fraction, surd or decimal answer;
- direct value, ratio, percentage, count, cost or rate.

### Inverse boundary

Every direct relation must be audited for all meaningful inverse targets. An inverse becomes a separate QL only when it changes the student's reasoning contract, admissible domain, answer semantics, misconception profile or exam presentation—not merely because a different algebraic symbol is isolated.

## Difficulty model

Difficulty is generated from instance properties, not permanently attached to a QL.

Use at least these factors:

1. rule complexity;
2. number of transformations;
3. information density;
4. distractor proximity;
5. inference depth;
6. unit-normalisation burden;
7. spatial decomposition burden;
8. inverse-domain ambiguity;
9. arithmetic complexity;
10. diagram dependence.

Large numbers alone must not create Hard questions. Hardness should arise from spatial reasoning, transformations, inverse structure, composite exposure or conservation logic.

## Stem-authenticity policy

Stems must be realistic but concise. Approved context families include:

- room, hall, box, carton, brick, slab and wooden block;
- water tank, vessel, bucket, drum and pipe;
- pillar, roller, road roller and cylindrical container;
- conical tent, heap, cap and lampshade;
- dome, bowl, ball and spherical vessel;
- toy, monument, capsule and composite decorative object;
- metal casting, wax, clay, ice and molten material;
- painting, polishing, plating, canvas, sheet and material cost;
- immersed stone, metal ball or solid object causing water displacement.

Context must not change the mathematics or introduce irrelevant narrative. Every named object must agree with open/closed, hollow/solid and exposed-surface assumptions.

## Diagram policy

Deterministic diagrams are normally required for:

- composite solids;
- hollow objects;
- open/closed face variants;
- inscribed solids;
- drilled/cut solids;
- pyramids and frustums where slant/vertical height can be confused;
- liquid-level and displacement states;
- joined or painted solids where exposed faces matter.

A diagram is optional for direct single-solid formula questions when it adds no learning value.

Diagram labels, stem values, solver values and explanation values must come from the same canonical state.

## Explanation contract

Every English explanation follows the proven four-tier competitive structure:

1. **Core Concept / Key Rule & Formula**
   - explain the physical or spatial relationship in plain teacher language;
   - distinguish volume from surface area;
   - distinguish CSA/LSA from TSA;
   - explain why an invariant such as volume conservation applies.
2. **Step-by-Step Solution**
   - identify the relevant dimensions and exposed surfaces;
   - show the governing formula before substitution;
   - normalise units before combining values;
   - keep each step instructionally distinct;
   - place the contextual final result in the last worked step.
3. **Exam Speed Shortcut**
   - cancellation, ratio, known solid relation, scaling power, direct conservation relation or unit memory rule;
   - state-valid only;
   - never replace the complete standard solution.
4. **Common Traps & Distractors**
   - explain all three actual shuffled wrong options;
   - name the displayed option letter and value;
   - explain the actual wrong calculation and the correct method;
   - no internal strategy IDs or taxonomy language.

## Core misconception inventory

The discovery registry must test at least:

- radius/diameter swap;
- vertical/slant-height swap;
- CSA/LSA/TSA confusion;
- forgetting a base or adding an excluded base;
- sphere versus hemisphere factor error;
- cone `1/3` omission;
- pyramid `1/3` omission;
- frustum cross-term omission;
- inner/outer dimension swap;
- using external volume instead of material volume;
- preserving surface area during recasting;
- using area scale `k²` for volume instead of `k³`;
- linear unit conversion used for volume;
- litre/cubic-unit conversion error;
- adding instead of subtracting removed material;
- double-counting joined or hidden surfaces;
- using complete solid area for an open container;
- treating displaced volume as water volume remaining;
- confusing tank base area with tank volume;
- using original solid dimensions after recasting;
- incorrect count rounding or fractional-object acceptance.

## Option-generation contract

- exactly four unique options;
- exactly one correct option;
- deterministic answer-position rotation;
- all distractors dimensionally compatible with the answer;
- no negative length, area, volume, capacity or count unless the question explicitly asks for signed change;
- count answers must be admissible whole numbers;
- cost formatting must preserve the currency stated in the stem;
- no distractor may accidentally equal the correct answer under simplification or unit conversion.

## Publication and lifecycle safety

Every discovery or runtime-proof package remains:

```text
reviewStatus:               UNREVIEWED
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No MEN-002 question becomes a live Question Bank or student item merely because mathematical and editorial audits pass.

## Source and legacy recovery

The current repository contains legacy Mensuration motifs and procedural scenarios. They are prior art for:

- candidate topology discovery;
- contexts;
- distractor labels;
- formula and representation coverage;
- regression fixtures.

They are not implementation authority because the legacy path uses floating-point arithmetic, rounding and generic scenario factories. Every legacy 3D family must be classified exactly once as:

```text
RETAIN_AS_CANDIDATE
MERGE_AS_PRESENTATION
MERGE_AS_REPRESENTATION
SPLIT_BY_REASONING
REASSIGN_TO_OTHER_CP
DEFER_SOURCE_GAP
REJECT_DUPLICATE
REJECT_OUT_OF_SCOPE
```

## Required audits before freeze

1. source coverage audit;
2. legacy-family recovery and disposition audit;
3. formula and concept audit;
4. direct-task audit;
5. inverse-task audit;
6. answer-semantic audit;
7. open/closed/hollow audit;
8. recasting audit;
9. composite and inscribed-solid audit;
10. tank/displacement audit;
11. unit and capacity audit;
12. scaling and percentage audit;
13. cost/count/rate audit;
14. misconception and distractor audit;
15. diagram-necessity audit;
16. merge/split/ownership audit;
17. source-gap audit;
18. edge and degeneracy audit;
19. multilingual-readiness audit;
20. final gap audit.

## Implementation sequence

### Phase 0 — design and recovery

- establish this package authority;
- recover all legacy 3D motifs and scenarios;
- create provisional candidate registries without permanent QL IDs;
- define shared exact solid-state and unit contracts;
- classify CP ownership boundaries.

### Phase 1 — MEN-CP-007 executable prototype foundation

- implement non-QL cube/cuboid/prism prototypes;
- exact rational/surd arithmetic;
- canonical solver and independent verifier;
- misconception-labelled options;
- teacher-style English explanations;
- deterministic review export;
- no permanent QL allocation.

### Phase 2 — CP-007 gap waves and freeze proposal

- expand direct, inverse, count, cut/stack, prism, surface, unit, cost and scaling coverage;
- run source and gap audits;
- merge presentation-only duplicates;
- propose permanent QLs only for the approved exhaustive subset.

### Phase 3 — remaining CPs

Proceed CP-008 through CP-013 one at a time. Each CP must complete executable discovery and ownership audit before freeze.

### Phase 4 — chapter-wide integration

- cross-CP overlap audit;
- final solid-family source saturation;
- English editorial freeze;
- Hindi and Punjabi localisation only after English ownership freezes;
- Question Studio and Question Bank integration under publication locks;
- public release only through a separate explicit approval.

## First executable milestone

Begin `MEN-CP-007 — Cubes, Cuboids & Prisms` with non-QL prototypes. The first wave must cover direct measurement, key inverses, diagonals, contained-rod states, basic prism extrusion, open/closed surface distinction, count/cutting and unit/cost applications. The inventory remains open until the CP-007 gap audit closes.
