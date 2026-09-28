# DI Novelty / Repetition Audit V1 — Measured Results

Status: MEASURED · REMEDIATION WAVES 1–2 COMPLETE  
Date: 2026-09-28  
Target: `New-main`

## Method

- 23 active DI Question Studio modes
- 120 generated questions per mode
- 2,760 sampled questions per run
- same deterministic seeds across baseline, Wave 1 and Wave 2
- measurements:
  - exact learner-stem uniqueness
  - normalized stem-frame reuse
  - stimulus-state uniqueness
  - task-family breadth
  - explanation diversity
  - dominant-frame concentration

The score measures current distinctiveness and repetition risk. It is not a raw seed-count or theoretical combinatorial-capacity score.

Risk bands:
- 90–100: LOW
- 82–89: MODERATE
- 74–81: ELEVATED
- below 74: HIGH

## Final CP scores after Wave 2

| CP | Modes | Task families | Final score | Risk | Weakest mode |
| --- | ---: | ---: | ---: | --- | --- |
| DI-001 | 1 | 10 | 92 | LOW | BASIC_TABLE |
| DI-002 | 1 | 12 | 100 | LOW | ADVANCED_TABLE |
| DI-003 | 3 | 33 | 97 | LOW | SINGLE_BAR |
| DI-004 | 3 | 31 | 99 | LOW | THREE_SERIES_LINE |
| DI-005 | 4 | 22 | 100 | LOW | COMPARATIVE_DOUBLE_PIE |
| DI-006 | 2 | 22 | 97 | LOW | ADVANCED_CASELET |
| DI-007 | 1 | 12 | 99 | LOW | SINGLE_MISSING |
| DI-008 | 2 | 22 | 97 | LOW | ADVANCED_ARITHMETIC |
| DI-009 | 1 | 13 | 95 | LOW | HISTOGRAM |
| DI-010 | 1 | 13 | 96 | LOW | FREQUENCY_POLYGON |
| DI-011 | 1 | 10 | 90 | LOW | MIXED_MULTI_CHART |
| DI-012 | 1 | 10 | 87 | MODERATE | ADVANCED_MISSING_VARIABLE |
| DI-013 | 1 | 14 | 92 | LOW | RADAR_WEB |
| DI-014 | 1 | 14 | 86 | MODERATE | RADAR_PIE_HYBRID |

Average CP score: approximately **94.8/100**.

Final chapter distribution:
- LOW repetition risk: 12/14 CPs
- MODERATE repetition risk: 2/14 CPs
- ELEVATED repetition risk: 0/14 CPs
- HIGH repetition risk: 0/14 CPs

## Weakest individual modes after Wave 2

| Rank | CP | Mode | Score | Risk | Normalized frames | Dominant frame | Unique stimuli |
| ---: | --- | --- | ---: | --- | ---: | ---: | ---: |
| 1 | DI-003 | SINGLE_BAR | 83 | MODERATE | 11 | 11.7% | 104/120 |
| 2 | DI-005 | COMPARATIVE_DOUBLE_PIE | 85 | MODERATE | 10 | 11.7% | 114/120 |
| 3 | DI-014 | RADAR_PIE_HYBRID | 86 | MODERATE | 29 | 10.0% | 94/120 |
| 4 | DI-004 | THREE_SERIES_LINE | 87 | MODERATE | 19 | 11.7% | 120/120 |
| 5 | DI-012 | ADVANCED_MISSING_VARIABLE | 87 | MODERATE | 46 | 15.0% | 120/120 |
| 6 | DI-008 | ADVANCED_ARITHMETIC | 88 | MODERATE | 89 | 2.5% | 98/120 |
| 7 | DI-006 | ADVANCED_CASELET | 89 | MODERATE | 18 | 10.0% | 101/120 |
| 8 | DI-003 | STACKED_BAR | 90 | LOW | 27 | 10.0% | 120/120 |

## Remediation impact

### DI-013 Radar / Web Chart

Baseline:
- score: 78
- risk: ELEVATED
- task families: 10
- normalized frames: 19
- unique stimuli: 93/120

After Wave 1:
- score: 81
- task families: 14
- normalized frames: 47
- unique stimuli: 93/120

Wave 1 improved task/frame breadth but exposed that state duplication remained.

Wave 2:
- switched whole-state construction to deterministic PRNG sequence
- preserved replay and visible-grid answerability

Final:
- score: **92**
- risk: **LOW**
- task families: 14

Result: radar repetition weakness is closed for the current baseline scope.

### DI-014 Radar + Pie Hybrid

Baseline:
- score: 78
- risk: ELEVATED
- task families: 10
- unique stimuli: 80/120

After Wave 1:
- score: **86**
- risk: **MODERATE**
- task families: 14
- normalized frames: 29
- unique stimuli: 94/120

Wave 1 expansion:
- contexts: 3 → 8
- partitions: 4 → 8
- approval-rate families: 2 → 4
- task families: 10 → 14

Wave 2 did not target DI-014 further because it had already crossed the acceptable floor.

### DI-004 Single-Series Line

Baseline mode:
- score: 81
- risk: MODERATE
- normalized frames: 10
- dominant frame: 20%
- unique stimuli: 108/120

Wave 2:
- contexts: 4 → 8
- deterministic PRNG state construction
- three natural stem surfaces across task families

After Wave 2, SINGLE_LINE is no longer among the eight weakest modes. DI-004 CP score increased from **95 → 99**.

## Interpretation

The chapter no longer has any CP in the elevated/high repetition-risk bands.

The remaining moderate modes do not currently justify broad generator expansion. Their mathematical/stimulus state diversity is generally healthy; the remaining opportunity is mostly selective surface/topology innovation rather than baseline-volume repair.

## Novelty policy recommendation

Do not attempt to make 100% of generated DI questions novel.

Recommended future delivery mix:

- 70–80% standard exam-pattern questions
- 15–20% structurally fresh but familiar/exam-valid questions
- up to 5–10% higher-novelty questions after separate human validation

For the planned Examtree edge, target approximately **20% controlled novelty at delivery-selection time**, not by making every generator inherently unusual.

Novelty should come from:
- new valid relation structures,
- cross-chart dependencies,
- conditional/group reasoning,
- alternate data topology,
- genuinely different arithmetic paths,

not from:
- noun swaps,
- number swaps,
- cosmetic wording,
- unnecessarily exotic charts,
- puzzle-like tricks that do not match exam style.

## Current decision

**DI BASELINE REPETITION REMEDIATION: COMPLETE**

No DI CP currently requires baseline repetition remediation before Question Studio stabilization.

The next novelty work should be a separate **delivery-mix / novel-question selection layer**, where roughly 20% of selected questions are deliberately drawn from approved higher-distinctiveness families.
