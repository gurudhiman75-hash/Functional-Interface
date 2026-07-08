# RAP-002 Maturity Audit

## Status

`RAP-002` has an English-only runtime MVP across all planned canonical problems:

- `RAP-CP-007`: Direct Chain Ratios
- `RAP-CP-008`: Reverse Chain Proportions
- `RAP-CP-009`: Multi-Stage Ratio Transformations
- `RAP-CP-010`: Conditional Partition With Ratios
- `RAP-CP-011`: Inverse Proportion Chains
- `RAP-CP-012`: Ratio Comparison & Ordering

Question Studio wiring is enabled for English only. Hindi/Punjabi generation remains off.

## Coverage Audit

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-coverage-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-coverage-audit.mjs
node dist/quant-v4/rap-002-coverage-audit.mjs
```

Result:

```txt
RAP-002 coverage audit passed.
Active CPs: 6
Active QLs: 49
Task kinds: 24
Answer types: COUNT, LOGIC, RATIO
Generated samples: 769
RAP-CP-007: forced=12, random=12, taskKinds=chainAlignment, extendedChainAlignment, missingChainRatio, uniqueStems=132
RAP-CP-008: forced=6, random=6, taskKinds=constrainedReverseChain, reverseEndpointFinding, reverseMiddleFinding, uniqueStems=126
RAP-CP-009: forced=9, random=9, taskKinds=electionMargin, electionTotalVotersFromMargin, electionWinnerVotes, reconstructOriginalRatio, successiveRatioChange, transferTracking, uniqueStems=129
RAP-CP-010: forced=8, random=8, taskKinds=conditionalDistribution, incomeExpenditureSavings, nestedPartition, weightedNestedPartition, uniqueStems=127
RAP-CP-011: forced=8, random=8, taskKinds=combinedInverseChain, inverseChainSpeed, inverseChainWork, sdtRaceLead, sdtTimeRatioFromSpeedDistance, uniqueStems=128
RAP-CP-012: forced=6, random=6, taskKinds=chainEquivalence, chainInequality, chainOrdering, uniqueStems=126
```

## Runtime Smoke

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002.test.mjs
node dist/quant-v4/rap-002.test.mjs
```

Result:

```txt
RAP-002 multilingual enrichment test passed. CP-007 QLs covered: 12. CP-008 QLs covered: 6. CP-009 QLs covered: 9. CP-010 QLs covered: 8. CP-011 QLs covered: 8. CP-012 QLs covered: 6.
```

## Question Studio English-Only Smoke

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-question-studio-smoke.mjs
node dist/quant-v4/rap-002-question-studio-smoke.mjs
```

Result:

```txt
RAP-002 Question Studio English-only smoke passed.
Discovery: enabled=true, supportedLanguages=en
Generated questions: 12
Covered CPs: RAP-CP-007, RAP-CP-008, RAP-CP-009, RAP-CP-010, RAP-CP-011, RAP-CP-012
Hindi/Punjabi exposure: blocked by runtime
```

## Residual Generated-Output QA

Command:

```powershell
.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-residual-qa.mjs
node dist/quant-v4/rap-002-residual-qa.mjs
```

Result:

```txt
RAP-002 residual QA passed.
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
Equivalence answers: Equivalent = 18, Not equivalent = 19
```

Hardening covered:

- semantic scenario compatibility
- subject-verb agreement
- no unresolved placeholders
- no `NaN`, `Infinity`, `undefined`, or `null` leakage
- valid `correctIndex`
- unique normalized options
- no weak options
- metadata language parity
- chain inequality no-tie generation
- positive and negative equivalence diversity
- duplicate exact stem prevention

## Current Caveats

- English coverage is an MVP slice, not full production breadth.
- Question Studio discovery is wired for `RAP-002` in English only.
- Hindi/Punjabi files and localized explanation rendering are not implemented.
- Options and preview metadata are covered by the English-only Question Studio smoke.
- RAP-002 keeps limited election/SDT transitional examples only as linked-ratio mechanics demonstrations. RAP-003 owns broad application-domain treatment, and RAP-003 residual QA currently reports zero exact normalized stem duplicates against RAP-002.
- RAP-002 is ready for English manual review, not freeze-ready.

## Recommendation

Next safe step is editorial review of the English MVP breadth. Do not expand QLs or enable Hindi/Punjabi until the current English MVP shape is approved.
