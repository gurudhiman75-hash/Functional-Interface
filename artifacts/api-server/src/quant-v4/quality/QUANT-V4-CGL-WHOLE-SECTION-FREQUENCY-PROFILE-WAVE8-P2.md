# Quant V4 — SSC CGL Tier-I whole-section frequency profile — Wave 8 P2

Authority: `QUANT-V4-CGL-WHOLE-SECTION-FREQUENCY-PROFILE-WAVE8-P2`

## Decision

Wave 8 reaches the conservative P2 minimum evidence floor for evaluating SSC CGL Tier-I Quant at the **whole-section** level.

It does **not** authorize production promotion.

Current state:

- `evidenceStatus = SECTION_FREQUENCY_CANDIDATE`
- `blockers = []`
- `productionPromotionAuthorized = false`
- `canPromoteWholeSectionFrequencyWeights(...) = false`

Crossing the evidence floor means the profile is mature enough to study as an empirical whole-paper signal. It does not mean simulator weights, checkpoint allocation, difficulty allocation, representation allocation, or production generation frequencies may be replaced automatically.

## Evidence base at Wave 8

| Metric | Wave 8 state |
| --- | ---: |
| Complete SSC CGL Tier-I Quant sections | 8 |
| Whole-section Quant questions | 200 |
| Distinct section years | 3 |
| Whole-section package coverage | 27 |
| All registered PYQ observations | 258 |
| SSC CGL countable observations | 225 |
| Non-whole-section SSC CGL observations | 25 |
| Undated SSC CGL countable observations | 10 |

Only the 200 questions belonging to the eight declared complete sections are used for whole-section frequency weights. The 25 isolated/non-whole-section CGL observations remain excluded from those weights.

## Complete sections

1. SSC CGL Tier-I — 09 Sep 2024 Shift 1 — 25 Quant questions
2. SSC CGL Tier-I — 27 Jul 2023 Shift 2 — 25 Quant questions
3. SSC CGL Tier-I — 26 Jul 2023 Shift 1 — 25 Quant questions
4. SSC CGL Tier-I — 26 Jul 2023 Shift 2 — 25 Quant questions
5. SSC CGL Tier-I — 25 Jul 2023 Shift 1 — 25 Quant questions
6. SSC CGL Tier-I — 25 Jul 2023 Shift 3 — 25 Quant questions
7. SSC CGL Tier-I — 25 Jul 2023 Shift 4 — 25 Quant questions
8. SSC CGL Tier-I — 01 Dec 2022 Shift 1 — 25 Quant questions

## Corrected package-frequency profile

| Rank | Package | Questions | Share | Mean / section |
| ---: | --- | ---: | ---: | ---: |
| 1 | `ALG-001` | 23 | 11.5% | 2.875 |
| 2 | `TMW-001` | 22 | 11.0% | 2.750 |
| 2 | `TRG-001` | 22 | 11.0% | 2.750 |
| 4 | `PNL-001` | 14 | 7.0% | 1.750 |
| 5 | `GEO-002` | 13 | 6.5% | 1.625 |
| 6 | `DI-001` | 12 | 6.0% | 1.500 |
| 6 | `TSD-001` | 12 | 6.0% | 1.500 |
| 8 | `MEN-002` | 11 | 5.5% | 1.375 |
| 9 | `NUM-001` | 9 | 4.5% | 1.125 |
| 10 | `GEO-001` | 8 | 4.0% | 1.000 |
| 10 | `INT-001` | 8 | 4.0% | 1.000 |
| 12 | `DI-003` | 5 | 2.5% | 0.625 |
| 12 | `MEN-001` | 5 | 2.5% | 0.625 |
| 12 | `SAP` | 5 | 2.5% | 0.625 |
| 15 | `AVG-001` | 4 | 2.0% | 0.500 |
| 15 | `PCT-002` | 4 | 2.0% | 0.500 |
| 15 | `RAP-001` | 4 | 2.0% | 0.500 |
| 18 | `ALG-002` | 3 | 1.5% | 0.375 |
| 18 | `MAL-001` | 3 | 1.5% | 0.375 |
| 18 | `PCT-005` | 3 | 1.5% | 0.375 |
| 18 | `TSD-002` | 3 | 1.5% | 0.375 |
| 22 | `DI-005` | 2 | 1.0% | 0.250 |
| 23 | `DI-004` | 1 | 0.5% | 0.125 |
| 23 | `PCT-001` | 1 | 0.5% | 0.125 |
| 23 | `PCT-007` | 1 | 0.5% | 0.125 |
| 23 | `RAP-003` | 1 | 0.5% | 0.125 |
| 23 | `SRI-002` | 1 | 0.5% | 0.125 |

