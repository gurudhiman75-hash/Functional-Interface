# CP-002 Reasoning Graph Specification

## Scope

This file specifies the CP-002 reasoning graph only.

It does not implement graph construction, solver logic, validators, explanation rendering, or educational content generation.

## Required Node Order

The CP-002 reasoning graph must use exactly the following nodes.

| Node Number | Node Name |
| --- | --- |
| Node 1 | Recognize Divisor |
| Node 2 | Select Divisibility Rule |
| Node 3 | Generate Candidate Digit Set |
| Node 4 | Evaluate Candidates |
| Node 5 | Build Valid Digit Set |
| Node 6 | Select Largest Valid Digit |
| Node 7 | Verify Result |

No additional graph nodes are approved in this phase.

## Node 1: Recognize Divisor

| Field | Specification |
| --- | --- |
| Mission | Confirm the single divisor supplied for CP-002. |
| Inputs | Archetype ID; Canonical Problem ID; divisor metadata; source reference metadata. |
| Outputs | Recognized divisor; divisor ownership status; divisor capability reference. |
| Dependencies | Approved NS-DIV-001 divisor capability library. |
| Validation Requirements | Exactly one divisor must be present; divisor must be approved for CP-002 before implementation can proceed. |
| Review Status | PENDING HUMAN REVIEW |

## Node 2: Select Divisibility Rule

| Field | Specification |
| --- | --- |
| Mission | Select the reviewed divisibility rule associated with the recognized divisor. |
| Inputs | Recognized divisor; divisor capability reference. |
| Outputs | Divisibility rule reference; rule approval status. |
| Dependencies | Node 1; approved reasoning pattern mapping for the divisor. |
| Validation Requirements | Rule must be sourced from approved NS-DIV-001 divisor capability metadata. |
| Review Status | PENDING HUMAN REVIEW |

## Node 3: Generate Candidate Digit Set

| Field | Specification |
| --- | --- |
| Mission | Provide the complete candidate digit universe for CP-002 evaluation. |
| Inputs | Allowed digit domain; missing digit metadata; leading zero review status. |
| Outputs | Candidate digit set; candidate evaluation order. |
| Dependencies | Domain rules; candidate rules. |
| Validation Requirements | Candidate digit set must contain the approved candidate universe; evaluation order must be ascending. |
| Review Status | PENDING HUMAN REVIEW |

## Node 4: Evaluate Candidates

| Field | Specification |
| --- | --- |
| Mission | Evaluate every candidate against the selected divisibility rule. |
| Inputs | Candidate digit set; number pattern metadata; selected divisibility rule; divisor metadata. |
| Outputs | Candidate evaluation results; valid or invalid status for every candidate. |
| Dependencies | Node 2; Node 3. |
| Validation Requirements | Every candidate must have an explicit evaluation result; partial evaluation is not allowed. |
| Review Status | PENDING HUMAN REVIEW |

## Node 5: Build Valid Digit Set

| Field | Specification |
| --- | --- |
| Mission | Construct the valid digit set from candidate evaluation results. |
| Inputs | Candidate evaluation results. |
| Outputs | Valid digit set; valid set size. |
| Dependencies | Node 4. |
| Validation Requirements | Valid digit set must include only candidates marked valid; valid set size must match the valid digit set. |
| Review Status | PENDING HUMAN REVIEW |

## Node 6: Select Largest Valid Digit

| Field | Specification |
| --- | --- |
| Mission | Select the maximum element from the valid digit set. |
| Inputs | Valid digit set; sorting rule. |
| Outputs | Largest valid digit; selection metadata. |
| Dependencies | Node 5; selection rules. |
| Validation Requirements | Selected digit must be the maximum element of the valid digit set; empty set handling remains unresolved until human review. |
| Review Status | PENDING HUMAN REVIEW |

## Node 7: Verify Result

| Field | Specification |
| --- | --- |
| Mission | Verify that the selected largest valid digit satisfies the divisibility condition and selection rule. |
| Inputs | Largest valid digit; valid digit set; divisor metadata; number pattern metadata. |
| Outputs | Verification status; validation payload; explanation payload. |
| Dependencies | Node 6. |
| Validation Requirements | Selected digit must satisfy the divisibility condition and must equal the maximum element of the valid digit set. |
| Review Status | PENDING HUMAN REVIEW |

## Graph Boundary

| Rule | Status |
| --- | --- |
| Graph must remain CP-002 specific | Required |
| Graph must not add unapproved nodes | Required |
| Graph must not create explanation language | Required |
| Graph must not implement solver shortcuts | Required |
| Graph must preserve source trace metadata | Required |

