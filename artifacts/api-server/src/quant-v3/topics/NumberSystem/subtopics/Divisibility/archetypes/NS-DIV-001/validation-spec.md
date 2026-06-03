# NS-DIV-001 Validation Specification

## Purpose

Define validation requirements for future NS-DIV-001 implementation.

This document does not create validator code.

## Validation Ownership

All validation behavior for this archetype must be owned by NS-DIV-001.

No global validator may approve NS-DIV-001 output unless the output also satisfies this archetype-owned validation specification.

## Validation Inputs

| Input | Requirement |
| --- | --- |
| Archetype ID | Must be NS-DIV-001 |
| Canonical Problem ID | Required |
| Source Reference IDs | Required |
| Stem Metadata | Required after stem implementation |
| Solver Metadata | Required after solver implementation |
| Distractor Metadata | Required after distractor implementation |
| Explanation Metadata | Required after explanation implementation |
| Localization Metadata | Required after localization implementation |

## Required Validation Categories

| Category | Requirement |
| --- | --- |
| Ownership validation | Output belongs to NS-DIV-001 |
| Canonical problem validation | Output maps to approved canonical problem |
| Source trace validation | Output preserves reviewed source references |
| Missing digit validation | Output contains exactly one missing digit |
| Divisibility condition validation | Output preserves approved condition |
| Answer validation | Output follows approved answer contract |
| Distractor validation | Output follows approved distractor contract |
| Explanation validation | Output follows approved explanation contract |
| Localization validation | Output follows approved localization contract |
| Realism validation | Output follows approved realism rules |
| Difficulty validation | Output follows approved difficulty band |

## Validation Failure Requirements

| Failure Area | Required Behavior |
| --- | --- |
| Missing ownership | Reject output |
| Missing source trace | Reject output |
| Missing canonical problem | Reject output |
| More than one missing digit | Reject output |
| No missing digit | Reject output |
| Unapproved answer format | Reject output |
| Unapproved reasoning pattern | Reject output |
| Unapproved localization | Reject output |

## Forbidden Validation Behavior

- Do not validate from global rules alone.
- Do not accept output without source trace metadata.
- Do not accept output without canonical problem ownership.
- Do not accept output that introduces unreviewed educational content.
- Do not create validator code in this specification.

## Validation Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| Ownership validation requirements reviewed | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Source trace validation requirements reviewed | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Missing digit validation requirements reviewed | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Answer validation requirements reviewed | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Cross-spec validation requirements reviewed | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Validation model approved for implementation | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
