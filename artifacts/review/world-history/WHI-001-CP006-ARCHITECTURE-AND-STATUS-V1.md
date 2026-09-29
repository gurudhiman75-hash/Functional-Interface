# WHI-001-CP006 — Architecture and review status

**Checkpoint:** Nationalism and Unification  
**Current state:** English review batch 1 (Q001–Q020); not registered in Question Studio.  
**Lifecycle:** Review-only; no learner delivery.

## Reused implementation pattern

CP006 follows the existing Static GK `knowledge-v1` architecture used by World History CP003–CP005. It does not introduce a question-only side path or a new engine.

1. **Authority layer:** source register `CP006-S01`–`CP006-S08` from the CP006 coverage plan.
2. **Canonical layer:** stable `WHI-CP006-Fnnn` facts with source IDs and source locators; relationships include person–role, organisation–aim, event–outcome, chronology and territory–state.
3. **Question-family layer:** ten family contracts in `WHI-001-CP006-QL-FAMILY-MAP-V1.md`; each final family contributes six distinct questions.
4. **Question layer:** same record shape as CP005: stable English ID, checkpoint, fact, language, difficulty, family, stem, four keyed options, specific explanation, source IDs and explicit review/runtime flags.
5. **Validation/review layer:** batch checks cover schema, IDs, source membership, four distinct options, one keyed answer, answer balance, family coverage, difficulty and duplication; the human review artifact is generated from the same records.
6. **Question Studio layer:** after all 60 English questions pass review and English is approved, author Hindi and Punjabi as native overlays, then add CP006 to the existing grouped WHI adapter and its tests. Reuse its package/CP/question selectors, language and difficulty filters, deterministic seeded selection, parity checks and standard review-only lifecycle.

## Current gate

This first batch now has question records and their canonical fact/family links. It remains outside the runtime adapter because it contains only 20 of the required 60 questions and only English. That is the existing architecture's full-corpus gate, not a separate implementation path.

Before registration:

- finish Q021–Q060 against the approved coverage map, without duplicating question intent;
- complete the full 60-question English pool at 18 Easy / 30 Medium / 12 Hard, with 10 families × 6;
- pass source, semantic-deduplication, difficulty and answer-position checks;
- receive English editorial approval and apply corrections;
- independently author Hindi and Punjabi while preserving IDs, fact, family, difficulty, option order and correct key;
- pass the 60-per-language parity and native-language review checks;
- extend the shared WHI adapter and its Question Studio route tests; keep Question Bank writes, scoring, mocks, public publication and production release disabled.

## Files in this review change

- `WHI-001-CP006-Q001-020-EN-REVIEW-V1.md` — human-readable English review batch.
- `WHI-001-CP006-CANONICAL-FACTS-Q001-020-V1.json` — source-backed fact records for the batch.
- `world-history-cp006-en-v1.json` — English records in the shared CP data shape, still unpublished and not runtime-registered.
- `WHI-001-CP006-QL-FAMILY-MAP-V1.md` — family boundaries, six-per-family target and shared-adapter contract.
- `knowledge-v1-whi006-review-batch1-v1.test.ts` — checks the partial batch's shared data contract without enabling a runtime route.
