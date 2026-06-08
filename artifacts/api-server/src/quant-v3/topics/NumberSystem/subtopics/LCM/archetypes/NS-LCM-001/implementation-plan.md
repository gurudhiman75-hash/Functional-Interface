# NS-LCM-001 Implementation Plan

## Status

Plan Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT STARTED

Library Status: NOT CREATED

## Summary

NS-LCM-001 must implement only the approved canonical problem set after human approval and after educational libraries are created:

- CP-001 through CP-005

No implementation may begin from this Phase A package alone.

## Architecture To Reuse

Use the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001
- NS-FAC-001
- NS-HCF-001

Future implementation must reuse:

- Library registry.
- Parameter generator.
- Solver.
- Reasoning graph builder.
- Explanation renderer.
- Validator.
- Pipeline.
- Coverage auditor.
- Traceability contract.
- Human review workflow.
- Maturity audit workflow.

Do not redesign:

- Pattern System V2.
- Traceability Framework.
- Validation Framework.
- Coverage Framework.
- Human Review Framework.
- Audit Framework.

## Educational Wording Ownership

Educational wording must be human-owned.

Future runtime may:

- substitute variables into approved templates.
- select approved templates from human-owned libraries.

Future runtime may not:

- generate educational sentences.
- generate explanation text.
- create fallback question wording.
- create fallback solution wording.

## Shared Future Abstraction

All CPs should share a future LCM abstraction derived from operands:

lcmModel:

- operands
- operandCount
- operandPrimeFactorizations
- allPrimeBases
- maximumPrimeExponents
- lcm
- lcmPrimeFactorization
- lcmLatex
- operandFactorizationLatex
- primeUnionLatex
- maximumExponentSelectionLatex

For CP-002:

- cycleLengths
- synchronizationContext
- synchronizationInterpretationLatex
- firstCommonTime

For CP-003:

- targetLcm
- knownOperands
- missingNumber
- visibleConstraintValues
- possibleValueEvidence

For CP-004:

- lowerBound
- upperBound
- multipleCount
- rangeCountFormulaLatex

For CP-005:

- threshold
- selectedMultiple
- thresholdSelectionFormulaLatex

This is an implementation planning abstraction only. No runtime type or API is created in Phase A.

## CP-001 Direct LCM Computation

Educational Objective:

Find the least common multiple of two, three, or more positive integers.

Inputs:

- numbers

Outputs:

- lcm

Solver Topology:

- Accept two, three, or more operands.
- Compute LCM by prime-factor union or iterative gcd-based LCM.
- If using prime-factor evidence, keep every prime base with maximum exponent.
- Return the LCM value.

Future Graph Topology:

- Record operands.
- Record operand count.
- Record prime factorization evidence or gcd-based LCM evidence.
- Record all prime bases and maximum exponents.
- Record final LCM.

Validation Requirements:

- Validate operands are positive integers greater than 1 unless a later library explicitly approves 1.
- Validate operand count is within approved library limits.
- Validate LCM is divisible by every operand.
- Validate no smaller positive common multiple exists.

Traceability Requirements:

- Trace archetype ID, CP ID, difficulty, operands, operand count, reasoning pattern, LCM evidence, and answer.

Coverage Requirements:

- Operand count.
- Difficulty.
- Pairwise coprime versus non-coprime operands.
- LCM size.
- Distinct prime-base count.
- Maximum exponent.

Audit Requirements:

- Report generation validity.
- Report answer correctness.
- Report reasoning evidence completeness.
- Report coverage for operand count, difficulty, coprime status, and LCM size.

## CP-002 Common Cycle Synchronization

Educational Objective:

Find when repeated events occur together again.

Inputs:

- cycle lengths

Outputs:

- firstCommonTime

Solver Topology:

- Extract cycle lengths.
- Translate the recurring-together context into LCM(cycle lengths).
- Compute the LCM.
- Return the first common recurrence interval or time.

Future Graph Topology:

- Record context family.
- Record cycle lengths.
- Record synchronization interpretation.
- Record LCM computation evidence.
- Record final firstCommonTime.

Validation Requirements:

- Validate every cycle length is visible in the rendered question.
- Validate answer is divisible by every cycle length.
- Validate no smaller positive recurrence time satisfies all cycles.

Traceability Requirements:

- Trace context type, cycle lengths, translation pattern, LCM evidence, and answer.

Coverage Requirements:

- Context family.
- Number of cycles.
- LCM size.
- Direct versus indirect wording.
- Difficulty.

Audit Requirements:

