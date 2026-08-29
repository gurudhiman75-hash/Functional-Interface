# SPA PFC-001 / TPF-001 Question Studio Integration V1 - Status

## Integrated scope

PFC-001 and TPF-001 are connected to the shared SPA-001 Question Studio lifecycle as SPA-QL-035..040. The existing SPA-QL-001..034 authorities remain frozen and addressable, giving SPA-001 a combined 40 permanent QLs.

PFC/TPF uses the existing Spatial admin API route, review-run persistence, shared Question Studio review flow, approval converter and Question Bank handoff. No chapter-specific downstream store or approval bypass was introduced. Manual generated-item approval remains required and automatic student publication remains disabled.

Permanent ownership:

- SPA-QL-035 — axial and repeated-fold unfolding
- SPA-QL-036 — compound multi-axis / multi-fold unfolding
- SPA-QL-037 — diagonal and corner-fold unfolding
- SPA-QL-038 — multiple-cut and cut-topology unfolding
- SPA-QL-039 — reverse fold-and-punch inference
- SPA-QL-040 — transparent pattern superposition
- next free Spatial ID — SPA-QL-041

## Frozen learner authorities

- English learner surface: PFC-TPF-FINAL-COMBINED-ENGLISH-REVIEW-V1.2
- Hindi/Punjabi localization: PFC-TPF-HI-PA-LOCALIZATION-FREEZE-V2, editorial revision V2.1
- Permanent allocation: SPA-FND-001-PERMANENT-QL-ALLOCATION-V4
- Seeded runtime: PFC-TPF-QUESTION-STUDIO-SEEDED-RUNTIME-V1
- Editorial runtime layer: PFC-TPF-QUESTION-STUDIO-EDITORIAL-V1.1
- Visual direction remediation: PFC-TPF-QUESTION-STUDIO-VISUAL-DIRECTION-REMEDIATION-V1
- Product-owner approval: PFC-TPF-QUESTION-STUDIO-PRODUCT-OWNER-APPROVAL-V1

The approved English corpus contains 84 canonical archetypes: 72 source-backed core and 12 controlled novel. Hindi and Punjabi each retain 84 localized learner items. Geometry, option order, answer authority, canonical identity, provenance and representation invariants remain pinned through localization and integration.

## Transparent-fold V1.3 remediation

The V1.2 seeded Question Studio surface was CI-green but rejected in operator visual audit because SPA-QL-040 omitted the moving-side/fold-direction cue in the stimulus.

V1.3 adds a stimulus-only direction arrow while leaving the exact solver, options, answers, canonical anchor and localized learner text unchanged:

- vertical POSITIVE fold — left to right
- horizontal POSITIVE fold — bottom to top
- SPA-QL-035..039 unchanged by the visual remediation wrapper
- direction cue never appears in answer options

Reviewed V1.3 evidence:

- reviewed head: 48f6a46a42683d11279201b6ce7b5e38917ac4a6
- workflow: Validate SPA PFC TPF Question Studio Operator Review V1.3
- run: 32825848760 — SUCCESS
- artifact: 9555142851
- digest: sha256:85c10e6ad24ae0dddfa5d9b56ffac3f60541073fc7829aa2dbe474880bf4377c

## Product-owner approval

On 2026-08-26 at 07:40 IST the product owner explicitly approved the V1.3 reviewed learner surface and authorized standard Question Studio integration for SPA-QL-035..040.

Approval covers standard Question Studio registration, persistence into review runs, and downstream Question Bank/test eligibility after manual generated-item approval.

Approval does not cover automatic approval of future generated items, automatic student publication, merge or deployment. Manual review/approval remains required for every generated item.

## Standard 40-QL integration

Integration authority: SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V3-PFC-TPF

The shared Spatial package now exposes 40 permanent QLs and adds PFC-001 and TPF-001 to the normal Spatial chapter filters. SPA-QL-035..040 route through the approved exact-solver runtime, editorial V1.1 layer and V1.3 visual remediation wrapper.

The existing /admin/question-studio/reasoning/spatial/* API contract is retained. Review-run persistence is enabled through the standard Question Studio lifecycle. After manual approval, Question Bank conversion and normal test/public/mock eligibility use the existing Spatial release policy. Automatic student publication remains false.

Question Bank conversion was hardened only for the safe static SVG structures required by PFC/TPF. Active SVG content remains prohibited.

## Validated implementation head

Implementation head 8592521ca86771d1ff9666614de42fb5e9bbf2ab passed the exact integration, integrated-admin and legacy-compatibility gates.

Focused 40-QL integration:

- workflow: Validate SPA PFC TPF Standard Question Studio Integration V1
- run: 32930367931 — SUCCESS
- artifact: 9593028557
- digest: sha256:b5c5e8851421b38ecc1feba929d719cee1f65d8a2f19a342bfd9c49d96291677

This gate includes API build, complete admin typecheck/build, all 6 PFC/TPF QLs across English/Hindi/Punjabi through real Question Bank normalization, chapter/batch checks, a full 40-QL batch check and evidence upload.

Integrated admin:

- workflow: Validate integrated admin panel
- run: 32930368167 — SUCCESS

Canonical admin and Question Studio gates, API build, RBAC/content rules, complete admin tests/build, student build and single-site hosting assembly all passed.

Legacy 34-QL compatibility:

- workflow: Validate SPA-FND-001 Question Studio Integration V1
- run: 32930368031 — SUCCESS
- artifact: 9593014305
- digest: sha256:a0dc67c697d231925ef8551af096fb33661cf2ce423bbadfa984512941ad4013

The compatibility proof executes 102 multilingual frozen-runtime checks and 34 Question Bank conversion checks. It validates that the old 34-QL runtime remains available while the live admin surface is intentionally superseded by the approved 40-QL UI.

## Current lifecycle

```text
source-backed + controlled-novel discovery: GREEN
final English learner review V1.2:          GREEN + PRODUCT OWNER APPROVED
permanent QL allocation V4:                GREEN
permanent English runtime V3:              GREEN
English freeze V2:                         GREEN
Hindi/Punjabi localization V2.1:           FROZEN + PRODUCT OWNER APPROVED
seeded Question Studio runtime V1:         IMPLEMENTED
operator review V1.2:                      CI GREEN / OPERATOR VISUAL REJECTED
visual direction remediation V1:           GREEN
operator review V1.3:                      EXACT-HEAD CI GREEN + PRODUCT OWNER APPROVED
standard 40-QL integration:                VALIDATED
legacy 34-QL compatibility:                GREEN
Question Studio registration 035..040:      VALIDATED
review-run persistence 035..040:            VALIDATED
manual generated-item approval:            REQUIRED
Question Bank conversion after approval:   VALIDATED
test/public/mock eligibility after approval: STANDARD RELEASE POLICY
automatic student publication:             false
merge/deployment:                           NOT AUTHORIZED
```

## Current boundary

PR #870 remains open against New-main. The implementation is validated and this documentation-only status commit pins the integration evidence. No learner/runtime/persistence/UI behavior is changed by this status file.

## Next gate

FINAL_HEAD_PFC_TPF_QUESTION_STUDIO_CI_THEN_SEPARATE_MERGE_DECISION
