# NS-PRM-001 Library Authority Map

## Status

Design package only.

## Authority Principle

Educational libraries are human-owned.

Future runtime may only:

- store
- load
- validate
- register
- enforce
- audit

Future runtime must not invent educational content.

## Libraries

| Library Name | Owner | Purpose | Runtime Usage | Validation Rules |
| --- | --- | --- | --- | --- |
| variable-ranges.library.json | Human | Defines approved variable ranges, difficulty bands, and CP variable universes. | Load after approval for parameter generation constraints. | Validate archetype ID, active CP IDs, range bounds, and CP input/output declarations. |
| coverage-targets.library.json | Human | Defines required educational coverage categories. | Load after approval for audit reporting and coverage checks. | Validate required categories, CP-001 50/50 Prime/Composite answer distribution, numeric range buckets, and CP-008 position buckets. |
| question-language.library.json | Human | Defines all approved question stems. | Load after approval for stem rendering only. | Validate QL-001 through QL-018, required placeholders, self-contained visible variables, and repaired QL-017 wording. |
| explanation.library.json | Human | Defines all approved explanation templates. | Load after approval for explanation rendering only. | Validate ES-001 through ES-009 and CP applicability. |
| distribution-targets.library.json | Human | Defines distribution targets for difficulty, language, explanations, and CP-001 answers. | Load after approval for batch generation and audit reporting. | Validate Easy/Medium/Hard targets, uniform language targets, and CP-001 answer distribution target. |

## Specification Authority

| Document | Purpose |
| --- | --- |
| archetype.md | Defines NS-PRM-001 identity, scope, and architecture reuse. |
| canonical-problems.md | Defines active CP-001 through CP-008 and exclusions. |
| difficulty-framework.md | Defines Easy, Medium, and Hard educational bands. |
| reasoning-patterns.md | Defines reasoning families for future graph design. |
| implementation-plan.md | Defines future implementation requirements without implementing runtime. |

## Runtime Gate

This design package does not authorize runtime implementation.

Future implementation must be explicitly requested after human approval.

## Number 1 Authority Rule

1 is neither Prime nor Composite.

1 is not a valid generated value for:

- CP-001
- CP-006
- CP-007

Future runtime validation must reject 1 for these canonical problems.
