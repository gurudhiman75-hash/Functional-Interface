# NS-LCM-001 Archetype

## Archetype

Archetype ID: NS-LCM-001

Name: Least Common Multiple

Topic: Number System

Subtopic: LCM

Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

Library Status: NOT CREATED

## Mission

NS-LCM-001 covers educational problems whose central mathematical object is the least common multiple of two or more positive integers.

This Phase A package defines only the canonical problem architecture.

Educational libraries are intentionally out of scope for Phase A and must be created later only after canonical problem approval.

## Core Concepts

- Least Common Multiple
- Common Multiple
- Smallest Common Divisible Number
- Prime Factor Union
- Maximum Exponent Selection
- Common Cycle
- Recurring Together
- Range-Based Common Multiple Count
- Threshold-Based Common Multiple Selection
- Missing Operand Under LCM Condition

## Mathematical Foundation

The LCM of positive integers is the least positive integer that is divisible by every given integer exactly.

For two numbers a and b:

LCM(a, b) = least positive integer m such that a divides m and b divides m.

Prime factorization method:

If:

a = p1^e1 x p2^e2 x ... x pk^ek

b = p1^f1 x p2^f2 x ... x pk^fk

Then the LCM keeps every prime base appearing in any operand, and for each prime base keeps the largest exponent.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

LCM = 2^2 x 3^2 = 36

For three or more numbers, the same rule applies across all operands: keep every prime base that appears and use the maximum exponent across all operands.

## Educational Boundary

This archetype owns:

- Direct LCM computation.
- Smallest number divisible by all given numbers.
- Common multiple reasoning.
- Least common multiple applications.
- Synchronization and cycle meeting problems.
- Missing number problems under a fixed LCM condition.
- Counting common multiples in a range.
- Finding the smallest common multiple greater than a threshold.

This archetype does not own:

- HCF computation.
- HCF-LCM relation questions.
- Divisibility-rule questions.
- Remainder questions.
- Prime factorization as the final answer.
- Modular arithmetic.
- Generic arithmetic word problems that do not require LCM recognition.

## Architecture Reuse

Future implementation must reuse the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001
- NS-FAC-001
- NS-HCF-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Human Review Framework
- Audit Framework

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
