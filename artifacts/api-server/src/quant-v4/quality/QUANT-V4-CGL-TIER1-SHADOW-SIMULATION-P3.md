# Quant V4 — SSC CGL Tier-I Shadow Simulation P3

**Authority:** `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-P3`  
**Mode:** non-production shadow audit  
**Production promotion:** disabled  
**Runtime blueprint mutation:** disabled

## Purpose

The preceding P3 governance checkpoint derived a stable empirical shadow mix from 13 complete SSC CGL Tier-I Quant sections / 325 questions:

- Arithmetic core: 11
- Data Interpretation: 3
- Geometry & Mensuration: 5
- Trigonometry: 3
- Algebra: 3

This checkpoint asks the next practical question: **can Question Studio actually fill that more realistic 25-question mix without making the current section-level capability problem worse?**

The active simulator remains unchanged at 13 Arithmetic, 4 Geometry/Mensuration, 3 Trigonometry, 2 Algebra and 3 Probability. The empirical shadow mix is generated only inside this audit.

## Structural finding before runtime sampling

The central section-simulation contract currently has no deterministic SSC CGL Tier-I adapter for:

- Trigonometry (`TRG-001` / `TRG-002`)
- Algebra

That means the current provisional blueprint contains **5 structural gaps per section**: 3 Trigonometry + 2 Algebra.

The empirical shadow blueprint contains **6 structural gaps per section**: 3 Trigonometry + 3 Algebra.

So even before looking at generation quality, switching the simulator to the empirical mix would make the known section-assembly gap worse by one slot per 25-question section. The reason is not the empirical blueprint; it is the missing Algebra/Trigonometry section adapters.

## Runtime audit

The CI proof generates 20 complete shadow sections (500 records) and, in parallel, 20 current baseline SSC CGL Tier-I sections. Non-gap shadow slots use the existing Question Studio generation paths:

- Arithmetic: normal Question Studio package pool
- Data Interpretation: DI-001 to DI-006 linked-set generators
- Geometry/Mensuration: the currently exposed GEO-001 / MEN-002 simulation pool
- Trigonometry: explicit capability-gap record
- Algebra: explicit capability-gap record

The audit records option-count mismatches, empty explanations, normalized stem repetition, slot distribution and package distribution. It fails closed when capability gaps remain.

## Expected governance result

The correct result at this checkpoint is `SHADOW_SIMULATION_HOLD`, not promotion.

At minimum the audit must report:

- 20 sections / 500 records
- 120 structural gap records from Algebra + Trigonometry
- 6 structural gaps per shadow section versus 5 in the current provisional section
- no mutation of the active simulator profile
- `productionPromotionAuthorized = false`
- `runtimeBlueprintMutationAuthorized = false`

Additional runtime failures or quality defects are allowed to add blockers; they must never be hidden to make the shadow plan appear healthier.

## Interpretation

This result does **not** reject the empirical 11/3/5/3/3 mix. It shows that the empirical evidence has advanced faster than the section assembler. The next engineering checkpoint should therefore expose deterministic SSC CGL Tier-I Algebra and Trigonometry adapters to the section simulation contract, then rerun the exact same shadow audit.

Production frequency promotion remains a separate authorization decision after the shadow simulation can pass without structural capability gaps.
