# TRG-002 · TRG-CP-007 Localization Status

Status: **HINDI/PUNJABI LOCALIZATION V1 IMPLEMENTED — CI PENDING — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

## Scope

First controlled localization slice for `TRG-002 — Heights & Distances Applications`:

- CP: `TRG-CP-007 — Single-Observation Elevation & Depression`
- permanent English QLs covered: `TRG-002-QL-001...024`
- English source count: **24**
- Hindi learner surfaces: **24**
- Punjabi learner surfaces: **24**
- designated bilingual review records: **48**

## Source authority

Localization is layered over the human-approved frozen English production runtime.

Source checkpoint used to create the localization branch:

`2cb99f2af8d892837f624ff51e64d2c22e7cd30c`

The localization layer does not rewrite English stems, answers, option semantics, canonical spatial state, validation geometry or solution diagrams.

## V1 architecture

`localization-cp007-v1.ts` renders learner-facing Hindi/Punjabi text from the frozen canonical spatial state rather than doing blind string replacement.

It covers the six CP007 mathematical families:

- height from elevation;
- distance from elevation;
- angle from clean height-distance relation;
- height from depression;
- distance from depression;
- reverse single-observation / sight-line forms.

Every localized instance carries:

- canonical semantic fingerprint;
- localized-surface fingerprint;
- frozen-English source declaration;
- explicit human-language-review requirement;
- `multilingualFreezeGranted: false`;
- `productDeliveryUnlocked: false`.

## Governance boundary

Localized Hindi/Punjabi records are **REVIEW CANDIDATE V1**, not frozen production content.

Still OFF:

- multilingual freeze;
- Hindi/Punjabi runtime activation;
- Question Studio discovery;
- Test Builder eligibility;
- question-bank storage;
- public publication;
- automatic product delivery.

English remains independently frozen and governed by the existing 96-QL freeze gates.

## V1 verification target

The dedicated gate executes:

- frozen English 96-QL approval/fingerprint verification;
- 24 CP007 QLs × 12 deterministic seeds × 2 locales = **576 localization parity cases**;
- exact answer equality;
- option semantic equality;
- correct-index equality;
- canonical spatial-state equality;
- solution-diagram and diagram-evidence equality;
- Devanagari/Gurmukhi learner-text presence;
- English stem-fragment leak checks;
- localization lifecycle/activation locks;
- deterministic 48-record Hindi/Punjabi human-review pack export.

## Human review

Human language review: **PENDING**.

The review artifact is deliberately bilingual and pairs one designated Hindi and Punjabi instance for every one of the 24 CP007 QLs. Approval of this slice must be explicit and does not automatically approve CP008, CP009 or CP010.

## Next checkpoint

Obtain a green dedicated localization workflow, inspect the 48-record review artifact, remediate any Hindi/Punjabi editorial issues found, then request explicit human-language approval for CP007 before any multilingual freeze. After CP007 is stable, continue localization with CP008.
