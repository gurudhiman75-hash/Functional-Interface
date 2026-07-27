# MEN-001 Explanation Style Contract

## Status

This contract applies to every active English MEN-001 question language across MEN-CP-001 through MEN-CP-006.

The explanation must be presented as a competitive-exam learning solution, not as a compact solver trace or a generic textbook derivation.

## Required learner structure

Every explanation uses the following order:

1. **Key Rule & Formula**
   - explain why the selected geometric relationship applies;
   - show the governing formula before numerical substitution;
   - preserve the exact π policy, surds and unit dimension.
2. **Step-by-Step Solution**
   - use sequential `Step 1`, `Step 2`, and so on;
   - give each step a meaningful mathematical title;
   - show every intermediate measurement that is needed for correctness;
   - separate substitution and simplification when that improves readability;
   - do not add filler steps to reach a fixed count.
3. **Exam Speed Shortcut**
   - provide one state-valid speed method for every generated question;
   - prefer cancellation, known triplets, direct boundary relations, squared scale factors, percentage identities or unit-conversion memory rules when applicable;
   - never claim a Pythagorean triplet, direct ratio or shortcut unless the generated values satisfy it;
   - retain the complete standard solution before the shortcut.
4. **Common Traps**
   - explain all three generated wrong options;
   - name the actual shuffled option letter and displayed option value;
   - derive each warning from its declared misconception strategy;
   - use learner-facing prose rather than internal strategy IDs or implementation labels;
   - never list the correct option as a trap.
5. **Final Answer**
   - close with the canonical answer and its correct unit;
   - retain a short contextual conclusion where useful.

The first four blocks form the four-tier learning layer. `Final Answer` remains the terminal result block.

## Need-based depth

The number of worked steps is not fixed.

A direct conversion may need one or two worked steps. A composite, inverse, scale, shaded-area or boundary-conservation problem may need four or more. No explanation may be padded merely to reach a target count, and no necessary reasoning may be removed merely to stay below one.

## Formula rule

The formula must appear before substitution.

Acceptable:

```text
Total Area = Rectangle Area + Semicircle Area
```

followed by:

```text
Rectangle Area = 24 × 14 = 336 m²
```

Not acceptable:

```text
Using the values gives 413 m².
```

without first showing the governing relation.

## Shortcut rules

A shortcut is an additional competitive-exam route, not a replacement for the standard solution.

Examples include:

- cancelling `1/2` against an even triangle base or height before multiplication;
- recognising a generated Pythagorean triplet instead of expanding a square root or Heron's formula;
- using `2p + p²/100` or `2p − p²/100` for equal percentage changes in both dimensions;
- treating a decrease as a negative change in `x + y + xy/100`;
- using direct wire-reshaping relations such as `s = πr/2` for circle-to-square conversion;
- remembering that lengths and perimeters follow `k`, while areas follow `k²`;
- using `1 m² = 10,000 cm²` for square-unit conversion.

When no specialised shortcut is valid, the block must still give a concise, safe arithmetic or rearrangement strategy relevant to the question's answer dimension.

## Common-trap rules

The trap block is option-aware.

For each generated distractor it must:

- locate the distractor after option shuffling;
- display its real option letter and value;
- explain the mathematical misconception in natural language;
- clarify whether the error omits a required stage, overstates or understates the result, changes dimension, or answers a different quantity.

Forbidden learner-facing content includes:

- internal prefixes such as `cp006` or `ex`;
- raw hyphenated strategy IDs;
- phrases such as `misconception strategy` or `applies the mistaken operation`;
- generic warnings unrelated to the generated option.

## Composite-figure rule

Composite and shaded figures must expose their decomposition explicitly. For a rectangle with an externally attached semicircle, the explanation must include all relevant component areas, diameter-to-radius recovery, the declared π policy, the correct combination operation and the final answer.

Equivalent decomposition detail is required for other composite and shaded families.

## Presentation contract

The runtime explanation object carries:

- `displayFormat: FOUR_TIER_COMPETITIVE_EXPLANATION`;
- one `KEY_RULE` section titled `Key Rule & Formula`;
- one or more sequential `STEP` sections grouped as `Step-by-Step Solution`;
- one `EXAM_SHORTCUT` section titled `Exam Speed Shortcut`;
- one `COMMON_TRAPS` section titled `Common Traps` containing three option-aware warnings;
- a terminal `FINAL_ANSWER` section.

The legacy flat `lines` array remains temporarily available for compatibility, but the structured sections are the canonical student-facing presentation.

## Editorial rules

- Use natural sentences rather than labels such as `Substitution:` or `Calculation:`.
- Keep formulas, substitutions, simplification, shortcuts, traps and conclusions visually distinct.
- Use the question's own context and measurement units.
- Preserve explicitly stated currencies; do not substitute a different currency.
- Preserve exact values, π policy, surds and dimensional correctness.
- Do not repeat the same numerical result merely to increase the step count.
- Diagrams remain explanatory and must agree with the generated parameters.
