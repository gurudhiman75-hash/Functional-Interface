# LP-009 — Hindi/Punjabi Localization Review V2

Status: **human-review candidate V2**. This supersedes the initial V1 review wording while keeping the same semantic localization architecture and all frozen English invariants.

## Why V2 exists

Generated V1 samples were structurally correct but exposed some grammatically stiff phrases, especially compound month expressions such as redundant “birth month / which month” wording and incorrect postpositions around compound nouns. V2 replaces those with profile-specific native exam language instead of accepting mechanically valid translation output.

Examples of the V2 direction:

- Hindi birth-month lookup: `नेहा का जन्म किस महीने में हुआ था?`
- Hindi interview lookup: `भारत का इंटरव्यू किस महीने में हुआ था?`
- Punjabi birth-month lookup: `ਨੇਹਾ ਦਾ ਜਨਮ ਕਿਸ ਮਹੀਨੇ ਵਿੱਚ ਹੋਇਆ ਸੀ?`
- Punjabi course lookup: `ਜ਼ੁਬਿਨ ਕਿਸ ਮਹੀਨੇ ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ?`

Clue wording is also profile-aware: birth, interview, course-start and review-meeting statements use their natural verbs rather than forcing every sentence through one generic “assigned month” frame.

## Frozen invariants

V2 does not change:

- `LP-QL-033..036` ownership;
- the English caselet or frozen English wording;
- clue semantics;
- solver assignment or uniqueness;
- difficulty;
- option set size;
- correct-option index;
- progressive explanation step count;
- Question Bank/test/mock/publication locks.

## Validation

`lp-009-localization-v2.test.ts` runs another 200-caselet / 800-question Hindi-Punjabi audit over V2. In addition to semantic parity and exact A/B/C/D balance, it explicitly rejects the awkward V1 constructions identified during generated-sample inspection.

`lp-009-localization-v2-review-export.ts` is the current human-review export and covers all eight scenario profiles in both languages.

## Lifecycle

```text
English authority:              FROZEN V1
Permanent QLs:                  LP-QL-033..036
Hindi localization:             HUMAN_REVIEW_CANDIDATE_V2
Punjabi localization:           HUMAN_REVIEW_CANDIDATE_V2
Question Studio language use:   NOT ENABLED
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
mock-test eligibility:          false
public publication:             false
automatic student publication: false
```

Human review of the V2 pack remains the next approval gate.
