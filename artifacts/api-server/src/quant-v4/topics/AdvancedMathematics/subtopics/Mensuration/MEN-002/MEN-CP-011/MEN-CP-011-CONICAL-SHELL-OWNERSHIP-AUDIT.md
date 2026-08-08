# MEN-CP-011 — Conical Shell Ownership Audit

## Status

```text
Authority:          MEN-CP011-CONICAL-SHELL-OWNERSHIP-AUDIT-V1
Audit type:         executable ownership and geometry gate
Permanent QLs:      0
Question Studio:    disabled
Question Bank:      NOT_STORED
Test eligibility:   INELIGIBLE
Publication:        false
```

This audit follows completion of the initial 20-candidate MEN-CP-011 architecture. It decides which conical tasks belong to CP-011 and which must remain with neighbouring canonical problems.

It does not itself authorise permanent QLs or chapter freeze.

## Governing ownership rule

A cone-shaped context belongs to MEN-CP-011 only when the decisive learner transformation is an explicit inner–outer shell or vessel relationship, such as:

- outer conical volume minus an explicitly defined inner conical void;
- combined inner and outer curved surfaces of a conical shell;
- lining or coating where the inner surface is part of a declared shell state;
- comparison or inverse reasoning based on an auditable conical shell relation.

A cone-shaped context does not belong to MEN-CP-011 merely because it is hollow in everyday language.

## Neighbouring authorities

### MEN-CP-008 — Cylinders and Cones

Retains:

- direct cone volume;
- direct cone curved surface area;
- direct cone total surface area;
- direct slant-height, radius and height recovery;
- cone canvas or coating cost when only one intact cone surface is measured;
- inner conical lining cost when the inner cone alone is supplied and no inner–outer shell relation is needed.

The decisive reasoning in these tasks is ordinary cone measurement.

### MEN-CP-010 — Pyramids and Frustums

Retains:

- truncated cones;
- conical frustum volume and surface area;
- frustum slant-height and inverse tasks.

A frustum must not be relabelled as a hollow cone.

### MEN-CP-012 — Recasting and Volume Conservation

Retains any task where material is melted, recast or transformed between solids. Conservation of volume is decisive even when one of the solids is conical.

### MEN-CP-013 — Composite and Removed Solids

Retains a drilled or removed conical void when composite-solid subtraction or containment is decisive and no shell/vessel relation governs the cavity.

## Why a single cone thickness is unsafe

For a cylinder, a radial wall thickness directly gives:

```text
inner radius = outer radius − thickness
```

For a box, thickness on both opposite sides gives:

```text
inner length = outer length − 2 × thickness
```

A cone has no equally simple universal conversion from one scalar thickness to both inner radius and inner height.

The following inference is therefore forbidden unless the problem explicitly defines it:

```text
r = R − t
h = H − t
```

Radial offset, axial offset, slant offset and perpendicular wall thickness are different geometric quantities for a cone. Treating them as interchangeable creates a physically ambiguous shell.

## Authorised CP-011 relations

### 1. Explicit shared-base inner cone

The state supplies all required outer and inner dimensions:

```text
outer cone: R, H and optional L
inner void: r, h and optional l
```

Required checks:

```text
R > 0, H > 0
r > 0, h > 0
r < R
h ≤ H
L² = R² + H² when L is supplied
l² = r² + h² when l is supplied
```

The state must describe where the two cone bases and apices lie. The generator may not infer this topology from dimensions alone.

### 2. Declared similar shared-base wall

The state explicitly declares a valid parallel-wall or similarity relationship. For the current provisional shared-base model:

```text
r / R = h / H
```

or equivalently:

```text
rH = Rh
```

The similarity statement must appear in the canonical state and learner explanation. It must never be silently inferred.

## Rejected relations

Reject generation when:

- only an outer cone and one unspecified “uniform thickness” are supplied;
- inner radius is not smaller than outer radius;
- inner height extends beyond the outer cone;
- a declared similarity ratio is mathematically false;
- a supplied slant height fails the Pythagorean relation;
- the task is actually a frustum, recasting problem or composite drilled-solid problem;
- the inner/outer topology is not explicit enough to determine material or exposed surfaces uniquely.

Rejected states are classified as:

```text
REJECT_UNDERSPECIFIED
```

They must not reach Question Studio, the Question Bank or learner surfaces.

## Executable audit matrix

The audit contains 14 representative scenarios:

```text
MEN-CP-008 direct cone scenarios:       3
MEN-CP-010 frustum scenarios:           1
MEN-CP-011 valid shell scenarios:       4
MEN-CP-012 recasting scenarios:         1
MEN-CP-013 composite-removal scenarios: 1
Rejected ambiguous/invalid scenarios:   4
Total:                                  14
```

The four valid MEN-CP-011 scenarios cover:

- explicit hollow-cone material volume;
- material volume under a declared similar-wall relation;
- both inner and outer curved surfaces;
- inner lining cost derived from a declared shell.

The rejected scenarios cover:

- ambiguous single-thickness modelling;
- non-smaller inner radius;
- broken declared similarity;
- inconsistent slant height.

## Authorised next temporary prototypes

The audit authorises discovery-only implementation of:

```text
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL
MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES
MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL
```

These are discovery candidates, not frozen QLs. They may merge or split after source, editorial, option and representation audits.

## Required runtime state for implementation

Every generated conical shell state must record:

```text
outer radius and height
inner radius and height
optional verified outer and inner slant heights
base/apex alignment and cavity topology
explicit relation type
included, open, absent and hidden surfaces
pi policy
unit system
lifecycle locks
```

Stem, solver, verifier, options, explanation and diagram must derive from this single state.

## Diagram requirements

A conical shell diagram must:

- distinguish outer material boundary from the inner void;
- label outer and inner radii from the correct centres;
- show outer and inner heights without implying a false shared apex;
- display the declared similarity or alignment relation when used;
- distinguish absent/open bases from material faces;
- use separate prompt and solution roles;
- remain text-complete when the attempt diagram is hidden;
- avoid fixed SVG width and preserve `min-width: 0` responsiveness.

## Proof files

```text
conical-ownership.ts
conical-ownership-canonical.ts
conical-ownership.test.ts
conical-ownership-review-export.ts
```

The canonical layer converts every geometrically invalid provisional decision to `REJECT_UNDERSPECIFIED` before evidence or future generation is exposed.

## Remaining chapter blockers

```text
CONICAL_EXECUTABLE_FAMILIES_NOT_IMPLEMENTED
DIRECT_SOURCE_NORMALISATION_PENDING
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
MULTILINGUAL_PARITY_PENDING
```

The initial 20-candidate architecture remains complete, but MEN-CP-011 remains unfrozen and unpublished.
