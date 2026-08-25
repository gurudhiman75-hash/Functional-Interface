# NUM-CP-012 — Hindi and Punjabi Localization Freeze

## Scope

All permanent CP012 authorities `NUM-QL-226..NUM-QL-236` have deterministic Hindi (`hi-IN`) and Punjabi (`pa-IN`) learner-facing runtimes.

Localization is rendered from the same hidden mathematical state as frozen English. It does not translate opaque English strings blindly and does not alter the selected mathematical state.

## Frozen parity contract

For every locale and seed, localization preserves:

- package `NUM-002` and checkpoint `NUM-CP-012`;
- permanent QL and authority ID;
- temporary source prototype;
- difficulty, answer semantic and representation;
- hidden mathematical state and mathematical fingerprint;
- option order, correctness flags and misconception IDs;
- correct index;
- canonical/verifier mathematical binding;
- source/prototype ancestry.

Only learner-facing wording and textual answer labels are localized.

## Textual answer localization

The following non-numeric answer labels are localized consistently across options, canonical answer, verifier answer and explanation final answer:

- `NO_INTEGER_ROOT`;
- `NO_SOLUTION`;
- `ONE_SOLUTION`;
- `MULTIPLE_SOLUTIONS`;
- `ALL_VALUES` when present as a distractor.

Numeric answers and mathematical notation remain invariant.

## Editorial rules

- explanations state what condition matters, how it is applied and the final result;
- no implementation vocabulary is exposed;
- Hindi uses Devanagari and Punjabi uses Gurmukhi without cross-script leakage;
- variables such as `x`, `k` and mathematical symbols remain unchanged where appropriate;
- terminal compatibility is described only as rejection evidence, never sufficient proof;
- signed-root wording preserves the principal non-negative convention for non-negative even roots and the negative root for exact odd powers.

## Lifecycle

Localized content is frozen for internal review, but downstream publication remains closed:

- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

The next gate is explicit shared Question Studio review integration. That gate may expose review generation only; it must not enable Question Bank writes, tests/mocks or public publication.
