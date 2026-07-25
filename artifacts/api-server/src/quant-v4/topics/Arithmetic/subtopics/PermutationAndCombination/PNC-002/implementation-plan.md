# PNC-002 Need-Based Implementation Plan

## Completed checkpoint — CP-007 runtime proof

The first PNC-002 checkpoint admits twelve English QLs, `PNC-QL-107` through `PNC-QL-118`.

Five solve contracts were required:

1. `countSingleBlockTogether`
2. `countSingleBlockNotTogether`
3. `countMultipleBlocksTogether`
4. `countBlockWithExternalPairApart`
5. `recoverBlockRestrictionParameter`

## Admission rationale

The corpus represents:

- direct pair and larger-block compression;
- direct complement semantics;
- multiple equal and unequal blocks;
- an interacting together/apart restriction;
- inverse total-object and block-size directions.

Additional noun substitutions were rejected. Positional, relative-order, explicit-gap, circular, category-selection and inclusion–exclusion families remain in their later fixed CPs.

## Proof boundary

- 12 QLs;
- 5 modes;
- 12 deterministic seeds per QL;
- each generated twice;
- 144 proof cases;
- exhaustive permutation enumeration as independent verifier;
- four unique positive options;
- QL-specific natural explanations;
- LaTeX-formatted visible calculations;
- English only;
- unpublished and disconnected from production routing.

## Next action

Review the generated human-review export and perform a CP-007 saturation/editorial audit before either expanding CP-007 or beginning `PNC-CP-008`.
