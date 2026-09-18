# ENG-003-CP004 — Grammar Fillers: Pronouns — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Boundary

ENG-003 CP004 implements **Pronoun Grammar Fillers** by reusing the already-approved pronoun knowledge layer from ENG-001 CP004 / ENG-002 CP004.

Reused rule IDs:

- `GR-PRN-001` subject case
- `GR-PRN-002` object case
- `GR-PRN-003` possessive determiner vs possessive pronoun
- `GR-PRN-004` reflexive coreference
- `GR-PRN-005` reflexive misuse
- `GR-PRN-006` antecedent-number agreement
- `GR-PRN-007` who vs whom
- `GR-PRN-008` person vs thing relative pronoun
- `GR-PRN-009` demonstrative number
- `GR-PRN-010` whose vs who's

No pronoun rule is re-authored here.

## Filler transformation

The approved ENG-002 CP004 generator is invoked only in correction-required mode. ENG-003 compares the verified correct and mutated targets, keeps their shared words visible, and blanks only the changing pronoun slot.

ENG-003 carries forward:

- the verified correct pronoun slot;
- the approved wrong pronoun slot;
- the remaining rule-aware pronoun-slot distractors;
- the approved corrected sentence;
- the approved rule-specific teaching and sentence application.

`No improvement` is never exposed in ENG-003.

For `GR-PRN-010`, ENG-002 already isolates `whose` / `who's` from the rest of the clause before ENG-003 creates the blank.

## Difficulty and coverage

The donor catalog contains 20 curated scenes at each difficulty.

- Easy focuses on direct subject/object case, possessive form, person/thing relative form and demonstrative number.
- Medium exposes all ten rule families.
- Hard uses longer dependencies and close distractors while retaining plain vocabulary.

The 6,000-question soak must exercise every eligible donor scene, rule family and semantic domain at each difficulty.

## Explanation policy

Every explanation begins with the exact filler, then gives the approved rule explanation, applies it to the sentence, and shows the completed correct sentence.

No option-by-option analysis and no generic closing filler.

## Review batch

The deterministic review exporter produces 30 questions:

- 10 Easy
- 10 Medium
- 10 Hard

It prioritizes one scene from every eligible rule family before adding further unique donor scenes.

## Lifecycle

This checkpoint remains review-only until explicit human approval. No Question Studio registration, Question Bank writes, tests, mocks, learner/public publication or production release is authorized.


### Slot-quality guard

Compound phrases are not repeated in every option. For example, a donor contrast such as `Rita and him / Rita and he` becomes `Rita and _____` with pronoun-only options. Likewise, `need their / need its` becomes `need _____`. This keeps the question concise and closer to competitive-exam filler style.
