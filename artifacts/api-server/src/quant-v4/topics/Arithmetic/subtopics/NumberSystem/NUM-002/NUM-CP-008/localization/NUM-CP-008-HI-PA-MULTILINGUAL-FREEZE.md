# NUM-CP-008 Hindi/Punjabi multilingual freeze

Status: **MULTILINGUAL FREEZE PROMOTED; EXACT-HEAD CI REQUIRED FOR FINAL CERTIFICATION**

Canonical authority:
- permanent range: `NUM-QL-166..NUM-QL-184`
- next free Number System identity: `NUM-QL-185`
- English authority remains `ENGLISH_FROZEN`
- no new QL identities are allocated by localization

## Architecture

The frozen learner runtime is `localization/runtime-human-final.ts`.

It wraps the review-stage bilingual adapter and preserves:
- frozen hidden mathematical state;
- mathematical fingerprint;
- source/prototype ancestry;
- option order and correct index;
- option correctness and misconception IDs;
- canonical/verifier answer binding.

Only learner-facing Hindi/Punjabi wording is polished. The underlying review adapter remains explicitly marked `MULTILINGUAL_REVIEW_CANDIDATE / HI_PA_REVIEW_CANDIDATE` so the promotion boundary stays auditable. The human-final runtime is promoted to:
- `MULTILINGUAL_FROZEN`
- `HI_PA_FROZEN`

## Pre-freeze executable evidence

Green review head: `74f42eab567c892071348f3e38c0896548d47f5b`

Workflow run: `32278377833` — SUCCESS

Evidence artifact:
- ID: `9374863908`
- name: `num-002-cp008-hi-pa-rule-first-review`
- digest: `sha256:6c9ae29e831ae0650711c528a1066448e5897d45cf210b362dd9db19bc39597a`

Proofs on that head:
- frozen English regression: **2,280 packages**;
- bilingual semantic/language parity: **4,560 packages**;
- human-final structural parity/wording audit: **4,560 packages**;
- advanced manual-review samples: compatible CRT, complete bounded set, Data Sufficiency, bounded multiplicity in both languages;
- all downstream lifecycle activations: **0**.

Editorial remediation before promotion included ambiguous modular-reduction wording and Data Sufficiency singular/plural/conclusion wording. Final inspected Hindi/Punjabi Data Sufficiency samples are natural and mathematically bound to the frozen answer.

## Final certification rule

The promotion commit itself must pass the same dedicated localization workflow on its exact head. That final run must prove `MULTILINGUAL_FROZEN / HI_PA_FROZEN` for all 4,560 human-final packages while keeping every downstream product flag closed.

## Lifecycle locks

Multilingual freeze does **not** authorize product release:
- active: false
- Question Studio discoverable: false
- Question Bank writable: false
- test/mock eligible: false
- publicly publishable: false

Question Studio integration remains a separate governance gate.
