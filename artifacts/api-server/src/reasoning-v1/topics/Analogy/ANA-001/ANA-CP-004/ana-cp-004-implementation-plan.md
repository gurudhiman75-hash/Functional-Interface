# ANA-CP-004 Implementation Plan

Status: implementation started on `feat/reasoning-ana-001-cp004`.

## Audited scope

- QL range: `ANA-QL-109` through `ANA-QL-140`
- Total QLs: 32
- Rule families: 16
- Each rule has two presentation modes:
  - direct completion
  - pair selection
- Task kind: number-set transformation
- Solve mode: `NUMBER_SET_RULE`
- Answer type: number set / numeric triple
- Renderer: `TABLE_OR_GRID`
- Locale mode: translatable
- Number treatment: whole number

## Rule registry

1. `SET_SUM`
2. `SET_ABS_DIFFERENCE`
3. `SET_PRODUCT`
4. `SET_PRODUCT_ADJUST`
5. `SET_SQUARE_SUM`
6. `SET_SQUARE_DIFFERENCE`
7. `SET_PRODUCT_PLUS_FIRST`
8. `SET_PRODUCT_PLUS_SECOND`
9. `SET_PRODUCT_MINUS_FIRST`
10. `SET_PRODUCT_MINUS_SECOND`
11. `SET_AVERAGE`
12. `SET_RATIO_PRESERVING`
13. `SET_FACTOR_MULTIPLE`
14. `SET_CONSECUTIVE_CONSTRUCTION`
15. `SET_MATCHING_TRIPLES`
16. `SET_CORRESPONDING_MISSING_MEMBER`

## Required architecture

- `question-language.en.ts`: exact 32-QL registry
- `rule-definitions.ts`: typed triple/set rule definitions and safe domains
- `independent-solver.ts`: recompute the missing member independently
- `ambiguity-checker.ts`: match every generated source example against the full eligible CP-004 rule pool
- `generator.ts`: deterministic source/target triple generation
- `option-validator.ts`: reject duplicate, accidentally valid, or multi-answer options
- `task-registry.ts`: checkpoint discovery surface
- `ana-cp-004.test.ts`: exhaustive runtime, ambiguity, option, bound, and answer-position audit
- `export-review.ts`: exact English runtime review export
- `localized-runtime.ts`: Hindi and Punjabi stems/explanations after English approval
- localized audit and review exporters

## Generation model

A generated direct-completion question will show one complete source triple and one incomplete target triple, for example:

`(4, 7, 11) :: (6, 9, ?)`

A pair-selection question will show a source triple and four candidate triples, exactly one of which follows the same rule.

## Non-negotiable contracts

- exactly four unique options
- exactly one correct answer
- deterministic output for identical QL, locale and seed
- positive bounded integer members
- no fractional average, ratio, or division outputs
- independent-solver agreement
- full eligible-rule-pool ambiguity rejection
- reject equal-or-simpler competing rules
- false-but-plausible distractor triples
- no option that accidentally satisfies the intended rule
- table/grid-friendly structured output
- worked explanation showing substituted source and target values
- answer-position balance across a large seed sample

## Implementation order

1. Freeze the exact audited 32-QL registry.
2. Implement the typed 16-rule set registry.
3. Implement independent solving and all-rule matching.
4. Implement ambiguity-safe direct-completion generation.
5. Implement pair-selection generation and independent option validation.
6. Add exhaustive English tests and review export.
7. Perform editorial review and tune weak/ambiguous instances.
8. Add Hindi and Punjabi runtime text, tests, and review exports.
