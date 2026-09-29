# WHI-001-CP008 — Architecture and review status

**Checkpoint:** The First World War and the Russian Revolutions  
**Current state:** Complete English pool (60/60); editorial review requested; not registered in Question Studio.  
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- **Source authority:** nine-source register covering prewar alliances and crises, declarations, the Russian Revolutions, major fronts, the armistice, and the peace settlement.
- **Canonical facts:** 60 stable `WHI-CP008-F001`–`F060` records with source IDs, locators and tested relationships.
- **Question families:** ten explicit families with coverage-based counts shown in `WHI-001-CP008-QL-FAMILY-MAP-V1.md`.
- **Question layer:** shared `knowledge-v1` records with stable IDs, fact links, keyed options, difficulty, family, explanation, source IDs and review/runtime flags.
- **Validation and review:** contract test checks IDs, option integrity, fact/source parity, difficulty and answer distributions, unique stems, and review-only status. The English review artifact is generated from the same pool.
- **Question Studio:** remains unregistered until English review is approved and native Hindi/Punjabi overlays pass parity and route checks through the existing WHI adapter.

## Current gate

- English: 60 records; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15.
- Hindi and Punjabi have not yet been authored.
- No runtime registration, learner-bank writes, scoring, mock delivery or public release is enabled.

## Review artifacts

- `WHI-001-CP008-EN-REVIEW-V1.md` — full English review pool.
- `WHI-001-CP008-SOURCE-AND-COVERAGE-PLAN.md` — source register and coverage ownership.
- `WHI-001-CP008-CANONICAL-FACTS-Q001-060-V1.json` — canonical fact authority.
- `world-history-cp008-en-v1.json` — shared English record shape, review-only.
- `WHI-001-CP008-QL-FAMILY-MAP-V1.md` — family crosswalk and allocation.
- `knowledge-v1-whi008-review-v1.test.ts` — pool contract checks.
