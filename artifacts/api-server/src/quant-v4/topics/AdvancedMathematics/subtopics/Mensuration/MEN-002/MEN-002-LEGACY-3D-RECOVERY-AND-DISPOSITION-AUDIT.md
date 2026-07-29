# MEN-002 Legacy 3D Recovery and Disposition Audit

## Status

**Initial complete repository recovery for the currently registered legacy 3D Mensuration motifs.**

This audit accounts for the 3D entries in the legacy Mensuration motif/scenario path. It is a discovery input, not a permanent QL allocation and not a claim of source saturation.

## Legacy authority boundary

Recovered files:

```text
artifacts/api-server/src/lib/motifs/quant/mensuration.ts
artifacts/api-server/src/lib/quant-scenarios/mensuration-scenarios.ts
```

The legacy path is useful for motif names, sample contexts, formula coverage and misconception seeds. It is not MEN-002 runtime authority because it currently uses:

- JavaScript `number` arithmetic;
- `PI = 22 / 7` as a floating value;
- routine two-decimal rounding;
- static scenario definitions rather than valid-state-first generation;
- stored numerical answers as authority;
- generic option completion;
- no materially separate exact verifier;
- one sample per motif;
- mixed 2D/3D package ownership;
- generic explanation assembly.

MEN-002 must rebuild every retained family with exact state, exact arithmetic, independent verification, deterministic generation, misconception-aligned options and teacher-style explanations.

## Recovered legacy 3D inventory

The current motif registry contains fourteen clearly 3D or solid-transformation entries relevant to MEN-002.

| Legacy motif | Legacy branch | Initial disposition | Provisional owner | Reason |
|---|---|---|---|---|
| `men-cube-diagonal` | `space-diagonal` | `RETAIN_AS_CANDIDATE` | MEN-CP-007 | Distinct measurement task: longest rod/space diagonal of cube. Must preserve exact `a√3`, not decimal approximation as answer authority. |
| `men-cuboid-surface-shift` | `volume-percent-shift` | `MERGE_AS_TRANSFORMATION_FAMILY` | MEN-CP-007 | Independent dimension changes belong to a general cuboid-volume transformation contract rather than a one-off wording family. |
| `men-prism-base` | `triangular-prism-volume` | `RETAIN_AS_CANDIDATE` | MEN-CP-007 | Base-area extrusion is a distinct 3D reasoning contract. Triangular/hexagonal bases are representations unless reasoning differs materially. |
| `men-cyl-csa-ratio` | `csa-to-tsa-ratio` | `RETAIN_AS_CANDIDATE` | MEN-CP-008 | Surface-area comparison and cancellation form a distinct cylinder task. Must be audited against direct CSA/TSA and inverse ratio variants. |
| `men-cone-canvas` | `conical-tent-csa` | `MERGE_AS_CONTEXT_PRESENTATION` | MEN-CP-008 | Tent/canvas is a context for cone CSA and open-base exposure, not automatically a standalone QL. |
| `men-sph-hem-tsa` | `hemisphere-total-surface` | `RETAIN_AS_CANDIDATE` | MEN-CP-009 | Hemisphere TSA has a genuine curved-plus-base distinction and strong misconception boundary. |
| `men-cone-sphere-recast` | `cone-to-sphere-volume` | `MERGE_AS_SOURCE_TARGET_REPRESENTATION` | MEN-CP-012 | Cone-to-sphere is one source/target pair inside the general volume-conservation recasting system. |
| `men-cyl-wire` | `cylinder-to-wire-volume` | `RETAIN_AS_CANDIDATE` | MEN-CP-012 | Drawing a rod into wire introduces extreme dimension inversion and unit normalisation. It may remain distinct after recasting merge audit. |
| `men-frustum-vol` | `bucket-frustum-volume` | `RETAIN_AS_CANDIDATE` | MEN-CP-010 | Frustum volume and the `Rr` cross-term create distinct formula and misconception structure. |
| `men-hollow-cyl` | `annular-cylinder-volume` | `RETAIN_AS_CANDIDATE` | MEN-CP-011 | Material volume of a hollow cylinder requires outer-minus-inner reasoning and internal/external distinction. |
| `men-inscribed-max` | `cube-in-sphere` | `RETAIN_AS_CANDIDATE` | MEN-CP-013 | Inscribed cube uses cube space diagonal = sphere diameter; distinct containment topology. |
| `men-ice-cream` | `cone-plus-hemisphere-volume` | `MERGE_AS_COMPOSITE_REPRESENTATION` | MEN-CP-013 | Ice-cream wording is one representation of cone-plus-hemisphere composite volume/surface exposure. |
| `men-pyramid-slant` | `square-pyramid-tsa` | `RETAIN_AS_CANDIDATE` | MEN-CP-010 | Pyramid lateral faces and slant-height use are materially distinct. Must audit vertical/slant inverse families. |
| `men-scale-vol` | `volume-scaling` | `MERGE_AS_CROSS_SHAPE_TRANSFORMATION` | Shape-owner CPs | Volume scaling by `k³` is a shared representation/operation, not a standalone shape CP. Retain within shape-specific QLs where the spatial state matters. |

```text
Recovered 3D motifs: 14
Accounted exactly once: 14
Permanent MEN-002 QLs allocated: 0
```

## MEN-CP-007 legacy seed set

Three legacy motifs seed the first CP-007 executable discovery:

### `men-cube-diagonal`

Legacy evidence:

```text
cube side = 10 cm
space diagonal = 10√3 ≈ 17.32 cm
```

Recovery decision:

- retain longest-contained-rod/space-diagonal reasoning;
- preserve `10√3 cm` exactly unless approximation is explicitly requested;
- split face diagonal and space diagonal only if review confirms distinct learner contracts;
- add inverse side-from-diagonal and cuboid extensions;
- reject decimal rounding as canonical answer authority.

