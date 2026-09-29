# WHI-001-CP010 — Architecture and review status

**Checkpoint:** Second World War
**Current state:** English pool complete (60/60); editorial review requested; not registered in Question Studio.
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- **Source authority:** eleven-source register using museum, archive, presidential-library and diplomatic-history material.
- **Canonical facts:** 60 stable `WHI-CP010-F001`–`F060` claims linked to the tested question and source IDs.
- **Question-family layer:** ten family values, with coverage-based allocation documented in the QL map.
- **Question layer:** existing `knowledge-v1` record shape with stable IDs, fact links, keyed options, difficulty, family, explanations and lifecycle flags.
- **Validation/review:** contract test checks the complete English pool and source parity; review markdown is rendered from the same records.
- **Question Studio:** remains gated until English approval and Hindi/Punjabi native-language and parity review.

## Current gate

- English: 60 questions; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15.
- Hindi and Punjabi are not yet authored.
- No runtime registration or learner delivery is enabled.

## Artifacts

- `WHI-001-CP010-EN-REVIEW-V1.md`
- `WHI-001-CP010-SOURCE-AND-COVERAGE-PLAN.md`
- `WHI-001-CP010-CANONICAL-FACTS-Q001-060-V1.json`
- `WHI-001-CP010-QL-FAMILY-MAP-V1.md`
- `world-history-cp010-en-v1.json`
- `knowledge-v1-whi010-review-v1.test.ts`
