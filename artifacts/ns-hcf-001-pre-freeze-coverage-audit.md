# NS-HCF-001 Pre-Freeze Coverage Audit

Audit type: pre-freeze coverage audit.
Questions audited: 1000 per CP, 4000 total.
Verdict: READY FOR HUMAN FREEZE REVIEW

## Required Coverage Categories

- difficulty
- CP
- question language IDs
- explanation IDs
- CP-003 families
- CP-004 context families
- MathJax objects

## Per-CP Coverage

**CP-001**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Medium": 404,
    "Easy": 389,
    "Hard": 207
  },
  "questionLanguageDistribution": {
    "QL-003": 127,
    "QL-008": 127,
    "QL-001": 125,
    "QL-006": 125,
    "QL-007": 124,
    "QL-004": 124,
    "QL-005": 124,
    "QL-002": 124
  },
  "explanationDistribution": {
    "ES-001": 1000
  },
  "cpFamilyDistribution": {
    "not-applicable": 1000
  },
  "contextFamilyDistribution": {
    "not-applicable": 1000
  },
  "operandCountDistribution": {
    "2": 694,
    "3": 306
  },
  "hcfValueDistribution": {
    "hcf_greater_than_1": 804,
    "hcf_equals_1": 196
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "commonPrimeIntersectionLatex": 1000,
    "minimumExponentSelectionLatex": 1000,
    "hcfLatex": 1000,
    "hcfFactorCountFormulaLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "groupingInterpretationLatex": 1000
  }
}
```
**CP-002**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 396,
    "Medium": 390,
    "Hard": 214
  },
  "questionLanguageDistribution": {
    "QL-014": 151,
    "QL-015": 129,
    "QL-010": 137,
    "QL-013": 143,
    "QL-012": 151,
    "QL-009": 139,
    "QL-011": 150
  },
  "explanationDistribution": {
    "ES-002": 1000
  },
  "cpFamilyDistribution": {
    "not-applicable": 1000
  },
  "contextFamilyDistribution": {
    "not-applicable": 1000
  },
  "operandCountDistribution": {
    "2": 689,
    "3": 311
  },
  "hcfValueDistribution": {
    "hcf_greater_than_1": 771,
    "hcf_equals_1": 229
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "commonPrimeIntersectionLatex": 1000,
    "minimumExponentSelectionLatex": 1000,
    "hcfLatex": 1000,
    "hcfFactorCountFormulaLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "groupingInterpretationLatex": 1000
  }
}
```
**CP-003**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Easy": 409,
    "Medium": 403,
    "Hard": 188
  },
  "questionLanguageDistribution": {
    "QL-027": 42,
    "QL-022": 45,
    "QL-032": 45,
    "QL-019": 43,
    "QL-035": 33,
    "QL-016": 44,
    "QL-040": 45,
    "QL-025": 50,
    "QL-031": 44,
    "QL-038": 32,
    "QL-036": 46,
    "QL-034": 43,
    "QL-020": 35,
    "QL-017": 25,
    "QL-023": 46,
    "QL-037": 34,
    "QL-018": 26,
    "QL-033": 35,
    "QL-028": 47,
    "QL-039": 38,
    "QL-021": 32,
    "QL-029": 38,
    "QL-030": 49,
    "QL-026": 41,
    "QL-024": 42
  },
  "explanationDistribution": {
    "ES-004": 251,
    "ES-003": 251,
    "ES-006": 249,
    "ES-005": 249
  },
  "cpFamilyDistribution": {
    "divisibility_restriction": 217,
    "candidate_set": 215,
    "arithmetic_restriction": 200,
    "bounded_range": 173,
    "exam_mixed": 195
  },
  "contextFamilyDistribution": {
    "divisibility_restriction": 217,
    "candidate_list": 215,
    "arithmetic_restriction": 200,
    "range_based": 173,
    "mixed_exam_style": 195
  },
  "operandCountDistribution": {
    "2": 1000
  },
  "hcfValueDistribution": {
    "hcf_greater_than_1": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "commonPrimeIntersectionLatex": 1000,
    "minimumExponentSelectionLatex": 1000,
    "hcfLatex": 1000,
    "hcfFactorCountFormulaLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "groupingInterpretationLatex": 1000
  }
}
```
**CP-004**

**Coverage Summary**
```json
{
  "difficultyDistribution": {
    "Hard": 206,
    "Easy": 409,
    "Medium": 385
  },
  "questionLanguageDistribution": {
    "QL-049": 39,
    "QL-053": 47,
    "QL-047": 35,
    "QL-058": 38,
    "QL-050": 38,
    "QL-054": 34,
    "QL-043": 47,
    "QL-044": 42,
    "QL-045": 34,
    "QL-065": 46,
    "QL-046": 32,
    "QL-062": 44,
    "QL-055": 49,
    "QL-064": 40,
    "QL-041": 37,
    "QL-042": 45,
    "QL-063": 50,
    "QL-056": 39,
    "QL-052": 31,
    "QL-057": 31,
    "QL-048": 42,
    "QL-061": 40,
    "QL-051": 30,
    "QL-059": 50,
    "QL-060": 40
  },
  "explanationDistribution": {
    "ES-009": 250,
    "ES-010": 250,
    "ES-007": 250,
    "ES-008": 250
  },
  "cpFamilyDistribution": {
    "not-applicable": 1000
  },
  "contextFamilyDistribution": {
    "boxes": 39,
    "chairs": 47,
    "pencils": 35,
    "distribution": 88,
    "bundles": 38,
    "teams": 83,
    "students": 89,
    "books": 34,
    "public_exam": 46,
    "notebooks": 32,
    "grouping": 94,
    "sets": 40,
    "fruits": 82,
    "classrooms": 70,
    "rows": 61,
    "packets": 42,
    "packing": 80
  },
  "operandCountDistribution": {
    "2": 874,
    "3": 126
  },
  "hcfValueDistribution": {
    "hcf_greater_than_1": 1000
  },
  "mathJaxObjectCoverage": {
    "operandFactorizationLatex": 1000,
    "commonPrimeIntersectionLatex": 1000,
    "minimumExponentSelectionLatex": 1000,
    "hcfLatex": 1000,
    "hcfFactorCountFormulaLatex": 1000,
    "candidateEvaluationLatex": 1000,
    "groupingInterpretationLatex": 1000
  }
}
```
