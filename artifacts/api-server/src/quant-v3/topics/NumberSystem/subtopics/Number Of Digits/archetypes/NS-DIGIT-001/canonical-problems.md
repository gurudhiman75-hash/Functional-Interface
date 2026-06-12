# Canonical Problems

## Active CP Set

NS-DIGIT-001 uses exactly five canonical problems.

## CP-001: Number Of Digits In A Given Number

**Inputs:** `number`  
**Output:** `digitCount`

Find the number of digits in a positive integer.

**Distinct topology:** Direct digit counting or direct logarithmic digit-count rule.

## CP-002: Number Of Digits In A Power

**Inputs:** `base`, `exponent`  
**Output:** `digitCount`

Find the number of digits in \(base^{exponent}\).

**Distinct topology:** Uses exponent times logarithm of base.

## CP-003: Number Of Digits In A Product

**Inputs:** `expression`  
**Output:** `digitCount`

Find the number of digits in a product expression.

**Distinct topology:** Uses sum of logarithms of product factors.

## CP-004: Smallest Or Largest N-Digit Number

**Inputs:** `digitCount`, `boundType`  
**Output:** `number`

Find the smallest or largest number having a given number of digits.

**Distinct topology:** Constructs a boundary number from powers of 10.

## CP-005: Missing Exponent From Digit Count

**Inputs:** `base`, `digitCount`  
**Output:** `exponent`

Find the exponent n when \(base^n\) has a given number of digits.

**Distinct topology:** Solves a digit-count relation for the exponent.

## Topology Count

Distinct active topology count: 5.

No additional CPs are active.

