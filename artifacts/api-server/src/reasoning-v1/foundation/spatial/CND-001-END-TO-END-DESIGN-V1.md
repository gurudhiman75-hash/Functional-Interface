# CND-001 — Cubes & Dice End-to-End Design V1

Status: `EXECUTABLE FOUNDATION / SOURCE-SATURATION IN PROGRESS / PERMANENT QL ALLOCATION LOCKED`

## 1. Chapter boundary

`CND-001` owns three-dimensional cube/die reasoning where correctness depends on rigid cube orientation, cube-net folding, painted-face exposure, voxel occupancy, or orthographic projection.

It includes:

1. dice orientation from one or more views;
2. opposite and adjacent face deduction;
3. possible / impossible visible arrangements;
4. cube nets and folded-face relations;
5. painted cubes and cuboids after equal subdivision;
6. incomplete or built-up cube stacks;
7. top / front / side orthographic views.

It does **not** absorb generic 2D figure counting, paper folding, embedded figures, or mensuration volume questions whose answer does not require spatial cube-state reasoning.

## 2. Source-backed exam reality

The first source pass confirms that the core is directly exam-backed rather than invented enrichment.

Observed competitive-exam patterns include:

- SSC CGL 2024: two visible positions of the same labelled die, asking the face opposite a specified label;
- SSC CGL Tier-II 2023 and SSC CPO / GD papers: open cube/die nets asking the face opposite a symbol, letter or alphanumeric face;
- SSC CGL 2021 Tier-I: a cube painted on all six faces and cut into equal smaller cubes, asking counts with exactly one, two or three painted faces;
- broader government-exam practice: no-painted cubes, selectively painted faces, cuboids, possible/impossible die positions and hidden/visible cube structures.

Reference surfaces used for pattern discovery: Testbook cube/dice reasoning and SSC previous-year question pages; Oliveboard cube/dice reasoning and SSC previous-year question pages. Examtree must reproduce the **problem families and reasoning contracts**, not source wording, diagrams or option sets.

## 3. Candidate skill inventory

### CND-CAND-A — Dice relation from multiple views

Tasks:
- opposite face;
- adjacent face;
- missing face relation;
- common-face two-view deduction.

Solver: enumerate the 24 proper cube rotations and all six-label assignments consistent with every observed ordered visible triplet. A question is accepted only when the requested relation is unique across all compatible assignments.

### CND-CAND-B — Possible / impossible die arrangement

Given established observations, decide which candidate visible triplet can or cannot represent the same die.

Solver: compatibility against the exact rotation/assignment solution set. Reflection is never accepted as a rotation.

### CND-CAND-C — Cube-net folding

Tasks:
- opposite face;
- adjacent pair;
- which folded view is possible;
- invalid/overlapping net rejection where appropriate.

Solver: BFS fold each 2D cell into a 3D frame. A valid cube net must be connected and occupy the six unique axis normals exactly once.

### CND-CAND-D — Painted cube, all outer faces painted

Tasks:
- exactly 0/1/2/3 painted faces;
- at least / at most painted faces;
- differences or sums of categories;
- reverse inference from a supplied count where unique.

Solver: enumerate every unit cube coordinate and derive paint from boundary exposure. Closed-form formulas may be used in explanations only as a checked shortcut, never as the sole validator.

### CND-CAND-E — Selectively painted cube/cuboid

Tasks vary which outer faces are painted, including adjacent faces, opposite faces and selected colour pairs.

Solver: same coordinate exposure engine with an explicit painted-face set. Do not apply all-six-face formulas blindly.

### CND-CAND-F — Incomplete / built-up cube stack

Tasks:
- total cubes including hidden support cubes;
- exposed faces;
- missing cubes needed to complete a cuboid;
- visible cube count under a declared viewpoint.

Solver: explicit voxel occupancy. Floating cubes are invalid unless the problem explicitly defines suspension.

### CND-CAND-G — Top/front/right orthographic views

Tasks:
- count projected cells;
- choose the correct view;
- infer feasible stack from supplied views (later wave).

Solver: exact voxel projection onto the requested plane.

## 4. First executable checkpoint

Implemented in `CND-001-FOUNDATION-V1`:

