# ANA-CP-002 — Lexical and Conceptual Analogy

Status: source implementation complete; checked-out workspace execution pending.

## Scope

- 24 English QLs (`ANA-QL-037` through `ANA-QL-060`)
- 12 lexical and conceptual relation families
- 144 curated English facts (12 per relation)
- Missing-fourth-term and equivalent-pair presentation modes
- Deterministic seeded generation
- Category-compatible distractors
- Natural student-facing explanations
- 2,400-instance contract audit (24 QLs × 100 seeds)

## Relation families

- synonym
- antonym
- lower-to-higher intensity
- higher-to-lower intensity
- cause-to-effect
- effect-to-cause
- condition-to-symptom
- action-to-result
- object-to-characteristic
- word-to-definition
- deficiency-to-missing-quality
- study-to-subject

## Design safeguards

- Internal rule IDs are excluded from student-facing explanations.
- Direct-completion distractors come from the same answer domain.
- Pair-selection distractors preserve broad source/answer categories but deliberately break the exact relationship.
- Answer positions use seeded Fisher–Yates shuffling and are audited for balance.
- CP-002 is marked `LANGUAGE_SPECIFIC`; Hindi and Punjabi require separately curated lexical datasets rather than literal substitution.

## Remaining freeze gates

- Execute TypeScript bundle/test in a checked-out repository workspace.
- Generate and editorially review a multi-seed CP-002 review export.
- Add Question Studio discovery wiring after the ANA-001 package integration phase.
