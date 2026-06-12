# NS-CLASS-001 Reasoning Patterns

## RP01 Parity Rule Application

Used by CP01.

Reasoning:

1. Classify each input as even or odd.
2. Apply operation rules for parity.
3. Reduce the final outcome to even or odd.
4. Return the parity result.

Traceable evidence:

- input parity
- operation type
- parity rule used
- final parity

## RP02 Sign Rule Application

Used by CP02.

Reasoning:

1. Identify positive, negative or zero inputs.
2. For products and quotients, count negative factors.
3. For powers, use exponent parity if the base is negative.
4. For addition/subtraction, compare magnitudes when signs differ.
5. Return positive, negative or zero.

Traceable evidence:

- input signs
- negative factor count
- zero detection
- final sign

## RP03 Consecutive Sequence Property

Used by CP03.

Reasoning:

1. Identify sequence type.
2. Set step size.
3. Represent terms.
4. Apply requested property.
5. Return property, term or classification.

Traceable evidence:

- sequence type
- step size
- generated terms
- applied property
- answer

## RP04 Property Count

Used by CP04.

Reasoning:

1. Identify property to count.
2. Identify input shape: list or range.
3. Filter or count eligible integers.
4. Return count.

Traceable evidence:

- property filter
- range/list values
- included values or count formula
- answer

## RP05 Condition-Based Classification

Used by CP05.

Reasoning:

1. Read all conditions.
2. Convert each condition into a property.
3. Combine properties.
4. Return the most specific valid class.

Traceable evidence:

- given conditions
- derived properties
- final classification

## RP06 Missing Number Elimination

Used by CP06.

Reasoning:

1. Identify the missing-value condition.
2. Build candidate values from the context.
3. Test each candidate against all properties.
4. Reject invalid values.
5. Return the unique valid value.

Traceable evidence:

- candidate set
- property checks
- eliminated candidates
- unique answer

## Merge Rationale

Consecutive integers, consecutive even integers and consecutive odd integers use RP03. They differ only in step size and starting parity, so they remain one CP.

Even/odd determination and sign determination use different reasoning patterns, RP01 and RP02. They remain separate CPs.
