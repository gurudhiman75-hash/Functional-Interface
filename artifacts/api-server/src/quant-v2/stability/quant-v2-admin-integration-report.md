# Quant-v2 Admin Adapter Integration Report

## Integrated Path

The live admin generator now routes percentage patterns through a clean adapter boundary:

Admin Generator -> `/api/generator/pattern` -> `generateFromPattern()` -> DomainAdapter registry -> `quant-v2-percentage` adapter -> quant-v2 canonical problem -> reasoning graph -> editorial realization -> English/Hindi/Punjabi localization -> SVG pedagogy -> validators/metrics -> existing admin question payload.

## What Changed

- Added `quant-v2-percentage` as a generation domain.
- Added a feature-flagged quant-v2 percentage detector.
- Added `createQuantV2PercentageQuestionCandidate()` as the admin-compatible bridge.
- Preserved the legacy `quant` adapter and old percentage generator for fallback.
- Preserved existing admin request, QA, regeneration, and save-to-bank workflows.
- Added optional quant-v2 metadata without requiring a database migration.

## Metadata Now Flowing Through Admin QA

- canonical percentage problem
- reasoning graph
- topology metadata
- semantic answer metadata
- calibrated quality metrics
- validator reports
- English/Hindi/Punjabi realizations
- SVG rendering bundle
- pedagogical and realism metrics

## Legacy Systems Still Present

- Legacy quant percentage scenarios remain in `src/lib/quant-scenarios`.
- Legacy native percentage realization remains in `src/lib/realizers`.
- Non-percentage quant generation still uses the original `quant` DomainAdapter.

## Fallback Behavior

Set `QUANT_V2_PERCENTAGE_ENABLED=legacy`, `false`, `off`, or `0` to route percentage patterns back to the legacy quant adapter.

## Remaining Cleanup Candidates

- Move persisted quant-v2 artifacts into first-class DB columns after production usage confirms payload shape.
- Retire legacy percentage motif factories only after admin corpus QA signs off.
- Add dedicated admin filtering for quant-v2 topology, language coverage, and SVG status.
