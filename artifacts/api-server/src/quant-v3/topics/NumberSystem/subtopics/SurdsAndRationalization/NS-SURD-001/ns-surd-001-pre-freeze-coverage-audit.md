# NS-SURD-001 Pre-Freeze Coverage Audit

## Summary

- Question count: 500
- Generation failures: 0
- Validation failures: 0
- Traceability failures: 0
- MathJax failures: 0
- Render failures: 0
- Solver failures: 0
- Unique rendered questions: 465
- Duplicate rate: 7.00%

## CP Coverage

```json
{
  "CP01": 63,
  "CP02": 63,
  "CP03": 63,
  "CP04": 63,
  "CP05": 62,
  "CP06": 62,
  "CP07": 62,
  "CP08": 62
}
```

## QL Coverage

```json
{
  "QL-001": 32,
  "QL-003": 9,
  "QL-010": 13,
  "QL-015": 9,
  "QL-022": 11,
  "QL-028": 13,
  "QL-033": 8,
  "QL-041": 9,
  "QL-002": 31,
  "QL-004": 9,
  "QL-011": 13,
  "QL-016": 9,
  "QL-023": 11,
  "QL-029": 13,
  "QL-034": 8,
  "QL-042": 9,
  "QL-005": 9,
  "QL-012": 13,
  "QL-017": 9,
  "QL-024": 10,
  "QL-030": 12,
  "QL-035": 8,
  "QL-043": 9,
  "QL-006": 9,
  "QL-013": 12,
  "QL-018": 9,
  "QL-025": 10,
  "QL-031": 12,
  "QL-036": 8,
  "QL-044": 9,
  "QL-007": 9,
  "QL-014": 12,
  "QL-019": 9,
  "QL-026": 10,
  "QL-032": 12,
  "QL-037": 8,
  "QL-045": 9,
  "QL-008": 9,
  "QL-020": 9,
  "QL-027": 10,
  "QL-038": 8,
  "QL-046": 9,
  "QL-009": 9,
  "QL-021": 9,
  "QL-039": 7,
  "QL-047": 8,
  "QL-040": 7
}
```

## Explanation Coverage

```json
{
  "ES-001": 63,
  "ES-002": 63,
  "ES-003": 63,
  "ES-004": 63,
  "ES-005": 62,
  "ES-006": 62,
  "ES-007": 62,
  "ES-008": 62
}
```

## Difficulty Balance

```json
{
  "Easy": 94,
  "Medium": 274,
  "Hard": 132
}
```

## Root-Index Diversity

```json
{
  "squareRoot": 424,
  "cubeRoot": 76
}
```

## Structural Diversity

```json
{
  "single-surd": 63,
  "linear-combination": 126,
  "product-or-quotient": 63,
  "comparison": 62,
  "rationalization": 124,
  "identity": 62
}
```

## Variable Diversity

```json
{
  "radicand": 48,
  "commonRadicand": 19,
  "leftCoefficient": 18,
  "rightCoefficient": 19,
  "leftRadicand": 78,
  "rightRadicand": 78,
  "minuendRadicand": 26,
  "subtrahendRadicand": 26,
  "additionalRadicand": 23,
  "commonCoefficient": 7,
  "comparisonDirection": 4,
  "denominatorRadicand": 22,
  "numerator": 61,
  "constantTerm": 18,
  "{constantTerm": 17,
  "additionalCoefficient": 10,
  "denominatorCoefficient": 5,
  "{denominatorCoefficient": 5,
  "numeratorRadicand": 22,
  "orderingDirection": 2,
  "middleRadicand": 33,
  "middleCoefficient": 5,
  "subtrahendCoefficient": 9
}
```

## Duplicate Profile

```json
[
  {
    "cpId": "CP01",
    "qlId": "QL-001",
    "question": "Simplify \\(\\sqrt32\\).",
    "count": 4
  },
  {
    "cpId": "CP06",
    "qlId": "QL-030",
    "question": "Express \\(\\frac{1}{\\sqrt11}\\) with a rationalized denominator.",
    "count": 3
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]40\\).",
    "count": 3
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]24\\).",
    "count": 3
  },
  {
    "cpId": "CP01",
    "qlId": "QL-001",
    "question": "Simplify \\(\\sqrt288\\).",
    "count": 3
  },
  {
    "cpId": "CP06",
    "qlId": "QL-030",
    "question": "Express \\(\\frac{1}{\\sqrt3}\\) with a rationalized denominator.",
    "count": 3
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]448\\).",
    "count": 3
  },
  {
    "cpId": "CP02",
    "qlId": "QL-008",
    "question": "Simplify: \\(\\sqrt200 - \\sqrt288 + \\sqrt32\\).",
    "count": 2
  },
  {
    "cpId": "CP08",
    "qlId": "QL-047",
    "question": "Calculate the value of \\((1 + \\sqrt2)^2\\).",
    "count": 2
  },
  {
    "cpId": "CP01",
    "qlId": "QL-002",
    "question": "Simplify \\(\\sqrt[3]384\\).",
    "count": 2
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

