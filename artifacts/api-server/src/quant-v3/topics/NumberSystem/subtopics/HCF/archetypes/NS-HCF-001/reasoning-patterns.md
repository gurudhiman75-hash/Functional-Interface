# NS-HCF-001 Reasoning Patterns

## Status

Phase A architecture package only.

No reasoning graph implementation is authorized by this document.

## Shared Reasoning Families

### RP-HCF-001 Direct HCF Computation

Applies to:

- CP-001

Purpose:

Find the greatest positive integer that divides every given number exactly.

Future solver topology:

- Accept two or three operands.
- Compute the HCF directly.
- Future runtime may use prime-factor intersection, Euclidean algorithm, or pairwise GCD internally.
- Explanation evidence should remain compatible with the approved educational method.

### RP-HCF-002 Prime-Factor Intersection

Applies to:

- CP-001
- CP-002
- CP-003
- CP-004

Purpose:

Show the educational foundation of HCF through common prime factors and minimum exponents.

Future solver topology:

- Factorize each operand.
- Identify prime bases common to every operand.
- For each common prime base, keep the smallest exponent.
- Multiply the retained prime powers to obtain the HCF.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

Common prime bases: 2 and 3

Minimum exponents: 2^1 and 3^1

HCF = 6

### RP-HCF-003 Common-Divisor Counting

Applies to:

- CP-002

Purpose:

Count the positive divisors common to all operands.

Future solver topology:

- Compute HCF(numbers).
- Count the positive factors of the HCF using NS-FAC-001 factor-count logic.
- Return the factor count of the HCF.

Derived-topology rule:

CP-002 is derived from CP-001 plus NS-FAC-001 factor count.

Future reasoning graphs must make this dependency visible.

### RP-HCF-004 Missing-Value Reconstruction

Applies to:

- CP-003

Purpose:

Find a missing operand that satisfies a target HCF condition.

Future solver topology:

- Verify targetHcf is positive.
- Require the missing number to be a multiple of targetHcf.
- Require the full operand set to have exactly targetHcf as HCF.
- Apply the prompt's uniqueness constraint.
- Return the unique missing number.

Invalid reasoning boundary:

If multiple missing values satisfy the HCF condition, the problem is underdetermined and must not be generated.

### RP-HCF-005 Equal-Grouping Translation

Applies to:

- CP-004

Purpose:

Translate a maximum equal grouping or equal partitioning context into an HCF computation.

Future solver topology:

- Extract the quantities from the context.
- Recognize that the required group size must divide every quantity exactly.
- Recognize that the largest such group size is the HCF.
- Compute HCF(quantities).
- Return the maximum equal group size.

## Reasoning Graph Expectations

Future reasoning graphs must remain the source of truth for explanation rendering and validation.

Expected graph responsibilities:

- Record archetype ID and CP ID.
- Record input operands or contextual quantities.
- Record operand count.
- Record prime factorization evidence for each operand when used.
- Record common prime bases.
- Record minimum common exponents.
- Record HCF value.
- Record HCF formula evidence.
- Record common-divisor count for CP-002.
- Record targetHcf and uniqueness constraint for CP-003.
- Record candidate evaluation or reconstruction evidence for CP-003.
- Record contextual translation evidence for CP-004.
- Record final answer.
- Preserve traceability identifiers.

## Math Evidence Expectations

Future educational libraries should be able to consume MathJax-compatible objects for:

- operand prime factorizations.
- common prime base intersection.
- minimum exponent selection.
- HCF expression.
- factor count of HCF for CP-002.
- target HCF condition for CP-003.

No MathJax library or runtime object is created in Phase A.

## Implementation Gate

No reasoning graph implementation is authorized by this document.
