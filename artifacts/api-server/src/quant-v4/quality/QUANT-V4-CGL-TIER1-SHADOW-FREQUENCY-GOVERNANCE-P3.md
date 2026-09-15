# Quant V4 — SSC CGL Tier-I Shadow Frequency Governance P3

**Authority:** `QUANT-V4-CGL-TIER1-SHADOW-FREQUENCY-GOVERNANCE-P3`  
**Scope:** audit/shadow only  
**Production promotion:** disabled  
**Runtime blueprint mutation:** disabled

## Why this checkpoint exists

Wave 13 moved the whole-section evidence state to `STABILITY_CANDIDATE` using 13 complete SSC CGL Tier-I Quant sections / 325 questions. That is enough to derive a serious empirical candidate for review, but it is **not** permission to replace the current simulator or production weighting.

P3 therefore computes a **shadow 25-question slot plan** from the complete-section corpus and compares it with the currently active provisional simulation blueprint. Nothing in this checkpoint changes generation behavior.

## Evidence grouped into simulation slots

The 325 whole-section questions map to the following broad slot families:

| Shadow slot | Evidence questions | Mean per 25-question section | Deterministic 25-question apportionment |
|---|---:|---:|---:|
| Arithmetic core | 147 | 11.308 | 11 |
| Data Interpretation | 40 | 3.077 | 3 |
| Geometry & Mensuration | 60 | 4.615 | 5 |
| Trigonometry | 37 | 2.846 | 3 |
| Algebra | 41 | 3.154 | 3 |
| Probability | 0 | 0.000 | 0 |
| **Total** | **325** | **25.000** | **25** |

The 25-question integer plan uses deterministic largest-remainder apportionment. It is a review artifact, not a production setting.

## Provisional simulator vs empirical shadow

The existing SSC CGL Tier-I simulator remains:

- Arithmetic core: 13
- Geometry & Mensuration: 4
- Trigonometry: 3
- Algebra: 2
- Probability: 3
- Data Interpretation: 0

The shadow comparison is therefore:

| Slot | Current provisional | Empirical shadow | Delta |
|---|---:|---:|---:|
| Arithmetic core | 13 | 11 | -2 |
| Data Interpretation | 0 | 3 | +3 |
| Geometry & Mensuration | 4 | 5 | +1 |
| Trigonometry | 3 | 3 | 0 |
| Algebra | 2 | 3 | +1 |
| Probability | 3 | 0 | -3 |

The largest absolute slot drift is **3 questions**. The main structural mismatch is that the provisional simulator allocates three Probability slots while the 13-section corpus contains no Probability package observations, and it allocates no explicit DI slots while the corpus averages just over three DI questions per section.

This does **not** prove that Probability can never appear in SSC CGL. It only proves that the current 13-section empirical corpus does not support the provisional three-per-section assumption, while DI is materially underrepresented in the current simulation blueprint.

## Governance locks

A successful P3 result is `SHADOW_EMPIRICAL_CANDIDATE_LOCKED`, not a production-ready state. The following locks remain explicit:

1. `PRODUCTION_PROMOTION_NOT_AUTHORIZED`
2. `RUNTIME_BLUEPRINT_MUTATION_NOT_AUTHORIZED`
3. `SHADOW_REVIEW_REQUIRED_BEFORE_INTEGRATION`

Any package in the complete-section evidence that cannot be mapped to a shadow slot forces `SHADOW_HOLD`; the audit is not allowed to silently drop evidence.

## Next checkpoint

Use the shadow plan to run a **non-production SSC CGL Tier-I simulation comparison**. The next audit should measure whether a 11/3/5/3/3 empirical slot mix can be filled by Question Studio without increasing capability gaps, explanation defects, repetition, or lifecycle violations. Only after that comparison should we decide whether to alter the simulator blueprint. Production weighting remains separately locked even if the shadow simulation succeeds.
