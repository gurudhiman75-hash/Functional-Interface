# PNC-002 Need-Based Implementation Plan

## Completed checkpoint — CP-007 saturation runtime proof

The reviewed CP-007 checkpoint admits eighteen English QLs, `PNC-QL-107` through `PNC-QL-124`.

Nine solve contracts are active:

1. `countSingleBlockTogether`
2. `countSingleBlockNotTogether`
3. `countMultipleBlocksTogether`
4. `countBlockWithExternalPairApart`
5. `countTwoBlocksTogetherNotAdjacent`
6. `countBlockWithOutsiderNotAdjacent`
7. `countOneBlockTogetherOtherNotTogether`
8. `countNotAllSpecifiedBlocksTogether`
9. `recoverBlockRestrictionParameter`

## Admission rationale

The corpus now represents:

- direct pair and larger-block compression;
- direct single-block and multiple-block complements;
- multiple equal and unequal blocks;
- formed blocks that must remain separated;
- a block separated from an external pair or named outsider;
- one block together while another specified group is broken;
- inverse total-object and block-size directions, including a multiple-block inverse.

Further CP-007 proposals reviewed so far collapse into these predicates. Positional, relative-order, starts/ends, alternation and explicit-gap families remain in CP-008. Circular, category-selection, grouping and broader inclusion–exclusion systems remain in their fixed later CPs.

## Proof boundary

- 18 QLs;
- 9 modes;
- 12 deterministic seeds per QL;
- each generated twice;
- 216 proof cases;
- exhaustive permutation enumeration as independent verifier;
- four unique positive options;
- QL-specific natural explanations;
- LaTeX-formatted visible calculations;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0;
- English only;
- unpublished and disconnected from production routing.

## Verdict and next action

`PNC-CP-007` is saturated for its current English ownership boundary at runtime-proof maturity. The next implementation checkpoint is `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`.
