# MEN-CP-011 Inverse Thickness and Length — Wave 01

## Authority

```text
MEN-CP011-INVERSE-THICKNESS-LENGTH-WAVE-01-V1
```

## Scope

This wave implements two missing inverse contracts for hollow cylindrical pipes:

1. `MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME`
   - given outer radius, pipe length and material volume;
   - recover the inner radius from `V = πh(R²-r²)`;
   - return wall thickness `t = R-r`.
2. `MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME`
   - given outer radius, inner radius and material volume;
   - return `h = V/[π(R²-r²)]`.

## Measurement coverage

Both families cover the four existing MEN-CP-011 measurement profiles:

- radii in cm, length in cm, volume in cm³;
- radii in m, length in m, volume in m³;
- radii in cm, length in m, calculation in cm and volume in cm³;
- radii in m, length in cm, calculation in cm and volume in cm³.

Both exact π and declared `π = 22/7` are supported.

## Diagram contract

- white-background ExamTree hollow-pipe diagram;
- centre point `O` shown explicitly;
- radius guides connected from `O` to the correct boundary;
- labels detached from measurement lines;
- prompt diagram hides the requested target;
- solution diagram reveals the recovered target;
- no vertical radius guide enters the body;
- responsive width with `min-width: 0`.

## Review matrix

```text
Runtime prototypes:                 2
Deterministic packages per family: 128
Total deterministic packages:     256
Balanced review records:           32
Records per family:                 16
Measurement profiles:                4
Pi policies:                          2
Records per family/profile/pi cell:  2
Correct positions:               A8 B8 C8 D8
Distinct physical states:            32
```

## Lifecycle

```text
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              NOT_STORED
Test eligibility:           INELIGIBLE
Public publication:         false
Direct source normalisation: pending
Manual English review:       pending
```

This wave resolves two initial discovery candidates but does not freeze chapter coverage or English.
