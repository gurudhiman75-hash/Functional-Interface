# NS-HCF-001 Canonical Problems

## Archetype

Archetype ID: NS-HCF-001

Name: Highest Common Factor

Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

Library Status: NOT CREATED

## Canonical Problem Discovery

Minimum non-redundant CP set:

- CP-001 through CP-004

Distinct topology count: 4

Mathematical topology analysis:

HCF problems are built around a shared object:

HCF(numbers) = product of common prime bases using the minimum exponent across all operands.

The retained CP set asks for distinct outputs or distinct educational tasks derived from this object:

- CP-001 asks for the HCF value directly.
- CP-002 asks for the number of common divisors, which requires counting the factors of the HCF.
- CP-003 asks for a missing operand under a fixed HCF constraint.
- CP-004 asks the learner to translate an equal-grouping context into an HCF computation.

The architecture avoids separate CPs for wording variations or method variations.

## Active Canonical Problems

Active CP range: CP-001 through CP-004 only.

### CP-001 Direct HCF Computation

Find the highest common factor of two or three positive integers.

Inputs:

- numbers

Output:

- hcf

Educational objective:

Compute the greatest positive integer that divides every given number exactly.

Mathematical topology:

Direct HCF Computation.

The learner identifies common prime factors and keeps the minimum exponent for each common prime factor.

Future solver may also use Euclidean or pairwise GCD internally, but the educational topology remains direct HCF computation.

Why it is distinct:

The final output is the HCF value itself.

Why it is not redundant:

HCF of two numbers, HCF of three numbers, HCF using prime factorization, and largest common divisor are all variations of this same topology.

Operand count is a difficulty and coverage driver, not a separate canonical problem.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

HCF = 2 x 3 = 6

### CP-002 Count Common Divisors

Find how many positive divisors are common to all given numbers.

Inputs:

- numbers

Output:

- commonDivisorCount

Educational objective:

Recognize that common divisors of the given numbers are exactly the factors of their HCF.

Mathematical topology:

Common Divisor Counting.

Compute HCF(numbers), then count the positive factors of that HCF.

Derived topology status:

CP-002 is derived from CP-001 plus the NS-FAC-001 factor-count topology.

It remains active because the requested output is a count, not the HCF value.

Why it is distinct:

The answer is cardinality of the common-divisor set.

Why it is not redundant:

The educational task requires a second projection after the HCF is known: factor count of the HCF.

Future runtime must make the derivation visible instead of treating CP-002 as independent from CP-001.

Example:

HCF(24, 36) = 12

Factors of 12 are 1, 2, 3, 4, 6, 12

Common divisor count = 6

### CP-003 Missing Operand Using HCF

Find a missing number when the HCF condition and enough constraints are given.

Inputs:

- known operands
- targetHcf
- uniqueness constraint

Output:

- missingNumber

Educational objective:

Use the structure of HCF to reconstruct a missing operand that satisfies a fixed HCF condition.

Mathematical topology:

Missing-Value Reconstruction Under Target HCF.

The missing number must be a multiple of targetHcf, and the full operand set must have exactly targetHcf as its HCF.

Why it is distinct:

The output is a reconstructed operand, not an HCF value or a divisor count.

Why it is not redundant:

Direct computation is not enough. The learner must reason backward from an HCF constraint.

Uniqueness requirement:

Future generation must guarantee a unique answer by providing a range, candidate set, allowed multiplier, divisibility condition, or equivalent constraint.

Underdetermined prompts are not allowed.

Example boundary:

If HCF(24, x) = 6, many values of x are possible.

This is not valid unless the prompt includes enough information to make x unique.

### CP-004 Maximum Equal Grouping / HCF Word Application

Find the largest equal group size that divides multiple quantities exactly.

Inputs:

- contextual quantities

Output:

- maximumEqualGroupSize

Educational objective:

Translate a real-world equal-grouping condition into an HCF computation.

Mathematical topology:

HCF Application Through Equal Partitioning.

The largest possible equal group size is the HCF of the given quantities.

Why it is distinct:

The educational task includes recognizing the HCF structure from a context, not merely computing a stated HCF.

Why it is not redundant:

It has the same numerical computation as CP-001 after translation, but the problem topology includes semantic recognition of maximum equal grouping with no remainder.

Example:

If 24 apples and 36 oranges are packed into identical boxes with no fruit left over, the largest number of each type per box is governed by HCF(24, 36) = 12.

## Non-Redundancy Summary

The retained CPs are distinct because each has a different educational output or recognition task:

- CP-001 outputs the HCF value.
- CP-002 outputs the count of common divisors.
- CP-003 outputs a missing operand.
- CP-004 outputs a maximum equal group size from contextual translation.

CP-002 and CP-004 are intentionally marked as dependent on HCF computation, but they are retained because their educational surfaces are not simple wording variants of CP-001.

## Removed Candidate CPs

### HCF Of Two Numbers

Removed as a standalone CP.

Reason:

It is absorbed into CP-001 as the base operand-count case.

### HCF Of Three Numbers

Removed as a standalone CP.

Reason:

It is absorbed into CP-001 as an operand-count variation and difficulty driver.

### HCF Using Prime Factorization

Removed as a standalone CP.

Reason:

It is a reasoning method for CP-001, not a distinct output topology.

### Largest Common Divisor

Removed as a standalone CP.

Reason:

It is a wording synonym for HCF.

### Standalone HCF Reconstruction Problems

Merged into CP-003.

Reason:

Reconstruction belongs to the missing-operand topology unless a future candidate proves a different unique-output structure.

### Generic HCF Word Problems

Narrowed to CP-004.

Reason:

Only maximum equal grouping is retained in Phase A. Other contexts are deferred until they prove distinct from direct HCF computation plus wording.

## Phase A Boundary

No question language, explanation language, variable ranges, coverage targets, distribution targets, tests, audits, or runtime implementation are authorized by this document.