Total: **200 questions / 100%**.

`SRI-002` enters the whole-section support for the first time through the surds/rationalisation question in 25 Jul 2023 Shift 4, raising package coverage from 26 to 27.

## Wave-8 ownership corrections

The earlier stale Wave-8 draft contained adjacent-topic ownership errors. These were corrected before the section was admitted to the frequency ledger:

- Q60 → `PCT-005`, because it is a chained/successive percentage comparison rather than percentage fundamentals.
- Q61 → `ALG-001`, because it is factorisation and cancellation of an algebraic expression; no rational equation is solved.
- Q65 → `GEO-002`, circle common-tangent geometry.
- Q73 → `GEO-001`, right-triangle/incircle geometry.
- Q75 → `SRI-002`, surds and rationalisation.

Q75's algebra was also corrected: rationalising `(√2-√3)/(√2+√3)` gives **`2√6 - 5`**, not its sign-reversed form.

These corrections are important because package-frequency calibration amplifies taxonomy mistakes. A source question can be mathematically normalized correctly and still corrupt the simulator if it is counted against the wrong package.

## What the profile says so far

The observed section mix is clearly non-uniform. `ALG-001`, `TMW-001`, and `TRG-001` account for **67 of 200 questions = 33.5%**. The top five packages account for **94 of 200 = 47.0%**. The top ten packages account for **146 of 200 = 73.0%**.

That is strong enough to reject a naive equal-frequency assumption. It is not strong enough to treat the exact percentages as final production weights.

## Why production promotion remains locked

### 1. Eight sections are a minimum evaluation floor, not a robustness floor

A single question moves a package share by 0.5 percentage points in a 200-question corpus. Low-frequency packages remain especially unstable.

### 2. Year concentration remains high

Six of the eight complete sections are from 2023:

- 2023: 150 / 200 = **75%**
- 2022: 25 / 200 = **12.5%**
- 2024: 25 / 200 = **12.5%**

So the current profile is still much closer to a 2023-heavy snapshot than a balanced multi-year calibration set.

### 3. Shift-window concentration remains high

Five sections come from 25–27 July 2023, with three from 25 July alone. Consecutive shifts may share paper-setting tendencies and should not be treated as maximally independent samples.

### 4. Provider concentration remains high

Recent waves rely on resolved, dated, shift-specific solved-paper collections rather than SSC-hosted official papers. That is acceptable for the current `VERIFIED_PYQ_COLLECTION` evidence class, but a production profile should be challenged against independent and, where possible, official evidence.

### 5. The older generic PYQ gate remains separate

The generic CGL PYQ profile still includes undated isolated observations and remains blocked by `DATED_PAPER_IDENTITY_INCOMPLETE`. Reaching the whole-section floor does not silently repair or supersede that separate evidence path.

## Next audit phase — stability expansion

Do **not** open the production authorization gate yet.

The next phase should test whether this corrected Wave-8 profile survives additional independent complete sections. Prefer more 2024 and 2022 papers before adding yet more July-2023 shifts.

For each additional complete section, measure:

- package rank movement;
- absolute share movement in percentage points;
- mean questions per section;
- section-presence rate;
- year-conditioned package frequencies;
- top-3 / top-5 / top-10 concentration;
- packages entering or disappearing from observed support;
- sensitivity to removing one high-concentration date/window.

## Current audit verdict

**PASS — conservative whole-section evidence floor reached.**

**PASS — profile is eligible for audit-level frequency evaluation.**

**HOLD — exact observed percentages are not yet stable production weights.**

**HOLD — production promotion remains unauthorized.**

Next checkpoint: expand the corpus for stability and year-balance analysis while preserving the production lock.
