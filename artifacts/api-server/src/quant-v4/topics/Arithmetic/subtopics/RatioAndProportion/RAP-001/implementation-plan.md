# RAP-001: Implementation Plan

## Phase A: Topology Discovery (Completed)
- [x] Identify independent canonical problems.
- [x] Define reasoning patterns.
- [x] Establish difficulty framework.

## Phase A.5: Topology Enrichment (Completed)
- [x] Integrate Multi-Stage Relational Transformations (`multiStageTransformation`).
- [x] Integrate Three-Component Mixtures (`threeComponentMixture`).
- [x] Integrate Variable Quantity Replacement (`variableReplacementRatio`).
- [x] Generalize Weighted Mapping for non-coin entities (`weightedMapping`).
- [x] Integrate Ratio Trees and Multi-Pivot Linkage (`ratioTreeLinkage`).
- [x] Integrate Reverse Partition Systems (`reversePartition`).
- [x] Support Fractional/Decimal normalization across CPs.
- [x] Expand Coin systems to 4 denominations (`multiDenominationMapping`).

## Phase B: Library Development (Next)
### B1: Question Language (QL)
- Create `question-language.en.json` with templates for each CP.
- Support 3-4 variants per taskKind (Total ~60+ templates).
- Parity for Hindi and Punjabi.

### B2: Task Registry
- Map QL IDs to enriched `taskKind` list.
- Define variables for multi-pivot and multi-component systems.

### B3: Variable Ranges
- Define constraints for integer-friendly normalization of fractions/decimals.

## Phase C: Runtime Core
### C1: Parameter Generator
- Implement tree-search pivot finder for `ratioTreeLinkage`.
- Implement constraints for non-zero mixture components.

### C2: Solver
- Implement generic n-component cross-product engine.
- Implement weighted value summation for n-dimensions.

### C3: Validator
- Ensure all linked ratios in a tree are consistent.
- Ensure reverse partitioning yields positive integers.
