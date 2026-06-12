# NS-TRAIL-001 Pre-Freeze Coverage Audit

Generated questions per CP: 500

## Repetition Repair

| CP | Old max repetition | New max repetition | Target | Status |
| --- | ---: | ---: | ---: | --- |
| CP-001 | 30 | 7 | < 20 | Pass |
| CP-002 | 53 | 3 | < 25 | Pass |
| CP-003 | 74 | 9 | < 25 | Pass |
| CP-004 | 127 | 3 | < 30 | Pass |
| CP-005 | 52 | 3 | < 25 | Pass |

## Verification Summary

- All generation failures zero: true
- All validation failures zero: true
- All traceability failures zero: true
- All MathJax failures zero: true
- All unused QL IDs zero: true
- All unused ES IDs zero: true
- Final verdict: READY FOR HUMAN FREEZE REVIEW

## Per-CP Audit

### CP-001
- Questions: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Unused QL IDs: None
- Unused ES IDs: None
- Maximum exact question repetition: 7
- Top repeated questions:
  - 7x Calculate the number of zeros at the end of 3!.
  - 7x Find the number of trailing zeros in 2!.
  - 7x Find the number of trailing zeros in 4!.
  - 7x How many zeros occur at the end of 1! ?
  - 6x Determine the number of trailing zeros in 4!.
  - 6x The value of 2! ends with how many zeros?
  - 5x How many zeros appear consecutively at the end of 1! ?
  - 4x Find the count of terminal zeros in 3!.
  - 4x Find the number of terminal zeros in the decimal representation of 4!.
  - 4x How many trailing zeros does 4! contain?

```json
{
  "questionCount": 500,
  "generationFailures": 0,
  "validationFailures": 0,
  "traceabilityFailures": 0,
  "mathJaxFailures": 0,
  "unusedQuestionLanguageIds": [],
  "unusedExplanationIds": [],
  "maximumExactQuestionRepetition": 7,
  "repeatedQuestionExamples": [
    "7x Calculate the number of zeros at the end of 3!.",
    "7x Find the number of trailing zeros in 2!.",
    "7x Find the number of trailing zeros in 4!.",
    "7x How many zeros occur at the end of 1! ?",
    "6x Determine the number of trailing zeros in 4!.",
    "6x The value of 2! ends with how many zeros?",
    "5x How many zeros appear consecutively at the end of 1! ?",
    "4x Find the count of terminal zeros in 3!.",
    "4x Find the number of terminal zeros in the decimal representation of 4!.",
    "4x How many trailing zeros does 4! contain?"
  ],
  "difficultyDistribution": {
    "Hard": 102,
    "Medium": 197,
    "Easy": 201
  },
  "canonicalProblemDistribution": {
    "CP-001": 500
  },
  "questionLanguageDistribution": {
    "QL-006": 59,
    "QL-003": 53,
    "QL-004": 37,
    "QL-001": 56,
    "QL-030": 42,
    "QL-027": 53,
    "QL-002": 48,
    "QL-005": 42,
    "QL-029": 46,
    "QL-028": 64
  },
  "explanationDistribution": {
    "ES-001": 500
  },
  "nBucketCoverage": {
    "largeFactorial": 182,
    "smallFactorial": 177,
    "mediumFactorial": 141
  },
  "largestPowerOfFiveReachedCoverage": {
    "crosses625": 169,
    "below25": 139,
    "crosses25": 131,
    "crosses125": 61
  },
  "expressionTypeCoverage": {
    "not-applicable": 500
  },
  "factorialTermCountCoverage": {
    "not-applicable": 500
  },
  "targetZeroBucketCoverage": {
    "not-applicable": 500
  },
  "searchIterationsCoverage": {
    "not-applicable": 500
  },
  "baseFactorizationTypeCoverage": {
    "not-applicable": 500
  },
  "powerMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productTypeCoverage": {
    "not-applicable": 500
  },
  "twoCountCoverage": {
    "not-applicable": 500
  },
  "fiveCountCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "mathJaxUsage": {
    "factorFiveCountLatex": 500
  },
  "topRepeatedQuestions": [
    {
      "stem": "Calculate the number of zeros at the end of 3!.",
      "count": 7
    },
    {
      "stem": "Find the number of trailing zeros in 2!.",
      "count": 7
    },
    {
      "stem": "Find the number of trailing zeros in 4!.",
      "count": 7
    },
    {
      "stem": "How many zeros occur at the end of 1! ?",
      "count": 7
    },
    {
      "stem": "Determine the number of trailing zeros in 4!.",
      "count": 6
    },
    {
      "stem": "The value of 2! ends with how many zeros?",
      "count": 6
    },
    {
      "stem": "How many zeros appear consecutively at the end of 1! ?",
      "count": 5
    },
    {
      "stem": "Find the count of terminal zeros in 3!.",
      "count": 4
    },
    {
      "stem": "Find the number of terminal zeros in the decimal representation of 4!.",
      "count": 4
    },
    {
      "stem": "How many trailing zeros does 4! contain?",
      "count": 4
    }
  ],
  "factorialMagnitudeCoverage": {
    "above625": 169,
    "below5": 78,
    "between5And24": 61,
    "between25And124": 131,
    "between125And624": 61
  },
  "factorialStructureCoverage": {
    "not-applicable": 500
  },
  "targetZeroMagnitudeCoverage": {
    "not-applicable": 500
  },
  "baseFamilyCoverage": {
    "not-applicable": 500
  },
  "exponentMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productStructureCoverage": {
    "not-applicable": 500
  }
}
```

