# NS-FAC-001 Library Authority Map

## Status

Design package only.

## Authority Principle

Educational libraries are human-owned.

Future runtime may only:

- load
- validate
- register
- enforce
- audit

Future runtime must not invent educational wording.

## Libraries

| Library Name | Owner | Purpose | Runtime Usage | Validation Rules |
| --- | --- | --- | --- | --- |
| variable-ranges.library.json | Human | Defines approved difficulty bands, number ranges, k ranges, position ranges, ordinal rendering policy, product magnitude policy, and factor-shape categories. | Load after approval for parameter generation constraints. | Validate archetype ID, active CP IDs, bounds, k policy, position policy, BigInt/string product policy, and ordinal display policy. |
| coverage-targets.library.json | Human | Defines required educational coverage categories. | Load after approval for audit reporting and coverage checks. | Validate prime/composite coverage, factor-shape coverage, highly composite coverage, k buckets, edge-position buckets, product digit count buckets, language IDs, explanation IDs, and difficulty bands. |
| question-language.library.json | Human | Defines all approved question stems. | Load after approval for stem rendering only. | Validate QL-001 through QL-021, required placeholders, self-contained visible variables, and ordinal display placeholder policy. |
| explanation.library.json | Human | Defines all approved explanation templates. | Load after approval for explanation rendering only. | Validate ES-001 through ES-009, CP applicability, required evidence placeholders, and MathJax placeholder consumption. |
| distribution-targets.library.json | Human | Defines distribution targets for difficulty, question language, and explanation styles. | Load after approval for batch generation and audit reporting. | Validate Easy/Medium/Hard targets and uniform language/explanation targets. |

## Specification Authority

| Document | Purpose |
| --- | --- |
| archetype.md | Defines NS-FAC-001 identity, scope, mathematical foundation, MathJax requirement, and architecture reuse. |
| canonical-problems.md | Defines active CP-001 through CP-009 and exclusions. |
| difficulty-framework.md | Defines Easy, Medium, and Hard educational bands. |
| reasoning-patterns.md | Defines reasoning families for future graph design. |
| implementation-plan.md | Defines future implementation requirements without implementing runtime. |

## Runtime Gate

This design package does not authorize runtime implementation.

Future implementation must be explicitly requested after human approval.

## CP Authority Rule

Only CP-001 through CP-009 are active for NS-FAC-001.

Future runtime must reject unknown CP IDs.

## Language Authority Rule

Question and explanation wording must come only from the human-owned libraries.

No fallback stems, generated wording, or invented educational explanations are authorized.

## Derived Topology Authority Rule

CP-007 is active as a derived complement topology.

Future runtime must derive CP-007 from:

- factorCount
- divisibleFactorCount

using:

notDivisibleFactorCount = factorCount - divisibleFactorCount

## Magnitude Authority Rule

CP-003 factorProduct must be exact.

Future runtime must use BigInt internally or equivalent exact integer arithmetic and serialize factorProduct as a decimal string.

Unsafe JavaScript number serialization is not authorized for CP-003 factorProduct.

## Ordinal Authority Rule

Future runtime must render ordinal values correctly.

Malformed text such as 1th, 2th, and 3th is not authorized.
