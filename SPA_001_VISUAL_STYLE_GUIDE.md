# SPA-001 Visual Style Guide

## 1. Objective

Spatial questions must be exam-like, readable on mobile devices, visually neutral and deterministic. Rendering quality must never reveal the correct answer or change the underlying reasoning difficulty.

SVG is the required runtime format. Raster images may be used only as external source references during editorial research, never as canonical generated questions.

## 2. Canonical canvas

- Every stem panel and every option uses an explicit `viewBox`.
- Options within one question use identical canvas dimensions.
- Content is centred by geometric bounds, not manual pixel offsets.
- A safe margin surrounds all visible content.
- No object may touch or cross the canvas edge unless the question explicitly requires an open/cropped boundary.
- Rendering must remain sharp at standard phone, tablet and desktop sizes.

Recommended initial logical canvases:

- single figure: `120 × 120`;
- analogy cell: `110 × 110`;
- series cell: `100 × 100`;
- complex figure: `160 × 160`;
- paper-fold sequence panel: `140 × 140`.

These are logical units, not fixed CSS pixels.

## 3. Stroke and shape rules

- Use consistent stroke width across the question unless thickness is itself meaningful.
- Default stroke caps and joins must be fixed globally.
- Filled and unfilled regions must have strong contrast.
- Dashes are reserved for folds, construction lines or another declared semantic role.
- Dots, holes and markers must remain distinguishable at minimum mobile scale.
- Intersections must be visually clear; near-misses must not appear connected.
- Curves must be represented as paths with stable control points.
- Arbitrary decorative styling, gradients, shadows and 3D effects are prohibited.

## 4. Colour and accessibility

The initial exam mode should remain understandable in monochrome. Colour may support explanation highlighting, but the answer must never depend on colour alone.

- Base question figures: neutral foreground on a plain background.
- Explanation overlays: use both colour and a second cue such as numbering, arrows, hatching or thicker outline.
- Maintain readable contrast in light and dark application themes.
- Provide accessible text descriptions for visual questions where feasible.
- Do not encode different semantic states only through red/green distinction.

## 5. Text and symbols

- Prefer language-neutral shapes and markers.
- Text embedded in figures must be represented by localisable scene objects.
- Use an approved font set that covers English, Hindi and Punjabi.
- Avoid ambiguous characters and fonts in mirror/water questions.
- Labels must not overlap geometry or leave the canvas after localisation.
- Option labels belong to the application shell, not the SVG scene.

## 6. Option fairness

All options must receive the same rendering treatment:

- identical canvas and border;
- same scale policy;
- same stroke and fill rules;
- comparable centring and whitespace;
- same antialiasing and export quality;
- no answer-specific sharpness, density or alignment advantage.

The correct option must not be the only perfectly centred, unclipped, complete or symmetrical choice unless that property is the intended reasoning rule.

Distractors may differ semantically, but not because of accidental rendering defects.

## 7. Visual density limits

Each QL defines a permitted density range. Density considers:

- object count;
- visible intersections;
- nested depth;
- number of relevant markers;
- similarity between options;
- minimum separation between lines or symbols.

A generated candidate is rejected if details merge at the minimum supported display width. Difficulty may increase through reasoning complexity, but not through unreadably small drawing.

## 8. Chapter-specific rules

### Mirror and Water Images

- Show the mirror/water line only when the stem pattern requires it.
- Keep the source figure a controlled distance from the line.
- Reflections must preserve geometry and stroke semantics.
- Do not mix a true reflection with an accidental scale or translation difference.

### Figure Analogy and Series

- Use consistent cell sizes and spacing.
- Relationship symbols such as `:` and `::` remain outside scenes.
- Sequence arrows or separators must not be confused with figure objects.
- Compound rules should remain visually traceable in the explanation.

### Paper Folding and Cutting

- Fold lines are dashed and visually distinct from cuts.
- Fold direction uses a consistent arrow convention.
- Active and folded layers must be distinguishable in explanation views.
- Intermediate panels must not silently rotate the paper for convenience.

### Embedded and Counting Figures

- Intersections must be exact.
- Lines that merely pass close to one another must stay visibly separate.
- Explanation highlights may number or thicken counted objects, but the base question remains neutral.

### Cubes and Dice

- Use one consistent projection convention.
- Face symbols are centred and do not imply orientation unless orientation matters.
- Hidden edges are omitted or styled consistently according to the question type.
- Different answer options use the same cube scale and viewing angle policy.

## 9. Explanation visuals

Explanation scenes may add:

- direction arrows;
- ghost positions;
- highlighted object outlines;
- fold-stage numbering;
- matched vertices or edges;
- counted-shape numbering;
- cube-face labels.

Every overlay references stable semantic object IDs. Hand-placed explanation marks that are not tied to solver evidence are prohibited.

## 10. Responsive rendering

Minimum acceptance checks:

- no horizontal scrolling inside a normal question card;
- four options remain readable in the supported mobile layout;
- zooming does not reveal clipped SVG content;
- text labels fit in English, Hindi and Punjabi;
- interaction targets are controlled by the application shell and remain accessible;
- print/export maintains the same geometry and answer.

## 11. Determinism and snapshots

Given the same QL, seed, language and visual version, scene data and rendered SVG structure must be reproducible. Generated element order, IDs and numeric rounding must be stable enough for meaningful visual regression snapshots.

## 12. Prohibited practices

- storing the correct option as a manually selected image;
- embedding external image URLs in generated questions;
- using unsanitised raw SVG or scripts;
- relying on random pixel jitter to create distractors;
- resizing each option independently until it “looks right”;
- hiding ambiguity through low resolution;
- using colour as the only answer-bearing feature;
- producing explanations that show a different geometry from the question.

## 13. Manual visual review checklist

A reviewer must confirm:

1. The stem is immediately legible.
2. All options have equal visual treatment.
3. No option is accidentally clipped or scaled differently.
4. Intended intersections and separations are clear.
5. The correct answer is not visually leaked.
6. Distractors resemble realistic mistakes.
7. The difficulty comes from reasoning, not poor drawing.
8. The explanation overlay accurately demonstrates the solver rule.
9. Mobile and multilingual previews remain readable.
10. The figure resembles the visual discipline of real competitive-exam material.