### CP-002
- Questions: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Unused QL IDs: None
- Unused ES IDs: None
- Maximum exact question repetition: 3
- Top repeated questions:
  - 3x Evaluate the number of trailing zeros in the expression 140! / 136!.
  - 3x Evaluate the number of trailing zeros in the expression 164! / 160!.
  - 3x Find the number of terminal zeros in 121!.
  - 3x Find the number of terminal zeros in 168! / 162!.
  - 3x Find the number of terminal zeros in 88! / 82!.
  - 3x Find the terminal-zero count of 152! / 150!.
  - 3x Find the terminal-zero count of 240! / 238!.
  - 3x How many trailing zeros are present in 212! / 204!?
  - 2x Calculate the trailing zeros in 234! / 124!.
  - 2x Evaluate the number of trailing zeros in the expression 108! / 104!.

```json
{
  "questionCount": 500,
  "generationFailures": 0,
  "validationFailures": 0,
  "traceabilityFailures": 0,
  "mathJaxFailures": 0,
  "unusedQuestionLanguageIds": [],
  "unusedExplanationIds": [],
  "maximumExactQuestionRepetition": 3,
  "repeatedQuestionExamples": [
    "3x Evaluate the number of trailing zeros in the expression 140! / 136!.",
    "3x Evaluate the number of trailing zeros in the expression 164! / 160!.",
    "3x Find the number of terminal zeros in 121!.",
    "3x Find the number of terminal zeros in 168! / 162!.",
    "3x Find the number of terminal zeros in 88! / 82!.",
    "3x Find the terminal-zero count of 152! / 150!.",
    "3x Find the terminal-zero count of 240! / 238!.",
    "3x How many trailing zeros are present in 212! / 204!?",
    "2x Calculate the trailing zeros in 234! / 124!.",
    "2x Evaluate the number of trailing zeros in the expression 108! / 104!."
  ],
  "difficultyDistribution": {
    "Medium": 206,
    "Easy": 196,
    "Hard": 98
  },
  "canonicalProblemDistribution": {
    "CP-002": 500
  },
  "questionLanguageDistribution": {
    "QL-007": 63,
    "QL-031": 63,
    "QL-009": 62,
    "QL-033": 62,
    "QL-011": 63,
    "QL-008": 63,
    "QL-032": 62,
    "QL-010": 62
  },
  "explanationDistribution": {
    "ES-002": 500
  },
  "nBucketCoverage": {
    "not-applicable": 500
  },
  "largestPowerOfFiveReachedCoverage": {
    "below25": 500
  },
  "expressionTypeCoverage": {
    "cancellationCase": 165,
    "numeratorDenominator": 255,
    "numeratorOnly": 80
  },
  "factorialTermCountCoverage": {
    "1": 80,
    "2": 255,
    "3": 165
  },
  "targetZeroBucketCoverage": {
    "not-applicable": 500
  },
  "searchIterationsCoverage": {
    "not-applicable": 500
  },
  "baseFactorizationTypeCoverage": {
    "not-applicable": 500
  },
  "powerMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productTypeCoverage": {
    "not-applicable": 500
  },
  "twoCountCoverage": {
    "not-applicable": 500
  },
  "fiveCountCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "mathJaxUsage": {
    "factorialExpressionLatex": 500
  },
  "topRepeatedQuestions": [
    {
      "stem": "Evaluate the number of trailing zeros in the expression 140! / 136!.",
      "count": 3
    },
    {
      "stem": "Evaluate the number of trailing zeros in the expression 164! / 160!.",
      "count": 3
    },
    {
      "stem": "Find the number of terminal zeros in 121!.",
      "count": 3
    },
    {
      "stem": "Find the number of terminal zeros in 168! / 162!.",
      "count": 3
    },
    {
      "stem": "Find the number of terminal zeros in 88! / 82!.",
      "count": 3
    },
    {
      "stem": "Find the terminal-zero count of 152! / 150!.",
      "count": 3
    },
    {
      "stem": "Find the terminal-zero count of 240! / 238!.",
      "count": 3
    },
    {
      "stem": "How many trailing zeros are present in 212! / 204!?",
      "count": 3
    },
    {
      "stem": "Calculate the trailing zeros in 234! / 124!.",
      "count": 2
    },
    {
      "stem": "Evaluate the number of trailing zeros in the expression 108! / 104!.",
      "count": 2
    }
  ],
  "factorialMagnitudeCoverage": {
    "not-applicable": 500
  },
  "factorialStructureCoverage": {
    "threeFactorials": 85,
    "twoFactorials": 163,
    "largeGapFactorials": 165,
    "closeFactorials": 87
  },
  "targetZeroMagnitudeCoverage": {
    "not-applicable": 500
  },
  "baseFamilyCoverage": {
    "not-applicable": 500
  },
  "exponentMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productStructureCoverage": {
    "not-applicable": 500
  }
}
```

