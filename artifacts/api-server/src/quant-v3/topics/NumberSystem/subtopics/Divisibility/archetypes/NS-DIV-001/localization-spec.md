# NS-DIV-001 Localization Specification

## Purpose

Define localization requirements for future NS-DIV-001 implementation.

This document does not create localized stems, explanations, distractors, or teaching text.

## Localization Ownership

All localization behavior for this archetype must be owned by NS-DIV-001 and must preserve canonical problem ownership, source traceability, and validation requirements.

## Localization Inputs

| Input | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Required |
| Source Reference IDs | Required |
| Language Target | Required |
| Script Target | Required |
| Stem Metadata | Required after stem implementation |
| Explanation Metadata | Required after explanation implementation |
| Distractor Metadata | Required after distractor implementation |
| Numeric Notation Rules | PENDING HUMAN REVIEW |
| Missing Digit Marker Rules | PENDING HUMAN REVIEW |

## Localization Output Contract

| Output | Requirement |
| --- | --- |
| Localized stem | Must be produced only after implementation approval |
| Localized explanation | Must be produced only after implementation approval |
| Localized answer format | Must preserve approved answer contract |
| Localized distractors | Must preserve approved distractor contract |
| Localization metadata | Must preserve language, script, ownership, and source trace |

## Localization Constraints

- Localization must not alter the canonical problem.
- Localization must not alter the missing digit count.
- Localization must not alter the approved divisibility condition.
- Localization must not introduce unreviewed educational hints.
- Localization must not introduce unreviewed explanation content.
- Localization must not change answer semantics.
- Localization must preserve validation metadata.

## Required Review Areas

| Area | Status |
| --- | --- |
| Supported languages | PENDING HUMAN REVIEW |
| Script rules | PENDING HUMAN REVIEW |
| Numeric notation rules | PENDING HUMAN REVIEW |
| Missing digit marker rules | PENDING HUMAN REVIEW |
| Mathematical expression rendering | PENDING HUMAN REVIEW |
| Answer format rendering | PENDING HUMAN REVIEW |
| Explanation tone rules | PENDING HUMAN REVIEW |

## Forbidden Localization Behavior

- Do not create localized content in this specification.
- Do not infer translation rules from global localization systems.
- Do not translate unapproved stems.
- Do not translate unapproved explanations.
- Do not translate unapproved distractors.
- Do not change source trace metadata.

## Localization Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Localization maps to NS-DIV-001 | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Localization maps to approved canonical problems | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Language and script targets are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Numeric notation rules are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Missing digit marker rules are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Localization model approved for implementation | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
