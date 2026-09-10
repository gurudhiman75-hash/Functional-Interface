# Quant V4 Probability Punjab Evidence Gate — P2

Authority: `PRB-PUNJAB-PROFILE-EVIDENCE-GATE-P2`

## Decision

`PUNJAB_STATE` is a valid shared Quant exam profile, but Probability does not yet have enough Punjab-specific source evidence to define a defensible chapter-level CP / solve-mode / difficulty / representation contract.

This checkpoint therefore does **not** copy the SSC Probability profile into Punjab and does **not** silently fall back to Generic Practice.

Punjab Probability is explicitly:

`EVIDENCE_GATED`

## Runtime behavior

Requests for `PRB-001` or `PRB-002` with `examProfile: "PUNJAB_STATE"` fail closed with:

- error name: `ProbabilityPunjabProfileEvidenceError`
- code: `PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED`
- HTTP-style status: `409`
- authority: `PRB-PUNJAB-PROFILE-EVIDENCE-GATE-P2`

The same gate also applies if `PUNJAB_STATE` is supplied through the legacy cockpit/runtime-mode field.

No SSC or generic fallback is allowed.

## Package discovery

Probability Question Studio package cards expose:

- `evidenceGatedExamProfiles: ["PUNJAB_STATE"]`
- the complete `punjabProfileGate` metadata

This makes the limitation discoverable instead of allowing a profile request to fail later through an undefined profile lookup.

## Evidence required to unlock generation

Before `PUNJAB_STATE` may become a real Probability chapter profile, the audit requires:

1. Punjab exam-family Probability observations with identifiable exam/paper provenance;
2. enough CP / solve-mode coverage to justify an allowed-content contract;
3. difficulty and representation evidence sufficient to avoid copying SSC behavior by assumption.

Exact minimum evidence thresholds remain governed by the Quant V4 PYQ-frequency evidence authority rather than being invented in this chapter gate.

## Existing profiles remain unchanged

SSC CGL/CHSL and Banking Probability continue to use their current native chapter profile machinery. Banking Prelims remains five-option and SSC remains four-option.

## Readiness effect

This improves correctness of the Punjab real-exam audit but does not make Punjab Probability ready. The simulator must continue reporting Probability as a capability/evidence gap until real Punjab evidence is normalized and adopted.
