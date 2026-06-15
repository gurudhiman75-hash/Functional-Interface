# PCT-001: Canonical Problems

This document defines the minimum set of mathematically independent canonical problems (CPs) for Percentage.

## CP Topology

| CP ID | Name | Core Logic | Merged Areas |
| --- | --- | --- | --- |
| PCT-CP-001 | Foundational Conversions & Comparisons | Relative scaling (A/B * 100) and base-switching. | Basic calculation, fraction-decimal conversion, equivalent percentages, simple comparison. |
| PCT-CP-002 | Dynamic Change & Reverse Reasoning | Single-step linear change: Final = Initial * (1 ± r/100). | Percentage increase, percentage decrease, reverse percentage problems. |
| PCT-CP-003 | Successive Changes & Compound Growth | Multi-step multiplicative change: Final = Initial * ∏(1 ± r_i/100). | Successive changes, net percentage change, population growth/decrease. |
| PCT-CP-004 | Product Invariance & Variations | Maintaining product stability (A * B = C) when components vary. | Consumption increase/decrease, price problems, expenditure problems. |
| PCT-CP-005 | Distributional Analysis | Additive segmentation of a total base. | Income/Salary split, Marks obtained (Pass/Fail), Votes and Polling. |
| PCT-CP-006 | Compositional Proportions | Percentage as a part of a mixture or entity. | Percentage composition, mixed percentage scenarios. |

## CP Independence Analysis

### PCT-CP-001: Foundational Conversions & Comparisons
- **Reasoning**: Establishing the relationship between two quantities as a fraction of 100.
- **Independence**: This is the only CP where the focus is purely on the static definition of percentage without an implied "before" and "after" state.

### PCT-CP-002: Dynamic Change & Reverse Reasoning
- **Reasoning**: Transformation of a single base value.
- **Independence**: Differs from CP1 by introducing a delta (increase/decrease). Differs from CP3 by being limited to a single transformation, often requiring finding the original base (reverse reasoning).

### PCT-CP-003: Successive Changes & Compound Growth
- **Reasoning**: Multiplicative impact where each subsequent change applies to the result of the previous change.
- **Independence**: The logic `1 + r1 + r2 + (r1*r2)/100` or the fractional multiplier method is distinct from single-step changes. It covers population growth as a specific application of successive changes.

### PCT-CP-004: Product Invariance & Variations
- **Reasoning**: If `Price * Consumption = Expenditure`, then `P1/P2 = C2/C1` for constant expenditure.
- **Independence**: This involves inverse proportionality within a percentage context, a reasoning pattern not present in CP2 or CP3.

### PCT-CP-005: Distributional Analysis
- **Reasoning**: Subdividing 100% into components (e.g., 40% on food, 30% on rent, etc.) or comparing two groups within the same total (e.g., Winner got 52%, Loser got 48%).
- **Independence**: Focuses on the partition of a whole. Unlike CP3, these percentages are usually additive (on the same base) rather than successive (on remaining).

### PCT-CP-006: Compositional Proportions
- **Reasoning**: Calculating how the percentage of a specific component changes when the total or other components change.
- **Independence**: Requires handling multiple sub-bases or changing totals (e.g., adding water to a 20% acid solution).
