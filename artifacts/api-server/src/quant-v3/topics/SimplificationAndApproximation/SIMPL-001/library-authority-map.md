# Library Authority Map

## Ownership

Ownership: HUMAN_OWNED

Educational Authority: simpl-001-language-draft.md

Runtime Consumption Only

All student-facing educational language is human owned. Runtime may load approved libraries, validate IDs and placeholders, select approved templates, substitute approved variables, and render approved text. Runtime may not invent stems, explanations, educational wording, alternate wording, or fallback wording.

## Active CP List

- CP-001: BODMAS Exact Simplification
- CP-002: Fraction Expression Simplification
- CP-003: Decimal Expression Simplification
- CP-004: Mixed Fraction And Decimal Simplification
- CP-005: Root And Power Expression Simplification
- CP-006: Approximation By Rounding
- CP-007: Closest Or Nearest Value Selection

## CP To QL IDs

- CP-001: QL-001 through QL-025
- CP-002: QL-026 through QL-050
- CP-003: QL-051 through QL-070
- CP-004: QL-071 through QL-095
- CP-005: QL-096 through QL-125
- CP-006: QL-126 through QL-150
- CP-007: QL-151 through QL-180

## CP To ES IDs

- CP-001: ES-001
- CP-002: ES-002
- CP-003: ES-003
- CP-004: ES-004
- CP-005: ES-005
- CP-006: ES-006
- CP-007: ES-007

## Coverage To CP

- CP-001: brackets, operationCount, multiplicationDivision
- CP-002: addition, subtraction, multiplication, division, reducibleAnswer
- CP-003: decimalOperations, decimalPlaces
- CP-004: conversionBurden, operationCount
- CP-005: squareRoots, cubeRoots, powers, mixedRootPower
- CP-006: products, quotients, percentages, roundingLevels
- CP-007: roots, percentages, products, quotients, optionDistance

## Variable Range To CP

- CP-001: operationCount, bracketPresence
- CP-002: operationCount, denominatorComplexity
- CP-003: operationCount, decimalPrecision
- CP-004: operationCount, decimalPrecision, mixedNumberBurden
- CP-005: operationCount, rootAndPowerCombinations
- CP-006: operationCount, roundingTargets
- CP-007: operationCount, roundingTargets, optionSpacing

## Library Responsibilities

| Library | Authority |
| --- | --- |
| question-language.library.json | Owns exactly QL-001 through QL-180. |
| explanation.library.json | Owns exactly ES-001 through ES-007. |
| ariable-ranges.library.json | Owns approved variable domains for SIMPL-001. |
| coverage-targets.library.json | Owns required coverage buckets for SIMPL-001. |
| distribution-targets.library.json | Owns balanced nonzero distribution expectations for SIMPL-001. |
