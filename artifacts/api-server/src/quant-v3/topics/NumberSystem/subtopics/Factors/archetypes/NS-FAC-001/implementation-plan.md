# NS-FAC-001 Implementation Plan

## Status

Plan Status: DESIGN PACKAGE CREATED

Implementation Status: NOT STARTED

## Summary

NS-FAC-001 must implement only the approved canonical problem set after human approval:

- CP-001 through CP-009

No implementation may begin until this design package is approved.

## Architecture To Reuse

Use the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001

Future implementation must reuse:

- Library registry
- Parameter generator
- Solver
- Reasoning graph builder
- Explanation renderer
- Validator
- Pipeline
- Coverage auditor
- Traceability contract
- Human review workflow
- Maturity audit workflow

Do not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## Shared Abstraction

All CPs must share a factor abstraction derived from prime factorization:

factorModel:

- number
- primeFactorization
- primeFactorizationLatex
- factorCount
- factorCountFormulaLatex
- factorSum
- factorSumFormulaLatex
- factorProduct
- factorProductFormulaLatex
- factorProductString
- productDigitCount
- isPerfectSquare
- highlyCompositeNumber
- factors
- factorsIncreasing
- factorsDecreasing
- factorListLatex
- factorsIncreasingLatex
- factorsDecreasingLatex

For CP-006 and CP-007:

- k
- kPrimeFactorization
- kPrimeFactorizationLatex
- divisibleFactorCount
- notDivisibleFactorCount
- divisibleFactorConstraintLatex
- complementFormulaLatex

For CP-008 and CP-009:

- position
- selectedFactor
- positionClass
- selectedPositionFormulaLatex

Ordinal rendering policy:

Future runtime must not render malformed ordinal text such as 1th, 2th, or 3th.

Future runtime must provide an ordinal display value, such as 1st, 2nd, 3rd, 4th, and substitute it into approved ordinal placeholders.

## CP-001 Total Number Of Factors

Educational Objective:

Find the total number of positive factors of a number.

Inputs:

- number

Outputs:

- factorCount

Variable Universe:

- number from approved difficulty ranges.
- prime and composite inputs are valid.

Solver Topology:

- Build prime factorization.
- Apply d(N) = (e1 + 1)(e2 + 1)...

Difficulty Drivers:

- number size
- distinct prime factor count
- exponent sizes
- factorCount size

Future Reasoning Graph Requirements:

- Record prime factorization, factorCountFormulaLatex, and final factorCount.

Future Validator Requirements:

- Validate prime factorization and factor count formula.

Future Audit Requirements:

- Report difficulty, prime/composite input, prime-power, mixed-prime, factor count buckets, question language, and explanation IDs.

Traceability Requirements:

- Trace archetype ID, CP ID, question language ID, explanation style ID, difficulty, number, prime factorization, MathJax formula, and answer.

## CP-002 Sum Of Factors

Educational Objective:

Find the sum of all positive factors of a number.

Inputs:

- number

Outputs:

- factorSum

Variable Universe:

- number from approved difficulty ranges.
- prime and composite inputs are valid.

Solver Topology:

- Build prime factorization.
- Compute each prime-power geometric sum.
- Multiply component sums.

Difficulty Drivers:

- number size
- exponent sizes
- distinct prime factor count
- factorSum size

Future Reasoning Graph Requirements:

- Record prime factorization, factorSumFormulaLatex, component sums, and final factorSum.

Future Validator Requirements:

- Validate sum formula and final answer.

Future Audit Requirements:

- Report input type, number shape, factor count buckets, question language, and explanation IDs.

Traceability Requirements:

- Trace all inputs, formula evidence, MathJax representation, and answer.

## CP-003 Product Of Factors

Educational Objective:

Find the product of all positive factors of a number.

Inputs:

- number

Outputs:

- factorProduct
- factorProductString
- productDigitCount

Variable Universe:

- number from approved difficulty ranges.
- prime and composite inputs are valid.

Solver Topology:

- Compute factorCount.
- Apply factorProduct = number^(factorCount/2).
- Compute factorProduct exactly using BigInt or equivalent exact integer arithmetic.
- Serialize factorProduct as a decimal string.
- Record productDigitCount.

Difficulty Drivers:

- number size
- factorCount size
- product size
- perfect-square status

Future Reasoning Graph Requirements:

- Record factorCount, factorProductFormulaLatex, factorProductString, productDigitCount, and answer.

Future Validator Requirements:

- Validate factorCount, product formula, exact string serialization, and productDigitCount.

Future Audit Requirements:

- Report product-size risk, productDigitCount buckets, factor count buckets, difficulty, question language, and explanation IDs.

Traceability Requirements:

- Trace number, factorCount, MathJax formula, factorProductString, productDigitCount, answer, and library IDs.

## CP-004 Odd Or Even Number Of Factors

Educational Objective:

Determine whether factorCount is odd or even.

Inputs:

- number

Outputs:

- Odd or Even

Variable Universe:

- number from approved difficulty ranges.
- perfect squares and non-perfect squares must both be represented.

Solver Topology:

