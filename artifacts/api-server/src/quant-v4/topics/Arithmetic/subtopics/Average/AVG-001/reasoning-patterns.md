# AVG-001: Reasoning Patterns

This document details the internal mathematical abstractions required to solve Average problems.

## Pattern 1: Sum-Average Substitution (AVG-CP-001)
- **Concept**: Interchanging Sum and (Average $\times$ Count).
- **Formula**: $Sum_{New} = Sum_{Old} - Value_{Excluded} + Value_{Included}$.
- **Reasoning**: Treat the Average as a "representative constant" to find totals.

## Pattern 2: Middle-Term Symmetry (AVG-CP-002)
- **Concept**: Averages of Arithmetic Progressions (AP).
- **Logic**:
    - If count $n$ is Odd: $Average = \text{Middle Term}$.
    - If count $n$ is Even: $Average = \text{Mean of two middle terms}$.
    - Always: $Average = (First + Last) / 2$.
- **Reasoning**: Rapidly identifies values in sequences (Consecutive, Even, Odd) without summing.

## Pattern 3: Net Deviation Balance (AVG-CP-003)
- **Concept**: Every addition/removal creates a surplus or deficit that must be distributed across the *remaining* count.
- **Algebraic Logic**: $Value_{New} = Average_{Old} + (\Delta \times Count_{Final})$.
- **Reasoning**: Avoids large sum multiplications. If a new person joins and the average weight of 10 people increases by 2kg, the new person brought $(10 \times 2) = 20\text{kg}$ extra above the old average.

## Pattern 4: Weighted Group Merging (AVG-CP-004)
- **Concept**: The combined average is biased towards the larger group.
- **Formula**: $A_{comb} = \frac{n_1 a_1 + n_2 a_2 + \dots}{n_1 + n_2 + \dots}$.
- **Shortcut**: Using "Assumed Average" and deviation ($A_{assumed} + \frac{\sum d_i}{n_{total}}$).

## Pattern 5: Delta Redistribution (AVG-CP-005)
- **Concept**: Correcting a specific data entry.
- **Logic**:
    - $\text{Error Delta} = \text{Correct Value} - \text{Incorrect Value}$.
    - $\text{Avg Adjustment} = \text{Error Delta} / \text{Total Count}$.
- **Reasoning**: Fixes the average by shifting it by the "per-head" error.

## Pattern 6: Hierarchical Resolution (AVG-CP-006)
- **Concept**: Tree-based aggregation.
- **Process**:
    1. Resolve leaf-node averages into group sums.
    2. Resolve group sums into parent averages.
- **Reasoning**: Maintains precision across multiple layers of aggregation.
