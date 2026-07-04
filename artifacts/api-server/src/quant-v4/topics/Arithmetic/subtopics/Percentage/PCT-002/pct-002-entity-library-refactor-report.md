# PCT-002 Entity Library Refactor Report

## Scope

- Refactored PCT-002 multilingual pilot label sourcing for `PCT-QL-001` to `PCT-QL-004`.
- Kept the non-English QL allowlist unchanged:
  - `PCT-QL-001`
  - `PCT-QL-002`
  - `PCT-QL-003`
  - `PCT-QL-004`
- Did not enable Hindi or Punjabi in Question Studio.
- Did not change solver, difficulty, variable-range, or reasoning-graph logic.

## Entity Library Additions

Added `common/entity-libraries/financial-concept-library.json` with these shared entities:

- `monthly_income`
- `income`
- `savings`
- `expenditure`
- `salary`
- `budget`
- `amount`
- `target_amount`
- `revenue`
- `profit`

Registered the new `financial-concept` category in:

- `common/entity-types.ts`
- `common/entity-library.ts`

## PCT-002 Refactor

`foundation/parameter-generator.ts` now uses shared entity references for pilot labels:

- `PCT-QL-001`: `group/students`, `group/girls`
- `PCT-QL-002`: `financial-concept/monthly_income`, `financial-concept/savings`
- `PCT-QL-003`: `financial-concept/income`, `financial-concept/target_amount`
- `PCT-QL-004`: `group/students`

The old hardcoded TypeScript maps were removed:

- `PILOT_LABEL_LOCALIZATIONS`
- `SAFE_PILOT_LABEL_LOCALIZATIONS`

Labels now resolve exactly once during parameter generation, before stems, solver output, and explanations consume the variables.

## Output Compatibility

- English labels still render in the existing lowercase style for PCT-002 stems and explanations.
- Hindi and Punjabi labels now come from the shared entity libraries.
- The previous duplicated Hindi spelling for `girls` no longer exists in `parameter-generator.ts`; the shared `group-library.json` entry is now the single source of truth.

## Verification Results

### Build

- Command: `node build.mjs`
- Result: passed

### PCT-002 English Smoke

- Command: `node dist/quant-v4/pct-002.test.mjs`
- Result: passed

### Multilingual Pilot Audit

Commands:

- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002-multilingual-pilot-audit.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`
- `node dist/quant-v4/pct-002-multilingual-pilot-audit.mjs`

Result: passed

Observed audit summary:

- JSON parse: passed
- Forced pilot audit: passed
- Placeholder parity: passed
- Required placeholders: passed
- Rendered unresolved placeholders: `0`
- English leakage in hi/pa stems: `0`
- English leakage in hi/pa explanations: `0`
- `metadata.language`: passed
- Explanation localization: passed for the pilot CPs
- Forced non-English non-allowlisted QL: blocked
- Random hi/pa selection: restricted to `PCT-QL-001` to `PCT-QL-004`

## Remaining Blockers

- Hindi/Punjabi frontend exposure remains off.
- `PCT-QL-005` onward are still outside the backend pilot allowlist.
- Entity-library-backed labels are currently wired only for PCT-002 pilot QLs, not the full PCT-002 corpus.
