# SIMPL-001 Reasoning Patterns

## RP-001 BODMAS Operation Ordering

Supported CPs:

- CP-001
- CP-004
- CP-005

Pattern:

1. Capture expression.
2. Resolve brackets.
3. Apply division and multiplication.
4. Apply addition and subtraction.
5. Extract the final value.

## RP-002 Fraction Normalization And Reduction

Supported CPs:

- CP-002
- CP-004

Pattern:

1. Capture fraction expression.
2. Normalize denominators or apply reciprocal where needed.
3. Perform operations.
4. Reduce to lowest terms.
5. Extract the final fraction or rational value.

## RP-003 Decimal Place-Value Arithmetic

Supported CPs:

- CP-003
- CP-004

Pattern:

1. Capture decimal expression.
2. Preserve decimal place values.
3. Apply operations in correct order.
4. Extract final decimal value.

## RP-004 Mixed Rational Normalization

Supported CPs:

- CP-004

Pattern:

1. Capture mixed fraction, fraction, and decimal terms.
2. Convert terms to a common form.
3. Apply operations.
4. Simplify final value.

## RP-005 Root And Power Evaluation

Supported CPs:

- CP-005

Pattern:

1. Capture root and power components.
2. Evaluate exact square roots, cube roots, and powers.
3. Apply arithmetic operations.
4. Extract final value.

## RP-006 Approximation By Rounding

Supported CPs:

- CP-006

Pattern:

1. Capture expression.
2. Round values to suitable nearby values.
3. Compute the simplified estimate.
4. Extract approximate answer.

## RP-007 Nearest Option Selection

Supported CPs:

- CP-007

Pattern:

1. Capture expression and answer options.
2. Compute or estimate the expression.
3. Compare distance from each option.
4. Select the unique nearest option.

## Future Reasoning Graph Requirements

Future reasoning graphs should expose:

- original expression
- operation order
- normalized fraction or decimal form when used
- root and power evaluation when used
- rounded values for approximation
- option-distance comparison for nearest-value questions
- final answer

No reasoning graph is created in this Phase A package.
