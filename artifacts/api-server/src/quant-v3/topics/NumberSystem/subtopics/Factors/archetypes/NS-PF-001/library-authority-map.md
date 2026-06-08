# NS-PF-001 Library Authority Map

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
| variable-ranges.library.json | Human | Defines approved variable ranges, difficulty bands, prime input policy, number shapes, and CP variable universes. | Load after approval for parameter generation constraints. | Validate archetype ID, active CP IDs, number bounds, prime input approval, composite input approval, selected prime policy, exponent-zero policy, and CP input/output declarations. |
| coverage-targets.library.json | Human | Defines required educational coverage categories. | Load after approval for audit reporting and coverage checks. | Validate difficulty targets, prime input coverage, composite input coverage, prime base buckets, largest and smallest prime factor coverage, selected prime coverage, selected exponent coverage, prime power buckets, distinct factor count buckets, repeated factor coverage, question language coverage, and explanation coverage. |
| question-language.library.json | Human | Defines all approved question stems. | Load after approval for stem rendering only. | Validate QL-001 through QL-018, required placeholders, and self-contained visible variables. |
| explanation.library.json | Human | Defines all approved explanation templates. | Load after approval for explanation rendering only. | Validate ES-001 through ES-007, CP applicability, and required placeholders. |
| distribution-targets.library.json | Human | Defines distribution targets for difficulty, language, explanations, prime bases, prime powers, and number shapes. | Load after approval for batch generation and audit reporting. | Validate Easy/Medium/Hard targets, uniform language targets, and audit reporting categories. |

## Specification Authority

| Document | Purpose |
| --- | --- |
| archetype.md | Defines NS-PF-001 identity, scope, core concepts, and architecture reuse. |
| canonical-problems.md | Defines active CP-001 through CP-007, topology analysis, and exclusions. |
| difficulty-framework.md | Defines Easy, Medium, and Hard educational bands. |
| reasoning-patterns.md | Defines reasoning families for future graph design. |
| implementation-plan.md | Defines future implementation requirements without implementing runtime. |

## Runtime Gate

This design package does not authorize runtime implementation.

Future implementation must be explicitly requested after human approval.

## CP Authority Rule

Only CP-001 through CP-007 are active for NS-PF-001.

Future runtime must reject unknown CP IDs.

## Selected Prime Authority Rule

For CP-006 and CP-007:

- The selected prime must be prime.
- The selected prime must divide the number.
- The selected exponent must be at least 1.
- Exponent 0 is outside the active NS-PF-001 educational boundary.

This keeps highest prime power lookup and exponent lookup inside the approved educational boundary.

## Prime Input Authority Rule

Prime input numbers are valid for CP-001 through CP-007.

For a prime input p:

- CP-001 returns p.
- CP-002 returns 1.
- CP-003 returns 1.
- CP-004 returns p.
- CP-005 returns p.
- CP-006 uses selectedPrime = p and returns p.
- CP-007 uses selectedPrime = p and returns 1.
