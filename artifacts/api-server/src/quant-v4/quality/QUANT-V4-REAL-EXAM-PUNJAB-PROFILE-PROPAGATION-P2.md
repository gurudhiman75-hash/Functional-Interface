# Quant V4 Real-Exam Punjab Profile Propagation — P2

Authority: `QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2`

## Why this checkpoint exists

The merged central exam-profile authority now defines `PUNJAB_STATE` as a real four-option `PUNJAB_STATE_OBJECTIVE` delivery profile. The historical P2 real-exam simulator predates that authority and still stores `centralDeliveryProfile: null` for PSSSB, PPSC and Punjab Police.

That stale metadata matters because ordinary Arithmetic and Geometry/Mensuration core-slot generation passes the historical `centralDeliveryProfile` directly into Question Studio. With `null`, those calls run without an explicit Punjab profile and can silently use generic/SSC-like defaults.

## Remediation

This checkpoint adds a current Punjab simulation boundary on top of the preserved historical audit baseline.

For:

- PSSSB
- PPSC
- Punjab Police

all `ARITHMETIC_CORE` and `GEOMETRY_MENSURATION` slots are regenerated through Question Studio with:

`examProfile: "PUNJAB_STATE"`

The wrapper also composes the already-merged Advanced Mathematics integration, so Algebra and Trigonometry remain real runtime questions rather than historical capability-gap placeholders.

## Determinism and fallback behavior

For each core slot:

1. the package chosen by the historical section is attempted first when it is still in the eligible core pool;
2. if that package cannot generate under `PUNJAB_STATE`, the remaining eligible packages are tried deterministically;
3. a slot is marked `CAPABILITY_GAP` only when every eligible candidate fails under the explicit Punjab profile;
4. successful output must contain exactly four unique options.

Every propagated core record exposes audit trace fields:

- `requestedDeliveryProfile: "PUNJAB_STATE"`
- `deliveryProfileApplied: true`
- `profilePropagationAuthority`

This makes profile application testable instead of inferred from option count alone.

## Historical-baseline boundary

The original `quant-v4-real-exam-simulation-p2.ts` remains an immutable historical measurement artifact for now. Its three Punjab profile rows still contain stale `null` metadata, and the audit summary reports that explicitly as `historicalSimulatorMetadataStillStale`.

A later consolidation can rewrite/retire that baseline once the composed remediation surface is stable. This checkpoint fixes the active Punjab simulation boundary without falsifying what the original P2 audit actually measured.

## Executable proof

The dedicated CI gate verifies:

- the central `PUNJAB_STATE` contract is four-option `PUNJAB_STATE_OBJECTIVE`;
- every Punjab Arithmetic/Geometry core slot is regenerated through explicit `PUNJAB_STATE` delivery;
- zero propagated core capability gaps remain;
- every propagated core question has four unique options, non-empty stem and explanation;
- deterministic replay for the same section seed;
- the merged Algebra/Trigonometry integration does not regress;
- the stale historical baseline metadata remains visible until deliberate consolidation.

## Remaining real-exam audit blockers

This checkpoint does not declare PSSSB, PPSC or Punjab Police exam-simulation ready. Empirical PYQ weighting, profile-specific difficulty/lifecycle calibration, repetition/editorial thresholds, Probability profile specificity and other chapter-level capability gaps remain separate gates.
