# CAL-001 Multilingual Human Freeze V1

Status: **HINDI AND PUNJABI APPROVED AND FROZEN — DELIVERY SURFACES REMAIN LOCKED**

Freeze version: `CAL_001_MULTILINGUAL_EDITORIAL_FREEZE_V1`

Source-gap localisation version: `CAL_001_MULTILINGUAL_SOURCE_GAP_V1`

Approval date: `2026-08-09`

## Approved scope

The human language freeze covers the complete frozen Calendar source inventory:

```text
Approved discovery authorities: 44
Approved source-gap authorities:  3
Total frozen source authorities: 47
Permanent English QLs:           CAL-QL-001..036
Next available identity:         CAL-QL-037
Languages frozen:                en-IN, hi-IN, pa-IN
```

The Hindi and Punjabi review evidence contains:

- 220 curated discovery questions in Hindi;
- 220 curated discovery questions in Punjabi;
- 15 curated source-gap questions in Hindi;
- 15 curated source-gap questions in Punjabi;
- the same mathematical facts, option semantics, answer positions and fingerprints as English.

## Initial audit finding

The pre-freeze Hindi and Punjabi drafts were not ready for approval. Although many stems and options were translated, later English editorial layers had left English instructional text inside explanations across all 44 discovery authorities.

The freeze therefore replaces the draft explanation output with a deterministic human-edited layer rather than masking individual English phrases.

## Editorial corrections

The approved layer provides:

- learner-facing Hindi and Punjabi explanations for every discovery authority;
- localized stems, options, answer conclusions and closest-trap guidance;
- natural inverse wording for recovering an earlier weekday;
- explicit least-positive reasoning when the next occurrence is requested;
- correct century-year guidance using the divisible-by-400 exception;
- correct month-calendar reasoning based on the first weekday and month length;
- clear month/year frequency explanations using complete weeks and extra weekdays;
- natural weekday-set lists using language-appropriate conjunctions;
- localized versions of all three final source-gap authorities;
- correct singular/plural agreement and no doubled copulas in conclusions.

## Machine-enforced parity

`multilingual-freeze.test.ts` checks 128 seeds for every one of the 44 discovery authorities in Hindi and Punjabi and compares each package with English.

The proof enforces:

- identical canonical answers;
- identical answer indices;
- identical semantic facts;
- identical mathematical fingerprints;
- identical option semantic order;
- four unique localized option displays;
- direct question stems;
- complete localized explanations;
- no English instructional leakage;
- no mechanical forms such as `weekday(s)`, slash alternatives or Japanese separators;
- English-only isolation;
- unchanged permanent identities;
- closed Question Studio, Question Bank, mock-test and publication gates.

The same proof covers 128 seeds for each of the three source-gap authorities in both localized languages. `multilingual-editorial-quality.test.ts` separately enforces conclusion grammar and weekday-set plural agreement.

## Human-review verdict

After direct inspection of the regenerated Hindi and Punjabi review packs, the content is approved as exam-ready for the SSC, RRB and Punjab-state aptitude scope represented by the frozen Calendar source inventory.

The freeze applies to:

- stems;
- option wording;
- correct-answer presentation;
- explanations and working steps;
- closest-trap guidance;
- semantic parity with English.

Any later Hindi or Punjabi wording change must create a new multilingual editorial version and rerun the complete proof suite.

## Release boundary

This freeze completes multilingual editorial readiness. It does not activate delivery.

```text
Hindi human freeze:          true
Punjabi human freeze:        true
Multilingual parity:         true
Question Studio:             disabled
Question Bank writes:        disabled
Mock-test eligibility:       disabled
Public publication:          disabled
```

Activation of those delivery surfaces requires a separate integration and release-readiness checkpoint.
