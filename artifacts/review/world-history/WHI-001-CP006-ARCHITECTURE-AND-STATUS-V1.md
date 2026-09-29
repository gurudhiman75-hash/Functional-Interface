# WHI-001-CP006 — Architecture and review status

**Checkpoint:** Nationalism and Unification  
**Current state:** Complete English pool (60/60); English editorial review requested; not registered in Question Studio.  
**Lifecycle:** Review-only; no learner delivery.

## Reused implementation pattern

CP006 follows the existing Static GK `knowledge-v1` architecture used by World History CP003–CP005. It adds checkpoint data to the existing contract rather than creating a second engine.

1. **Authority:** source register `CP006-S01`–`CP006-S09`, including archival, museum, government and specialist records.
2. **Canonical facts:** stable `WHI-CP006-F001`–`F060` claims with source IDs, locators and relationship types.
3. **Question-family layer:** ten approved family values, six items per family, crosswalked in `WHI-001-CP006-QL-FAMILY-MAP-V1.md`.
4. **Question layer:** shared record shape with stable IDs, fact links, language, difficulty, family, keyed options, a question-specific explanation, source IDs and review/runtime flags.
5. **Validation/review:** schema, uniqueness, source membership, option/key integrity, difficulty, answer balance, family count, and review-only status. Human review files are generated from the same data records.
6. **Question Studio:** after English approval, independently author Hindi and Punjabi. Then register CP006 in the existing grouped WHI adapter and test full-pool parity, deterministic selectors and standard lifecycle locks.

## Current gate

- English: 60 records, 18 Easy / 30 Medium / 12 Hard, answer keys A15/B15/C15/D15, ten families × six.
- Hindi and Punjabi have not yet been authored.
- No CP006 Question Studio route or runtime registration is enabled.
- No learner-bank writes, scoring, mocks or public release are enabled.

## Review artifacts

- `WHI-001-CP006-Q001-020-EN-REVIEW-V1.md` — approved English batch 1.
- `WHI-001-CP006-Q021-060-EN-REVIEW-V1.md` — English batch 2, now ready for human review.
- `WHI-001-CP006-CANONICAL-FACTS-Q001-060-V1.json` — full canonical source-backed fact authority.
- `world-history-cp006-en-v1.json` — shared English record shape, review-only and not runtime-registered.
- `WHI-001-CP006-QL-FAMILY-MAP-V1.md` — full family-to-question crosswalk.
