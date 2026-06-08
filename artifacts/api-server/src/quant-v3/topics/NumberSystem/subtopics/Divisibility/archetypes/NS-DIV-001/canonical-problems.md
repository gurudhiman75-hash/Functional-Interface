# NS-DIV-001 Canonical Problems Specification

## Purpose

Define the canonical problem specifications for NS-DIV-001.

These entries are specifications only. They are not questions, stems, explanations, distractors, numerical examples, solver code, graph code, or implementation.

## Canonical Problem Ownership

Every canonical problem in this file belongs only to NS-DIV-001 and must be implemented through the NS-DIV-001 solver and reasoning graph specifications.

| Rule | Status |
| --- | --- |
| Parent archetype must be NS-DIV-001 | Required |
| Source references must be reviewed before implementation | Required |
| Problem structure must be manually accepted | Required |
| Solver expectations must map to `solver-spec.md` | Required |
| Graph expectations must map to `reasoning-graph-spec.md` | Required |
| Student-facing content must not be stored here | Required |

## Canonical Problem Schema

| Field | Requirement |
| --- | --- |
| ID | Required |
| Name | Required |
| Mission | Specification-only objective |
| Expected Output Type | Required |
| Required Solver Capabilities | Must map to solver stages |
| Required Graph Capabilities | Must map to graph node types |
| Validation Requirements | Must map to validation specification |
| Review Status | IMPLEMENTED |

## Canonical Problem Specifications

### CP-001: Find Missing Digit

| Field | Value |
| --- | --- |
| ID | CP-001 |
| Name | Find Missing Digit |
| Mission | Determine the valid missing digit for a reviewed single-missing-digit divisibility structure. |
| Expected Output Type | Single digit |
| Required Solver Capabilities | Problem recognition; constraint extraction; rule selection; condition construction; candidate resolution; verification; answer production |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Validation Requirements | Exactly one missing digit; approved canonical problem ownership; approved rule contract; single answer contract; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-002: Find Largest Valid Digit

| Field | Value |
| --- | --- |
| ID | CP-002 |
| Name | Find Largest Valid Digit |
| Mission | Determine the largest valid digit from the verified candidate set for a reviewed single-missing-digit divisibility structure. |
| Expected Output Type | Single digit selected by largest-valid criterion |
| Required Solver Capabilities | Problem recognition; constraint extraction; rule selection; condition construction; candidate set resolution; ordered candidate selection; verification; answer production |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Validation Requirements | Candidate set metadata present; largest-valid selection contract preserved; approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-003: Find Smallest Valid Digit

| Field | Value |
| --- | --- |
| ID | CP-003 |
| Name | Find Smallest Valid Digit |
| Mission | Determine the smallest valid digit from the verified candidate set for a reviewed single-missing-digit divisibility structure. |
| Expected Output Type | Single digit selected by smallest-valid criterion |
| Required Solver Capabilities | Problem recognition; constraint extraction; rule selection; condition construction; candidate set resolution; ordered candidate selection; verification; answer production |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Validation Requirements | Candidate set metadata present; smallest-valid selection contract preserved; approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-004: Count Valid Digits

| Field | Value |
| --- | --- |
| ID | CP-004 |
| Name | Count Valid Digits |
| Mission | Determine how many digits satisfy the reviewed single-missing-digit divisibility structure. |
| Expected Output Type | Count |
| Required Solver Capabilities | Problem recognition; constraint extraction; rule selection; condition construction; candidate set resolution; count aggregation; verification; answer production |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Validation Requirements | Candidate set metadata present; count output contract preserved; approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-005: Sum Of Valid Digits

| Field | Value |
| --- | --- |
| ID | CP-005 |
| Name | Sum Of Valid Digits |
| Mission | Determine the sum of all digits that satisfy the reviewed single-missing-digit divisibility structure. |
| Expected Output Type | Sum |
| Required Solver Capabilities | Problem recognition; constraint extraction; rule selection; condition construction; candidate set resolution; sum aggregation; verification; answer production |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Condition Construction; Candidate Evaluation; Verification; Answer Production |
| Validation Requirements | Candidate set metadata present; sum output contract preserved; approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-006: Form Greatest Valid Number

| Field | Value |
| --- | --- |
| ID | CP-006 |
| Name | Form Greatest Valid Number |
| Mission | Form the greatest valid number by replacing x with the maximum digit from the valid digit set. |
| Expected Output Type | Number |
| Required Solver Capabilities | Problem recognition; divisor recognition; rule selection; candidate generation; valid digit identification; maximum selection; number formation |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Candidate Generation; Valid Digit Identification; Maximum Selection; Number Formation |
| Validation Requirements | Answer equals number formed using Maximum(Valid Digit Set); approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

### CP-007: Form Smallest Valid Number

| Field | Value |
| --- | --- |
| ID | CP-007 |
| Name | Form Smallest Valid Number |
| Mission | Form the smallest valid number by replacing x with the minimum digit from the valid digit set. |
| Expected Output Type | Number |
| Required Solver Capabilities | Problem recognition; divisor recognition; rule selection; candidate generation; valid digit identification; minimum selection; number formation |
| Required Graph Capabilities | Problem Recognition; Divisor Recognition; Rule Selection; Candidate Generation; Valid Digit Identification; Minimum Selection; Number Formation |
| Validation Requirements | Answer equals number formed using Minimum(Valid Digit Set); approved canonical problem ownership; source trace preserved |
| Review Status | IMPLEMENTED |

## Cross-Component Interaction Contract

| Component | Responsibility |
| --- | --- |
| Canonical Problem Specification | Defines approved problem objective and output contract |
| Solver Specification | Defines how solver stages produce answer contracts |
| Reasoning Graph Specification | Defines graph nodes consumed by future explanation rendering |
| Validation Specification | Defines acceptance and rejection requirements |
| Explanation Specification | Defines future renderer constraints without creating explanations |

## Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| CP-001 is implemented | IMPLEMENTED | Runtime verified |
| CP-002 is implemented | IMPLEMENTED | Runtime verified |
| CP-003 is implemented | IMPLEMENTED | Runtime verified |
| CP-004 is implemented | IMPLEMENTED | Runtime verified |
| CP-005 is implemented | IMPLEMENTED | Runtime verified |
| CP-006 is implemented | IMPLEMENTED | Runtime verified |
| CP-007 is implemented | IMPLEMENTED | Runtime verified |
| Solver mapping is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Graph mapping is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Validation mapping is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
