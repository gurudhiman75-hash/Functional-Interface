# PCT-002 Multilingual Pilot Report

## Current Language-Pack Status

- `question-language.en.json` contains full English coverage for `PCT-QL-001` to `PCT-QL-150`.
- `question-language.hi.json` and `question-language.pa.json` currently contain `PCT-QL-001` to `PCT-QL-020`.
- `PCT-QL-001` to `PCT-QL-020` are now truly localized in Hindi and Punjabi.
- `PCT-QL-021` onward are still English-only and remain blocked for hi/pa runtime.
- `explanation.en.json`, `explanation.hi.json`, and `explanation.pa.json` continue to store only `explanationId` mappings by CP. Active non-English explanation localization is implemented in the renderer.
- `task-registry.library.json`, `foundation/library.ts`, `foundation/types.ts`, `foundation/solver.ts`, and `foundation/validator.ts` accept `language: "en" | "hi" | "pa"` at runtime.

## Runtime Findings

### 1. Are hi/pa files real Hindi/Punjabi or English placeholder copies?

- `PCT-QL-001` to `PCT-QL-020`: yes, they are now real Hindi/Punjabi stems.
- `PCT-QL-021` onward: no hi/pa stem entries exist yet, so those remain English-only by design and are blocked.

### 2. Does runtime support `language=hi/pa` for PCT-002?

- Yes, with deliberate limits.
- English runtime selection is unchanged and can still use the full English corpus.
- Non-English runtime uses a localized allowlist backed by shared language-coverage infrastructure.
- Current practical coverage:
  - English QLs: `150`
  - Hindi QLs present in file: `20`
  - Punjabi QLs present in file: `20`
  - Hi/pa QLs actually selectable at runtime: `20`
- Direct hi/pa runtime support exists only for the localized batch QLs.

## PCT-CP-001 End-to-End Localization

- QLs: `PCT-QL-001`, `PCT-QL-002`
- taskKind: `wholeFromPart`
- Hindi/Punjabi stems localized
- runtime labels localized through entity references
- Hindi/Punjabi explanation prose localized
- solver/math logic remains language-neutral

## PCT-CP-002 End-to-End Localization

- QLs: `PCT-QL-003`, `PCT-QL-004`
- taskKind: `anotherPercentageFromKnownPercentage`
- Hindi/Punjabi stems localized
- runtime labels localized through entity references
- Hindi/Punjabi explanation prose localized
- solver/math logic remains language-neutral

## PCT-CP-003 To PCT-CP-010 Batch Localization

The first rollout batch now extends the backend pilot through:

- `PCT-CP-003`: `PCT-QL-005`, `PCT-QL-006`
- `PCT-CP-004`: `PCT-QL-007`, `PCT-QL-008`
- `PCT-CP-005`: `PCT-QL-009`, `PCT-QL-010`
- `PCT-CP-006`: `PCT-QL-011`, `PCT-QL-012`
- `PCT-CP-007`: `PCT-QL-013`, `PCT-QL-014`
- `PCT-CP-008`: `PCT-QL-015`, `PCT-QL-016`
- `PCT-CP-009`: `PCT-QL-017`, `PCT-QL-018`
- `PCT-CP-010`: `PCT-QL-019`, `PCT-QL-020`

For this batch:

- Hindi/Punjabi stems are localized
- runtime semantic labels are entity-library-driven
- Hindi/Punjabi explanation prose is localized for the covered task patterns
- English output remains unchanged

## Shared Language-Coverage Extraction

Phase 0 is now implemented through:

- `artifacts/api-server/src/quant-v4/common/language-coverage.ts`

Shared helper responsibilities now live there:

- package-keyed hi/pa localized QL registry
- `isQlLocalized(...)`
- `getLocalizedQuestionLanguageIds(...)`
- shared `resolveEntityLabels(...)`
- English normalization hook for label resolution

`PCT-002/foundation/parameter-generator.ts` now consumes that shared helper instead of keeping its own inline allowlist and entity bootstrap logic.

## Hindi Explanation Status

- Hindi explanation prose is now generated for all currently localized PCT-002 pilot QLs (`PCT-QL-001` to `PCT-QL-020`).
- Visible explanation prose and visible MathJax `\text{...}` labels have no English leakage in the current batch.

## Punjabi Explanation Status

- Punjabi explanation prose is now generated for all currently localized PCT-002 pilot QLs (`PCT-QL-001` to `PCT-QL-020`).
- Visible explanation prose and visible MathJax `\text{...}` labels have no English leakage in the current batch.

## Non-English QL Selection Guard

- English selection remains unchanged.
- For `language="hi"` and `language="pa"`, selectable QLs are restricted to:
  - `PCT-QL-001` to `PCT-QL-020`
- This guard applies to random backend selection and direct backend generation.
- Forced non-English generation for QLs outside the allowlist is rejected.

## Why hi/pa Random Runtime Is Restricted To Localized QLs

- `PCT-QL-021` onward are not yet localized in hi/pa.
- Random non-English selection must not land on untranslated entries while the rollout is partial.
- Restricting random hi/pa selection to the localized QLs prevents accidental mixed-language output during backend smoke runs and manual checks.

## Smoke And Audit Results

### Build

- `node build.mjs`
- Working directory: `artifacts/api-server`
- Result: passed

### English Smoke

- `node dist/quant-v4/pct-002.test.mjs`
- Working directory: `artifacts/api-server`
- Result: passed

### Multilingual Pilot Audit

The audit now covers:

- forced non-English generation for `PCT-QL-001` to `PCT-QL-020`
- placeholder parity for the localized batch
- required placeholder presence
- unresolved placeholder checks
- stem leakage checks
- explanation leakage checks
- export `metadata.language` verification
- blocked forced non-allowlisted generation (`PCT-QL-021`)
- random hi runtime across all localized CPs
- random pa runtime across all localized CPs

Bundled and ran:

- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002-multilingual-pilot-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`
- `node dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`

Observed audit summary:

- JSON parse: passed
- Forced pilot QL audit: passed
- Placeholder parity for localized QLs: passed
- Required placeholders present: passed
- Rendered unresolved placeholders: `0`
- English leakage in hi/pa stems: `0`
- English leakage in hi/pa explanations: `0`
- Export `metadata.language` correct for hi/pa: passed
- Forced non-English unsupported QL blocked: passed
- Random hi selection restricted to allowlist: passed
- Random pa selection restricted to allowlist: passed
- Explanation localization status: `true` for `PCT-QL-001` to `PCT-QL-020`

## Remaining Non-Pilot QL Blockers

1. `PCT-QL-021` onward still need hi/pa stem localization.
2. `PCT-QL-021` onward still need entity-backed runtime label coverage where applicable.
3. `PCT-QL-021` onward still need localized explanation prose for their task patterns.
4. The hi/pa allowlist must remain in place until each later batch is translated and audited.

## Frontend Enablement Recommendation

- Keep this pilot backend-only for now.
- Do not enable Hindi/Punjabi in Question Studio yet.
- PCT-002 backend multilingual runtime is now safe for `PCT-QL-001` to `PCT-QL-020`.
- Frontend enablement should wait until a much larger and intentionally selected PCT-002 surface is localized end to end.

Current recommendation:

- `PCT-002 multilingual runtime`: partial but backend-safe for the localized batch
- `PCT-002 multilingual frontend exposure`: not ready and remains off
