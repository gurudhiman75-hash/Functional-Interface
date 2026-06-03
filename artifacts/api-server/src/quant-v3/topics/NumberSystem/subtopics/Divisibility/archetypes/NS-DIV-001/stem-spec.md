# NS-DIV-001 Stem Specification

## Purpose

Define the requirements future stems must satisfy for NS-DIV-001.

This document does not contain stem text.

## Stem Ownership

All future stem rendering for this archetype must be owned by NS-DIV-001. No global stem engine may create or modify stems for this archetype without this specification and human approval.

## Stem Inputs

| Input | Requirement |
| --- | --- |
| Canonical Problem ID | Required |
| Source Reference IDs | Required |
| Missing Digit Marker | PENDING HUMAN REVIEW |
| Number Expression Shape | PENDING HUMAN REVIEW |
| Divisibility Condition Reference | PENDING HUMAN REVIEW |
| Answer Request Form | PENDING HUMAN REVIEW |
| Language Target | Required for localized stems |
| Exam Style Profile | PENDING HUMAN REVIEW |

## Stem Output Contract

| Output | Requirement |
| --- | --- |
| Student-facing stem | Must be produced only after implementation approval |
| Machine-readable stem metadata | Must preserve canonical problem ownership |
| Missing digit metadata | Must preserve exactly one missing digit |
| Source trace metadata | Must preserve source references |
| Localization metadata | Must preserve language and script target |

## Stem Constraints

- A future stem must map to one reviewed canonical problem.
- A future stem must preserve exactly one missing digit.
- A future stem must preserve the reviewed divisibility condition.
- A future stem must not introduce an unreviewed scenario.
- A future stem must not introduce an unreviewed answer format.
- A future stem must not use educational wording outside archetype ownership.
- A future stem must preserve source traceability.

## Forbidden Stem Behavior

- Do not generate stems before canonical problem approval.
- Do not create stems from global templates.
- Do not add explanatory hints inside stems unless approved by reviewer.
- Do not add unreviewed linguistic variants.
- Do not add unreviewed symbolic notation.

## Stem Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Stem maps to NS-DIV-001 | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Stem maps to an approved canonical problem | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Stem contains exactly one missing digit | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Stem preserves approved answer request form | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Stem preserves approved source trace | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Stem is approved for implementation | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
