# MEN-CP-011 — Hollow Tube Diagram Remediation

## Status

Corrective implementation record for Foundation Wave 01.

```text
Checkpoint:              MEN-CP-011
Affected runtime:        cp011-foundation
Permanent QLs:           0
Question Studio:         disabled
Question Bank:           NOT_STORED
Test eligibility:        INELIGIBLE
Public publication:      false
```

## Defect confirmed

The original Wave 01 SVG did not depict a cylindrical pipe correctly. It combined three polygonal faces resembling a cuboid or rectangular duct and then placed a pair of ellipses on the near face.

The same radius-style centre-to-edge arrows were also reused for diameter questions, and the wall-thickness label was not anchored to the radial material band.

These defects could cause a learner to misread:

- the outer body as a rectangular prism;
- a diameter as a radius;
- wall thickness as a separate dimension unrelated to `R-r`;
- the inner white ellipse as a shallow hole rather than a void running through the full length.

## Corrected diagram authority

`TUBE_ORTHOGRAPHIC_V2` uses two mathematically unambiguous views.

### End view

- true concentric circles;
- shaded annular material between outer and inner boundaries;
- white central opening;
- radius arrows only for radius representations;
- full double-headed diameter arrows only for diameter representations;
- a boundary-to-boundary radial segment for wall thickness;
- `r = ?` remains symbolic for inverse-inner-radius questions.

### Longitudinal section

- parallel outer cylindrical boundaries;
- parallel inner boundaries;
- open gaps at both ends;
- one continuous central void through the full pipe length;
- pipe length `h` shown by a horizontal double-headed arrow.

The two-view technical schematic is deliberately preferred over a decorative pseudo-3D drawing because it makes the annular cross-section, open ends and continuous void explicit.

## New executable invariants

Every temporary package must now prove:

```text
orthographic hollow-tube topology
representation-correct dimension arrows
unit-aware diagram and state-label parity
no invented inverse dimension in SVG or metadata
continuous inner void through full length
no legacy cuboid-perspective path
```

## Audit scope note

The supplied senior audit also discusses 2D paths, rectangles, triangles, direct intact-cylinder capacity and synthetic occupational stems across other Mensuration checkpoints. Those findings are not evidence about the four MEN-CP-011 Wave 01 hollow-pipe prototypes and are not applied here without checkpoint-specific source proof.

The valid CP-011-specific finding is the incorrect tube schematic. The corrected runtime preserves all existing exact mathematics, options, explanations, misconception codes and lifecycle locks.
