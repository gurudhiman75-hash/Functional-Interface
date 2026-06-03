# NS-DIV-001 Reasoning Graph Specification

## Graph Mission

Define the reasoning graph architecture for NS-DIV-001 without creating graph code.

The reasoning graph is the source of truth for how NS-DIV-001 solves, validates, and prepares explanation-ready reasoning metadata.

## Graph Ownership

The reasoning graph must be owned by NS-DIV-001. It must not depend on a global educational graph to supply archetype reasoning.

All future explanation rendering must consume graph output. The graph remains the source of truth.

```text
Reasoning Graph -> Explanation Renderer
```

## Graph Inputs

| Input | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Must be approved |
| Solver Stage Metadata | Required |
| Source Reference IDs | Required |
| Missing Digit Metadata | Required |
| Divisibility Constraint Metadata | Required |
| Requested Output Type | Required |
| Verification Metadata | Required after solver verification |

## Graph Outputs

| Output | Requirement |
| --- | --- |
| Ordered Reasoning Nodes | Required |
| Node Relationship Metadata | Required |
| Explanation Renderer Payload | Required |
| Validation Payload | Required |
| Source Trace Metadata | Required |
| Failure Metadata | Required when graph construction fails |

## Node Specifications

### Node Type: Problem Recognition

| Field | Requirement |
| --- | --- |
| Mission | Confirm archetype and canonical problem ownership |
| Required Inputs | Archetype ID, Canonical Problem ID, Source Reference IDs |
| Required Outputs | Ownership status, canonical problem status |
| Content Boundary | No stem text, no explanation text |

### Node Type: Divisor Recognition

| Field | Requirement |
| --- | --- |
| Mission | Identify the approved divisibility constraint contract |
| Required Inputs | Divisibility Constraint Metadata, Source Reference IDs |
| Required Outputs | Constraint recognition status |
| Content Boundary | No mathematical rule content, no worked problem content |

### Node Type: Rule Selection

| Field | Requirement |
| --- | --- |
| Mission | Attach the reviewed rule contract required for solving |
| Required Inputs | Constraint recognition status, Canonical Problem ID |
| Required Outputs | Rule contract reference, rule approval status |
| Content Boundary | No rule implementation, no rule explanation |

### Node Type: Condition Construction

| Field | Requirement |
| --- | --- |
| Mission | Represent the condition contract that candidate values must satisfy |
| Required Inputs | Rule contract reference, Missing Digit Metadata |
| Required Outputs | Condition contract metadata |
| Content Boundary | No implementation logic, no numeric demonstration |

### Node Type: Candidate Evaluation

| Field | Requirement |
| --- | --- |
| Mission | Represent candidate evaluation metadata for the requested output type |
| Required Inputs | Condition contract metadata, Requested Output Type |
| Required Outputs | Candidate set metadata, candidate decision metadata |
| Content Boundary | No candidate values in this specification |

### Node Type: Verification

| Field | Requirement |
| --- | --- |
| Mission | Represent verification metadata for the selected answer contract |
| Required Inputs | Candidate decision metadata, Condition contract metadata |
| Required Outputs | Verification status, failure metadata when applicable |
| Content Boundary | No verification implementation |

### Node Type: Answer Production

| Field | Requirement |
| --- | --- |
| Mission | Represent final answer contract production for downstream consumers |
| Required Inputs | Verification status, Requested Output Type |
| Required Outputs | Answer contract, explanation renderer payload, validation payload |
| Content Boundary | No final answer value in this specification |

## Graph Rules

### Allowed Node Relationships

| From Node | To Node | Rule |
| --- | --- | --- |
| Problem Recognition | Divisor Recognition | Allowed after ownership is confirmed |
| Divisor Recognition | Rule Selection | Allowed after constraint recognition succeeds |
| Rule Selection | Condition Construction | Allowed after rule contract is approved |
| Condition Construction | Candidate Evaluation | Allowed after condition metadata is complete |
| Candidate Evaluation | Verification | Allowed after candidate decision metadata exists |
| Verification | Answer Production | Allowed after verification succeeds |
| Any Node | Failure Metadata | Allowed when required metadata is missing or invalid |

### Required Node Relationships

| Relationship | Requirement |
| --- | --- |
| Problem Recognition precedes Divisor Recognition | Required |
| Divisor Recognition precedes Rule Selection | Required |
| Rule Selection precedes Condition Construction | Required |
| Condition Construction precedes Candidate Evaluation | Required |
| Candidate Evaluation precedes Verification | Required |
| Verification precedes Answer Production | Required |

### Forbidden Node Relationships

| Relationship | Reason |
| --- | --- |
| Rule Selection before Problem Recognition | Ownership must be confirmed first |
| Candidate Evaluation before Condition Construction | Candidate evaluation needs condition metadata |
| Answer Production before Verification | Answer contract requires verified metadata |
| Explanation Renderer before Reasoning Graph | Renderer must consume graph output |
| Global Graph Node to NS-DIV-001 Answer Production | Archetype ownership must be preserved |

## Validation Requirements

| Validation Area | Requirement |
| --- | --- |
| Node completeness | Every required node must be present |
| Relationship order | Required relationships must be preserved |
| Ownership trace | Every node must carry NS-DIV-001 ownership |
| Source trace | Every node must preserve source reference metadata |
| Canonical trace | Every node must preserve canonical problem metadata |
| Output trace | Answer Production must preserve requested output type |
| Renderer readiness | Graph output must be consumable by the explanation renderer |

## Explanation Relationship

The explanation renderer must consume graph output only. It must not invent reasoning, reorder required reasoning nodes, add unreviewed teaching content, or bypass graph validation.

The graph is responsible for source-traced reasoning metadata. The renderer is responsible only for approved presentation after implementation approval.

## Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Graph mission is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Node specifications are complete | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Allowed relationships are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Required relationships are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Forbidden relationships are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Explanation renderer relationship is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
