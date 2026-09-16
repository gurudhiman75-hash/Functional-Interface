# ENG-002 CP004 — Sentence Improvement: Pronouns — Source & Coverage Audit V1

Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Donor authority

ENG-002 CP004 reuses the closed ENG-001 CP004 pronoun grammar/candidate layer. No independent pronoun fact bank is introduced.

## Rule coverage

1. `GR-PRN-001` — subject pronoun case;
2. `GR-PRN-002` — object pronoun case;
3. `GR-PRN-003` — possessive determiner vs possessive pronoun;
4. `GR-PRN-004` — reflexive pronoun for coreference;
5. `GR-PRN-005` — unnecessary reflexive-pronoun misuse;
6. `GR-PRN-006` — pronoun–antecedent number agreement;
7. `GR-PRN-007` — formal who/whom case;
8. `GR-PRN-008` — person/thing relative pronouns in non-restrictive clauses;
9. `GR-PRN-009` — demonstrative number;
10. `GR-PRN-010` — whose/who's.

The donor exclusions remain in force: no generic singular-they dispute, comparison-ellipsis dispute, restrictive that/which style rule, unstable collective agreement, or discourse-dependent pronoun reference.

## Sentence Improvement transformation

- The complete sentence remains intact.
- Exactly one donor-controlled pronoun target is underlined.
- Options A–C are replacement phrases; option D is always `No improvement`.
- Approximately 25% of generated questions are deterministic No-improvement cases.
- Distractors stay inside the relevant pronoun family and preserve surrounding phrase structure where the target is compound.
- Explanations give the rule, apply it to the actual grammatical role, and show the complete corrected sentence.

## Difficulty and corpus

The donor corpus contains 60 authored scenes: 20 Easy, 20 Medium, 20 Hard across 20 semantic domains. Difficulty remains structural rather than vocabulary-driven.

## Review freeze

The deterministic review corpus contains 60 questions: 20 Easy, 20 Medium and 20 Hard. Every fourth question in each difficulty slice is a No-improvement case, giving exactly five No-improvement items per difficulty.

## Validation gate

- 2,000 deterministic stress generations per difficulty;
- replay determinism;
- four unique options and stable answer-key contracts;
- answer-position and No-improvement distribution;
- all donor rule families reachable at their supported difficulties;
- all 10 pronoun families present in the review corpus;
- semantic-domain breadth;
- no Error Spotting slash segmentation;
- materialized review Markdown;
- API build.

## Lifecycle

Review-only. ENG-002 CP004 must not be registered in Question Studio, written to Question Bank, used in tests/mocks, or published until explicit human approval of the frozen review corpus.
