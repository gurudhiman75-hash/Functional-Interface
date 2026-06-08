# NS-PRM-001 Canonical Problems

## Archetype

Archetype ID: NS-PRM-001

Name: Prime Numbers

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Active Canonical Problems

Active CP range: CP-001 through CP-008 only.

### CP-001 Prime Check

Determine whether a number is:

- Prime
- Composite

Inputs:

- number

Output:

- Prime or Composite

Educational topology:

Prime Classification.

Number 1 policy:

1 is neither Prime nor Composite.

1 is not a valid generated value for CP-001.

Future runtime validation must reject 1.

### CP-002 Count Primes In Range

Count all prime numbers between lowerBound and upperBound.

Inputs:

- lowerBound
- upperBound

Output:

- Integer count

Educational topology:

Range Counting.

Range policy:

Bounds are inclusive: [lowerBound, upperBound].

Empty prime range policy:

Ranges with zero primes are allowed.

Expected answer:

- 0

Exactly-one-prime policy:

Ranges with exactly one prime are allowed.

Expected answer:

- 1

### CP-003 Smallest Prime In Range

Find the least prime within a range.

Inputs:

- lowerBound
- upperBound

Output:

- Single prime integer

Educational topology:

Range Search Minimum.

Range policy:

Bounds are inclusive: [lowerBound, upperBound].

Generation requirement:

The range must contain at least one prime.

Empty prime range policy:

Ranges with zero primes are not allowed for CP-003.

Future generation must regenerate invalid ranges.

Exactly-one-prime policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

### CP-004 Greatest Prime In Range

Find the largest prime within a range.

Inputs:

- lowerBound
- upperBound

Output:

- Single prime integer

Educational topology:

Range Search Maximum.

Range policy:

Bounds are inclusive: [lowerBound, upperBound].

Generation requirement:

The range must contain at least one prime.

Empty prime range policy:

Ranges with zero primes are not allowed for CP-004.

Future generation must regenerate invalid ranges.

Exactly-one-prime policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

### CP-005 Sum Of Primes In Range

Add all prime numbers in a range.

Inputs:

- lowerBound
- upperBound

Output:

- Integer sum

Educational topology:

Range Summation.

Range policy:

Bounds are inclusive: [lowerBound, upperBound].

Zero-sum policy:

The answer may be 0 when the range contains no primes. Zero-prime ranges must be auditable and must not dominate future generation.

Empty prime range policy:

Ranges with zero primes are allowed.

Expected answer:

- 0

Exactly-one-prime policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

### CP-006 Next Prime

Find the first prime greater than N.

Inputs:

- number

Output:

- Single prime integer

Educational topology:

Forward Prime Search.

Number 1 policy:

1 is not a valid generated value for CP-006.

Future runtime validation must reject 1.

### CP-007 Previous Prime

Find the greatest prime smaller than N.

Inputs:

- number

Output:

- Single prime integer

Educational topology:

Backward Prime Search.

Generation requirement:

number must be at least 3 so a previous prime exists.

Explicit minimum input rule:

number >= 3

Reason:

A previous prime must exist.

Number 1 policy:

1 is not a valid generated value for CP-007.

Future runtime validation must reject 1.

### CP-008 Prime Position

Find the nth prime number.

Inputs:

- position

Output:

- Single prime integer

Educational topology:

Prime Enumeration / Position Lookup.

## Exclusions

The following are not part of NS-PRM-001:

- Prime factorization
- HCF/LCM using primes
- Divisibility-rule questions
- Remainder-based prime questions
- Modular arithmetic with primes
- Congruence problems
- Olympiad-style prime proofs

## Implementation Gate

No generators, solvers, validators, reasoning graphs, pipelines, tests, or audits are authorized by this design package.
