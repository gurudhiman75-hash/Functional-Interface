# PCT-002 Multilingual Expansion Report

## Batch 1

- QL range: `PCT-QL-005` to `PCT-QL-020`
- CP coverage:
  - `PCT-CP-003` to `PCT-CP-010`
- Scope:
  - Hindi/Punjabi stems localized
  - runtime labels switched to entity references
  - Hindi/Punjabi explanation prose localized for covered task patterns
  - shared language coverage extracted for package-level allowlist enforcement

## Shared Infrastructure Changes

- Added `artifacts/api-server/src/quant-v4/common/language-coverage.ts`
- Moved PCT-002 non-English allowlist enforcement into the shared helper
- Moved shared entity-label resolution into the shared helper
- Preserved English label normalization for byte-stable English rendering

## Entity Library Additions

- `group-library.json`
  - `other_students`
  - `males`
  - `females`
  - `population`
- `object-library.json`
  - `books`
  - `reference_books`
  - `story_books`
- `financial-concept-library.json`
  - `rent`
  - `food`
  - `transport`
  - `monthly_expenses`
  - `food_expenses`
  - `transport_expenses`
  - `remaining`
  - `marketing`
  - `salaries`
  - `other_expenses`
  - `education`
- `unit-library.json`
  - `first_part`
  - `second_part`

## Allowlist Additions

- Added to PCT-002 hi/pa runtime allowlist:
  - `PCT-QL-005`
  - `PCT-QL-006`
  - `PCT-QL-007`
  - `PCT-QL-008`
  - `PCT-QL-009`
  - `PCT-QL-010`
  - `PCT-QL-011`
  - `PCT-QL-012`
  - `PCT-QL-013`
  - `PCT-QL-014`
  - `PCT-QL-015`
  - `PCT-QL-016`
  - `PCT-QL-017`
  - `PCT-QL-018`
  - `PCT-QL-019`
  - `PCT-QL-020`

## Expected QA Checks

- `node build.mjs`
- `node dist/quant-v4/pct-002.test.mjs`
- bundled `pct-002-multilingual-pilot-audit.ts`

## QA Results

- `node build.mjs`
  - Working directory: `artifacts/api-server`
  - Result: passed
- `node dist/quant-v4/pct-002.test.mjs`
  - Working directory: `artifacts/api-server`
  - Result: passed
- bundled multilingual audit
  - Result: passed
  - key checks:
    - placeholder parity passed
    - required placeholders passed
    - unresolved placeholders = `0`
    - hi/pa stem leakage = `0`
    - hi/pa explanation leakage = `0`
    - `metadata.language` passed
    - forced non-allowlisted hi/pa generation blocked
    - random hi/pa selection stayed inside the current allowlist

## Notes

- English Question Studio exposure remains unchanged.
- Non-allowlisted hi/pa generation must still fail explicitly.
- `PCT-QL-021` onward remain blocked for hi/pa until a later batch localizes them.
