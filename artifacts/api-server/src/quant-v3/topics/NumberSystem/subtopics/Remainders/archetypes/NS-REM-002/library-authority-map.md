# NS-REM-002 Library Authority Map

## Status

Specification Status: LIBRARY DESIGN COMPLETE

Implementation Status: NOT IMPLEMENTED

## Scope

This authority map defines the human-owned educational libraries required before NS-REM-002 implementation begins.

Active canonical problems:

- CP-001 through CP-009

Removed canonical problems:

- CP-010
- CP-011

## Authority Table

| Library Name | Owner | Purpose | Runtime Usage | Validation Rules |
|---|---|---|---|---|
| variable-ranges.library.json | Human reviewer | Defines divisor, remainder, lower bound, upper bound, dividend, and quotient ranges by difficulty and CP. | Future parameter generation must select only values permitted by this library. | Divisor must be 2-100. Remainder must satisfy 0 <= remainder < divisor. Bounds must satisfy upperBound > lowerBound. CP-010 and CP-011 must be rejected. |
| coverage-targets.library.json | Human reviewer | Defines required coverage for difficulty, divisors, remainders, bounds, question language, and explanations. | Future audits must report coverage against these targets. | No mandatory category may be unused in audit output. Coverage gaps must be reported. |
| question-language.library.json | Human reviewer | Stores self-contained approved question wording for CP-001 through CP-009. | Future question rendering must use only entries from this library. | Rendered questions must display all required givens for the CP. Placeholder-only or incomplete stems must fail validation. |
| explanation.library.json | Human reviewer | Stores approved explanation families for direct reconstruction, missing component, bounded search, range counting, and range summation. | Future explanation rendering must select from the family mapped to the CP topology. | Explanation ID must exist and belong to the CP's topology. Runtime must reject missing entries. |
| distribution-targets.library.json | Human reviewer | Defines distribution targets for difficulty, question language, explanation style, divisors, and CP exposure. | Future generators and audits must use these targets for batch balancing and reporting. | Difficulty targets are Easy 40%, Medium 40%, Hard 20%. Question language and explanation styles are uniform. |

## CP Educational Ownership

Every active CP has defined:

- Educational Objective
- Inputs
- Outputs
- Variable Universe
- Difficulty Drivers
- Coverage Requirements

The authoritative CP-level definitions are in:

- variable-ranges.library.json
- canonical-problems.md

If a conflict exists, implementation must pause for human review rather than infer a correction.

## Runtime Eligibility

Runtime-eligible CPs after approval:

- CP-001
- CP-002
- CP-003
- CP-004
- CP-005
- CP-006
- CP-007
- CP-008
- CP-009

Runtime-ineligible CPs:

- CP-010
- CP-011

Validators must reject CP-010 and CP-011.

## Question Self-Containment Rules

Every rendered question must visibly include all values required to solve the problem:

- CP-001: divisor, quotient, remainder
- CP-002: divisor, remainder, lower bound
- CP-003: divisor, remainder, upper bound
- CP-004: divisor, remainder, lower bound, upper bound
- CP-005: divisor, remainder, lower bound, upper bound
- CP-006: dividend, quotient, remainder
- CP-007: dividend, divisor, remainder
- CP-008: dividend, divisor, quotient
- CP-009: divisor, quotient, remainder

Any missing visible given must fail validation.

## Explanation Family Mapping

| Topology | CPs | Explanation Family |
|---|---|---|
| Direct Reconstruction | CP-001, CP-009 | EF-001 |
| Bounded Search | CP-002, CP-003 | EF-003 |
| Range Counting | CP-004 | EF-004 |
| Range Summation | CP-005 | EF-005 |
| Missing Component | CP-006, CP-007, CP-008 | EF-002 |

## Implementation Gate

Implementation may begin after approval of:

- variable-ranges.library.json
- coverage-targets.library.json
- question-language.library.json
- explanation.library.json
- distribution-targets.library.json
- library-authority-map.md

No generator, solver, validator, reasoning graph, pipeline, test, or audit is created by this library design package.

## Success State

NS-REM-002 now has a complete educational library design package.

All active CPs have explicit educational decisions.

Implementation can begin immediately after library approval.
