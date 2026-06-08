# NS-PF-001 Difficulty Framework

## Status

Design package only.

## Easy

Characteristics:

- Small composites.
- Prime input numbers such as 2, 3, 5, and 13.
- At most 3 distinct prime factors.
- Low exponents.
- Factorization can usually be completed by repeated division by 2, 3, 5, or 7.

Approved CP emphasis:

- CP-001 with small composites.
- CP-002 with low total prime factor count.
- CP-003 with 1 to 3 distinct prime factors.
- CP-004 and CP-005 with small prime bases.
- CP-006 and CP-007 with prime in {2, 3, 5, 7}.

## Medium

Characteristics:

- Medium composites.
- Prime input numbers in the medium range.
- Mixed-prime numbers.
- Repeated-prime numbers.
- Prime bases may include two-digit primes.
- Factorization may require several division steps.

Approved CP emphasis:

- CP-001 with mixed prime powers.
- CP-002 with moderate total prime factor count.
- CP-003 with 2 to 4 distinct prime factors.
- CP-004 with two-digit largest prime factor.
- CP-006 and CP-007 with exponent lookup in mixed factorizations.

## Hard

Characteristics:

- Large composites.
- Prime input numbers in the hard range.
- Prime-heavy numbers.
- Repeated-prime numbers with higher exponents.
- Mixed-prime numbers with one larger prime factor.
- Factorization requires more careful trial division.

Approved CP emphasis:

- CP-001 with larger composite values.
- CP-002 with high total prime factor count.
- CP-003 with 3 to 5 distinct prime factors.
- CP-004 with larger prime factor.
- CP-006 and CP-007 with higher powers or larger selected primes.

## Difficulty Drivers

- Number size.
- Largest prime factor size.
- Smallest prime factor visibility.
- Total number of prime factors including repetition.
- Distinct prime factor count.
- Maximum exponent in factorization.
- Whether the number is prime-heavy, repeated-prime, or mixed-prime.

## Distribution Target

- Easy: 40%
- Medium: 40%
- Hard: 20%

## Implementation Gate

Difficulty bands are human-owned. Future runtime may load, validate, register, enforce, and audit these bands after approval.
