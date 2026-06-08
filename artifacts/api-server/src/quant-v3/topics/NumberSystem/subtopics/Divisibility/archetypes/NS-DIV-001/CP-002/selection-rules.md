# CP-002 Selection Rules

## Scope

This file defines valid digit set construction and largest digit selection for CP-002 only.

It is specification only and does not implement selection logic.

## Valid Digit Set

| Field | Requirement | Review Status |
| --- | --- | --- |
| Valid Digit Set | The set of allowed candidates that satisfy the approved divisibility condition. For first missing position, allowed candidates are 1-9. For other positions, allowed candidates are 0-9. | PENDING HUMAN REVIEW |
| Source | Complete evaluated candidate set. | PENDING HUMAN REVIEW |
| Required For Output | Yes | PENDING HUMAN REVIEW |
| Required For Graph | Yes | PENDING HUMAN REVIEW |
| Required For Explanation | Yes | PENDING HUMAN REVIEW |
| Required For Validation | Yes | PENDING HUMAN REVIEW |
| Required For Audit | Yes | PENDING HUMAN REVIEW |

## Construction Rules

| Rule | Requirement | Review Status |
| --- | --- | --- |
| Candidate universe must be evaluated first | Required | PENDING HUMAN REVIEW |
| Only valid candidates may enter the valid digit set | Required | PENDING HUMAN REVIEW |
| Invalid candidates must not enter the valid digit set | Required | PENDING HUMAN REVIEW |
| Valid digit set must be derived from candidate evaluation results | Required | PENDING HUMAN REVIEW |

## Sorting Rules

| Field | Requirement |
| --- | --- |
| Sorting Order | Ascending |
| Review Status | PENDING HUMAN REVIEW |

## Largest Digit Selection Rule

| Field | Requirement |
| --- | --- |
| Selection Rule | Select maximum element. |
| Output Type | Single Digit |
| Review Status | PENDING HUMAN REVIEW |

## Tie Handling

| Field | Value |
| --- | --- |
| Decision Status | EXPLICITLY DOCUMENTED |
| Rule | A digit set cannot contain duplicate digit values. Tie handling is not expected for a set of unique digits. |
| Implementation Requirement | If future representation allows duplicate candidates, human review must define tie handling before implementation. |
| Review Status | PENDING HUMAN REVIEW |

## Empty Set Handling

| Field | Value |
| --- | --- |
| Decision Status | APPROVED |
| Rule | Empty valid digit sets are forbidden. |
| Generation Requirement | Valid Digit Set Size >= 1 |
| If Empty Set Occurs | Reject instance; regenerate instance. |
| Review Status | APPROVED |