### CP-003
- Questions: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Unused QL IDs: None
- Unused ES IDs: None
- Maximum exact question repetition: 9
- Top repeated questions:
  - 9x Identify the smallest number whose factorial has a trailing-zero count of 1.
  - 8x Determine the smallest integer whose factorial ends with 1 zeros.
  - 8x Find the smallest number whose factorial contains exactly 1 trailing zeros.
  - 8x What is the least value of n for which n! has exactly 3 trailing zeros?
  - 7x Determine the smallest integer whose factorial ends with 2 zeros.
  - 7x Find the least n such that n! contains 4 trailing zeros.
  - 7x Identify the smallest number whose factorial has a trailing-zero count of 3.
  - 6x Determine the smallest integer whose factorial ends with 3 zeros.
  - 6x What is the least value of n for which n! has exactly 4 trailing zeros?
  - 5x Find the least n such that n! contains 1 trailing zeros.

```json
{
  "questionCount": 500,
  "generationFailures": 0,
  "validationFailures": 0,
  "traceabilityFailures": 0,
  "mathJaxFailures": 0,
  "unusedQuestionLanguageIds": [],
  "unusedExplanationIds": [],
  "maximumExactQuestionRepetition": 9,
  "repeatedQuestionExamples": [
    "9x Identify the smallest number whose factorial has a trailing-zero count of 1.",
    "8x Determine the smallest integer whose factorial ends with 1 zeros.",
    "8x Find the smallest number whose factorial contains exactly 1 trailing zeros.",
    "8x What is the least value of n for which n! has exactly 3 trailing zeros?",
    "7x Determine the smallest integer whose factorial ends with 2 zeros.",
    "7x Find the least n such that n! contains 4 trailing zeros.",
    "7x Identify the smallest number whose factorial has a trailing-zero count of 3.",
    "6x Determine the smallest integer whose factorial ends with 3 zeros.",
    "6x What is the least value of n for which n! has exactly 4 trailing zeros?",
    "5x Find the least n such that n! contains 1 trailing zeros."
  ],
  "difficultyDistribution": {
    "Medium": 203,
    "Easy": 199,
    "Hard": 98
  },
  "canonicalProblemDistribution": {
    "CP-003": 500
  },
  "questionLanguageDistribution": {
    "QL-013": 105,
    "QL-016": 112,
    "QL-012": 84,
    "QL-015": 101,
    "QL-014": 98
  },
  "explanationDistribution": {
    "ES-003": 500
  },
  "nBucketCoverage": {
    "not-applicable": 500
  },
  "largestPowerOfFiveReachedCoverage": {
    "below25": 500
  },
  "expressionTypeCoverage": {
    "not-applicable": 500
  },
  "factorialTermCountCoverage": {
    "not-applicable": 500
  },
  "targetZeroBucketCoverage": {
    "largeZeroCount": 277,
    "mediumZeroCount": 113,
    "solutionExists": 87,
    "smallZeroCount": 23
  },
  "searchIterationsCoverage": {
    "largeSearch": 284,
    "mediumSearch": 106,
    "smallSearch": 110
  },
  "baseFactorizationTypeCoverage": {
    "not-applicable": 500
  },
  "powerMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productTypeCoverage": {
    "not-applicable": 500
  },
  "twoCountCoverage": {
    "not-applicable": 500
  },
  "fiveCountCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "mathJaxUsage": {
    "searchProcessLatex": 500
  },
  "topRepeatedQuestions": [
    {
      "stem": "Identify the smallest number whose factorial has a trailing-zero count of 1.",
      "count": 9
    },
    {
      "stem": "Determine the smallest integer whose factorial ends with 1 zeros.",
      "count": 8
    },
    {
      "stem": "Find the smallest number whose factorial contains exactly 1 trailing zeros.",
      "count": 8
    },
    {
      "stem": "What is the least value of n for which n! has exactly 3 trailing zeros?",
      "count": 8
    },
    {
      "stem": "Determine the smallest integer whose factorial ends with 2 zeros.",
      "count": 7
    },
    {
      "stem": "Find the least n such that n! contains 4 trailing zeros.",
      "count": 7
    },
    {
      "stem": "Identify the smallest number whose factorial has a trailing-zero count of 3.",
      "count": 7
    },
    {
      "stem": "Determine the smallest integer whose factorial ends with 3 zeros.",
      "count": 6
    },
    {
      "stem": "What is the least value of n for which n! has exactly 4 trailing zeros?",
      "count": 6
    },
    {
      "stem": "Find the least n such that n! contains 1 trailing zeros.",
      "count": 5
    }
  ],
  "factorialMagnitudeCoverage": {
    "not-applicable": 500
  },
  "factorialStructureCoverage": {
    "not-applicable": 500
  },
  "targetZeroMagnitudeCoverage": {
    "largeZeroCount": 64,
    "veryLargeZeroCount": 156,
    "mediumZeroCount": 85,
    "smallZeroCount": 108,
    "verySmallZeroCount": 87
  },
  "baseFamilyCoverage": {
    "not-applicable": 500
  },
  "exponentMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productStructureCoverage": {
    "not-applicable": 500
  }
}
```

