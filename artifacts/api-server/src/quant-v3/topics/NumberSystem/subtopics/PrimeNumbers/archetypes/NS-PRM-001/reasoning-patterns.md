# NS-PRM-001 Reasoning Patterns

## Status

Design package only.

## Shared Reasoning Families

### RP-PRM-001 Prime Classification

Applies to:

- CP-001

Purpose:

Determine whether the given number is prime or composite.

Future solver topology:

Check factor existence according to the prime/composite definition.

### RP-PRM-002 Range Prime Enumeration

Applies to:

- CP-002
- CP-003
- CP-004
- CP-005

Purpose:

Identify primes inside an inclusive range and derive the requested count, smallest prime, greatest prime, or sum.

Future solver topology:

Enumerate or derive all primes in [lowerBound, upperBound], then apply the CP-specific answer rule.

### RP-PRM-003 Directional Prime Search

Applies to:

- CP-006
- CP-007

Purpose:

Search in one direction from a given number until the required prime is found.

Future solver topology:

For CP-006, check numbers greater than number. For CP-007, check numbers smaller than number.

### RP-PRM-004 Prime Position Enumeration

Applies to:

- CP-008

Purpose:

Find the prime number at a requested ordinal position.

Future solver topology:

Enumerate primes in order until the requested position is reached.

## Reasoning Graph Expectations

Future reasoning graphs must remain the source of truth for explanation rendering and validation.

Expected graph responsibilities:

- Record input parameters.
- Record the applied prime-number reasoning family.
- Record intermediate prime list or search result where applicable.
- Record final answer.
- Preserve traceability identifiers.

## Implementation Gate

No reasoning graph implementation is authorized by this document.
