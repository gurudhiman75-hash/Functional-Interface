# AVG-001: Difficulty Framework

## Difficulty Dimensions

### 1. Structural Complexity (SC)
- **Low**: 1 group, 1 operation (Add/Remove).
- **Medium**: 2 combined groups, error correction for 1 value.
- **High**: 3+ groups, nested hierarchy, or multi-step replacements.

### 2. Computational Effort (CE)
- **Low**: Clean integers, sums under 1000.
- **Medium**: Decimals, averages requiring rounding, or large populations (e.g., 500+).
- **High**: Non-terminating fractions or combinations where deviation logic is mandatory for efficiency.

### 3. Reasoning Depth (RD)
- **Low**: Find sum given avg/count.
- **Medium**: Middle term logic for AP, find missing member in replacement.
- **High**: Solve for initial count given a chain of average shifts, or multi-mistake error correction.

## Difficulty Bands

| Band | Characteristics | Example Topology |
| --- | --- | --- |
| **Easy** | SC-Low, CE-Low, RD-Low | Find average weight of 5 students (clean integers). |
| **Medium** | SC-Med, CE-Med, RD-Med | 7 consecutive odd numbers have avg X. Find the smallest. |
| **Hard** | SC-High, CE-High, RD-High | 3 sections merge; 2 students from A move to B, 1 from B to C. Find new global average. |

## Parameter Adjustments
- **Divergence**: Increasing the gap between group averages (e.g., 20 vs 80) increases RD in assumed-average tasks.
- **Sequence Length**: AP logic becomes harder as the count increases beyond 10-15.
- **Delta Magnitude**: Small average shifts (e.g., 0.25 kg) over large counts increase CE.
