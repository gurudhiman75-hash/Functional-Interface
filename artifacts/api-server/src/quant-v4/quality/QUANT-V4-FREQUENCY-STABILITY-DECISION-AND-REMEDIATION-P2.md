# Quant V4 — Frequency Stability Decision and Remediation Plan (P2)

Authority: `QUANT-V4-FREQUENCY-STABILITY-DECISION-AND-REMEDIATION-P2`

## Decision point

The whole-section evidence phase has reached a useful decision threshold:

- 12 complete SSC CGL Tier-I Quant sections
- 300 complete-section questions
- **29 represented packages** after correcting a Heights & Distances item from `TRG-001` to `TRG-002`
- 3 exam years
- 2024 / 2023 / 2022 section balance = 33.33% / 50.00% / 16.67%
- top-four order remains `TRG-001 > ALG-001 > TMW-001 > PNL-001`
- corrected top-three concentration fell from 32.50% at Wave 8 to **28.67%** at Wave 12
- Wave 11 -> Wave 12 largest meaningful package-share move is about 0.48 percentage points

This is enough to stop indiscriminate paper accumulation and begin targeted engine auditing. It is **not** enough to freeze exact production weights.

Keep:

- `SECTION_FREQUENCY_CANDIDATE`
- `productionPromotionAuthorized=false`
- `canPromoteWholeSectionFrequencyWeights(profile) === false`

## Taxonomy lesson from the first package audit

A 10 Sep 2024 pole/ground question had originally been counted under `TRG-001`. The current Trigonometry family authority explicitly assigns Heights & Distances to `TRG-002`. The observation was corrected.

This demonstrates that frequency calibration cannot be trusted from topic labels alone. Every observed question must be checked against the **current package authority boundary** before its frequency is used.

Consequences of the correction:

- `TRG-001`: 33 -> **32** questions
- `TRG-002`: 0 -> **1** question
- package coverage: 28 -> **29**
- Wave 12 top-three concentration: 29.00% -> **28.67%**

## Audit-only support classes

The thresholds below describe evidence density only. They are not production quotas and do not authorize mock-generation weights.

### Core evidence — observed share >= 5%

| Package | Questions | Share | Mean / section |
|---|---:|---:|---:|
| TRG-001 | 32 | 10.67% | 2.67 |
| ALG-001 | 28 | 9.33% | 2.33 |
| TMW-001 | 26 | 8.67% | 2.17 |
| PNL-001 | 24 | 8.00% | 2.00 |
| DI-001 | 19 | 6.33% | 1.58 |
| TSD-001 | 19 | 6.33% | 1.58 |
| GEO-002 | 18 | 6.00% | 1.50 |
| NUM-001 | 17 | 5.67% | 1.42 |
| GEO-001 | 16 | 5.33% | 1.33 |
| MEN-002 | 15 | 5.00% | 1.25 |

These ten packages account for 214/300 = **71.33%** of the observed whole-section corpus. Defects here have the largest effect on Examtree mock realism.

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
| TRG-002 | 1 | 0.33% |
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

For every package compare observed questions against the engine on:

- package-authority ownership first;
- real question archetypes and CP coverage;
- stem naturalness;
- variable/object-pool breadth;
- difficulty construction rather than superficial number inflation;
- distractor quality;
- explanation completeness and beginner readability;
- novelty capacity without drifting outside exam style;
- multilingual parity where supported;
- Question Studio/runtime reachability.

A package is not ready merely because it can generate many seeds. It must cover the **types of questions actually seen in the evidence corpus**, and those questions must be assigned to the correct package authority.

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

## Promotion gate

No automatic numeric threshold in this document opens production weighting. Promotion remains a separate deliberate authorization after:

1. package-authority/taxonomy validation is complete;
2. core-package realism and coverage audits pass;
3. section-presence analysis is complete;
4. legacy mutable-global regression tests are cleaned up;
5. the audit branch is reconciled with current `New-main`;
6. TypeScript/regression execution is actually run and passes;
7. a human decision explicitly sets `productionPromotionAuthorized=true`.

## Immediate next checkpoint

Continue the **TRG-001 / TRG-002 boundary audit**. Compare the remaining observed trigonometry questions against the family authority and the 144-QL TRG-001 ledger. Any heights/distance scene belongs under TRG-002. Then identify genuine TRG-001 archetype gaps such as interval-comparison, cubic-identity or other real-paper forms that are not explicitly represented by the locked QL families.
