# Quant V4 Real-Exam Advanced Mathematics Integration — P2

Authority: `QUANT-V4-REAL-EXAM-ADVANCED-MATH-INTEGRATION-P2`

## Purpose

The original real-exam simulation audit deliberately represented Algebra and Trigonometry as `CAPABILITY_GAP` records because the section adapters had not yet been integrated. The adapters are now merged and independently green, so this checkpoint closes that stale structural gap without rewriting the historical audit result.

## Integrated surface

For all six SSC/Punjab section profiles that contain Advanced Mathematics slots:

- SSC CGL Tier I
- SSC CGL Tier II
- SSC CHSL
- PSSSB
- PPSC
- Punjab Police

`ALGEBRA` and `TRIGONOMETRY` gap records are replaced deterministically by the merged Advanced Mathematics section adapter.

### Algebra

- SSC Tier I / CHSL use the Algebra `SSC_CORE` delivery profile.
- SSC Tier II uses `SSC_ADVANCED`.
- Punjab profiles use `PUNJAB_STATE`.
- The standard `BANK_ONLY` lifecycle is preserved.
- Manual Question Bank acceptance remains allowed where already authorized.
- Scored-test, mock and public/student release remain locked.

### Trigonometry

- deterministic TRG-001 / TRG-002 selection is preserved;
- four-option SSC/Punjab delivery is preserved;
- current internal test eligibility is preserved;
- public/student release remains locked.

## Punjab profile reconciliation

The central Quant V4 authority now contains a real `PUNJAB_STATE` profile with four-option `PUNJAB_STATE_OBJECTIVE` delivery. This integration records that authority explicitly.

The historical P2 simulator still carries `centralDeliveryProfile: null` for PSSSB/PPSC/Punjab Police and therefore does not yet pass `PUNJAB_STATE` into every ordinary core-slot generation call. This checkpoint does **not** hide that drift. It reports `simulatorCentralProfilePropagationPending: true` for those three profiles.

That is the next simulator-integration cleanup, separate from the now-closed Algebra/Trigonometry gap.

## Executable proof

The dedicated gate verifies:

- all six relevant exam profiles contain Advanced Mathematics slots;
- every historical Algebra/Trigonometry capability gap is replaced;
- zero Advanced Mathematics capability gaps remain in the integration surface;
- every integrated Advanced Mathematics question has four unique options;
- deterministic section replay;
- Algebra remains `BANK_ONLY` and test-ineligible;
- Trigonometry retains current internal test eligibility;
- public release stays locked for both;
- all three Punjab profiles resolve to the merged `PUNJAB_STATE` central authority;
- the historical simulator's remaining Punjab-profile propagation drift stays explicit rather than being marked complete prematurely.

## Readiness boundary

This checkpoint is not a declaration that any complete exam profile is simulation-ready. The broader real-exam audit still has independent blockers including empirical PYQ-frequency weighting, profile-specific lifecycle/test eligibility, repetition/editorial metrics and any remaining non-Advanced-Mathematics capability gaps.
