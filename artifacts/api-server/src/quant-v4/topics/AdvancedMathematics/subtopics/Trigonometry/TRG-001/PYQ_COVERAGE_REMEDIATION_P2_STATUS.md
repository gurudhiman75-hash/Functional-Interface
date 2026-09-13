# TRG-001 — PYQ Coverage Remediation P2

Status: **AUDIT CANDIDATE — NOT ACTIVATED — EXECUTION EVIDENCE PENDING**

Authority: `TRG-001-PYQ-COVERAGE-REMEDIATION-P2`

## Why this exists

The Quant V4 whole-section audit found a real SSC CGL trigonometric form that was not explicitly represented in the current 144-QL TRG-001 authority surface:

`(sin³A − cos³A)/(sin A − cos A)`

The intended solution uses:

1. `a³−b³=(a−b)(a²+ab+b²)`;
2. cancellation of `sin A−cos A` under the stated non-zero-domain condition;
3. `sin²A+cos²A=1`;
4. final result `1+sin A cos A`.

This is anchored to the normalized SSC CGL 2024-09-09 Shift 2 Quant observation.

## Remediation decision

Do **not** grow TRG-001 beyond 144 permanent QLs.

Candidate permanent role: `TRG-001-QL-143`, inside the already locked `QL-142...144` `EQUIVALENCE_VERIFICATION_COMPOSITE` family.

Reason:

- `QL-142` is already a separately hardened composite-equivalence role;
- `QL-144` owns a double-angle equivalence role;
- the existing `QL-143` surface is another Pythagorean/reciprocal composite and overlaps more heavily with identity coverage already present earlier in TRG-001;
- replacing that role preserves the 144-ID envelope and does not move the QL outside its locked CP-006 terminal composite family.

## Candidate implementation

Added audit overlay:

- `pyq-coverage-remediated-runtime-p2.ts`
- `pyq-coverage-remediated-runtime-p2.test.ts`

The overlay changes only `TRG-001-QL-143`. All other QLs delegate directly to the existing authority candidate.

New solve mode:

`simplifyTrigDifferenceOfCubes`

Difficulty: `Medium`

Target: `RELATION`

The candidate provides two compact SSC-style stem surfaces, four unique options, misconception-based distractors, a three-step beginner-readable explanation, an explicit domain restriction, and symbolic independent-verification metadata.

## Surgical-change guard

The regression test explicitly checks that `QL-142` and `QL-144` remain identical to the current authority candidate for sampled seeds.

The remediation does not change:

- package ID;
- CP allocation;
- total QL count;
- Question Studio discovery;
- test-builder eligibility;
- question-bank storage;
- public publication;
- production-frequency authorization.

## Evidence still required

The new regression file is committed but has **not been executed in this chat environment**.

Therefore this checkpoint does not claim:

- TypeScript compile pass;
- runtime test pass;
- production-authority gate pass;
- CI pass;
- human approval.

## Next audit step

Continue the external-realism matrix across the remaining TRG observations and inspect stem/distractor/explanation quality. If no stronger unique role is found for the old QL-143 surface, this remediation candidate should become the proposed permanent authority amendment before TRG-001 is refrozen.
