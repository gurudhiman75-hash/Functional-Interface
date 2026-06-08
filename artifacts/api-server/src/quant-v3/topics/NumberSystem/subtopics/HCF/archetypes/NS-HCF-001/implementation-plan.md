# NS-HCF-001 Implementation Plan

## Status

Plan Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT STARTED

Library Status: NOT CREATED

## Summary

NS-HCF-001 must implement only the approved canonical problem set after human approval and after educational libraries are created:

- CP-001 through CP-004

No implementation may begin from this Phase A package alone.

## Architecture To Reuse

Use the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001
- NS-PF-001
- NS-FAC-001

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
- Audit Framework.
- Coverage Framework.
- Human Review Framework.

## Educational Wording Ownership

Educational wording ownership is 100% human owned.

Future runtime may:

- substitute variables into approved templates.
- select approved templates from human-owned libraries.

Future runtime may not:

- generate constraint language.
- generate educational sentences.
- generate explanations.
- create fallback question wording.
- create fallback solution wording.

## Shared Future Abstraction

All CPs should share a future HCF abstraction derived from operands:

hcfModel:

- operands
- operandCount
- operandPrimeFactorizations
- commonPrimeBases
- minimumCommonExponents
- hcf
- hcfPrimeFactorization
- hcfEqualsOne
- pairwiseGcdEvidence where applicable

For CP-002:

- hcfFactorCount
- commonDivisorCount
- hcfFactorCountFormula

For CP-003:

- targetHcf
- knownOperands
- missingNumber
- rangeStart and rangeEnd for range-based stems
- numberList for list-based stems
- divisibleBy and notDivisibleBy for divisibility-restriction stems
- baseNumber, increase, and decrease for arithmetic-condition stems
- candidateEvaluationEvidence

For CP-004:

- contextualQuantities
- equalGroupingInterpretation
- maximumEqualGroupSize

This is an implementation planning abstraction only. No runtime type or API is created in Phase A.

## CP-001 Direct HCF Computation

Educational Objective:

Find the highest common factor of two or three positive integers.

Inputs:

- numbers

Outputs:

- hcf

Solver Topology:

- Accept two or three operands.
- Compute HCF by prime-factor intersection or pairwise GCD.
- If using prime-factor evidence, keep common prime bases with minimum exponents.
- Return the HCF value.

Future Graph Topology:

- Record operands.
- Record operand count.
- Record prime factorization evidence or pairwise GCD evidence.
- Record common prime bases and minimum exponents.
- Record final HCF.

Validation Requirements:

- Validate operands are positive integers greater than 1 unless a later library explicitly approves 1.
- Validate operand count is 2 or 3.
- Validate computed HCF divides every operand.
- Validate no larger common divisor exists.

Traceability Requirements:

- Trace archetype ID, CP ID, difficulty, operands, operand count, reasoning pattern, HCF evidence, and answer.

Coverage Requirements:

- Operand count.
- Difficulty.
- Coprime versus non-coprime operands.
- HCF equals 1 versus HCF greater than 1.
- Prime-factor complexity.
- Common-prime-base count.
- Maximum common exponent.

Audit Requirements:

- Report generation validity.
- Report answer correctness.
- Report reasoning evidence completeness.
- Report coverage for operand count, difficulty, coprime status, and HCF size.

## CP-002 Count Common Divisors

Educational Objective:

Find how many positive divisors are common to all given numbers.

Inputs:

- numbers

Outputs:

- commonDivisorCount

Solver Topology:

- Compute HCF(numbers).
- Use NS-FAC-001 factor-count logic to count factors of the HCF.
- Return the factor count of the HCF.

Future Graph Topology:

- Record operands.
- Record HCF computation evidence.
- Record HCF prime factorization.
- Record factor-count formula for HCF.
- Record final commonDivisorCount.

Validation Requirements:

- Validate operands and operand count.
- Validate HCF.
- Validate commonDivisorCount equals the number of positive factors of HCF.
- Validate common divisors are divisors of every operand.

Traceability Requirements:

- Trace dependency on CP-001 HCF computation and NS-FAC-001 factor-count topology.
- Trace operands, HCF, HCF factorization, factor-count evidence, and answer.

Coverage Requirements:

- Operand count.
- HCF factor count buckets.
- HCF equals 1.
- HCF prime-power versus mixed-prime HCF.
- Difficulty.

Audit Requirements:

- Report derived-topology coverage.
- Report factor-count evidence completeness.
- Report correctness against both HCF and factor-count checks.

## CP-003 Missing Operand Using HCF

Educational Objective:

Find a missing number that makes the full operand set have a specified HCF.

Inputs:

- known operands
- targetHcf
- range values, number lists, divisibility values, or arithmetic values from approved CP-003 question families

Outputs:

- missingNumber

Solver Topology:

- Interpret the target HCF condition.
- Restrict the missing number to values compatible with targetHcf.
- Apply only the approved family-specific values already present in the selected question template.
- Validate possible values against the approved HCF condition and the selected family-specific values.
- Return the unique missing number.

Future Graph Topology:

- Record known operands.
- Record targetHcf.
- Record selected CP-003 family.
- Record range values, number list, divisibility values, or arithmetic values as applicable.
- Record candidate evaluation evidence.
- Record final missingNumber.
- Record verification that HCF(all operands) equals targetHcf.

Validation Requirements:

- Validate targetHcf is positive.
- Validate known operands are positive integers.
- Validate the missing number is unique under the selected family-specific values.
- Validate HCF(known operands plus missingNumber) equals targetHcf.
- Reject underdetermined or multi-answer instances.

Traceability Requirements:

- Trace known operands, targetHcf, selected CP-003 family, family-specific values, candidate evidence, selected missing number, and verification HCF.

Coverage Requirements:

- CP-003 family.
- Number-list size or range size.
- Target HCF size.
- Number of known operands.
- Divisibility-restriction complexity.
- Arithmetic-condition complexity.
- Difficulty.

Audit Requirements:

- Report uniqueness validation.
- Report rejected underdetermined cases.
- Report target HCF correctness.
- Report candidate evaluation completeness.

## CP-004 Maximum Equal Grouping / HCF Word Application

Educational Objective:

Find the largest equal group size that divides all contextual quantities exactly.

Inputs:

- contextual quantities

Outputs:

- maximumEqualGroupSize

Solver Topology:

- Extract quantities from the problem context.
- Recognize the maximum equal grouping condition.
- Compute HCF of the quantities.
- Return the HCF as maximumEqualGroupSize.

Future Graph Topology:

- Record contextual quantities.
- Record translation from context to HCF.
- Record operand set.
- Record HCF computation evidence.
- Record final maximumEqualGroupSize.

Validation Requirements:

- Validate every required quantity is visible in the rendered question.
- Validate maximumEqualGroupSize divides every quantity exactly.
- Validate no larger group size divides every quantity.
- Validate the context matches equal grouping or equal partitioning with no remainder.

Traceability Requirements:

- Trace context type, quantities, extracted operands, translation pattern, HCF evidence, and answer.

Coverage Requirements:

- Number of contextual quantities.
- Direct versus indirect equal-grouping wording.
- Coprime versus non-coprime quantities.
- HCF size.
- Difficulty.

Audit Requirements:

- Report translation-pattern coverage.
- Report quantity visibility.
- Report HCF correctness.
- Report context-to-math traceability.

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

Conduct human review of CP-001 through CP-004.

After CP approval, create the educational library package:

- question-language.library.json.
- explanation.library.json.
- coverage-targets.library.json.
- distribution-targets.library.json.
- variable-ranges.library.json.
- library-authority-map.md.
