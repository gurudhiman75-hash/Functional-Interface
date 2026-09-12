# Quant V4 — SSC CGL 2024-09-09 Shift 2 Full Quant Section — Wave 10 P2

**Authority:** `QUANT-V4-CGL-2024-09-09-S2-FULL-QUANT-SECTION-WAVE10-P2`

## Purpose

Wave 10 adds a second complete 2024 SSC CGL Tier-I Quantitative Aptitude section to the whole-section frequency corpus. This is a stability-expansion wave, not a production-promotion wave.

The source is a full candidate response paper mirrored by SSC Portal. The paper itself resolves the exam identity as SSC CGL Tier-I, held 09/09/2024 from 12:30 PM to 1:30 PM. Because the file is not hosted on an official SSC domain, observations remain classified as `VERIFIED_PYQ_COLLECTION`, not `OFFICIAL_PAPER`.

## Normalized section

- Paper ID: `SSC-CGL-2024-TIER-I-2024-09-09-S2`
- Date: `2024-09-09`
- Shift: `Shift 2`
- Quant section: Q1-Q25
- Questions normalized: 25/25
- Unmapped packages: 0
- Whole-section eligible: yes
- Production promotion authorized: no

### Package contribution in this section

| Package | Questions |
| --- | ---: |
| ALG-001 | 3 |
| AVG-001 | 1 |
| DI-001 | 1 |
| DI-003 | 1 |
| DI-005 | 2 |
| GEO-001 | 3 |
| GEO-002 | 1 |
| INT-001 | 1 |
| MEN-001 | 1 |
| MEN-002 | 1 |
| NUM-001 | 2 |
| PCT-001 | 1 |
| PNL-001 | 2 |
| RAP-001 | 1 |
| TMW-001 | 1 |
| TRG-001 | 2 |
| TSD-001 | 1 |

## Whole-section corpus after Wave 10

| Metric | Wave 9 | Wave 10 |
| --- | ---: | ---: |
| Registered observations | 283 | 308 |
| CGL countable observations | 250 | 275 |
| Complete sections | 9 | 10 |
| Complete-section questions | 225 | 250 |
| Non-whole-section CGL observations | 25 | 25 |
| Distinct section years | 3 | 3 |
| Whole-section package coverage | 27 | 27 |
| Evidence status | `SECTION_FREQUENCY_CANDIDATE` | `SECTION_FREQUENCY_CANDIDATE` |
| Evidence blockers | none | none |
| Production promotion authorized | false | false |

## Year balance

Wave 10 materially improves year balance:

- 2024: 2/10 sections = 20% of sections = 50/250 whole-section questions.
- 2023: 6/10 sections = 60% = 150/250 questions.
- 2022: 2/10 sections = 20% = 50/250 questions.

This is better than Wave 9's 11.1% / 66.7% / 22.2% distribution, but both 2024 sections still come from the same exam date, so 2024 remains vulnerable to same-day shift dependence.

## Wave 9 → Wave 10 frequency movement

The leading packages remain broadly consistent, but exact shares are still moving enough that production weights should remain locked.

| Package | Wave 9 | Wave 10 | Delta (pp) |
| --- | ---: | ---: | ---: |
| GEO-001 | 4.89% | 5.60% | +0.71 |
| DI-005 | 1.33% | 2.00% | +0.67 |
| TMW-001 | 10.22% | 9.60% | -0.62 |
| TRG-001 | 11.11% | 10.80% | -0.31 |
| TSD-001 | 6.67% | 6.40% | -0.27 |
| DI-001 | 6.67% | 6.40% | -0.27 |
| NUM-001 | 5.33% | 5.60% | +0.27 |
| ALG-001 | 9.78% | 10.00% | +0.22 |
| GEO-002 | 6.22% | 6.00% | -0.22 |
| MEN-002 | 5.33% | 5.20% | -0.13 |
| PNL-001 | 7.11% | 7.20% | +0.09 |

Largest absolute movement among these packages is about 0.71 percentage points.

The top-three packages remain the same set but change order:

- Wave 9: TRG-001, TMW-001, ALG-001
- Wave 10: TRG-001, ALG-001, TMW-001

Top-three concentration falls from 70/225 = 31.11% to 76/250 = 30.40%.

## Wave 10 cumulative leading profile

| Rank | Package | Questions | Share |
| ---: | --- | ---: | ---: |
| 1 | TRG-001 | 27 | 10.80% |
| 2 | ALG-001 | 25 | 10.00% |
| 3 | TMW-001 | 24 | 9.60% |
| 4 | PNL-001 | 18 | 7.20% |
| 5= | DI-001 | 16 | 6.40% |
| 5= | TSD-001 | 16 | 6.40% |
| 7 | GEO-002 | 15 | 6.00% |
| 8= | GEO-001 | 14 | 5.60% |
| 8= | NUM-001 | 14 | 5.60% |
| 10 | MEN-002 | 13 | 5.20% |

Low-support tail packages remain too sparse for exact production weighting: DI-004, PCT-007, RAP-003, SRI-001, SRI-002 and TSD-002 each currently have one observation in 250 whole-section questions (0.4%).

## Audit verdict

**PASS — stability corpus expansion.** The ten-section corpus is suitable for continued audit-level frequency analysis.

**HOLD — exact production frequency weights.** The distribution is becoming more coherent but still exhibits material share movement, rank movement and low-frequency sparsity.

**HOLD — production promotion.** `productionPromotionAuthorized` remains deliberately false. Meeting the evidence floor or reaching ten sections must not implicitly authorize production weighting.

## Next evidence priority

1. Prefer another complete 2024 section from a different exam date rather than a third 09-Sep shift.
2. If unavailable, add a complete 2022 section from another exam date/cycle.
3. Continue recording absolute share delta, rank delta, top-3/top-5 concentration and year-conditioned frequencies.
4. Keep generic isolated-PYQ frequency evidence separate from the whole-section profile.
5. Resolve legacy tests that pin mutable global registry/package totals before calling the audit branch fully regression-clean.
