# LP-009 — Hindi/Punjabi Localization Review V1

Status: **human-review candidate**. This checkpoint localizes the frozen LP-009 English authority into Hindi and Punjabi without changing solver truth, permanent QL ownership, difficulty, answer positions or lifecycle permissions.

## Source authority

- English authority: `LP_009_ENGLISH_FREEZE_V1`
- Permanent QLs: `LP-QL-033` through `LP-QL-036`
- Localization method: semantic rebuild from the frozen solved caselet, not string-by-string translation of rendered English output
- Locales under review: `hi-IN`, `pa-IN`

## Editorial contract

Hindi and Punjabi must preserve the approved English V2 teaching structure:

1. state the complete exam-like setup;
2. show all clues in simple language;
3. record direct entries first;
4. apply each remaining clue explicitly;
5. show a progressive table after every step;
6. finish with the unique completed schedule;
7. end with the conclusion for the actual child question;
8. do not add option-by-option analysis, shortcut filler, trap commentary or machine-like meta language.

Names and month labels are rendered in the target script. Years remain numeric. Month/year ordering, assignments and the one-to-one solve contract are inherited from the frozen English caselet.

## Executable review proof

`lp-009-localization-v1.test.ts` audits 100 deterministic caselets in each language: **200 caselets / 800 localized questions** total.

It requires:

- all eight scenario profiles;
- both MONTH and YEAR modes;
- Easy, Medium and Hard bands;
- the same four permanent QLs;
- same solved assignment as English;
- independent unique-solution proof after localization;
- unchanged correct-option index;
- exactly 100 questions per QL per language;
- exact A/B/C/D answer balance of `25/25/25/25` per QL per language;
- native-script stems, clues and explanations;
- identical explanation-step count to frozen English;
- a progressive table in every explanation step;
- no option-analysis block;
- all Question Bank/test/mock/publication locks retained.

## Human review pack

`lp-009-localization-review-export.ts` exports eight deterministic caselets per language, covering all eight scenario profiles. This produces 32 Hindi and 32 Punjabi questions for editorial review.

## Lifecycle boundary

```text
English authority:              FROZEN V1
Permanent QLs:                  LP-QL-033..036
Hindi localization:             REVIEW CANDIDATE V1
Punjabi localization:           REVIEW CANDIDATE V1
Question Studio production:     NOT ENABLED BY THIS CHECKPOINT
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
mock-test eligibility:          false
public publication:             false
automatic student publication: false
```

Human approval is required before a localization freeze or normal Question Studio language activation is declared.
