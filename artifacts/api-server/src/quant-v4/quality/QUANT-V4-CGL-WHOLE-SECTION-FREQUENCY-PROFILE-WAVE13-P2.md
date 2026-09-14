# Quant V4 — CGL Whole-Section Frequency Profile after Wave 13 P2

Wave 13 extends the conservative SSC CGL Tier-I whole-section corpus to **13 complete Quant sections / 325 questions**.

## Corpus composition

| Year | Sections | Questions |
|---|---:|---:|
| 2022 | 2 | 50 |
| 2023 | 6 | 150 |
| 2024 | 5 | 125 |
| **Total** | **13** | **325** |

Package-family coverage remains **28**.

## Package counts

| Package | Questions |
|---|---:|
| `TRG-001` | 37 |
| `ALG-001` | 36 |
| `TMW-001` | 27 |
| `DI-001` | 23 |
| `PNL-001` | 23 |
| `GEO-001` | 17 |
| `GEO-002` | 17 |
| `TSD-001` | 17 |
| `NUM-001` | 16 |
| `MEN-002` | 15 |
| `INT-001` | 14 |
| `DI-003` | 11 |
| `MEN-001` | 11 |
| `RAP-001` | 11 |
| `SAP` | 8 |
| `AVG-001` | 7 |
| `ALG-002` | 5 |
| `DI-005` | 5 |
| `MAL-001` | 5 |
| `PCT-002` | 5 |
| `PCT-005` | 4 |
| `TSD-002` | 4 |
| `PCT-001` | 2 |
| `DI-004` | 1 |
| `PCT-006` | 1 |
| `PCT-007` | 1 |
| `RAP-003` | 1 |
| `SRI-002` | 1 |

The counts sum to **325**.

## Stability checkpoint

The largest year remains 2023 at `6/13 ≈ 46.15%`, below the 60% ceiling. The largest same-date cluster remains 25 Jul 2023 at `3/13 ≈ 23.08%`, below the 25% ceiling.

Wave 13 adds independent `PCT-001` support on 13 Sep 2024. Removing all three complete sections from 25 Jul 2023 therefore loses only:

- `DI-004`
- `SRI-002`

The support-loss count is now **2**, equal to the conservative maximum. If the existing leave-one-section-out and concentrated-date share-drift checks remain within their 2 percentage-point thresholds, the profile becomes `STABILITY_CANDIDATE` with no evidence-stability blockers.

## Interpretation

`SECTION_FREQUENCY_CANDIDATE` / `STABILITY_CANDIDATE` are audit evidence states only. They do not change runtime weighting or production behavior by themselves.

**Production promotion remains disabled:** `productionPromotionAuthorized = false`.
