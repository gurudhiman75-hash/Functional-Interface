# PCT-002 Multilingual Phase Summary

## Final State

- Phase status: complete
- Module: `PCT-002`
- Languages shipped in backend:
  - `en`
  - `hi`
  - `pa`
- Question Studio discovery:
  - `en` only

## Coverage

- Localized hi/pa QLs: `PCT-QL-001` to `PCT-QL-150`
- Localized CPs:
  - `PCT-CP-001`
  - `PCT-CP-003`
  - `PCT-CP-005`
  - `PCT-CP-006`
  - `PCT-CP-007`
  - `PCT-CP-008`
  - `PCT-CP-009`
  - `PCT-CP-010`
- Localized explanation task patterns:
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

## Runtime Guarantees

- Shared language gate is active through `common/language-coverage.ts`.
- English selection remains unchanged.
- Hindi/Punjabi random selection is restricted to fully localized QLs only.
- Forced non-English generation outside localized coverage still fails explicitly.
- `metadata.language` is correct for `hi` and `pa`.

## QA Snapshot

- Build: passed
- English PCT-002 smoke: passed
- PCT-002 multilingual audit: passed
- Leakage:
  - hi stems: `0`
  - pa stems: `0`
  - hi explanations: `0`
  - pa explanations: `0`
- Unresolved placeholders: `0`

## Remaining Product Constraint

- Hindi/Punjabi frontend enablement remains off by design.

## Next Sequential Step

- Keep `PCT-002` frozen and use it as the reference implementation for the next Percentage module migration phase.
