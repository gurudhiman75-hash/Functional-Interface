# NS-REM-002 Difficulty Framework

## Status

Specification Status: UPDATED

Implementation Status: NOT IMPLEMENTED

## Foundational Relation

Dividend = Divisor * Quotient + Remainder

## Difficulty Bands

### Easy

Canonical Problems:

- CP-001 Find Dividend
- CP-006 Find Missing Divisor
- CP-007 Find Missing Quotient
- CP-008 Find Missing Remainder
- CP-009 Find Missing Dividend

Reason:

These problems use direct equation reconstruction. The task is to substitute or rearrange the foundational relation to recover one missing value.

### Medium

Canonical Problems:

- CP-002 Find Smallest Number Satisfying Remainder Condition
- CP-003 Find Greatest Number Satisfying Remainder Condition

Reason:

These problems require bounded search. The student must identify a number satisfying a remainder condition and a one-sided bound.

### Hard

Canonical Problems:

- CP-004 Count Numbers Satisfying Remainder Condition
- CP-005 Sum Numbers Satisfying Remainder Condition

Reason:

These problems require range counting or range summation. The student must identify all numbers satisfying a remainder condition over an interval and then count or sum them.

## Difficulty Ownership

This framework defines only the approved educational difficulty grouping.

No runtime difficulty generator or difficulty distribution logic is created by this specification update.

## Removed Difficulty Scope

CP-010 and CP-011 are removed and must not appear in the NS-REM-002 difficulty framework.
