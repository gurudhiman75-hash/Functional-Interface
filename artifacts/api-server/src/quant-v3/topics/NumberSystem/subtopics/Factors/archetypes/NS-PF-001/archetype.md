# NS-PF-001 Archetype

## Archetype

Archetype ID: NS-PF-001

Name: Prime Factorization

Topic: Number System

Subtopic: Factors

Status: DESIGN PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

## Mission

NS-PF-001 covers foundational prime factorization tasks for competitive-exam Quant.

The archetype is design-only at this stage. Runtime implementation is not authorized by this package.

## Core Concepts

- Prime Factorization
- Prime Powers
- Distinct Prime Factors
- Factor Count
- Prime Factor Count
- Largest Prime Factor
- Smallest Prime Factor

## Mathematical Foundation

Prime factorization:

Every integer greater than 1 can be written uniquely as a product of prime powers.

Canonical representation:

number = p1^e1 x p2^e2 x ... x pk^ek

Where:

- p1, p2, ..., pk are distinct prime numbers.
- e1, e2, ..., ek are positive integers.
- Prime factors are written in increasing order.

Total prime factor count:

e1 + e2 + ... + ek

Distinct prime factor count:

k

Largest prime factor:

pk

Smallest prime factor:

p1

Highest power of a selected prime p:

p^e, where e is the exponent of p in the prime factorization.

Prime exponent lookup:

Return e, the exponent of the selected prime p.

## Educational Boundary

This archetype owns direct prime factorization and immediate projections of prime factorization.

This archetype does not own:

- Prime checking or prime enumeration beyond factorization support.
- HCF/LCM using prime factorization.
- Divisibility-rule questions.
- Remainder-based questions.
- Factor-count formula questions for total factors of a number.
- Olympiad-style number theory.

## Architecture Reuse

Future implementation must reuse the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001

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
