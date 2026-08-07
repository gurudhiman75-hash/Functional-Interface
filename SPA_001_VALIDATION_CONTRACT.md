# SPA-001 Spatial Validation Contract

## 1. Purpose

A spatial question is publishable only when its semantic state, solver result, options, rendering and explanation agree. Rendering successfully is not proof of validity.

Validation is layered so a chapter can add specialised checks without modifying validators for other reasoning families.

## 2. Validator registry

The generic pipeline selects validators by question kind and chapter:

```ts
validatorRegistry.register("visual", commonSpatialValidators);
validatorRegistry.register("MIR-001", mirrorValidators);
validatorRegistry.register("PFC-001", paperFoldValidators);
validatorRegistry.register("CND-001", cubeDiceValidators);
```

Text-only chapters do not execute or import spatial validators.

## 3. Validation stages

### Stage A — Schema validity

- supported `visualVersion`;
- valid scene dimensions and view box;
- unique scene and object IDs;
- recognised primitive and transformation types;
- finite numeric coordinates;
- valid references between objects, relationships and explanation steps;
- exactly the configured number of options;
- declared equivalence policy.

### Stage B — Semantic validity

- source parameters satisfy the QL contract;
- all required objects and relationships exist;
- transformation order is explicit;
- solver can derive an answer without using the stored option index;
- generated state respects the requested difficulty band;
- chapter exclusions are not violated.

### Stage C — Answer uniqueness

- exactly one option is equivalent to the solver answer under the declared policy;
- no second option becomes correct after allowed rotation, reflection or relabelling;
- distractors are distinct from one another;
- near-duplicates remain meaningfully distinguishable at supported display size;
- answer uniqueness is rechecked after option permutation.

### Stage D — Visual integrity

- all visible objects remain inside safe bounds;
- intended intersections are exact;
- unintended overlaps and near-tangencies are rejected;
- labels do not overlap or overflow;
- stroke widths, fills and dashes are valid;
- each option uses the same sizing and centring policy;
- minimum feature size and separation pass mobile limits;
- rendered SVG is sanitised and contains no script or external resource.

### Stage E — Explanation consistency

- explanation evidence refers to existing semantic objects;
- the named rule matches the solver rule IDs;
- visual steps apply the same transformations as the solution;
- final explanation scene is equivalent to the correct option;
- option letter/index is inserted only after final permutation;
- the closest-distractor explanation, when present, describes its actual misconception.

### Stage F — Determinism

For the same QL, seed, language and visual version:

- semantic parameters are identical;
- scene objects and IDs are stable;
- solver evidence is identical;
- option semantics are identical before and after deterministic permutation;
- SVG output is stable apart from explicitly ignored metadata.

## 4. Equivalence policies

Each question declares what transformations preserve equality.

Examples:

- `EXACT`: coordinates and semantics must match exactly;
- `TRANSLATION_NORMALISED`: absolute placement is ignored;
- `ROTATION_ALLOWED`: specified rotations are equivalent;
- `REFLECTION_ALLOWED`: reflection is allowed only when declared;
- `GRAPH_ISOMORPHIC`: vertex labels may differ but topology must match;
- `CUBE_ROTATION`: any valid 3D rotation of the same labelled cube is equivalent.

Validators must never assume rotation or reflection is allowed merely because figures look similar.

## 5. Common rejection codes

| Code | Meaning |
|---|---|
| `SPA_SCHEMA_INVALID` | Scene or object contract is malformed |
| `SPA_SOLVER_FAILED` | Independent solver cannot derive an answer |
| `SPA_NO_CORRECT_OPTION` | No option matches solver result |
| `SPA_MULTIPLE_CORRECT` | More than one option matches |
| `SPA_DUPLICATE_OPTION` | Two options are semantically equivalent |
| `SPA_NEAR_DUPLICATE_UNREADABLE` | Difference is below readability threshold |
| `SPA_OUT_OF_BOUNDS` | Visible content crosses safe bounds |
| `SPA_UNINTENDED_INTERSECTION` | Geometry creates an undeclared intersection |
| `SPA_LABEL_OVERFLOW` | Localised label does not fit |
| `SPA_DIFFICULTY_DRIFT` | Candidate exceeds the QL difficulty contract |
| `SPA_EXPLANATION_MISMATCH` | Explanation disagrees with solver or option |
| `SPA_NON_DETERMINISTIC` | Seed replay changes semantic output |
| `SPA_UNSAFE_SVG` | SVG contains forbidden content |

