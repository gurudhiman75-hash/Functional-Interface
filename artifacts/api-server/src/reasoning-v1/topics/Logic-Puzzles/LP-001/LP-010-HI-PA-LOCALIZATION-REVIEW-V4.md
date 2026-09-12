# LP-010 Hindi/Punjabi Localization Review V4

Status: human review candidate. English V4 remains frozen under `LP_010_ENGLISH_FREEZE_V1`.

## Scope

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- Permanent QLs: `LP-QL-037`–`LP-QL-040`
- Languages under review: Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Localization authority: `LP_010_HI_PA_LOCALIZATION_REVIEW_V4`
- Supersedes: `LP_010_HI_PA_LOCALIZATION_REVIEW_V3`
- Method: semantic rebuild from each frozen solved English caselet, followed by native learner-facing rendering

## Frozen semantic parity

Hindi and Punjabi preserve the English hidden assignment, QL, difficulty, correct option index, clue semantics, scenario profile, time-pattern identity, exact clock values and answer balance. The approved 2/4/5/6-unique-time layouts remain unchanged across languages.

All learner-facing names and weekdays use the target script. Clock values remain in standard numeric `HH:MM AM/PM` form. Display names are guaranteed unique within every caselet; in Hindi, English `Eshan` and `Ishan` remain distinct as `एशान` and `ईशान`.

## Native wording and readability closeout

Direct clues use natural target-language order, e.g. `मंगलवार को 9:00 AM पर` and `ਮੰਗਲਵਾਰ ਨੂੰ 9:00 AM ਵਜੇ`. Pair-match questions use neutral grammatical wording rather than mechanical noun pluralization. The six day-time entries in the setup are separated with semicolons so commas inside labels do not make the domain hard to read.

Every standalone stem states all six people, all three days, all six day-time positions and every clue. Explanations are rebuilt from semantic clues one step at a time, with a progressive table after every clue and a completed final schedule. No option-by-option analysis or generic shortcut/trap filler is included.

## Verification

- `lp-010-localization-v1.test.ts`: base semantic parity over 200 localized caselets / 800 questions.
- `lp-010-localization-v2.test.ts`: native plural/setup wording regression.
- `lp-010-localization-v3.test.ts`: unique display names, native day-time rendering, solver parity and explanation parity over 200 localized caselets / 800 questions.
- `lp-010-localization-v4.test.ts`: semicolon-separated six-slot domain readability while retaining all V3 guarantees.

Localization remains review-only until explicit human approval. After approval, Hindi/Punjabi will be frozen and LP-010 will be connected to the existing shared Logic Puzzle Question Studio.
