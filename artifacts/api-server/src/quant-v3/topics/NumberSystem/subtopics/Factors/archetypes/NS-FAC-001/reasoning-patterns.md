# NS-FAC-001 Reasoning Patterns

## Status

Design package only.

## Shared Reasoning Families

### RP-FAC-001 Factor Count Formula

Applies to:

- CP-001

Purpose:

Find the total number of positive factors from prime exponents.

Future solver topology:

Build prime factorization, add 1 to each exponent, and multiply the results.

### RP-FAC-002 Factor Sum Formula

Applies to:

- CP-002

Purpose:

Find the sum of all positive factors.

Future solver topology:

Build prime factorization, compute the geometric sum for each prime power, and multiply the component sums.

### RP-FAC-003 Factor Product Formula

Applies to:

- CP-003

Purpose:

Find the product of all positive factors.

Future solver topology:

Find factorCount and compute number^(factorCount/2).

### RP-FAC-004 Factor Count Parity

Applies to:

- CP-004

Purpose:

Determine whether the number of factors is odd or even.

Future solver topology:

Determine whether number is a perfect square. Perfect squares have odd factor count; all other positive integers have even factor count.

### RP-FAC-005 Greatest Proper Factor

Applies to:

- CP-005

Purpose:

Find the largest positive factor less than number.

Future solver topology:

For composite numbers, divide number by its smallest prime factor. For prime numbers, return 1.

### RP-FAC-006 Divisible Factor Count

Applies to:

- CP-006

Purpose:

Count factors of number that are divisible by k.

Future solver topology:

Use prime-exponent constraints from number and k to count eligible factors.

### RP-FAC-007 Derived Complement Factor Count

Applies to:

- CP-007

Purpose:

Count factors of number that are not divisible by k.

Future solver topology:

Find total factor count, count factors divisible by k, then subtract.

Derived-topology rule:

CP-007 is derived from CP-001 and CP-006:

notDivisibleFactorCount = factorCount - divisibleFactorCount

Future reasoning graphs must make this derivation visible instead of presenting CP-007 as independent factor enumeration.

### RP-FAC-008 Ordered Factor Selection

Applies to:

- CP-008
- CP-009

Purpose:

Select a factor by position from an ordered factor list.

Future solver topology:

Generate or derive the ordered factor set, then select position from increasing order for CP-008 or decreasing order for CP-009.

Edge-position rule:

Future reasoning graphs must identify whether the selected position is first, second, middle, penultimate, last, or general.

## Reasoning Graph Expectations

Future reasoning graphs must remain the source of truth for explanation rendering and validation.

Expected graph responsibilities:

- Record input parameters.
- Record prime factorization evidence.
- Record MathJax-compatible formula forms.
- Record factorCount.
- Record factorSum or factorProduct where applicable.
- Record productDigitCount for CP-003.
- Record perfect-square status where applicable.
- Record k and divisibility constraints where applicable.
- Record ordered-factor position where applicable.
- Record edge-position classification where applicable.
- Record highlyCompositeNumber status where applicable.
- Record final answer.
- Preserve traceability identifiers.

## Implementation Gate

No reasoning graph implementation is authorized by this document.
