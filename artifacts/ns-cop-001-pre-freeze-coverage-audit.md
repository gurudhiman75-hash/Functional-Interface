# NS-COP-001 Pre-Freeze Coverage Audit

Audit type: pre-freeze coverage audit.
Questions audited: 500 per CP, 3000 total.
Verdict: READY FOR HUMAN FREEZE REVIEW

## Required Coverage Categories

- difficulty
- canonicalProblemId
- questionLanguageId
- explanationId
- cp001AnswerType
- coprimeStatus
- hcfBucket
- commonFactorBucket
- listLength
- coprimeDensity
- candidateCount
- distractorCount
- setSize
- pairCount
- ratioType
- hcfSize
- mathJaxUsage

## Per-CP Coverage

**CP-001**

```json
{
  "difficultyDistribution": {
    "Easy": 190,
    "Hard": 108,
    "Medium": 202
  },
  "canonicalProblemDistribution": {
    "CP-001": 500
  },
  "cp001AnswerTypeCoverage": {
    "commonFactorCount": 112,
    "categorySelection": 162,
    "hcfValue": 136,
    "coprimeClassification": 90
  },
  "coprimeStatusCoverage": {
    "notCoprime": 210,
    "coprime": 290
  },
  "hcfBucketCoverage": {
    "smallHcf": 210,
    "hcfEquals1": 290
  },
  "commonFactorBucketCoverage": {
    "manyCommonFactors": 135,
    "oneCommonFactor": 290,
    "fewCommonFactors": 75
  },
  "listLengthCoverage": {
    "not-applicable": 500
  },
  "coprimeDensityCoverage": {
    "not-applicable": 500
  },
  "candidateCountCoverage": {
    "not-applicable": 500
  },
  "distractorCountCoverage": {
    "not-applicable": 500
  },
  "setSizeCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "hcfSizeCoverage": {
    "small": 210,
    "one": 290
  },
  "questionLanguageDistribution": {
    "QL-030": 64,
    "QL-005": 52,
    "QL-032": 51,
    "QL-029": 44,
    "QL-002": 45,
    "QL-006": 43,
    "QL-003": 48,
    "QL-031": 59,
    "QL-001": 47,
    "QL-004": 47
  },
  "explanationDistribution": {
    "ES-001": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
**CP-002**

```json
{
  "difficultyDistribution": {
    "Easy": 194,
    "Hard": 108,
    "Medium": 198
  },
  "canonicalProblemDistribution": {
    "CP-002": 500
  },
  "cp001AnswerTypeCoverage": {
    "not-applicable": 500
  },
  "coprimeStatusCoverage": {
    "notCoprime": 500
  },
  "hcfBucketCoverage": {
    "not-applicable": 500
  },
  "commonFactorBucketCoverage": {
    "oneCommonFactor": 500
  },
  "listLengthCoverage": {
    "shortList": 179,
    "mediumList": 169,
    "longList": 152
  },
  "coprimeDensityCoverage": {
    "medium": 500
  },
  "candidateCountCoverage": {
    "not-applicable": 500
  },
  "distractorCountCoverage": {
    "not-applicable": 500
  },
  "setSizeCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "hcfSizeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-035": 64,
    "QL-008": 65,
    "QL-033": 68,
    "QL-034": 80,
    "QL-007": 70,
    "QL-009": 76,
    "QL-010": 77
  },
  "explanationDistribution": {
    "ES-002": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
**CP-003**

```json
{
  "difficultyDistribution": {
    "Easy": 217,
    "Hard": 98,
    "Medium": 185
  },
  "canonicalProblemDistribution": {
    "CP-003": 500
  },
  "cp001AnswerTypeCoverage": {
    "not-applicable": 500
  },
  "coprimeStatusCoverage": {
    "notCoprime": 500
  },
  "hcfBucketCoverage": {
    "not-applicable": 500
  },
  "commonFactorBucketCoverage": {
    "oneCommonFactor": 500
  },
  "listLengthCoverage": {
    "not-applicable": 500
  },
  "coprimeDensityCoverage": {
    "not-applicable": 500
  },
  "candidateCountCoverage": {
    "4": 500
  },
  "distractorCountCoverage": {
    "3": 500
  },
  "setSizeCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "hcfSizeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-014": 81,
    "QL-012": 103,
    "QL-015": 114,
    "QL-011": 114,
    "QL-013": 88
  },
  "explanationDistribution": {
    "ES-003": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
**CP-004**

```json
{
  "difficultyDistribution": {
    "Easy": 198,
    "Hard": 109,
    "Medium": 193
  },
  "canonicalProblemDistribution": {
    "CP-004": 500
  },
  "cp001AnswerTypeCoverage": {
    "not-applicable": 500
  },
  "coprimeStatusCoverage": {
    "notCoprime": 500
  },
  "hcfBucketCoverage": {
    "not-applicable": 500
  },
  "commonFactorBucketCoverage": {
    "oneCommonFactor": 500
  },
  "listLengthCoverage": {
    "not-applicable": 500
  },
  "coprimeDensityCoverage": {
    "not-applicable": 500
  },
  "candidateCountCoverage": {
    "not-applicable": 500
  },
  "distractorCountCoverage": {
    "not-applicable": 500
  },
  "setSizeCoverage": {
    "largeSet": 126,
    "mediumSet": 126,
    "smallSet": 248
  },
  "pairCountCoverage": {
    "0": 248,
    "3": 126,
    "4": 126
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "hcfSizeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-037": 58,
    "QL-019": 66,
    "QL-018": 66,
    "QL-038": 84,
    "QL-016": 78,
    "QL-036": 69,
    "QL-017": 79
  },
  "explanationDistribution": {
    "ES-004": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
**CP-005**

```json
{
  "difficultyDistribution": {
    "Medium": 187,
    "Easy": 215,
    "Hard": 98
  },
  "canonicalProblemDistribution": {
    "CP-005": 500
  },
  "cp001AnswerTypeCoverage": {
    "not-applicable": 500
  },
  "coprimeStatusCoverage": {
    "coprime": 500
  },
  "hcfBucketCoverage": {
    "hcfEquals1": 500
  },
  "commonFactorBucketCoverage": {
    "oneCommonFactor": 500
  },
  "listLengthCoverage": {
    "not-applicable": 500
  },
  "coprimeDensityCoverage": {
    "not-applicable": 500
  },
  "candidateCountCoverage": {
    "not-applicable": 500
  },
  "distractorCountCoverage": {
    "not-applicable": 500
  },
  "setSizeCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "hcfSizeCoverage": {
    "one": 500
  },
  "questionLanguageDistribution": {
    "QL-021": 125,
    "QL-020": 125,
    "QL-023": 125,
    "QL-022": 125
  },
  "explanationDistribution": {
    "ES-005": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
**CP-006**

```json
{
  "difficultyDistribution": {
    "Hard": 91,
    "Medium": 215,
    "Easy": 194
  },
  "canonicalProblemDistribution": {
    "CP-006": 500
  },
  "cp001AnswerTypeCoverage": {
    "not-applicable": 500
  },
  "coprimeStatusCoverage": {
    "notCoprime": 398,
    "coprime": 102
  },
  "hcfBucketCoverage": {
    "largeHcf": 298,
    "hcfEquals1": 102,
    "smallHcf": 100
  },
  "commonFactorBucketCoverage": {
    "manyCommonFactors": 398,
    "oneCommonFactor": 102
  },
  "listLengthCoverage": {
    "not-applicable": 500
  },
  "coprimeDensityCoverage": {
    "not-applicable": 500
  },
  "candidateCountCoverage": {
    "not-applicable": 500
  },
  "distractorCountCoverage": {
    "not-applicable": 500
  },
  "setSizeCoverage": {
    "not-applicable": 500
  },
  "pairCountCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "equalTerms": 87,
    "alreadyReduced": 102,
    "largeHcf": 102,
    "reducibleMultipleFactors": 109,
    "reducibleOnce": 100
  },
  "hcfSizeCoverage": {
    "large": 298,
    "one": 102,
    "small": 100
  },
  "questionLanguageDistribution": {
    "QL-026": 64,
    "QL-041": 64,
    "QL-024": 64,
    "QL-039": 64,
    "QL-040": 62,
    "QL-027": 62,
    "QL-028": 60,
    "QL-025": 60
  },
  "explanationDistribution": {
    "ES-006": 500
  },
  "mathJaxUsage": {
    "hcfLatex": 500,
    "coprimeCheckLatex": 500,
    "candidateEvaluationLatex": 500,
    "pairEvaluationLatex": 500,
    "consecutivePropertyLatex": 500,
    "ratioReductionLatex": 500
  }
}
```
