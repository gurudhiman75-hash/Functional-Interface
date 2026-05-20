# Quant V2 Corpus Audit Export Report

## Scope

This pass adds a separate large-scale audit/export lane for quant-v2 percentage generation. It does not change normal admin generation, canonical reasoning, topology generation, realization, or persistence.

## Implemented

- Added corpus audit presets for SSC percentage, banking relational, Punjabi realism, compactness stress, and difficulty distribution audits.
- Added export profiles: `audit_light`, `multilingual_review`, `realism_review`, `topology_audit`, and `editorial_pdf`.
- Added optional multilingual explanation export controlled by export profile or explicit UI/CLI toggle.
- Added a stream-based corpus exporter that writes:
  - `corpus.json`
  - `corpus.txt`
  - `audit-summary.json`
  - `sample-preview.json`
- Added progressive export status through an in-memory audit job manager.
- Added API endpoints under `/api/generator/corpus-audit/*`.
- Added `pnpm corpus:audit -- --count=1000` for command-line offline exports.
- Added a visible Corpus Audit Tools panel in the existing admin generator page.
- Added download endpoints for `corpus.json`, `corpus.txt`, `audit-summary.json`, and `sample-preview.json`.
- Added a QA sampling view so editors can preview generated corpus samples without opening large files.
- Added export size estimation in the admin UI before generation.
- Added `corpus-audit-validator.ts` for repeated structure, topology dominance, generic object wording, numeric scale anomalies, and multilingual coverage checks.
- Added `corpus-audit-export.test.ts`, including export integrity, background job status, and 20,000-sample stress generation.

## Export Shape

Each JSON item includes:

- English, Hindi, and Punjabi question/explanation/options
- topology metadata
- reasoning graph
- semantic metadata
- validator reports
- traps
- difficulty metadata
- compactness profile
- semantic anchors
- corpus realism report
- optional SVG rendering payload
- optional `explanationHi` and `explanationPa` fields when the export profile includes multilingual explanations

## Summary Analytics

`audit-summary.json` includes:

- topology distribution
- subtype distribution
- difficulty distribution
- compactness distribution
- domain distribution
- commercial object frequency
- realism score range and average
- validator failure counts
- repeated structure warnings
- multilingual coverage and script consistency
- multilingual explanation coverage
- fallback counts
- explanation compactness
- estimated export size

## Operational Notes

- Normal synchronous admin generation remains capped at 1-50 questions.
- The existing DB-backed generation job worker remains unchanged.
- Corpus audit jobs stream to disk and do not return giant API payloads.
- Export folders are created under `artifacts/api-server/exports/corpus-YYYY-MM-DD-HHmmss` by default when run from `artifacts/api-server`.
- PDF export remains intentionally optional and is not implemented in this pass; JSON/TXT are the primary audit formats.

## Validation

- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-audit`
- `pnpm --dir artifacts/api-server run corpus:audit -- --count=500`
- `pnpm --dir artifacts/api-server run corpus:audit -- --count=20000 --profile=multilingual_review --include-multilingual-explanations --no-svg`
- `pnpm --dir artifacts/api-server run build`
- `pnpm run build` from `artifacts/examtree`

## Remaining Gaps

- The audit job registry is process-local. It is suitable for internal audit runs, but multi-instance production hosting would need shared job state.
- Exports are written to local disk. Cloud/object-storage upload can be added later without changing the generation path.
- PDF export remains a future optional review format.
