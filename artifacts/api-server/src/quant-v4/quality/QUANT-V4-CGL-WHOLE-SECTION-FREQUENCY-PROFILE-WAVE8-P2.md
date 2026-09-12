# Quant V4 — SSC CGL Tier-I whole-section frequency profile — Wave 8 P2

Authority: `QUANT-V4-CGL-WHOLE-SECTION-FREQUENCY-PROFILE-WAVE8-P2`

## Decision

Wave 8 satisfies the conservative P2 minimum evidence floor for evaluating an SSC CGL Tier-I whole-section frequency profile.

It does **not** authorize production promotion.

The current state is deliberately:

- `evidenceStatus = SECTION_FREQUENCY_CANDIDATE`
- `blockers = []`
- `productionPromotionAuthorized = false`
- `canPromoteWholeSectionFrequencyWeights(...) = false`

Crossing the evidence floor means the profile may now be studied as an empirical whole-paper signal. It does not mean simulator weights, checkpoint allocation, difficulty allocation, representation allocation, or production generation frequencies may be replaced automatically.

## Evidence base at Wave 8

| Metric | Wave 8 state |
| --- | ---: |
| Complete SSC CGL Tier-I Quant sections | 8 |
| Whole-section Quant questions | 200 |
| Distinct section years | 3 |
| Whole-section package coverage | 26 |
| All registered PYQ observations | 258 |
| SSC CGL countable observations | 225 |
| Non-whole-section SSC CGL observations | 25 |
| Undated SSC CGL countable observations | 10 |

The whole-section profile uses only the 200 questions belonging to the eight declared complete sections. The 25 isolated/non-whole-section CGL observations remain excluded from whole-section frequency weights.

## Complete sections

1. SSC CGL Tier-I — 09 Sep 2024 Shift 1 — 25 Quant questions
2. SSC CGL Tier-I — 27 Jul 2023 Shift 2 — 25 Quant questions
3. SSC CGL Tier-I — 26 Jul 2023 Shift 1 — 25 Quant questions
4. SSC CGL Tier-I — 26 Jul 2023 Shift 2 — 25 Quant questions
5. SSC CGL Tier-I — 25 Jul 2023 Shift 1 — 25 Quant questions
6. SSC CGL Tier-I — 25 Jul 2023 Shift 3 — 25 Quant questions
7. SSC CGL Tier-I — 25 Jul 2023 Shift 4 — 25 Quant questions
8. SSC CGL Tier-I — 01 Dec 2022 Shift 1 — 25 Quant questions

## Resulting package-frequency profile

| Rank | Package | Questions | Share | Mean / section |
| ---: | --- | ---: | ---: | ---: |
| 1 | `TMW-001` | 22 | 11.0% | 2.750 |
| 1 | `TRG-001` | 22 | 11.0% | 2.750 |
| 3 | `ALG-001` | 21 | 10.5% | 2.625 |
| 4 | `PNL-001` | 14 | 7.0% | 1.750 |
| 4 | `TSD-001` | 14 | 7.0% | 1.750 |
| 6 | `GEO-002` | 13 | 6.5% | 1.625 |
| 7 | `DI-001` | 12 | 6.0% | 1.500 |
| 8 | `MEN-002` | 11 | 5.5% | 1.375 |
| 9 | `NUM-001` | 10 | 5.0% | 1.250 |
| 10 | `GEO-001` | 8 | 4.0% | 1.000 |
| 10 | `INT-001` | 8 | 4.0% | 1.000 |
| 12 | `ALG-002` | 5 | 2.5% | 0.625 |
| 12 | `DI-003` | 5 | 2.5% | 0.625 |
| 12 | `MEN-001` | 5 | 2.5% | 0.625 |
| 15 | `AVG-001` | 4 | 2.0% | 0.500 |
| 15 | `PCT-001` | 4 | 2.0% | 0.500 |
| 15 | `PCT-002` | 4 | 2.0% | 0.500 |
| 15 | `RAP-001` | 4 | 2.0% | 0.500 |
| 15 | `SAP` | 4 | 2.0% | 0.500 |
| 20 | `MAL-001` | 3 | 1.5% | 0.375 |
| 21 | `DI-005` | 2 | 1.0% | 0.250 |
| 22 | `DI-004` | 1 | 0.5% | 0.125 |
| 22 | `PCT-007` | 1 | 0.5% | 0.125 |
| 22 | `RAP-003` | 1 | 0.5% | 0.125 |
| 22 | `SRI-002` | 1 | 0.5% | 0.125 |
| 22 | `TSD-002` | 1 | 0.5% | 0.125 |

