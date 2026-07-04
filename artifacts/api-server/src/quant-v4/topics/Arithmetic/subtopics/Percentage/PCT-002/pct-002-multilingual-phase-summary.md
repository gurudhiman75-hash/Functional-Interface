# PCT-002 Multilingual Phase Summary

## Phase 0

- Shared language coverage extracted to `common/language-coverage.ts`
- PCT-002 refactored to use shared hi/pa allowlist gating
- PCT-002 refactored to use shared entity-label resolution

## Current Localized Coverage

- Localized hi/pa QLs: `PCT-QL-001` to `PCT-QL-020`
- Localized CPs:
  - `PCT-CP-001` to `PCT-CP-010`
- Localized explanation task patterns currently covered by the active batch:
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

## Remaining Blocked Coverage

- `PCT-QL-021` to `PCT-QL-150` remain English-only for hi/pa runtime
- Non-English frontend exposure remains off

## Next Sequential Step

- Continue PCT-002 with the next hi/pa batch starting at `PCT-QL-021`
- Keep batch size within `15–20` QLs
- Expand allowlist only after audit passes