- exact 24-element proper rotation group;
- ordered top/front/right observation model;
- exhaustive dice-assignment solver;
- opposite-label inference;
- cube-net folding to 3D normals;
- opposite-label resolver for valid nets;
- coordinate-based painted cube/cuboid enumeration;
- painted-face-count distribution;
- stable voxel stack construction;
- top/front/right projection counts;
- exposed voxel-face count;
- deterministic review-only generators for:
  - `CND-CAND-A-DICE-RELATION`;
  - `CND-CAND-B-CUBE-NET`;
  - `CND-CAND-C-PAINTED-CUBE`;
  - `CND-CAND-D-ORTHOGRAPHIC-VIEW`.

The candidate IDs above are implementation checkpoint IDs, not permanent QL IDs.

## 5. Representation and renderer contract

The final student surface must use exam-standard, white-background diagrams.

Dice views:
- consistent isometric projection;
- exactly three visible faces unless a question explicitly uses another representation;
- thin dark strokes;
- centred labels/symbols;
- no decorative perspective or random tilt that changes perceived adjacency.

Cube nets:
- orthogonal equal squares;
- deterministic orientation;
- labels centred;
- no unnecessary fill or colour unless colour is semantically required.

Painted cubes/stacks:
- perspective must preserve occupancy and face visibility;
- hidden cubes must be solver-backed rather than implied by artistic drawing;
- colour questions must retain a non-colour semantic fallback in metadata for accessibility/review.

Renderer work is the next checkpoint; the current generator intentionally emits structured scene data rather than pretending an unreviewed SVG renderer is production-ready.

## 6. Distractor policy

Allowed distractors must correspond to realistic misconceptions:

- confusing adjacent with opposite faces;
- treating a reflected die as a legal rotation;
- using only one observation when two are required;
- misfolding one net flap across the wrong edge;
- using `(n-2)` / `(n-2)^2` in the wrong painted-face category;
- counting visible cubes but ignoring hidden support cubes;
- confusing top/front/right projection axes.

Random unrelated labels or random nearby numbers are not sufficient once the chapter enters production scale.

## 7. Explanation policy

Explanations must be question-specific and human-readable.

Dice: identify the common/anchoring face relation and state why the opposite face is forced; solver evidence remains available internally.

Nets: name the target face and the face reached after folding across the relevant chain; do not rely on vague phrases such as “alternate faces are opposite” unless that rule is actually valid for the shown net.

Painted cubes: state subdivision count, classify corner/edge/face/interior positions, and show the final count. Coordinate enumeration is the validator; concise formulas may be shown as the learner shortcut.

Stacks/views: state which coordinates/projected cells contribute and explicitly account for hidden cubes when relevant.

## 8. Difficulty model

Easy:
- direct opposite face from strongly constraining views;
- simple standard net opposite;
- all-faces-painted cube, direct category count;
- top view of a simple stack.

Moderate:
- two-view dice with less obvious common-face alignment;
- net with target separated by multiple folds;
- no-painted / exactly-one-painted categories with larger subdivision;
- front/right stack projections;
- selective painting.

Hard:
- possible/impossible arrangements across three observations;
- reverse dice relation;
- selectively painted cuboids;
- hidden-cube reconstruction;
- inference from multiple orthographic views.

## 9. QL allocation rule

`SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.nextAvailablePermanentQlId` is `SPA-QL-043`.

No CND permanent QL is allocated in this checkpoint. Before allocation, the chapter must complete:

1. source-saturated candidate inventory;
2. merge/split audit across the seven candidate families;
3. exam-standard renderer review;
4. seeded learner review across all retained task kinds;
5. distractor-family audit;
6. explicit product-owner approval.

Only then should the retained canonical skills receive `SPA-QL-043+` IDs.

## 10. Localization

English is canonical. Hindi and Punjabi localization begins only after English skill boundaries and renderer semantics freeze.

Labels/symbols on cube faces remain language-neutral when possible. Instruction text and explanations must be localized naturally; spatial relations such as opposite, adjacent, top, front, right, painted face, edge cube and corner cube require a frozen terminology table.

## 11. Governance

Current lifecycle:

- permanent QL allocated: **false**;
- Question Studio registered: **false**;
- persistence allowed: **false**;
- Question Bank writable: **false**;
- test/mock eligible: **false**;
- public publication: **false**;
- automatic student publication: **false**.

Next checkpoint: `CND-001-CP002-SOURCE-SATURATION-AND-RENDERER-V1`.
