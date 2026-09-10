# Quant V4 Shared Exam Profile Ingress — P2

Authority: `QUANT-V4-EXAM-PROFILE-INGRESS-P2`

## Purpose

The Quant V4 public generation entry point previously inherited the legacy Probability-specific `examProfile` type. That prevented the public Question Studio contract from representing the shared central profile authority, including `PUNJAB_STATE`.

This checkpoint widens the public Quant generation request to the shared `QuantV4ExamProfileId` contract and makes profile transport observable.

## What is now true

- `PUNJAB_STATE`, SSC, banking and generic profiles are valid at the public Quant generation ingress.
- Unknown profile IDs fail closed against the central profile authority.
- The requested profile family, delivery style and expected option count are recorded in `generationContext`.
- Questions and question packages carry the requested profile and expected option count for audit traceability.
- Downstream application is distinguished from mere ingress acceptance.

Transport states:

- `APPLIED_DOWNSTREAM` — the generated runtime output itself exposes the requested profile.
- `INGRESS_ACCEPTED_DOWNSTREAM_PENDING` — the public engine accepted the shared profile, but the selected chapter route did not prove that it consumed it.

## Current evidence

Probability already has a chapter-level profile mechanism for its existing SSC/banking profiles, so those routes prove `APPLIED_DOWNSTREAM` and their four/five-option delivery remains visible.

`PCT-001` with `PUNJAB_STATE` proves the opposite boundary: the public request is accepted and the central Punjab contract is attached, but the core Arithmetic route still reports `INGRESS_ACCEPTED_DOWNSTREAM_PENDING` because the deeper core/chapter pipeline does not yet consume the shared profile.

## Why this does not close Punjab propagation

This is an ingress/observability checkpoint, not a claim that Arithmetic chapter selection is already Punjab-specific.

The next remediation remains:

1. thread the shared profile through the deeper core Arithmetic runtime contract;
2. retrofit specialized profile-blind chapter adapters;
3. add a real Probability `PUNJAB_STATE` chapter profile;
4. then consolidate Punjab real-exam simulation onto genuine `PUNJAB_STATE` delivery.
