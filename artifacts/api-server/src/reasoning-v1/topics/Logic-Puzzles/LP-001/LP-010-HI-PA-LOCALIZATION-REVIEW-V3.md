# LP-010 Hindi/Punjabi Localization Review V3

Status: human review candidate. English V4 remains frozen under `LP_010_ENGLISH_FREEZE_V1`.

## Scope

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- Permanent QLs: `LP-QL-037`–`LP-QL-040`
- Languages under review: Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Localization authority: `LP_010_HI_PA_LOCALIZATION_REVIEW_V3`
- Supersedes: `LP_010_HI_PA_LOCALIZATION_REVIEW_V2`
- Method: semantic rebuild from each frozen solved English caselet, followed by native learner-facing rendering

## Frozen semantic parity

Hindi and Punjabi preserve the English hidden assignment, QL, difficulty, correct option index, clue semantics, scenario profile, time-pattern identity, exact clock values and answer balance. The approved 2/4/5/6-unique-time layouts remain unchanged across languages.

All learner-facing names and weekdays use the target script. Clock values remain in the standard numeric `HH:MM AM/PM` form. V3 explicitly guarantees six distinct display names inside every caselet; the English pool distinction between Eshan and Ishan is rendered as `एशान` and `ईशान` in Hindi rather than collapsing to one name.

## Native wording closeout

Direct day-time clues use natural target-language order such as `मंगलवार को 9:00 AM पर` and `ਮੰਗਲਵਾਰ ਨੂੰ 9:00 AM ਵਜੇ`. Pair-match questions use neutral grammatical wording instead of mechanically pluralizing profile nouns. Every standalone stem states all six people, all three days, all six day-time positions and every clue.

Explanations are rebuilt from the semantic clue sequence rather than translated from English prose. Each clue gets its own deduction and progressive table, followed by the completed schedule and the specific child answer. No option-by-option analysis or generic shortcut/trap filler is included.

## Verification

- `lp-010-localization-v1.test.ts`: base semantic parity over 200 localized caselets / 800 questions.
- `lp-010-localization-v2.test.ts`: native plural/setup wording regression.
- `lp-010-localization-v3.test.ts`: display-name uniqueness, native day-time rendering, solver parity and explanation parity over another 200 localized caselets / 800 questions.

Localization remains review-only until explicit human approval. After approval, Hindi/Punjabi will be frozen and LP-010 will be connected to the existing shared Logic Puzzle Question Studio.
