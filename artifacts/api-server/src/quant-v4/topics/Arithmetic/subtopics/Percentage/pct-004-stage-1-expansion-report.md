# PCT-004 Stage 1 Expansion Report

## Files Changed

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/question-language.en.json`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/task-registry.library.json`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/foundation/parameter-generator.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/foundation/coverage-auditor.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/foundation/validator.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/foundation/pipeline.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/pct-004.test.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-004-ssc-realism-review.md`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-004-stage-1-expansion-report.md`

## Before / After Counts

- English QL count: `50` -> `150`
- Hindi QL count: `20` -> `20`
- Punjabi QL count: `20` -> `20`
- English QLs per CP: `5` -> `15`
- Shared/common QLs per CP: `2` -> `2`

## New QL ID Ranges By CP

- `PCT-CP-001`: added `PCT-QL-051` to `PCT-QL-060`
- `PCT-CP-002`: added `PCT-QL-061` to `PCT-QL-070`
- `PCT-CP-003`: added `PCT-QL-071` to `PCT-QL-080`
- `PCT-CP-004`: added `PCT-QL-081` to `PCT-QL-090`
- `PCT-CP-005`: added `PCT-QL-091` to `PCT-QL-100`
- `PCT-CP-006`: added `PCT-QL-101` to `PCT-QL-110`
- `PCT-CP-007`: added `PCT-QL-111` to `PCT-QL-120`
- `PCT-CP-008`: added `PCT-QL-121` to `PCT-QL-130`
- `PCT-CP-009`: added `PCT-QL-131` to `PCT-QL-140`
- `PCT-CP-010`: added `PCT-QL-141` to `PCT-QL-150`

## Registry / Generator / Test Changes

- Registered all new `PCT-QL-051` to `PCT-QL-150` entries in the task registry with CP-preserving task kinds and answer types.
- Fixed stale `valuePrefix` registration on shared money-style QLs.
- Expanded the parameter-generator alias map so all new English QLs reuse the correct existing solver-compatible scenario builders.
- Added scenario variable overrides for legacy English-only QLs and all Stage 1 English QLs to preserve placeholder completeness and contextual variety.
- Exported and used `getSelectableQuestionLanguageIds(cpId, language)` so English runtime selection covers all English QLs.
- Updated the test to expect `150` English QLs and `15` English QLs per CP.

## English-vs-Common Runtime Behavior

- English generation: all English QLs in `question-language.en.json`
- Hindi/Punjabi generation: shared/common QLs only
- `runPct004ForLanguages`: shared/common parity only
- `getCommonQuestionLanguageIds`: unchanged and shared-only
- Cross-language placeholder parity: shared/common QLs only

## Audit Results

- JSON parse: `ok`
- English QL count: `150`
- CP count: `10`
- Per-CP count: `15` each
- Exact duplicate English template groups: `0`
- Missing required placeholders: `0`
- Unregistered template placeholders: `0`
- Rendered unresolved placeholders: `0`
- No temporary helper files created by this task

## Bundled Build Result

- Command:
  - `.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/pct-004.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-004.test.mjs`
- Result:
  - build completed successfully

## Bundled Runtime Test Result

- Command:
  - `node dist/quant-v4/pct-004.test.mjs`
- Output:
  - `PCT-004 first-pass implementation test passed.`

## Known Caveats

- Hindi and Punjabi were intentionally left unchanged in this task.
- Cross-language parity remains limited to the shared/common subset, which is intentional and required by the repo state.

## Final Status

`PCT-004 - Stage 1 English expansion complete; English generation covers all 150; ready for manual review or Stage 2 decision.`
