# MEN-CP-011 — Approved ExamTree Tube Diagram Standard

## Authority

This document records the owner-approved diagram language for the MEN-CP-011 hollow-cylinder and pipe foundation.

```text
Diagram authority:       TUBE_EXAMTREE_APPROVED_V1
Checkpoint:              MEN-CP-011
Permanent QLs:           0
Question Studio:         disabled
Question Bank:           NOT_STORED
Test eligibility:        INELIGIBLE
Public publication:      false
```

The approved diagram is an original ExamTree implementation. An externally supplied exam-preparation screenshot was used only to discuss the mathematical information that must be visible. Its palette, proportions, typography, annotation layout and artwork are not copied.

## Required visual structure

Every Wave 01 tube package must use one diagram containing one uncut hollow cylindrical tube.

### Structural lines

- white background;
- black outer top ellipse;
- black inner top ellipse;
- black unbroken outer side walls;
- black outer bottom ellipse matching the top profile;
- dashed hidden inner side walls;
- dashed hidden inner bottom ellipse;
- no cutaway, removed wedge, split view or second auxiliary diagram;
- no heavy body fill that can hide the bore or measurements.

### Measurements

- radius measurements are horizontal and confined to the top face;
- outer radius runs from the top-face centre to the outer boundary;
- inner radius runs from the same top-face centre to the inner boundary;
- diameter measurements span the corresponding full top ellipse;
- wall thickness is a horizontal boundary-to-boundary segment across the top annular rim;
- height is a vertical dimension outside the right side of the tube;
- no vertical radius guide may extend into the cylinder or touch the lower hidden ring;
- inverse inner radius remains visibly `r = ?` and never leaks the generated answer.

### Legend

The single diagram contains a small variable legend beneath the object. The legend changes with the representation:

```text
RADII / INVERSE:
R = Outer radius · r = Inner radius · h = Height

DIAMETERS:
D = Outer diameter · d = Inner diameter · h = Height

THICKNESS:
R = Outer radius · r = Inner radius · t = Wall thickness · h = Height
```

## Runtime invariants

Every deterministic package must prove:

```text
single uncut tube topology
white background
matching top and bottom outer ellipses
visible top inner opening
hidden dashed inner walls and bottom ellipse
horizontal top-face radius/diameter measurements
aligned top-rim thickness measurement
height outside the tube
representation-correct variable legend
no inverse-answer leakage
no old orthographic split view
no heavy opaque body fill
```

## Lifecycle

This visual approval changes only the temporary executable diagram authority. It does not allocate permanent QLs or enable any product surface.
