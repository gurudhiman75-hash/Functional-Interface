# NS-HCF-001 Archetype

## Archetype

Archetype ID: NS-HCF-001

Name: Highest Common Factor

Topic: Number System

Subtopic: HCF / GCD

Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

Library Status: NOT CREATED

## Mission

NS-HCF-001 covers educational problems whose central mathematical object is the highest common factor of two or more positive integers.

This Phase A package defines only the canonical problem architecture.

Educational libraries are intentionally out of scope for Phase A and must be created later only after canonical problem approval.

## Core Concepts

- Highest Common Factor
- Greatest Common Divisor
- Common Divisor
- Prime Factor Intersection
- Minimum Common Exponent
- Pairwise GCD
- Common Divisor Count
- Missing Operand Reconstruction
- Maximum Equal Grouping

## Mathematical Foundation

The HCF of positive integers is the greatest positive integer that divides each number exactly.

For two numbers a and b:

HCF(a, b) = greatest positive integer d such that d divides a and d divides b.

Prime factorization method:

If:

a = p1^e1 x p2^e2 x ... x pk^ek

b = p1^f1 x p2^f2 x ... x pk^fk

Then the HCF keeps only common prime bases, and for each common prime base keeps the smaller exponent.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

HCF = 2^1 x 3^1 = 6

For three numbers, the same rule applies across all operands: keep only prime bases common to every operand and use the minimum exponent across all operands.

## Educational Boundary

This archetype owns:

- Direct HCF computation.
- Common divisor counting through the HCF.
- Missing number reconstruction under a fixed HCF constraint.
- Maximum equal grouping word problems that translate to HCF.

This archetype does not own:

- Prime factorization as the final answer.
- Total factor count of a single number as the final answer.
- Divisibility-rule questions.
- Remainder questions.
- LCM computation.
- General factor listing as the final answer.
- Generic word problems that do not require HCF recognition.

## Architecture Reuse

Future implementation must reuse the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001
- NS-FAC-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## Phase A Exclusions

Do not create in Phase A:

- Runtime files.
- Generators.
- Solvers.
- Validators.
- Reasoning graphs.
- Pipelines.
- Tests.
- Audits.
- question-language.library.json.
- explanation.library.json.
- coverage-targets.library.json.
- distribution-targets.library.json.
- variable-ranges.library.json.
- library-authority-map.md.

## Runtime Gate

No runtime code is authorized by this architecture package.

Future implementation may begin only after human approval of this Phase A design package and later educational library creation.
