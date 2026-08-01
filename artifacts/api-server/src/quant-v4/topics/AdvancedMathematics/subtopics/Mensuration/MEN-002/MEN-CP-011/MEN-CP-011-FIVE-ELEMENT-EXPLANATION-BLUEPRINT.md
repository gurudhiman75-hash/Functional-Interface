# MEN-CP-011 Five-Element Explanation and Diagram Blueprint

## Status

**Mandatory editorial authority for future MEN-CP-011 prototypes and permanent QLs.**

This file does not allocate a QL or claim runtime completion. It defines the learner-facing contract that every later executable package must prove.

## Exact learner-facing sequence

### 1. Picture the Shape First

Start with one physical sentence before any formula.

Approved anchor families:

- hollow pipe: “Think of a thick solid rod with a smaller cylinder drilled straight through the centre.”
- hollow cube/cuboid: “Think of a solid block with a smaller matching block removed from inside.”
- spherical shell: “Think of a ball with a smaller spherical hollow space at its centre.”
- open box: “Think of a box whose lid is missing, so only the base and side walls use material.”
- joined solids: “Think of two blocks pressed face-to-face; the touching faces are hidden inside the joined solid.”
- solid on a floor: “Think of the bottom face resting on the floor, so that face is not exposed for painting.”

The anchor must match the exact generated topology. A closed pipe may not be described as open, and a one-ended vessel may not be described as open at both ends.

### 2. Main Rule and Variable Meanings

Explain the physical operation before the compact formula.

For a hollow cylinder:

```text
material volume = outer cylinder volume − inner empty cylinder volume
V = πR²h − πr²h = πh(R² − r²)
```

Define:

```text
R = outer radius
r = inner radius
h = pipe length or cylinder height
t = uniform radial thickness = R − r
```

For a hollow cuboid:

```text
material volume = outer cuboid volume − inner void volume
```

For exposure tasks:

```text
exposed area = sum of included outer surfaces − hidden/contact surfaces
```

Do not present a memorised formula before explaining what material or surface is being included and excluded.

### 3. Unit-Preserving Step-by-Step Solution

Every step must state its dimensional meaning.

Required examples:

```text
R = 5 cm, r = 3 cm, h = 14 cm                 [length]
R² − r² = 25 cm² − 9 cm² = 16 cm²            [cross-sectional ring area]
V = (22/7) × 14 cm × 16 cm² = 704 cm³         [material volume]
```

Rules:

- lengths use `cm`, `m`, `mm`, etc.;
- surface and cross-sectional areas use square units;
- material volume uses cubic units;
- matching dimensions must be converted before subtraction;
- cost calculations must show how area or volume units cancel against the rate denominator;
- count answers must be dimensionless whole numbers;
- no step may silently change `cm` to `m`, `cm²` to `m²`, or `cm³` to litres.

### 4. Exam Speed Trick

For hollow circular material, use:

```text
R² − r² = (R − r)(R + r)
```

Example:

```text
25² − 21² = (25 − 21)(25 + 21) = 4 × 46 = 184
```

Additional valid shortcuts:

- use `R-r = t` immediately when thickness is supplied;
- cancel `h`, `π` or common factors in ratios before multiplying;
- use a surface ledger for open/closed faces instead of memorising separate formulas;
- for joined equal cubes, subtract two touching face areas per join from the separate-surface total;
- convert all dimensions once at the start, not repeatedly inside later steps.

A shortcut must be valid for the generated state and may not replace the standard worked solution.

### 5. Common Traps and Option Misconception Analysis

Explain all three actual shuffled wrong options. Each paragraph must contain:

```text
Option letter
Displayed option value
Actual wrong calculation
Correct correction
Stable public trap code
```

Example codes:

```text
[USED_OUTER_SOLID_VOLUME_ONLY]
[CALCULATED_INNER_VOID_ONLY]
[ADDED_INNER_AND_OUTER_VOLUMES]
[SUBTRACTED_RADII_BEFORE_SQUARING]
[SWAPPED_INNER_OUTER_DIMENSIONS]
[FORGOT_OPEN_FACE]
[ADDED_MISSING_FACE]
[COUNTED_HIDDEN_JOIN_FACES]
[OMITTED_INNER_SURFACE]
[OMITTED_ANNULAR_ENDS]
[USED_SINGLE_THICKNESS_IN_TWO_SIDED_DIMENSION]
[USED_LINEAR_UNIT_CONVERSION_FOR_VOLUME]
```

Internal prototype names, fallback IDs and raw `misconceptionId` field names are forbidden in learner text.

## Prototype exemplar — hollow metallic pipe

This is an editorial exemplar only. It is **not** a permanent QL allocation.

### Question state

```text
outer radius R = 5 cm
inner radius r = 3 cm
length h = 14 cm
π policy = 22/7
required target = volume of metal
```

### Picture the Shape First

Think of a thick solid metal rod with a smaller cylinder drilled straight through its centre. The remaining metal is the outer cylinder minus the empty inner cylinder.

### Main Rule

```text
Vmetal = πR²h − πr²h = πh(R² − r²)
```

Here, `R` is the outer radius, `r` is the inner radius and `h` is the pipe length.

### Unit-preserving steps

```text
1. R² − r² = 5² cm² − 3² cm² = 25 cm² − 9 cm² = 16 cm².
2. Vmetal = (22/7) × 14 cm × 16 cm².
3. Vmetal = 44 × 16 cm³ = 704 cm³.
```

### Exam Speed Trick

```text
R² − r² = (R − r)(R + r)
          = (5 − 3)(5 + 3)
          = 2 × 8
          = 16
```

### Distractor authority

A valid generated option set should derive wrong values from real mistakes such as:

- full outer cylinder only -> `[USED_OUTER_SOLID_VOLUME_ONLY]`;
- inner empty cylinder only -> `[CALCULATED_INNER_VOID_ONLY]`;
- outer plus inner volume -> `[ADDED_INNER_AND_OUTER_VOLUMES]`;
- `πh(R-r)²` instead of `πh(R²-r²)` -> `[SUBTRACTED_RADII_BEFORE_SQUARING]`.

The generator must select three unique dimensionally valid distractors and explain the exact three that appear after answer-position rotation.

## SVG diagram authority

The hollow-pipe diagram must show two concentric circular boundaries and the pipe length.

Required labels:

```text
R = <value> <unit>
r = <value> <unit>
h = <value> <unit>
t = <value> <unit>    only when supplied or exactly derived
```

Required visual semantics:

- material wall visually distinct from the empty central void;
- inner boundary remains visibly concentric;
- dimension arrows do not imply `r` is wall thickness;
- open ends are shown as openings, not solid discs;
- numeric labels always include physical units;
- unknown dimensions remain symbolic and are never invented;
- caption says “concept sketch · not to scale”;
- accessible description identifies outer material and inner void.

## Runtime validation matrix

Every future question must pass:

```text
visual-shape-first
formula-variable-meanings
unit-preserving-every-step
exam-speed-shortcut
option-trap-label-alignment
option-trap-code-alignment
inner-less-than-outer
thickness-consistency
surface-ledger-consistency
material-volume-reconstruction
independent-verification
unit-aware-diagram
no-invented-diagram-dimension
four-unique-options
one-correct-option
lifecycle-lock
```

## Lifecycle lock

Passing this blueprint does not enable product delivery.

```text
reviewStatus:               UNREVIEWED
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```
