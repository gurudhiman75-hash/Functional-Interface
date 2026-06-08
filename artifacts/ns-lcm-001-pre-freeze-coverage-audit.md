# NS-LCM-001 Pre-Freeze Coverage Audit

Audit type: pre-freeze coverage audit.
Questions audited: 1000 per CP, 5000 total.
Verdict: READY FOR HUMAN FREEZE REVIEW

## Required Coverage Categories

- difficulty
- CP
- question language IDs
- explanation IDs
- operand count
- pairwise coprime and non-coprime numbers
- LCM size
- distinct prime base count
- maximum exponent
- cycle context families
- CP-003 families
- exact LCM match
- range width and zero/positive count cases
- threshold multiple and non-multiple cases
- MathJax objects

## Per-CP Coverage

**CP-001**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 410,
    "Medium": 394,
    "Hard": 196
  },
  "questionLanguageDistribution": {
    "QL-001": 206,
    "QL-002": 168,
    "QL-003": 216,
    "QL-005": 198,
    "QL-004": 212
  },
  "explanationDistribution": {
    "ES-001": 1000
  },
  "operandCountCoverage": {
    "2": 308,
    "3": 589,
    "4": 103
  },
  "pairwiseCoprimeCoverage": {
    "true": 207,
    "false": 793
  },
  "nonCoprimeCoverage": {
    "false": 207,
    "true": 793
  },
  "lcmSizeCoverage": {
    "small": 410,
    "medium": 428,
    "large": 162
  },
  "distinctPrimeBaseCountCoverage": {
    "2": 424,
    "3": 540,
    "4": 36
  },
  "maximumExponentCoverage": {
    "1": 221,
    "2": 334,
    "3": 211,
    "4": 110,
    "6": 82,
    "7": 42
  },
  "cycleContextCoverage": {
    "not-applicable": 1000
  },
  "cp003FamilyCoverage": {
    "not-applicable": 1000
  },
  "rangeWidthCoverage": {
    "not-applicable": 1000
  },
  "zeroCountCaseCoverage": {
    "not-applicable": 1000
  },
  "positiveCountCaseCoverage": {
    "not-applicable": 1000
  },
  "thresholdIsMultipleCoverage": {
    "not-applicable": 1000
  },
  "thresholdNotMultipleCoverage": {
    "not-applicable": 1000
  },
  "exactLcmMatchCoverage": {
    "not-applicable": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "primeUnionLatex": 1000,
    "maximumExponentSelectionLatex": 1000,
    "lcmLatex": 1000,
    "synchronizationInterpretationLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "rangeCountFormulaLatex": 1000,
    "thresholdSelectionFormulaLatex": 1000
  }
}
```
**CP-002**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 404,
    "Easy": 392,
    "Hard": 204
  },
  "questionLanguageDistribution": {
    "QL-010": 102,
    "QL-026": 106,
    "QL-008": 95,
    "QL-009": 107,
    "QL-027": 110,
    "QL-007": 103,
    "QL-006": 108,
    "QL-024": 97,
    "QL-025": 85,
    "QL-028": 87
  },
  "explanationDistribution": {
    "ES-002": 1000
  },
  "operandCountCoverage": {
    "3": 1000
  },
  "pairwiseCoprimeCoverage": {
    "false": 1000
  },
  "nonCoprimeCoverage": {
    "true": 1000
  },
  "lcmSizeCoverage": {
    "small": 420,
    "medium": 580
  },
  "distinctPrimeBaseCountCoverage": {
    "2": 391,
    "3": 609
  },
  "maximumExponentCoverage": {
    "2": 609,
    "3": 391
  },
  "cycleContextCoverage": {
    "machines": 102,
    "traffic_signals": 106,
    "alarms": 95,
    "runners": 107,
    "sprinklers": 110,
    "lights": 103,
    "bells": 108,
    "buses": 97,
    "trains": 85,
    "cleaning_schedules": 87
  },
  "cp003FamilyCoverage": {
    "not-applicable": 1000
  },
  "rangeWidthCoverage": {
    "not-applicable": 1000
  },
  "zeroCountCaseCoverage": {
    "not-applicable": 1000
  },
  "positiveCountCaseCoverage": {
    "not-applicable": 1000
  },
  "thresholdIsMultipleCoverage": {
    "not-applicable": 1000
  },
  "thresholdNotMultipleCoverage": {
    "not-applicable": 1000
  },
  "exactLcmMatchCoverage": {
    "not-applicable": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "primeUnionLatex": 1000,
    "maximumExponentSelectionLatex": 1000,
    "lcmLatex": 1000,
    "synchronizationInterpretationLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "rangeCountFormulaLatex": 1000,
    "thresholdSelectionFormulaLatex": 1000
  }
}
```
**CP-003**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 413,
    "Hard": 179,
    "Medium": 408
  },
  "questionLanguageDistribution": {
    "QL-012": 250,
    "QL-011": 250,
    "QL-014": 250,
    "QL-013": 250
  },
  "explanationDistribution": {
    "ES-003": 1000
  },
  "operandCountCoverage": {
    "2": 1000
  },
  "pairwiseCoprimeCoverage": {
    "false": 1000
  },
  "nonCoprimeCoverage": {
    "true": 1000
  },
  "lcmSizeCoverage": {
    "small": 750,
    "medium": 250
  },
  "distinctPrimeBaseCountCoverage": {
    "3": 1000
  },
  "maximumExponentCoverage": {
    "2": 750,
    "3": 250
  },
  "cycleContextCoverage": {
    "not-applicable": 1000
  },
  "cp003FamilyCoverage": {
    "bounded_range": 250,
    "candidate_list": 250,
    "arithmetic_condition": 250,
    "divisibility_condition": 250
  },
  "rangeWidthCoverage": {
    "not-applicable": 1000
  },
  "zeroCountCaseCoverage": {
    "not-applicable": 1000
  },
  "positiveCountCaseCoverage": {
    "not-applicable": 1000
  },
  "thresholdIsMultipleCoverage": {
    "not-applicable": 1000
  },
  "thresholdNotMultipleCoverage": {
    "not-applicable": 1000
  },
  "exactLcmMatchCoverage": {
    "true": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "primeUnionLatex": 1000,
    "maximumExponentSelectionLatex": 1000,
    "lcmLatex": 1000,
    "synchronizationInterpretationLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "rangeCountFormulaLatex": 1000,
    "thresholdSelectionFormulaLatex": 1000
  }
}
```
**CP-004**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 392,
    "Easy": 399,
    "Hard": 209
  },
  "questionLanguageDistribution": {
    "QL-018": 251,
    "QL-019": 251,
    "QL-016": 249,
    "QL-017": 249
  },
  "explanationDistribution": {
    "ES-004": 1000
  },
  "operandCountCoverage": {
    "2": 500,
    "3": 500
  },
  "pairwiseCoprimeCoverage": {
    "false": 1000
  },
  "nonCoprimeCoverage": {
    "true": 1000
  },
  "lcmSizeCoverage": {
    "small": 500,
    "medium": 500
  },
  "distinctPrimeBaseCountCoverage": {
    "2": 500,
    "3": 500
  },
  "maximumExponentCoverage": {
    "3": 1000
  },
  "cycleContextCoverage": {
    "not-applicable": 1000
  },
  "cp003FamilyCoverage": {
    "not-applicable": 1000
  },
  "rangeWidthCoverage": {
    "medium": 1000
  },
  "zeroCountCaseCoverage": {
    "false": 1000
  },
  "positiveCountCaseCoverage": {
    "true": 1000
  },
  "thresholdIsMultipleCoverage": {
    "not-applicable": 1000
  },
  "thresholdNotMultipleCoverage": {
    "not-applicable": 1000
  },
  "exactLcmMatchCoverage": {
    "not-applicable": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "primeUnionLatex": 1000,
    "maximumExponentSelectionLatex": 1000,
    "lcmLatex": 1000,
    "synchronizationInterpretationLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "rangeCountFormulaLatex": 1000,
    "thresholdSelectionFormulaLatex": 1000
  }
}
```
**CP-005**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 394,
    "Medium": 397,
    "Hard": 209
  },
  "questionLanguageDistribution": {
    "QL-023": 210,
    "QL-020": 192,
    "QL-021": 221,
    "QL-029": 192,
    "QL-022": 185
  },
  "explanationDistribution": {
    "ES-005": 1000
  },
  "operandCountCoverage": {
    "2": 727,
    "3": 273
  },
  "pairwiseCoprimeCoverage": {
    "false": 1000
  },
  "nonCoprimeCoverage": {
    "true": 1000
  },
  "lcmSizeCoverage": {
    "small": 757,
    "medium": 243
  },
  "distinctPrimeBaseCountCoverage": {
    "2": 469,
    "3": 531
  },
  "maximumExponentCoverage": {
    "1": 258,
    "2": 273,
    "3": 469
  },
  "cycleContextCoverage": {
    "not-applicable": 1000
  },
  "cp003FamilyCoverage": {
    "not-applicable": 1000
  },
  "rangeWidthCoverage": {
    "not-applicable": 1000
  },
  "zeroCountCaseCoverage": {
    "not-applicable": 1000
  },
  "positiveCountCaseCoverage": {
    "not-applicable": 1000
  },
  "thresholdIsMultipleCoverage": {
    "true": 531,
    "false": 469
  },
  "thresholdNotMultipleCoverage": {
    "false": 531,
    "true": 469
  },
  "exactLcmMatchCoverage": {
    "not-applicable": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "primeUnionLatex": 1000,
    "maximumExponentSelectionLatex": 1000,
    "lcmLatex": 1000,
    "synchronizationInterpretationLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "rangeCountFormulaLatex": 1000,
    "thresholdSelectionFormulaLatex": 1000
  }
}
```
