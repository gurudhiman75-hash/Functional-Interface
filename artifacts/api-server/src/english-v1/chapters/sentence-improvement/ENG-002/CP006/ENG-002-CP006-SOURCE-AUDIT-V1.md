# ENG-002 CP006 — Sentence Improvement: Adjectives, Adverbs and Comparison — Source Audit V1

Status: `IMPLEMENTED__AUTOMATED_REVIEW_GATE_PENDING__HUMAN_REVIEW_REQUIRED__NOT_QUESTION_STUDIO_REGISTERED`

## Grammar authority

ENG-002 CP006 reuses the human-approved ENG-001 CP006 grammar and semantic scene layer. The canonical donor approval authority is `ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1`, approved on 2026-09-13 and pinned to its reviewed generator/artifact. An older ENG-001 CP006 audit Markdown still contains a stale pre-approval status line; that stale prose is not used as lifecycle authority.

## Covered rule families

1. `GR-CMP-001` — adverb of manner after an action verb
2. `GR-CMP-002` — adjective after a linking verb
3. `GR-CMP-003` — positive degree in `as ... as`
4. `GR-CMP-004` — comparative degree with `than`
5. `GR-CMP-005` — definite article with ordinary superlatives
6. `GR-CMP-006` — `one of the + superlative + plural noun`
7. `GR-CMP-007` — no double comparative
8. `GR-CMP-008` — no double superlative
9. `GR-CMP-009` — standard comparative intensifiers
10. `GR-CMP-010` — high-frequency irregular degrees of comparison

## Sentence Improvement surface

- The sentence remains intact; slash-separated Error Spotting parts are not used.
- Only the smallest useful changed span is underlined. If the donor mutation inserts or deletes a word, the target expands just enough to keep both the correct and incorrect replacement visible.
- Options A–C are replacement choices; D is always `No improvement`.
- Approximately 25% of normal generation is deterministic No-improvement.
- The deterministic review artifact contains all 60 donor scenes: 20 Easy, 20 Medium and 20 Hard, with exactly five No-improvement items in each difficulty.

## Distractor policy

Distractors remain inside the tested comparison/adjective/adverb relationship. Fabricated giveaway forms such as `gooder`, `badder`, `goodest`, `baddest`, `wellly` and mechanical misspellings are explicitly banned. Difficulty comes from sentence structure and grammatical relationships, not fake vocabulary.

## Explanation policy

Every explanation follows the approved teaching order:

1. state the error, or state that no improvement is needed;
2. teach the underlying concept in very easy language;
3. explain why that concept applies to the current sentence;
4. show the complete corrected sentence.

The explanation must contain no option-by-option analysis, shortcut language, trap language or unnecessary generic closing clutter.

## Lifecycle

Review-only until explicit human editorial approval of the generated review artifact. Before approval, CP006 must not be registered in Question Studio and must not unlock Question Bank writes, test/mock use, public publication, automatic learner delivery or production release.
