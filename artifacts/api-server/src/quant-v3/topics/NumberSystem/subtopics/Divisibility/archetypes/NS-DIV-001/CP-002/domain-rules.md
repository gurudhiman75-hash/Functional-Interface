# CP-002 Domain Rules

## Scope

This file defines domain rules for CP-002 only.

It is specification only and does not implement generation, solving, validation, graph construction, or explanation rendering.

## Required Domain Rules

| Rule | Requirement | Review Status |
| --- | --- | --- |
| Allowed Digits | 0-9 | PENDING HUMAN REVIEW |
| Exactly One Missing Digit | Required | PENDING HUMAN REVIEW |
| Exactly One Divisor | Required | PENDING HUMAN REVIEW |
| Exactly One Number Pattern | Required | PENDING HUMAN REVIEW |

## Leading Zero Rules

| Field | Value |
| --- | --- |
| Decision Status | APPROVED |
| Rule | When the missing digit is in the first position, digit 0 is prohibited. |
| Approved Candidate Digits For First Position | 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| Reason | Numbers with a leading zero are not treated as valid number formations for NS-DIV-001. |
| Review Status | APPROVED |

## Domain Rejection Conditions

| Condition | Status |
| --- | --- |
| More than one missing digit | Reject |
| No missing digit | Reject |
| More than one divisor | Reject |
| No divisor | Reject |
| Number pattern not approved for NS-DIV-001 | Reject |
| Digit outside 0-9 | Reject |
| Digit 0 in first missing position | Reject |
