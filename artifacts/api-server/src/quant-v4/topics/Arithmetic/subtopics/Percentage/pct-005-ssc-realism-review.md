# PCT-005 SSC Realism Review

## Baseline Shape

- English QL count: `50`
- Hindi QL count: `20`
- Punjabi QL count: `20`
- CP count: `10`
- Per-CP English count: `5` each
- Shared/common QLs per CP: `2` each
- Exact duplicate English template groups: `0`
- Bundled test status before expansion: runnable and passing
  - Output: `PCT-005 first-pass implementation test passed.`

## Baseline Placeholder Mismatches

- Template missing placeholder required by registry:
  - `PCT-QL-021` to `PCT-QL-041`: missing `wholeLabel`
  - `PCT-QL-042` to `PCT-QL-044`: missing `labelA` and `labelB`
  - `PCT-QL-045` to `PCT-QL-050`: missing `wholeLabel`
- Template had extra placeholder not registered:
  - `PCT-QL-002:valuePrefix`
  - `PCT-QL-004:valuePrefix`
  - `PCT-QL-016:valuePrefix`
  - `PCT-QL-020:valuePrefix`

## Root Cause Summary

- Existing English-only stems in `PCT-QL-021` to `PCT-QL-050` had drifted away from registry-required placeholders.
- Shared money-style stems already used `valuePrefix`, but the registry had stale `requiredVariables`.
- Runtime coverage logic still treated shared/common QLs as the selectable set in places that should have been English-aware.

## Existing English QL Polish

- Polished `PCT-QL-001` to `PCT-QL-050`.
- Removed artificial wrapper phrasing and made asks more exam-style and explicit.
- Reworded stems so the percentage base and final ask are unambiguous.
- Ensured all existing English stems explicitly mention the quantity being found: final value, net percentage change, equivalent multiplier, original value, or final difference.

## Runtime Selection Result

- Runtime fix was needed.
- `getSelectableQuestionLanguageIds(cpId, language)` is now exported and used for English-aware selection.
- English generation now uses all English QLs in `question-language.en.json`.
- Hindi and Punjabi generation remain limited to shared/common QLs.
- Cross-language placeholder parity is now enforced only for shared/common QL IDs.
- `runPct005ForLanguages` now forces shared/common parity safely when a requested English-only QL is supplied.

## QL IDs / Ranges Patched

- Polished existing English QLs: `PCT-QL-001` to `PCT-QL-050`
- Added Stage 1 English QLs:
  - `PCT-QL-051` to `PCT-QL-060`
  - `PCT-QL-061` to `PCT-QL-070`
  - `PCT-QL-071` to `PCT-QL-080`
  - `PCT-QL-081` to `PCT-QL-090`
  - `PCT-QL-091` to `PCT-QL-100`
  - `PCT-QL-101` to `PCT-QL-110`
  - `PCT-QL-111` to `PCT-QL-120`
  - `PCT-QL-121` to `PCT-QL-130`
  - `PCT-QL-131` to `PCT-QL-140`
  - `PCT-QL-141` to `PCT-QL-150`

## Final Static Audit Results

- JSON parse: `ok`
- English QL count: `150`
- Hindi QL count: `20`
- Punjabi QL count: `20`
- CP count: `10`
- Per-CP English count: `15` each
- Shared/common QLs per CP: `2` each
- Exact duplicate English template groups: `0`
- Missing required placeholders: `0`
- Unregistered template placeholders: `0`
- Rendered unresolved placeholders: `0`
- Temporary helper files in final change set: `0`
- Changes outside allowed PCT-005 files/reports: `0`

## Bundled Test Result

- Build command:
  - `.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/pct-005.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-005.test.mjs`
- Build result:
  - success
- Runtime command:
  - `node dist/quant-v4/pct-005.test.mjs`
- Runtime output:
  - `PCT-005 first-pass implementation test passed.`

## Status Before / After Stage 1

- Before Stage 1:
  - English count was `50`
  - English editorial polish was still pending
  - Placeholder contract cleanup was needed
  - Runtime English-vs-common selection fix was needed
- After Stage 1:
  - English count is `150`
  - Existing English QLs are polished
  - Placeholder contract is clean
  - English generation covers all selectable English QLs
  - Shared/common parity behavior for hi/pa is preserved

## Final Status

`PCT-005 - Stage 1 English expansion complete; English generation covers all 150; ready for manual review or Stage 2 decision.`
