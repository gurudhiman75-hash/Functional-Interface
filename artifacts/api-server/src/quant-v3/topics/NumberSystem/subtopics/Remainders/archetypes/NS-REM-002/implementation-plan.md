# NS-REM-002 Revised Implementation Plan

## Status

Plan Status: REGENERATED AFTER CANONICAL PROBLEM REDESIGN

Implementation Status: NOT STARTED

## Summary

NS-REM-002 must implement only the revised non-redundant canonical problem set:

- CP-001 through CP-009

Removed:

- CP-010
- CP-011

No implementation may begin until the revised CP architecture is approved.

## Architecture To Reuse

Use the frozen NS-DIV-001 and NS-REM-001 architecture:

- Library registry
- Parameter generator
- Solver
- Reasoning graph builder
- Explanation renderer
- Validator
- Pipeline
- Coverage auditor
- Traceability contract
- Maturity audit

Do not redesign:

- Pattern System V2
- Validation framework
- Audit framework
- Traceability framework
- Reasoning graph framework

## Active CP Implementation Model

### CP-001 and CP-009

Input:

- Divisor
- Quotient
- Remainder

Output:

- Dividend

Answer rule:

Dividend = Divisor * Quotient + Remainder

### CP-002

Input:

- Divisor
- Remainder
- Lower bound

Output:

- Smallest number greater than the lower bound satisfying the remainder condition.

### CP-003

Input:

- Divisor
- Remainder
- Upper bound

Output:

- Greatest number less than the upper bound satisfying the remainder condition.

### CP-004

Input:

- Divisor
- Remainder
- Lower bound
- Upper bound

Output:

- Count of numbers in range satisfying the remainder condition.

### CP-005

Input:

- Divisor
- Remainder
- Lower bound
- Upper bound

Output:

- Sum of numbers in range satisfying the remainder condition.

### CP-006

Input:

- Dividend
- Quotient
- Remainder

Output:

- Divisor

Validity:

The recovered divisor must be positive and the remainder must be less than the divisor.

### CP-007

Input:

- Dividend
- Divisor
- Remainder

Output:

- Quotient

Validity:

The recovered quotient must be an integer and the remainder must be less than the divisor.

### CP-008

Input:

- Dividend
- Divisor
- Quotient

Output:

- Remainder

Validity:

The recovered remainder must satisfy 0 <= remainder < divisor.

## Libraries To Create After Approval

Create human-owned libraries only after this redesign is approved:

- question-language.library.json
- explanation.library.json
- difficulty-bands.library.json
- distribution-targets.library.json
- coverage-targets.library.json
- variable-ranges.library.json

Question language must be self-contained for every CP.

Every rendered question must visibly include all values needed to solve the problem.

## Validation Requirements

Validators must reject:

- CP-010
- CP-011
- Missing library entries
- Non-self-contained rendered questions
- Invalid remainder ranges
- Invalid divisor values
- Non-integral missing divisor or quotient results
- Range problems where no valid number exists unless explicitly allowed by a future human decision

## Testing Requirements

Create `ns-rem-002.test.ts` only during implementation.

Tests must verify:

- CP-001 through CP-009 pipelines
- Library loading
- Equation consistency
- Range search
- Range counting
- Range summation
- Missing divisor reconstruction
- Missing quotient reconstruction
- Missing remainder reconstruction
- Validation
- Traceability
- Coverage audit

## Audit Requirements

Generate during implementation, not during this specification update:

- coverage-audit.md
- human-review.csv
- ns-rem-002-maturity-audit.md

Coverage audit must report:

- Difficulty Coverage
- Divisor Coverage
- Question Language Coverage
- Explanation Coverage
- Most Used
- Least Used
- Unused
- Coverage Gaps

## Implementation Gate

Implementation may begin only after:

1. The revised CP architecture is approved.
2. Human-owned self-contained question language is supplied.
3. Human-owned explanation language is confirmed.
4. Variable ranges and coverage targets are approved for the redesigned CP set.
