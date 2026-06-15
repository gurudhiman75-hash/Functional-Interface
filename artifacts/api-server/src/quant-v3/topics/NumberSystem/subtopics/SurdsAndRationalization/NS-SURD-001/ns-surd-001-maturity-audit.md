# NS-SURD-001 Maturity Audit

## Summary

- Question count: 1000
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Render failures: 0
- Solver failures: 0
- Unique rendered questions: 899
- Duplicate rate: 10.10%

## CP Coverage

```json
{
  "CP01": 125,
  "CP02": 125,
  "CP03": 125,
  "CP04": 125,
  "CP05": 125,
  "CP06": 125,
  "CP07": 125,
  "CP08": 125
}
```

## QL Coverage

```json
{
  "QL-001": 63,
  "QL-003": 18,
  "QL-010": 25,
  "QL-015": 18,
  "QL-022": 21,
  "QL-028": 25,
  "QL-033": 16,
  "QL-041": 18,
  "QL-002": 62,
  "QL-004": 18,
  "QL-011": 25,
  "QL-016": 18,
  "QL-023": 21,
  "QL-029": 25,
  "QL-034": 16,
  "QL-042": 18,
  "QL-005": 18,
  "QL-012": 25,
  "QL-017": 18,
  "QL-024": 21,
  "QL-030": 25,
  "QL-035": 16,
  "QL-043": 18,
  "QL-006": 18,
  "QL-013": 25,
  "QL-018": 18,
  "QL-025": 21,
  "QL-031": 25,
  "QL-036": 16,
  "QL-044": 18,
  "QL-007": 18,
  "QL-014": 25,
  "QL-019": 18,
  "QL-026": 21,
  "QL-032": 25,
  "QL-037": 16,
  "QL-045": 18,
  "QL-008": 18,
  "QL-020": 18,
  "QL-027": 20,
  "QL-038": 15,
  "QL-046": 18,
  "QL-009": 17,
  "QL-021": 17,
  "QL-039": 15,
  "QL-047": 17,
  "QL-040": 15
}
```

## Explanation Coverage

```json
{
  "ES-001": 125,
  "ES-002": 125,
  "ES-003": 125,
  "ES-004": 125,
  "ES-005": 125,
  "ES-006": 125,
  "ES-007": 125,
  "ES-008": 125
}
```

## Difficulty Balance

```json
{
  "Easy": 185,
  "Medium": 546,
  "Hard": 269
}
```

## Root-Index Diversity

```json
{
  "squareRoot": 845,
  "cubeRoot": 155
}
```

## Structural Diversity

```json
{
  "single-surd": 125,
  "linear-combination": 250,
  "product-or-quotient": 125,
  "comparison": 125,
  "rationalization": 250,
  "identity": 125
}
```

## Variable Diversity

```json
{
  "radicand": 59,
  "commonRadicand": 27,
  "leftCoefficient": 20,
  "rightCoefficient": 19,
  "leftRadicand": 93,
  "rightRadicand": 99,
  "minuendRadicand": 31,
  "subtrahendRadicand": 34,
  "additionalRadicand": 31,
  "commonCoefficient": 9,
  "comparisonDirection": 4,
  "denominatorRadicand": 27,
  "numerator": 86,
  "constantTerm": 20,
  "{constantTerm": 20,
  "additionalCoefficient": 10,
  "denominatorCoefficient": 5,
  "{denominatorCoefficient": 5,
  "numeratorRadicand": 31,
  "orderingDirection": 2,
  "middleRadicand": 56,
  "middleCoefficient": 7,
  "subtrahendCoefficient": 11
}
```

## Duplicate Profile

```json
[
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]135\\).",
    "count": 8
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]56\\).",
    "count": 6
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]54\\).",
    "count": 6
  },
  {
    "cpId": "CP06",
    "qlId": "QL-030",
    "question": "Express \\(\\frac{1}{\\sqrt11}\\) with a rationalized denominator.",
    "count": 5
  },
  {
    "cpId": "CP06",
    "qlId": "QL-030",
    "question": "Express \\(\\frac{1}{\\sqrt2}\\) with a rationalized denominator.",
    "count": 5
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]192\\).",
    "count": 5
  },
  {
    "cpId": "CP01",
    "qlId": "QL-001",
    "question": "Simplify \\(\\sqrt18\\).",
    "count": 5
  },
  {
    "cpId": "CP06",
    "qlId": "QL-030",
    "question": "Express \\(\\frac{1}{\\sqrt10}\\) with a rationalized denominator.",
    "count": 4
  },
  {
    "cpId": "CP01",
    "qlId": "QL-001",
    "question": "Simplify \\(\\sqrt96\\).",
    "count": 4
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]81\\).",
    "count": 4
  }
]
```

## Unused IDs

### unusedQuestionLanguageIds

```json
[]
```

### unusedExplanationIds

```json
[]
```

## Strengths

- All eight CPs are exercised in the audit sample.
- All frozen QL IDs are exercised by the refreshed sampling pass.
- Generation, validation, rendering, and solving all remain clean at current sample size.
- Both square-root and cube-root forms remain visible in the sample.

## Weaknesses

- Difficulty is not runtime-owned in this package, so balance remains an audit-side approximation based on template structure.
- Question diversity is bounded by the finite frozen stem library, so repeated rendered forms still appear under larger samples.

## Section Scores

- topologyQuality: 9/10
- educationalOwnership: 10/10
- runtimeSeparation: 10/10
- generatorQuality: 10/10
- solverQuality: 10/10
- formatterQuality: 10/10
- validatorQuality: 10/10
- testQuality: 9/10
- sscRealism: 8/10
- duplicateLevels: 8/10
- questionDiversity: 8/10

## Overall Assessment

Overall score: 9.3/10

The package now shows clean runtime stability against the frozen educational layer. Remaining maturity limits come mostly from the fixed stem pool rather than structural correctness issues.

