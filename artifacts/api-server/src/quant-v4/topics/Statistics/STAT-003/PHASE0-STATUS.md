# STAT-003 — Elementary Frequency Distribution & Central Tendency

Status: `PHASE0_HUMAN_REVIEW_REQUIRED`

## Why this package exists

`STAT-001` owns raw-observation mean/median/mode. `STAT-003` owns elementary frequency-distribution forms that occur in the common SSC Mathematical Abilities lane and must not be misclassified as Data Interpretation.

Real-paper anchors used for this Phase-0 design include:
- grouped-frequency mean using class marks (`SSC CGL 2022 Tier-I`, held 09 Dec 2022 Shift 1);
- empirical mean/median/mode relation (`SSC CGL 2022 Tier-II`, held 06 Mar 2023);
- grouped-frequency median (`SSC CGL 2024 Tier-II Paper-I`, held 20 Jan 2025).

## Temporary review contracts

1. `STAT-003-TEMP-001-DISCRETE-FREQUENCY-MEAN` — direct weighted mean from x/f table;
2. `STAT-003-TEMP-002-GROUPED-FREQUENCY-MEAN` — grouped mean using class marks;
3. `STAT-003-TEMP-003-DISCRETE-FREQUENCY-MEDIAN` — cumulative-frequency median from x/f table;
4. `STAT-003-TEMP-004-GROUPED-FREQUENCY-MEDIAN` — locate median class and interpolate;
5. `STAT-003-TEMP-005-GROUPED-FREQUENCY-MODE` — modal-class interpolation using adjacent frequencies;
6. `STAT-003-TEMP-006-EMPIRICAL-MODE` — recover mode from mean and median;
7. `STAT-003-TEMP-007-EMPIRICAL-DIFFERENCE` — use `Mean − Mode = 3(Mean − Median)`;
8. `STAT-003-TEMP-008-MISSING-VALUE-FROM-MEAN` — recover one unknown x-value from a frequency mean equation.

## Difficulty contract

- **Easy:** direct discrete frequency mean/median and direct empirical-mode relation.
- **Medium:** grouped mean, grouped median, grouped mode, and empirical difference relation.
- **Hard:** recover an unknown table value from the stated frequency mean; difficulty comes from the extra weighted-equation reconstruction, not larger numbers.

## Editorial rules

- natural SSC-style prompts;
- table shown whenever the learner needs a frequency distribution;
- explanations use the actual table values and calculations;
- cumulative-frequency reasoning shown explicitly for medians;
- grouped mean uses class marks explicitly;
- grouped mode names `l, h, f0, f1, f2` before substitution;
- no generic shortcut/trap filler;
- misconception-owned distractors and exactly four unique SSC options.

## Boundary

This package does **not** own histogram/frequency-polygon rendering (DI remediation), quartiles/deciles/percentiles, coefficient of variation, mean/quartile deviation, skewness/kurtosis theory, advanced JSO distribution theory, probability, or general chart/table DI.

## Lifecycle

- temporary contracts only; no permanent QL allocation yet;
- Question Studio discovery: false;
- Question Bank: `NOT_STORED`;
- tests/mocks: ineligible;
- public/automatic publication: false;
- English human review required before any promotion.
