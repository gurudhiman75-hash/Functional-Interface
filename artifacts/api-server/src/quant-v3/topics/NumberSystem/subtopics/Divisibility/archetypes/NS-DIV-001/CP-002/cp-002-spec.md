# CP-002 Gold Standard Specification

## Scope

This package specifies CP-002 for NS-DIV-001 only.

This file is specification only. It does not define generators, solver logic, graph logic, validators, stems, explanations, distractors, or implementation code.

## Canonical Problem Definition

| Field | Value |
| --- | --- |
| Archetype ID | NS-DIV-001 |
| Archetype Name | Single Missing Digit Divisibility |
| Canonical Problem ID | CP-002 |
| Canonical Problem Name | Find Largest Valid Digit |
| Educational Definition | Given a number containing exactly one missing digit and a divisibility condition, determine the largest digit that makes the number satisfy the divisibility condition. |
| Expected Output | Single Digit |
| Review Status | PENDING HUMAN REVIEW |

## Relationship To Other Canonical Problems

| Related Canonical Problem | Relationship |
| --- | --- |
| CP-001 | CP-002 depends on candidate validity, then applies largest-valid selection. |
| CP-003 | CP-002 shares valid digit set construction, but selects the largest valid digit instead of the smallest valid digit. |
| CP-004 | CP-002 shares valid digit set construction, but returns one selected digit instead of the count of valid digits. |

## Educational Ownership Rules

| Rule | Status |
| --- | --- |
| CP-002 belongs only to NS-DIV-001 | Required |
| CP-002 must use reviewed NS-DIV-001 divisor capabilities | Required |
| CP-002 must use reviewed NS-DIV-001 number patterns | Required |
| CP-002 must not introduce new archetypes | Required |
| CP-002 must not introduce new explanation styles | Required |
| CP-002 must not introduce shortcuts unless later approved by human review | Required |

## Implementation Boundary

| Area | Status |
| --- | --- |
| Parameter generation | NOT IMPLEMENTED IN THIS PHASE |
| Solver logic | NOT IMPLEMENTED IN THIS PHASE |
| Reasoning graph builder | NOT IMPLEMENTED IN THIS PHASE |
| Explanation renderer changes | NOT IMPLEMENTED IN THIS PHASE |
| Validator changes | NOT IMPLEMENTED IN THIS PHASE |
| Audit code changes | NOT IMPLEMENTED IN THIS PHASE |

