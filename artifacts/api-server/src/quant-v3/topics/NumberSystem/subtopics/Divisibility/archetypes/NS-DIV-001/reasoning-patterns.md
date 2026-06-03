# NS-DIV-001 Reasoning Patterns Specification

## Purpose

Define approved reusable reasoning pattern contracts for NS-DIV-001.

Reasoning patterns become graph-building contracts. They contain no educational content, solved problem walkthroughs, mathematical demonstrations, implementation logic, questions, stems, explanations, or distractors.

## Reasoning Pattern Rules

- Reasoning patterns must not contain educational content.
- Reasoning patterns must not contain solved problem walkthrough content.
- Reasoning patterns must not contain numerical parameter values.
- Reasoning patterns must not contain implementation logic.
- Reasoning patterns must define reusable reasoning contracts only.
- Reasoning patterns must preserve NS-DIV-001 ownership.
- Reasoning patterns must be consumed by the reasoning graph builder.

## Shared Reasoning Pattern Contract

| Field | Requirement |
| --- | --- |
| Pattern ID | Required |
| Pattern Name | Required |
| Pattern Mission | Required |
| Required Inputs | Must map to canonical problem and parameter contracts |
| Expected Outputs | Must map to solver and graph contracts |
| Required Graph Nodes | Must map to `reasoning-graph-spec.md` |
| Allowed Graph Relationships | Must preserve graph rules |
| Validation Requirements | Must preserve ownership, source trace, and canonical problem trace |
| Applicable Canonical Problems | Must be approved CP identifiers |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-001: Digit Sum Divisibility

| Field | Specification |
| --- | --- |
| Pattern ID | RP-001 |
| Pattern Name | Digit Sum Divisibility |
| Pattern Mission | Define the reasoning contract for source-reviewed digit-sum-based divisibility conditions. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract reference; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; rule contract approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-002: Alternating Sum Divisibility

| Field | Specification |
| --- | --- |
| Pattern ID | RP-002 |
| Pattern Name | Alternating Sum Divisibility |
| Pattern Mission | Define the reasoning contract for source-reviewed alternating-sum-based divisibility conditions. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract reference; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; rule contract approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-003: Last Digit Divisibility

| Field | Specification |
| --- | --- |
| Pattern ID | RP-003 |
| Pattern Name | Last Digit Divisibility |
| Pattern Mission | Define the reasoning contract for source-reviewed last-digit-based divisibility conditions. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract reference; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; rule contract approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-004: Last Two Digits Divisibility

| Field | Specification |
| --- | --- |
| Pattern ID | RP-004 |
| Pattern Name | Last Two Digits Divisibility |
| Pattern Mission | Define the reasoning contract for source-reviewed last-two-digits-based divisibility conditions. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract reference; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; rule contract approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-005: Last Three Digits Divisibility

| Field | Specification |
| --- | --- |
| Pattern ID | RP-005 |
| Pattern Name | Last Three Digits Divisibility |
| Pattern Mission | Define the reasoning contract for source-reviewed last-three-digits-based divisibility conditions. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract reference; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; rule contract approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## RP-006: Multiple Divisibility Condition Resolution

| Field | Specification |
| --- | --- |
| Pattern ID | RP-006 |
| Pattern Name | Multiple Divisibility Condition Resolution |
| Pattern Mission | Define the reasoning contract for source-reviewed cases where more than one approved divisibility condition must be reconciled. |
| Required Inputs | Canonical problem ID; parameter contract; divisibility constraint metadata; missing digit metadata; source reference IDs |
| Expected Outputs | Rule contract references; condition construction metadata; candidate evaluation metadata; graph payload |
| Required Graph Nodes | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Allowed Graph Relationships | Required graph order from Problem Recognition through Answer Production |
| Validation Requirements | Pattern ownership preserved; source trace preserved; all rule contracts approved; candidate metadata supports requested output type |
| Applicable Canonical Problems | CP-001; CP-002; CP-003; CP-004; CP-005; CP-006; CP-007 |
| Applicable Difficulty Bands | PENDING HUMAN REVIEW |
| Review Status | PENDING HUMAN REVIEW |

## Reasoning Pattern To Pipeline Contract

| Pipeline Stage | Reasoning Pattern Responsibility |
| --- | --- |
| Canonical Problem Selection | Confirm applicable canonical problem scope |
| Parameter Resolution | Consume canonical-problem-owned parameter contract |
| Solver Invocation | Provide rule contract references to solver metadata |
| Reasoning Graph Construction | Provide graph-building contract |
| Answer Validation | Provide pattern validation metadata |
| Explanation Rendering | Provide graph output only through reasoning graph contract |

## Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| RP-001 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| RP-002 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| RP-003 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| RP-004 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| RP-005 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| RP-006 is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Reasoning graph first rule is preserved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Pattern contracts contain no implementation logic | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
