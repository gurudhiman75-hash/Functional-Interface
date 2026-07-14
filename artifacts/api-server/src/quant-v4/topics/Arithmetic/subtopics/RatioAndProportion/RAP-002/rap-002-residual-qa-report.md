# RAP-002 Residual QA Report

Reviewed commit: `8450deef2e06cc9e031b6d3221b7e54d226199b1`
Reviewed date: `2026-07-11`

## Current Results

```json
{
  "questionCount": 1000,
  "cpDistribution": {
    "RAP-CP-007": 166,
    "RAP-CP-008": 167,
    "RAP-CP-009": 167,
    "RAP-CP-010": 167,
    "RAP-CP-011": 167,
    "RAP-CP-012": 166
  },
  "qlDistribution": {
    "RAP-QL-201": 7,
    "RAP-QL-202": 11,
    "RAP-QL-203": 8,
    "RAP-QL-204": 6,
    "RAP-QL-205": 14,
    "RAP-QL-206": 7,
    "RAP-QL-207": 8,
    "RAP-QL-208": 8,
    "RAP-QL-209": 11,
    "RAP-QL-210": 11,
    "RAP-QL-211": 10,
    "RAP-QL-212": 9,
    "RAP-QL-213": 9,
    "RAP-QL-214": 11,
    "RAP-QL-217": 11,
    "RAP-QL-218": 13,
    "RAP-QL-219": 12,
    "RAP-QL-301": 9,
    "RAP-QL-302": 15,
    "RAP-QL-303": 13,
    "RAP-QL-304": 16,
    "RAP-QL-305": 11,
    "RAP-QL-306": 24,
    "RAP-QL-307": 17,
    "RAP-QL-308": 23,
    "RAP-QL-309": 8,
    "RAP-QL-310": 16,
    "RAP-QL-311": 15,
    "RAP-QL-401": 1,
    "RAP-QL-402": 6,
    "RAP-QL-403": 6,
    "RAP-QL-404": 6,
    "RAP-QL-405": 3,
    "RAP-QL-406": 3,
    "RAP-QL-410": 3,
    "RAP-QL-411": 3,
    "RAP-QL-412": 4,
    "RAP-QL-413": 6,
    "RAP-QL-414": 7,
    "RAP-QL-415": 6,
    "RAP-QL-416": 9,
    "RAP-QL-417": 6,
    "RAP-QL-418": 8,
    "RAP-QL-419": 10,
    "RAP-QL-420": 10,
    "RAP-QL-421": 6,
    "RAP-QL-422": 8,
    "RAP-QL-423": 9,
    "RAP-QL-424": 6,
    "RAP-QL-425": 9,
    "RAP-QL-426": 11,
    "RAP-QL-427": 4,
    "RAP-QL-428": 7,
    "RAP-QL-429": 10,
    "RAP-QL-501": 17,
    "RAP-QL-502": 20,
    "RAP-QL-503": 18,
    "RAP-QL-504": 23,
    "RAP-QL-505": 11,
    "RAP-QL-506": 28,
    "RAP-QL-509": 19,
    "RAP-QL-512": 18,
    "RAP-QL-518": 13,
    "RAP-QL-601": 6,
    "RAP-QL-602": 4,
    "RAP-QL-603": 7,
    "RAP-QL-604": 6,
    "RAP-QL-605": 4,
    "RAP-QL-606": 9,
    "RAP-QL-607": 5,
    "RAP-QL-609": 5,
    "RAP-QL-610": 3,
    "RAP-QL-611": 5,
    "RAP-QL-612": 10,
    "RAP-QL-613": 5,
    "RAP-QL-614": 1,
    "RAP-QL-615": 5,
    "RAP-QL-616": 4,
    "RAP-QL-617": 4,
    "RAP-QL-618": 8,
    "RAP-QL-619": 7,
    "RAP-QL-620": 5,
    "RAP-QL-621": 6,
    "RAP-QL-622": 3,
    "RAP-QL-623": 5,
    "RAP-QL-624": 10,
    "RAP-QL-625": 8,
    "RAP-QL-626": 7,
    "RAP-QL-627": 4,
    "RAP-QL-628": 9,
    "RAP-QL-629": 5,
    "RAP-QL-630": 7,
    "RAP-QL-701": 27,
    "RAP-QL-702": 25,
    "RAP-QL-703": 16,
    "RAP-QL-704": 14,
    "RAP-QL-705": 16,
    "RAP-QL-706": 9,
    "RAP-QL-707": 14,
    "RAP-QL-709": 16,
    "RAP-QL-711": 9,
    "RAP-QL-718": 20
  },
  "taskDistribution": {
    "chainAlignment": 75,
    "chainEquivalence": 54,
    "chainInequality": 46,
    "chainOrdering": 66,
    "combinedInverseChain": 60,
    "conditionalDistribution": 59,
    "constrainedReverseChain": 66,
    "extendedChainAlignment": 48,
    "inverseChainSpeed": 29,
    "inverseChainWork": 73,
    "missingChainRatio": 43,
    "nestedPartition": 56,
    "reconstructOriginalRatio": 60,
    "reverseEndpointFinding": 37,
    "reverseMiddleFinding": 64,
    "sdtTimeRatioFromSpeedDistance": 5,
    "successiveRatioChange": 71,
    "transferTracking": 36,
    "weightedNestedPartition": 52
  },
  "answerTypeDistribution": {
    "COUNT": 479,
    "LOGIC": 175,
    "RATIO": 346
  },
  "difficultyDistribution": {
    "Hard": 517,
    "Medium": 483
  },
  "unusedQlCount": 0,
  "unusedTaskKindCount": 0,
  "unreachableRegistryEntryCount": 0,
  "duplicateStemGroupCount": 27,
  "exactDuplicateStemGroupCount": 0,
  "sameQlRepeatedStemGroupCount": 27,
  "duplicateStemQuestionCount": 61,
  "duplicateStemExamples": [
    {
      "stem": "if 18 men complete a work in 24 days, how many days will 27 men take to complete the same work?",
      "questions": [
        7,
        487,
        559
      ]
    },
    {
      "stem": "check whether the given ratio statement is equivalent after simplification: 108:180 and 432:720.",
      "questions": [
        36,
        618
      ]
    },
    {
      "stem": "if 12 men complete a work in 16 days, how many days will 24 men take to complete the same work?",
      "questions": [
        55,
        961
      ]
    },
    {
      "stem": "if 10 men complete a work in 18 days, how many days will 20 men take to complete the same work?",
      "questions": [
        67,
        799,
        931
      ]
    },
    {
      "stem": "two teams finish the same work. their worker counts are in the ratio 6:6, and their days are in the ratio 5:4. find the ratio of their efficiencies.",
      "questions": [
        85,
        913
      ]
    }
  ],
  "grammarIssueCount": 0,
  "semanticCompatibilityIssueCount": 0,
  "unresolvedPlaceholderCount": 0,
  "nanUndefinedNullCount": 0,
  "invalidCorrectIndexCount": 0,
  "duplicateNormalizedOptionCount": 0,
  "weakOptionCount": 0,
  "metadataLanguageMismatchCount": 0,
  "validationFailureCount": 0,
  "invalidAnswerFormatCount": 0,
  "genericInternalExplanationCount": 0,
  "genericExplanationCount": 0,
  "shortExplanationCount": 0,
  "missingMethodReasonCount": 0,
  "missingIntermediateStepCount": 0,
  "repeatedExplanationShellCount": 0,
  "fractionalCountAnswerCount": 0,
  "fractionalCountExamples": [],
  "negativeValueCount": 0,
  "zeroDenominatorCount": 0,
  "invalidPercentageCount": 0,
  "invalidAgeCount": 0,
  "unrealisticAgeCount": 0,
  "invalidElectionCount": 0,
  "invalidPopulationGridCount": 0,
  "invalidMixtureTargetCount": 0,
  "invalidReplacementCount": 0,
  "invalidGeometryRootCount": 0,
  "unsupportedLanguageExposureCount": 0,
  "chainInequalityTieRiskCount": 0,
  "extendedTargetMismatchCount": 0,
  "logicAnswerDistribution": {
    "A > B > C": 7,
    "A > C > B": 4,
    "A": 8,
    "B > A > C": 2,
    "B > C > A": 3,
    "C > A > B": 4,
    "C > B > A": 7,
    "C": 24,
    "Car A > Car B > Car C": 4,
    "D > C > B > A": 14,
    "Equivalent": 19,
    "Group A > Group B > Group C > Group D": 1,
    "Group A > Group B > Group D > Group C": 2,
    "Group A > Group C > Group D > Group B": 1,
    "Group B > Group A > Group D > Group C": 3,
    "Group B > Group C > Group D > Group A": 2,
    "Group B": 11,
    "Group C > Group A > Group B > Group D": 1,
    "Group C > Group B > Group A > Group D": 1,
    "Group C > Group D > Group A > Group B": 2,
    "Group C > Group D > Group B > Group A": 1,
    "Group D > Group A > Group C > Group B": 6,
    "Group D > Group C > Group A > Group B": 4,
    "Group D > Group C > Group B > Group A": 1,
    "Group D": 3,
    "Not equivalent": 35,
    "Team B": 5
  },
  "equivalenceAnswerDistribution": {
    "Equivalent": 19,
    "Not equivalent": 35
  }
}
```

## Duplicate Classification

- Cross-QL exact duplicate stem groups: `0` (blocker).
- Same-QL repeated parameter draws: `27` groups (generator-diversity debt; manually classified, not duplicate QLs).
