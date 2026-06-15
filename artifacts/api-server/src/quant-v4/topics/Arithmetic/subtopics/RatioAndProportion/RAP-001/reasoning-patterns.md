# RAP-001: Reasoning Patterns

This document details the internal mathematical abstractions required to solve Ratio & Proportion problems.

## Pattern 1: Multi-Pivot Linkage & Tree Normalization (RAP-CP-001)
- **Concept**: Unifying disjoint or branching relational chains.
- **Algebraic Logic**:
    - **Chain**: A:B, B:C, C:D $\to$ find common scale by aligning pivots B and C iteratively.
    - **Tree**: A:B, B:C, B:D $\to$ B is the central hub.
    - **TaskKind**: `ratioTreeLinkage`.
- **Reasoning**: Creates a global scale factor across N entities. Supports fractional/decimal inputs via early normalization ($a/b : c/d \to ad : bc$).

## Pattern 2: Difference-to-Total Mapping (RAP-CP-002)
- **Concept**: Using segment deltas to find the global base.
- **Logic**:
    - Ratio $x : y : z$.
    - Known: $z - x = \text{Delta}$.
    - $1 \text{ Unit} = \text{Delta} / (z - x)$.
    - $\text{Total} = (x + y + z) \times \text{Unit}$.
    - **TaskKind**: `reversePartition`.
- **Reasoning**: Maps relative differences to absolute totals.

## Pattern 3: Multi-Stage Cross-Product (RAP-CP-003)
- **Concept**: Handling complex state changes (simultaneous + and -).
- **Formula**:
    - Initial: $R_1 = a/b$
    - After $(+p, -q)$: $R_2 = (ax + p) / (bx - q) = c/d$
    - **TaskKind**: `multiStageTransformation`.
- **Reasoning**: Generalizes the cross-product method for heterogeneous changes (one component increases while another decreases).

## Pattern 4: Generalized Weight Matrix (RAP-CP-005)
- **Concept**: Mapping count ratios to value ratios via an external weight vector.
- **Transformation**: $V_i = C_i \times W_i$.
- **Extension**: Supports 4-component denomination vectors (e.g., 1, 2, 5, 10).
- **TaskKind**: `weightedMapping`, `multiDenominationMapping`.
- **Reasoning**: Essential for non-coin scenarios like commodity bundles (Quantity $\times$ Price).

## Pattern 5: Ternary Mixture Balancing (RAP-CP-006)
- **Concept**: Scaling ratios with 3+ components when only one is added.
- **Logic**:
    - Initial $A:B:C$. Add $B$.
    - $A$ and $C$ must remain constant.
    - **TaskKind**: `threeComponentMixture`.
- **Reasoning**: Extends constant-component logic to higher-dimensional systems.

## Pattern 6: Successive Variable Replacement (RAP-CP-006)
- **Concept**: Tracking component decay across non-uniform replacement cycles.
- **Formula**: $Final = Initial \times (1 - r_1/V) \times (1 - r_2/V) \dots$
- **TaskKind**: `variableReplacementRatio`.
- **Reasoning**: Solves for concentration ratios after discrete volumetric shifts.
