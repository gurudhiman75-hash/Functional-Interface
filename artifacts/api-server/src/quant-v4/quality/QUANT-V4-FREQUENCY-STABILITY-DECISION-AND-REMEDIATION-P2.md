# Quant V4 — Frequency Stability Decision and Remediation Plan (P2)

Authority: `QUANT-V4-FREQUENCY-STABILITY-DECISION-AND-REMEDIATION-P2`

## Decision point

The whole-section evidence phase has reached a useful decision threshold:

- 12 complete SSC CGL Tier-I Quant sections
- 300 complete-section questions
- 28 represented packages
- 3 exam years
- 2024 / 2023 / 2022 section balance = 33.33% / 50.00% / 16.67%
- top-four package order has remained `TRG-001 > ALG-001 > TMW-001 > PNL-001` across the latest expansions
- top-three concentration fell from 32.50% at Wave 8 to 29.00% at Wave 12
- Wave 11 -> Wave 12 largest meaningful package-share move was about 0.48 percentage points

This is enough to stop indiscriminate paper accumulation and begin targeted engine auditing. It is **not** enough to freeze exact production weights.

Keep:

- `SECTION_FREQUENCY_CANDIDATE`
- `productionPromotionAuthorized=false`
- `canPromoteWholeSectionFrequencyWeights(profile) === false`

## Audit-only support classes

The repository now exposes an audit-only support assessment. The thresholds describe evidence density only; they are not production quotas and do not authorize mock generation weights.

### Core evidence — observed share >= 5%

These packages have enough whole-section presence by question count to justify the deepest engine-realism audit first:

| Package | Questions | Share | Mean / section |
|---|---:|---:|---:|
| TRG-001 | 33 | 11.00% | 2.75 |
| ALG-001 | 28 | 9.33% | 2.33 |
| TMW-001 | 26 | 8.67% | 2.17 |
| PNL-001 | 24 | 8.00% | 2.00 |
| DI-001 | 19 | 6.33% | 1.58 |
| TSD-001 | 19 | 6.33% | 1.58 |
| GEO-002 | 18 | 6.00% | 1.50 |
| NUM-001 | 17 | 5.67% | 1.42 |
| GEO-001 | 16 | 5.33% | 1.33 |
| MEN-002 | 15 | 5.00% | 1.25 |

These ten packages account for 215/300 = **71.67%** of the observed whole-section corpus. Defects here have the largest effect on Examtree mock realism.

### Established evidence — observed share >= 2% and < 5%

| Package | Questions | Share |
|---|---:|---:|
| INT-001 | 12 | 4.00% |
| MEN-001 | 9 | 3.00% |
| DI-003 | 8 | 2.67% |
| RAP-001 | 8 | 2.67% |
| ALG-002 | 7 | 2.33% |
| AVG-001 | 7 | 2.33% |
| PCT-001 | 7 | 2.33% |
| DI-005 | 6 | 2.00% |

These packages are common enough to audit after the core tier, but their exact paper-level frequency remains less certain.

### Thin evidence — observed share < 2%

| Package | Questions | Share |
|---|---:|---:|
| SAP | 5 | 1.67% |
| PCT-002 | 4 | 1.33% |
| MAL-001 | 3 | 1.00% |
| RAP-002 | 2 | 0.67% |
| RAP-003 | 2 | 0.67% |
| DI-004 | 1 | 0.33% |
| PCT-007 | 1 | 0.33% |
| SRI-001 | 1 | 0.33% |
| SRI-002 | 1 | 0.33% |
| TSD-002 | 1 | 0.33% |

Low corpus frequency must **not** be interpreted as evidence that these packages are unnecessary. Their next step is targeted evidence and taxonomy validation, not removal and not forced down-weighting.

## What frequency evidence may and may not do

### Allowed now

Frequency evidence may be used to:

1. prioritize audit effort;
2. identify high-impact packages for CP/stem/explanation/novelty review;
3. detect grossly unrealistic future mock compositions;
4. compare generated full sections against broad real-exam structure;
5. target additional PYQ collection toward evidence-thin packages or underrepresented years.

### Not allowed yet

Frequency evidence must not yet be used to:

1. assign exact production package probabilities;
2. force every 25-question mock to reproduce the corpus percentages;
3. suppress rare packages simply because the 12-paper sample is thin;
4. promote a frequency profile automatically when sample thresholds are met;
5. replace question-level realism, difficulty and CP-coverage audits.

## Remediation order

### Phase A — core-package exam-realness audit

Audit in impact order:

1. TRG-001
2. ALG-001
3. TMW-001
4. PNL-001
5. DI-001
6. TSD-001
7. GEO-002
8. NUM-001
9. GEO-001
10. MEN-002

For every package compare the observed whole-section questions against the engine on:

- real question archetypes and CP coverage;
- stem naturalness;
- variable/object-pool breadth;
- difficulty construction rather than superficial number inflation;
- distractor quality;
- explanation completeness and beginner readability;
- novelty capacity without drifting outside exam style;
- multilingual parity where supported;
- Question Studio/runtime reachability.

A package is not considered ready merely because it can generate many seeds. It must cover the **types of questions actually seen in the evidence corpus**.

### Phase B — established packages

Run the same audit for the eight established-evidence packages after core defects have been closed.

### Phase C — thin-evidence taxonomy/evidence pass

For thin packages, first determine which condition applies:

- genuinely rare SSC CGL pattern;
- taxonomy split that is too granular;
- evidence collection gap;
- package belongs more strongly to another exam/profile;
- real implementation gap.

Do not merge/suppress package identities only to make the frequency table look cleaner.

## Section-presence requirement before any future weighting

Question share alone is insufficient. Before exact production calibration is reconsidered, each package assessment must also include:

- section presence count/share;
- per-section minimum and maximum;
- median questions per section;
- zero-inflation / omission rate;
- year-conditioned frequency;
- date/shift clustering;
- consecutive-wave share movement.

A package with 6% overall share but concentrated in a small number of sections must not be treated the same as a package appearing in almost every section.

## Promotion gate

No automatic numeric threshold in this document opens production weighting. Promotion remains a separate deliberate authorization after:

1. core-package realism and coverage audits pass;
2. section-presence analysis is complete;
3. legacy mutable-global regression tests are cleaned up;
4. the audit branch is reconciled with current `New-main`;
5. TypeScript/regression execution is actually run and passes;
6. a human decision explicitly sets `productionPromotionAuthorized=true`.

## Immediate next checkpoint

Start with **TRG-001**, because it is the most frequently observed package (33/300 = 11.00%). Perform a micro-level comparison between the 33 observed whole-section trigonometry questions and the TRG-001 CP/runtime library. Identify missing archetypes, overproduced archetypes, weak stems, explanation defects, difficulty gaps and novelty limitations before changing frequency behaviour.
