# COM-003 BANK_ONLY activation V1

This checkpoint advances COM-003 Office & Productivity Software from the completed standard REVIEW_ONLY chapter state to the shared internal BANK_ONLY lifecycle.

## Scope

- frozen corpus remains 228 EN + 228 HI + 228 PA = 684 question-language artifacts
- source corpus remains immutable; corrections require source-generator/localization correction and a new governed freeze
- review-run persistence remains enabled
- manual Question Bank acceptance is enabled through `BANK_ONLY`
- Easy and Medium difficulty filters remain authorized
- Hard remains fail-closed

## Locks retained

- test eligibility: disabled
- Test Builder eligibility: disabled
- mock-test eligibility: disabled
- public publication: disabled
- automatic student publication: disabled
- production release: disabled
- inline mutation of frozen source-controlled items: disabled

## Executable evidence

`com003-bank-only-activation-authority-v1.test.ts` audits all 19 QLs × 3 languages × 12 artifacts = 684 frozen question-language artifacts and requires every item to pass the shared Question Bank eligibility gate in `BANK_ONLY` mode while retaining all downstream locks.
