# CP-002 Capability Matrix

## Scope

This file defines the CP-002 support matrix for future implementation review.

It does not approve implementation, create generator behavior, or resolve unsupported cases.

## CP-002 Support Matrix

| Number Length And Position | Support Status | Review Status |
| --- | --- | --- |
| 4-digit first missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 4-digit middle missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 4-digit last missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 5-digit first missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 5-digit middle missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 5-digit last missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 6-digit first missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 6-digit middle missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |
| 6-digit last missing | PENDING CAPABILITY REVIEW | PENDING HUMAN REVIEW |

## Every Approved Divisor

| Requirement | Status |
| --- | --- |
| CP-002 must be reviewed against every approved NS-DIV-001 divisor before implementation | Required |
| Divisor capability support must be explicit | Required |
| Unsupported divisor cases must be documented before implementation | Required |
| Review Status | PENDING HUMAN REVIEW |

## Capability Review Requirements

| Area | Requirement |
| --- | --- |
| Number length | Must be reviewed for CP-002 support. |
| Missing position | Must be reviewed for CP-002 support. |
| Divisor | Must be reviewed for CP-002 support. |
| Leading zero behavior | APPROVED: digit 0 is prohibited when the missing digit is in the first position. |
| Empty valid set behavior | APPROVED: empty valid digit sets are forbidden; reject and regenerate the instance. |
