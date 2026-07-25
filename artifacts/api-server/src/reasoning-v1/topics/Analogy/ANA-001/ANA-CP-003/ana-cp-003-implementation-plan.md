# ANA-CP-003 Implementation Plan

Status: implementation started on `feat/reasoning-ana-001-cp003`.

## Scope

- QL range: `ANA-QL-061` through `ANA-QL-108`
- Total QLs: 48
- Presentation modes: 24 direct-completion QLs and 24 equivalent-pair-selection QLs
- Domain: numeric analogy
- Renderer: structured text
- Locale mode: translatable
- Figure analogy remains excluded

## Rule families

The checkpoint covers two audited numeric groups:

1. Whole-number transformations
   - add/subtract/multiply/divide by constants
   - multiply/divide followed by addition or subtraction
   - square/cube and constant-adjusted powers
   - other bounded whole-number transforms from the audited ANA-001 manifest

2. Digit-based transformations
   - sum of digits
   - product of digits
   - absolute digit difference
   - sum of squares of digits
   - digit-product plus digit-sum
   - position-sensitive digit transforms from the audited ANA-001 manifest

## Required architecture

- `question-language.en.ts`: exact 48-Ql registry
- `rule-definitions.ts`: typed numeric rule registry and parameter domains
- `generator.ts`: deterministic source/target generation and option construction
- `independent-solver.ts`: recompute answers without trusting generator output
- `ambiguity-checker.ts`: reject instances matched by another eligible rule or by a simpler competing rule
- `task-registry.ts`: checkpoint discovery surface
- `ana-cp-003.test.ts`: exhaustive contract and balance audit
- `export-review.ts`: exact TypeScript runtime review export
- Hindi/Punjabi stems and explanations: numeric text is translatable; digits remain locale-neutral unless product requirements later specify native numerals

## Non-negotiable contracts

- exactly four unique options
- exactly one correct answer
- deterministic output for identical QL, locale and seed
- no division instances with non-integral or undefined results
- bounded integer outputs suitable for SSC, Banking and Punjab exams
- independent-solver agreement on every generated instance
- full eligible-rule-pool ambiguity rejection
- no accidental simpler rule fitting the same source examples
- natural stepwise explanation showing the actual operation and substituted values
- answer-position balance audit across a large seed sample

## Implementation order

1. Freeze the exact 48-Ql registry from the audited manifest.
2. Implement typed rule definitions and safe parameter domains.
3. Implement independent solver and ambiguity checker before option generation.
4. Implement direct-completion generation.
5. Implement pair-selection generation with false-but-valid numeric pairs.
6. Add exhaustive runtime tests and distribution audits.
7. Generate a two-sample-per-Ql review export.
8. Add Hindi and Punjabi question/explanation text after English runtime approval.
