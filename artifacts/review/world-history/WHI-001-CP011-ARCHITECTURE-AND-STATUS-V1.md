# WHI-001-CP011 — Architecture and review status

**Checkpoint:** United Nations and Post-war Institutions
**Current state:** English pool complete (60/60); editorial review requested; not registered in Question Studio.
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- Source-backed fact authority with stable IDs and registered source URLs.
- Ten documented QL family values linked to the full pool.
- Existing `knowledge-v1` record shape, including options, correct key, difficulty, family, sources and lifecycle flags.
- Contract test checks pool size, IDs, fact/source parity, key and difficulty balance, option integrity and review-only status.
- Hindi/Punjabi authorship and Question Studio binding follow English approval and native-language parity review.

## Current gate

- English: 60 questions; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15.
- Hindi and Punjabi are not yet authored.
- No runtime registration or learner delivery is enabled.

## Artifacts

- `WHI-001-CP011-EN-REVIEW-V1.md`
- `WHI-001-CP011-SOURCE-AND-COVERAGE-PLAN.md`
- `WHI-001-CP011-CANONICAL-FACTS-Q001-060-V1.json`
- `WHI-001-CP011-QL-FAMILY-MAP-V1.md`
- `world-history-cp011-en-v1.json`
- `knowledge-v1-whi011-review-v1.test.ts`
