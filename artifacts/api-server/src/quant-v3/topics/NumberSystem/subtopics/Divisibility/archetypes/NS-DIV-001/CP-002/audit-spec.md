# CP-002 Audit Specification

## Scope

This file specifies audit reporting requirements for CP-002 only.

It does not implement audit code or generate audit outputs.

## Required Audit Fields

| Audit Field | Requirement | Review Status |
| --- | --- | --- |
| Question Count | Report total CP-002 questions in the audited batch. | PENDING HUMAN REVIEW |
| Largest Digit Distribution | Report selected largest valid digit frequency. | PENDING HUMAN REVIEW |
| Valid Set Size Distribution | Report frequency of valid digit set sizes. | PENDING HUMAN REVIEW |
| Divisor Distribution | Report divisor frequency. | PENDING HUMAN REVIEW |
| Pattern Distribution | Report number pattern frequency. | PENDING HUMAN REVIEW |
| Explanation Style Distribution | Report ES-001, ES-002, and ES-003 usage. | PENDING HUMAN REVIEW |
| Failure Reporting Requirements | Report validation, language, realism, graph, and explanation consistency failures. | PENDING HUMAN REVIEW |

## Failure Reporting Requirements

| Failure Area | Requirement |
| --- | --- |
| Candidate Set Failure | Report when candidate universe, order, or evaluation completeness is invalid. |
| Valid Digit Set Failure | Report when valid digit set construction is inconsistent with candidate evaluation. |
| Largest Digit Failure | Report when selected answer is not the maximum valid digit. |
| Divisor Failure | Report unsupported or unapproved divisor cases. |
| Pattern Failure | Report unsupported or unapproved number pattern cases. |
| Explanation Style Failure | Report explanation style outside ES-001, ES-002, or ES-003. |
| Graph Failure | Report missing, extra, or incorrectly ordered graph nodes. |
| Review Status | PENDING HUMAN REVIEW |

## Audit Boundary

| Rule | Status |
| --- | --- |
| Audit must not create educational content | Required |
| Audit must not infer new realism rules | Required |
| Audit must not approve unsupported cases | Required |
| Audit must expose unresolved cases for human review | Required |

