# Quant V4 — SSC CGL Tier-I whole-section frequency stability audit — P2

Authority: `QUANT-V4-WHOLE-SECTION-FREQUENCY-STABILITY-P2`

## Purpose

Wave 8 reached the conservative minimum whole-section evidence floor: **8 complete SSC CGL Tier-I Quant sections / 200 questions**. This checkpoint asks a different question:

> Is the observed package-frequency profile stable and balanced enough to influence production generation?

The answer at the current corpus size is **no**.

This is not a failure of the whole-section evidence. The whole-section profile is a valid `SECTION_FREQUENCY_CANDIDATE`. The stability layer deliberately applies a stricter audit policy before production weighting can even be considered.

## Current verdict

- Whole-section evidence: **PASS — candidate**
- Stability status: **`STABILITY_HOLD`**
- Production promotion: **unauthorized**

Current stability blockers:

1. `BALANCED_YEAR_SAMPLE_BELOW_POLICY`
2. `SINGLE_YEAR_SECTION_CONCENTRATION_HIGH`
3. `SINGLE_DATE_SECTION_CONCENTRATION_HIGH`
4. `CONCENTRATED_DATE_SUPPORT_LOSS_HIGH`

## Corpus balance

| Year | Complete sections | Questions | Share of sections | Package coverage |
| --- | ---: | ---: | ---: | ---: |
| 2022 | 1 | 25 | 12.5% | 17 |
| 2023 | 6 | 150 | 75.0% | 27 |
| 2024 | 1 | 25 | 12.5% | 14 |

Only **one year (2023)** currently has at least two complete sections. The P2 stability policy asks for at least **three years with at least two sections each** before year balance can be treated as adequate.

The 2023 share is **75%**, above the audit ceiling of **60%**.

## Same-date concentration

The largest same-date cluster is **25 July 2023**:

- 3 of 8 sections = **37.5%** of all complete sections;
- 75 of 200 questions = **37.5%** of the whole-section question sample.

The P2 audit ceiling for one date is **25%** of complete sections.

This matters because adjacent shifts from one exam date are not maximally independent samples. They can share paper-setting tendencies, topic emphasis, and source-provider artefacts.

## Package concentration

The 200-question profile is non-uniform:

| Concentration | Questions | Share |
| --- | ---: | ---: |
| Top 3 packages | 67 | 33.5% |
| Top 5 packages | 94 | 47.0% |
| Top 10 packages | 146 | 73.0% |

The top three are `ALG-001` (23), `TMW-001` (22), and `TRG-001` (22).

This is strong evidence against a naive equal-frequency generator. It is not yet evidence that **11.5%, 11.0%, and 11.0%** are stable long-run production targets.

## Leave-one-section-out test

Each of the eight complete sections is removed once and package shares are recomputed on the remaining 175 questions.

Result:

- maximum absolute package-share movement: **1.4286 percentage points**;
- package producing that maximum: `DI-001` when the 2024-09-09 Shift 1 paper is removed;
- maximum package-rank movement: **4 places**.

The share drift is below the conservative P2 single-paper ceiling of 2 percentage points. This is a useful positive result: **no one individual paper alone is dominating the package percentages**.

The rank movement is larger because many mid- and low-frequency packages are separated by only one or two questions and several ranks contain ties. Rank order at the tail therefore remains noisy even when share movement is modest.

## Concentrated-date removal test

A stronger stress test removes the entire largest same-date cluster: all three **25 July 2023** sections.

Remaining corpus:

- 5 sections;
- 125 questions;
- package coverage falls from 27 to **23**.

Packages that disappear completely from support:

- `DI-004`
- `PCT-001`
- `PCT-005`
- `SRI-002`

Maximum package-share movement after removing the date cluster is **2.0 percentage points**, for `DI-001`.

The share movement itself is at the current P2 ceiling, but losing **four entire package supports** is above the allowed support-loss threshold of two. This is why `CONCENTRATED_DATE_SUPPORT_LOSS_HIGH` remains a blocker.

## Year-conditioned signal

The 2023-only profile contains 150 questions. Its leading packages are:

1. `TMW-001` — 19
2. `ALG-001` — 18
3. `TRG-001` — 16

The single 2024 section, by contrast, is led by `DI-001` with 4 questions. The single 2022 section has `ALG-001` and `TRG-001` tied at 3 each.

These differences are exactly why one section from 2022 and one from 2024 cannot yet be treated as reliable year-conditioned frequencies.

## What is already stable enough to trust

We can now trust several structural conclusions at audit level:

- SSC CGL Quant is not a uniform package sampler.
- Algebra, Time & Work, and Trigonometry are repeatedly prominent in the current whole-section corpus.
- No single paper causes an extreme share swing when removed.
- Whole-section frequency evidence is materially more trustworthy than isolated chapter-selected PYQs for estimating paper composition.

## What is not yet stable enough to use in production

We should **not** yet:

- set production package weights directly to the observed 200-question percentages;
- infer reliable year-specific package weights for 2022 or 2024;
- promote rare packages merely because they appeared once;
- suppress packages merely because they disappear when the 25-Jul-2023 cluster is removed;
- calibrate CP/QL, difficulty, or representation frequencies from this package-level stability pass.

## P2 stability policy

The current audit policy is intentionally conservative:

- minimum complete sections: 8;
- balanced years required: 3;
- sections required for a year to count as balanced: 2;
- maximum one-year share of sections: 60%;
- maximum one-date share of sections: 25%;
- maximum leave-one-section-out package-share drift: 2 percentage points;
- maximum largest-date-removal package-share drift: 2 percentage points;
- maximum packages lost after largest-date removal: 2;
- production authorization: `false`.

These are **audit policy thresholds**, not claims about SSC's official paper-setting rules. They exist to stop a small, concentrated evidence corpus from being over-interpreted.

## Next evidence priority

The highest-value next additions are not more 25–27 July 2023 shifts.

Priority should be:

1. a second complete 2024 SSC CGL Tier-I Quant section;
2. a second complete 2022 section;
3. then additional sections from 2024/2022 or another structurally comparable CGL cycle until at least three years have two or more complete sections;
4. independent or official-source cross-verification where available.

After every new whole section, rerun the same stability suite. The production gate remains separate even after all stability blockers clear.

## Decision

**PASS — Wave 8 whole-section evidence is valid.**

**PASS — single-paper share sensitivity is modest.**

**HOLD — year balance is insufficient.**

**HOLD — same-date concentration is too high.**

**HOLD — removing the dominant date window removes four package families from observed support.**

**HOLD — production frequency promotion remains unauthorized.**
