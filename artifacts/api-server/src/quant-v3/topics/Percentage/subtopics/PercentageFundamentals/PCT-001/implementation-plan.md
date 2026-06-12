# PCT-001 Implementation Plan

## Phase Output Status

This package defines architecture discovery and human language draft only. It does not create runtime content or executable logic.

Files in this package:

- `archetype.md`
- `canonical-problems.md`
- `difficulty-framework.md`
- `reasoning-patterns.md`
- `implementation-plan.md`
- `pct-001-language-draft.md`

## Active CP List

| CP ID | Name |
|---|---|
| PCT-001-CP01 | Find a percentage of a quantity |
| PCT-001-CP02 | Express one quantity as a percentage of another |
| PCT-001-CP03 | Convert fraction or decimal to percentage |
| PCT-001-CP04 | Compare percentage values |
| PCT-001-CP05 | Direct percentage increase or decrease |

Topology count: 5

## Recommended Implementation Order

1. CP03 because representation conversion supports percentage fluency.
2. CP01 because percentage-of-value is the core value operation.
3. CP02 because it reverses the viewpoint into part-whole percentage.
4. CP05 because it uses CP01 as a direct change amount.
5. CP04 because comparison requires multiple percentage calculations.

## Guardrails For Future Work

Future implementation must reject:

- formula-recall prompts
- definition-only prompts
- reverse percentage questions
- successive percentage questions
- percentage more than or less than
- contextual application packages such as marks, votes, income, expenditure, population, and transfer

## Verification Checklist

- Exactly six Markdown files exist for this phase.
- No JSON libraries exist.
- No runtime TypeScript files exist.
- No generators exist.
- No solvers exist.
- No validators exist.
- No pipelines exist.
- No reasoning graphs exist.
- No tests exist.
- No audits exist.

Recommended next step:
Review the CP list and human language draft against real exam-style fundamentals before creating any educational libraries.