### CP-004
- Questions: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Unused QL IDs: None
- Unused ES IDs: None
- Maximum exact question repetition: 3
- Top repeated questions:
  - 3x Determine the terminal-zero count of the power 390625^9.
  - 3x Determine the trailing-zero count of 5760^4.
  - 3x Find the number of zeros at the end of the value of 140^7.
  - 3x How many trailing zeros occur in 1000000^6?
  - 3x How many trailing zeros occur in 1000000^8?
  - 2x Calculate the number of zeros at the end of 125^5.
  - 2x Calculate the number of zeros at the end of 390625^10.
  - 2x Calculate the number of zeros at the end of 625^37.
  - 2x Determine the terminal-zero count of the power 15625^28.
  - 2x Determine the terminal-zero count of the power 15625^4.

```json
{
  "questionCount": 500,
  "generationFailures": 0,
  "validationFailures": 0,
  "traceabilityFailures": 0,
  "mathJaxFailures": 0,
  "unusedQuestionLanguageIds": [],
  "unusedExplanationIds": [],
  "maximumExactQuestionRepetition": 3,
  "repeatedQuestionExamples": [
    "3x Determine the terminal-zero count of the power 390625^9.",
    "3x Determine the trailing-zero count of 5760^4.",
    "3x Find the number of zeros at the end of the value of 140^7.",
    "3x How many trailing zeros occur in 1000000^6?",
    "3x How many trailing zeros occur in 1000000^8?",
    "2x Calculate the number of zeros at the end of 125^5.",
    "2x Calculate the number of zeros at the end of 390625^10.",
    "2x Calculate the number of zeros at the end of 625^37.",
    "2x Determine the terminal-zero count of the power 15625^28.",
    "2x Determine the terminal-zero count of the power 15625^4."
  ],
  "difficultyDistribution": {
    "Easy": 188,
    "Medium": 205,
    "Hard": 107
  },
  "canonicalProblemDistribution": {
    "CP-004": 500
  },
  "questionLanguageDistribution": {
    "QL-035": 64,
    "QL-020": 64,
    "QL-021": 64,
    "QL-018": 64,
    "QL-019": 62,
    "QL-036": 62,
    "QL-017": 60,
    "QL-034": 60
  },
  "explanationDistribution": {
    "ES-004": 500
  },
  "nBucketCoverage": {
    "not-applicable": 500
  },
  "largestPowerOfFiveReachedCoverage": {
    "below25": 500
  },
  "expressionTypeCoverage": {
    "not-applicable": 500
  },
  "factorialTermCountCoverage": {
    "not-applicable": 500
  },
  "targetZeroBucketCoverage": {
    "not-applicable": 500
  },
  "searchIterationsCoverage": {
    "not-applicable": 500
  },
  "baseFactorizationTypeCoverage": {
    "excessFives": 46,
    "noTrailingZero": 250,
    "balancedTwoFive": 124,
    "excessTwos": 80
  },
  "powerMagnitudeCoverage": {
    "large": 405,
    "medium": 80,
    "small": 15
  },
  "productTypeCoverage": {
    "not-applicable": 500
  },
  "twoCountCoverage": {
    "large": 352,
    "zero": 126,
    "medium": 22
  },
  "fiveCountCoverage": {
    "large": 343,
    "zero": 124,
    "medium": 28,
    "small": 5
  },
  "pairCountCoverage": {
    "large": 217,
    "zero": 250,
    "medium": 29,
    "small": 4
  },
  "mathJaxUsage": {
    "powerFactorizationLatex": 500
  },
  "topRepeatedQuestions": [
    {
      "stem": "Determine the terminal-zero count of the power 390625^9.",
      "count": 3
    },
    {
      "stem": "Determine the trailing-zero count of 5760^4.",
      "count": 3
    },
    {
      "stem": "Find the number of zeros at the end of the value of 140^7.",
      "count": 3
    },
    {
      "stem": "How many trailing zeros occur in 1000000^6?",
      "count": 3
    },
    {
      "stem": "How many trailing zeros occur in 1000000^8?",
      "count": 3
    },
    {
      "stem": "Calculate the number of zeros at the end of 125^5.",
      "count": 2
    },
    {
      "stem": "Calculate the number of zeros at the end of 390625^10.",
      "count": 2
    },
    {
      "stem": "Calculate the number of zeros at the end of 625^37.",
      "count": 2
    },
    {
      "stem": "Determine the terminal-zero count of the power 15625^28.",
      "count": 2
    },
    {
      "stem": "Determine the terminal-zero count of the power 15625^4.",
      "count": 2
    }
  ],
  "factorialMagnitudeCoverage": {
    "not-applicable": 500
  },
  "factorialStructureCoverage": {
    "not-applicable": 500
  },
  "targetZeroMagnitudeCoverage": {
    "not-applicable": 500
  },
  "baseFamilyCoverage": {
    "mixedBase": 126,
    "powerOfFive": 126,
    "powerOfTwo": 124,
    "powerOfTen": 124
  },
  "exponentMagnitudeCoverage": {
    "largeExponent": 245,
    "smallExponent": 165,
    "mediumExponent": 90
  },
  "productStructureCoverage": {
    "not-applicable": 500
  }
}
```

