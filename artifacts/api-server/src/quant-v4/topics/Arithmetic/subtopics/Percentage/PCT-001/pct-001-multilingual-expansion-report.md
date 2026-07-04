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
