# RAP-002: Difficulty Framework

RAP-002 difficulty is driven by chain length, scale friction, operation count, and whether the answer is numeric, ratio-based, or logical.

## Easy

- Two linked ratios only.
- Small ratio terms from 1 to 6.
- One common linking entity.
- Direct ratio output with no hidden constraints.
- No more than one scale operation.

Example: A:B = 2:3 and B:C = 3:5. Find A:B:C.

## Medium

- Three linked ratios or one reverse constraint.
- Ratio terms from 2 to 9.
- One operation in a transformation problem.
- Nested partition with one subdivision.
- Inverse relation with a familiar context such as workers-days or speed-time.

Example: A:B = 3:4 and B:C = 6:7. If A has 45 units, find C.

## Hard

- Four entities or multiple linked constraints.
- Ratio terms up to 12, with non-trivial LCM scaling.
- Multiple state changes or transfer tracking.
- Mixed direct/inverse relations.
- Logical comparison or ordering after normalization.

Example: A:B = 4:7, B:C = 5:6, C:D = 8:9. If A and D differ by 310, find B.

## Complexity Axes

- **Chain Length**: More linked entities increase tracking burden.
- **Scale Friction**: Larger LCMs increase calculation effort.
- **Operation Count**: Add/remove/transfer stages increase algebraic load.
- **Directionality**: Inverse links require explicit reversal before alignment.
- **Answer Type**: Logical comparisons are harder to validate mentally than direct ratios.

## Distribution Target

- Easy: 30-35%
- Medium: 40-45%
- Hard: 20-25%
