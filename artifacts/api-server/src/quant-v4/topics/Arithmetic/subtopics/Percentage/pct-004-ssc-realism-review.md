# PCT-004 SSC Realism Review

## Baseline Shape

- Archetype: `PCT-004`
- English QL count before Stage 1: `50`
- Hindi QL count: `20`
- Punjabi QL count: `20`
- CP count: `10`
- Per-CP English count before Stage 1: `5` each
- Shared/common QLs per CP: `2`
- Bundled baseline test status: runnable and passing
  - `PCT-004 first-pass implementation test passed.`

## Existing English QL Polish Summary

- Removed artificial wrappers such as `record shows`, `register shows`, `revised-value notice`, `fee table`, `budget note`, and similar report-like phrasing where it did not improve realism.
- Tightened the existing `PCT-QL-001` to `PCT-QL-050` stems toward SSC/banking mock-test wording.
- Fixed vague asks by naming the exact required output: new value, decrease amount, multiplier, final value, revised percentage, or required decrease.
- Fixed placeholder drift in existing English-only stems by restoring generic placeholders such as `wholeLabel`, `labelA`, `labelB`, `partRate`, and `otherLabel` where the registry expected them.

## QL IDs / Ranges Patched

- Existing English polish and placeholder cleanup:
  - `PCT-QL-001` to `PCT-QL-050`
- Stage 1 English expansion:
  - `PCT-QL-051` to `PCT-QL-150`

## Placeholder Mismatch Audit

### Baseline mismatch IDs

- Missing required placeholders:
  - `PCT-QL-021:wholeLabel`
  - `PCT-QL-022:wholeLabel`
  - `PCT-QL-023:wholeLabel`
  - `PCT-QL-024:wholeLabel`
  - `PCT-QL-025:wholeLabel`
  - `PCT-QL-026:wholeLabel`
  - `PCT-QL-027:wholeLabel`
  - `PCT-QL-028:wholeLabel`
  - `PCT-QL-029:wholeLabel`
  - `PCT-QL-030:wholeLabel`
  - `PCT-QL-031:wholeLabel`
  - `PCT-QL-032:wholeLabel`
  - `PCT-QL-033:wholeLabel`
  - `PCT-QL-034:wholeLabel`
  - `PCT-QL-035:wholeLabel`
  - `PCT-QL-036:wholeLabel`
  - `PCT-QL-037:wholeLabel`
  - `PCT-QL-038:wholeLabel`
  - `PCT-QL-039:labelA`
  - `PCT-QL-039:labelB`
  - `PCT-QL-040:labelA`
  - `PCT-QL-040:labelB`
  - `PCT-QL-041:labelA`
  - `PCT-QL-041:labelB`
  - `PCT-QL-042:otherLabel`
  - `PCT-QL-043:wholeLabel`
  - `PCT-QL-043:otherLabel`
  - `PCT-QL-044:partRate`
  - `PCT-QL-045:wholeLabel`
  - `PCT-QL-046:wholeLabel`
  - `PCT-QL-047:wholeLabel`
  - `PCT-QL-048:wholeLabel`
  - `PCT-QL-049:wholeLabel`
  - `PCT-QL-050:wholeLabel`
- Unregistered template placeholders:
  - `PCT-QL-001:valuePrefix`
  - `PCT-QL-003:valuePrefix`
  - `PCT-QL-009:valuePrefix`
  - `PCT-QL-013:valuePrefix`
  - `PCT-QL-017:valuePrefix`
  - `PCT-QL-020:valuePrefix`

### Root causes

- English-only legacy variants had fixed domain wording while the registry still required generic placeholders such as `wholeLabel`, `labelA`, `labelB`, `partRate`, and `otherLabel`.
- Shared money-oriented templates rendered `valuePrefix`, but the registry did not register it as required.
- Cross-language parity should apply only to shared/common QLs, not to English-only Stage 1 or legacy English-only variants.

### Final placeholder status

- Missing required placeholders: `0`
- Unregistered template placeholders: `0`
- Rendered unresolved placeholders: `0`

## Runtime Selection Result

- A runtime selection fix was needed.
- Before the fix:
  - English parameter selection already used all English QLs.
  - English batch generation in the coverage auditor still used shared/common QLs only.
  - Validation only accepted shared/common QL IDs.
  - `runPct004ForLanguages` always derived parity from a shared-language generation call without guarding against an English-only requested QL.
- After the fix:
  - English generation uses all English QLs via `getSelectableQuestionLanguageIds(cpId, language)`.
  - Hindi/Punjabi generation remains shared/common-only.
  - `runPct004ForLanguages` keeps parity on shared/common IDs only.
  - `getCommonQuestionLanguageIds` remains unchanged and shared-only.
  - Cross-language placeholder parity is enforced only for shared/common QLs.

## Final Static Audit Results

- English QL count: `150`
- Hindi QL count: `20`
- Punjabi QL count: `20`
- CP count: `10`
- Per-CP English count: `15` each
- Shared/common QLs per CP: `2`
- Exact duplicate English template groups: `0`
- Missing required placeholders: `0`
- Unregistered template placeholders: `0`
- Rendered unresolved placeholders: `0`

## Bundled Test Result

- Build command:
  - `.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-004/pct-004.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-004.test.mjs`
- Runtime command:
  - `node dist/quant-v4/pct-004.test.mjs`
- Output:
  - `PCT-004 first-pass implementation test passed.`

## Status Before Stage 1

`PCT-004 - Baseline library present and runnable, but existing English QLs needed editorial polish, placeholder cleanup, and an English-vs-common runtime split fix before expansion.`

## Final Status

`PCT-004 - Stage 1 English expansion complete; English generation covers all 150; ready for manual review or Stage 2 decision.`
