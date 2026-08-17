# TRG-002 · TRG-CP-007 Localization Status

Status: **HINDI/PUNJABI LOCALIZATION V1 IMPLEMENTED — SEMANTIC PARITY PASS — REVIEW PACK READY — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

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

## Green verification checkpoint

Verified source head:

`17d9b8b7e4832b1200afb540ddd0ac049e0bc870`

Workflow run:

`32034210819` — `Verify TRG-002 CP007 Localization V1` — **SUCCESS**

Passed:

- targeted Trigonometry TypeScript compile;
- frozen English **96 / 96** approval/fingerprint gate;
- **24 CP007 QLs × 12 deterministic seeds × 2 locales = 576 localization parity cases**;
- exact-answer equality;
- option semantic equality;
- correct-index equality;
- canonical spatial-state equality;
- solution-diagram and diagram-evidence equality;
- Devanagari/Gurmukhi learner-text presence;
- English stem-fragment leak checks;
- localization lifecycle/activation locks;
- deterministic **48-record** Hindi/Punjabi human-review pack export and verification.

Review artifact:

- name: `trg-002-cp007-hi-pa-localization-review-v1`
- id: `9290028436`
- digest: `sha256:4bbd3d1b568115d476f3e562e72c19406b7d05f960fa6a8418f36f816d1b6fd3`

The first two failed CI attempts exposed an incorrect assumption that every frozen proof projection must expose a target vertical-object record. The final localizer removes that dependency: numeric learner wording is derived directly from canonical points/angles, while object type is only presentation metadata. The English freeze gate remained green throughout.

## Governance boundary

Localized Hindi/Punjabi records are **REVIEW CANDIDATE V1**, not frozen production content.

Current state:

- English source: **HUMAN-APPROVED + FROZEN**
- Hindi/Punjabi semantic parity: **PASS**
- Hindi/Punjabi human language review: **PENDING**
- multilingual freeze: **NOT GRANTED**
- product delivery: **LOCKED**

Still OFF:

- Hindi/Punjabi runtime activation;
- Question Studio discovery;
- Test Builder eligibility;
- question-bank storage;
- public publication;
- automatic product delivery.

## Human review

Human language review: **PENDING**.

The review artifact pairs one designated Hindi and Punjabi instance for every one of the 24 CP007 QLs. Approval of this slice must be explicit and does not automatically approve CP008, CP009 or CP010.

## Next checkpoint

Review/remediate the 48 bilingual records, then request explicit human-language approval for CP007 before any multilingual freeze. CP008 localization can proceed as the next implementation slice while CP007 remains review-gated.
