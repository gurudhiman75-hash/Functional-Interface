# LP-009 — Hindi/Punjabi Localization Review V3

Status: **current human-review candidate**. V3 retains the semantic parity foundation from V1 and the native exam-wording remediation from V2, then closes the remaining year-mode grammatical inflection issue found during direct inspection of the generated V2 review pack.

## Direct-review correction

V2 generated correct questions, clues and solve steps, but year-mode explanation summaries still used uninflected plural nouns in possessive constructions. V3 replaces them with native forms, for example:

- Hindi: `शर्तों से सभी अधिकारियों के जन्म-वर्ष तय हो जाते हैं।`
- Hindi: `शर्तों से सभी शोधकर्ताओं के जन्म-वर्ष तय हो जाते हैं।`
- Punjabi: `ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਅਧਿਕਾਰੀਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।`
- Punjabi: `ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਖੋਜਕਰਤਿਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।`

## Authority chain

```text
LP_009_ENGLISH_FREEZE_V1
  -> LP_009_HI_PA_LOCALIZATION_REVIEW_V1   semantic rebuild/parity
  -> LP_009_HI_PA_LOCALIZATION_REVIEW_V2   native exam wording
  -> LP_009_HI_PA_LOCALIZATION_REVIEW_V3   year-summary inflection closeout
```

## V3 executable guard

`lp-009-localization-v3.test.ts` audits another 100 caselets per language, or **200 caselets / 800 localized questions**. It rechecks solver parity, correct-option indices, exact `25/25/25/25` answer balance per QL per language, progressive explanation tables and the corrected year-summary forms.

Together with V1 and V2, this PR now carries three independent localization regression layers while the frozen English proof remains unchanged.

## Current human-review export

`lp-009-localization-v3-review-export.ts` is the authoritative review export. It contains all eight scenario profiles in Hindi and Punjabi, 32 questions per language.

## Lifecycle boundary

```text
English authority:              FROZEN V1
Permanent QLs:                  LP-QL-033..036
Hindi localization:             HUMAN_REVIEW_CANDIDATE_V3
Punjabi localization:           HUMAN_REVIEW_CANDIDATE_V3
Question Studio language use:   NOT ENABLED
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
mock-test eligibility:          false
public publication:             false
automatic student publication: false
```

Human approval of the V3 learner-facing review pack remains the next gate. No production language activation is part of this checkpoint.
