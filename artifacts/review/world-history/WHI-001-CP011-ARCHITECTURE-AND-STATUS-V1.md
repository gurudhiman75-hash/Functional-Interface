# WHI-001-CP011 — Architecture and review status

**Checkpoint:** United Nations and Post-war Institutions
**Current state:** English, Hindi and Punjabi pools complete (60/60 per language); approved for Question Studio review runs.
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- Source-backed fact authority with stable IDs and registered source URLs.
- Ten documented QL family values linked to the full pool.
- Existing `knowledge-v1` record shape, including options, correct key, difficulty, family, sources and lifecycle flags.
- Contract test checks pool size, IDs, fact/source parity, key and difficulty balance, option integrity and review-only status.
- Hindi/Punjabi authorship and Question Studio binding follow English approval and native-language parity review.

## Current gate

- English: 60 questions; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15. First-pass editorial corrections are documented; user approval received to proceed with localization.
- Hindi and Punjabi localization review files were approved by the user on 2026-09-30.
- Registered as a standard `knowledge-v1` Question Studio review-only package (`WHI-001-CP011`). The English/Hindi/Punjabi pools are selectable by package ID, checkpoint, question ID, or checkpoint subtopic.
- The standard lifecycle remains in force: no Question Bank writes, test eligibility, mock-test eligibility, automatic student publication, or production release.

## Artifacts

- `WHI-001-CP011-EN-REVIEW-V1.md`
- `WHI-001-CP011-SOURCE-AND-COVERAGE-PLAN.md`
- `WHI-001-CP011-CANONICAL-FACTS-Q001-060-V1.json`
- `WHI-001-CP011-QL-FAMILY-MAP-V1.md`
- `world-history-cp011-en-v1.json`
- `knowledge-v1-whi011-review-v1.test.ts`


## Editorial update — 2026-09-30

The English pool received a first-pass editorial review and focused corrections. English editorial pool approved for localization; native-language review, Question Studio registration and learner delivery remain gated. See `WHI-001-CP011-CP014-EN-EDITORIAL-REVIEW-V1.md` and `WHI-001-CP011-CP014-EN-EDITORIAL-READINESS-V1.md`.


## Localization update — 2026-09-30

Hindi and Punjabi pools each contain 60 review-only records in the existing `knowledge-v1` architecture. Stable English question, checkpoint, fact and source references, option order, correct-answer keys, difficulty and source trail are preserved. Native-language review was approved on 2026-09-30. The shared Question Studio adapter now exposes the approved pools for review runs. Source records remain `reviewOnly: true` and `runtimeRegistered: false`; the review-only lifecycle blocks Question Bank writes and learner delivery.

- Hindi data: `world-history-cp011-hi-v1.json`; review: `WHI-001-CP011-HI-LOCALIZATION-REVIEW-V1.md`.
- Punjabi data: `world-history-cp011-pa-v1.json`; review: `WHI-001-CP011-PA-LOCALIZATION-REVIEW-V1.md`.
