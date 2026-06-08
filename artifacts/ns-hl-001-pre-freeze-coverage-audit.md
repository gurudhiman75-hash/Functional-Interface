# NS-HL-001 Pre-Freeze Coverage Audit

Audit type: pre-freeze coverage audit.
Questions audited: 500 per CP, 3000 total.
Verdict: READY FOR HUMAN FREEZE REVIEW

## Required Coverage Categories

- difficulty
- cpFamily
- operandSize
- quotientSize
- coprimeMultiplierCount
- validityType
- ratioType
- pairPolicy
- conditionType
- questionLanguageId
- explanationId
- mathJaxUsage

## Per-CP Coverage

**CP-001**

```json
{
  "difficultyDistribution": {
    "Hard": 112,
    "Medium": 195,
    "Easy": 193
  },
  "canonicalProblemDistribution": {
    "CP-001": 500
  },
  "cpFamilyDistribution": {
    "findProduct": 314,
    "findLcm": 85,
    "findHcf": 101
  },
  "operandSizeCoverage": {
    "small": 500
  },
  "quotientSizeCoverage": {
    "small": 314,
    "not-applicable": 186
  },
  "coprimeMultiplierCountCoverage": {
    "0": 186,
    "2": 314
  },
  "validityTypeCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "ratioReductionCoverage": {
    "not-applicable": 500
  },
  "pairPolicyCoverage": {
    "not-applicable": 500
  },
  "pairCountCaseCoverage": {
    "not-applicable": 500
  },
  "conditionTypeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-002": 110,
    "QL-004": 85,
    "QL-005": 101,
    "QL-003": 98,
    "QL-001": 106
  },
  "explanationDistribution": {
    "ES-001": 500
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
**CP-002**

```json
{
  "difficultyDistribution": {
    "Hard": 104,
    "Medium": 202,
    "Easy": 194
  },
  "canonicalProblemDistribution": {
    "CP-002": 500
  },
  "cpFamilyDistribution": {
    "not-applicable": 500
  },
  "operandSizeCoverage": {
    "small": 500
  },
  "quotientSizeCoverage": {
    "not-applicable": 220,
    "small": 280
  },
  "coprimeMultiplierCountCoverage": {
    "0": 220,
    "2": 280
  },
  "validityTypeCoverage": {
    "hcfDoesNotDivideLcm": 220,
    "validAllChecksPass": 249,
    "productRelationFailure": 17,
    "numberConsistencyFailure": 14
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "ratioReductionCoverage": {
    "not-applicable": 500
  },
  "pairPolicyCoverage": {
    "not-applicable": 500
  },
  "pairCountCaseCoverage": {
    "not-applicable": 500
  },
  "conditionTypeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-009": 97,
    "QL-006": 88,
    "QL-007": 102,
    "QL-008": 104,
    "QL-010": 109
  },
  "explanationDistribution": {
    "ES-003": 251,
    "ES-002": 249
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
**CP-003**

```json
{
  "difficultyDistribution": {
    "Medium": 185,
    "Easy": 217,
    "Hard": 98
  },
  "canonicalProblemDistribution": {
    "CP-003": 500
  },
  "cpFamilyDistribution": {
    "not-applicable": 500
  },
  "operandSizeCoverage": {
    "small": 500
  },
  "quotientSizeCoverage": {
    "small": 332,
    "medium": 168
  },
  "coprimeMultiplierCountCoverage": {
    "2": 500
  },
  "validityTypeCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "ratioReductionCoverage": {
    "not-applicable": 500
  },
  "pairPolicyCoverage": {
    "not-applicable": 500
  },
  "pairCountCaseCoverage": {
    "not-applicable": 500
  },
  "conditionTypeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-014": 125,
    "QL-013": 125,
    "QL-012": 125,
    "QL-011": 125
  },
  "explanationDistribution": {
    "ES-004": 500
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
**CP-004**

```json
{
  "difficultyDistribution": {
    "Medium": 194,
    "Easy": 208,
    "Hard": 98
  },
  "canonicalProblemDistribution": {
    "CP-004": 500
  },
  "cpFamilyDistribution": {
    "directPairCondition": 126,
    "sumCondition": 126,
    "rangeCondition": 124,
    "differenceCondition": 124
  },
  "operandSizeCoverage": {
    "medium": 500
  },
  "quotientSizeCoverage": {
    "small": 126,
    "medium": 374
  },
  "coprimeMultiplierCountCoverage": {
    "1": 126,
    "4": 374
  },
  "validityTypeCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "ratioReductionCoverage": {
    "not-applicable": 500
  },
  "pairPolicyCoverage": {
    "not-applicable": 500
  },
  "pairCountCaseCoverage": {
    "not-applicable": 500
  },
  "conditionTypeCoverage": {
    "directPairCondition": 126,
    "sumCondition": 126,
    "rangeCondition": 124,
    "differenceCondition": 124
  },
  "questionLanguageDistribution": {
    "QL-019": 63,
    "QL-016": 63,
    "QL-021": 62,
    "QL-018": 62,
    "QL-015": 63,
    "QL-020": 63,
    "QL-017": 62,
    "QL-022": 62
  },
  "explanationDistribution": {
    "ES-005": 500
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
**CP-005**

```json
{
  "difficultyDistribution": {
    "Hard": 107,
    "Medium": 195,
    "Easy": 198
  },
  "canonicalProblemDistribution": {
    "CP-005": 500
  },
  "cpFamilyDistribution": {
    "unorderedPairs": 406,
    "orderedPairs": 94
  },
  "operandSizeCoverage": {
    "small": 500
  },
  "quotientSizeCoverage": {
    "small": 250,
    "medium": 250
  },
  "coprimeMultiplierCountCoverage": {
    "1": 250,
    "4": 250
  },
  "validityTypeCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "not-applicable": 500
  },
  "ratioReductionCoverage": {
    "not-applicable": 500
  },
  "pairPolicyCoverage": {
    "unorderedPairs": 406,
    "orderedPairs": 94
  },
  "pairCountCaseCoverage": {
    "singlePairCase": 250,
    "multiplePairCase": 250
  },
  "conditionTypeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-024": 95,
    "QL-023": 100,
    "QL-025": 121,
    "QL-027": 90,
    "QL-026": 94
  },
  "explanationDistribution": {
    "ES-006": 500
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
**CP-006**

```json
{
  "difficultyDistribution": {
    "Easy": 199,
    "Medium": 210,
    "Hard": 91
  },
  "canonicalProblemDistribution": {
    "CP-006": 500
  },
  "cpFamilyDistribution": {
    "ratioPlusHcfPlusLcm": 157,
    "ratioPlusLcm": 169,
    "ratioPlusHcf": 174
  },
  "operandSizeCoverage": {
    "small": 157,
    "not-applicable": 343
  },
  "quotientSizeCoverage": {
    "small": 157,
    "not-applicable": 343
  },
  "coprimeMultiplierCountCoverage": {
    "0": 343,
    "2": 157
  },
  "validityTypeCoverage": {
    "not-applicable": 500
  },
  "ratioTypeCoverage": {
    "ratioPlusHcfPlusLcm": 157,
    "ratioPlusLcm": 169,
    "ratioPlusHcf": 174
  },
  "ratioReductionCoverage": {
    "reducibleRatio": 324,
    "alreadyReducedRatio": 176
  },
  "pairPolicyCoverage": {
    "not-applicable": 500
  },
  "pairCountCaseCoverage": {
    "not-applicable": 500
  },
  "conditionTypeCoverage": {
    "not-applicable": 500
  },
  "questionLanguageDistribution": {
    "QL-032": 74,
    "QL-031": 92,
    "QL-033": 83,
    "QL-028": 99,
    "QL-030": 77,
    "QL-029": 75
  },
  "explanationDistribution": {
    "ES-007": 500
  },
  "mathJaxUsage": {
    "productRelationLatex": 500,
    "divisibilityCheckLatex": 500,
    "productRelationCheckLatex": 500,
    "missingNumberFormulaLatex": 500,
    "hcfVerificationLatex": 500,
    "lcmVerificationLatex": 500,
    "quotientLatex": 500,
    "factorPairListLatex": 500,
    "coprimePairFilterLatex": 500,
    "conditionFilterLatex": 500,
    "reconstructedPairLatex": 500,
    "factorPairCountLatex": 500,
    "orderedPairPolicyLatex": 500,
    "unorderedPairPolicyLatex": 500,
    "ratioReductionLatex": 500,
    "ratioMultiplierLatex": 500,
    "hcfMultiplierLatex": 500,
    "lcmMultiplierLatex": 500,
    "consistencyCheckLatex": 500
  }
}
```
