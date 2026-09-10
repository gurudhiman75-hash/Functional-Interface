# Quant V4 Real-Exam Punjab Profile Propagation Boundary — P2

Authority: `QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2`

## Finding

The shared Quant V4 exam-profile authority correctly defines `PUNJAB_STATE` as a four-option `PUNJAB_STATE_OBJECTIVE` profile. The real-exam simulation stack is **not yet able to propagate that authority through ordinary Quant chapter generation**.

The earlier draft of this checkpoint attempted to repair the issue by passing `examProfile: "PUNJAB_STATE"` at the outer Question Studio API. That was insufficient: several chapter routes do not accept or forward `examProfile`, so a successful outer call does not prove that the chapter runtime consumed the Punjab profile.

This checkpoint therefore records the actual capability boundary instead of claiming a false remediation.

## Confirmed blockers

### Historical simulator metadata

PSSSB, PPSC and Punjab Police still carry:

- `centralDeliveryProfile: null`
- `centralProfileGap: true`

That stale metadata should remain visible until downstream chapter routes genuinely support Punjab delivery.

### Core Quant generation engine

The core Quant generation request has no `examProfile` field. Its runtime contract forwards only difficulty, language, question-language ID and seed. This affects the normal core package family including:

- `PCT-001` through `PCT-007`
- `RAP-001` through `RAP-003`
- `PRT-001`

Passing `examProfile` at a higher wrapper cannot reach these runtimes today.

### Specialized Arithmetic Question Studio routes

Confirmed profile-blind routes include at least:

- `AVG-001`
- `MAL-001`
- `PNL-001`
- the legacy RAP route

Their adapters omit `examProfile` when invoking chapter pipelines.

### Mensuration standard route

The chapter-wide Mensuration system contains Punjab-aware weighting, but the current standard `MEN-002` / `MEN-CP-009` Question Studio request has no `examProfile` field. The profile is therefore lost at the standard route boundary.

### Probability

Probability is different: its runtime does accept and forward an `examProfile`, but the Probability-specific profile union/config currently defines only SSC, banking and generic-practice profiles. It does **not** define `PUNJAB_STATE`.

Therefore the historical Punjab Probability fallback to `SSC_CGL_CHSL` cannot yet be replaced by a real Punjab Probability contract.

## Executable proof

The P2 gate now uses both runtime assertions and compile-time boundary assertions.

It proves that:

- the central `PUNJAB_STATE` authority exists and remains four-option;
- PSSSB/PPSC/Punjab Police still expose their historical central-profile gap;
- the core Quant request does not accept `examProfile`;
- `AVG-001` and `MAL-001` adapters do not accept `examProfile`;
- the standard `MEN-002` route does not accept `examProfile`;
- the Probability profile type does not accept `PUNJAB_STATE`;
- the audit reports `simulatorPropagationReady: false` rather than treating outer-API success as profile application.

The `@ts-expect-error` assertions are deliberate capability guards. When a route is upgraded to accept Punjab delivery, the build will force this audit to be revised together with that implementation.

## Correct remediation order

1. Add the shared Quant `examProfile` contract to the core generation engine and thread it through the relevant Arithmetic runtimes.
2. Retrofit specialized routes such as Average, Mixture, Profit & Loss and other Question Studio adapters that currently drop the profile.
3. Bridge the standard Mensuration Question Studio route to its Punjab-aware chapter delivery/runtime.
4. Add a real Probability `PUNJAB_STATE` profile with chapter-level selection rules and conformance tests.
5. Only then change the historical/composed Punjab real-exam simulator from `centralDeliveryProfile: null` to `PUNJAB_STATE` and rerun section-level simulation/calibration.

## Readiness boundary

PSSSB, PPSC and Punjab Police are **not Punjab-profile simulation-ready** at this checkpoint. Algebra/Trigonometry integration is already repaired separately, but ordinary Arithmetic/Mensuration profile propagation and Punjab Probability remain genuine blockers.
