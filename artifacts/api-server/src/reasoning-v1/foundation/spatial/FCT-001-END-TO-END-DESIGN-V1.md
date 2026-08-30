# FCT-001 Counting Figures — End-to-End Design V1

## Status

Foundation/design authority only. No permanent QL allocation, Question Studio registration, Question Bank write, test eligibility, public publication or deployment is authorized by this document.

## 1. Chapter boundary

`FCT-001` covers exact counting of geometric figures that are actually present in a drawn line network. The chapter is not a visual-estimation task: every counted object must be derivable from explicit vertices and line coverage.

Current source-backed SSC core:

- triangle counting;
- square counting;
- rectangle counting;
- quadrilateral counting.

Held until direct source evidence / solver maturity is sufficient:

- standalone line-segment counting;
- circle/arc-region counting;
- mixed-shape questions asking for several shape classes at once;
- ambiguous drawings where intersections are not semantically declared.

## 2. Latest QL policy

The legacy inventory planning range of 100–140 English QLs is not used as a quota. Permanent QLs are semantic learner-skill boundaries, not template counts.

Working candidate:

- `FCT-CAND-A-CLOSED-POLYGON-ENUMERATION`: systematically enumerate all valid closed target figures in a straight-line graph.

Triangle, square, rectangle and quadrilateral are initially treated as `targetShape` parameters of the same candidate rather than separate QLs. They may split only if source saturation and learner review prove materially different solve modes.

Held candidates:

- `FCT-HOLD-B-REGULAR-GRID-FORMULA`: hold until evidence shows a distinct formula-first learner surface should not merge into closed-polygon enumeration.
- `FCT-HOLD-C-LINE-SEGMENT-COUNT`: hold pending direct-paper saturation and an open-path counting solver.

The next globally available Spatial ID remains `SPA-QL-042`; it is not allocated at CP001.

## 3. Source-backed exam reality

Recent direct SSC CGL 2024 official-paper mirrors contain repeated triangle and square counting questions across multiple shifts. Direct SSC CGL/CHSL evidence also exists for rectangle and quadrilateral counting in 2017–2023.

This chapter therefore starts from real SSC task forms rather than synthetic syllabus labels.

Banking and Punjab-state coverage must be recorded separately when direct evidence is obtained; SSC evidence must not be silently generalized to those exam families.

## 4. Semantic representation

A counting figure is represented as a planar straight-line graph:

- finite coordinate vertices;
- undirected straight edges;
- every true line intersection is an explicit vertex;
- long visible lines may be represented by atomic collinear edges between consecutive semantic vertices;
- styling, stroke width and rendering scale are not semantic.

A side between two candidate corner vertices exists when the complete straight segment is covered by one or more collinear graph edges. This allows a large triangle/square/rectangle to be counted even when its side contains intermediate vertices.

## 5. Exact solver foundation

CP001 must prove:

1. graph validation;
2. straight-path coverage between arbitrary vertices;
3. exact triangle enumeration;
4. exact rectangle enumeration under an explicit rectangle policy;
5. exact square enumeration, including rotated squares;
6. deterministic de-duplication by semantic corner set.

Rectangle policy is explicit because exam/editorial wording can differ:

- `INCLUDE_SQUARES`: mathematical rectangle definition;
- `EXCLUDE_SQUARES`: strict non-square rectangles.

No question may depend on an unstated convention.

Quadrilateral enumeration is source-backed but held from production until the generic simple-cycle solver is proven for convex and concave cases.

## 6. Difficulty and diversity axes

These are parameters, not automatic QLs:

- number of primitive cells;
- number of intersections;
- nested/composite size classes;
- axis-aligned versus rotated geometry;
- symmetric versus asymmetric layout;
- target shape;
- answer magnitude;
- distractor distance from the correct count.

## 7. Generation strategy

Production generators should compose validated motif families rather than draw arbitrary random line soup.

Planned motif families include:

- subdivided triangle;
- fan/cevian triangle;
- crossed rectangle;
- square grid;
- partially subdivided grid;
- nested squares;
- rotated-square/diamond overlays;
- stepped rectangle assemblies;
- asymmetric polygon networks.

Every generated graph is solved independently before the MCQ is accepted.

## 8. Distractor ownership

Distractors must map to counting mistakes:

- smallest-only count;
- omission of composite/large figures;
- double-counting the same semantic figure;
- including an open/incomplete boundary;
- including a wrong target shape;
- rectangle/square convention trap only when the stem explicitly resolves the convention.

Random nearby numbers without a misconception owner are prohibited.

## 9. Explanation contract

Human-facing explanation structure:

1. state what shape is being counted;
2. count by size/structural class;
3. name or visually identify composite figures;
4. sum the classes;
5. optionally mention the nearest misconception trap.

The explanation must not merely state a formula or unsupported total.

## 10. Visual contract

- white 120×120 or equivalent normalized canvas;
- consistent stroke width;
- no clipped intersections;
- no accidental micro-gaps that change topology;
- no decorative marks that can be mistaken for vertices/edges;
- readable on mobile;
- answer options are numeric unless an exam task explicitly requires figures.

## 11. Localization

English/Hindi/Punjabi stems must preserve the exact target shape and counting convention. Geometry and answer remain invariant across languages.

Examples of canonical concepts requiring semantic localization:

- triangle / त्रिभुज / ਤਿਕੋਣ;
- square / वर्ग / ਵਰਗ;
- rectangle / आयत / ਆਯਤ;
- quadrilateral / चतुर्भुज / ਚਤੁਰਭੁਜ.

## 12. Governance gates

CP001 — source-saturated discovery + exact graph foundation.

CP002 — source-family saturation, motif inventory, quadrilateral/simple-cycle decision, proposal merge/split decision.

CP003 — deterministic production generator + misconception distractors + scale proof.

CP004 — learner visual review + exam-realness/gap/exhaustiveness audit.

CP005 — permanent QL allocation beginning at `SPA-QL-042` only after approved semantic boundaries.

CP006 — English freeze.

CP007 — Hindi/Punjabi localization + parity + freeze.

CP008 — seeded Question Studio/operator review.

CP009 — standard registration and current-main integration under manual-approval/no-auto-publication governance.

## 13. CP001 acceptance

CP001 can be called green only if:

- direct SSC evidence spans multiple years and at least triangle/square/rectangle task forms;
- graph validation rejects malformed inputs;
- composite straight sides are detected correctly;
- triangle, square and rectangle counts match deterministic fixtures;
- rotated-square support is proven;
- no permanent QL is allocated prematurely;
- one focused branch/path-scoped workflow is the only intended CI workflow for the checkpoint.
