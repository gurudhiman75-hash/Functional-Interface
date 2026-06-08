# CP-002 Validation Specification

## Scope

This file specifies validation requirements for CP-002 only.

It does not implement validators or validation code.

## Candidate Set Validation

| Requirement | Status |
| --- | --- |
| Candidate universe must match approved CP-002 candidate universe | Required |
| Candidate universe must exclude digit 0 when the missing digit is in the first position | Required |
| Candidate evaluation order must be ascending | Required |
| Every candidate must have an evaluation result | Required |
| Partial candidate evaluation must fail validation | Required |
| Review Status | PENDING HUMAN REVIEW |

## Valid Digit Set Validation

| Requirement | Status |
| --- | --- |
| Valid digit set must be derived from evaluated candidates | Required |
| Every valid digit must satisfy the selected divisibility rule | Required |
| Invalid candidates must not appear in the valid digit set | Required |
| Valid set size must match the valid digit set | Required |
| Valid set size must be at least 1 | Required |
| Empty valid digit sets must be rejected | Required |
| Empty valid digit set instances must be regenerated | Required |

## Largest Digit Validation

| Requirement | Status |
| --- | --- |
| Selected answer must be a single digit | Required |
| Selected answer must appear in the valid digit set | Required |
| Selected answer must be the maximum element of the valid digit set | Required |
| Selected answer must satisfy the divisor condition | Required |
| Review Status | PENDING HUMAN REVIEW |

## Graph Consistency Validation

| Requirement | Status |
| --- | --- |
| Graph must contain exactly the seven approved CP-002 nodes | Required |
| Graph node order must match the CP-002 graph specification | Required |
| Node outputs must feed dependent node inputs | Required |
| Valid digit set in graph must match candidate evaluation results | Required |
| Largest valid digit in graph must match final answer | Required |
| Review Status | PENDING HUMAN REVIEW |

## Explanation Consistency Validation

| Requirement | Status |
| --- | --- |
| Explanation must consume CP-002 graph output | Required |
| Explanation style must be one of ES-001, ES-002, or ES-003 | Required |
| Explanation must not introduce unsupported valid digits | Required |
| Explanation must not contradict largest digit selection | Required |
| Explanation must not include implementation language | Required |
| Review Status | PENDING HUMAN REVIEW |

## Review Status

| Area | Status |
| --- | --- |
| Candidate set validation | PENDING HUMAN REVIEW |
| Valid digit set validation | APPROVED FOR EMPTY SET HANDLING |
| Largest digit validation | PENDING HUMAN REVIEW |
| Graph consistency validation | PENDING HUMAN REVIEW |
| Explanation consistency validation | PENDING HUMAN REVIEW |
