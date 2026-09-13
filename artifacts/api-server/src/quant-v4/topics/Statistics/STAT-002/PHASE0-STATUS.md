# STAT-002 — Standard Deviation Phase 0

Status: `IMPLEMENTED_AUTOMATED_REVIEW_PENDING`

## Scope

`STAT-002` owns the common SSC standard-deviation foundation that is distinct from `STAT-001 — Measures of Central Tendency`.

Target profiles in this checkpoint:
- `SSC_CGL_TIER_II`
- `SSC_CGL_JSO` common/foundation layer

The package uses **population standard deviation over the displayed finite observations** (division by `N`) so no sample/population convention is left implicit.

## Temporary semantic contracts

1. `STAT-002-TEMP-001-RAW-SD` — direct population standard deviation of raw observations;
2. `STAT-002-TEMP-002-MEAN-SQUARES-SD` — standard deviation from mean and mean of squares;
3. `STAT-002-TEMP-003-TRANSLATION-INVARIANCE` — adding the same constant to every observation leaves standard deviation unchanged;
4. `STAT-002-TEMP-004-SCALE-TRANSFORMATION` — multiplying every observation by a positive constant multiplies standard deviation by the same constant;
5. `STAT-002-TEMP-005-REVERSE-SCALE` — infer the common positive scale factor from original and transformed standard deviations.

## Explicit exclusions

This Phase 0 does not own:
- grouped/frequency-distribution standard deviation;
- coefficient of variation or other relative-dispersion measures;
- quartile deviation or mean deviation;
- moments, skewness or kurtosis;
- advanced JSO Paper-II frequency-distribution theory;
- probability;
- chart/table Data Interpretation families already owned elsewhere.

Those are separate future ownership decisions rather than hidden variants inside `STAT-002`.

## Editorial/runtime rules

- English review only;
- concise exam-style stems with three structural surfaces per contract;
- exact integer standard-deviation states by construction;
- four SSC options with misconception-owned distractors;
- deterministic generation only;
- materially separate independent verifier;
- simple worked explanations with no generic shortcut/trap filler;
- no permanent QLs allocated before human review.

## Automated proof gate

Required Phase-0 proof:
- 100 seeds × 2 profiles × 5 contracts = 1,000 questions;
- 1,000 deterministic replay checks;
- 1,000 independent verification checks;
- 4,000 option checks;
- four unique options and one correct answer throughout;
- A/B/C/D answer-position coverage for every contract/profile;
- all three stem surfaces for every contract/profile;
- at least three misconception families for every contract/profile;
- Easy/Medium/Hard coverage;
- no `Math.random` source;
- API-server build and patch hygiene.

## Lifecycle

- permanent QLs: not allocated;
- Question Studio discovery: OFF;
- Question Bank: `NOT_STORED`;
- Question Bank writable: false;
- test eligibility: `INELIGIBLE`;
- mock-test eligibility: false;
- public publication: false;
- automatic student publication: false;
- localization: not started;
- human English review: pending.

Do not register this package in Question Studio or allocate permanent QLs until a generated English review pack is explicitly approved.
