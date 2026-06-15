# NS-SURD-001 Library Authority Map

## Ownership

- **Source authority:** `ns-surd-001-language-draft.md`
- **Question language:** `question-language.library.json`
- **Explanations:** `explanation.library.json`
- **Variable ranges:** `variable-ranges.library.json`
- **Targets:** `coverage-targets.library.json`, `distribution-targets.library.json`

All files in this layer are **HUMAN_OWNED** and define the educational specification for the package.

## Canonical Problem Assignment

| CP ID | Title | QL Count | ES ID | Variable Count |
| :--- | :--- | :--- | :--- | :--- |
| CP01 | Simplification By Extracting Perfect Powers | 4 | ES-001 | 1 |
| CP02 | Addition And Subtraction Of Like Surds | 9 | ES-002 | 7 |
| CP03 | Multiplication And Division Of Surds | 5 | ES-003 | 6 |
| CP04 | Multi-Step Surd Simplification | 7 | ES-004 | 8 |
| CP05 | Comparison And Ordering Of Surds | 6 | ES-005 | 8 |
| CP06 | Rationalization Of Monomial Denominators | 5 | ES-006 | 3 |
| CP07 | Rationalization Of Binomial Denominators | 8 | ES-007 | 5 |
| CP08 | Surd Identity Evaluation | 7 | ES-008 | 6 |

## Variable Semantic Definitions

| Variable Name | Semantic Meaning |
| :--- | :--- |
| `radicand` | Primary number under the radical sign. |
| `leftRadicand` | Radicand of the leftmost term. |
| `middleRadicand` | Radicand of the middle term. |
| `rightRadicand` | Radicand of the rightmost term. |
| `minuendRadicand` | Radicand of the term being subtracted from. |
| `subtrahendRadicand` | Radicand of the term being subtracted. |
| `additionalRadicand` | Radicand of an extra operational term. |
| `commonRadicand` | Radicand shared by terms (already like surds). |
| `leftCoefficient` | Coefficient of the leftmost term. |
| `middleCoefficient` | Coefficient of the middle term. |
| `rightCoefficient` | Coefficient of the rightmost term. |
| `commonCoefficient` | Shared or primary structural coefficient. |
| `additionalCoefficient` | Coefficient for an extra term. |
| `subtrahendCoefficient` | Coefficient for a subtracted term. |
| `numerator` | Rational numerator of a fraction. |
| `denominatorRadicand` | Radicand located in the denominator. |
| `denominatorCoefficient`| Coefficient of a denominator surd. |
| `constantTerm` | Rational term in a binomial expression. |
| `comparisonDirection` | Direction for comparison (e.g., greater, smaller). |
| `orderingDirection` | Direction for ordering (e.g., ascending, descending). |

## Educational Standards

- **Wording:** Strict adherence to true wording families. No synonym templates. Target ~50 QLs total.
- **Variables:** Mathematical objects only. Rendered string variables are prohibited.
- **Philosophy:** ExamTree V3 separation of concerns (Human Layer vs Runtime). Runtime constructs expressions from primitives.
- **SSC Realism:** Focus on multi-term addition/subtraction, direct comparisons, and standard conjugate rationalization.
