# STAT-002 — Standard Deviation

Status: `PERMANENT_ENGLISH_REVIEW_READY`

## Scope

`STAT-002` owns the common SSC standard-deviation foundation that is distinct from `STAT-001 — Measures of Central Tendency`.

Target profiles:
- `SSC_CGL_TIER_II`
- `SSC_CGL_JSO` common/foundation layer

The package uses **population standard deviation over the displayed finite observations** (division by `N`) so no sample/population convention is left implicit.

## Permanent semantic ownership

1. `STAT-QL-007` — direct population standard deviation of raw observations;
2. `STAT-QL-008` — standard deviation from mean and mean of squares;
3. `STAT-QL-009` — translation invariance when the same constant is added to every observation;
4. `STAT-QL-010` — standard-deviation scaling when every observation is multiplied by a positive constant;
5. `STAT-QL-011` — infer the common positive scale factor from original and transformed standard deviations;
6. `STAT-QL-012` — recover source SD from mean/mean-of-squares, then apply an affine transformation `y = ax + b`.

The historical `STAT-002-TEMP-*` IDs remain internal compatibility identifiers for the proven Phase-0 mathematical runtime. New content ownership and Question Studio controlled review use the permanent `STAT-QL-*` namespace.

## Difficulty contract

- **Easy:** direct raw-data SD with bounded exact values; translation invariance.
- **Medium:** moment formula; direct scaling; reverse scaling.
- **Hard:** compound two-stage reasoning only — first recover SD from moments, then apply affine-transformation behavior.

Difficulty is structural, not a vocabulary label or a larger-number switch.

## Editorial/runtime rules

- concise exam-style English stems;
- exact integer standard-deviation states by construction;
- four SSC options with misconception-owned distractors;
- deterministic generation only;
- materially separate independent verifier;
- learner explanations are bound to the actual generated values and show the required working rather than generic boilerplate;
- raw-data SD explanations show mean, deviations, squared deviations, variance and square root;
- transformation explanations use the displayed state and never leak hidden generated observations;
- no generic shortcut/trap filler;
- deterministic review exporter shows three distinct stem structures and three distinct mathematical states per contract/profile.

## Proof authority

- 100 seeds × 2 profiles × 6 contracts = 1,200 questions;
- 1,200 deterministic replay checks;
- 1,200 independent verification checks;
- 4,800 option checks;
- four unique options and one correct answer throughout;
- A/B/C/D answer-position coverage for every contract/profile;
- all three stem surfaces for every contract/profile;
- at least three misconception families for every contract/profile;
- explicit structural Easy/Medium/Hard mapping;
- Question Studio package discovery, permanent-QL generation and lifecycle regression;
- API-server build and patch hygiene.

## Explicit exclusions

This package does not own:
- grouped/frequency-distribution standard deviation;
- coefficient of variation or other relative-dispersion measures;
- quartile deviation or mean deviation;
- moments beyond the bounded mean/mean-of-squares identity used to recover SD;
- skewness or kurtosis;
- advanced JSO Paper-II frequency-distribution theory;
- probability;
- chart/table Data Interpretation families already owned elsewhere.

## Lifecycle

- English human review: **approved 2026-09-13**;
- permanent QLs: `STAT-QL-007..012`;
- Question Studio: `CONTROLLED_REVIEW` / English only;
- Question Bank: `NOT_STORED`, writable false;
- test eligibility: `INELIGIBLE`;
- mock-test eligibility: false;
- public publication: false;
- automatic student publication: false;
- production release authorized: false;
- localization: not started.

Human approval of the English review pack authorizes permanent QL allocation and controlled Question Studio review only. It does **not** authorize Question Bank storage, tests/mocks, public publication, or production release.
