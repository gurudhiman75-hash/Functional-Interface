# SPA FGC-001 Question Studio Integration V1 — Status

## Purpose

Connect the frozen `FGC-001 — Figure Completion` curriculum (`SPA-QL-031..034`) to the existing shared `SPA-001` Question Studio lifecycle without modifying the approved FGC geometry/content runtime or introducing an FGC-specific downstream store/workflow.

## Frozen source authorities

- P0 Spatial allocation remains frozen as `SPA-QL-001..030`.
- FGC English runtime authority: `FGC-001-ENGLISH-FREEZE-V1`.
- FGC Hindi/Punjabi authority: `FGC_001_HI_PA_LOCALIZATION_APPROVED_V1`.
- Combined allocation authority: `SPA-FND-001-PERMANENT-QL-ALLOCATION-V2` (`SPA-QL-001..034`).

## Integration architecture

- `SPA-001` remains the only package.
- FGC uses the same Spatial API route, review persistence, shared cockpit, approval converter and Question Bank handoff as P0.
- The FGC adapter consumes the frozen multilingual generator and renders its language-neutral scenes to SVG.
- Frozen FGC canonical IDs, answer, geometry, option order and content/delivery fingerprints are not rewritten by integration.
- Source FGC lifecycle remains review-only/not-registered; registration/persistence/downstream eligibility is applied only at the shared Question Studio adapter boundary.
- Manual approval remains required and automatic student publication remains disabled.

## Registered surface candidate

```text
Package:                   SPA-001
Permanent QLs:             SPA-QL-001..034
P0 frozen QLs:             30
FGC QLs:                    4
Chapters:                   MIR / WAT / FAN / FCL / FSR / FGC
Languages:                  English / Hindi / Punjabi
Question Studio:            REGISTERED / DISCOVERABLE
Review persistence:         standard shared lifecycle
Question Bank:              READY_FOR_STORAGE after manual approval
Test/mock eligibility:      standard shared lifecycle after approval
Automatic publication:      disabled
```

## Learner review surface

- FGC keeps its 384 px recommended stimulus review size rather than the old 150 px Spatial panel cap.
- Option mobile floor remains 104 px.
- Hindi/Punjabi explanation labels use the approved simple wording (`क्या देखें / नियम / कैसे लगाएँ / जाँच` and `ਕੀ ਵੇਖਣਾ / ਨਿਯਮ / ਕਿਵੇਂ ਲਗਾਉਣਾ / ਜਾਂਚ`).

## Validation gate

The existing `Validate SPA-FND-001 Question Studio Integration V1` workflow is extended to rebuild API/admin/student apps and revalidate:

1. MIR/WAT geometry regression;
2. frozen P0 allocation V1;
3. combined Spatial allocation V2;
4. frozen FGC English runtime;
5. frozen FGC Hindi/Punjabi runtime;
6. 34-QL standard Question Studio integration.

The integration proof exercises FGC in all three languages, deterministic replay, geometry/answer/fingerprint parity, standard Question Bank conversion, FGC chapter filtering, full 34-QL batch coverage, P0 dispatch non-regression and UI review sizing.

## Current truth

Implementation is a **candidate until exact-head CI passes**. No CI success, merge, production deployment or generated-item human approval is claimed by this file.

## Next gate

`EXACT_HEAD_CI_AND_HUMAN_QUESTION_STUDIO_REVIEW`
