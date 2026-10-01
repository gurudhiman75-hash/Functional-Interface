# DSF-CP-032 — QL002 Normal Question Studio Review Integration

Date: 2026-10-01

Status: **REVIEW-ONLY Question Studio integration**

## What changed

`DSF-QL-002` is no longer runtime-deferred in the normal Data Sufficiency Question Studio review surface.

The seven supported reasoning lanes are:

- Ranking & Order
- Direction Sense
- Blood Relations
- Inequality
- Seating Arrangement
- Coding-Decoding
- Calendar

Each lane supports English, Hindi and Punjabi through the CP031 review localization layer.

## Normal studio behavior

The existing `previewDsf001NormalQuestionStudioReview` entry point now:

- accepts `qlId: DSF-QL-002`;
- restricts QL002 to reasoning lanes;
- normalizes three statements I/II/III;
- preserves the five-option 19-class semantic answer profile;
- exposes the full seven-subset proof;
- remains deterministic and review-persistable.

## Hard release boundary

QL002 is intentionally **not** promoted by the existing CP017 bank-only workflow.

For every QL002 output:

- Question Studio discoverable: true
- review persistence: true
- Question Bank status: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false

QL001 behavior remains unchanged.

## Executable proof

`question-studio-ql002-integration-v1.test.ts` exercises all seven lanes in English/Hindi/Punjabi through both the normal preview and normal workflow entry points.
