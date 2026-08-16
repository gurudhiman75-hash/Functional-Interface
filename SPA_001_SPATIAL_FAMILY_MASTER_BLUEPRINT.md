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

`MIR-001` and `WAT-001` remain separate implementation and freeze authorities even when the student-facing product groups them together. Both consume the same shared reflection engine.

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

For glyph-based questions, browser text and operating-system fonts are not geometry authorities. Every supported glyph must have one canonical ExamTree vector scene plus a verified symmetry profile. Mirror and water variants are derived from that canonical scene through the shared reflection engine rather than stored as independent hand-authored answers.

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

Before final option selection, the validator must compare the canonical fingerprints of the unchanged stimulus, vertical reflection, horizontal reflection, 180-degree rotation and every chapter-specific distractor candidate. Any collision is rejected before packaging.

## 6. Distractor policy

Distractors must represent likely errors:

- rotation instead of reflection;
- mirror instead of water image;
- wrong angle or direction;
- applying only part of a compound rule;
- reversing glyph order without reflecting glyph shapes;
- reflecting individual glyphs without reversing string order;
- missing a marker or shading movement;
- snapping an analog-clock hour hand to the hour mark;
- wrong count progression;
- incomplete unfolding;
- duplicate or omitted figure count;
- impossible cube adjacency.

Random visual noise and visibly inferior alignment are prohibited. A malformed or non-authoritative glyph is a generation defect and must reject the question; it is not a normal learner distractor.

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

Mirror-image clock explanations may use the standard arithmetic shortcut only after an independent continuous hand-angle cross-check agrees. Water-image clocks must be explained through direct horizontal reflection of the two hand angles; no stated-time shortcut is authoritative.

## 9. Localisation

Scenes remain language-neutral. English, Hindi and Punjabi localise the instruction, labels, directional terminology and explanation. Embedded text must use localisable objects and pass mobile overflow checks.

Spatial locale modes are:

- `LANGUAGE_NEUTRAL` for geometric scenes and analog clocks;
- `INSTRUCTION_LOCALISED` for Western Arabic digits and shared symbols;
- `SCRIPT_SPECIFIC` for Latin, Devanagari and Gurmukhi glyph questions.

A Latin-letter visual question is not translated into Hindi or Punjabi through word replacement. Devanagari and Gurmukhi glyph content requires independently built and verified vector authorities. Until those authorities exist, multilingual parity for Mirror/Water chapters may be delivered through digits, clocks and geometric scenes rather than false glyph translation.

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

Mirror-clock proof questions must model the hour hand continuously at 0.5 degrees per elapsed minute and must pass both geometric and arithmetic mirror checks.

Water-clock proof questions must use diagram options and direct reflected hand angles. A reflected water-clock diagram must not be converted into a stated real time unless an independent exact hand-angle solver proves that both reflected hands match that time; the default and chapter policy is diagram-only.

## 11. Delivery order

1. Freeze family, scene, style and validation contracts.
2. Implement versioned scene types, transformations and SVG renderer.
3. Complete the 48-question runtime proof.
4. Implement `MIR-001` and `WAT-001` in parallel.
5. Implement `FAN-001`, `FCL-001`, then `FSR-001`.
6. Add advanced 2D chapters.
7. Add `CND-001` and secondary chapters.
8. Run family-wide English and multilingual freezes.

Before Mirror/Water QLs begin, the shared foundation must include symmetry classification, transform-collision validation, continuous clock geometry and canonical glyph-authority contracts.

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

Self-symmetry classification is a shared runtime capability. It must remain prototype-only until exam-source auditing supports a permanent chapter checkpoint and QL allocation.

## 14. Mirror and Water pre-implementation safeguards

The following are mandatory before Wave 02 or any chapter generator proceeds:

- every source scene receives a vertical, horizontal and 180-degree symmetry profile;
- ordinary transform questions reject a source unchanged by the requested transform;
- all transform-derived option candidates are fingerprinted before selection;
- exactly one candidate may match the requested transform;
- glyph questions use canonical vector scenes and script-specific locale ownership;
- analog clock state uses `minuteAngle = minute × 6` and `hourAngle = hour × 30 + minute × 0.5`;
- mirror-clock arithmetic is only an independent cross-check over geometric truth;
- water-clock output is diagram-only by default because horizontal reflection generally does not correspond to a valid real clock time;
- Question Studio review evidence records requested transform, symmetry profile, canonical fingerprints, option transform labels, collision-check result and applicable clock checks.

The next engineering work item remains `SPA-FND-001`: complete deterministic scene utilities, solver evidence, explanation overlays and the 48-question proof corpus on the isolated feature branch before chapter activation.
