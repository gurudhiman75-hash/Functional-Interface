# RAP-003 Maturity Audit

## Status

RAP-003 has English runtime coverage for all planned application CPs, RAP-CP-013 through RAP-CP-022, and is discoverable through Quant V4 Question Studio.

## Question Studio Smoke

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-003-question-studio-smoke.mjs
node dist/quant-v4/rap-003-question-studio-smoke.mjs
```

Result:

```txt
RAP-003 Question Studio English-only smoke passed.
Discovery: enabled=true, supportedLanguages=en
Generated questions: 20
Covered CPs: RAP-CP-013, RAP-CP-014, RAP-CP-015, RAP-CP-016, RAP-CP-017, RAP-CP-018, RAP-CP-019, RAP-CP-020, RAP-CP-021, RAP-CP-022
Hindi/Punjabi exposure: blocked by runtime
```

## Residual QA

Command:

```powershell
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-003-residual-qa.mjs
node dist/quant-v4/rap-003-residual-qa.mjs
```

Result:

```txt
RAP-003 residual QA passed.
questionCount: 500
duplicateStemGroupCount: 0
crossPackageDuplicateWithRap002Count: 0
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
percentageFormatIssueCount: 0
fractionalCountAnswerCount: 0
fractionalAgeAnswerCount: 0
negativeValueCount: 0
unrealisticAgeCount: 0
populationGrammarIssueCount: 0
genericInternalExplanationCount: 0
unsupportedLanguageExposureCount: 0
```

## Recommendation

Proceed to English manual review. Do not publish Hindi/Punjabi until localized stems and explanations have their own editorial QA.

