# Quant V4 — SSC CGL Tier-I Shadow Simulation P3

**Authority:** `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-P3`  
**Mode:** non-production shadow audit  
**Production promotion:** disabled  
**Runtime blueprint mutation:** disabled

## Purpose

The P3 frequency-governance checkpoint derives a stable empirical shadow mix from 13 complete SSC CGL Tier-I Quant sections / 325 questions:

- Arithmetic core: 11
- Data Interpretation: 3
- Geometry & Mensuration: 5
- Trigonometry: 3
- Algebra: 3

This audit asks whether Question Studio can fill that 25-question mix cleanly without mutating the active simulator profile.

The active simulator remains unchanged. The empirical mix is generated only inside this shadow audit.

## Current structural state

The former section-assembly gaps for Algebra and Trigonometry are closed.

The shadow simulator now routes:

- Arithmetic through the normal Question Studio package pool;
- Data Interpretation through linked DI generators;
- Geometry/Mensuration through exposed Question Studio runtime packages;
- Trigonometry through the merged advanced-math adapter;
- Algebra through the merged advanced-math adapter.

A current 20-section / 500-question run is expected to have:

- 500 runtime-generated records;
- 0 capability gaps;
- 0 Advanced Mathematics capability gaps;
- 0 current integrated baseline capability gaps;
- 60 Algebra records;
- 60 Trigonometry records;
- 4 options on every generated CGL question;
- no empty explanations.

## Lifecycle state

Algebra remains deliberately `BANK_ONLY` / test-ineligible.

That is a lifecycle/governance lock, not a generation capability gap. The shadow audit must therefore keep:

`ALGEBRA_BANK_ONLY_LIFECYCLE_LOCK`

until a separate lifecycle authorization changes the Algebra contract.

Trigonometry remains internally test-eligible but public-release locked.

## Structural diversity

The audit measures:

- literal stem duplication;
- normalized structural stem reuse.

The conservative normalized structural reuse ceiling is **5%**.

The current regression requires:

`normalizedStructuralStemReuseRate <= 0.05`

The latest observed 20-section / 500-question shadow run reports:

- literal stem duplicate rate: **8.4%**;
- normalized structural stem reuse: **21.8%**;
- blocker: `SHADOW_STRUCTURAL_STEM_REUSE_ABOVE_5_PERCENT`.

Therefore structural reuse is a current content-quality blocker and must be remediated rather than waived.

## Expected governance result

The correct current result remains:

`SHADOW_SIMULATION_HOLD`

Structural capability gaps are closed, but the shadow remains on hold for two different reasons:

1. `ALGEBRA_BANK_ONLY_LIFECYCLE_LOCK` — deliberate lifecycle/governance hold;
2. `SHADOW_STRUCTURAL_STEM_REUSE_ABOVE_5_PERCENT` — active content-diversity defect.

The audit must continue to report:

- no mutation of the active simulator profile;
- `productionPromotionAuthorized = false`;
- `runtimeBlueprintMutationAuthorized = false`.

## Interpretation

The empirical 11/3/5/3/3 mix is structurally fillable by the current runtime.

This still does not authorize production frequency promotion. Frequency promotion, Algebra lifecycle promotion, and public-release authorization remain separate governance decisions.

Novelty is outside this checkpoint.
