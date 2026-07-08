# RAP-002 Residual QA Report

## Scope

- Package: `RAP-002`
- Language: English only
- Sample size: `500` Question Studio previews
- Active CPs: `RAP-CP-007` to `RAP-CP-012`
- Active QLs: `42`
- Hindi/Punjabi exposure: off

## Fixes Applied

- Replaced global entity selection with explicit task-safe scenario pools.
- Corrected `RAP-QL-601` subject-verb agreement from `are` to `is`.
- Prevented tie-risk in generated `chainInequality` and `chainOrdering` samples.
- Added positive and negative `chainEquivalence` generation paths.
- Added `correctIndex` to Quant V4 Question Studio preview output while preserving existing `correct`.
- Fixed fixed-template extended-chain target pairing for `RAP-QL-205`, `RAP-QL-206`, and `RAP-QL-207`.
- Improved RAP-002 deterministic hash and seed-based numeric spread to remove exact duplicate stems in 500-sample QA.

## Final Residual QA Counters

```txt
questionCount: 500
duplicateStemGroupCount: 0
duplicateStemQuestionCount: 0
grammarIssueCount: 0
semanticCompatibilityIssueCount: 0
unresolvedPlaceholderCount: 0
nanUndefinedNullCount: 0
invalidCorrectIndexCount: 0
duplicateNormalizedOptionCount: 0
weakOptionCount: 0
metadataLanguageMismatchCount: 0
validationFailureCount: 0
invalidAnswerFormatCount: 0
genericInternalExplanationCount: 0
chainInequalityTieRiskCount: 0
extendedTargetMismatchCount: 0
```

## Distribution

CP distribution:

```txt
RAP-CP-007: 83
RAP-CP-008: 83
RAP-CP-009: 83
RAP-CP-010: 84
RAP-CP-011: 84
RAP-CP-012: 83
```

Task distribution:

```txt
chainAlignment: 30
chainEquivalence: 37
chainInequality: 28
chainOrdering: 18
combinedInverseChain: 32
conditionalDistribution: 32
constrainedReverseChain: 25
extendedChainAlignment: 31
inverseChainSpeed: 19
inverseChainWork: 33
missingChainRatio: 22
nestedPartition: 20
reconstructOriginalRatio: 29
reverseEndpointFinding: 21
reverseMiddleFinding: 37
successiveRatioChange: 26
transferTracking: 28
weightedNestedPartition: 32
```

Equivalence answer distribution:

```txt
Equivalent: 18
Not equivalent: 19
```

## Status

- RAP-002 English MVP is QA-clean for generated-output manual review.
- RAP-002 remains English-only.
- RAP-002 is not multilingual-ready.
- RAP-002 is not freeze-ready for full production breadth.
- Recommended next step: manual editorial review of English generated samples before any QL expansion.
