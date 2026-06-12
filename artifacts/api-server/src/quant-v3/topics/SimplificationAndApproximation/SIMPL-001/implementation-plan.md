# SIMPL-001 Implementation Plan

## Implementation Status

This is a design-only implementation plan. It defines future runtime expectations but creates no runtime files.

Future implementation must not invent educational language. Question stems and explanation text must come from approved human-owned libraries created after review.

## Shared Runtime Expectations

Future runtime should support:

- loading approved question-language libraries
- loading approved explanation libraries
- selecting approved stems
- substituting variables
- rendering explanations
- validating answers independently
- auditing coverage
- exporting human review datasets

## CP-001 BODMAS Exact Simplification

Educational objective:
Evaluate arithmetic expressions using correct operation order.

Inputs:
expression

Output:
finalValue

Solver topology:
Parse expression, resolve brackets, apply BODMAS, compute final value.

Future graph topology:
captureExpression -> resolveBrackets -> applyOperationOrder -> computeValue -> extractAnswer

Validation requirements:
Independent arithmetic evaluation with operation precedence.

Traceability requirements:
Trace original expression, operation steps, and final answer.

Coverage requirements:
operation count, bracket presence, multiplication/division presence, difficulty.

Audit requirements:
Question language use, explanation use, operation structure, difficulty distribution.

## CP-002 Fraction Expression Simplification

Educational objective:
Simplify fraction expressions and reduce the result.

Inputs:
fractionExpression

Output:
simplifiedFraction

Solver topology:
Normalize fractions, apply arithmetic, reduce using HCF.

Future graph topology:
captureExpression -> normalizeFractions -> applyFractionOperations -> reduceFraction -> extractAnswer

Validation requirements:
Independent rational arithmetic and lowest-term verification.

Traceability requirements:
Trace common denominator, reciprocal use, reduction factor, and final answer.

Coverage requirements:
addition, subtraction, multiplication, division, mixed fraction operation, reducible answer.

Audit requirements:
Fraction operation coverage, reduction coverage, QL and ES usage.

## CP-003 Decimal Expression Simplification

Educational objective:
Evaluate decimal expressions accurately.

Inputs:
decimalExpression

Output:
decimalValue

Solver topology:
Apply operation order while preserving decimal precision.

Future graph topology:
captureExpression -> applyDecimalOperations -> preservePlaceValue -> extractAnswer

Validation requirements:
Independent decimal arithmetic verification.

Traceability requirements:
Trace decimal expression, intermediate value, and final answer.

Coverage requirements:
addition, subtraction, multiplication, division, decimal place count, difficulty.

Audit requirements:
Decimal operation coverage, decimal place coverage, QL and ES usage.

## CP-004 Mixed Fraction And Decimal Simplification

Educational objective:
Simplify expressions containing fractions, decimals, and mixed numbers.

Inputs:
mixedExpression

Output:
finalRationalValue

Solver topology:
Convert values to a common form, apply operations, simplify final result.

Future graph topology:
captureExpression -> normalizeMixedValues -> applyOperations -> simplifyResult -> extractAnswer

Validation requirements:
Independent rational equivalence verification and final-form verification.

Traceability requirements:
Trace conversions, operation order, simplification, and final answer.

Coverage requirements:
fraction-decimal mix, mixed number presence, conversion burden, operation count.

Audit requirements:
Mixed-format coverage, conversion coverage, QL and ES usage.

## CP-005 Root And Power Expression Simplification

Educational objective:
Evaluate arithmetic expressions involving roots and powers.

Inputs:
rootPowerExpression

Output:
finalValue

Solver topology:
Evaluate exact roots and powers, then simplify using operation order.

Future graph topology:
captureExpression -> evaluateRoots -> evaluatePowers -> applyOperations -> extractAnswer

Validation requirements:
Independent root, power, and arithmetic verification.

Traceability requirements:
Trace each root or power component and final answer.

Coverage requirements:
square root, cube root, powers, root-power mix, difficulty.

Audit requirements:
Root coverage, power coverage, QL and ES usage.

## CP-006 Approximation By Rounding

Educational objective:
Estimate expressions using suitable rounded values.

Inputs:
expression
roundingTarget

Output:
approximateValue

Solver topology:
Round values, perform simplified computation, return approximate result.

Future graph topology:
captureExpression -> roundValues -> computeEstimate -> extractAnswer

Validation requirements:
Independent rounded computation according to approved rounding policy.

Traceability requirements:
Trace original values, rounded values, estimate, and final answer.

Coverage requirements:
rounding to ten, rounding to hundred, percentage approximation, product, quotient.

Audit requirements:
Rounding strategy coverage, approximation type coverage, QL and ES usage.

## CP-007 Closest Or Nearest Value Selection

Educational objective:
Select the option closest to the value of an expression.

Inputs:
expression
options

Output:
nearestOption

Solver topology:
Compute or estimate expression, compare options by distance, select unique nearest option.

Future graph topology:
captureExpression -> computeOrEstimate -> compareOptions -> selectNearest -> extractAnswer

Validation requirements:
Exactly one option must be nearest. Reject ties or ambiguous options.

Traceability requirements:
Trace computed or estimated value, option distances, and selected answer.

Coverage requirements:
far options, close options, product, quotient, root, percentage.

Audit requirements:
Option-distance coverage, uniqueness coverage, QL and ES usage.

## Future Library Gate

Before runtime begins, create and approve:

- question-language.library.json
- explanation.library.json
- variable-ranges.library.json
- coverage-targets.library.json
- distribution-targets.library.json
- library-authority-map.md

Those files are intentionally not created in this package.
