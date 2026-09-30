# WHI-001-CP013 — Architecture and review status

**Checkpoint:** Decolonization in Africa
**Current state:** English, Hindi and Punjabi pools complete (60/60 per language); approved for Question Studio review runs.
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- Blueprint scope and source authority register.
- 60 stable canonical fact IDs linked one-to-one to tested questions and source IDs.
- Ten coverage-led QL question families documented in a family map.
- Existing `knowledge-v1` record shape: stable IDs, language, difficulty, family, four keyed options, explanation, source IDs and lifecycle flags.
- English review rendering and contract test accompany the pool.

## Current gate

- English: 60 questions; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15. First-pass editorial corrections are documented; user approval received to proceed with localization.
- Hindi and Punjabi localization review files were approved by the user on 2026-09-30.
- Registered as a standard `knowledge-v1` Question Studio review-only package (`WHI-001-CP013`). The pools are selectable by package ID, checkpoint, question ID, or checkpoint subtopic.
- The standard lifecycle remains in force: no Question Bank writes, test eligibility, mock-test eligibility, automatic student publication, or production release.


## Editorial update — 2026-09-30

The English pool received a first-pass editorial review and focused corrections. English editorial pool approved for localization; native-language review, Question Studio registration and learner delivery remain gated. See `WHI-001-CP011-CP014-EN-EDITORIAL-REVIEW-V1.md` and `WHI-001-CP011-CP014-EN-EDITORIAL-READINESS-V1.md`.


## Localization update — 2026-09-30

Hindi and Punjabi pools each contain 60 review-only records in the existing `knowledge-v1` architecture. Stable English question, checkpoint, fact and source references, option order, correct-answer keys, difficulty and source trail are preserved. Native-language review was approved on 2026-09-30. The shared Question Studio adapter now exposes the approved pools for review runs. Source records remain `reviewOnly: true` and `runtimeRegistered: false`; the review-only lifecycle blocks Question Bank writes and learner delivery.

- Hindi data: `world-history-cp013-hi-v1.json`; review: `WHI-001-CP013-HI-LOCALIZATION-REVIEW-V1.md`.
- Punjabi data: `world-history-cp013-pa-v1.json`; review: `WHI-001-CP013-PA-LOCALIZATION-REVIEW-V1.md`.
