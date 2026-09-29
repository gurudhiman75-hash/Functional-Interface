# WHI-001-CP016 — Architecture and Status

**Status:** English, Hindi and Punjabi cumulative review pools are user-approved and exposed through a dedicated Question Studio review-only package.

**Architecture:** Shared `knowledge-v1` facts and source register → origin-preserving CP016 cumulative pool → English/Hindi/Punjabi review records → Question Studio review-only adapter.

**Question Studio:** Package `WHI-001-CP016` uses the standard review-only lifecycle. It is read-only; Question Bank writing, tests, mock tests, publication and learner delivery remain disabled. Generated items retain `runtimeRegistered: false`.

## Shared-model reuse

- Each record uses the established `knowledge-v1` shape with explicit origin metadata.
- CP016 fact IDs are stable; origin fact IDs and source references are preserved separately.
- Checkpoint-scoped source IDs avoid collisions while raw origin source IDs remain available.
- Question and explanation text is reused from origin pools; localized records preserve the source meaning and answer mapping.
- Deterministic option ordering is recorded with original and rendered answer positions.

## Question Studio contract checks

- The dedicated package appears in the `knowledge-v1` package registry and routes by explicit package ID or CP016 question selector.
- It advertises English, Hindi and Punjabi, supports the approved difficulty groups, and rejects learner runtime mode.
- Route tests verify source/fact/origin provenance, answer index, review-only lifecycle, and publication locks for each language.
- CP001's existing package and broad World History fallback remain unaffected.

## Remaining chapter gates

- Completed the chapter-wide structural and coverage issue-finding audit; resolve the gaps and overlaps recorded in [WHI-001 CP001–CP016 Chapter-Wide Coverage Audit V1](./WHI-001-CP001-016-CHAPTER-WIDE-COVERAGE-AUDIT-V1.md).
- Complete source locator verification and the separate chronology, duplicate, accuracy, ambiguity and difficulty review.
- Keep Question Bank persistence and learner delivery disabled until chapter-level gates are completed.
