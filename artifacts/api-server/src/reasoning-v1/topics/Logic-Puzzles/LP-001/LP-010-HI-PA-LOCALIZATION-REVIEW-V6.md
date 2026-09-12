# LP-010 Hindi/Punjabi Localization Review V6

Status: human review candidate. English V4 remains frozen under `LP_010_ENGLISH_FREEZE_V1`.

## Scope

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- Permanent QLs: `LP-QL-037`–`LP-QL-040`
- Languages under review: Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Current authority: `LP_010_HI_PA_LOCALIZATION_REVIEW_V6`
- Method: semantic rebuild from each frozen English caselet plus native learner-facing rendering

## Frozen parity

Hindi and Punjabi retain the English hidden assignment, QL, difficulty, correct option index, clue semantics, scenario profile, exact clock values and time-pattern identity. The approved 2/4/5/6-unique-time distribution is unchanged.

Names and weekdays are localized to the target script. Six display names must remain unique inside every caselet; Hindi therefore distinguishes `Eshan → एशान` from `Ishan → ईशान`. Clock values remain in the approved numeric `HH:MM AM/PM` form.

## Editorial closeout

Scenario-specific learner wording is used instead of repeating a generic “programme” label: presentation, interview, practical demonstration, counselling and review meeting forms are rendered natively. Exact-time and ordering relations deliberately use person-based wording where noun case would otherwise become brittle. Direct day-time wording follows natural forms such as `मंगलवार को 9:00 AM पर` and `ਮੰਗਲਵਾਰ ਨੂੰ 9:00 AM ਵਜੇ`.

The six day-time domain entries are semicolon-separated for readability. Every standalone question contains all six people, all three days, all six day-time positions and every clue. Explanations remain simple: one clue, one consequence, a progressive table, then the completed schedule and specific answer. There is no option-by-option analysis.

## Verification

V1–V6 regression layers cover semantic parity, answer-position parity, 2/4/5/6-time preservation, native-script rendering, display-name uniqueness, domain readability, scenario-specific wording and Hindi/Punjabi case grammar over large deterministic batches.

Localization remains review-only until explicit human approval. After approval, Hindi/Punjabi will be frozen and LP-010 will be connected to the existing shared Logic Puzzle Question Studio.
