# NS-DIV-001 Parameter Specification

## Purpose

Define parameter contracts for canonical problems owned by NS-DIV-001.

This document contains no values, generation logic, questions, stems, explanations, distractors, solver code, graph code, or implementation behavior.

## Parameter Rules

- Parameters must be owned by canonical problems.
- Parameters must not be owned by global systems.
- Parameters must support future validation.
- Parameters must support future localization.
- Parameters must support future realism enforcement.
- Parameters must preserve source traceability.
- Parameters must preserve NS-DIV-001 ownership.

## Shared Parameter Contract

| Parameter Area | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Must be approved |
| Source Reference IDs | Required after source review |
| Missing Digit Slot Metadata | Required |
| Number Expression Metadata | Required |
| Divisibility Constraint Metadata | Required |
| Output Request Metadata | Required |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Localization Inputs | PENDING HUMAN REVIEW |
| Realism Inputs | PENDING HUMAN REVIEW |
| Validation Inputs | Required |

## CP-001: Find Missing Digit

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-001 |
| Mission | Resolve the valid missing digit for the approved divisibility structure. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-001 and must not be shared as global missing-digit parameters |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Exactly one missing digit; single-digit output contract; source trace preserved; canonical ownership preserved |
| Expected Output Type | Single digit |
| Review Status | PENDING HUMAN REVIEW |

## CP-002: Find Largest Valid Digit

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-002 |
| Mission | Resolve the largest valid digit from the approved candidate set. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; ordering contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-002 and must preserve largest-valid output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Candidate set metadata present; largest-valid selection contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Single digit selected by largest-valid criterion |
| Review Status | PENDING HUMAN REVIEW |

## CP-003: Find Smallest Valid Digit

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-003 |
| Mission | Resolve the smallest valid digit from the approved candidate set. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; ordering contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-003 and must preserve smallest-valid output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Candidate set metadata present; smallest-valid selection contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Single digit selected by smallest-valid criterion |
| Review Status | PENDING HUMAN REVIEW |

## CP-004: Count Valid Digits

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-004 |
| Mission | Resolve the count of valid digits from the approved candidate set. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; aggregation contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-004 and must preserve count output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Candidate set metadata present; count aggregation contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Count |
| Review Status | PENDING HUMAN REVIEW |

## CP-005: Sum Of Valid Digits

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-005 |
| Mission | Resolve the sum of valid digits from the approved candidate set. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; aggregation contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-005 and must preserve sum output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Candidate set metadata present; sum aggregation contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Sum |
| Review Status | PENDING HUMAN REVIEW |

## CP-006: Product Of Valid Digits

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-006 |
| Mission | Resolve the product of valid digits from the approved candidate set. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; candidate domain contract; aggregation contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-006 and must preserve product output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Candidate set metadata present; product aggregation contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Product |
| Review Status | PENDING HUMAN REVIEW |

## CP-007: Expression Value Using Missing Digit

| Field | Specification |
| --- | --- |
| Canonical Problem ID | CP-007 |
| Mission | Resolve an expression value after the missing digit contract is approved by solver metadata. |
| Required Parameters | Missing digit slot metadata; number expression metadata; divisibility constraint metadata; expression output contract; output request metadata; source reference IDs |
| Optional Parameters | Exam style profile; localization target; realism profile; difficulty control input |
| Parameter Ownership Rules | Parameters belong to CP-007 and must preserve expression output ownership |
| Difficulty Control Inputs | PENDING HUMAN REVIEW |
| Validation Constraints | Missing digit resolution metadata present; expression output contract preserved; source trace preserved; canonical ownership preserved |
| Expected Output Type | Expression value |
| Review Status | PENDING HUMAN REVIEW |

## Parameter Validation Contract

| Validation Area | Requirement |
| --- | --- |
| Ownership | Parameter contract must belong to NS-DIV-001 and the selected canonical problem |
| Required parameter completeness | Required parameters must be present before solver invocation |
| Optional parameter approval | Optional parameters must be approved before use |
| Difficulty support | Difficulty control inputs must map to `difficulty-spec.md` |
| Localization support | Localization inputs must map to `localization-spec.md` |
| Realism support | Realism inputs must map to `realism-rules.md` |
| Source trace support | Source reference metadata must be preserved |

## Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Shared parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-001 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-002 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-003 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-004 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-005 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-006 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| CP-007 parameter contract is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Global parameter ownership is forbidden | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
