# Quant V4 Specialized Profile Calibration Policy — P3

**Authority:** `QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-POLICY-P3`

## Purpose

Quant V4 now has normalized profile evidence and a calibration-readiness diagnostic, but it previously had no formal mechanism for evaluating an explicitly adopted package-level calibration policy.

This checkpoint adds that mechanism without inventing production thresholds.

## Policy fields

A caller-supplied policy may specify:

- minimum countable observations;
- minimum distinct resolved papers;
- minimum canonical CP coverage;
- minimum representation coverage;
- whether complete canonical CP mapping is required;
- whether empirical difficulty evidence is required.

All numeric thresholds must be non-negative integers.

## No adopted policy yet

`QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES` is intentionally empty.

This means no current package/profile pair can claim that Examtree has ratified a specialized selection-calibration policy.

Adding an adopted policy is a separate methodology/governance action.

## Candidate is not promotion

The evaluator can return:

- `POLICY_EVALUATION_HOLD`; or
- `POLICY_EVALUATION_CANDIDATE`.

Even a candidate always reports:

`selectionPromotionAuthorized: false`

The policy evaluator therefore cannot silently change Question Studio selection behavior.

## Current evidence examples

### MAL-001 / SSC CGL Tier-I

The current five-observation MAL CGL sample is fully CP-mapped across:

- MAL-CP-001;
- MAL-CP-003;
- MAL-CP-004.

A synthetic evidence-only policy can therefore pass. If empirical difficulty evidence is required, the same sample correctly remains on hold.

This demonstrates the mechanism; it does not adopt those synthetic thresholds.

### NUM-001 / SSC CGL Tier-I

NUM has a much larger evidence sample, but CP mapping is not yet complete and empirical difficulty is not normalized. A strict policy therefore remains on hold even when its raw sample count is high.

## Governance rule

A future profile-selection promotion requires all of the following as separate steps:

1. evidence normalization;
2. explicit calibration policy adoption;
3. policy evaluation candidate;
4. editorial/methodology review;
5. explicit selector-promotion authorization.

No single CI pass may collapse those steps into one.
