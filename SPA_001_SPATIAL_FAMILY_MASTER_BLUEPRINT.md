# SPA-001 Spatial Reasoning Family Master Blueprint

## Status

- Family: `SPA-001`
- Product: ExamTree Question Studio
- Stage: architecture and editorial foundation
- Implementation mode: isolated visual adapter
- Target exams: SSC, Banking, Railway and Punjab state examinations

## 1. Purpose

Spatial reasoning must be generated from deterministic semantic geometry, not stored as unrelated pictures. Each question must retain enough information for an independent solver, validator, renderer and explanation system to verify the answer.

The family must add visual capability without changing the behaviour of existing reasoning or Quant chapters.

## 2. Chapter map

| Priority | Chapter | Code |
|---|---|---|
| P0 | Mirror Images | `MIR-001` |
| P0 | Water Images | `WAT-001` |
| P0 | Figure Analogy | `FAN-001` |
| P0 | Figure Classification | `FCL-001` |
| P0 | Figure Series | `FSR-001` |
| P1 | Figure Completion | `FGC-001` |
| P1 | Paper Folding and Cutting | `PFC-001` |
| P1 | Embedded Figures | `EMB-001` |
| P1 | Figure Formation | `FFM-001` |
| P1 | Counting Figures | `FCT-001` |
| P1 | Cubes and Dice | `CND-001` |
| P2 | Dot Situation | `DOT-001` |
| P2 | Figure Matrix | `FMT-001` |
| P2 | Identical Figure | `IDF-001` |

Direction and Distance remains relational reasoning. Number/letter series, text analogy and classification remain separate. Mensuration remains Quant.

## 3. Architecture boundary

Question Studio core continues to own IDs, QL authorities, seeds, language, metadata, approval workflow, option ordering, mock export and analytics.

The Spatial Adapter exclusively owns:

- semantic scenes and geometry primitives;
- reflection, rotation, translation and composition;
- deterministic SVG rendering;
- chapter solvers and visual distractors;
- geometry/topology validation;
- visual explanation overlays;
- folding, figure-graph and cube-orientation engines.

Visual support must be additive:

```ts
interface VisualQuestion extends BaseQuestion {
  kind: "visual";
  visualVersion: "1.0";
  stemScene?: SpatialScene;
  optionScenes: SpatialScene[];
  explanationSteps?: SpatialExplanationStep[];
}
```

All existing questions remain `kind: "text"`. The spatial runtime is lazy-loaded only for visual questions.

## 4. Canonical scene rule

SVG is an output, not the authority. The source of truth is a language-neutral scene containing:

- fixed canvas and view box;
- objects with stable IDs;
- explicit coordinates and layers;
- semantic relationships;
- explicit transformations;
- explanation-highlight metadata.

Initial primitives include lines, paths, circles, arcs, triangles, polygons, squares, grids, arrows, dots, symbols, shaded regions, fold lines, cuts and cube faces.

Initial operations include translation, rotation around a declared pivot, horizontal/vertical/line reflection, position exchange, add/remove, shape replacement, shading movement and compound transformations.

## 5. Generation pipeline

1. Select QL and difficulty band.
2. Derive deterministic parameters from the seed.
3. Build the canonical scene or state sequence.
4. Solve independently of option position.
5. Generate distractors from misconception models.
6. Validate semantic uniqueness and visual integrity.
7. Render SVG from the canonical scenes.
8. Generate explanation steps from solver evidence.
9. Permute options.
10. Recheck answer and explanation consistency.

The solver must return structured evidence such as transformed object IDs, rotation/reflection data, graph matches, counted shapes, fold states or cube-face relationships. Explanations consume this evidence rather than solving again.

## 6. Distractor policy

Distractors must represent likely errors:

- rotation instead of reflection;
- mirror instead of water image;
- wrong angle or direction;
- applying only part of a compound rule;
- missing a marker or shading movement;
- wrong count progression;
- incomplete unfolding;
- duplicate or omitted figure count;
- impossible cube adjacency.

Random visual noise and visibly inferior alignment are prohibited.

## 7. Difficulty model

- **L1 Direct:** one operation and low visual density.
- **L2 Standard exam:** one or two operations with plausible distractors.
- **L3 Advanced:** compound/alternating rules or dense overlap.
- **L4 High discrimination:** interacting rules, complex counting or difficult 3D orientation.

Difficulty is based on reasoning burden, not object count alone.

## 8. Explanation standard

Every explanation contains:

1. Observation;
2. Exact rule;
3. Application to the target;
4. Correct-option check.

“By observing the pattern” and other rule-free explanations are prohibited. Option letters may be inserted only after final option permutation.

## 9. Localisation

Scenes remain language-neutral. English, Hindi and Punjabi localise the instruction, labels, directional terminology and explanation. Embedded text must use localisable objects and pass mobile overflow checks.

Freeze order: English runtime and editorial freeze, terminology authority, Hindi/Punjabi generation, parity proof, multilingual manual freeze.

## 10. Initial runtime proof

| Chapter | Questions |
|---|---:|
| Mirror Images | 12 |
| Water Images | 8 |
| Figure Analogy | 10 |
| Figure Classification | 8 |
| Figure Series | 10 |
| **Total** | **48** |

The proof set must include asymmetric figures, shading, multi-object transformations and near-duplicate distractors.

## 11. Delivery order

1. Freeze family, scene, style and validation contracts.
2. Implement versioned scene types, transformations and SVG renderer.
3. Complete the 48-question runtime proof.
4. Implement `MIR-001` and `WAT-001` in parallel.
5. Implement `FAN-001`, `FCL-001`, then `FSR-001`.
6. Add advanced 2D chapters.
7. Add `CND-001` and secondary chapters.
8. Run family-wide English and multilingual freezes.

## 12. Non-interference gates

Before any runtime merge:

- no visual field is required for existing questions;
- text-only render snapshots remain unchanged;
- existing reasoning regressions remain green;
- no existing family imports the spatial package;
- spatial dependencies are lazy-loaded;
- SVG is sanitised;
- visual payloads are versioned;
- changes are backward compatible;
- a feature flag can disable spatial rendering.

## 13. Completion gates

A chapter is complete only after blueprint approval, runtime proof, automated validity, editorial review, chapter-wide coverage/duplication audit, English freeze, Hindi/Punjabi parity, and Question Studio integration proof.

The next engineering work item after foundation approval is `SPA-FND-001`: implement types, deterministic transformations, SVG rendering, validators and the 48-question proof corpus on a separate feature branch.