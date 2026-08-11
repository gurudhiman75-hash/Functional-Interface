# Probability ML-06 — Native Human Review Ready

## Scope

ML-06 opens the ML-05 Hindi/Punjabi Probability presentation layer to **Question Studio editorial review only**.

It does not approve native content and does not enable native scored generation.

## Review inventory

- English mathematical QLs: 216
- Hindi review surfaces: 216
- Punjabi review surfaces: 216
- Total native review surfaces: 432
- PRB-001: 120 QLs / 240 native surfaces
- PRB-002: 96 QLs / 192 native surfaces

Each review item is regenerated from the ML-05 English-first runtime using a deterministic seed and then rendered through the native overlay.

## Question Studio review-only registration

The ML-06 adapter exposes filters for:

- language: Hindi / Punjabi;
- package: PRB-001 / PRB-002;
- QL;
- difficulty;
- deterministic seed;
- review batch count.

Review runs are allowed to persist to the normal Question Studio **review queue** so editors can inspect and record decisions.

The persisted payload always carries:

- `reviewOnly: true`;
- `questionBankStatus: NOT_STORED`;
- `questionBankWritable: false`;
- `testEligibility: INELIGIBLE`;
- `testEligible: false`;
- `mockTestEligible: false`;
- `publiclyPublishable: false`;
- `automaticStudentPublication: false`;
- `releaseFreezeStatus: PENDING_HUMAN_REVIEW`.

## Mathematical authority

Every native review item preserves the ML-05 English source authority for:

- generated parameters;
- experiment and event model;
- solver result;
- independent verification;
- option array;
- correct index;
- answer;
- parameter fingerprint;
- mathematical fingerprint;
- mock-family policy.

The review adapter rechecks option, answer and correct-index parity before the item can enter Question Studio.

## Human review evidence

`native-review-freeze.ts` is the committed freeze authority.

It deliberately starts with an empty review-decision ledger. No reviewer names, dates or approvals are invented by implementation code.

A complete ML-06 editorial approval requires **432 explicit decisions**:

- 216 Hindi QL approvals;
- 216 Punjabi QL approvals.

Each committed decision must contain:

- QL ID;
- language;
- reviewer identity;
- review timestamp;
- `APPROVED` or `CHANGES_REQUIRED`;
- notes.

The freeze guard remains closed until all 432 unique QL-language surfaces have explicit `APPROVED` decisions.

Even after all 432 review decisions exist, the authority reports `HUMAN_REVIEW_COMPLETE_AWAITING_EXPLICIT_FREEZE`; student delivery is still not automatically enabled.

## What reviewers should inspect

For every rendered native item, review:

1. whether the stem sounds like a real SSC/Banking/Punjab exam question rather than a literal translation;
2. whether Hindi/Punjabi terminology is natural and unambiguous;
3. whether replacement, conditional probability, complement, event algebra and counting language preserves the exact mathematical condition;
4. whether pronouns, noun agreement and singular/plural forms are natural;
5. whether options remain understandable with the language-neutral mathematical notation;
6. whether the native explanation is easy for a student to follow;
7. whether visual titles/alt text are native and meaningful;
8. whether any English prose leaks into the native learner surface;
9. whether the correct option and answer still match the English authority.

Any editorial correction must be followed by the full ML-05/ML-06 parity suite again.

## Release boundary

ML-06 review access does **not** change the multilingual release manifest. Hindi and Punjabi remain `PENDING_NATIVE_EDITORIAL` and regular native Question Studio generation remains disabled.

The following stay locked until explicit human approval and a later release freeze:

- Question Bank storage;
- scored native mocks;
- test-series routing;
- public/student publication.

## Implementation status

This checkpoint implementation provides:

- a 216-QL native review catalog;
- a 432-surface parity-backed review adapter;
- Question Studio preview and review-run persistence endpoints;
- an admin review panel;
- review-queue status metrics;
- a committed human-review freeze authority with zero fabricated approvals;
- a fail-closed 432-decision freeze guard;
- regression coverage proving the release locks remain closed.

Human editorial sign-off remains real work to be performed through the review surface; it is not claimed by this implementation.
