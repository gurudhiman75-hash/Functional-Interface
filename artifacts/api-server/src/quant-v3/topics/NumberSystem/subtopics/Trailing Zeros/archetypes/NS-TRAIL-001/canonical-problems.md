# NS-TRAIL-001 Canonical Problems

## Active CP List

Use only the following canonical problems:

- CP-001 Count Trailing Zeros In n!
- CP-002 Count Trailing Zeros In Factorial Expressions
- CP-003 Smallest Number Whose Factorial Has Given Trailing Zeros
- CP-004 Count Trailing Zeros In Powers
- CP-005 Determine Change In Trailing Zeros After Multiplication

Active topology count: 5

## CP-001 Count Trailing Zeros In n!

Inputs:

- n

Outputs:

- answer

Educational objective:

Find the number of trailing zeros in a factorial.

Mathematical topology:

Count factors of 5 in n! because factors of 2 are more frequent.

Why distinct:

The input is a single factorial n!, and the output is a trailing-zero count.

## CP-002 Count Trailing Zeros In Factorial Expressions

Inputs:

- expression

Outputs:

- answer

Educational objective:

Find trailing zeros in expressions made from factorial terms.

Mathematical topology:

Compute the factor-of-5 contribution from each factorial term, subtract denominator contributions when present, and account for cancellation.

Why distinct:

The learner must combine multiple factorial contributions, not evaluate a single n!.

## CP-003 Smallest Number Whose Factorial Has Given Trailing Zeros

Inputs:

- zeroCount

Outputs:

- answer

Educational objective:

Find the least n for which n! has a specified number of trailing zeros.

Mathematical topology:

Search or binary-search n using the factorial trailing-zero formula and identify the smallest matching value.

Why distinct:

The direction is reversed: the zero count is given, and the factorial input is unknown.

## CP-004 Count Trailing Zeros In Powers

Inputs:

- base
- exponent

Outputs:

- answer

Educational objective:

Find trailing zeros in a power expression.

Mathematical topology:

Prime-factorize the base, multiply exponents by the power, and count complete pairs of 2 and 5.

Why distinct:

The source of factors is a repeated base, not a factorial.

## CP-005 Determine Change In Trailing Zeros After Multiplication

Inputs:

- numberA
- numberB

Outputs:

- answer

Educational objective:

Find the trailing-zero count after multiplying two numbers.

Mathematical topology:

Prime-factorize both numbers, add factor counts for 2 and 5, and take the smaller count.

Why distinct:

The learner combines factor contributions from two ordinary numbers rather than factorials or powers.

## Removed Or Merged Candidates

General factorial computation is excluded.

Prime factorization as a final answer is excluded and belongs to NS-PF-001.

Permutation, combination, logarithm, and scientific notation questions are excluded from this archetype.
