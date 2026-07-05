# PCT-001 Multilingual Expansion Report

## Checkpoint 1

- Scope: `PCT-CP-001`
- Coverage completed: `120/350` question-language IDs
- Languages completed: `hi`, `pa`
- Frontend exposure: unchanged, still off

## QLs Completed

- Localized all `PCT-CP-001` Hindi stems in `question-language.hi.json`
- Localized all `PCT-CP-001` Punjabi stems in `question-language.pa.json`
- Registered `PCT-CP-001` QL coverage in `common/language-coverage.ts`
- Added non-English runtime gating in `parameter-generator.ts`
- Added CP-001-only localized explanation rendering in `explanation-renderer.ts`
- Added checkpoint audit in `pct-001-multilingual-audit.ts`

## Entity Library Reuse

- Reused shared multilingual gating and entity-resolution infrastructure from:
  - `common/language-coverage.ts`
  - `common/entity-context-map.ts`
- New entity-library entries added: `0`
- New per-module duplicate entity resolver logic added: `0`

## Explanation Localization

- Replaced the old broken CP-001 hi/pa explanation path with localized renderer-driven output using the existing math pipeline.
- Kept English explanation behavior unchanged.
- Added CP-001 Hindi and Punjabi explanation variants in `explanation.hi.json` and `explanation.pa.json`.
- Variants were needed because PCT-001 validation requires multi-variant explanation families.

## Verification

- `node build.mjs` in `artifacts/api-server`: passed
- `node dist/quant-v4/pct-001.test.mjs`: passed
- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pct-001-multilingual-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-001-multilingual-audit.mjs`: passed
- `node dist/quant-v4/pct-001-multilingual-audit.mjs`: passed

## Multilingual Audit Summary

- JSON parse: passed
- Placeholder parity en/hi/pa for localized QLs: passed
- Required placeholders present: passed
- Unresolved placeholders: `0`
- English leakage in hi stems: `0`
- English leakage in pa stems: `0`
- English leakage in hi explanations: `0`
- English leakage in pa explanations: `0`
- `metadata.language` correctness: passed
- Forced localized hi/pa generation: passed
- Forced non-localized hi/pa generation: blocked as expected
- Random hi/pa selection stayed inside current registered coverage: passed
- Localized CP coverage: `["PCT-CP-001"]`

## Freeze-Safe Checks

- English content files changed: `0`
- English solver, task-registry, and type files changed: `0`
- Devanagari or Gurmukhi characters added inside touched `.ts` files: `0`
- Generation failures: `0`
- Validation failures: `0`
- Render failures: `0`
- Solver failures: `0`

Coverage note:
- The bundled multilingual audit still uses a 500-question English sanity batch, which now leaves `36` unused QL IDs because `PCT-CP-001` alone has `120` English QLs and the 500-batch visits only `84` CP-001 slots.
- A fuller English sweep at `720` and `1000` questions returns:
  - unused QL IDs = `0`
  - unused ES IDs = `0`
  - generation, validation, render, and solver failures = `0`
- This confirms the freeze-critical unused-ID and failure metrics remain intact for full coverage runs.

## Running Coverage

- Completed after Checkpoint 1: `120/350`
- Remaining blocked QLs: `230`
- Remaining localized CPs: `PCT-CP-002`, `PCT-CP-003`, `PCT-CP-004`, `PCT-CP-005`, `PCT-CP-006`

## Needs Native Review

- Hindi competitive-exam tone for a few finance and administrative scenarios may still benefit from a native editorial pass.
- Punjabi wording for some formal academic and business stems is backend-safe, but still worth human review before any frontend exposure.
- `A` and `B` symbolic-label prompts remain intentionally preserved where the English source uses symbolic labels.

## Status

- PCT-001 Checkpoint 1 backend multilingual backport: complete
- Question Studio Hindi and Punjabi exposure: still disabled
- English behavior: preserved

## Checkpoint 2

- Scope: `PCT-CP-002`, `PCT-CP-003`, `PCT-CP-004`
- Additional coverage completed: `130` question-language IDs
- Total coverage completed: `250/350` question-language IDs
- Languages completed: `hi`, `pa`
- Frontend exposure: unchanged, still off

## QLs Completed In Checkpoint 2

- Localized all `PCT-CP-002`, `PCT-CP-003`, and `PCT-CP-004` Hindi stems in `question-language.hi.json`
- Localized all `PCT-CP-002`, `PCT-CP-003`, and `PCT-CP-004` Punjabi stems in `question-language.pa.json`
- Extended registered non-English coverage in `common/language-coverage.ts`
- Kept non-English runtime gating in `parameter-generator.ts`
- Extended localized explanation rendering coverage in `explanation-renderer.ts`
- Completed hi/pa explanation families for:
  - `differenceOfPercents`
  - `restoreAfterDecrease`
  - `successiveChange`
  - `compoundGrowth`
  - `compoundDecay`
  - `squareAreaChange`
  - `productInvariance`
  - `revenueChange`
  - `circleAreaDecrease`

## Validation Fixes In Checkpoint 2

- Added a `differenceOfPercents` variable constraint so `rate1` and `rate2` cannot collapse into the same value and produce invalid division.
- Fixed unresolved-placeholder detection so MathJax braces are not miscounted as template placeholders.
- Added multi-variant Hindi and Punjabi explanation families for localized CP-002 to CP-004 task patterns, which was the final blocker behind `forcedLocalizedGenerationPassed = false`.

## Verification After Checkpoint 2

- `node build.mjs` in `artifacts/api-server`: passed
- `node dist/quant-v4/pct-001.test.mjs`: passed
- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pct-001-multilingual-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-001-multilingual-audit.mjs`: passed
- `node dist/quant-v4/pct-001-multilingual-audit.mjs`: passed

