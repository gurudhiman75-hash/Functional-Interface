# MEN-CP-011 Hollow Cube and Cuboid Material Volume — Wave 01

## Authority

```text
MEN-CP011-HOLLOW-BOXES-WAVE-01-V1
```

## Scope

This wave closes the next two planned MEN-CP-011 material-volume gaps:

```text
MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME
MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME
```

Both families model a closed hollow solid as:

```text
material volume = outer solid volume − inner void volume
```

Uniform wall thickness is applied on both opposite sides of every linear dimension:

```text
cube inner side = a − 2t

cuboid inner length  = L − 2t
cuboid inner breadth = B − 2t
cuboid inner height  = H − 2t
```

The wave deliberately rejects the common but incorrect `outer dimension − t` treatment.

## Runtime coverage

```text
Runtime prototypes:                  2
Deterministic packages per family: 128
Total deterministic packages:      256
Balanced review records:            32
Records per family:                 16
Linear-unit profiles:                2
  centimetres -> cubic centimetres
  metres      -> cubic metres
Correct positions:                A8 B8 C8 D8
Distinct review physical states:    32
```

The physical-state pool contains eight hollow-cube fixtures and eight hollow-cuboid fixtures. Every review fixture is exercised in both supported unit systems.

## Option authority

Every generated item has one exact answer and three calculation-derived distractors:

```text
USED_OUTER_SOLID_VOLUME_ONLY
CALCULATED_INNER_VOID_ONLY
USED_SINGLE_THICKNESS_IN_TWO_SIDED_DIMENSION
```

All options are exact rational volumes, structurally unique, dimensionally compatible and independently reconstructed.

## Explanation contract

Every learner solution includes:

1. a physical picture of an outer solid with a smaller empty solid removed;
2. the `2t` inner-dimension rule;
3. unit-preserving outer-volume and inner-volume calculations;
4. exact subtraction to obtain material volume;
5. an exam-speed shortcut:
   - difference of cubes for the hollow cube;
   - immediate `(L-2t)(B-2t)(H-2t)` setup for the hollow cuboid;
6. natural wrong-option analysis without exposing internal diagnostic codes.

## Diagram contract

The responsive ExamTree SVG shows:

- the complete outer cube or cuboid;
- the dashed inner void;
- uniform wall thickness;
- prompt-safe symbolic inner dimensions;
- solution-only numerical inner dimensions;
- white background, black structure and `not to scale`;
- no fixed SVG width;
- `min-width: 0` rendering policy.

Attempt mode remains text-complete and diagram-free.

## Validation

The runtime rejects:

- non-positive inner dimensions;
- any inner dimension that does not subtract `2t`;
- non-positive material volume;
- duplicate exact options;
- multiple correct answers;
- diagram/state mismatch;
- learner-visible prototype or misconception codes;
- responsive-layout violations;
- lifecycle or publication leakage.

## Lifecycle

```text
Permanent QLs:                0
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
Direct source normalisation:  pending
Manual English review:        pending
```

This wave advances chapter discovery but does not freeze MEN-CP-011 coverage, English, QL identities or delivery.
