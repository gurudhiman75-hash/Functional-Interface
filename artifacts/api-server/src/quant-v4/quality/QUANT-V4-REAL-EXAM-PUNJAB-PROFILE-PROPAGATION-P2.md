# Quant V4 Real-Exam Punjab Profile Propagation Boundary — P2

Authority: `QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2`

## Finding

The shared Quant V4 exam-profile authority correctly defines `PUNJAB_STATE` as a four-option `PUNJAB_STATE_OBJECTIVE` profile. The composed real-exam simulation stack is **not yet able to propagate that authority through every ordinary Quant chapter route**.

The earlier draft of this checkpoint attempted to repair the issue by passing `examProfile: "PUNJAB_STATE"` at the outer Question Studio API. That was insufficient: several chapter routes do not accept or forward `examProfile`, so a successful outer call does not prove that the chapter runtime consumed the Punjab profile.

This checkpoint continues to record that broader capability boundary, while closing the narrower Probability simulator fallback defect.

## Confirmed boundaries

### Historical simulator metadata

PSSSB, PPSC and Punjab Police still carry:

- `centralDeliveryProfile: null`
- `centralProfileGap: true`

That composed-profile metadata remains intentionally visible until downstream chapter routes genuinely support Punjab delivery end to end.

### Probability simulator resolver — repaired

Probability is now handled explicitly at the simulator routing boundary.

For `PSSSB`, `PPSC` and `PUNJAB_POLICE`, the real-exam simulator resolves Probability slots directly to:

- `examProfile: "PUNJAB_STATE"`

It no longer maps those slots to `SSC_CGL_CHSL`.

The Probability Question Studio integration recognizes this explicit Punjab request and fails closed with `PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED`. The simulator therefore records the Probability slot as a capability gap rather than counting an SSC-generated question as Punjab output.

The old seed-based compatibility workaround has been removed. Seed text no longer changes exam-profile semantics.

### Core Quant generation engine

The older core-generation boundary recorded by this audit remains separate from the Probability resolver fix. The audit continues to preserve its existing compile-time capability guard until that boundary is deliberately reconciled in its own checkpoint.

### Specialized Arithmetic Question Studio routes

The audit continues to track its existing route-level capability findings for Average, Mixture and legacy Arithmetic adapters. Those broader findings are not silently promoted by this Probability-only repair.

### Mensuration standard route

The audit likewise keeps the existing standard Mensuration boundary visible until its profile path is explicitly reconciled.

### Native Probability selection contract

The Probability-specific native profile union/config still defines SSC, banking and generic-practice selection contracts; it does **not** yet define a native `PUNJAB_STATE` selection profile.

That absence is now represented as `EVIDENCE_GATED`, not hidden by an SSC fallback. Question Studio rejects Punjab Probability before the raw profile layer is allowed to select content.

A native Punjab Probability profile must not be introduced until attributable Punjab Probability observations support its CP/solve-mode, difficulty and representation rules.

## Executable proof

The P2 gates now prove that:

- the central `PUNJAB_STATE` authority exists and remains four-option;
- PSSSB/PPSC/Punjab Police still expose their composed central-profile gap;
- each Punjab real-exam Probability resolver returns `PUNJAB_STATE`;
- generated Punjab simulator Probability slots become `CAPABILITY_GAP` records carrying the explicit evidence-gate reason;
- an explicit SSC Probability request remains SSC even if its seed happens to contain a Punjab exam name;
- direct and runtime-mode `PUNJAB_STATE` Probability requests still fail closed;
- the raw Probability profile type still has no native `PUNJAB_STATE` selection contract;
- the broader audit remains `simulatorPropagationReady: false` rather than confusing a repaired Probability route with complete Punjab propagation.

The `@ts-expect-error` assertion on the raw Probability profile is deliberate. When native Punjab Probability selection is evidence-backed and added, the build will force this audit to be revised together with that implementation.

## Correct remediation order from here

1. Keep the repaired Probability simulator resolver on explicit `PUNJAB_STATE`; do not reintroduce any SSC fallback.
2. Normalize attributable Punjab Probability observations and approve a native Punjab CP/solve-mode/difficulty/representation contract before enabling selection.
3. Reconcile the remaining ordinary Arithmetic and specialized Question Studio profile boundaries in their own checkpoints.
4. Bridge any remaining standard Mensuration/profile boundaries explicitly.
5. Only after the remaining downstream routes genuinely support Punjab should the composed simulator metadata move from `centralDeliveryProfile: null` to a fully propagated Punjab profile and undergo section-level calibration.

## Readiness boundary

PSSSB, PPSC and Punjab Police are still **not fully Punjab-profile simulation-ready** at this checkpoint. However, their Probability slots no longer masquerade as SSC: they now reach the explicit Punjab evidence gate and remain capability gaps until native Punjab Probability selection is justified by evidence.
