# WHI-001-CP012 — Architecture and review status

**Checkpoint:** Decolonization in Asia and the Middle East
**Current state:** English pool complete (60/60); first-pass editorial review complete; not registered in Question Studio.
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- Blueprint scope and source authority register.
- 60 stable canonical fact IDs linked one-to-one to tested questions and source IDs.
- Ten coverage-led QL question families documented in a family map.
- Existing `knowledge-v1` record shape: stable IDs, language, difficulty, family, four keyed options, explanation, source IDs and lifecycle flags.
- English review rendering and contract test accompany the pool.

## Current gate

- English: 60 questions; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15. First-pass editorial corrections are documented; user approval received to proceed with localization.
- Hindi and Punjabi review candidates are drafted; native-language review remains pending.
- `reviewOnly: true`; `runtimeRegistered: false` for every item.


## Editorial update — 2026-09-30

The English pool received a first-pass editorial review and focused corrections. English editorial pool approved for localization; native-language review, Question Studio registration and learner delivery remain gated. See `WHI-001-CP011-CP014-EN-EDITORIAL-REVIEW-V1.md` and `WHI-001-CP011-CP014-EN-EDITORIAL-READINESS-V1.md`.


## Localization update — 2026-09-30

Hindi and Punjabi pools each contain 60 review-only records in the existing `knowledge-v1` architecture. Stable English question, checkpoint, fact and source references, option order, correct-answer keys, difficulty and source trail are preserved. Every localized record has `reviewOnly: true` and `runtimeRegistered: false`. Native-language review is pending; no learner delivery is enabled.

- Hindi data: `world-history-cp012-hi-v1.json`; review: `WHI-001-CP012-HI-LOCALIZATION-REVIEW-V1.md`.
- Punjabi data: `world-history-cp012-pa-v1.json`; review: `WHI-001-CP012-PA-LOCALIZATION-REVIEW-V1.md`.
