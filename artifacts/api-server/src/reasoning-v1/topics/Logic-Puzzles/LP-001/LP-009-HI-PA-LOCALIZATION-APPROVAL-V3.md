# LP-009 — Hindi/Punjabi Localization Approval V3

Status: **APPROVED and FROZEN on 2026-09-10** after explicit human review approval.

## Approved authority

- Package: `LP-009`
- Checkpoint: `LP-CP-009`
- English source authority: `LP_009_ENGLISH_FREEZE_V1`
- Localization authority: `LP_009_HI_PA_LOCALIZATION_REVIEW_V3`
- Freeze authority: `LP_009_HI_PA_LOCALIZATION_FREEZE_V3`
- Permanent QLs: `LP-QL-033..LP-QL-036`
- Languages: English, Hindi, Punjabi

## What is frozen

The approved Hindi/Punjabi surface keeps the frozen English puzzle truth while rebuilding learner-facing language natively. The following are fixed unless a later explicit editorial revision supersedes V3:

1. identical solved assignment and clue semantics across languages;
2. identical permanent QL ownership and difficulty band;
3. identical correct-option position;
4. all eight LP-009 scenario profiles and both MONTH/YEAR modes;
5. natural exam-style Hindi/Punjabi questions and clues;
6. progressive clue-by-clue explanations with a table after each meaningful deduction;
7. child-question-specific final conclusion;
8. no option-by-option analysis, shortcut/trap filler, local city/centre pools, or machine-facing wording;
9. year questions use ordered birth years without age arithmetic.

## Editorial history

- V1 established semantic parity from the frozen solved caselet.
- V2 replaced grammatically stiff generic constructions with profile-specific native exam wording.
- V3 corrected the remaining year-summary plural/possessive inflections and added regression guards for those forms.

The reviewed V3 export contains all eight scenario profiles in both languages: 32 Hindi + 32 Punjabi questions.

## Lifecycle after approval

Localization approval permits Hindi/Punjabi to be wired into the existing LP-009 Question Studio **review-only** route. It does **not** authorize downstream release.

```text
English authority:              FROZEN V1
Hindi/Punjabi localization:     FROZEN V3
Permanent QLs:                  LP-QL-033..036
Question Studio:                REVIEW_ONLY (multilingual integration permitted)
Question Bank:                  NOT_STORED
Question Bank writable:         false
Test eligibility:               INELIGIBLE
Mock-test eligibility:          false
Public publication:             false
Automatic student publication: false
```

Question Bank admission, test/mock eligibility and publication require separate later gates.
