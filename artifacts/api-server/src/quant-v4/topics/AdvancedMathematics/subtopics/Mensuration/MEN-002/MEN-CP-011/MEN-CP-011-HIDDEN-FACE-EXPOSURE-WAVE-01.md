# MEN-CP-011 Hidden-Face Exposure — Wave 01

## Authority

```text
MEN-CP011-HIDDEN-FACE-EXPOSURE-WAVE-01-V1
```

## Scope

This wave implements the next two planned exposure families:

```text
MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA
MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA
```

Both families are owned by MEN-CP-011 because the decisive learner task is identifying surfaces that become hidden through contact.

## Joined cubes authority

The joined-cube generator covers straight rows, one-layer rectangular arrangements and three-dimensional rectangular blocks.

For `N` cubes of side `a` with `J` face-to-face joins:

```text
exposed faces = 6N − 2J
exposed area  = (6N − 2J)a²
```

Each join hides two faces, one from each touching cube.

The independent verifier treats the finished assembly as one bounding cuboid:

```text
A = 2a²(xy + yz + zx)
```

where `x`, `y` and `z` are the cube counts along the three directions.

## Cuboid-on-floor authority

For a cuboid of dimensions `L`, `B` and `H` standing on its `L × B` base:

```text
painted area = top + four sides
             = LB + 2LH + 2BH
```

The floor-contact base is hidden and contributes zero painted area.

The independent shortcut is:

```text
painted area = TSA − one base
             = 2(LB + BH + HL) − LB
```

## Runtime and review coverage

```text
Runtime prototypes:                  2
Deterministic packages per family: 128
Total deterministic packages:      256
Balanced review records:            32
Records per family:                 16
Unit profiles:                       2
  cm -> cm²
  m  -> m²
Correct positions:                A8 B8 C8 D8
Distinct review physical states:    32
```

The joined-cube pool contains eight arrangements, ranging from a two-cube row to a `4 × 3 × 2` block. The placed-cuboid pool contains eight dimension sets.

## Option authority

Joined-cube distractors:

```text
COUNTED_HIDDEN_JOIN_FACES
SUBTRACTED_ONLY_ONE_JOIN_FACE
OMITTED_TOP_AND_BOTTOM_EXPOSED_FACES
```

Cuboid-on-floor distractors:

```text
COUNTED_HIDDEN_FLOOR_BASE
OMITTED_EXPOSED_TOP_FACE
OMITTED_BREADTH_SIDE_PAIR
```

All options are exact, dimensionally compatible, structurally unique and linked to their actual calculations.

## Explanation contract

Every learner solution includes:

1. a physical surface ledger before formulas;
2. explicit identification of touching or floor-hidden faces;
3. unit-preserving area calculations;
4. the finished exposed-area answer;
5. an independent exam-speed method;
6. natural analysis of all three displayed wrong options.

## Diagram contract

### Joined cubes

The responsive orthographic diagram provides front, top and right grids. It shows the cube counts along each direction and states that every shared square face is internal. The solution view reveals the exposed-face count and final area.

### Cuboid on floor

The diagram shows the top and side faces, a dashed bottom contact face and a floor line. The bottom face is explicitly marked hidden and not painted.

Both diagram types use:

- white background and black structural lines;
- prompt and solution roles;
- matching state values and units;
- no fixed SVG width;
- `min-width: 0` responsive policy;
- text-complete attempt mode without a diagram.

## Validation

The runtime rejects:

- non-positive exposed area;
- incorrect hidden-face ledgers;
- duplicate options or multiple correct answers;
- diagram/topology mismatches;
- unbalanced MathJax or malformed pi commands;
- learner-visible diagnostic codes;
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

This wave resolves two more initial discovery candidates but does not freeze chapter coverage, English or permanent QLs.
