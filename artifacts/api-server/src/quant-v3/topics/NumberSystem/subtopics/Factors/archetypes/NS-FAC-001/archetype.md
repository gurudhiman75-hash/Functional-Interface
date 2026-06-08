# NS-FAC-001 Archetype

## Archetype

Archetype ID: NS-FAC-001

Name: Factors

Topic: Number System

Subtopic: Factors

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Mission

NS-FAC-001 covers factor and divisor questions derived from the prime factorization of a number.

The archetype is design-only at this stage. Runtime implementation is not authorized by this package.

## Core Concepts

- Factor
- Divisor
- Proper Factor
- Total Number Of Factors
- Sum Of Factors
- Product Of Factors
- Odd Or Even Number Of Factors
- Perfect Square Factor-Count Rule
- Factors Divisible By K
- Factors Not Divisible By K
- kth Smallest Factor
- kth Largest Factor

## Mathematical Foundation

Factors of a number are positive integers that divide the number exactly.

Prime factorization:

N = p1^e1 x p2^e2 x ... x pk^ek

Total number of factors:

d(N) = (e1 + 1)(e2 + 1)...(ek + 1)

Sum of factors:

sigma(N) = (1 + p1 + p1^2 + ... + p1^e1)(1 + p2 + p2^2 + ... + p2^e2)...

Product of factors:

If N has d(N) factors, the product of all factors is:

N^(d(N)/2)

CP-003 magnitude policy:

The product of factors may become very large.

Future runtime must not store factorProduct as a JavaScript number.

Future runtime must compute and serialize factorProduct as:

- BigInt internally, or
- exact decimal string externally

Future runtime must also expose productDigitCount for validation, audit, storage, and UI display decisions.

Perfect square rule:

- Perfect squares have an odd number of factors.
- Non-perfect squares have an even number of factors.

## MathJax Requirement

Future runtime must support MathJax-compatible representations for mathematical objects.

Required future MathJax objects include:

- primeFactorizationLatex
- factorCountFormulaLatex
- factorSumFormulaLatex
- factorProductFormulaLatex
- factorListLatex
- factorsIncreasingLatex
- factorsDecreasingLatex
- kPrimeFactorizationLatex
- divisibleFactorConstraintLatex
- complementFormulaLatex
- selectedPositionFormulaLatex
- greatestProperFactorFormulaLatex
- perfectSquareRuleLatex

Examples:

- N = 2^{3} \times 3^{2}
- d(N) = (3+1)(2+1) = 12
- \sigma(N) = (1+2+4+8)(1+3+9)
- N^{d(N)/2}

Future explanation rendering must consume these MathJax-compatible objects from human-owned templates. Runtime may substitute values into approved placeholders, but must not invent new educational wording.

## Educational Boundary

This archetype owns factor/divisor computations derived from a known or computed prime factorization.

This archetype does not own:

- Listing all factors as the final question type.
- Factor existence queries.
- Factors in ranges.
- Inequality-based factor questions.
- HCF.
- LCM.
- Prime factorization as a standalone answer.
- Divisibility-rule questions.
- Remainder problems.

## Architecture Reuse

Future implementation must reuse the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## Runtime Gate

No runtime code is authorized by this design package.

Future implementation may begin only after human approval of this design package.
