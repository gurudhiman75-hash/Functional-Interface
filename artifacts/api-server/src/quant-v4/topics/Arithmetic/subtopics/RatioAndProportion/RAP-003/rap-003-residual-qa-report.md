# RAP-003 Residual QA Report

Sample size: 500 English Question Studio previews.

## Distribution

- CP distribution: each of RAP-CP-013 through RAP-CP-022 generated 50 questions.
- Answer type distribution: AGE 29, COUNT 118, PERCENT 22, PROFIT 50, QUANTITY 86, RATIO 164, TIME 31.
- All active QLs were reached across the sample.

## Final Counters

- duplicateStemGroupCount: 0
- duplicateStemQuestionCount: 0
- crossPackageDuplicateWithRap002Count: 0
- grammarIssueCount: 0
- semanticCompatibilityIssueCount: 0
- unresolvedPlaceholderCount: 0
- nanUndefinedNullCount: 0
- invalidCorrectIndexCount: 0
- duplicateNormalizedOptionCount: 0
- weakOptionCount: 0
- metadataLanguageMismatchCount: 0
- validationFailureCount: 0
- invalidAnswerFormatCount: 0
- percentageFormatIssueCount: 0
- fractionalCountAnswerCount: 0
- fractionalAgeAnswerCount: 0
- negativeValueCount: 0
- unrealisticAgeCount: 0
- populationGrammarIssueCount: 0
- genericInternalExplanationCount: 0
- unsupportedLanguageExposureCount: 0

## Exposure Status

RAP-003 is Question Studio wired as English-only: `supportedLanguages = ["en"]`. Hindi and Punjabi structural files remain in the package for parity checks, but Question Studio generation rejects `hi` and `pa`.

## Caveats

The English generated-output audit is clean and ready for manual review. Multilingual publication remains blocked until Hindi/Punjabi editorial localization is completed and separately audited.

Manual editorial review is still required before freeze-ready status.

