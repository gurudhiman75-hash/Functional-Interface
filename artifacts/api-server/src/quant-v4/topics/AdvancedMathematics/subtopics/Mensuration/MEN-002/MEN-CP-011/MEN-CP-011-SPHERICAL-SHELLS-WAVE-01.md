# MEN-CP-011 Spherical and Hemispherical Shells — Wave 01

## Authority

```text
MEN-CP011-SPHERICAL-SHELLS-WAVE-01-V1
```

## Scope

This wave implements the two next planned material-volume families:

```text
MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME
MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME
```

The decisive reasoning is outer solid minus inner void:

```text
Spherical shell:
V = (4/3)π(R³ − r³)

Hemispherical shell:
V = (2/3)π(R³ − r³)
```

The inner and outer radii are concentric, physically positive and satisfy `r < R`.

## Pi-policy expansion

This is the first MEN-CP-011 wave to prove all three declared policies:

```text
EXACT_PI
PI_22_OVER_7
PI_3_14
```

Declared `π = 3.14` is represented exactly as `157/50`; no floating-point equality is used.

## Runtime and review coverage

```text
Runtime prototypes:                  2
Deterministic packages per family: 192
Total deterministic packages:      384
Balanced review records:            48
Records per family:                 24
Unit profiles:                       2
  cm -> cm³
  m  -> m³
Pi policies:                         3
Records per family/unit/pi cell:     4
Correct positions:                A12 B12 C12 D12
Distinct review physical states:    48
```

## Option authority

Each item contains one exact answer and three calculation-derived distractors:

```text
USED_OUTER_SOLID_VOLUME_ONLY
CALCULATED_INNER_VOID_ONLY
ADDED_INNER_AND_OUTER_VOLUMES
```

The option layer preserves exact rational or exact-pi values, rejects collisions and keeps one correct answer after deterministic shuffling.

## Explanation contract

Every learner solution includes:

1. the physical picture of a smaller concentric void removed from a larger sphere or hemisphere;
2. the governing shell-volume formula with `R` and `r` defined;
3. a unit-preserving calculation of `R³ − r³`;
4. exact application of the selected pi policy;
5. the exam-speed identity:

```text
R³ − r³ = (R − r)(R² + Rr + r²)
```

6. natural wrong-option analysis without exposing internal diagnostic codes.

## Diagram contract

The responsive ExamTree SVG shows:

- outer sphere or hemisphere boundary;
- dashed inner void;
- centre-connected outer radius `R`;
- centre-connected inner radius `r`;
- wall thickness in the legend;
- matching units;
- prompt and solution roles;
- white background and black structural lines;
- no fixed SVG width;
- `min-width: 0` rendering policy.

Attempt mode remains text-complete and diagram-free.

## Validation

The wave rejects:

- non-positive or reversed radii;
- non-positive shell volume;
- floating-point pi authority;
- duplicate exact options;
- multiple correct answers;
- state/diagram mismatches;
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

This wave resolves two initial discovery candidates and closes the missing declared `π = 3.14` arithmetic policy for this shell slice. It does not freeze chapter coverage, permanent QLs or English.
