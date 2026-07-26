# TMW-001 / TMW-CP-001 Implementation Status

Status: **English runtime-proof implementation candidate; source-gap and human editorial review remain open.**

## Implemented

- exact reduced-rational arithmetic;
- deterministic seed generation;
- 22 currently discovered CP-001 solve modes;
- 22 human-owned English QLs, one for each currently distinct task contract;
- exam-style controlled contexts;
- formula-led topology-specific explanations;
- declared misconception options;
- independent identity-based verification;
- four-option validation;
- 40-seed-per-QL runtime proof;
- Question Studio lifecycle metadata;
- review export support.

## Lifecycle safety

Every generated object is a Question Studio candidate with:

```text
reviewStatus: UNREVIEWED
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

No runtime candidate is treated as a Question Bank record. Human approval and bank storage are separate downstream actions.

## Counts are not quotas

The current checkpoint has 22 QLs and 22 solve modes because those are the materially distinct CP-001 contracts admitted by the present design audit. These values are not terminal reservations. Additional source-backed modes may be admitted; mathematically duplicate modes may be merged before CP freeze.

## Still required before CP freeze

- source-to-mode audit against all uploaded books and official/PYQ fixtures;
- human review of at least three seeds per QL;
- semantic duplicate audit beyond normalised templates;
- explanation editorial review;
- official CI workflow on the exact branch head;
- Hindi and Punjabi work only after English ownership freezes;
- Question Studio integration after chapter-base acceptance.