All failed candidates record the rejection code and may retry with a derived seed within a fixed retry budget.

## 6. Chapter-specific contracts

### Mirror and Water Images

- reflect around the declared line;
- preserve distances and shape geometry;
- reject rotation-only distractors that accidentally equal the answer;
- verify all asymmetric markers and shading transform correctly.

### Figure Analogy

- verify A→B rule from semantic states;
- reject when several equally simple registered rules explain A→B and produce different answers for C;
- verify the same rule is applied to C;
- verify compound-rule order.

### Figure Classification

- prove the common property for all non-odd figures;
- prove the odd figure violates it;
- reject alternative properties that produce another valid odd figure at equal or lower complexity.

### Figure Series

- verify every consecutive state transition;
- verify alternate-term or cyclic period where used;
- reject sequences that admit multiple registered continuations;
- confirm the answer is the next state, not merely a later valid state.

### Figure Completion

- compare all boundary entry/exit points;
- verify line continuity, curvature and shading;
- reject extra or missing internal segments not permitted by the source figure.

### Paper Folding and Cutting

- validate fold lines against the active polygon;
- track folded side, layer count and reflection transform;
- apply cuts only to reachable folded layers;
- reverse every fold in the correct order;
- verify symmetry and boundary notches in the unfolded result.

### Embedded Figures

- target must map to an allowed graph substructure;
- all required target edges must exist;
- forbidden extra target edges or invalid reflections are rejected according to policy;
- passing background lines do not invalidate a legitimate embedding.

### Figure Formation

- every piece is used according to the QL rule;
- placements do not overlap illegally;
- joined boundaries match;
- reflection is rejected unless explicitly allowed;
- resulting outer boundary equals the target.

### Counting Figures

- every counted object has a complete boundary;
- vertex and edge sets are canonicalised to prevent duplicate counting;
- size/orientation grouping totals equal the final answer;
- explanation groups reference the same object inventory.

### Cubes and Dice

- face labels are unique as required;
- adjacency and opposites are derived from a valid orientation;
- cube-net folding produces no overlapping faces;
- equivalent 3D rotations are canonicalised;
- painted-cube counts derive from subdivision coordinates and exposed faces;
- impossible arrangements are proven impossible across all valid rotations.

## 7. Distribution and editorial audits

Batch validation also checks:

- correct-answer position balance;
- excessive reuse of the same base scene;
- repeated option patterns;
- dominance of one rule or difficulty band;
- repeated explanation wording;
- visual-density distribution;
- coverage of required misconception families;
- seed collision or duplicate semantic questions;
- English/Hindi/Punjabi semantic parity.

These audits may pass individual questions but block chapter freeze when the collection is weak or repetitive.

## 8. Test requirements

The spatial runtime requires:

- unit tests for primitives and transformations;
- property tests for reflection/rotation invariants;
- solver-versus-option uniqueness tests;
- deterministic seed replay tests;
- SVG sanitisation tests;
- mobile-bound and minimum-feature checks;
- explanation consistency tests;
- fixed regression fixtures for every rejection code;
- visual snapshots for the 48-question proof corpus;
- existing text-question regression suite as a mandatory non-interference gate.

## 9. Manual review gate

Automated validity cannot prove exam readiness. A reviewer must verify that:

- the intended rule is natural and recognisable;
- no unintended shortcut exists;
- distractors represent realistic mistakes;
- the figure is readable without zoom;
- difficulty is correctly labelled;
- the explanation is useful to a student;
- the item resembles real competitive-exam standards.

## 10. Foundation acceptance criteria

The validation foundation is approved when all common rejection codes have test fixtures, equivalence policies are frozen, the 48-question proof corpus passes semantic and visual checks, existing reasoning regressions remain unchanged, and every proof explanation is generated from solver evidence.