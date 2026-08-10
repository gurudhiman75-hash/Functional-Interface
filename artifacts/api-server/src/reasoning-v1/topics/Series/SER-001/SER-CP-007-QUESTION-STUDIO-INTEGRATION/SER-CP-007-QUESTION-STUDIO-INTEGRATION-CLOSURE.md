# SER-CP-007 — Current-Main Question Studio Integration Closure

Status: `COMPLETE_REVIEW_ONLY_CURRENT_MAIN_INTEGRATION`

Authority: `SER_CP007_QUESTION_STUDIO_REVIEW_RUNTIME_V1`

Integration PR: `#671`

## Final result

`SER-001` is integrated with the current ExamTree Question Studio architecture as a dedicated multilingual **review-only** Series package.

```text
Package:                     SER-001
Canonical problem:           SER-CP-007
Runtime mode:                FROZEN_REVIEW
Review status:               APPROVED_MULTILINGUAL_FROZEN
Languages:                   en, hi, pa
Locales:                     en-IN, hi-IN, pa-IN
Frozen templates:            140
Permanent QLs:               SER-QL-001..SER-QL-013
Multilingual frozen payloads: 420
Maximum admin batch size:     50
Generation domain:            reasoning-v1
```

## Current-main integration surfaces

### Frozen review adapter

`question-studio-review-adapter.ts` projects the frozen SER-001 authority into the current Question Studio review contract with deterministic seed support and optional filtering by:

- language;
- permanent QL;
- difficulty;
- batch count.

It never upgrades the underlying Series lifecycle.

### Dedicated admin API

`admin-question-studio-series.ts` exposes:

- `GET /admin/question-studio/reasoning/series/package`;
- `GET /admin/question-studio/reasoning/series/preview`;
- `POST /admin/question-studio/reasoning/series/runs`;
- `GET /admin/question-studio/reasoning/series/status`.

Created runs use the normal Question Studio generation/review tables. Persistence therefore means **review-queue persistence only**, not Question Bank storage.

### Dedicated admin panel

`QuestionStudioSeriesReviewPanel` is mounted in Question Studio Operations independently of the production-enabled BLR panel. It provides:

- English, Hindi and Punjabi selection;
- all 13 permanent QLs;
- Easy / Medium / Hard filtering;
- batch-size control;
- deterministic seed control;
- frozen-question preview;
- review-run creation;
- explicit review-only lifecycle warnings and status metrics.

## Why Series is not in the shared BLR production registry

Current `New-main` intentionally gives the shared BLR Reasoning package surface production semantics. Registering SER-001 there would incorrectly advertise Series as Question Bank writable, test eligible and publishable.

The current-main integration therefore keeps Series on a dedicated review-only surface. This is an intentional safety boundary, not missing integration.

## Editorial approval behavior

The generated-item approval policy now distinguishes explicit review-only payloads narrowly:

```text
questionBankStatus == NOT_STORED
AND
questionBankWritable == false
```

Only when both are present is an item allowed to become editorially `approved` without Question Bank conversion. All other payloads continue through the established conversion/eligibility path.

## Downstream safety boundary

Every Series review payload remains:

```text
questionBankStatus:          NOT_STORED
questionBankWritable:        false
testEligibility:             INELIGIBLE
testEligible:                false
mockTestEligible:            false
publiclyPublishable:         false
automaticStudentPublication: false
```

The Question Bank converter independently rejects Series payloads because they are explicitly `NOT_STORED`.

## Executable proof

The protected workflow `Reasoning SER-001 Current-Main Review Integration` verifies:

- all 140 frozen templates;
- all 13 permanent QLs;
- all 420 multilingual payloads;
- 140 payloads for each locale;
- permanent-Ql coverage in every locale;
- option/answer validity and localization script presence;
- deterministic 50-question generation for every language;
- targeted generation for all 13 QLs × 3 languages;
- Question Bank rejection of every frozen review payload;
- narrow editorial-review-only approval disposition;
- Series API route mounting;
- Series admin panel mounting;
- complete admin application TypeScript check;
- complete API server build.

The same PR also triggers the existing BLR, Calendar and integrated-admin regression workflows because shared route/page surfaces are touched.

## Completion boundary

SER-001 is complete for current-main Question Studio editorial review integration.

This closure does **not** authorize Question Bank storage, mock-test/test assembly, student delivery or public publication. Any such Series release is a separate lifecycle checkpoint requiring explicit implementation and approval.
