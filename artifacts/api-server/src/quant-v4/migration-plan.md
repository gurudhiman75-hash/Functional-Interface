# PLATFORM-INF-002 Migration Plan

PLATFORM-INF-002 is additive. Existing Quant V4 packages continue unchanged.

## Completed now

- Created `shared/education/`.
- Added shared education libraries.
- Added versioned TypeScript contracts.
- Added optional traceability adapter.
- Added authoring and migration documentation.

## Future migration

1. New packages should reference education IDs during authoring.
2. Existing packages should migrate only during scheduled chapter work.
3. Auditors should later report strategy, shortcut, trap, realism, terminology, and pedagogy coverage.
4. Maturity gates should include education coverage only after packages have adopted the references.

## Detailed plan

See:

```text
shared/education/migration-plan.md
```
