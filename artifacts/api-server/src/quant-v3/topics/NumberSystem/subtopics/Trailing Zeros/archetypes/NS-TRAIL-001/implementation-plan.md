# NS-TRAIL-001 Implementation Plan

## Phase Status

This package is design and educational libraries only. It does not create runtime implementation.

## Reuse Requirements

Future implementation must reuse:

- NS-PRM-001
- NS-PF-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Audit Framework
- Human Review Framework

## Shared Future Abstractions

Future runtime should use:

- factorFiveCount
- factorTwoCount
- trailingZeroCount
- factorialTerm
- numeratorTerms
- denominatorTerms
- zeroCount
- base
- exponent
- numberA
- numberB
- factorFiveCountLatex
- factorialExpressionLatex
- searchProcessLatex
- powerFactorizationLatex
- productFactorizationLatex

Runtime may only load, validate, select, substitute, render, and audit approved educational language.

Runtime may not invent stems, explanations, or fallback wording.

## CP-001 Count Trailing Zeros In n!

Educational objective:

Count trailing zeros in a single factorial.

Inputs:

- n

Outputs:

- answer

Future solver topology:

- compute floor(n / 5) + floor(n / 25) + ...
- return the total

Future graph topology:

- input capture
- factor-of-10 interpretation
- factor-of-5 count
- answer extraction

Validation requirements:

- n must be a positive integer
- answer must equal the factor-of-5 total

Coverage requirements:

- smallFactorial
- mediumFactorial
- largeFactorial
- multipleFivePowers

## CP-002 Count Trailing Zeros In Factorial Expressions

Educational objective:

Count trailing zeros in expressions involving factorials.

Inputs:

- expression

Outputs:

- answer

Future solver topology:

- parse approved factorial expression structure
- add numerator factor-of-5 contributions
- subtract denominator contributions
- return remaining count

Future graph topology:

- expression capture
- term contribution
- cancellation or subtraction
- answer extraction

Validation requirements:

- expression must be from approved expression templates
- answer must match evaluated factor-of-5 contribution

Coverage requirements:

- numeratorOnly
- numeratorDenominator
- cancellationCase

## CP-003 Smallest Number Whose Factorial Has Given Trailing Zeros

Educational objective:

Find the smallest n whose factorial has a given trailing-zero count.

Inputs:

- zeroCount

Outputs:

- answer

Future solver topology:

- search possible n values
- compute trailing-zero count for each candidate
- return smallest exact match

Future graph topology:

- zero count capture
- search process
- smallest matching value
- answer extraction

Validation requirements:

- zeroCount must be non-negative
- generated exact-match prompts must have a solution

Coverage requirements:

- solutionExists
- nearestBelow
- nearestAbove

## CP-004 Count Trailing Zeros In Powers

Educational objective:

Count trailing zeros in base^exponent.

Inputs:

- base
- exponent

Outputs:

- answer

Future solver topology:

- prime-factorize base
- multiply factor counts by exponent
- return min(total twos, total fives)

Future graph topology:

- power capture
- base factorization
- exponent multiplication
- factor-pair count
- answer extraction

Validation requirements:

- base and exponent must be positive integers
- answer must match complete 2-and-5 pairs

Coverage requirements:

- balancedTwoFive
- excessTwos
- excessFives
- noTrailingZero

## CP-005 Determine Change In Trailing Zeros After Multiplication

Educational objective:

Find trailing zeros in the product of two numbers.

Inputs:

- numberA
- numberB

Outputs:

- answer

Future solver topology:

- prime-factorize both numbers
- add factor counts for 2 and 5
- return min(total twos, total fives)

Future graph topology:

- input capture
- product factorization
- total factor count
- answer extraction

Validation requirements:

- numberA and numberB must be positive integers
- answer must match complete 2-and-5 pairs

Coverage requirements:

- productCreatesZeros
- productAddsZeros
- productNoZeroChange

## Educational Library Gate

All stems and explanations are explicitly stored in approved libraries.

Future runtime must not generate educational sentences.
