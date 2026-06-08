# NS-HCF-001 Difficulty Framework

## Status

Phase A architecture package only.

No variable-range library is created in this phase.

## Easy

Characteristics:

- Two operands.
- Small positive integers.
- Obvious common factors.
- Prime factorizations with one or two prime bases.
- HCF is small and visually discoverable.
- Common-divisor counts are small.
- Missing-number prompts use a visible candidate set or very narrow range.
- Word problems use direct maximum equal grouping language.

CP emphasis:

- CP-001 with two small numbers.
- CP-002 where HCF has few factors.
- CP-003 with one missing value and explicit candidate choices.
- CP-004 with simple quantities and direct wording.

## Medium

Characteristics:

- Two or three operands.
- Medium-sized integers.
- Mixed prime factorizations.
- HCF requires more than one common prime base or non-obvious exponents.
- Common-divisor count requires factor-count reasoning after HCF.
- Missing-number prompts require checking a range or multiplier condition.
- Word problems require recognizing equal grouping from less direct wording.

CP emphasis:

- CP-001 with three operands or less obvious common factors.
- CP-002 where HCF has moderate factor count.
- CP-003 with uniqueness enforced through range or divisibility constraints.
- CP-004 with contextual quantities and no explicit use of the word HCF.

## Hard

Characteristics:

- Three operands.
- Larger integers.
- Multiple common prime bases.
- Higher exponents in prime factorizations.
- HCF may be large relative to the operands.
- Common-divisor count may require several exponent increments.
- Missing-number prompts require backward HCF reasoning with stricter uniqueness constraints.
- Word problems may include multiple quantities and require careful identification of the maximum equal group size.

CP emphasis:

- CP-001 with three larger operands and several prime factors.
- CP-002 where factor count of the HCF is not immediate.
- CP-003 with reconstruction complexity and guaranteed uniqueness.
- CP-004 with multi-quantity grouping contexts.

## Difficulty Drivers

- Number size.
- Operand count.
- Prime-factor complexity.
- Number of common prime bases.
- Maximum common exponent.
- HCF size.
- Whether the HCF is 1 or greater than 1.
- Common-divisor count size.
- Reconstruction constraint complexity.
- Candidate-set or range size for CP-003.
- Word-problem translation complexity for CP-004.

## Operand Count Policy

Two-number and three-number HCF questions are not separate canonical problems.

Operand count is a difficulty, coverage, and audit dimension for CP-001 through CP-004.

## HCF Equals 1 Policy

Coprime inputs are valid for direct HCF computation and common-divisor counting.

Expected behavior:

- If HCF(numbers) = 1, the HCF answer is 1.
- The common-divisor count is 1, because only 1 is common to all operands.

Future coverage should track coprime and non-coprime input sets.

## Reconstruction Complexity Policy

CP-003 must not generate underdetermined prompts.

Future generation must include enough information to guarantee exactly one missing number.

Allowed uniqueness mechanisms may include:

- Candidate set.
- Closed range.
- Allowed multiplier.
- Additional divisibility condition.
- Additional arithmetic condition.

## Word-Problem Complexity Policy

CP-004 is limited to maximum equal grouping or equal partitioning with no remainder.

Future word-problem libraries must not introduce unrelated HCF applications unless a later design review approves a new topology.

## Implementation Gate

Difficulty bands are human-owned and design-only in this phase.

Future runtime may load, validate, register, enforce, and audit difficulty ranges only after educational library approval.
