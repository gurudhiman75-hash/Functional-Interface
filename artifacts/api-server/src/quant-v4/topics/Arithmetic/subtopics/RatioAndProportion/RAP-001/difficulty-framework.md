# RAP-001: Difficulty Framework

## Difficulty Dimensions

### 1. Structural Complexity (SC)
- **Low**: 2 entities, simple integer ratios.
- **Medium**: 3 entities, fractional ratios, or segmented differences (Reverse Partition).
- **High**: 4+ entities, branching ratio trees, or ternary mixtures.

### 2. Computational Effort (CE)
- **Low**: Direct multiplication/division.
- **Medium**: Multiple pivot alignment (A:B, B:C, C:D) or 3-denomination weighting.
- **High**: 4-denomination coin systems, multi-stage variable replacement, or decimal normalization.

### 3. Reasoning Depth (RD)
- **Low**: Direct formula application.
- **Medium**: Two-step mapping (Count $\to$ Value).
- **High**: Multi-stage transformations (simultaneous Join/Leave events) or inverse-solving from mixture deltas.

## Difficulty Bands

| Band | Characteristics | Example Topology |
| --- | --- | --- |
| **Easy** | SC-Low, CE-Low, RD-Low | Given A:B=2:3 and A=10, find B. |
| **Medium** | SC-Med, CE-Med, RD-Med | Reverse partition (Share of A - Share of C = 400). |
| **Hard** | SC-High, CE-High, RD-High | 4-pivot ratio tree linkage or multi-stage transformation with transfers. |

## Parameter Adjustments
- **Normalization**: Decimal ($0.4:0.8$) and Fractional ($2/3:4/5$) inputs significantly increase CE and SC.
- **Transfer Events**: Adding "Transfer" logic (A gives 10 to B) in CP03 creates a high-RD scenario compared to simple Addition.
- **Denomination Count**: Moving from 2 to 4 denominations in CP05 shifts difficulty from Medium to Hard.
