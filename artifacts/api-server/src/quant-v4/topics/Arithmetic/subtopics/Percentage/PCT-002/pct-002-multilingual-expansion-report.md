# PCT-002 Multilingual Expansion Report

## Scope

- Module: `PCT-002`
- Languages: `en`, `hi`, `pa`
- Exposure model:
  - English remains the only Question Studio discovery language
  - Hindi/Punjabi remain backend-only
  - Non-English runtime is still guarded by the shared localization gate

## Completion Status

- Hindi localized QLs: `150/150`
- Punjabi localized QLs: `150/150`
- Localized CP coverage:
  - `PCT-CP-001`
  - `PCT-CP-003`
  - `PCT-CP-005`
  - `PCT-CP-006`
  - `PCT-CP-007`
  - `PCT-CP-008`
  - `PCT-CP-009`
  - `PCT-CP-010`
- Explanation coverage:
  - `wholeFromPart`
  - `anotherPercentageFromKnownPercentage`
  - `percentageFromPartAndWhole`
  - `reversePercentageMapping`
  - `ratioToPercentage`
  - `complementaryPercentage`
  - `differenceBetweenPercentageParts`
  - `percentagePartition`
  - `missingPercentage`
  - `multiCategoryPercentageDistribution`
- Runtime allowlist coverage for `hi` / `pa`: `PCT-QL-001` to `PCT-QL-150`

## Shared Infrastructure

- `artifacts/api-server/src/quant-v4/common/language-coverage.ts`
  - shared hi/pa QL gating
  - shared localized-selection filtering
  - shared entity-label resolution
- English behavior was preserved:
  - English selection logic unchanged
  - English Question Studio exposure unchanged
  - English solver and answer behavior unchanged

## Final Hardening Fixes

- Expanded `PCT-002` non-English allowlist from the earlier pilot subset to full localized coverage.
- Reworked non-English runtime label resolution so PCT-002 uses entity-backed localized labels instead of package-local hardcoded label copies.
- Filled the missing `SCENARIO_VARIABLE_OVERRIDES` coverage for later QLs that depended on scenario-specific runtime nouns.
- Repaired corrupted Hindi/Punjabi `unit-library.json` entries that were rendering as `?` and causing mixed-language / missing-entity output.
- Added missing unit entities required by localized runtime rendering:
  - `passed`
  - `dispatched`
- Fixed the missing non-English entity-map registration for:
  - `undelivered`
- Corrected the eight localized complementary-percentage templates that had drifted from the English placeholder contract by adding an extra `{wholeLabel}` placeholder.
- Normalized stray Hindi full-width punctuation that leaked into localized templates during bulk fill.

## Final QA Run

Executed:

- `node build.mjs`
- `node dist/quant-v4/pct-002.test.mjs`
- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002-multilingual-pilot-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`
- `node dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`

Observed final audit summary:

- `jsonParsePassed`: `true`
- `forcedPilotAuditPassed`: `true`
- `placeholderParityPassed`: `true`
- `requiredPlaceholdersPassed`: `true`
- `unresolvedPlaceholderCount`: `0`
- `englishLeakageCount`: `0`
- `explanationEnglishLeakageCount`: `0`
- `metadataLanguagePassed`: `true`
- `explanationLanguageLocalized`: `true`
- `runtimeSupportsHiPa`: `true`
- `forcedUnsupportedNonEnglishBlocked`: `true`
- `randomHiSelectableOnly`: `true`
- `randomPaSelectableOnly`: `true`
- `sharedQuestionLanguageCount`: `150`
- `totalEnglishQuestionLanguages`: `150`
- `totalHindiQuestionLanguages`: `150`
- `totalPunjabiQuestionLanguages`: `150`

## Backend Safety Result

- `PCT-002` is backend-safe for Hindi/Punjabi across the full QL set.
- Random hi/pa runtime selection now stays inside fully localized coverage.
- Forced hi/pa generation no longer falls through to English-copy templates.
- Explanations are localized for every active PCT-002 task pattern.

## Remaining Constraints

- Hindi/Punjabi are still not enabled in Question Studio discovery.
- Frontend exposure remains intentionally off until the wider Percentage rollout is complete.
- This report only marks `PCT-002` complete; other Percentage modules still need their own migration phases.
