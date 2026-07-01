# PLATFORM-INF-001 Migration Strategy

## Principle

Do not force a Percentage rewrite. Introduce shared contracts first, then migrate packages only when each chapter is scheduled for content work.

## Phase A — Compatibility now

Completed in this task:

- Keep existing `answer` fields working.
- Normalize string/number answers through `normalizeQuantV4Answer()`.
- Use shared option generation in Question Studio preview.
- Add `canonicalAnswer` beside `answer` in preview output.
- Filter archived packages from discovery.

## Phase B — New package authoring

For all future Quant V4 packages:

1. Solver returns or derives a canonical answer object.
2. Renderer uses `rendered`/`display`, not computational parsing.
3. MCQ options are generated through `buildQuantV4AnswerOptions()`.
4. Traceability records context and structure IDs when available.
5. Maturity is evaluated through `evaluateQuantV4Maturity()`.

## Phase C — Existing chapter migration

For each existing chapter, when scheduled separately:

1. Add canonical answer construction near solver output.
2. Keep old answer string as display/backward field until exports and UI no longer depend on it.
3. Replace chapter-local option helpers, if any, with the shared service.
4. Add context/structure/answer-style traceability.
5. Use shared maturity thresholds in coverage auditor.
6. Run package tests and generation previews.

## Phase D — Enforcement later

After all active packages are migrated:

- Make canonical answer mandatory in package runtime contract.
- Turn shared maturity policy into a freeze gate.
- Add discovery tests for archived package exclusion.
- Add option-generation tests for all answer kinds.
