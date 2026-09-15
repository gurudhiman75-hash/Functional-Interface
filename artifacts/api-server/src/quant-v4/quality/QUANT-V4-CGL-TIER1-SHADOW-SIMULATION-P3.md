# Quant V4 — SSC CGL Tier-I Shadow Simulation P3

**Authority:** `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-P3`  
**Mode:** non-production shadow audit  
**Production promotion:** disabled  
**Runtime blueprint mutation:** disabled

## Purpose

The P3 governance checkpoint derived an empirical shadow mix from 13 complete SSC CGL Tier-I Quant sections / 325 questions:

- Arithmetic core: 11
- Data Interpretation: 3
- Geometry & Mensuration: 5
- Trigonometry: 3
- Algebra: 3

The active simulator remains unchanged at 13 Arithmetic, 4 Geometry/Mensuration, 3 Trigonometry, 2 Algebra and 3 Probability. The empirical mix exists only inside this audit.

## Correction to the first shadow run

The first shadow-simulation checkpoint exercised the **base** real-exam simulator path. That base contract deliberately emits explicit capability-gap records for Algebra and Trigonometry, so the first run reported six Advanced Mathematics gaps in the empirical shadow section.

That was not the whole repository state. Quant V4 already contains the separately merged Advanced Mathematics integration layer:

- `quant-v4-real-exam-advanced-math-adapters-p2.ts`
- `quant-v4-real-exam-advanced-math-integration-p2.ts`

The integration layer replaces the base simulator's Algebra and Trigonometry gaps without changing the base simulator itself. This remediation routes the empirical shadow audit through those existing adapters rather than incorrectly treating those adapters as absent.

## Advanced Mathematics lifecycle contract

The adapters intentionally have different lifecycle states.

### Trigonometry

SSC CGL Tier-I Trigonometry is generated from the TRG Question Studio path. The adapter preserves:

- four-option single-choice delivery;
- `testEligible = true`;
- `publiclyPublishable = false`.

So Trigonometry is a usable internal test-section capability while public release remains locked.

### Algebra

Algebra is generated through the V5 Algebra Question Studio path and the approved Question Bank wrapper. It deliberately remains:

- `questionBankAcceptanceMode = BANK_ONLY`;
- `testEligible = false`;
- `publiclyPublishable = false`.

Therefore Algebra is no longer a generation-capability gap, but it is still a **lifecycle blocker for scored test assembly**. This audit must not reinterpret BANK_ONLY content as test-ready merely to make the empirical shadow plan pass.

## Remediated runtime audit

The CI proof generates 20 empirical shadow sections / 500 records and, in parallel, 20 current SSC CGL Tier-I sections through the existing Advanced Mathematics integration wrapper.

Shadow generation uses:

- Arithmetic: normal Question Studio package pool;
- Data Interpretation: DI-001 to DI-006 linked-set generators;
- Geometry/Mensuration: current GEO-001 / MEN-002 simulation pool;
- Trigonometry: existing Advanced Mathematics section adapter;
- Algebra: existing Algebra BANK_ONLY section adapter.

The audit records:

- capability gaps;
- Advanced Mathematics capability gaps;
- Algebra BANK_ONLY counts;
- Trigonometry internal test eligibility;
- option-count mismatches;
- empty explanations;
- normalized stem repetition;
- slot and package distribution.

The integrated current baseline is also checked so the comparison does not confuse the base simulator's deliberate placeholders with the repository's actual integration capability.

## Expected governance result

The expected result remains `SHADOW_SIMULATION_HOLD`, but for a more precise reason.

If the existing adapters behave as designed, the remediated audit should show:

- **0** shadow capability gaps;
- **0** Advanced Mathematics capability gaps;
- **0** integrated-current-baseline capability gaps;
- all 60 shadow Algebra records generated successfully but still BANK_ONLY / test-ineligible;
- all 60 shadow Trigonometry records generated successfully and internally test-eligible;
- no mutation of the active simulator blueprint;
- `productionPromotionAuthorized = false`;
- `runtimeBlueprintMutationAuthorized = false`.

The mandatory remaining blocker is `ALGEBRA_BANK_ONLY_LIFECYCLE_LOCK`. Normalized stem repetition is an independent quality gate and may add a second blocker if the measured rate remains above the conservative 5% threshold.

## Interpretation

The empirical 11/3/5/3/3 mix is no longer blocked because the repository cannot generate Algebra or Trigonometry. The more accurate state is:

1. the Advanced Mathematics adapters exist and should close the technical generation gaps;
2. Trigonometry can participate in internal test simulation under its current lifecycle;
3. Algebra cannot yet be treated as scored test content because its approved lifecycle is BANK_ONLY;
4. repetition/variety still requires empirical checking across the full shadow run;
5. production frequency promotion remains separately unauthorized.

The next remediation should target the real blocker rather than bypass it: Algebra must pass the relevant quality/review gates before any deliberate change from BANK_ONLY to test-eligible is considered. Until then, the empirical frequency plan remains shadow-only.
