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
- Rewrite cyclicity explanations.
- Generate option wording outside approved templates.

## Library Responsibilities

| Library | Authority |
| --- | --- |
| `question-language.library.json` | Owns all question stems for CP-001 through CP-005. |
| `explanation.library.json` | Owns all explanation wording and MathJax placeholder usage. |
| `variable-ranges.library.json` | Owns approved variable names, ranges and option-list policy. |
| `coverage-targets.library.json` | Owns required coverage buckets. |
| `distribution-targets.library.json` | Owns distribution expectations. |

## Question Language Expansion

Approved question language now includes `QL-001` through `QL-058`.

The enhancement pass added:

- `QL-045` through `QL-049` for CP-001.
- `QL-050` through `QL-052` for CP-002.
- `QL-053` through `QL-055` for CP-004.
- `QL-056` through `QL-058` for CP-005.

Runtime may render these stems only by selecting the approved ID and substituting approved variables.

## Coverage Expansion

Additional approved coverage buckets:

- CP-001: `lastDigit0`, `lastDigit1`, `lastDigit5`, `lastDigit6`.
- CP-004: `cycleRecognitionMCQ`, `cycleGeneration`.

These buckets are library-owned and must be visible to future audit logic.

## MathJax Placeholders

Approved placeholders:

- `cycleLatex`
- `cyclePositionLatex`
- `effectiveExponentLatex`
- `productLastDigitLatex`
- `towerReductionLatex`

Future runtime must render these objects from computation evidence. It must not replace them with invented prose.
