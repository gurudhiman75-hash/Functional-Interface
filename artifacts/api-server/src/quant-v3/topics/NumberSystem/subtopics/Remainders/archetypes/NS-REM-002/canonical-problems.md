# NS-REM-002 Canonical Problems

## Archetype

Archetype ID: NS-REM-002

Name: Number Reconstruction From Division Information

Status: SPECIFICATION UPDATED

Implementation Status: NOT IMPLEMENTED

## Foundational Relation

Dividend = Divisor * Quotient + Remainder

This relation is the source of truth for all direct reconstruction and missing-component canonical problems in NS-REM-002.

## Redundancy Resolution

The previous canonical problem set contained mathematical redundancy.

For fixed:

- Divisor
- Quotient
- Remainder

there is exactly one dividend.

Therefore, these previous problems collapse into the same mathematical object:

- CP-001 Find Dividend
- CP-002 Find Smallest Dividend
- CP-003 Find Greatest Dividend
- CP-004 Count Dividends
- CP-005 Sum Dividends

The redesigned CP set separates direct reconstruction from bounded remainder-condition problems so every active CP represents a distinct educational topology.

## Approved Canonical Problems

### CP-001 Find Dividend

Given:

- Divisor
- Quotient
- Remainder

Find:

- Dividend

Educational topology:

Direct equation reconstruction.

### CP-002 Find Smallest Number Satisfying Remainder Condition

Given:

- Divisor
- Remainder
- Lower bound condition

Find:

- Smallest number satisfying the remainder condition and bound.

Example shape:

A number leaves remainder 3 when divided by 7. Find the smallest such number greater than 100.

Educational topology:

Bounded search for first valid number above a lower bound.

### CP-003 Find Greatest Number Satisfying Remainder Condition

Given:

- Divisor
- Remainder
- Upper bound condition

Find:

- Greatest number satisfying the remainder condition and bound.

Example shape:

A number leaves remainder 4 when divided by 9. Find the greatest such number less than 1000.

Educational topology:

Bounded search for last valid number below an upper bound.

### CP-004 Count Numbers Satisfying Remainder Condition

Given:

- Divisor
- Remainder
- Lower bound
- Upper bound

Find:

- Count of numbers satisfying the remainder condition within the range.

Example shape:

How many numbers between 100 and 500 leave remainder 3 when divided by 7?

Educational topology:

Range counting under a modular remainder condition.

### CP-005 Sum Numbers Satisfying Remainder Condition

Given:

- Divisor
- Remainder
- Lower bound
- Upper bound

Find:

- Sum of all numbers satisfying the remainder condition within the range.

Example shape:

Find the sum of all numbers between 50 and 200 that leave remainder 2 when divided by 5.

Educational topology:

Arithmetic progression summation under a modular remainder condition.

### CP-006 Find Missing Divisor

Given:

- Dividend
- Quotient
- Remainder

Find:

- Divisor

Educational topology:

Missing component reconstruction from the division relation.

### CP-007 Find Missing Quotient

Given:

- Dividend
- Divisor
- Remainder

Find:

- Quotient

Educational topology:

Missing component reconstruction from the division relation.

### CP-008 Find Missing Remainder

Given:

- Dividend
- Divisor
- Quotient

Find:

- Remainder

Educational topology:

Missing component reconstruction from the division relation with remainder validity.

### CP-009 Find Missing Dividend

Given:

- Divisor
- Quotient
- Remainder

Find:

- Dividend

Educational topology:

Direct reconstruction of missing dividend from the division relation.

## Removed Canonical Problems

### CP-010 Form Smallest Valid Dividend

Status: REMOVED

Reason:

Removed from NS-REM-002 redesign. The approved CP architecture no longer includes digit-formation canonical problems.

### CP-011 Form Greatest Valid Dividend

Status: REMOVED

Reason:

Removed from NS-REM-002 redesign. The approved CP architecture no longer includes digit-formation canonical problems.

## Implementation Gate

Implementation may begin only after this revised CP architecture is approved.

No generators, solvers, validators, reasoning graphs, audits, or pipelines are authorized by this specification update.
