# SER-001 clean salvage scope

Source: PR #358 head `e39678bf0069161a22ad83c957fefab87008d82d`
Base: current `New-main` commit `6bf60548f36e6ba96c2ba215917c9b0ac263bf29`

## Preserved in this branch

- frozen 140-template Series authority and permanent QL registry;
- final English runtime dependency chain;
- final Hindi and Punjabi localization runtime;
- Question Studio readiness and review-only runtime;
- Reasoning V1 generation engine;
- Series-specific Question Studio route implementation.

## Deliberately excluded

- shared Question Bank conversion changes from PR #358;
- stale shared route-index copies;
- global test-blueprint and release-pool assembly changes;
- global learner-facing rendering heuristics;
- unrelated historical Series chapter directories and audit waves;
- any implication that Series is Question Bank writable, test eligible or publicly publishable.

## Safety state

Series remains review-only:

- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `publiclyPublishable: false`

The route is intentionally not mounted by this salvage commit. Mounting and review-only approval support require a separate compatibility commit with real API regression tests against current `New-main`.
