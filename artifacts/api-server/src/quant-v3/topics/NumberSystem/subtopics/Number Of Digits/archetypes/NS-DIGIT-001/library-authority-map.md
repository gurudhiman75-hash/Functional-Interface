# Library Authority Map

## Ownership

All student-facing educational language is human owned.

Runtime may:

- Load approved libraries.
- Validate IDs and placeholders.
- Select approved templates.
- Substitute approved variables.
- Render approved text.

Runtime may not:

- Invent question wording.
- Invent explanation sentences.
- Create additional stems.
- Rewrite explanation language.
- Generate fallback educational wording.

## Library Responsibilities

| Library | Authority |
| --- | --- |
| `question-language.library.json` | Owns exactly `QL-001` through `QL-082`. |
| `explanation.library.json` | Owns exactly `ES-001` through `ES-005`. |
| `variable-ranges.library.json` | Owns approved variables and ranges. |
| `coverage-targets.library.json` | Owns required coverage buckets. |
| `distribution-targets.library.json` | Owns distribution expectations. |

## MathJax Placeholders

Approved placeholders:

- `digitCountFormulaLatex`
- `logarithmExpansionLatex`
- `productDigitFormulaLatex`
- `nDigitNumberFormulaLatex`
- `exponentDigitFormulaLatex`

Future runtime must render these from computation evidence. It must not replace them with invented prose.

## Question Language Expansion

Approved question language now includes `QL-001` through `QL-082`.

The repair pass added:

- `QL-065` through `QL-074` for CP-004.
- `QL-075` through `QL-082` for CP-005.

Runtime may render these stems only by selecting the approved ID and substituting approved variables.

## Coverage Expansion

Additional approved coverage buckets:

- CP-001: `exactPowerOfTen`, `justBelowPowerOfTen`, `justAbovePowerOfTen`.
- CP-002: `boundaryFloorCase`, `nonBoundaryCase`.
- CP-005: `uniqueExponentVerified`.

These coverage categories are library-owned and must be visible to future audit logic.
