# TRG-002 · TRG-CP-008 Localization Status

Status: **HINDI/PUNJABI LOCALIZATION V1 IMPLEMENTED — CI PENDING — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

## Scope

Second controlled localization slice for `TRG-002 — Heights & Distances Applications`:

- CP: `TRG-CP-008 — Shadows, Ladders, Broken Objects & Guy Wires`
- permanent English QLs covered: `TRG-002-QL-025...048`
- English source count: **24**
- Hindi learner surfaces: **24**
- Punjabi learner surfaces: **24**
- designated bilingual review records: **48**

## Source and transformation authority

Localization is layered over the human-approved frozen English 96-QL production runtime. It does not rewrite English stems, answers, exact answers, option semantics, correct positions, canonical spatial state, diagram evidence or solution diagrams.

`localization-cp008-v1.ts` renders learner-facing text from canonical geometry and locked solve families. It covers:

- shadow → height;
- height → shadow;
- changed shadow / changed solar angle;
- ladder against wall;
- broken tree/pole touching ground;
- guy-wire / mast / ground-anchor forms.

Changed-shadow questions use the canonical old/new shadow observations when present and reconstruct a missing prior shadow from the frozen height-angle relation when a production projection contains only the requested state. Ladder wording derives its standard angle from canonical geometry when the runtime does not store a redundant observation.

Every localized instance carries a canonical semantic fingerprint, a separate localization fingerprint, an explicit human-language-review requirement, `multilingualFreezeGranted: false` and `productDeliveryUnlocked: false`.

## Verification target

Dedicated workflow: `Verify TRG-002 CP008 Localization V1`.

It must pass:

- targeted Trigonometry TypeScript compile;
- frozen English 96-QL approval/fingerprint gate;
- **24 CP008 QLs × 12 deterministic seeds × 2 locales = 576 localization parity cases**;
- exact answer / option semantic / correct-index equality;
- canonical spatial-state equality;
- solution-diagram and diagram-evidence equality;
- all six CP008 family coverage;
- Devanagari/Gurmukhi learner-text presence;
- English stem-fragment leak checks;
- deterministic localization fingerprints;
- lifecycle and activation locks;
- deterministic 48-record bilingual human-review pack export.

## Governance boundary

Hindi/Punjabi are **REVIEW CANDIDATE V1** only.

Still OFF:

- human language approval;
- multilingual freeze;
- Hindi/Punjabi runtime activation;
- Question Studio discovery;
- Test Builder eligibility;
- question-bank storage;
- public publication;
- product delivery.

English remains independently human-approved and frozen.

## Next checkpoint

Obtain a green dedicated CP008 workflow, inspect/remediate the bilingual review artifact, and keep the slice review-gated until explicit human language approval. After implementation stability, proceed to CP009 without treating CP007/CP008 as multilingual-frozen.
