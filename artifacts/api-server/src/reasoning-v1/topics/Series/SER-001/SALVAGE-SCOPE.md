# SER-001 recovery and current-main integration scope

## Historical recovery

The SER-001 chapter was recovered from the completed Series implementation line rather than rebuilt from scratch. The recovered authority contains the frozen chapter assets, permanent QL registry, multilingual runtime, and Question Studio review runtime.

Historical salvage work intentionally kept downstream release surfaces locked. That safety decision remains authoritative.

## Preserved on the current-main integration

- frozen 140-template Series authority;
- 13 permanent QLs (`SER-QL-001` through `SER-QL-013`);
- final English runtime dependency chain;
- final Hindi and Punjabi localization runtime;
- 420 multilingual frozen review payloads;
- Question Studio readiness and review-only runtime;
- review-queue persistence in the existing generation-run tables;
- editorial approval with deliberate Question Bank conversion skip;
- dedicated Series admin API and Question Studio panel.

## Current-main architecture

SER-001 is **not** inserted into the production-enabled BLR shared Reasoning package surface. Current `New-main` gives that surface production lifecycle semantics, which would be unsafe for Series.

Instead SER-001 is integrated through a dedicated review-only route and panel:

- API: `/admin/question-studio/reasoning/series/*`;
- admin panel: `QuestionStudioSeriesReviewPanel`;
- persisted items remain in the Question Studio generation/review queue only;
- the generic generated-item approval path recognizes explicit `NOT_STORED + questionBankWritable=false` payloads as editorial-review-only approvals and skips Question Bank conversion.

## Deliberately excluded

- production registration in the BLR shared Reasoning package registry;
- Question Bank writes for Series;
- test or mock-test eligibility;
- public/student publication;
- automatic publication after editorial approval;
- unrelated historical Series audit/remodel code as active runtime dependencies.

## Safety state

Series remains review-only:

- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`

The current-main integration is tracked by PR #671 and is protected by the `Reasoning SER-001 Current-Main Review Integration` workflow.
