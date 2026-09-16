# ENG-002 CP009 — Sentence Improvement: Gerunds, Infinitives & Participles — Source Audit V1

Status: `IMPLEMENTED__AUTOMATED_REVIEW_GATE_PENDING__HUMAN_REVIEW_REQUIRED__NOT_QUESTION_STUDIO_REGISTERED`

## Grammar authority

ENG-002 CP009 reuses the explicitly human-approved ENG-001 CP009 generator and its closure-remediated V3 scene layer. The canonical donor approval authority is `ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1`, approved on 2026-09-15 and pinned to `ENG-001-CP009-REVIEW-V2.md` plus the approved donor generator head.

## Covered rule families

1. `GR-GIP-001` — verb + gerund
2. `GR-GIP-002` — verb + to-infinitive
3. `GR-GIP-003` — object + to-infinitive
4. `GR-GIP-004` — make/let + object + bare infinitive
5. `GR-GIP-005` — modal + bare infinitive
6. `GR-GIP-006` — preposition + gerund
7. `GR-GIP-007` — used to vs be/get used to
8. `GR-GIP-008` — to-infinitive of purpose
9. `GR-GIP-009` — meaning-sensitive gerund vs infinitive
10. `GR-GIP-010` — participle form in non-finite structures

## Sentence Improvement surface

- The sentence remains intact; slash-separated Error Spotting parts are not used.
- Only the smallest useful changed span is underlined.
- Options A–C are replacement choices; D is always `No improvement`.
- Normal generation uses deterministic approximately 25% No-improvement.
- The deterministic review artifact uses all 60 approved donor scenes: 20 Easy, 20 Medium and 20 Hard, with exactly five No-improvement items per difficulty.
- Difficulty comes from sentence structure, dependency tracking and meaning-sensitive contexts, not obscure vocabulary.

## Distractor policy

Distractors remain inside real verb-form families: gerund, to-infinitive, bare infinitive, finite third-person form or ordinary past form. Fabricated forms and spelling tricks are not used. Meaning-sensitive `remember`/`stop` items preserve the donor context so the intended interpretation remains uniquely recoverable.

## Explanation policy

Every explanation follows the approved teaching order:

1. state the error, or state that no improvement is needed;
2. explain the underlying non-finite concept in easy language;
3. explain why it applies in the current sentence using the donor's sentence-specific reason;
4. show the full corrected sentence.

No option-by-option analysis, shortcut language, trap language or unnecessary closing boilerplate is used.

## Lifecycle

Review-only until explicit human editorial approval of the generated ENG-002 CP009 review artifact. Before approval, CP009 must not be registered in Question Studio and must not unlock Question Bank writes, test/mock use, public publication, automatic learner delivery or production release.
