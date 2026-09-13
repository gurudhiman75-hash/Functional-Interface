# STAT-003 — Elementary Frequency Distribution & Central Tendency

Status: `PERMANENT_ENGLISH_REVIEW_READY`

## Why this package exists

`STAT-001` owns raw-observation mean/median/mode. `STAT-003` owns elementary frequency-distribution forms that occur in the common SSC Mathematical Abilities lane and must not be misclassified as Data Interpretation.

Real-paper anchors used for this design include:
- grouped-frequency mean using class marks (`SSC CGL 2022 Tier-I`, held 09 Dec 2022 Shift 1);
- empirical mean/median/mode relation (`SSC CGL 2022 Tier-II`, held 06 Mar 2023);
- grouped-frequency median (`SSC CGL 2024 Tier-II Paper-I`, held 20 Jan 2025).

## Permanent semantic ownership

1. `STAT-QL-013` — direct weighted mean from a discrete x/f table;
2. `STAT-QL-014` — grouped mean using class marks;
3. `STAT-QL-015` — cumulative-frequency median from a discrete x/f table;
4. `STAT-QL-016` — grouped median by median-class interpolation;
5. `STAT-QL-017` — grouped mode by modal-class interpolation;
6. `STAT-QL-018` — recover mode from mean and median using the empirical relation;
7. `STAT-QL-019` — use `Mean − Mode = 3(Mean − Median)` to recover a difference;
8. `STAT-QL-020` — recover one unknown x-value from a stated frequency mean.

The historical `STAT-003-TEMP-*` identifiers remain internal deterministic runtime contracts. New ownership and Question Studio controlled review use the permanent `STAT-QL-*` namespace.

## Difficulty contract

- **Easy:** direct discrete frequency mean/median and direct empirical-mode relation.
- **Medium:** grouped mean, grouped median, grouped mode, and empirical difference relation.
- **Hard:** recover an unknown table value from the stated frequency mean; difficulty comes from weighted-equation reconstruction, not larger numbers.

## Editorial/runtime rules

- natural SSC-style prompts;
- table shown whenever the learner needs a frequency distribution;
- explanations use the actual table values and calculations;
- cumulative-frequency reasoning shown explicitly for medians;
- grouped mean uses class marks explicitly;
- grouped mode names `l, h, f0, f1, f2` before substitution;
- no generic shortcut/trap filler;
- misconception-owned distractors and exactly four unique SSC options;
- deterministic generation with an independent mathematical verifier.

## Proof authority

- 100 seeds × 2 profiles × 8 contracts = 1,600 generated questions;
- 1,600 deterministic replay checks;
- 1,600 independent-verifier checks;
- 6,400 option checks;
- four unique options and exactly one correct answer throughout;
- structural Easy/Medium/Hard contract preserved;
- human English review approved 2026-09-13.

## Boundary

This package does **not** own histogram/frequency-polygon rendering (DI remediation), quartiles/deciles/percentiles, coefficient of variation, mean/quartile deviation, skewness/kurtosis theory, advanced JSO distribution theory, probability, or general chart/table DI.

## Lifecycle

- English human review: **approved 2026-09-13**;
- permanent QLs: `STAT-QL-013..020`;
- canonical problem: `STAT-CP-003`;
- Question Studio: `CONTROLLED_REVIEW` / English only;
- Question Bank: `NOT_STORED`, writable false;
- test eligibility: `INELIGIBLE`;
- mock-test eligibility: false;
- public publication: false;
- automatic student publication: false;
- production release authorized: false;
- localization: not started.

Human approval authorizes permanent QL allocation and controlled Question Studio review only. It does **not** authorize Question Bank storage, tests/mocks, public publication, localization, or production release.