Total: **200 questions / 100%**.

`SRI-002` enters the complete-section profile for the first time in Wave 8 through the surds/rationalisation question in 25 Jul 2023 Shift 4, raising package coverage from 25 to 26.

## What the profile already says

The first useful conclusion is structural rather than prescriptive. In this sample, SSC CGL Quant is not behaving like a uniform chapter sampler. `TMW-001`, `TRG-001`, and `ALG-001` together account for 65 of 200 questions, or **32.5%** of the complete-section sample. The next cluster — `PNL-001`, `TSD-001`, `GEO-002`, `DI-001`, `MEN-002`, and `NUM-001` — contributes another 74 questions, or **37.0%**. These nine packages therefore account for **69.5%** of the observed questions.

That is meaningful evidence for later calibration work, but it is not yet a safe production allocation by itself.

## Why production promotion remains locked

### 1. The minimum floor is not a robustness floor

Eight sections were deliberately chosen as the minimum point at which a whole-paper frequency profile becomes worth evaluating. The threshold was never intended to prove that the exact observed percentages are stable.

A one-question change in this 200-question sample moves a package share by 0.5 percentage points. Low-frequency packages are especially unstable at this sample size.

### 2. Strong year concentration

Six of the eight complete sections are from 2023. Therefore:

- 2023 contributes 150 / 200 questions = **75%** of the whole-section sample;
- 2022 contributes 25 / 200 = **12.5%**;
- 2024 contributes 25 / 200 = **12.5%**.

The profile presently resembles a 2023-heavy SSC CGL snapshot more than a balanced multi-year calibration corpus.

### 3. Strong intra-window concentration

Five of the eight sections come from 25–27 July 2023, and three come from 25 July alone. Consecutive shifts can share paper-setting tendencies and therefore should not be treated as eight maximally independent samples.

### 4. Source-provider concentration

Recent waves use resolved, dated, shift-specific solved-paper collections rather than official SSC-hosted question papers. They are valid for the current `VERIFIED_PYQ_COLLECTION` evidence class, but an empirical production profile should ideally be challenged against independent and, where available, official evidence before authorization.

### 5. Existing generic PYQ gate remains separate

The older generic CGL PYQ frequency profile still contains undated isolated observations and remains blocked by `DATED_PAPER_IDENTITY_INCOMPLETE`. Wave 8 clears the **whole-section** evidence policy; it does not silently repair or supersede that separate evidence path.

## Recommended next audit phase — stability expansion

Do **not** open the production authorization gate yet.

The next phase should test whether the Wave 8 profile survives additional independent complete sections. Prefer, in order:

1. more complete 2024 SSC CGL Tier-I Quant sections;
2. more complete 2022 sections;
3. complete sections from another suitable SSC CGL cycle/year where the exam structure remains comparable;
4. independent or official-source verification where available.

For every added section, measure at minimum:

- package rank movement;
- absolute share movement in percentage points;
- mean questions per section;
- section-presence rate;
- year-conditioned package frequencies;
- concentration of the top 3 / top 5 / top 10 packages;
- packages appearing or disappearing from the observed support.

A later authorization checkpoint should explicitly decide whether empirical whole-section frequencies may influence production and, if so, how strongly. That decision must be a separate commit/authority change setting `productionPromotionAuthorized` deliberately; it must never follow implicitly from accumulating more evidence.

## Current audit verdict

**PASS — minimum whole-section evidence floor reached.**

**PASS — profile is now eligible for audit-level frequency evaluation.**

**HOLD — exact percentages are not yet treated as stable production weights.**

**HOLD — production promotion remains unauthorized.**

Next checkpoint: expand the corpus for frequency stability / year-balance analysis while preserving the production lock.
