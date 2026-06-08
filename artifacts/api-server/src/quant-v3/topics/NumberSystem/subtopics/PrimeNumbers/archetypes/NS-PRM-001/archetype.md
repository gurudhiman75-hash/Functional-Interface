# NS-PRM-001 Archetype

## Archetype

Archetype ID: NS-PRM-001

Name: Prime Numbers

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Mission

NS-PRM-001 covers foundational prime-number tasks for competitive-exam Quant.

The archetype is design-only at this stage. Runtime implementation is not authorized by this package.

## Core Concepts

- Prime Number
- Composite Number
- Prime Detection
- Prime Enumeration
- Prime Search
- Prime Counting
- Prime Summation

## Mathematical Foundation

Prime Number:

A natural number greater than 1 having exactly two factors: 1 and itself.

Composite Number:

A natural number greater than 1 having more than two factors.

Number 1:

1 is neither Prime nor Composite.

1 is not a valid generated value for:

- CP-001
- CP-006
- CP-007

Future runtime validation must reject 1 for these canonical problems.

## Educational Boundary

This archetype owns direct prime-number identification, range-based prime tasks, next/previous prime search, and nth-prime lookup.

This archetype does not own advanced modular arithmetic, prime factorization, HCF/LCM, divisibility-rule archetypes, remainder archetypes, or olympiad-style number theory.

## Architecture Reuse

Future implementation must reuse the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## Runtime Gate

No runtime code is authorized by this design package.

Future implementation may begin only after human approval of this design package.
