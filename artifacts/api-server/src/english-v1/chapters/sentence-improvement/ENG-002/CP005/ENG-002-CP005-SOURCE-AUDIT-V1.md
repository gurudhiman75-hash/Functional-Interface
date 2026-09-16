# ENG-002 CP005 — Sentence Improvement: Prepositions — Source & Coverage Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Scope

CP005 transforms the closed ENG-001 CP005 Prepositions authority into Sentence Improvement questions. It does not duplicate or replace the grammar authority.

Covered rule families:

1. `GR-PRP-001` — time: at / on / in
2. `GR-PRP-002` — place: at / on / in
3. `GR-PRP-003` — since / for
4. `GR-PRP-004` — by / until
5. `GR-PRP-005` — between / among
6. `GR-PRP-006` — in / into
7. `GR-PRP-007` — beside / besides
8. `GR-PRP-008` — adjective + preposition complements
9. `GR-PRP-009` — verb + preposition complements
10. `GR-PRP-010` — noun + preposition complements

## Learner surface

- One normal sentence; no slash segmentation.
- Only the replacement target is underlined.
- Three replacement choices plus option D `No improvement`.
- The instruction is the ENG-002 exam-style Sentence Improvement instruction.
- Explanations follow the approved teaching order: correction/no-improvement → easy concept → application to this sentence → full corrected sentence.

## Source reuse

The generator calls `buildEng001Cp005CandidateV1()` and inherits the donor scene, rule, mutation, difficulty, semantic domain and corrected sentence. Distractors change the donor's preposition relationship rather than generating a new grammar fact.

## Review corpus

The deterministic review batch contains all 60 donor scenes:

- Easy: 20
- Medium: 20
- Hard: 20
- five calibrated `No improvement` cases per difficulty.

## Lifecycle

Human editorial approval is required before Question Studio registration. Until then CP005 is review-only and cannot write to Question Bank, enter tests/mocks, publish publicly, or authorize production release.
