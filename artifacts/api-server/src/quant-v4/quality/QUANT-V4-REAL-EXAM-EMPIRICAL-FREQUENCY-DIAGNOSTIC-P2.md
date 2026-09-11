# Quant V4 Real-Exam Empirical Frequency Diagnostic P2

**Authority:** `QUANT-V4-REAL-EXAM-EMPIRICAL-FREQUENCY-DIAGNOSTIC-P2`

## Purpose

The real-exam simulator still uses provisional slot plans. The whole-section frequency gate now gives us a clean empirical comparison surface based only on complete dated Quant sections. This checkpoint joins those two systems **for audit/reporting only**.

It does not change generation weights.

## Current comparison

For `SSC_CGL_TIER_I` the diagnostic compares:

- simulator: minimum audit of **20 generated sections / 500 records**;
- empirical source: **3 complete dated sections / 75 questions / 20 package IDs**;
- shared CGL registry: **100 countable observations**, of which **25** are isolated/non-whole-section observations and therefore excluded from frequency weights.

The three complete sections are:

1. 09 Sep 2024 Shift 1 — Q51–Q75;
2. 27 Jul 2023 Shift 2 — Q26–Q50;
3. 01 Dec 2022 Shift 1 — Q51–Q75.

## Diagnostic output

For every package in the union of simulated and empirical distributions, the diagnostic reports:

- empirical question count and share;
- empirical mean questions per complete section;
- empirical section-presence share;
- simulated record count and share;
- simulated mean records per generated section;
- signed and absolute share divergence.

It also reports total-variation distance across the package distributions.

`CAPABILITY_GAP` remains visible as a simulator-only pseudo-package. This is deliberate: missing Algebra/Trigonometry section adapters must contribute to measured divergence rather than disappear from the denominator.

## Safety locks

The diagnostic exposes all of the following simultaneously:

- whole-section evidence status;
- whole-section blockers;
- simulator readiness/blockers;
- `empiricalWeightsApplied=false`;
- `applicationStatus=DIAGNOSTIC_ONLY_NOT_APPLIED`;
- `productionPromotionAuthorized=false`;
- `canPromoteWholeSectionWeights=false` under the current P2 policy.

The current whole-section evidence policy still requires **8 complete sections**. We only have 3, so empirical package shares are evidence-accumulating diagnostics, not production weights.

## Interpretation rule

A large divergence is a **QA signal**, not an automatic instruction to copy the observed percentages into the simulator. First determine whether the cause is:

1. a simulator capability gap;
2. a provisional slot-plan mismatch;
3. package ownership/taxonomy differences;
4. genuine paper-to-paper variance from the still-small complete-section sample.

Only after the complete-section evidence policy is satisfied and production promotion is separately authorized may empirical weights replace provisional composition.
