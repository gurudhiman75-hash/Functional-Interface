# NS-SURD-001 Library Authority Map

## Authority

- Source authority: `ns-surd-001-language-draft.md`
- Ownership: HUMAN_OWNED
- Educational authority: Educational Authority
- Usage: Runtime Consumption Only

## CP To QL IDs

- CP01 Perfect-power extraction from a surd: QL-001 to QL-020
- CP02 Like-surd addition and subtraction: QL-021 to QL-040
- CP03 Surd multiplication and division simplification: QL-041 to QL-060
- CP04 Mixed surd expression simplification: QL-061 to QL-085
- CP05 Surd comparison by normalization: QL-086 to QL-120
- CP06 Monomial denominator rationalization: QL-121 to QL-135
- CP07 Binomial denominator rationalization: QL-136 to QL-155
- CP08 Surd identity evaluation: QL-156 to QL-175

## CP To ES IDs

- CP01 Perfect-power extraction from a surd: ES-001
- CP02 Like-surd addition and subtraction: ES-002
- CP03 Surd multiplication and division simplification: ES-003
- CP04 Mixed surd expression simplification: ES-004
- CP05 Surd comparison by normalization: ES-005
- CP06 Monomial denominator rationalization: ES-006
- CP07 Binomial denominator rationalization: ES-007
- CP08 Surd identity evaluation: ES-008

## Coverage To CP

- CP01: squareRootCases, cubeRootCases, mixedExtraction
- CP02: directCombination, simplifyBeforeCombination, multiTermCombination
- CP03: multiplicationCases, divisionCases, coefficientCases
- CP04: mixedOperations, simplificationChains, multiStepExpressions
- CP05: pairComparison, ordering, greatestSelection, leastSelection
- CP06: squareRootRationalization, cubeRootRationalization, coefficientRationalization
- CP07: conjugateMethod, surdBinomial, mixedBinomial
- CP08: squareIdentity, conjugateIdentity, identitySimplification

## Variable Range To CP

- CP01: squareRootExtraction, cubeRootExtraction, perfectPowerRecognition
- CP02: directLikeSurds, simplifyThenCombine, coefficientCombination
- CP03: multiplication, division, mixedCoefficientOperations
- CP04: additionSubtractionMix, multiplicationMix, divisionMix, multiStepSimplification
- CP05: pairComparison, increasingOrder, decreasingOrder, greatestSelection, leastSelection
- CP06: squareRootDenominator, cubeRootDenominator, coefficientDenominator
- CP07: simpleConjugate, surdConjugate, mixedBinomialDenominator
- CP08: squareExpansion, conjugateProduct, identityEvaluation

## Verification

- CP count: 8
- QL count: 175
- ES count: 8
- All QL IDs are unique.
- All ES IDs are unique.
- Educational wording is copied from `ns-surd-001-language-draft.md` only.
- No runtime files, tests, or audits are defined here.
