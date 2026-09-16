# COD-001 — Question Studio Promotion V1

Status: **Question Studio review-generation promotion candidate; downstream release locks remain closed**.

Date: 2026-09-13

## Scope

This promotion does not create a second Coding-Decoding package and does not change COD-001 question semantics. It registers the existing canonical multilingual runtime as one shared Reasoning V1 Question Studio review package covering `COD-QL-001..203`.

The late source-gap identities `COD-QL-200..203` move from hidden review runtime to Question Studio review discovery after their multilingual/editorial approval. Their solve contracts, checkpoint ownership, source fixtures, options, answer truth, instance-derived difficulty and localization parity are unchanged.

## Question Studio contract

- package: `COD-001`
- QLs: `COD-QL-001..203`
- checkpoints: `COD-CP-001..010`
- locales: `en-IN`, `hi-IN`, `pa-IN`
- deterministic seed preview: enabled
- shared Reasoning V1 registry discovery: enabled
- review generation: enabled
- review-only lifecycle: retained

## Locks that remain closed

- Question Bank writes: disabled
- test eligibility: disabled
- mock-test eligibility: disabled
- public publication: disabled
- automatic student publication: disabled

The generic registry persistence path throws deliberately for COD-001. A separate explicit release decision is required before any storage or student-delivery surface is opened.

## Proof

`question-studio-review.test.ts` proves:

- one unique shared package registration;
- all 203 permanent QL identities are discoverable through the package catalog;
- a legacy QL can preview through the shared dispatcher;
- `COD-QL-200..203` preview deterministically in English, Hindi and Punjabi;
- source-gap questions are Question-Studio-visible/discoverable;
- Question Bank, mock-test and public flags remain false;
- `COD-QL-204` is rejected;
- generic persistence is rejected.

The existing source-gap discovery, English extension, localization and whole-chapter multilingual gates are updated only where required to reflect the approved Question Studio visibility change. They continue to enforce review-only and downstream release locks.
