# NS-FAC-001 Pre-Freeze Coverage Audit

Audit type: pre-freeze coverage audit.
Questions audited: 1000 per CP, 9000 total.
Verdict: READY FOR HUMAN FREEZE REVIEW

## Required Coverage Categories

- primeInputCoverage
- compositeInputCoverage
- primePowerCoverage
- mixedPrimeCoverage
- perfectSquareCoverage
- nonPerfectSquareCoverage
- highlyCompositeNumberCoverage
- factorCountCoverage
- kCoverage
- positionCoverage
- edgePositionCoverage
- productDigitCountCoverage
- questionLanguageDistribution
- explanationDistribution
- mathJaxObjectCoverage

## Per-CP Coverage

**CP-001**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 402,
    "Easy": 396,
    "Hard": 202
  },
  "primeInputCoverage": {
    "false": 861,
    "true": 139
  },
  "compositeInputCoverage": {
    "true": 861,
    "false": 139
  },
  "primePowerCoverage": {
    "true": 329,
    "false": 671
  },
  "mixedPrimeCoverage": {
    "false": 329,
    "true": 671
  },
  "perfectSquareCoverage": {
    "false": 786,
    "true": 214
  },
  "nonPerfectSquareCoverage": {
    "true": 786,
    "false": 214
  },
  "highlyCompositeNumberCoverage": {
    "false": 787,
    "true": 213
  },
  "factorCountCoverage": {
    "small": 461,
    "medium": 465,
    "large": 74
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "small": 428,
    "medium": 415,
    "very_large": 40,
    "large": 117
  },
  "questionLanguageDistribution": {
    "QL-003": 333,
    "QL-002": 338,
    "QL-001": 329
  },
  "explanationDistribution": {
    "ES-001": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-002**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 410,
    "Hard": 198,
    "Easy": 392
  },
  "primeInputCoverage": {
    "true": 149,
    "false": 851
  },
  "compositeInputCoverage": {
    "false": 149,
    "true": 851
  },
  "primePowerCoverage": {
    "true": 321,
    "false": 679
  },
  "mixedPrimeCoverage": {
    "false": 321,
    "true": 679
  },
  "perfectSquareCoverage": {
    "false": 777,
    "true": 223
  },
  "nonPerfectSquareCoverage": {
    "true": 777,
    "false": 223
  },
  "highlyCompositeNumberCoverage": {
    "false": 814,
    "true": 186
  },
  "factorCountCoverage": {
    "small": 480,
    "medium": 444,
    "large": 76
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "small": 452,
    "medium": 381,
    "very_large": 51,
    "large": 116
  },
  "questionLanguageDistribution": {
    "QL-006": 347,
    "QL-004": 313,
    "QL-005": 340
  },
  "explanationDistribution": {
    "ES-002": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-003**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 399,
    "Medium": 419,
    "Hard": 182
  },
  "primeInputCoverage": {
    "false": 850,
    "true": 150
  },
  "compositeInputCoverage": {
    "true": 850,
    "false": 150
  },
  "primePowerCoverage": {
    "false": 663,
    "true": 337
  },
  "mixedPrimeCoverage": {
    "true": 663,
    "false": 337
  },
  "perfectSquareCoverage": {
    "false": 766,
    "true": 234
  },
  "nonPerfectSquareCoverage": {
    "true": 766,
    "false": 234
  },
  "highlyCompositeNumberCoverage": {
    "true": 207,
    "false": 793
  },
  "factorCountCoverage": {
    "medium": 458,
    "small": 484,
    "large": 58
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "medium": 390,
    "small": 458,
    "very_large": 37,
    "large": 115
  },
  "questionLanguageDistribution": {
    "QL-008": 345,
    "QL-007": 312,
    "QL-009": 343
  },
  "explanationDistribution": {
    "ES-003": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-004**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 394,
    "Medium": 403,
    "Hard": 203
  },
  "primeInputCoverage": {
    "false": 867,
    "true": 133
  },
  "compositeInputCoverage": {
    "true": 867,
    "false": 133
  },
  "primePowerCoverage": {
    "false": 671,
    "true": 329
  },
  "mixedPrimeCoverage": {
    "true": 671,
    "false": 329
  },
  "perfectSquareCoverage": {
    "false": 777,
    "true": 223
  },
  "nonPerfectSquareCoverage": {
    "true": 777,
    "false": 223
  },
  "highlyCompositeNumberCoverage": {
    "false": 817,
    "true": 183
  },
  "factorCountCoverage": {
    "small": 488,
    "medium": 433,
    "large": 79
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "small": 450,
    "medium": 398,
    "very_large": 40,
    "large": 112
  },
  "questionLanguageDistribution": {
    "QL-010": 500,
    "QL-011": 500
  },
  "explanationDistribution": {
    "ES-004": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-005**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 399,
    "Medium": 402,
    "Hard": 199
  },
  "primeInputCoverage": {
    "false": 871,
    "true": 129
  },
  "compositeInputCoverage": {
    "true": 871,
    "false": 129
  },
  "primePowerCoverage": {
    "true": 305,
    "false": 695
  },
  "mixedPrimeCoverage": {
    "false": 305,
    "true": 695
  },
  "perfectSquareCoverage": {
    "true": 226,
    "false": 774
  },
  "nonPerfectSquareCoverage": {
    "false": 226,
    "true": 774
  },
  "highlyCompositeNumberCoverage": {
    "false": 788,
    "true": 212
  },
  "factorCountCoverage": {
    "small": 479,
    "medium": 446,
    "large": 75
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "small": 450,
    "medium": 398,
    "very_large": 46,
    "large": 106
  },
  "questionLanguageDistribution": {
    "QL-012": 500,
    "QL-013": 500
  },
  "explanationDistribution": {
    "ES-005": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-006**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 410,
    "Medium": 402,
    "Hard": 188
  },
  "primeInputCoverage": {
    "false": 864,
    "true": 136
  },
  "compositeInputCoverage": {
    "true": 864,
    "false": 136
  },
  "primePowerCoverage": {
    "false": 689,
    "true": 311
  },
  "mixedPrimeCoverage": {
    "true": 689,
    "false": 311
  },
  "perfectSquareCoverage": {
    "false": 783,
    "true": 217
  },
  "nonPerfectSquareCoverage": {
    "true": 783,
    "false": 217
  },
  "highlyCompositeNumberCoverage": {
    "false": 806,
    "true": 194
  },
  "factorCountCoverage": {
    "small": 484,
    "medium": 439,
    "large": 77
  },
  "kCoverage": {
    "small": 417,
    "medium": 317,
    "large": 266
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "small": 453,
    "medium": 389,
    "very_large": 56,
    "large": 102
  },
  "questionLanguageDistribution": {
    "QL-014": 500,
    "QL-015": 500
  },
  "explanationDistribution": {
    "ES-006": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-007**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Hard": 213,
    "Medium": 405,
    "Easy": 382
  },
  "primeInputCoverage": {
    "false": 872,
    "true": 128
  },
  "compositeInputCoverage": {
    "true": 872,
    "false": 128
  },
  "primePowerCoverage": {
    "false": 698,
    "true": 302
  },
  "mixedPrimeCoverage": {
    "true": 698,
    "false": 302
  },
  "perfectSquareCoverage": {
    "false": 771,
    "true": 229
  },
  "nonPerfectSquareCoverage": {
    "true": 771,
    "false": 229
  },
  "highlyCompositeNumberCoverage": {
    "false": 808,
    "true": 192
  },
  "factorCountCoverage": {
    "large": 78,
    "medium": 446,
    "small": 476
  },
  "kCoverage": {
    "large": 297,
    "medium": 292,
    "small": 411
  },
  "positionCoverage": {
    "not-applicable": 1000
  },
  "edgePositionCoverage": {
    "not-applicable": 1000
  },
  "productDigitCountCoverage": {
    "very_large": 49,
    "medium": 404,
    "small": 438,
    "large": 109
  },
  "questionLanguageDistribution": {
    "QL-016": 500,
    "QL-017": 500
  },
  "explanationDistribution": {
    "ES-007": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-008**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Hard": 191,
    "Easy": 413,
    "Medium": 396
  },
  "primeInputCoverage": {
    "false": 873,
    "true": 127
  },
  "compositeInputCoverage": {
    "true": 873,
    "false": 127
  },
  "primePowerCoverage": {
    "false": 682,
    "true": 318
  },
  "mixedPrimeCoverage": {
    "true": 682,
    "false": 318
  },
  "perfectSquareCoverage": {
    "false": 765,
    "true": 235
  },
  "nonPerfectSquareCoverage": {
    "true": 765,
    "false": 235
  },
  "highlyCompositeNumberCoverage": {
    "false": 802,
    "true": 198
  },
  "factorCountCoverage": {
    "medium": 440,
    "small": 479,
    "large": 81
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "small": 579,
    "medium": 306,
    "large": 115
  },
  "edgePositionCoverage": {
    "first": 203,
    "general": 70,
    "middle": 173,
    "second": 253,
    "last": 148,
    "penultimate": 153
  },
  "productDigitCountCoverage": {
    "large": 104,
    "small": 446,
    "medium": 404,
    "very_large": 46
  },
  "questionLanguageDistribution": {
    "QL-018": 500,
    "QL-019": 500
  },
  "explanationDistribution": {
    "ES-008": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
**CP-009**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 395,
    "Hard": 198,
    "Easy": 407
  },
  "primeInputCoverage": {
    "false": 855,
    "true": 145
  },
  "compositeInputCoverage": {
    "true": 855,
    "false": 145
  },
  "primePowerCoverage": {
    "false": 675,
    "true": 325
  },
  "mixedPrimeCoverage": {
    "true": 675,
    "false": 325
  },
  "perfectSquareCoverage": {
    "false": 783,
    "true": 217
  },
  "nonPerfectSquareCoverage": {
    "true": 783,
    "false": 217
  },
  "highlyCompositeNumberCoverage": {
    "false": 815,
    "true": 185
  },
  "factorCountCoverage": {
    "medium": 443,
    "large": 79,
    "small": 478
  },
  "kCoverage": {
    "not-applicable": 1000
  },
  "positionCoverage": {
    "large": 118,
    "medium": 285,
    "small": 597
  },
  "edgePositionCoverage": {
    "general": 77,
    "middle": 171,
    "penultimate": 123,
    "first": 204,
    "last": 163,
    "second": 262
  },
  "productDigitCountCoverage": {
    "medium": 390,
    "large": 121,
    "very_large": 46,
    "small": 443
  },
  "questionLanguageDistribution": {
    "QL-020": 500,
    "QL-021": 500
  },
  "explanationDistribution": {
    "ES-009": 1000
  },
  "mathJaxObjectCoverage": {
    "primeFactorizationLatex": 1000,
    "factorCountFormulaLatex": 1000,
    "factorSumFormulaLatex": 1000,
    "factorProductFormulaLatex": 1000,
    "factorListLatex": 1000,
    "factorsIncreasingLatex": 1000,
    "factorsDecreasingLatex": 1000,
    "kPrimeFactorizationLatex": 1000,
    "divisibleFactorConstraintLatex": 1000,
    "complementFormulaLatex": 1000,
    "selectedPositionFormulaLatex": 1000,
    "greatestProperFactorFormulaLatex": 1000,
    "perfectSquareRuleLatex": 1000
  }
}
```
