# NS-DIV-001 Distractor Specification

## Purpose

Define the ownership and review requirements for future distractors attached to NS-DIV-001.

This document does not contain distractor values, distractor text, or distractor generation logic.

## Distractor Ownership

All future distractors for this archetype must be owned by NS-DIV-001 and tied to an approved canonical problem.

No global distractor engine may create distractors for this archetype unless this specification is implemented through an approved archetype-owned module.

## Distractor Inputs

| Input | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Required |
| Correct Answer Contract | PENDING HUMAN REVIEW |
| Approved Error Families | PENDING HUMAN REVIEW |
| Source Reference IDs | Required |
| Difficulty Band | PENDING HUMAN REVIEW |
| Language Target | Required when distractor text requires localization |

## Distractor Output Contract

| Output | Requirement |
| --- | --- |
| Distractor set | Must be produced only after implementation approval |
| Error family metadata | Must be approved by reviewer |
| Correct answer separation metadata | Required |
| Uniqueness metadata | Required |
| Source trace metadata | Must preserve reviewed source references |

## Distractor Constraints

- Future distractors must be derived from approved error families.
- Future distractors must not duplicate the approved answer.
- Future distractors must not duplicate each other.
- Future distractors must remain plausible within reviewer-approved bounds.
- Future distractors must preserve the canonical problem answer format.
- Future distractors must not introduce unreviewed educational assumptions.

## Forbidden Distractor Behavior

- Do not create distractor values in this specification.
- Do not create error families without human review.
- Do not use global distractor patterns without archetype ownership.
- Do not create localized distractor text in this specification.

## Distractor Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Distractor maps to NS-DIV-001 | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Distractor maps to an approved canonical problem | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Error families are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Correct answer separation is defined | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Uniqueness requirements are defined | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Distractor behavior is approved for implementation | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
