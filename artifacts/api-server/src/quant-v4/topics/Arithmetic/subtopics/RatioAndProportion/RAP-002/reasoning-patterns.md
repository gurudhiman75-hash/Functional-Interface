# RAP-002: Reasoning Patterns

This document maps RAP-002 canonical problems to task kinds and solver expectations.

## RAP-CP-007: Direct Chain Ratios

### `chainAlignment`

- **Concept**: Align a common element between two ratios.
- **Example**: If A:B = 2:3 and B:C = 5:7, scale both ratios so B matches, then read A:B:C.
- **Core formula**: Use `LCM(B1, B2)` as the shared B value.

### `extendedChainAlignment`

- **Concept**: Align three linked ratios into A:B:C:D.
- **Example**: A:B = 2:3, B:C = 4:5, C:D = 6:7.
- **Core formula**: Apply pairwise LCM scaling successively.

### `missingChainRatio`

- **Concept**: One ratio term is missing but the combined chain is known.
- **Example**: A:B = 2:x and B:C = 3:5, while A:C = 4:15.

## RAP-CP-008: Reverse Chain Proportions

### `reverseMiddleFinding`

- **Concept**: Find the middle entity's value from endpoint values and linked ratios.
- **Example**: A:B = 2:5 and B:C = 3:7, with A and C known.

### `reverseEndpointFinding`

- **Concept**: Find a missing endpoint from the middle value and chain ratios.
- **Example**: B is known; recover A or C.

### `constrainedReverseChain`

- **Concept**: A sum/difference constraint identifies the scale of the chain.
- **Example**: A:C differs by 40; find B.

## RAP-CP-009: Multi-Stage Ratio Transformations

### `successiveRatioChange`

- **Concept**: Apply two state changes and solve the final ratio.
- **Example**: Initial A:B = 3:4; add to A, then remove from B.

### `transferTracking`

- **Concept**: Track an amount transferred from one side to another.
- **Example**: A:B becomes 7:5 after transferring 6 from B to A.

### `reconstructOriginalRatio`

- **Concept**: Work backward from final ratio and operations.
- **Example**: Final ratio and action are known; recover the original ratio.

## RAP-CP-010: Conditional Partition With Ratios

### `nestedPartition`

- **Concept**: Divide a total, then subdivide one part.
- **Example**: Total is divided A:B = 3:2; A is further divided C:D = 4:1.

### `conditionalDistribution`

- **Concept**: A condition determines which branch is subdivided.
- **Example**: If A's share exceeds a threshold, split A in a new ratio.

### `weightedNestedPartition`

- **Concept**: Apply weights at the second level.
- **Example**: Group shares are split by counts and per-unit values.

## RAP-CP-011: Inverse Proportion Chains

### `inverseChainWork`

- **Concept**: Workers and days move inversely.
- **Example**: If worker ratio is A:B and B:C, compare days required.

### `inverseChainSpeed`

- **Concept**: Speed and time move inversely for fixed distance.
- **Example**: Speed ratios form a chain; find time ratio.

### `combinedInverseChain`

- **Concept**: Mix direct and inverse links in one chain.
- **Example**: Efficiency is direct with output but inverse with time.

## RAP-CP-012: Ratio Comparison & Ordering

### `chainOrdering`

- **Concept**: Convert linked ratios to comparable values and order entities.
- **Example**: A:B and B:C are known; arrange A, B, C from greatest to least.

### `chainInequality`

- **Concept**: Compare two normalized chains.
- **Example**: Decide whether A:B:C is greater/equal/smaller than X:Y:Z by chosen metric.

### `chainEquivalence`

- **Concept**: Check whether two differently written chains represent the same relationship.
- **Example**: 2:3:5 and 4:6:10 are equivalent.
