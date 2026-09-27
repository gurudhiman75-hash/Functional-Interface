# Quant V4 Real-Exam Punjab Profile Propagation Boundary — P2

Authority: `QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2`

## Current finding

The shared Quant V4 authority defines `PUNJAB_STATE` as a four-option `PUNJAB_STATE_OBJECTIVE` profile, and the composed real-exam simulator now carries that profile directly for:

- PSSSB
- PPSC
- Punjab Police

The old simulator metadata gap is closed:

- `centralDeliveryProfile: "PUNJAB_STATE"`
- `centralProfileGap: false`

The remaining issue is no longer profile transport. It is **chapter-level selection calibration** for routes that do not yet have enough Punjab PYQ evidence to justify distinct CP/QL/difficulty weights.

## Delivery versus selection

The current Question Studio stack intentionally separates two concepts.

### Delivery support

The shared Quant profile layer carries the selected exam profile and enforces the public option-count contract.

For Punjab State this means:

- four unique options;
- valid correct-index binding;
- `PUNJAB_STATE` delivery metadata;
- no silent fallback to Banking five-option delivery or another exam family.

AVG, MAL, NUM, SAP, TMW and older Arithmetic routes can therefore be delivery-correct even when their internal chapter selector is still generic.

### Selection calibration

A chapter is not considered Punjab-selection-calibrated until normalized Punjab observations support:

- CP/QL distribution;
- difficulty mix;
- representation mix;
- any profile-specific solve-mode restrictions.

Where that evidence is missing, the correct state is:

`DELIVERY_SUPPORTED_SELECTION_PENDING`

not `PROFILE_BLIND`.

## Current route state

### Real-exam simulator

**SUPPORTED**

PSSSB/PPSC/Punjab Police carry `PUNJAB_STATE` directly.

### Core Arithmetic delivery

**DELIVERY_SUPPORTED_SELECTION_PENDING**

The public Quant generation layer accepts the profile and applies the central delivery contract. Older chapter runtimes may still use generic CP/QL selection.

### Average / Mixture / legacy Arithmetic

**DELIVERY_SUPPORTED_SELECTION_PENDING**

These specialized exits use the shared request-scoped profile-delivery wrapper. Punjab delivery is correct; profile-specific selection remains evidence-gated.

### Mensuration

**SUPPORTED** for the real-exam surface.

The simulator now samples the full `MENSURATION` package. Its standard runtime accepts `examProfile` and maps Punjab requests to the native `PUNJAB_STATE` Mensuration profile. The older MEN-002 CP009-only route is no longer the simulator authority.

### Probability

**EVIDENCE_GATED**

Punjab Probability remains intentionally fail-closed. The simulator resolves the profile to `PUNJAB_STATE`, but PRB-001/PRB-002 reject native Punjab selection until attributable Punjab Probability evidence supports a CP/solve-mode/difficulty/representation contract.

No SSC fallback is allowed.

## Current readiness

Simulator profile propagation is now **ready**.

Punjab-specific chapter selection is still **pending** where evidence is insufficient.

Probability remains the only hard fail-closed profile capability in this boundary audit.

## Next work

1. Keep the current Punjab delivery path and four-option contract.
2. Normalize Punjab PYQ observations chapter by chapter.
3. Promote a chapter from selection-pending only when its evidence supports a profile-specific selector.
4. Implement native Punjab Probability selection only after its evidence gate is satisfied.
5. Continue section-level simulation after each chapter gains evidence-backed selection.

## Boundary

This checkpoint does not claim that PSSSB/PPSC/Punjab Police are frequency-calibrated. It only closes the transport/delivery gap and accurately isolates the remaining evidence-calibration work.
