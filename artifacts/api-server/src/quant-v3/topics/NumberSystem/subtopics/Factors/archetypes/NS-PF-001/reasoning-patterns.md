# NS-PF-001 Reasoning Patterns

## Status

Design package only.

## Shared Reasoning Families

### RP-PF-001 Full Prime Factorization

Applies to:

- CP-001

Purpose:

Break a number into its complete ordered product of prime powers.

Future solver topology:

Repeatedly divide by prime bases in increasing order, record each exponent, and render the complete factorization.

### RP-PF-002 Multiplicity Count

Applies to:

- CP-002

Purpose:

Count all prime factors including repetition.

Future solver topology:

Build the prime factorization, then sum all exponents.

### RP-PF-003 Distinct Support Count

Applies to:

- CP-003

Purpose:

Count only different prime factors.

Future solver topology:

Build the prime factorization, then count the number of distinct prime bases.

### RP-PF-004 Prime Base Extremum

Applies to:

- CP-004
- CP-005

Purpose:

Find the largest or smallest prime factor.

Future solver topology:

Build the prime factorization, then select the maximum or minimum prime base.

### RP-PF-005 Selected Prime Power Lookup

Applies to:

- CP-006

Purpose:

Find the highest power of a selected prime that divides the number.

Future solver topology:

Build the prime factorization, find the selected prime exponent, then return p^e as the highest prime power.

Output distinction:

This reasoning pattern returns the prime-power value.

Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- selected exponent = 3
- answer = 2^3 = 8

It must not return the exponent-only answer 3.

### RP-PF-006 Selected Exponent Lookup

Applies to:

- CP-007

Purpose:

Find the exponent of a selected prime in the factorization.

Future solver topology:

Build the prime factorization, find the selected prime exponent, and return the exponent only.

Output distinction:

This reasoning pattern returns only the exponent.

Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- answer = 3

It must not return the prime-power value 8.

## Reasoning Graph Expectations

Future reasoning graphs must remain the source of truth for explanation rendering and validation.

Expected graph responsibilities:

- Record input parameters.
- Record the applied prime-factorization reasoning family.
- Record ordered prime bases.
- Record exponents for each prime base.
- Record derived counts or selected values where applicable.
- Record final answer.
- Preserve traceability identifiers.

## Implementation Gate

No reasoning graph implementation is authorized by this document.
