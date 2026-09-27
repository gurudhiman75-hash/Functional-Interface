# Quant V4 — SSC CGL Tier-I whole-section frequency stability audit — P2

Authority: `QUANT-V4-WHOLE-SECTION-FREQUENCY-STABILITY-P2`

## Current checkpoint

The executable Wave 13 corpus contains **13 complete SSC CGL Tier-I Quant sections / 325 questions** across **2022, 2023 and 2024**.

The current machine-audited status is:

- whole-section evidence: **SECTION_FREQUENCY_CANDIDATE**
- stability: **STABILITY_CANDIDATE**
- stability blockers: **none**
- production frequency promotion: **not authorized**
- runtime blueprint mutation: **not authorized**

This supersedes the earlier Wave 8 narrative that described an 8-section / 200-question stability hold.

## Balance now proved

The current complete-section distribution is:

| Year | Complete sections | Questions |
| --- | ---: | ---: |
| 2022 | 2 | 50 |
| 2023 | 6 | 150 |
| 2024 | 5 | 125 |
| **Total** | **13** | **325** |

All three years now satisfy the audit policy's minimum of two complete sections per balanced year. The largest single-year share is 6/13, which is below the 60% ceiling.

## Date-concentration sensitivity

The largest same-date cluster remains **25 July 2023** with 3/13 sections. This is now below the 25% ceiling.

Removing that entire date cluster leaves:

- 10 sections;
- 250 questions;
- 26 supported packages;
- only `DI-004` and `SRI-002` lost from support.

That support loss is at the allowed policy ceiling of two packages rather than above it.

## Leave-one-section-out stability

All 13 leave-one-section-out comparisons remain within the conservative package-share drift threshold. No single section now creates a stability blocker.

## Empirical slot consequence

The stable whole-section corpus feeds the non-production CGL shadow-governance checkpoint. Grouped into section families, the 325 questions imply the current empirical 25-question shadow plan:

- Arithmetic core: **11**
- Data Interpretation: **3**
- Geometry & Mensuration: **5**
- Trigonometry: **3**
- Algebra: **3**
- Probability: **0**

This plan is an **empirical candidate**, not a production setting.

## What this checkpoint authorizes

It authorizes the Quant audit to treat SSC CGL Tier-I whole-section frequency evidence as stable enough for shadow simulation and comparison.

It does **not** authorize:

- changing the production simulator weights;
- suppressing Probability globally because it was absent from this 13-section corpus;
- changing chapter lifecycle states;
- promoting BANK_ONLY Algebra into scored-test eligibility;
- applying this CGL distribution to CHSL, CGL Tier II, Banking or Punjab exams.

## Remaining gates after stability

The remaining CGL frequency issue is governance, not evidence sufficiency:

1. production promotion remains separately locked;
2. the empirical shadow simulation must continue to pass delivery/repetition/lifecycle checks;
3. any production weighting change requires an explicit authorization checkpoint.

The latest shadow audit also preserves the Algebra BANK_ONLY lifecycle lock. That is independent of frequency stability.

## Decision

**PASS — 13 complete sections / 325 questions form a stability candidate.**

**PASS — all three sampled years meet the balance floor.**

**PASS — same-date concentration is within policy.**

**PASS — concentrated-date support loss is within policy.**

**PASS — leave-one-section-out drift is within policy.**

**HOLD — production frequency promotion remains unauthorized.**
