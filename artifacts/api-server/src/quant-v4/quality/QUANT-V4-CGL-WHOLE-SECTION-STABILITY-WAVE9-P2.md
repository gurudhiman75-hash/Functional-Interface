# Quant V4 — SSC CGL Tier-I whole-section stability evaluation — Wave 9 P2

Authority: `QUANT-V4-CGL-WHOLE-SECTION-STABILITY-WAVE9-P2`

## Decision

Wave 9 adds **SSC CGL Tier-I, 1 Dec 2022 Shift 2** as the first post-threshold stability-expansion section.

The evidence profile remains an audit-level `SECTION_FREQUENCY_CANDIDATE`, but production promotion remains deliberately unauthorized.

## Evidence state

| Metric | Wave 8 | Wave 9 |
| --- | ---: | ---: |
| Complete sections | 8 | 9 |
| Whole-section questions | 200 | 225 |
| Whole-section packages | 26 | 27 |
| 2022 questions | 25 | 50 |
| 2023 questions | 150 | 150 |
| 2024 questions | 25 | 25 |
| Production promotion | false | false |

Year composition therefore changes from:

- Wave 8: 2022 **12.5%**, 2023 **75.0%**, 2024 **12.5%**;
- Wave 9: 2022 **22.22%**, 2023 **66.67%**, 2024 **11.11%**.

This is a meaningful improvement in year balance, although the corpus remains 2023-heavy.

## Package-profile movement

| Package | Wave 8 | Wave 9 | Share W8 | Share W9 | Change |
| --- | ---: | ---: | ---: | ---: | ---: |
| `TRG-001` | 22 | 25 | 11.00% | 11.11% | +0.11 pp |
| `TMW-001` | 22 | 23 | 11.00% | 10.22% | -0.78 pp |
| `ALG-001` | 21 | 22 | 10.50% | 9.78% | -0.72 pp |
| `PNL-001` | 14 | 16 | 7.00% | 7.11% | +0.11 pp |
| `TSD-001` | 14 | 15 | 7.00% | 6.67% | -0.33 pp |
| `DI-001` | 12 | 15 | 6.00% | 6.67% | +0.67 pp |
| `GEO-002` | 13 | 14 | 6.50% | 6.22% | -0.28 pp |
| `MEN-002` | 11 | 12 | 5.50% | 5.33% | -0.17 pp |
| `NUM-001` | 10 | 12 | 5.00% | 5.33% | +0.33 pp |
| `GEO-001` | 8 | 11 | 4.00% | 4.89% | +0.89 pp |
| `INT-001` | 8 | 9 | 4.00% | 4.00% | 0.00 pp |

The largest absolute movements among established packages are:

1. `GEO-001`: **+0.89 percentage points**;
2. `TMW-001`: **-0.78 pp**;
3. `ALG-001`: **-0.72 pp**;
4. `DI-001`: **+0.67 pp**.

These changes are not alarming, but they demonstrate why the eight-section profile should not have been promoted directly into production weights.

## Concentration movement

Wave 8 top three packages (`TMW-001`, `TRG-001`, `ALG-001`) contributed **65/200 = 32.5%**.

Wave 9 top three (`TRG-001`, `TMW-001`, `ALG-001`) contribute **70/225 = 31.11%**.

The top-three concentration therefore falls by about **1.39 percentage points** after a single additional complete section.

Using the leading nine-package cluster, concentration moves from **69.5%** at Wave 8 to **154/225 = 68.44%** at Wave 9, a reduction of about **1.06 pp**.

This is further evidence that broad structure is emerging while exact percentages are still sample-sensitive.

## New support signal

Q61 of the new section is a direct exponent-law question and maps to `SRI-001` — Indices, Exponents & Power Structure.

`SRI-001` therefore enters the complete-section empirical support for the first time. Together with the Wave 8 `SRI-002` observation, both Surds & Indices packages now have at least one whole-section observation.

This matters because a zero count in the earlier sample should not have been interpreted as proof that a live chapter was absent from SSC CGL; it was partly a sample-size effect.

## Audit interpretation

Wave 9 strengthens three conclusions:

1. **Whole-section evidence is superior to isolated PYQ counting for frequency calibration.** The new paper materially changes several shares without any change to content-engine capability.
2. **The broad high-frequency cluster appears plausible**, particularly Trigonometry, Time & Work, Algebra, Profit & Loss, Time-Speed-Distance, Geometry and DI.
3. **Exact package weights are not yet stable enough for production use.** A single balanced-year addition still moves important packages by roughly 0.7–0.9 percentage points and shifts concentration by more than one percentage point.

## Test-architecture correction introduced in Wave 9

The Wave 9 paper regression is intentionally **wave-local**. It verifies:

- 25/25 questions;
- exact Q51-Q75 continuity;
- date/shift/paper identity;
- representative source mathematics;
- inclusion of the paper as a complete section;
- continued production lock.

It does **not** hard-code moving global registry totals or chapter-wide cumulative counts. Moving aggregate totals remain the responsibility of the central whole-section calibration regression.

Legacy pre-Wave-9 tests still contain old aggregate assertions and require a separate cleanup pass; this design should not be repeated in new wave tests.

## Current verdict

**PASS — Wave 9 is valid stability-expansion evidence.**

**PASS — year balance improved materially.**

**PASS — both `SRI-001` and `SRI-002` now appear in whole-section evidence.**

**HOLD — profile percentages remain too sample-sensitive for direct production weighting.**

**HOLD — `productionPromotionAuthorized` remains `false`.**

Recommended next evidence addition: another complete **2024** section if a well-resolved source is available; otherwise another non-adjacent **2022** section. Continue measuring package-share and rank movement rather than merely accumulating question count.
