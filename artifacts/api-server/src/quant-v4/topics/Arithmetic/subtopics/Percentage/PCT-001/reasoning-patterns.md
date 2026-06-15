# PCT-001: Reasoning Patterns

This document describes the transformations, formulas, and reasoning patterns for each CP.

## Pattern 1: Fractional Multiplier (PCT-CP-001, 002, 003)
- **Concept**: Percentages are best handled as fractions (e.g., 20% = 1/5).
- **Transformation**: 
    - Increase by r% → multiply by `(1 + r/100)`.
    - Decrease by r% → multiply by `(1 - r/100)`.
- **Application**: Successive changes become a product of multipliers: `Initial * M1 * M2 * M3 = Final`.

## Pattern 2: Unitary / Percentage Point Comparison (PCT-CP-005)
- **Concept**: Equating a percentage difference to an absolute value.
- **Reasoning**: If the difference between 52% and 48% (i.e., 4%) is 1200 votes, then 1% = 300, and 100% = 30,000.
- **Application**: Election margins, Pass/Fail marks differences.

## Pattern 3: Product Balance (PCT-CP-004)
- **Concept**: `Base1 * Base2 = Total`.
- **Transformation**: If Base1 increases by `x%` (multiplier `k`), Base2 must decrease by `(1 - 1/k) * 100` to keep Total constant.
- **Shortcut Reasoning**: 
    - If price increases by 25% (1/4), consumption must decrease by `1/(4+1)` = 1/5 = 20%.
    - If price decreases by 20% (1/5), consumption can increase by `1/(5-1)` = 1/4 = 25%.

## Pattern 4: Additive Segmentation (PCT-CP-005)
- **Concept**: `Total = Part A + Part B + ... + Remaining`.
- **Reasoning**: Ensuring the sum of percentages equals 100%. 
- **Distinction**: "Percentage of Total" (Additive) vs "Percentage of Remaining" (Successive).

## Pattern 5: Inverse Base Transformation (PCT-CP-001, 002)
- **Concept**: Shifting the base of comparison.
- **Reasoning**: If A is 25% more than B, B is not 25% less than A. 
- **Formula**: `r / (100 + r) * 100`.

## Pattern 6: Compositional Shift (PCT-CP-006)
- **Concept**: `Concentration = (Amount of Component) / (Total Mixture)`.
- **Reasoning**: When adding more of one component, both the numerator (component) and denominator (total) change, affecting the final percentage.
