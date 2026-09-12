# LP-010 Hindi/Punjabi Localization Approval V6

Status: APPROVED AND FROZEN

Approved on: 2026-09-10
Approval basis: explicit human review approval

## Authority

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- English source authority: `LP_010_ENGLISH_FREEZE_V1`
- Localization authority: `LP_010_HI_PA_LOCALIZATION_REVIEW_V6`
- Freeze authority: `LP_010_HI_PA_LOCALIZATION_FREEZE_V6`
- Permanent QLs: `LP-QL-037..LP-QL-040`
- Languages: English, Hindi and Punjabi

## Approved localization contract

The Hindi and Punjabi versions are semantic rebuilds of the frozen English solved caselet. They preserve the hidden assignment, permanent QL, difficulty band, correct option index, clue semantics, chronological slot ordering and time-pattern identity.

The approved English V4 time-layout diversity is preserved: LP-010 may use 2, 4, 5 or 6 unique clock times across the six day-time slots. Repeated-time clues appear only when the underlying schedule actually contains a repeated clock time.

Learner-facing copy uses native-script names and weekdays, natural Hindi/Punjabi day-time grammar, scenario-specific wording, semicolon-separated six-slot domains for readability, unique localized display names and progressive clue-by-clue explanation tables. Option-by-option analysis, generic shortcut/trap filler and separate LP-specific release machinery are not part of the approved contract.

## Next step

Connect `en`, `hi` and `pa` for LP-010 to the existing shared Logic Puzzle Question Studio adapter and prove multilingual semantic parity through the normal Question Studio path.