## Multilingual Audit Summary After Checkpoint 2

- JSON parse: passed
- Placeholder parity en/hi/pa for localized QLs: passed
- Required placeholders present: passed
- Unresolved placeholders: `0`
- English leakage in hi stems: `0`
- English leakage in pa stems: `0`
- English leakage in hi explanations: `0`
- English leakage in pa explanations: `0`
- `metadata.language` correctness: passed
- Explanation localization status: passed
- Forced localized hi/pa generation: passed
- Forced non-localized hi/pa generation: blocked as expected
- Random hi/pa selection stayed inside current registered coverage: passed
- Localized CP coverage: `["PCT-CP-001", "PCT-CP-002", "PCT-CP-003", "PCT-CP-004"]`

## Running Coverage After Checkpoint 2

- Completed after Checkpoint 2: `250/350`
- Remaining blocked QLs: `100`
- Remaining localized CPs: `PCT-CP-005`, `PCT-CP-006`

## Remaining Blockers

- `PCT-CP-005` and `PCT-CP-006` are still blocked for hi/pa runtime.
- Question Studio Hindi and Punjabi exposure remains intentionally disabled.
- Native-language editorial review is still recommended before any frontend enablement.

## Current Status

- PCT-001 Checkpoint 2 backend multilingual backport: complete
- PCT-001 localized backend coverage: `PCT-CP-001` to `PCT-CP-004`
- Question Studio Hindi and Punjabi exposure: still disabled
- English behavior: preserved

## Checkpoint 3

- Scope: `PCT-CP-005`, `PCT-CP-006`
- Additional coverage completed: `100` question-language IDs
- Total coverage completed: `350/350` question-language IDs
- Languages completed: `hi`, `pa`
- Frontend exposure: unchanged, still off

## QLs Completed In Checkpoint 3

- Localized all `PCT-CP-005` Hindi stems in `question-language.hi.json`
- Localized all `PCT-CP-005` Punjabi stems in `question-language.pa.json`
- Localized all `PCT-CP-006` Hindi stems in `question-language.hi.json`
- Localized all `PCT-CP-006` Punjabi stems in `question-language.pa.json`
- Expanded registered non-English coverage in `common/language-coverage.ts` to include the remaining CP-005 and CP-006 QL families
- Enabled localized explanation rendering for `PCT-CP-005` and `PCT-CP-006` in `explanation-renderer.ts`

## Explanation Localization In Checkpoint 3

- Added full Hindi and Punjabi multi-variant explanation families for:
  - `partToTotal`
  - `incomePartition`
  - `successiveExpense`
  - `winnerVotes`
  - `cancelledVotes`
  - `passMarks`
  - `complementOfTotal`
  - `moreMarksBase`
  - `twoShareRemainder`
  - `loserVotes`
- Replaced the remaining English-leaking CP-006 explanation prose with a localized mixture-pattern family in Hindi and Punjabi
- Kept CP-006 task aliases explicit so all eight task kinds resolve through one localized explanation pattern without changing solver behavior

## Validation Fixes In Checkpoint 3

- Closed the CP-005 and CP-006 hi/pa family-count mismatch by rebuilding those family objects in English order with exact placeholder parity
- Removed the last known English explanation leakage from PCT-001 hi/pa task libraries
- Updated the PCT-001 multilingual audit and regression test expectations from checkpoint coverage to full-module coverage
- Synced localized difficulty metadata back to the English source of truth so seed-based variable generation stays identical across languages
- Updated `parameter-generator.ts` so non-English generation uses the English baseline for difficulty and count-sensitive variable constraints while keeping localized stems and explanations fully visible

## Verification After Checkpoint 3

- `node build.mjs` in `artifacts/api-server`: passed
- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pct-001.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-001.test.mjs`: passed
- `node dist/quant-v4/pct-001.test.mjs`: passed
- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pct-001-multilingual-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-001-multilingual-audit.mjs`: passed
- `node dist/quant-v4/pct-001-multilingual-audit.mjs`: passed

## Multilingual Audit Summary After Checkpoint 3

- JSON parse: passed
- Placeholder parity en/hi/pa for localized QLs: passed
- Required placeholders present: passed
- Unresolved placeholders: `0`
- English leakage in hi stems: `0`
- English leakage in pa stems: `0`
- English leakage in hi explanations: `0`
- English leakage in pa explanations: `0`
- `metadata.language` correctness: passed
- Explanation localization status: passed
- Forced localized hi/pa generation: passed
- Forced unsupported hi/pa generation: blocked as designed
- Random hi/pa selection stayed inside current registered coverage: passed
- Localized CP coverage: `["PCT-CP-001", "PCT-CP-002", "PCT-CP-003", "PCT-CP-004", "PCT-CP-005", "PCT-CP-006"]`
- Coverage audit residual caveat: `unusedQlIds = 36` in the 500-sample English coverage sweep, which remains a sampling/editorial coverage caveat rather than a multilingual backend failure

## Running Coverage After Checkpoint 3

- Completed after Checkpoint 3: `350/350`
- Remaining blocked QLs: `0`
- Remaining localized CPs: none

## Remaining Blockers

- Question Studio Hindi and Punjabi exposure remains intentionally disabled
- Native-language editorial review is still recommended before any frontend enablement
- The broader Percentage rollout for `PCT-003` to `PCT-007` remains out of scope for this checkpoint

## Current Status

- PCT-001 Checkpoint 3 backend multilingual backport: complete
- PCT-001 localized backend coverage: full module
- Question Studio Hindi and Punjabi exposure: still disabled
- English behavior: preserved
