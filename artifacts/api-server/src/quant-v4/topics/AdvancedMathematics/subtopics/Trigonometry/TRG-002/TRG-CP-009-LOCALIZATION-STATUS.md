# TRG-002 · TRG-CP-009 Localization Status

Status: **HINDI/PUNJABI LOCALIZATION V1 IMPLEMENTED — CI PENDING — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

## Scope

Third controlled localization slice for `TRG-002 — Heights & Distances Applications`:

- CP: `TRG-CP-009 — Same-Side Multiple Observations & Movement`
- permanent English QLs covered: `TRG-002-QL-049...072`
- English source count: **24**
- Hindi learner surfaces: **24**
- Punjabi learner surfaces: **24**
- designated bilingual review records: **48**

## Canonical rendering coverage

Learner wording is rendered from frozen canonical geometry and solve-mode authority for:

- same-side two observations;
- observer moves closer;
- observer moves farther;
- original-distance recovery;
- movement / point-separation recovery;
- controlled comparison of two separate objects from one observation point.

A render-only compatibility projection normalizes legacy generic `requested` fields from the already-frozen `solveMode` where needed. The exact canonical spatial state is restored before return and remains part of the unchanged semantic fingerprint.

## Verification target

Dedicated workflow: `Verify TRG-002 CP009 Localization V1`.

Required gates:

- targeted Trigonometry TypeScript compile;
- frozen English 96-QL approval/fingerprint gate;
- **24 CP009 QLs × 12 deterministic seeds × 2 locales = 576 localization parity cases**;
- all six CP009 frozen family coverage;
- exact answer / option semantic / correct-index equality;
- canonical spatial-state equality;
- solution-diagram and diagram-evidence equality;
- Devanagari/Gurmukhi learner-text presence;
- English stem-fragment leak checks;
- deterministic localization fingerprints;
- lifecycle and activation locks;
- deterministic 48-record bilingual human-review pack export.

## Governance boundary

Hindi/Punjabi are **REVIEW CANDIDATE V1** only. Human language review, multilingual freeze, localized runtime activation, Question Studio discovery, Test Builder eligibility, bank storage, public publication and product delivery remain OFF.

## Next checkpoint

Obtain a green dedicated CP009 workflow, inspect/remediate the 48-record review artifact, then advance to CP010 while all localized slices remain independently human-review gated.
