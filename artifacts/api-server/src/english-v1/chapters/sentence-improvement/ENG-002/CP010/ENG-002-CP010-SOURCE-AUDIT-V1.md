# ENG-002 CP010 — Sentence Improvement: Modifiers & Placement — Source Audit V1

Status: `IMPLEMENTED__AUTOMATED_REVIEW_GATE_PENDING__HUMAN_REVIEW_REQUIRED__NOT_QUESTION_STUDIO_REGISTERED`

## Grammar authority

ENG-002 CP010 reuses the explicitly human-approved ENG-001 CP010 modifier grammar and all 60 authored semantic scenes. ENG-001 remains the grammar authority; ENG-002 owns the intact-sentence replacement surface, distractors, No improvement balance, explanations and review artifact.

## Covered rule families

1. `GR-MOD-001` — introductory present-participle attachment
2. `GR-MOD-002` — introductory perfect/passive participle attachment
3. `GR-MOD-003` — introductory adjective/descriptive phrase attachment
4. `GR-MOD-004` — relative-clause proximity
5. `GR-MOD-005` — `only` focus placement
6. `GR-MOD-006` — `almost` / `nearly` scope
7. `GR-MOD-007` — `even` position in negative auxiliary/perfect constructions
8. `GR-MOD-008` — frequency-adverb position
9. `GR-MOD-009` — manner-adverb position with a direct object
10. `GR-MOD-010` — participial/restrictive postmodifier proximity

## Learner surface

- one intact sentence with one underlined replacement target;
- whole-phrase underlining is retained where modifier attachment or scope would become misleading if reduced too aggressively;
- three replacement choices plus D. `No improvement`;
- deterministic approximately 25% No improvement and exactly five of twenty per difficulty in the review corpus;
- difficulty comes from dependency distance, competing nearby nouns and scope, not obscure vocabulary.

## Distractor policy

Distractors stay inside modifier placement/attachment. No fabricated spellings are used. Attachment rules preserve the same incorrect controller/antecedent while varying the surface; scope rules relocate the relevant focus/frequency/manner word to other positions. Any ambiguity found in review must be fixed in the source generator and the review regenerated.

## Explanation standard

Every explanation follows: error/no-improvement → easy underlying concept → sentence-specific application → complete corrected sentence. No option-by-option analysis, shortcuts, traps or generic closing clutter.

## Review and validation

The deterministic review contains all 60 donor scenes: 20 Easy, 20 Medium and 20 Hard, with all ten rule families represented and exactly five No-improvement items per difficulty. Stress validation generates 2,000 questions per difficulty and checks deterministic replay, option uniqueness, answer balance, rule/domain reachability and learner-surface integrity.

## Lifecycle

Review-only until explicit human editorial approval of the generated review artifact. CP010 must not be registered in Question Studio, written to Question Bank, used in tests/mocks, published publicly or released to production before approval.
