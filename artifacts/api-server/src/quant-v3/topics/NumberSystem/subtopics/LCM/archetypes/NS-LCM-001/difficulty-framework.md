# NS-LCM-001 Difficulty Framework

## Status

Phase A architecture package only.

No variable-range library is created in this phase.

## Easy

Characteristics:

- Two operands.
- Small positive integers.
- Obvious multiples.
- Prime factorizations with one or two prime bases.
- LCM is small and visually discoverable.
- Synchronization contexts use direct wording.
- Range-count questions use short ranges and small LCM values.
- Missing-number prompts use a visible candidate list or very narrow range.
- Threshold questions use thresholds close to a small LCM.

CP emphasis:

- CP-001 with two small numbers.
- CP-002 with simple bells, lights, or cycle contexts.
- CP-003 with one missing value and explicit candidate choices.
- CP-004 with small ranges.
- CP-005 with a low threshold.

## Medium

Characteristics:

- Two or three operands.
- Medium-sized integers.
- Mixed prime factorizations.
- LCM requires several prime bases or non-obvious exponents.
- Synchronization contexts may include three cycles.
- Range-count questions require floor-division reasoning.
- Missing-number prompts require checking a range or divisibility condition.
- Threshold questions require selecting a later multiple of the LCM.

CP emphasis:

- CP-001 with three operands or less obvious prime powers.
- CP-002 with runners, clocks, or repeated alarms.
- CP-003 with uniqueness enforced through range or list constraints.
- CP-004 with medium ranges.
- CP-005 with threshold not close to the base LCM.

## Hard

Characteristics:

- Three or more operands.
- Larger integers.
- Multiple prime bases.
- Higher exponents in prime factorizations.
- Large LCM relative to operands.
- Synchronization contexts include several independent cycles.
- Range-count questions involve larger bounds.
- Missing-number prompts require backward LCM reasoning with stricter visible constraints.
- Threshold questions may require careful next-multiple selection.

CP emphasis:

- CP-001 with larger operands and several prime factors.
- CP-002 with multi-cycle synchronization.
- CP-003 with guaranteed uniqueness under nontrivial constraints.
- CP-004 with wide ranges.
- CP-005 with large thresholds.

## Difficulty Drivers

- Number size.
- Operand count.
- Prime-factor complexity.
- Number of distinct prime bases in the LCM.
- Maximum exponent required in the LCM.
- LCM size.
- Whether one operand divides another.
- Whether operands are pairwise coprime.
- Synchronization context complexity.
- Missing-number constraint complexity.
- Range width for CP-004.
- Threshold size and quotient for CP-005.

## Operand Count Policy

Two-number, three-number, and multi-number LCM questions are not separate canonical problems.

Operand count is a difficulty, coverage, and audit dimension for CP-001 through CP-005.

## Method Policy

Prime factorization and division method are reasoning or explanation methods.

They are not separate canonical problems.

Future educational libraries may include both methods only after CP approval.

## Missing Number Complexity Policy

CP-003 must not generate underdetermined prompts.

Future generation must include enough information to guarantee exactly one missing number.

Allowed uniqueness mechanisms may include:

- Candidate list.
- Closed range.
- Divisibility condition.
- Arithmetic condition.
- Additional visible numerical restriction.

## Range And Threshold Policy

CP-004 and CP-005 use the LCM as a base unit of common multiples.

Future runtime must distinguish:

- counting all common multiples in a range;
- selecting the first common multiple greater than a threshold.

These are different educational outputs and must be audited separately.

## Synchronization Complexity Policy

CP-002 is limited to recurring-together or common-cycle contexts.

Approved future context families may include:

- bells
- runners
- lights
- clocks
- alarms
- machines
- buses or trains
- repeating tasks

Future libraries must not introduce unrelated LCM applications unless a later design review approves a new topology.

## Implementation Gate

Difficulty bands are human-owned and design-only in this phase.

Future runtime may load, validate, register, enforce, and audit difficulty ranges only after educational library approval.
