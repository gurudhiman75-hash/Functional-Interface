# CP-002 Candidate Rules

## Scope

This file defines candidate generation and candidate evaluation rules for CP-002 only.

It is specification only and does not implement candidate generation or candidate evaluation.

## Candidate Generation Process

| Step | Requirement | Review Status |
| --- | --- | --- |
| 1 | Start from the full candidate universe. | PENDING HUMAN REVIEW |
| 2 | Evaluate each candidate against the approved divisibility condition. | PENDING HUMAN REVIEW |
| 3 | Record whether each candidate is valid or invalid. | PENDING HUMAN REVIEW |
| 4 | Preserve the complete evaluated candidate set for graph, explanation, validation, and audit use. | PENDING HUMAN REVIEW |

## Candidate Universe

### Standard Candidate Universe

| Candidate |
| --- |
| 0 |
| 1 |
| 2 |
| 3 |
| 4 |
| 5 |
| 6 |
| 7 |
| 8 |
| 9 |

### First Position Candidate Universe

When the missing digit is in the first position, digit 0 is prohibited.

| Candidate |
| --- |
| 1 |
| 2 |
| 3 |
| 4 |
| 5 |
| 6 |
| 7 |
| 8 |
| 9 |

| Field | Value |
| --- | --- |
| Decision Status | APPROVED |
| Reason | Numbers with a leading zero are not treated as valid number formations for NS-DIV-001. |
| Review Status | APPROVED |

## Candidate Evaluation Order

| Field | Requirement |
| --- | --- |
| Evaluation Order | Ascending |
| First Candidate | 0 for non-first missing position; 1 for first missing position |
| Last Candidate | 9 |
| Review Status | PENDING HUMAN REVIEW |

## Candidate Validation Requirement

| Rule | Requirement |
| --- | --- |
| Every candidate must be evaluated | Required |
| Candidate evaluation must be preserved | Required |
| Candidate validity must be explicit | Required |
| Partial candidate evaluation | Prohibited |
| Review Status | PENDING HUMAN REVIEW |

## Shortcut Usage

| Field | Value |
| --- | --- |
| Shortcut Usage | Prohibited unless later approved |
| Human Approval Required | Yes |
| Review Status | PENDING HUMAN REVIEW |
