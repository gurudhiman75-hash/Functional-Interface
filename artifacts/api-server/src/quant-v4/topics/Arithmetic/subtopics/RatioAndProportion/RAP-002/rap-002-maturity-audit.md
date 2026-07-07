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
Active QLs: 42
Task kinds: 18
Answer types: COUNT, LOGIC, RATIO
Generated samples: 762
RAP-CP-007: forced=12, random=12, taskKinds=chainAlignment, extendedChainAlignment, missingChainRatio, uniqueStems=68
RAP-CP-008: forced=6, random=6, taskKinds=constrainedReverseChain, reverseEndpointFinding, reverseMiddleFinding, uniqueStems=103
RAP-CP-009: forced=6, random=6, taskKinds=reconstructOriginalRatio, successiveRatioChange, transferTracking, uniqueStems=115
RAP-CP-010: forced=6, random=6, taskKinds=conditionalDistribution, nestedPartition, weightedNestedPartition, uniqueStems=124
RAP-CP-011: forced=6, random=6, taskKinds=combinedInverseChain, inverseChainSpeed, inverseChainWork, uniqueStems=112
RAP-CP-012: forced=6, random=6, taskKinds=chainEquivalence, chainInequality, chainOrdering, uniqueStems=58
```

## Runtime Smoke

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002.test.mjs
node dist/quant-v4/rap-002.test.mjs
```

Result:

```txt
RAP-002 English test passed. CP-007 QLs covered: 12. CP-008 QLs covered: 6. CP-009 QLs covered: 6. CP-010 QLs covered: 6. CP-011 QLs covered: 6. CP-012 QLs covered: 6.
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

## Current Caveats

- English coverage is an MVP slice, not full production breadth.
- Question Studio discovery is wired for `RAP-002` in English only.
- Hindi/Punjabi files and localized explanation rendering are not implemented.
- Options and preview metadata are covered by the English-only Question Studio smoke.

## Recommendation

Next safe step is editorial review of the English MVP breadth. Keep Hindi/Punjabi disabled until localized stems, labels, explanations, and audits exist.
