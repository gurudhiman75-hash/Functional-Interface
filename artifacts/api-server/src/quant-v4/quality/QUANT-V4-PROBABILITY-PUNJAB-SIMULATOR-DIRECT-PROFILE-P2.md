# Quant V4 Probability Punjab Simulator Direct Profile — P2

Status: implementation checkpoint

## Change

The real-exam simulator now resolves Probability slots for `PSSSB`, `PPSC`, and `PUNJAB_POLICE` directly to `PUNJAB_STATE`.

The historical `SSC_CGL_CHSL` fallback and the Probability integration's seed-based simulator compatibility detector are removed.

## Fail-closed behavior

`PUNJAB_STATE` Probability remains evidence-gated. Simulator slots therefore become explicit capability gaps with `PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED` until a native Punjab Probability selection contract is supported by normalized evidence.

No Punjab CP, solve-mode, difficulty, representation, or generation-selection weights are introduced by this checkpoint.

## Regression contract

The executable proofs require that:

- all three Punjab simulator profiles resolve Probability to `PUNJAB_STATE`;
- Punjab Probability slots are capability gaps rather than SSC-generated questions;
- an explicitly requested SSC profile remains SSC regardless of seed text;
- direct and runtime-mode Punjab requests remain blocked by the evidence gate;
- existing SSC and Banking Probability controls retain their native option/profile behavior;
- the wider Punjab simulator remains not fully propagated until its other downstream chapter boundaries are reconciled.
