# LP-009 — Multilingual Question Studio Integration V1

Status: **implementation candidate** for the approved/frozen LP-009 English V1 + Hindi/Punjabi V3 authorities.

## Purpose

Expose LP-009 in Question Studio review mode in all three approved languages without widening the language gate for LP-001 through LP-008 and without opening any downstream content-delivery gate.

## Source authorities

- English: `LP_009_ENGLISH_FREEZE_V1`
- Hindi/Punjabi: `LP_009_HI_PA_LOCALIZATION_FREEZE_V3`
- Question Studio integration: `LP_009_MULTILINGUAL_QUESTION_STUDIO_V1`
- Permanent QLs: `LP-QL-033..LP-QL-036`

## Question Studio behavior

The LP-009 package capability now advertises `en`, `hi`, and `pa`, reports four permanently allocated QLs, and remains `REVIEW_ONLY`.

Generation behavior:

- `en` uses the frozen English `generateLp009Batch` path;
- `hi` and `pa` use the approved frozen V3 semantic-localization path;
- common seeds preserve the same solved assignment, QL and correct-option index across all languages;
- `Hindi` / `Punjabi` and locale forms `hi-IN` / `pa-IN` normalize to canonical language codes;
- unsupported LP-009 languages fail closed;
- LP-001 through LP-008 remain English-only and fail closed for Hindi/Punjabi requests.

## Lifecycle boundary

```text
Question Studio LP-009:         REVIEW_ONLY, en/hi/pa active
Permanent QLs:                  ALLOCATED, LP-QL-033..036
English authority:              FROZEN V1
Hindi/Punjabi authority:        FROZEN V3
Question Bank:                  NOT_STORED
Question Bank writable:         false
Test eligibility:               INELIGIBLE
Mock-test eligibility:          false
Public publication:             false
Automatic student publication: false
```

No Question Bank admission, test/mock eligibility, deployment release or automatic student publication is authorized by this integration.
