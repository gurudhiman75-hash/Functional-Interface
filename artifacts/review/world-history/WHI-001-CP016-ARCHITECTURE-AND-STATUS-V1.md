# WHI-001-CP016 — Architecture and Status

**Status:** English cumulative review pool built; source/editorial and whole-chapter audits remain.
**Architecture:** source register → canonical origin facts → 10-family mixed review → knowledge-v1 records → EN review rendering → contract test.
**Question Studio:** Not registered. Review-only; runtimeRegistered=false.
**Localization:** English only. Hindi/Punjabi must retain origin crosswalk and key mapping after option reordering.

## Shared-model reuse

- Each record uses the established knowledge-v1 shape with explicit origin metadata.
- New CP016 fact IDs are stable; origin fact IDs and source references are preserved separately.
- Checkpoint-scoped source IDs prevent collisions while raw origin IDs remain available.
- Text and explanations remain unchanged from the origin question.
- Deterministic option ordering is recorded with both original and rendered keys.

## Release gates

- Keep runtime and learner delivery disabled pending English/source review, Hindi/Punjabi localization, native-language parity review and Question Studio audit.
- Whole-chapter gap, chronology, duplication and source-locator audit remains mandatory.
