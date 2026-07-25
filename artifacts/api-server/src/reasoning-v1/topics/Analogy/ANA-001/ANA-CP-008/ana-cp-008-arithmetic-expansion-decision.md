# ANA-CP-008 Arithmetic Expansion Decision

Status: **SOURCE-BACKED NON-QL PILOT EXPANSION**

Permanent QL and solve-mode counts remain open.

## Why this expansion is required

The fixed-addition/subtraction authorities do not cover several recurring official mixed-analogy operations:

- one letter mapped to the square of its alphabet position;
- a two-letter vector combined with exact integer multiplication;
- a two-letter vector combined with an exact rational multiplier;
- a two-letter vector combined with cubing;
- a two-letter vector combined with conversion from a perfect square to the corresponding cube.

These operations require different calculations, misconception models, explanations, and distractors. Sharing a token renderer or arithmetic foundation does not make them one student solve contract.

## Single-letter position power

Source evidence:

```text
R : 324 :: I : 81
R = 18 -> 18 squared = 324
I = 9  -> 9 squared = 81
```

Pilot authority:

```text
MIXED_SINGLE_LETTER_POSITION_POWER
```

Initial context: alphabet position squared. Position cube is not admitted until independently sourced.

## Vector plus exact multiplier

Integer multiplier evidence:

```text
DA2 -> GD10
SP7 -> VS35
```

Rule: first letter +3, second letter +3, number multiplied by 5.

Rational multiplier evidence:

```text
AK40 -> EE100
DL80 -> HF200
```

Rule: first letter +4, second letter -6, number multiplied by 5/2.

Pilot authority:

```text
MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER
```

Exact-rational arithmetic uses an integer numerator and denominator. Floating-point arithmetic is prohibited. A context is eligible only when multiplication produces an exact integer within the pilot bounds.

## Vector plus power/root transform

Cube evidence:

```text
TR4 -> XC64
AC3 -> EN27
```

Rule: first letter +4, second letter +11, number cubed.

Perfect-square-to-cube evidence:

```text
FM25 -> IJ125
NO36 -> QL216
```

Rule: first letter +3, second letter -3, and n = k squared becomes k cubed, equivalent to n multiplied by the exact square root of n.

Pilot authority:

```text
MIXED_CLUSTER_NUMBER_VECTOR_POWER
```

Contexts:

```text
CUBE
PERFECT_SQUARE_TO_CUBE
```

The perfect-square profile rejects non-square inputs. All outputs must be safe integers within the mixed-token bound.

## Revised non-QL pilot inventory

```text
Provisional authorities: 9
Provisional contexts: 74
Exact readable source fixtures: 16
Permanent QLs: none
Permanent solve modes: none
```

## Allocation consequence

The source-backed student operations now include:

1. letter-group sum to number;
2. letter-group product to number;
3. letter-group sum to letter;
4. single-letter position square;
5. single-letter-plus-number fixed transform;
6. cluster shared delta;
7. cluster independent vector plus fixed number delta;
8. cluster vector plus exact multiplier;
9. cluster vector plus power/root transform;
10. number-letter digit-sum-square successor.

Whether sum and product remain contexts or become separate solve authorities is still open. Even under conservative grouping, direct completion and pair selection across the proven operations place strong pressure on the inherited 16-QL reservation.

The reservation must not dictate the final taxonomy.

## Freeze requirements retained

Before permanent allocation:

- all 74 contexts must retain at least 40 uniquely matched source-target pairs;
- solver disagreements must remain zero;
- each context must construct four unique options with one correct answer;
- multiplier and power distractors must be rejected against every registered mixed authority;
- inverse and incorrect-pair task evidence must still be audited;
- uploaded books and the audited manifest must be recovered or formally superseded;
- no meaningful official mixed-analogy operation may remain uncovered.

## Safety

```text
publiclyPublishable: false
permanent QL IDs: none
Question Studio wiring: none
public-test routing: none
```
