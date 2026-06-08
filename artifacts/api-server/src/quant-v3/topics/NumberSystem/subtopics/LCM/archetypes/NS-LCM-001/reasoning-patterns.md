# NS-LCM-001 Reasoning Patterns

## Status

Phase A architecture package only.

No reasoning graph implementation is authorized by this document.

## Shared Reasoning Families

### RP-LCM-001 Direct LCM Computation

Applies to:

- CP-001

Purpose:

Find the least positive integer divisible by every given number.

Future solver topology:

- Accept two, three, or more operands.
- Compute the LCM directly.
- Future runtime may use prime-factor union or iterative gcd-based LCM internally.
- Explanation evidence should remain compatible with approved educational methods.

### RP-LCM-002 Prime-Factor Union

Applies to:

- CP-001
- CP-002
- CP-003
- CP-004
- CP-005

Purpose:

Show the educational foundation of LCM through all prime factors and maximum exponents.

Future solver topology:

- Factorize each operand.
- Identify every prime base appearing in any operand.
- For each prime base, keep the largest exponent.
- Multiply the retained prime powers to obtain the LCM.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

Maximum exponents: 2^2 and 3^2

LCM = 36

### RP-LCM-003 Common Cycle Synchronization

Applies to:

- CP-002

Purpose:

Translate recurring-together contexts into an LCM computation.

Future solver topology:

- Extract cycle lengths.
- Recognize that the first common recurrence happens after the LCM of the cycle lengths.
- Compute LCM(cycle lengths).
- Return the first common time or recurrence interval.

### RP-LCM-004 Missing-Value Under Target LCM

Applies to:

- CP-003

Purpose:

Find a missing operand that satisfies a target LCM condition.

Future solver topology:

- Verify targetLcm is positive.
- Use the targetLcm prime-factor structure.
- Apply the visible uniqueness condition from the question.
- Check possible values or derive the single allowed value.
- Return the unique missing number.

Invalid reasoning boundary:

If multiple missing values satisfy the LCM condition, the problem is underdetermined and must not be generated.

### RP-LCM-005 Range Count Of Common Multiples

Applies to:

- CP-004

Purpose:

Count common multiples of several numbers within a range.

Future solver topology:

- Compute LCM(numbers).
- Recognize that every common multiple is a multiple of the LCM.
- Count multiples of LCM between lowerBound and upperBound.
- Return the count.

### RP-LCM-006 Threshold-Based Common Multiple Selection

Applies to:

- CP-005

Purpose:

Find the smallest common multiple above a specified threshold.

Future solver topology:

- Compute LCM(numbers).
- Find the first multiple of the LCM greater than threshold.
- Return that selected common multiple.

## Reasoning Graph Expectations

Future reasoning graphs must remain the source of truth for explanation rendering and validation.

Expected graph responsibilities:

- Record archetype ID and CP ID.
- Record input operands or contextual cycle lengths.
- Record operand count.
- Record prime factorization evidence for each operand when used.
- Record all prime bases included in the LCM.
- Record maximum exponent selected for each prime base.
- Record LCM value.
- Record synchronization translation for CP-002.
- Record targetLcm and uniqueness condition for CP-003.
- Record possible-value checking or derivation evidence for CP-003.
- Record range bounds and multiple-count formula for CP-004.
- Record threshold and next-multiple selection for CP-005.
- Record final answer.
- Preserve traceability identifiers.

## Math Evidence Expectations

Future educational libraries should be able to consume MathJax-compatible objects for:

- operand prime factorizations.
- prime-factor union.
- maximum exponent selection.
- LCM expression.
- synchronization interpretation.
- missing-number checking.
- range multiple count.
- threshold next-multiple selection.

No MathJax library or runtime object is created in Phase A.

## Implementation Gate

No reasoning graph implementation is authorized by this document.
