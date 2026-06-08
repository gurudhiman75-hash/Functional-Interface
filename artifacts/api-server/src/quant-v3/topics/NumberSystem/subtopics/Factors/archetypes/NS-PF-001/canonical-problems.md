# NS-PF-001 Canonical Problems

## Archetype

Archetype ID: NS-PF-001

Name: Prime Factorization

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Canonical Problem Discovery

Minimum non-redundant CP set:

- CP-001 through CP-007

Mathematical topology analysis:

Prime factorization creates a canonical ordered exponent vector:

number = p1^e1 x p2^e2 x ... x pk^ek

The approved CP set asks for distinct non-redundant projections of this same object:

- CP-001 asks for the full canonical factorization vector.
- CP-002 asks for total multiplicity, e1 + e2 + ... + ek.
- CP-003 asks for support size, k.
- CP-004 asks for the maximum prime base, pk.
- CP-005 asks for the minimum prime base, p1.
- CP-006 asks for the highest prime power p^e for a selected prime base.
- CP-007 asks for only the exponent e of a selected prime base.

CP-006 and CP-007 are retained separately because their outputs are educationally different:

- CP-006 output is a prime power such as 2^3 = 8.
- CP-007 output is an exponent such as 3.

No candidate topology is redundant under this output distinction.

Approved CP-006 / CP-007 distinction:

- CP-006 asks for the highest prime power value. For number = 360 and prime = 2, the factorization is 2^3 x 3^2 x 5, so the answer is 8.
- CP-007 asks for the exponent only. For number = 360 and prime = 2, the answer is 3.

CP-006 must never expect an exponent-only answer.

CP-007 must never expect a prime-power value answer.

## Prime Input Policy

Prime numbers are valid inputs for NS-PF-001.

Approved examples:

- 2
- 3
- 5
- 13
- 97

For a prime input p, the prime factorization is p.

Expected behavior for number = 13:

| CP | Input | Expected Output |
| --- | --- | --- |
| CP-001 | number = 13 | 13 |
| CP-002 | number = 13 | 1 |
| CP-003 | number = 13 | 1 |
| CP-004 | number = 13 | 13 |
| CP-005 | number = 13 | 13 |
| CP-006 | number = 13, prime = 13 | 13 |
| CP-007 | number = 13, prime = 13 | 1 |

Prime inputs must be represented by future coverage reporting.

Composite inputs must also remain represented by future coverage reporting.

## Exponent Zero Policy

Approved policy: Option A.

For CP-006 and CP-007, the selected prime must divide the number.

The selected exponent is always positive.

Absent selected primes are not generated for CP-006 or CP-007.

Exponent 0 is outside the active beginner-friendly educational boundary for NS-PF-001.

## Active Canonical Problems

Active CP range: CP-001 through CP-007 only.

### CP-001 Prime Factorization

Output the complete prime factorization of a number.

Inputs:

- number

Output:

- factorization

Educational topology:

Full Prime Factorization.

Example:

360 = 2^3 x 3^2 x 5

### CP-002 Count Prime Factors

Count all prime factors of a number, including repetition.

Inputs:

- number

Output:

- totalPrimeFactorCount

Educational topology:

Total Multiplicity Count.

Example:

360 has 6 prime factors when repetition is counted:

2, 2, 2, 3, 3, 5

### CP-003 Count Distinct Prime Factors

Count the different prime factors of a number.

Inputs:

- number

Output:

- distinctPrimeFactorCount

Educational topology:

Distinct Support Count.

Example:

360 has 3 distinct prime factors:

2, 3, 5

### CP-004 Largest Prime Factor

Find the largest prime factor of a number.

Inputs:

- number

Output:

- largestPrimeFactor

Educational topology:

Prime Base Maximum.

### CP-005 Smallest Prime Factor

Find the smallest prime factor of a number.

Inputs:

- number

Output:

- smallestPrimeFactor

Educational topology:

Prime Base Minimum.

### CP-006 Highest Power Of A Prime

Find the highest power of a given prime that divides the number.

Inputs:

- number
- prime

Output:

- highestPrimePower

Educational topology:

Selected Prime Power Lookup.

Example:

For number 360 and prime 2, the highest power is 2^3 = 8.

Generation requirement:

The selected prime must be a prime factor of the number.

Answer requirement:

Return the highest prime power value, not the exponent.

Example:

For number 360 and prime 2, return 8.

### CP-007 Prime Exponent Lookup

Find the exponent of a given prime in the prime factorization of the number.

Inputs:

- number
- prime

Output:

- exponent

Educational topology:

Selected Exponent Lookup.

Example:

For number 360 and prime 3, the exponent is 2.

Generation requirement:

The selected prime must be a prime factor of the number.

Answer requirement:

Return the exponent only, not the prime power value.

Example:

For number 360 and prime 2, return 3.

## Exclusions

The following are not part of NS-PF-001:

- Total number of factors using (e1 + 1)(e2 + 1)...
- Sum of factors.
- HCF or LCM using prime powers.
- Prime check questions.
- Prime listing in a range.
- Divisibility-rule questions.
- Remainder questions.
- Runtime generation, solving, validation, audit, tests, or pipelines.

## Implementation Gate

No generators, solvers, validators, reasoning graphs, pipelines, tests, or audits are authorized by this design package.
