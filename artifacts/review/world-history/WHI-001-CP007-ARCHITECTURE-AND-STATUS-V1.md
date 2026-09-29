# WHI-001-CP007 — Architecture and review status

**Checkpoint:** Imperialism, Colonialism and the Scramble for Africa  
**Current state:** Complete English pool (60/60); editorial review requested; not registered in Question Studio.  
**Lifecycle:** Review-only; no learner delivery.

## Reused chapter architecture

- **Timeline and source authority:** CP007 coverage map and 13-source register, including the Berlin General Act, diplomatic records, UNESCO, the German Historical Museum, the Adwa Memorial, the Australian War Memorial, UN material and national archives.
- **Canonical facts:** 60 stable facts `WHI-CP007-F001`–`F060`, each connected to the exact source IDs and the relationship tested.
- **Question families:** ten reviewed family contracts, six questions each; crosswalk in `WHI-001-CP007-QL-FAMILY-MAP-V1.md`.
- **Question layer:** existing `knowledge-v1` record fields and deterministic selectors remain the intended runtime contract.
- **Validation and review:** pool test covers schema, uniqueness, fact/source parity, family/difficulty/key balance, option integrity and unpublished flags. Review markdown is rendered from those same records.
- **Question Studio:** remains unregistered until the English pool is approved and the Hindi/Punjabi overlays pass native-language and parity gates.

## Current gate

- English: 60 records; 18 Easy / 30 Medium / 12 Hard; A15/B15/C15/D15; ten families × six.
- Hindi/Punjabi not yet authored; no runtime registration or publication.
- Learner-bank writes, scoring and mocks remain disabled.

## Review artifacts

- `WHI-001-CP007-EN-REVIEW-V1.md` — full English review pool.
- `WHI-001-CP007-SOURCE-AND-COVERAGE-PLAN.md` — coverage ownership and source register.
- `WHI-001-CP007-CANONICAL-FACTS-Q001-060-V1.json` — fact authority.
- `world-history-cp007-en-v1.json` — shared-contract data, review-only.
- `WHI-001-CP007-QL-FAMILY-MAP-V1.md` — family crosswalk.
- `knowledge-v1-whi007-review-v1.test.ts` — data contract checks.
