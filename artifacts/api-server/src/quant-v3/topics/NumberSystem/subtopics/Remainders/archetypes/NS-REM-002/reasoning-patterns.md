# NS-REM-002 Reasoning Patterns

## Status

Specification Status: UPDATED

Implementation Status: NOT IMPLEMENTED

## Foundational Relation

Dividend = Divisor * Quotient + Remainder

## Approved Reasoning Patterns

### RP-001 Direct Dividend Reconstruction

Applies to:

- CP-001
- CP-009

Core reasoning:

Use the given divisor, quotient, and remainder to reconstruct the dividend directly.

Educational topology:

Direct substitution into the foundational relation.

### RP-002 Bounded Lower Search

Applies to:

- CP-002

Core reasoning:

Find the smallest number above a lower bound that leaves the target remainder when divided by the divisor.

Educational topology:

One-sided bounded search over a remainder condition.

### RP-003 Bounded Upper Search

Applies to:

- CP-003

Core reasoning:

Find the greatest number below an upper bound that leaves the target remainder when divided by the divisor.

Educational topology:

One-sided bounded search over a remainder condition.

### RP-004 Range Counting

Applies to:

- CP-004

Core reasoning:

Identify the first and last numbers in a range satisfying the target remainder condition, then count the terms.

Educational topology:

Arithmetic progression counting under a modular condition.

### RP-005 Range Summation

Applies to:

- CP-005

Core reasoning:

Identify the numbers in a range satisfying the target remainder condition, then sum the arithmetic progression.

Educational topology:

Arithmetic progression summation under a modular condition.

### RP-006 Missing Component Reconstruction

Applies to:

- CP-006
- CP-007
- CP-008

Core reasoning:

Use the foundational relation and the supplied values to recover the missing divisor, quotient, or remainder.

Educational topology:

Equation rearrangement with validity checks.

## Reasoning Pattern Coverage

Every active CP maps to a distinct reasoning role:

- CP-001: direct dividend reconstruction
- CP-002: bounded lower search
- CP-003: bounded upper search
- CP-004: range counting
- CP-005: range summation
- CP-006: missing divisor reconstruction
- CP-007: missing quotient reconstruction
- CP-008: missing remainder reconstruction
- CP-009: missing dividend reconstruction

## Removed Reasoning Scope

CP-010 and CP-011 are removed.

No digit-formation reasoning pattern is part of the approved NS-REM-002 architecture.

## Implementation Gate

These reasoning patterns are specification-only.

No reasoning graph implementation is authorized by this update.
