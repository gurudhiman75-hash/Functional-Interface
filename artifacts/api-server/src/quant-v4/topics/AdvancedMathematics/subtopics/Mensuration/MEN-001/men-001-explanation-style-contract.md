# MEN-001 Explanation Style Contract

## Status

This contract applies to every active English MEN-001 question language across MEN-CP-001 through MEN-CP-006.

The explanation must be presented as a worked solution for a student, not as a compact solver trace.

## Required structure

Every explanation uses this order:

1. **Key Rule**
   - explain why the selected relationship applies to the question;
   - show the governing formula before any numerical substitution.
2. **Named worked steps**
   - use `Step 1`, `Step 2`, and so on;
   - give each step a meaningful title such as `Find the Radius`, `Area of the Rectangle`, `Convert the Units`, or `Add the Two Areas`;
   - show intermediate measurements that are mathematically necessary;
   - place substitutions and calculations in separate display equations where that improves readability;
   - include cancellation or simplification when it is educationally useful.
3. **Final Answer**
   - show the canonical answer with its correct unit;
   - keep a short contextual sentence only when it adds clarity.

## Need-based depth

The number of steps is not fixed.

A direct conversion may need one or two worked steps. A composite, inverse, scale, shaded-area, or boundary-conservation problem may need four or more. No explanation may be padded merely to reach a target count, and no necessary reasoning may be removed merely to stay below one.

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

## Composite-figure rule

Composite and shaded figures must expose their decomposition explicitly. For a rectangle with an externally attached semicircle, the explanation must include all of the following when relevant:

- rectangle area;
- semicircle diameter-to-radius recovery;
- semicircle area using the declared π policy;
- addition of the non-overlapping component areas;
- final answer.

Equivalent decomposition detail is required for other composite and shaded families.

## Presentation contract

The runtime explanation object carries:

- `displayFormat: KEY_RULE_STEPS_FINAL_ANSWER`;
- a `KEY_RULE` section;
- one or more sequential `STEP` sections;
- a terminal `FINAL_ANSWER` section.

The legacy flat `lines` array remains temporarily available for compatibility, but the structured sections are the canonical student-facing presentation.

## Editorial rules

- Use natural sentences rather than labels such as `Substitution:` or `Calculation:`.
- Keep formulas, substitutions, simplification, and conclusions visually distinct.
- Use the question's own context and measurement units.
- Preserve exact values, π policy, surds, and dimensional correctness.
- Do not repeat the same numerical result merely to increase the step count.
- Diagrams remain explanatory and must agree with the generated parameters.