### `men-cuboid-surface-shift`

Legacy evidence:

```text
length × 1.20
breadth × 0.90
height unchanged
volume multiplier = 1.08
```

Recovery decision:

- place under independent-dimension volume transformation;
- treat increase/decrease directions and changed-dimension subsets as parameters unless reasoning changes;
- add exact percentage-factor arithmetic;
- audit direct multiplier, percentage change, missing change and equal-volume inverse forms;
- do not create one QL per percentage wording.

### `men-prism-base`

Legacy evidence:

```text
triangular base area = 1/2 × 12 × 8
prism length = 20
volume = base area × length
```

Recovery decision:

- retain base-area extrusion as the governing idea;
- audit triangular, rectangular, trapezoidal, rhombic, regular-hexagonal and given-base-area representations;
- import exact base-area relations from MEN-001 infrastructure without transferring QL ownership;
- distinguish direct volume from inverse prism-height/base-area tasks only where reasoning or answer semantics differ.

## Initial gap findings from legacy recovery

The legacy inventory does **not** cover CP-007 exhaustively. Missing or weak areas include:

### Cube and cuboid basics

- direct cube/cuboid volume;
- direct LSA/TSA;
- inverse side/dimension from volume;
- inverse dimension from LSA/TSA;
- face diagonal;
- cuboid space diagonal;
- side/dimension inverse from diagonal evidence.

### Prism measurement

- LSA and TSA;
- inverse height/base area/base perimeter;
- non-triangular base representations;
- equal-volume/equal-height comparisons.

### Cutting and counting

- small cubes from a larger cube/cuboid;
- dimension-wise arrangement;
- remainder/wastage states;
- stacking and reconstructed dimensions;
- exact whole-count validation.

### Surface and applications

- open-top box;
- box without lid;
- included/excluded faces;
- painting/polishing/sheet/cost;
- internal capacity versus external dimensions;
- material-volume contexts.

### Units and scaling

- cubic unit conversion;
- litre/cubic-centimetre/cubic-metre representations;
- mixed linear units before volume;
- all-dimension and independent-dimension scaling;
- side ratio from volume/surface ratio;
- cost/rate unit validation.

These gaps justify a broad non-QL CP-007 prototype foundation rather than converting the three legacy motifs directly into permanent QLs.

## Legacy misconception recovery

Recovered labels and their MEN-002 interpretation:

| Legacy label | MEN-002 learner-facing misconception seed |
|---|---|
| `Diagonal_vs_Side` | Uses a side or face diagonal when the space diagonal is required. |
| `Scaling_Linear_Assumption` | Applies the linear change only once instead of multiplying all changed dimensions or using `k³`. |
| `TS_CSA_Confusion` | Uses curved/lateral area when total surface area is required, or adds hidden/excluded bases. |
| `Slant_Height_Neglect` | Uses vertical height in a cone/pyramid surface formula that requires slant height. |
| `Sphere_Hemisphere_TSA` | Confuses sphere area, hemisphere CSA and hemisphere TSA. |
| `Recasting_TSA_Invariant` | Preserves surface area during melting/recasting instead of volume. |
| `Wire_Length_Units` | Fails to normalise radius/length units or confuses wire radius with wire length. |
| `Frustum_Formula_Mixup` | Omits the `Rr` cross-term or substitutes cone/cylinder formula. |
| `Internal_vs_External` | Uses full external volume instead of outer-minus-inner material volume. |

Internal taxonomy labels must not appear in student explanations. Every retained distractor must produce an actual displayed wrong option and a concrete correction.

## Scenario defects that must not migrate

### Floating approximation as answer authority

The legacy cube diagonal stores `17.32` rather than exact `10√3`. MEN-002 must store exact surd state and render a decimal only when requested.

### Routine rounding of exact π states

Legacy frustum and hollow-cylinder examples round repeating values to two decimals automatically. MEN-002 must either:

- preserve an exact rational multiple of π;
- use a declared `π = 22/7` or `π = 3.14` policy yielding the requested format; or
- explicitly ask for an approximation.

### Static one-example motifs

One static scenario cannot establish a QL. Every candidate must prove deterministic diversity across dimensions, answers, answer positions, contexts, difficulty factors and misconception options.

### Generic fallback distractors

Legacy option construction may add an arbitrary percentage-offset value when not enough distractors exist. MEN-002 requires declared misconception-derived distractors only.

### Solver/verifier coupling

The legacy scenario stores the answer directly and does not prove a separate verifier. MEN-002 requires exact reconstruction or bounded independent enumeration.

## Provisional disposition summary

```text
RETAIN_AS_CANDIDATE:                    9
MERGE_AS_TRANSFORMATION_FAMILY:         1
MERGE_AS_CONTEXT_PRESENTATION:          1
MERGE_AS_SOURCE_TARGET_REPRESENTATION:  1
MERGE_AS_COMPOSITE_REPRESENTATION:      1
MERGE_AS_CROSS_SHAPE_TRANSFORMATION:    1
TOTAL:                                 14
```

All fourteen recovered motifs are accounted exactly once. Final dispositions will be generated programmatically in the executable audit to prevent reporting drift.

## Next recovery milestone

Before permanent allocation:

1. recover any additional 3D families from pattern registries, fixtures, tests and historical review artifacts;
2. trace each source or legacy family to one provisional CP owner;
3. implement MEN-CP-007 non-QL prototypes for the uncovered axes;
4. classify every prototype as retain, merge, split, defer, reassign or reject;
5. rerun the legacy disposition ledger as executable data rather than prose only;
6. keep all publication and Question Studio flags disabled.
