# LP-009 — Hindi/Punjabi Localization Review V3

Status: **APPROVED AND FROZEN** on 2026-09-10 after explicit human review approval. The authoritative approval record is `LP-009-HI-PA-LOCALIZATION-APPROVAL-V3.md` and the executable freeze authority is `LP_009_HI_PA_LOCALIZATION_FREEZE_V3`.

## Scope

V3 is the approved Hindi/Punjabi learner-facing localization for frozen `LP-009 / LP-CP-009`, covering permanent `LP-QL-033..LP-QL-036` across all eight scenario profiles and both MONTH/YEAR modes.

Localization is rebuilt semantically from the frozen solved English caselet rather than translating rendered English strings. Solver truth, QL ownership, difficulty and correct-option position remain identical while learner-facing scenario copy, names, months, clues, questions and explanations are authored in the target language.

## Editorial history

- **V1 — semantic parity foundation:** full Hindi/Punjabi rebuild with progressive tables and frozen solver truth.
- **V2 — native exam wording:** replaced stiff generic constructions with profile-specific natural exam wording after direct sample inspection.
- **V3 — grammar closeout:** corrected remaining year-summary plural/possessive inflections and added executable guards for those forms.

## Frozen learner contract

1. Simple, natural exam-style Hindi/Punjabi.
2. Full standalone setup with all six entities and all six month/year values stated.
3. Same clue semantics and unique solved assignment as frozen English.
4. Direct placements first, then clue-by-clue deductions.
5. A progressive table after every meaningful deduction step.
6. Child-question-specific final conclusion.
7. No option-by-option analysis.
8. No unnecessary shortcut/trap filler.
9. No local city/centre object pools or machine-facing wording.
10. Year questions use ordered birth years; no age arithmetic.

## Validation

The approved V3 workflow re-proves:

- frozen English authority;
- V1 semantic parity and V2 native-wording regression;
- V3 grammatical closeout;
- all 8 scenario profiles, MONTH/YEAR and Easy/Medium/Hard;
- independent unique-solution parity;
- permanent `LP-QL-033..036` ownership;
- unchanged correct-option indices;
- exactly 100 questions per QL per language in the audit;
- exact A/B/C/D balance `25/25/25/25` per QL per language;
- progressive explanation tables and frozen explanation step counts;
- native-script learner copy;
- rejected awkward grammar patterns;
- downstream lifecycle locks.

The reviewed export contains all eight profiles in both languages: **32 Hindi + 32 Punjabi questions**.

## Lifecycle boundary

```text
English authority:              FROZEN V1
Hindi localization:             FROZEN V3
Punjabi localization:           FROZEN V3
Permanent QLs:                  LP-QL-033..036
Question Studio:                REVIEW_ONLY (multilingual integration permitted)
Question Bank:                  NOT_STORED
Question Bank writable:         false
Test eligibility:               INELIGIBLE
Mock-test eligibility:          false
Public publication:             false
Automatic student publication: false
```

Approval permits the next separate checkpoint: wiring Hindi/Punjabi into the existing LP-009 Question Studio review-only route. It does not authorize Question Bank admission, tests/mocks, publication or student delivery.
