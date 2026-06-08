# NS-FAC-001 Canonical Problems

## Archetype

Archetype ID: NS-FAC-001

Name: Factors

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Active Canonical Problems

Active CP range: CP-001 through CP-009 only.

### CP-001 Total Number Of Factors

Find the total number of positive factors of a number.

Inputs:

- number

Output:

- factorCount

Educational topology:

Factor Count Formula.

Rule:

If number = p1^e1 x p2^e2 x ... x pk^ek, then factorCount = (e1 + 1)(e2 + 1)...(ek + 1).

### CP-002 Sum Of Factors

Find the sum of all positive factors of a number.

Inputs:

- number

Output:

- factorSum

Educational topology:

Factor Sum Formula.

Rule:

For each prime power p^e, use 1 + p + p^2 + ... + p^e, then multiply across prime bases.

### CP-003 Product Of Factors

Find the product of all positive factors of a number.

Inputs:

- number

Output:

- factorProduct

Educational topology:

Factor Product Formula.

Rule:

If number has factorCount factors, product of all factors = number^(factorCount/2).

### CP-004 Odd Or Even Number Of Factors

Determine whether a number has an odd or even number of factors.

Inputs:

- number

Output:

- Odd
- Even

Educational topology:

Perfect Square Factor Parity.

Rule:

A number has an odd number of factors only if it is a perfect square.

### CP-005 Greatest Proper Factor

Find the largest factor of a number excluding the number itself.

Inputs:

- number

Output:

- greatestProperFactor

Educational topology:

Proper Factor Maximum.

Examples:

- 18 -> 9
- 17 -> 1

Prime input policy:

For a prime number, the greatest proper factor is 1.

### CP-006 Count Factors Divisible By K

Count the factors of number that are divisible by k.

Inputs:

- number
- k

Output:

- count

Educational topology:

Divisible Factor Count.

Generation rule:

k must divide number.

### CP-007 Count Factors Not Divisible By K

Count the factors of number that are not divisible by k.

Inputs:

- number
- k

Output:

- count

Educational topology:

Derived Complement Factor Count.

Generation rule:

k must divide number.

Derived-topology rule:

CP-007 is an active educational topology, but it is derived from CP-001 and CP-006.

If factorCount is the total number of factors and divisibleFactorCount is the number of factors divisible by k, then:

notDivisibleFactorCount = factorCount - divisibleFactorCount

Future runtime must not treat CP-007 as solver-independent from CP-006.

### CP-008 kth Smallest Factor

Find the factor at a given position when all factors are arranged in increasing order.

Inputs:

- number
- position

Output:

- factor

Educational topology:

Ordered Factor Selection - Increasing.

Generation rule:

position <= factorCount

Edge-position coverage:

Future coverage must explicitly track:

- position = 1
- position = 2
- position near factorCount / 2
- position = factorCount - 1
- position = factorCount

### CP-009 kth Largest Factor

Find the factor at a given position when all factors are arranged in decreasing order.

Inputs:

- number
- position

Output:

- factor

Educational topology:

Ordered Factor Selection - Decreasing.

Generation rule:

position <= factorCount

Edge-position coverage:

Future coverage must explicitly track:

- position = 1
- position = 2
- position near factorCount / 2
- position = factorCount - 1
- position = factorCount

## Non-Redundancy

The active CPs are distinct because each asks for a different projection of the factor set:

- CP-001 asks for cardinality.
- CP-002 asks for additive aggregation.
- CP-003 asks for multiplicative aggregation.
- CP-004 asks for parity of cardinality.
- CP-005 asks for the largest proper divisor.
- CP-006 asks for a restricted count under divisibility by k.
- CP-007 asks for the derived complement count under non-divisibility by k.
- CP-008 asks for an ordered increasing selection.
- CP-009 asks for an ordered decreasing selection.

## Exclusions

The following are not part of NS-FAC-001:

- Listing all factors as the final answer.
- Factor existence queries.
- Factors in ranges.
- Inequality-based factor questions.
- HCF.
- LCM.
- Prime factorization as a standalone answer.
- Divisibility rules.
- Remainder problems.
- Runtime generation, solving, validation, reasoning graphs, pipelines, tests, or audits.

## Implementation Gate

No generators, solvers, validators, reasoning graphs, pipelines, tests, or audits are authorized by this design package.
