# PCT-002: Canonical Problems

This document refines the proposed canonical problems (CPs) to ensure maximum mathematical independence, educational value, and solver uniqueness for Advanced Percentage applications. 

## CP Topology

| CP ID | Name | Core Logic | Merged Areas |
| --- | --- | --- | --- |
| PCT-CP-001 | Set Overlap & Inclusion-Exclusion | Intersecting group percentages: `Total = n(A) + n(B) + n(C) - n(AB) - n(BC) - n(AC) + n(ABC)`. | Pass/Fail in two/three subjects, Both/Only/Neither logic, Venn diagram problems, Triple Inclusion-Exclusion. |
| PCT-CP-002 | Miscalculation & Percentage Error | Expected vs. Actual base comparisons. | Wrong fraction multiplication, divisor/multiplier inversion, clerical errors. |
| PCT-CP-003 | Tiered Slabs & Thresholds | Conditional/Piecewise rate application based on base thresholds. | Sales commission with bonuses, income tax slabs, tiered brokerage, Multi-tier Piecewise Systems, Reverse Piecewise Systems. |
| PCT-CP-004 | Weighted Sub-group Attributes | Recombining fractional sub-bases into a global percentage. | Population mix (e.g., % of total population that are married females), multi-department demographics. |
| PCT-CP-005 | Repeated Replacement Operations | Successive dilution formula: `Final = Initial * \prod(1 - r_i)`. | Milk-water substitution, iterative chemical dilution, Variable-rate Replacement. |
| PCT-CP-006 | Multi-Stage Attrition & Elections | Chained base reductions with changing valid bases. | Total Voters -> Cast Votes -> Valid Votes -> Winner's Share; multi-stage dropouts. |

## CP Independence Analysis

### PCT-CP-001: Set Overlap & Inclusion-Exclusion
- **Reasoning**: Solves for intersection (the "Both" or "All Three" category) or union of overlapping sets using percentage bases.
- **Independence**: Radically distinct from additive segmentation (PCT-001 CP05) because elements can belong to multiple categories simultaneously, requiring subtraction to prevent double-counting. Triple inclusion-exclusion adds a third dimension of complexity.

### PCT-CP-002: Miscalculation & Percentage Error
- **Reasoning**: Computes relative error using the "True" value as the absolute base: `(|True - Error| / True) * 100`.
- **Independence**: Unlike direct comparisons, the solver must independently calculate two separate hypothetical states from a mock variable (often assumed as LCM of denominators) before finding the percentage change between them.

### PCT-CP-003: Tiered Slabs & Thresholds
- **Reasoning**: Implements mathematical step-functions. $Rate_1$ applies up to Limit $L_1$, $Rate_2$ up to $L_2$, etc.
- **Independence**: PCT-001 handles static rates. This CP requires the solver to dynamically split a single base across multiple rates based on conditionality and re-sum the parts. Reverse reasoning (finding Total Sales from Total Commission across multiple slabs) is highly unique.

### PCT-CP-004: Weighted Sub-group Attributes
- **Reasoning**: Hierarchical percentages. (e.g., $Base \times Rate_{Male} \times Rate_{Graduates}$).
- **Independence**: Combines tree-based branching. The solver must calculate sub-segments and aggregate specific branches (e.g., summing female graduates and male graduates) to find a new global percentage.

### PCT-CP-005: Repeated Replacement Operations
- **Reasoning**: Exponential decay or variable-rate reduction mapping to specific discrete operations.
- **Independence**: While resembling successive changes (PCT-001 CP03), the structure here specifically tracks the remaining fraction of the *original* pure substance iteratively, demanding its own specialized solver logic. Variable-rate replacement allows for non-uniform reduction percentages.

### PCT-CP-006: Multi-Stage Attrition & Elections
- **Reasoning**: Deeply chained relational calculations where the denominator shifts multiple times (e.g., Winner gets 60% of *Valid* votes, which are 90% of *Cast* votes, which are 80% of *Total* votes).
- **Independence**: PCT-001 handled simple 2-variable splits. This requires tracking the absolute state of the base at 3-4 different hierarchical levels to solve for the original root value using difference margins.