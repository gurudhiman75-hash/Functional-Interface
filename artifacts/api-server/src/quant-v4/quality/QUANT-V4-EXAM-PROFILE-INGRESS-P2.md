# Quant V4 Shared Exam Profile Ingress — P2

Authority: `QUANT-V4-EXAM-PROFILE-INGRESS-P2`

## Purpose

The Quant V4 public generation entry point previously inherited the legacy Probability-specific `examProfile` type. That prevented the public Question Studio contract from representing the shared central profile authority, including `PUNJAB_STATE`.

This checkpoint widens the public Quant generation request to the shared `QuantV4ExamProfileId` contract and carries the validated profile through the generation call stack using request-scoped async context.

## What is now true

- `PUNJAB_STATE`, SSC, banking and generic profiles are valid at public Quant generation ingress.
- Unknown profile IDs fail closed against the central profile authority.
- The requested profile is available request-safely to downstream core/specialized runtimes through `getCurrentQuantV4ExamProfileId()` / `getCurrentQuantV4ExamProfileContract()` without global-state leakage.
- Concurrent requests with different profiles remain isolated.
- Requested family, delivery style and expected option count are recorded in `generationContext`.
- Questions and question packages carry requested-profile audit traceability.
- Downstream application is distinguished from transport availability.

Transport states:

- `APPLIED_DOWNSTREAM` — the generated runtime output itself exposes the requested profile.
- `INGRESS_ACCEPTED_DOWNSTREAM_PENDING` — the profile was validated and is available in request-scoped downstream context, but the selected chapter has not yet proved it used that profile for its own selection/delivery rules.

## Current evidence

Probability already has a chapter-level profile mechanism for its existing SSC/banking profiles. Those routes therefore prove `APPLIED_DOWNSTREAM`, including four-option SSC and five-option banking delivery.

`PCT-001` with `PUNJAB_STATE` proves the remaining boundary precisely: the public request accepts the central Punjab profile and carries it through downstream request context, but PCT-001 still reports `INGRESS_ACCEPTED_DOWNSTREAM_PENDING` because its chapter logic has not yet opted into profile-specific selection/delivery.

## Why this does not close Punjab propagation

Transport is now available throughout the call stack, but transport and chapter behavior are intentionally separate concerns. This checkpoint does not claim that Arithmetic content distribution is already Punjab-calibrated.

The next remediation is therefore smaller and safer than changing every legacy signature:

1. retrofit chapter adapters/runtimes to consume the request-scoped shared profile where exam-specific behavior is required;
2. add a real Probability `PUNJAB_STATE` chapter profile;
3. bridge the remaining specialized routes such as standard Mensuration;
4. then consolidate Punjab real-exam simulation onto genuine `PUNJAB_STATE` delivery and rerun section-level calibration.
