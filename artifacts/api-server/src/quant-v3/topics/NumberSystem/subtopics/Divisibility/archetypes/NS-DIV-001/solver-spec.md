# NS-DIV-001 Solver Specification

## Solver Mission

Define the architecture for solving NS-DIV-001 canonical problems without implementing solver code.

The solver exists to transform an approved canonical problem into a verified answer contract through archetype-owned reasoning stages. The solver must not create stems, explanations, distractors, validators, or localized content.

## Solver Inputs

| Input | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Must be an approved NS-DIV-001 canonical problem |
| Source Reference IDs | Required after source review |
| Problem Recognition Metadata | Required |
| Missing Digit Metadata | Required |
| Divisibility Constraint Metadata | Required |
| Requested Output Type | Required |
| Difficulty Band | PENDING HUMAN REVIEW |
| Realism Profile | PENDING HUMAN REVIEW |

## Solver Outputs

| Output | Requirement |
| --- | --- |
| Answer Contract | Required |
| Candidate Set Metadata | Required when multiple valid digits are possible |
| Selected Candidate Metadata | Required when a single digit must be selected |
| Verification Metadata | Required |
| Failure Metadata | Required when solving cannot proceed |
| Reasoning Graph Input Payload | Required |
| Source Trace Metadata | Required |

## Supported Problem Scope

| Scope Area | Requirement |
| --- | --- |
| Archetype | Single Missing Digit Divisibility |
| Missing Digit Count | Exactly one |
| Parent Canonical Problems | CP-001 through CP-007 |
| Output Types | Digit, digit collection, count, sum, product, expression value |
| Source Status | Must be reviewed before implementation |
| Solver Ownership | Must remain inside NS-DIV-001 |

## Unsupported Problem Scope

| Unsupported Area | Required Behavior |
| --- | --- |
| Multiple missing digits | Reject |
| No missing digit | Reject |
| Unapproved canonical problem | Reject |
| Unreviewed source structure | Reject |
| Output type outside CP-001 through CP-007 | Reject |
| Stem-only input without canonical metadata | Reject |
| Global solver fallback | Reject |

## Solver Stages

The following stages define required solver architecture only. They do not define implementation logic.

### Stage 1: Problem Recognition

Identify that the input belongs to NS-DIV-001 and maps to an approved canonical problem.

| Required Output | Status |
| --- | --- |
| Archetype ownership confirmed | Required |
| Canonical problem recognized | Required |
| Requested output type recognized | Required |

### Stage 2: Constraint Extraction

Extract the missing digit metadata, divisibility constraint metadata, source trace metadata, and output request metadata.

| Required Output | Status |
| --- | --- |
| Missing digit metadata | Required |
| Divisibility constraint metadata | Required |
| Output request metadata | Required |
| Source trace metadata | Required |

### Stage 3: Rule Selection

Select the reviewed divisibility rule contract required by the canonical problem.

| Required Output | Status |
| --- | --- |
| Rule contract reference | Required |
| Rule approval status | Required |
| Unsupported rule detection | Required |

### Stage 4: Condition Construction

Build the solver-owned condition contract that will be evaluated against possible missing digit values.

| Required Output | Status |
| --- | --- |
| Condition contract | Required |
| Candidate domain contract | Required |
| Evaluation readiness status | Required |

### Stage 5: Candidate Resolution

Resolve the candidate set according to the requested canonical problem output type.

| Required Output | Status |
| --- | --- |
| Candidate set metadata | Required |
| Candidate selection metadata | Required when applicable |
| Output type mapping | Required |

### Stage 6: Verification

Verify that the candidate resolution satisfies the approved condition contract and output contract.

| Required Output | Status |
| --- | --- |
| Verification result | Required |
| Failure reason | Required when verification fails |
| Source trace preservation status | Required |

### Stage 7: Answer Production

Produce the final answer contract for downstream graph rendering, validation, and eventual explanation rendering.

| Required Output | Status |
| --- | --- |
| Final answer contract | Required |
| Reasoning graph payload | Required |
| Validation payload | Required |

## Solver Validation Requirements

| Validation Area | Requirement |
| --- | --- |
| Ownership validation | Solver output must belong to NS-DIV-001 |
| Canonical validation | Solver output must map to an approved canonical problem |
| Missing digit validation | Solver input must contain exactly one missing digit |
| Rule validation | Rule selection must use a reviewed rule contract |
| Candidate validation | Candidate resolution must match requested output type |
| Verification validation | Answer production must follow successful verification |
| Source trace validation | Source references must be preserved |

## Failure Conditions

| Failure Condition | Required Solver Response |
| --- | --- |
| Archetype mismatch | Reject with failure metadata |
| Canonical problem mismatch | Reject with failure metadata |
| Missing source trace | Reject with failure metadata |
| Unsupported output type | Reject with failure metadata |
| Unsupported rule contract | Reject with failure metadata |
| Candidate resolution conflict | Reject with failure metadata |
| Verification failure | Reject with failure metadata |

## Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Solver stages are specification-only | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Solver inputs are complete | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Solver outputs are complete | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Supported scope is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Unsupported scope is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Validation requirements are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Failure conditions are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
