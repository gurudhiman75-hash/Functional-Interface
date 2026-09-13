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
5. `STAT-002-TEMP-005-REVERSE-SCALE` — infer the common positive scale factor from original and transformed standard deviations;
6. `STAT-002-TEMP-006-AFFINE-FROM-MOMENTS` — recover source SD from mean/mean-of-squares, then apply an affine transformation `y = ax + b`.

## Difficulty contract

- **Easy:** direct raw-data SD with bounded exact values; translation invariance.
- **Medium:** moment formula; direct scaling; reverse scaling.
- **Hard:** compound two-stage reasoning only — first recover SD from moments, then apply affine-transformation behavior.

Difficulty is structural, not a vocabulary label or a larger-number switch.

## Explicit exclusions

This Phase 0 does not own:
- grouped/frequency-distribution standard deviation;
- coefficient of variation or other relative-dispersion measures;
- quartile deviation or mean deviation;
- moments beyond the bounded mean/mean-of-squares identity used to recover SD;
- skewness or kurtosis;
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
- no hidden generated observations may appear only in the explanation;
- deterministic review exporter must show three distinct stem structures and three distinct mathematical states per contract/profile;
- no permanent QLs allocated before human review.

## Automated proof gate

Required Phase-0 proof:
- 100 seeds × 2 profiles × 6 contracts = 1,200 questions;
- 1,200 deterministic replay checks;
- 1,200 independent verification checks;
- 4,800 option checks;
- four unique options and one correct answer throughout;
- A/B/C/D answer-position coverage for every contract/profile;
- all three stem surfaces for every contract/profile;
- at least three misconception families for every contract/profile;
- explicit structural difficulty mapping, with the Hard band reserved for the compound affine-from-moments family;
- no `Math.random` source;
- API-server build and patch hygiene.

## Human review artifact

The CI review pack contains 36 English questions: three structurally distinct and mathematically distinct samples for each of six contracts in each of two profiles.

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
