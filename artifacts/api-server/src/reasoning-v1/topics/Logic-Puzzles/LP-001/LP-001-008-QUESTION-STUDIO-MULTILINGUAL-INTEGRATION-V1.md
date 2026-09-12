# LP-001 → LP-008 — Multilingual Question Studio Integration V1

## Approved authorities

- English: `LP_001_008_ENGLISH_FREEZE_V1`
- Hindi/Punjabi approval: `LP_001_008_HI_PA_LOCALIZATION_APPROVAL_V4`
- Hindi/Punjabi freeze: `LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4`
- Question Studio integration: `LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1`
- Permanent QLs: `LP-QL-001..LP-QL-032`

## Shared integration contract

LP-001 through LP-008 now use the normal shared Logic Puzzle Question Studio surface in all three supported languages: `en`, `hi` and `pa`.

For English, Question Studio generates only from the approved V4.2 English authority. For Hindi and Punjabi, it generates only from the approved/frozen V4 semantic localization authority. The same seed preserves the same solved caselet, permanent QL, difficulty and correct option index across languages.

Standalone Question Studio text for LP-001 through LP-008 contains the complete setup/domain, the learner-facing clues, and the child question. LP-001 uses the approved rule that only genuine repeated clues are clubbed. Explanation order remains dependency-driven and retains progressive working tables and genuine case tables where required.

## Lifecycle lock

This integration activates multilingual generation for **review inside Question Studio only**. It does not create a second Question Bank or release pipeline.

- Runtime: `REVIEW_ONLY`
- Question Bank storage: `NOT_STORED`
- Question Bank writable: `false`
- Test eligibility: `INELIGIBLE`
- Mock-test eligibility: `false`
- Public publication: `false`
- Automatic student publication: `false`

All downstream selection, storage, test/mock assembly and publication continue to belong to the normal shared Question Studio workflow after their own explicit lifecycle decisions.

## Package ownership

| Package | Permanent QLs |
|---|---|
| LP-001 | LP-QL-001..004 |
| LP-002 | LP-QL-005..008 |
| LP-003 | LP-QL-009..012 |
| LP-004 | LP-QL-013..016 |
| LP-005 | LP-QL-017..020 |
| LP-006 | LP-QL-021..024 |
| LP-007 | LP-QL-025..028 |
| LP-008 | LP-QL-029..032 |

The Logic Puzzle registry remains contiguous through `LP-QL-040`; the next genuine new Logic Puzzle QL remains `LP-QL-041`.
