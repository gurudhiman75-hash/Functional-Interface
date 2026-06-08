# NS-FAC-001 Difficulty Framework

## Status

Design package only.

## Easy

Characteristics:

- Small numbers.
- Small factor counts.
- Prime inputs and simple composites.
- Prime-power numbers with low exponents.
- Perfect squares with obvious square roots.
- Small k values.
- Small positions for ordered-factor questions.

Approved CP emphasis:

- CP-001 with small factor counts.
- CP-002 with small sums.
- CP-003 with small products.
- CP-004 with obvious perfect squares and non-squares.
- CP-005 with small composites and primes.
- CP-006 and CP-007 with small k.
- CP-008 and CP-009 with early positions.

## Medium

Characteristics:

- Medium numbers.
- Mixed-prime numbers.
- Moderate factor counts.
- Perfect squares and non-perfect squares.
- Medium k values.
- Middle positions for ordered-factor questions.

Approved CP emphasis:

- CP-001 through CP-003 with moderate prime-exponent vectors.
- CP-004 with less immediate square recognition.
- CP-006 and CP-007 with k having more than one prime factor.
- CP-008 and CP-009 with middle positions.

## Hard

Characteristics:

- Larger numbers.
- Larger factor counts.
- Mixed-prime numbers with several prime bases.
- Prime-power numbers with higher exponents.
- Larger k values.
- Large positions near the end of the factor list.
- Highly composite numbers such as 360, 720, and 840.

Approved CP emphasis:

- CP-001 through CP-003 with larger factor count computations.
- CP-004 with large perfect squares and large non-squares.
- CP-006 and CP-007 with larger k.
- CP-008 and CP-009 with large position values.

## Difficulty Drivers

- Number size.
- Prime factorization length.
- Maximum exponent.
- Total factor count.
- Whether the number is prime, composite, prime-power, or mixed-prime.
- Whether the number is a perfect square.
- Size and structure of k.
- Position size for ordered-factor questions.
- Product size for CP-003.
- Product digit count for CP-003.
- Highly composite number status.

## Product Magnitude Policy

CP-003 may produce very large answers.

Future runtime must:

- use BigInt or exact decimal strings for factorProduct;
- store productDigitCount;
- avoid unsafe JavaScript number serialization;
- audit product magnitude separately from number size.

## Edge Position Policy

For CP-008 and CP-009, position coverage must not rely only on small, medium, and large buckets.

Future coverage must explicitly include:

- first position;
- second position;
- middle position;
- penultimate position;
- last position.

## Highly Composite Coverage

Highly composite numbers are recommended as an explicit educational coverage category because they stress factor count, sum, product, and ordered-factor selection.

Approved example set:

- 60
- 120
- 180
- 240
- 360
- 720
- 840

## Distribution Target

- Easy: 40%
- Medium: 40%
- Hard: 20%

## Implementation Gate

Difficulty bands are human-owned. Future runtime may load, validate, register, enforce, and audit these bands after approval.
