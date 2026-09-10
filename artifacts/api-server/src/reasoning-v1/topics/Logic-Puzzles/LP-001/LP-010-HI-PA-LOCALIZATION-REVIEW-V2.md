# LP-010 Hindi/Punjabi Localization Review V2

Status: human review candidate. English V4 remains frozen under `LP_010_ENGLISH_FREEZE_V1`.

## Scope

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- Permanent QLs: `LP-QL-037`–`LP-QL-040`
- Languages under review: Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Localization authority: `LP_010_HI_PA_LOCALIZATION_REVIEW_V2`
- Method: semantic rebuild from each frozen solved English caselet, not literal string translation

## Parity contract

Hindi and Punjabi preserve the English hidden assignment, QL, difficulty, correct option index, clue semantics, scenario profile, time-pattern identity, exact clock values and answer balance. The 2/4/5/6-unique-time layouts therefore remain unchanged across languages.

All learner-facing names and weekdays use the target script. Clock values remain in the standard numeric `HH:MM AM/PM` form used by the approved English source. Every standalone question repeats the full people/day/day-time setup and all clues.

## Editorial contract

Wording is deliberately simple and exam-like. V2 removes brittle noun-plural construction from pair-match questions and uses a neutral native phrase for two persons. Explanations rebuild the reasoning step by step from the semantic clues, show a progressive table after each clue, and end with the specific child answer. There is no option-by-option analysis or generic solver filler.

## Verification

`lp-010-localization-v1.test.ts` proves 200 localized caselets / 800 questions against the frozen English semantics. `lp-010-localization-v2.test.ts` adds native-wording regression coverage. Localization remains review-only until explicit human approval; Question Studio integration follows approval.
