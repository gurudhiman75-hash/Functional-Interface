# Quant V4 Shared Exam Profile Ingress — P2

Authority: `QUANT-V4-EXAM-PROFILE-INGRESS-P2`

## Purpose

The Quant V4 public generation entry point previously inherited the legacy Probability-specific `examProfile` type. That prevented the public Question Studio contract from representing the shared central profile authority, including `PUNJAB_STATE`.

This checkpoint widened the public Quant generation request to the shared `QuantV4ExamProfileId` contract and carries the validated profile through the generation call stack using request-scoped async context.

## What is now true

- `PUNJAB_STATE`, SSC, banking and generic profiles are valid at public Quant generation ingress.
- Unknown profile IDs fail closed against the central profile authority.
- The requested profile is available request-safely to downstream core/specialized runtimes through `getCurrentQuantV4ExamProfileId()` / `getCurrentQuantV4ExamProfileContract()` without global-state leakage.
- Concurrent requests with different profiles remain isolated.
- Requested family, delivery style and expected option count are recorded in `generationContext`.
- Downstream chapter application is distinguished from transport and public delivery enforcement.

Current transport/readiness states:

- `APPLIED_DOWNSTREAM` — the generated chapter runtime itself exposes/consumes the requested profile.
- `DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING` — the public Quant delivery surface enforces the central option-count contract, but exam-specific CP/QL/frequency/difficulty selection is not yet proven.
- `INGRESS_ACCEPTED_DOWNSTREAM_PENDING` — the profile is available in request-scoped context but neither downstream application nor enforceable Quant delivery has been proven for that result shape.

## Current evidence

Probability already has a chapter-level profile mechanism for its existing SSC/banking profiles. Those routes prove `APPLIED_DOWNSTREAM`, including four-option SSC and five-option banking delivery.

After `QUANT-V4-PROFILE-DELIVERY-P2`, core Percentage requests such as `PCT-001` no longer stop at ingress-only status. Their public Quant question surface enforces the central four/five-option delivery contract and reports `DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING`.

This is intentionally weaker than chapter-level exam calibration: the Percentage runtime still has not proved Punjab- or banking-specific CP/QL selection merely because its delivered option count is correct.

## Why this does not close Punjab propagation

Transport and public delivery are now enforceable, but chapter-specific content selection remains a separate concern. This checkpoint does not claim that Arithmetic content distribution is Punjab-calibrated.

Remaining remediation includes:

1. retrofit chapter adapters/runtimes to consume the request-scoped shared profile where exam-specific selection behavior is evidence-backed;
2. add a real Probability `PUNJAB_STATE` chapter profile when source evidence supports its exact scope;
3. bridge remaining specialized routes such as standard Mensuration where appropriate;
4. then consolidate Punjab real-exam simulation onto genuine `PUNJAB_STATE` selection and rerun section-level calibration.