- Determine whether number is a perfect square.
- Return Odd for perfect square and Even otherwise.

Difficulty Drivers:

- square-root visibility
- number size
- perfect-square status

Future Reasoning Graph Requirements:

- Record perfect-square status and parity rule.

Future Validator Requirements:

- Validate parity through perfect-square rule or factorCount.

Future Audit Requirements:

- Report perfect-square and non-perfect-square coverage.

Traceability Requirements:

- Trace number, square status, answer, and library IDs.

## CP-005 Greatest Proper Factor

Educational Objective:

Find the largest factor of number excluding number itself.

Inputs:

- number

Outputs:

- greatestProperFactor

Variable Universe:

- number from approved difficulty ranges.
- prime and composite inputs are valid.

Solver Topology:

- If number is prime, answer is 1.
- If number is composite, divide number by its smallest prime factor.

Difficulty Drivers:

- prime/composite input
- smallest prime factor
- number size

Future Reasoning Graph Requirements:

- Record smallest prime factor and proper-factor rule.

Future Validator Requirements:

- Validate answer divides number, answer < number, and no larger proper factor exists.

Future Audit Requirements:

- Report prime input coverage and smallest-prime-factor coverage.

Traceability Requirements:

- Trace input, prime/composite status, factorization, answer, and library IDs.

## CP-006 Count Factors Divisible By K

Educational Objective:

Count positive factors of number that are divisible by k.

Inputs:

- number
- k

Outputs:

- count

Variable Universe:

- number from approved difficulty ranges.
- k must divide number.

Solver Topology:

- Build factor constraints for number.
- Build factor constraints for k.
- Count factors whose prime exponents are at least the corresponding exponents in k.

Difficulty Drivers:

- k size
- k prime factorization
- factorCount size
- number shape

Future Reasoning Graph Requirements:

- Record number factorization, k factorization, eligibility constraints, and count.

Future Validator Requirements:

- Validate k divides number and answer equals eligible factor count.

Future Audit Requirements:

- Report small/medium/large k coverage and factor count buckets.

Traceability Requirements:

- Trace number, k, factorization evidence, answer, and library IDs.

## CP-007 Count Factors Not Divisible By K

Educational Objective:

Count positive factors of number that are not divisible by k.

Inputs:

- number
- k

Outputs:

- count

Variable Universe:

- number from approved difficulty ranges.
- k must divide number.

Solver Topology:

- Compute total factor count.
- Compute factors divisible by k.
- Subtract divisible count from total count.

Derived Topology:

CP-007 is derived from CP-001 and CP-006.

notDivisibleFactorCount = factorCount - divisibleFactorCount

Future implementation must reuse the factorCount and divisibleFactorCount abstractions.

Difficulty Drivers:

- k size
- divisible-factor count
- total factor count
- number shape

Future Reasoning Graph Requirements:

- Record total factor count, divisible count, complementFormulaLatex, complement rule, and answer.

Future Validator Requirements:

- Validate k divides number, divisibleFactorCount is correct, and complement count equals factorCount - divisibleFactorCount.

Future Audit Requirements:

- Report k coverage, complement-count distribution, and derived-topology traceability.

Traceability Requirements:

- Trace number, k, factorCount, divisible count, answer, and library IDs.

## CP-008 kth Smallest Factor

Educational Objective:

Find the factor at a given position in increasing order.

Inputs:

- number
- position

Outputs:

- factor

Variable Universe:

- number from approved difficulty ranges.
- position <= factorCount.
- position must cover first, second, middle, penultimate, and last cases over future audit batches.

Solver Topology:

- Derive factors in increasing order.
- Select position.

Difficulty Drivers:

- factorCount
- position size
- number shape

Future Reasoning Graph Requirements:

- Record ordered factor evidence, selected position, selectedPositionFormulaLatex, and positionClass.

Future Validator Requirements:

- Validate position <= factorCount and selected factor is correct.

Future Audit Requirements:

- Report small/medium/large position coverage and edge-position coverage.

Traceability Requirements:

- Trace number, position, factorCount, selected factor, and library IDs.

## CP-009 kth Largest Factor

Educational Objective:

Find the factor at a given position in decreasing order.

Inputs:

- number
- position

Outputs:

- factor

Variable Universe:

- number from approved difficulty ranges.
- position <= factorCount.
- position must cover first, second, middle, penultimate, and last cases over future audit batches.

Solver Topology:

- Derive factors in decreasing order.
- Select position.

Difficulty Drivers:

- factorCount
- position size
- number shape

Future Reasoning Graph Requirements:

- Record ordered factor evidence, selected position, selectedPositionFormulaLatex, and positionClass.

Future Validator Requirements:

- Validate position <= factorCount and selected factor is correct.

Future Audit Requirements:

- Report small/medium/large position coverage and edge-position coverage.

Traceability Requirements:

- Trace number, position, factorCount, selected factor, and library IDs.

## Implementation Gate

Implementation may begin only after:

1. This design package is approved.
2. Human-owned question language is confirmed.
3. Human-owned explanation language is confirmed.
4. Variable ranges and coverage targets are approved.
