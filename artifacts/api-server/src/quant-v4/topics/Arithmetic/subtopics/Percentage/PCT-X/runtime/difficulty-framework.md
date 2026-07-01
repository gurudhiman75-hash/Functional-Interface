# PCT-002: Difficulty Framework

This document defines the difficulty bands for Advanced Percentage scenarios based on mathematical and linguistic complexity drivers. Because PCT-002 handles advanced analytical logic, its "Easy" baseline is roughly equivalent to PCT-001's "Medium".

## Difficulty Bands

| Band | Complexity Drivers | Example Scenario |
| --- | --- | --- |
| **Easy** | - Forward reasoning (calculating the final result from given bases).<br>- Clean numerical inputs (integers, 10%, 20%).<br>- Explicitly stated parameters without hidden assumptions. | Find the percentage error if a number is multiplied by 3/4 instead of 4/3. |
| **Medium** | - Reverse reasoning (finding the original base/total).<br>- 2-stage attrition or overlaps.<br>- Standard fractional percentages (16.66%, 12.5%).<br>- Single conditional threshold. | A salesman gets 5% commission up to Rs. 10,000 and 4% above it. If his total commission is Rs. 800, find total sales. |
| **Hard** | - Deeply chained reverse reasoning (3+ levels).<br>- Missing variable derivation (e.g., finding the "Both" intersection when only passing percentages are given).<br>- Multi-iteration replacements (n=3 or more).<br>- Elite competitive math formatting (nested wording). | 10% voters didn't vote, 10% of cast votes were invalid. The winner got 54% of valid votes and won by 1620. Find total voters. |

## Complexity Dimensions

### 1. Mathematical Depth
- **Low**: Directly applying a formula (e.g., `Error / True * 100`).
- **High**: Solving algebraic equations for unknowns (e.g., solving for $x$ where $x \times (1-y)^3 = z$).

### 2. Direction of Reasoning
- **Forward Calculation**: Data flows from root to leaf (e.g., given Total Population, find Married Males).
- **Backward Reconstruction**: Data flows from a leaf or a difference margin back to the root (e.g., given Winning Margin, find Registered Voters).

### 3. State Tracking (Hierarchy)
- **Shallow**: Two intersecting states (Venn with 2 circles).
- **Deep**: Tracking shifting bases (Total -> Polled -> Valid -> Winner/Loser share).

### 4. Conditionality
- **Static**: Formulas apply to the whole number.
- **Dynamic/Piecewise**: Formulas change based on the value itself (Tax brackets, commission bonuses over sales limits).