# SIMPL-001 Canonical Problems

## Discovery Rationale

Simplification and approximation questions in SSC, Banking, Railway, CDS, NDA, CAPF, Punjab PCS, and State PCS exams recur as expression-evaluation tasks rather than theory questions. The retained CPs are separated only where reasoning, solver behavior, or validation behavior changes.

Traditional textbook labels were merged when they produced the same answer type and the same reasoning flow.

## Active CP List

### CP-001 BODMAS Exact Simplification

Topology description:
Evaluate an arithmetic expression using the order of operations.

Representative examples:

- Simplify 48 / 6 + 7 x 3.
- Find the value of 64 - 18 x 2 + 36 / 4.
- Evaluate 125 - (45 + 15) / 3.

Output:
finalValue

Reasoning structure:

1. Read the complete expression.
2. Resolve brackets where present.
3. Apply division and multiplication before addition and subtraction.
4. Compute the final value.

Merged candidates:

- Integer simplification
- Bracket-based simplification
- BODMAS simplification
- Exact arithmetic expression evaluation

Rejected candidates:

- Formula recall questions, because they are not simplification tasks.
- Algebraic expressions with variables, because they belong outside this arithmetic archetype.

Why distinct:
The solver and validator must enforce operation precedence. This differs from fraction-only, decimal-only, root-power, and approximation reasoning.

### CP-002 Fraction Expression Simplification

Topology description:
Evaluate an expression made mainly of fractions and reduce the answer to lowest terms.

Representative examples:

- Simplify 3/4 + 5/8.
- Find the value of 7/9 - 2/3.
- Evaluate 5/6 x 9/10.

Output:
simplifiedFraction

Reasoning structure:

1. Identify the fraction operation.
2. Use common denominators or reciprocal multiplication where required.
3. Perform the arithmetic.
4. Reduce the final fraction to lowest terms.

Merged candidates:

- Fraction addition
- Fraction subtraction
- Fraction multiplication
- Fraction division
- Fraction BODMAS

Rejected candidates:

- Standalone fraction conversion, because it belongs to NS-FRACDEC-001.
- HCF or LCM of fractions, because it belongs to fraction and number-system relation archetypes.

Why distinct:
The final answer is a rational value, and validation must check both value equivalence and lowest-term representation.

### CP-003 Decimal Expression Simplification

Topology description:
Evaluate an expression made mainly of decimal numbers.

Representative examples:

- Simplify 12.5 + 4.75 - 3.2.
- Find the value of 6.4 x 2.5.
- Evaluate 45.6 / 1.2.

Output:
decimalValue

Reasoning structure:

1. Align decimal places where needed.
2. Apply operation precedence.
3. Perform decimal arithmetic accurately.
4. Present the final decimal value.

Merged candidates:

- Decimal addition
- Decimal subtraction
- Decimal multiplication
- Decimal division
- Decimal BODMAS

Rejected candidates:

- Decimal to fraction conversion as final answer, because that belongs to NS-FRACDEC-001.
- Recurring decimal conversion, because it is not a simplification expression.

Why distinct:
Decimal-place handling and rounding safety are central to validation, unlike fraction-expression validation.

### CP-004 Mixed Fraction And Decimal Simplification

Topology description:
Evaluate expressions containing fractions, decimals, and mixed numbers in the same question.

Representative examples:

- Simplify 2.5 + 3/4.
- Find the value of 1 1/2 + 0.75.
- Evaluate 3/5 of 2.5 + 1.2.

Output:
finalRationalValue

Reasoning structure:

1. Convert all terms to a common numerical form.
2. Apply order of operations.
3. Simplify the result.
4. Present the answer in the required form.

Merged candidates:

- Mixed fraction and decimal addition
- Mixed number simplification
- Fraction-decimal BODMAS
- Rational expression simplification

Rejected candidates:

- Pure fraction expressions, because CP-002 handles them.
- Pure decimal expressions, because CP-003 handles them.

Why distinct:
The solver must normalize mixed formats before simplification. This creates a different reasoning and validation path.

### CP-005 Root And Power Expression Simplification

Topology description:
Evaluate expressions involving square roots, cube roots, powers, or simple combinations of these with arithmetic.

Representative examples:

- Simplify sqrt(144) + 2^3.
- Find the value of cube root of 125 + 5^2.
- Evaluate 3^3 - sqrt(81).

Output:
finalValue

Reasoning structure:

1. Evaluate roots and powers first where required.
2. Apply order of operations.
3. Combine the resulting values.
4. Extract the final answer.

Merged candidates:

- Square-root simplification
- Cube-root simplification
- Power simplification
- Root-power mixed expressions

Rejected candidates:

- Surd rationalization, because it belongs to a future surds archetype.
- General exponent laws, because they belong to NS-EXP-001.

Why distinct:
The solver must evaluate root and power components before ordinary arithmetic. This differs from basic BODMAS.

### CP-006 Approximation By Rounding

Topology description:
Estimate the value of an expression by replacing numbers with suitable nearby values.

Representative examples:

- Approximate 498 x 21.
- Find the approximate value of 7998 / 40.
- Estimate 59.8% of 502.

Output:
approximateValue

Reasoning structure:

1. Round each difficult value to a suitable nearby value.
2. Perform the simplified calculation.
3. Report the approximate result.

Merged candidates:

- Nearest integer approximation
- Approximation by tens or hundreds
- Approximate percentage expression
- Approximate product and quotient

Rejected candidates:

- Exact simplification, because exact evaluation belongs to CP-001 through CP-005.
- Data interpretation estimation, because it belongs to a separate data topic.

Why distinct:
The answer is intentionally approximate, and validation must accept the intended rounded computation rather than only exact arithmetic.

### CP-007 Closest Or Nearest Value Selection

Topology description:
Compute or estimate an expression and select the closest value from given options.

Representative examples:

- Which option is closest to 503 x 19?
- Choose the nearest value of 3998 / 20.
- Select the option closest to sqrt(1025).

Output:
nearestOption

Reasoning structure:

1. Compute or estimate the expression.
2. Compare the result with the given options.
3. Select the option with the smallest distance from the result.

Merged candidates:

- Closest answer questions
- Nearest value questions
- Option-based approximation
- Approximate MCQ selection

Rejected candidates:

- Open-ended approximation without options, because CP-006 owns it.
- Exact option matching, because that is exact simplification.

Why distinct:
The validator must compare distances among answer options and confirm a unique closest answer.

## Removed Or Merged Candidates

- BODMAS expressions: retained as CP-001.
- Fraction expressions: retained as CP-002.
- Decimal expressions: retained as CP-003.
- Mixed fraction-decimal expressions: retained as CP-004.
- Root expressions: merged into CP-005.
- Power expressions: merged into CP-005 where the task is arithmetic simplification.
- Approximation using nearest values: retained as CP-006 when open-ended.
- Closest answer questions: retained as CP-007 when options are part of the topology.

## Rejected Candidates

- Theory questions: rejected because exams ask expression work, not definitions.
- Formula recall: rejected because simplification and approximation are operation-based.
- Algebraic simplification: rejected because it belongs to Algebra.
- Surd rationalization: rejected for a future surds archetype.
- Data interpretation approximation: rejected for data interpretation topics.

## Topology Count

Active topology count: 7