### CP-005
- Questions: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Unused QL IDs: None
- Unused ES IDs: None
- Maximum exact question repetition: 3
- Top repeated questions:
  - 3x After multiplying 520 and 575, how many zeros will appear at the end of the result?
  - 3x Calculate the trailing zeros in the product of 1953125 and 16384.
  - 3x Find the number of terminal zeros in the product of 512 and 15625.
  - 3x If 390 is multiplied by 520, how many trailing zeros will the product contain?
  - 2x After multiplying 280 and 255, how many zeros will appear at the end of the result?
  - 2x After multiplying 3125 and 32768, how many zeros will appear at the end of the result?
  - 2x After multiplying 315 and 930, how many zeros will appear at the end of the result?
  - 2x After multiplying 65 and 130, how many zeros will appear at the end of the result?
  - 2x Calculate the trailing zeros in the product of 1024 and 125.
  - 2x Calculate the trailing zeros in the product of 510 and 580.

```json
{
  "questionCount": 500,
  "generationFailures": 0,
  "validationFailures": 0,
  "traceabilityFailures": 0,
  "mathJaxFailures": 0,
  "unusedQuestionLanguageIds": [],
  "unusedExplanationIds": [],
  "maximumExactQuestionRepetition": 3,
  "repeatedQuestionExamples": [
    "3x After multiplying 520 and 575, how many zeros will appear at the end of the result?",
    "3x Calculate the trailing zeros in the product of 1953125 and 16384.",
    "3x Find the number of terminal zeros in the product of 512 and 15625.",
    "3x If 390 is multiplied by 520, how many trailing zeros will the product contain?",
    "2x After multiplying 280 and 255, how many zeros will appear at the end of the result?",
    "2x After multiplying 3125 and 32768, how many zeros will appear at the end of the result?",
    "2x After multiplying 315 and 930, how many zeros will appear at the end of the result?",
    "2x After multiplying 65 and 130, how many zeros will appear at the end of the result?",
    "2x Calculate the trailing zeros in the product of 1024 and 125.",
    "2x Calculate the trailing zeros in the product of 510 and 580."
  ],
  "difficultyDistribution": {
    "Hard": 102,
    "Easy": 193,
    "Medium": 205
  },
  "canonicalProblemDistribution": {
    "CP-005": 500
  },
  "questionLanguageDistribution": {
    "QL-039": 63,
    "QL-024": 63,
    "QL-037": 63,
    "QL-022": 63,
    "QL-025": 62,
    "QL-038": 62,
    "QL-023": 62,
    "QL-026": 62
  },
  "explanationDistribution": {
    "ES-005": 500
  },
  "nBucketCoverage": {
    "not-applicable": 500
  },
  "largestPowerOfFiveReachedCoverage": {
    "below25": 500
  },
  "expressionTypeCoverage": {
    "not-applicable": 500
  },
  "factorialTermCountCoverage": {
    "not-applicable": 500
  },
  "targetZeroBucketCoverage": {
    "not-applicable": 500
  },
  "searchIterationsCoverage": {
    "not-applicable": 500
  },
  "baseFactorizationTypeCoverage": {
    "not-applicable": 500
  },
  "powerMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productTypeCoverage": {
    "productNoZeroChange": 91,
    "productCreatesZeros": 215,
    "productAddsZeros": 194
  },
  "twoCountCoverage": {
    "small": 171,
    "large": 106,
    "medium": 164,
    "zero": 59
  },
  "fiveCountCoverage": {
    "zero": 75,
    "medium": 242,
    "small": 183
  },
  "pairCountCoverage": {
    "zero": 91,
    "medium": 183,
    "small": 226
  },
  "mathJaxUsage": {
    "productFactorizationLatex": 500
  },
  "topRepeatedQuestions": [
    {
      "stem": "After multiplying 520 and 575, how many zeros will appear at the end of the result?",
      "count": 3
    },
    {
      "stem": "Calculate the trailing zeros in the product of 1953125 and 16384.",
      "count": 3
    },
    {
      "stem": "Find the number of terminal zeros in the product of 512 and 15625.",
      "count": 3
    },
    {
      "stem": "If 390 is multiplied by 520, how many trailing zeros will the product contain?",
      "count": 3
    },
    {
      "stem": "After multiplying 280 and 255, how many zeros will appear at the end of the result?",
      "count": 2
    },
    {
      "stem": "After multiplying 3125 and 32768, how many zeros will appear at the end of the result?",
      "count": 2
    },
    {
      "stem": "After multiplying 315 and 930, how many zeros will appear at the end of the result?",
      "count": 2
    },
    {
      "stem": "After multiplying 65 and 130, how many zeros will appear at the end of the result?",
      "count": 2
    },
    {
      "stem": "Calculate the trailing zeros in the product of 1024 and 125.",
      "count": 2
    },
    {
      "stem": "Calculate the trailing zeros in the product of 510 and 580.",
      "count": 2
    }
  ],
  "factorialMagnitudeCoverage": {
    "not-applicable": 500
  },
  "factorialStructureCoverage": {
    "not-applicable": 500
  },
  "targetZeroMagnitudeCoverage": {
    "not-applicable": 500
  },
  "baseFamilyCoverage": {
    "not-applicable": 500
  },
  "exponentMagnitudeCoverage": {
    "not-applicable": 500
  },
  "productStructureCoverage": {
    "largePrimeNoise": 112,
    "oneSideProvidesFives": 103,
    "alreadyHasZeros": 88,
    "bothSidesProvidePairs": 95,
    "oneSideProvidesTwos": 102
  }
}
```
