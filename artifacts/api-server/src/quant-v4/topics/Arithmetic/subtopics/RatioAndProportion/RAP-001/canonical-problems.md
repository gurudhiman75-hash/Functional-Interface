# RAP-001: Canonical Problems

This document defines the independent reasoning systems for Ratio & Proportion.

| CP ID | Name | Core Logic | Exam Realism |
| --- | --- | --- | --- |
| RAP-CP-001 | Multi-Entity Linkage & Scaling | Merging disjoint ratios (e.g., A:B, B:C, C:D $\to$ A:D) and normalizing fractional/decimal ratios. Includes branching ratio trees with multiple pivots. | Foundational (SSC/Banking/PCS). |
| RAP-CP-002 | Partitioned Sums & Distribution | Dividing a total amount among 2-4 entities. Includes Reverse Partitioning (find total from differences/segments). | High (Banking/SSC/RRB). |
| RAP-CP-003 | Two-State Relational Transformation | Initial Ratio $\to$ Multiple changes (Add/Subtract/Transfer) $\to$ Final Ratio. Includes Multi-Stage Transformations. | Primary SSC/PCS Archetype. |
| RAP-CP-004 | Mathematical Proportion & Variance | Solving for Mean/Third/Fourth proportional; Direct and Inverse variation with fractional/decimal inputs. | Formula-heavy (SSC/RRB). |
| RAP-CP-005 | Generalized Weighted Mapping | Converting "Counts" to "Values" using weights (Denominations, Baskets, Marks). Supports Multi-Denomination (3-4) systems. | Premium SSC/Banking. |
| RAP-CP-006 | Mixture Basis & Binary/Ternary Addition | Adding components to 2 or 3-component mixtures. Includes Variable Quantity Replacement cycles. | High (SSC/Banking). |

## CP Independence Analysis

### RAP-CP-001: Linkage & Scaling
- **Focus**: Connectivity and Normalization.
- **Independence**: Solves for the scale of the relationship. Fractional/Decimal normalization is the entry-level logic for scaling. Ratio trees add structural depth.

### RAP-CP-002: Partitioned Sums
- **Focus**: Allocation and Segment Analysis.
- **Independence**: Requires a known sum or a known delta between segments (Reverse Partition). Distinct from CP01 as it maps units to physical currency/count.

### RAP-CP-003: Relational Transformation
- **Focus**: Action-based State Change.
- **Independence**: Ratios change over time. Multi-stage transformations (simultaneous addition and subtraction) demand advanced cross-product or algebraic isolation.

### RAP-CP-004: Proportion & Variance
- **Focus**: Functional Relational Properties.
- **Independence**: Uses geometric constants. Independent of additive shifts.

### RAP-CP-005: Generalized Weighted Mapping
- **Focus**: Duality of Scales.
- **Independence**: Requires a weight-matrix (Price/Denomination/Score) to transform the base ratio. Extended to multi-denomination systems (4+ components).

### RAP-CP-006: Mixture & Replacement
- **Focus**: Component Concentration.
- **Independence**: Handles 3-component systems and successive replacement where the total volume may change or stay constant.
