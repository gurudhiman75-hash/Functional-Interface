# LP-010 Multilingual Question Studio Integration V1

Status: ACTIVE IN SHARED QUESTION STUDIO AFTER MERGE

## Source authorities

- English: `LP_010_ENGLISH_FREEZE_V1`
- Hindi/Punjabi: `LP_010_HI_PA_LOCALIZATION_FREEZE_V6`
- Question Studio integration: `LP_010_MULTILINGUAL_QUESTION_STUDIO_V1`
- Permanent QLs: `LP-QL-037..LP-QL-040`

## Shared integration contract

LP-010 is routed through the existing Logic Puzzle Question Studio adapter used by the shared generation engine. It does not add a separate generation, storage, admission or publication pipeline.

The adapter recognizes `LP-010`, `LP-CP-010` and `LP-QL-037..040`. English uses the frozen English generator; Hindi and Punjabi use the frozen V6 semantic localization. Language aliases `English/en-IN`, `Hindi/hi-IN` and `Punjabi/pa-IN` normalize to `en`, `hi` and `pa`.

Question Studio metadata exposes the four permanent QLs, all three supported languages, localization freeze V6 and review-only multilingual activation. Across equal seeds, all languages preserve the same assignment, QL, difficulty, correct option index, clock-time set and time-pattern identity.

## Proof

`lp-010-question-studio.test.ts` exercises a 12-caselet / 48-question batch in each language and verifies multilingual semantic parity, native scripts, progressive explanation tables, permanent QL metadata, language aliases and all 2/4/5/6 unique-time layouts. It also includes an LP-009 multilingual regression check.