- Report synchronization-context coverage.
- Report quantity visibility.
- Report LCM correctness.
- Report context-to-math traceability.

## CP-003 Missing Number Using LCM

Educational Objective:

Find a missing number that makes the full operand set have a specified LCM.

Inputs:

- known operands
- targetLcm
- visible constraint values from approved question families

Outputs:

- missingNumber

Solver Topology:

- Interpret the target LCM condition.
- Restrict possible values to values compatible with targetLcm.
- Apply only the visible values already present in the selected question template.
- Validate possible values against the target LCM condition.
- Return the unique missing number.

Future Graph Topology:

- Record known operands.
- Record targetLcm.
- Record selected CP-003 family.
- Record range, list, divisibility, or arithmetic values as applicable.
- Record possible-value checking evidence.
- Record final missingNumber.
- Record verification that LCM(all operands) equals targetLcm.

Validation Requirements:

- Validate targetLcm is positive.
- Validate known operands are positive integers.
- Validate the missing number is unique under the selected family-specific values.
- Validate LCM(known operands plus missingNumber) equals targetLcm.
- Reject underdetermined or multi-answer instances.

Traceability Requirements:

- Trace known operands, targetLcm, selected CP-003 family, family-specific values, possible-value evidence, selected missing number, and verification LCM.

Coverage Requirements:

- CP-003 family.
- Number-list size or range size.
- Target LCM size.
- Number of known operands.
- Divisibility-condition complexity.
- Arithmetic-condition complexity.
- Difficulty.

Audit Requirements:

- Report uniqueness validation.
- Report rejected underdetermined cases.
- Report target LCM correctness.
- Report possible-value evidence completeness.

## CP-004 Count Common Multiples In A Range

Educational Objective:

Count common multiples of the given numbers within a finite range.

Inputs:

- numbers
- lowerBound
- upperBound

Outputs:

- commonMultipleCount

Solver Topology:

- Compute LCM(numbers).
- Count multiples of the LCM within the inclusive range.
- Return the count.

Future Graph Topology:

- Record operands.
- Record range bounds.
- Record LCM computation evidence.
- Record range-count formula.
- Record final commonMultipleCount.

Validation Requirements:

- Validate bounds are positive integers and lowerBound <= upperBound.
- Validate every counted number is divisible by all operands.
- Validate count matches floor(upperBound / LCM) - floor((lowerBound - 1) / LCM).

Traceability Requirements:

- Trace operands, bounds, LCM, count formula, and answer.

Coverage Requirements:

- Range width.
- LCM size.
- Zero-count versus positive-count cases.
- Difficulty.

Audit Requirements:

- Report range-count coverage.
- Report zero-count and positive-count coverage.
- Report LCM correctness and count correctness.

## CP-005 Smallest Common Multiple Greater Than A Threshold

Educational Objective:

Find the smallest common multiple of the given numbers greater than a specified threshold.

Inputs:

- numbers
- threshold

Outputs:

- smallestCommonMultipleAboveThreshold

Solver Topology:

- Compute LCM(numbers).
- Find the first multiple of LCM greater than threshold.
- Return that multiple.

Future Graph Topology:

- Record operands.
- Record threshold.
- Record LCM computation evidence.
- Record next-multiple selection formula.
- Record final selected common multiple.

Validation Requirements:

- Validate threshold is a non-negative integer.
- Validate answer is greater than threshold.
- Validate answer is divisible by every operand.
- Validate answer - LCM is not also greater than threshold.

Traceability Requirements:

- Trace operands, threshold, LCM, selected multiplier, formula evidence, and answer.

Coverage Requirements:

- Threshold size.
- Selected multiplier size.
- Cases where threshold is itself a common multiple.
- Cases where threshold is not a common multiple.
- Difficulty.

Audit Requirements:

- Report threshold coverage.
- Report selected-multiple correctness.
- Report LCM evidence completeness.

## Phase A Non-Implementation Rule

This document is not authorization to create runtime.

Do not create until later approval:

- types.ts.
- math.ts.
- library.ts.
- parameter-generator.ts.
- solver.ts.
- reasoning-graph.ts.
- explanation-renderer.ts.
- validator.ts.
- pipeline.ts.
- coverage-auditor.ts.
- index.ts.
- tests.
- audits.
- JSON educational libraries.

## Recommended Next Step

Conduct human review of CP-001 through CP-005.

After CP approval, create the educational library package:

- question-language.library.json.
- explanation.library.json.
- coverage-targets.library.json.
- distribution-targets.library.json.
- variable-ranges.library.json.
- library-authority-map.md.
