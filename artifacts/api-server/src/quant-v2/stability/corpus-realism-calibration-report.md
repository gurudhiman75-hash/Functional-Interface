# Quant V2 Corpus Realism Calibration Report

## Scope

This pass calibrates corpus-level realism and difficulty signals without changing canonical reasoning, topology selection, graph logic, or admin workflow routing.

## Implemented

- Added balanced corpus compactness bands: `ultra_compact`, `compact`, and `balanced`.
- Added a corpus realism governor for stem compactness, numeric scale, object realism, domain anchor, and difficulty layer checks.
- Added a corpus diversity validator for batch-level subtype balance, compactness balance, numeric scale, commercial object overuse, and difficulty coverage.
- Switched election, exam, and population totals to deterministic humanized pools instead of unbounded linear growth.
- Tightened election and population numeric pools to keep canonical stem and answer values visually manageable, with preferred values below 10 lakh.
- Added deterministic commercial object pools for bicycle, refrigerator, mobile phone, wheat bag, sugar packet, cooking oil tin, television, laptop, school bag, shirt, and rice bag.
- Replaced generic profit/loss stems with concrete object stems across English, Hindi, and Punjabi.
- Updated English election stems from generic winner wording to `winning candidate`.
- Updated Hindi election stems to use `विजयी उम्मीदवार`.
- Updated Punjabi election stems to use `ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ` and `ਯੋਗ` vote terminology instead of the more formal `ਵੈਧ`.
- Added `corpusRealism` validator propagation into quant-v2 admin payloads.

## Validation

- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-realism`
  - 20,000 multilingual percentage samples.
  - Validates compactness balance, numeric scale, commercial object realism, election terminology, Punjabi terminology, topology subtype diversity, and difficulty coverage.
- `pnpm --dir artifacts/api-server run test:quant-v2-realization-calibration`
  - 10,000 multilingual percentage samples.
- `pnpm --dir artifacts/api-server run test:quant-v2-admin-integration`
  - Confirms live admin quant-v2 payload compatibility.
- `pnpm --dir artifacts/api-server run test:quant-v2-multilingual-stem`
  - Confirms semantic multilingual stem realization remains intact.
- `pnpm --dir artifacts/api-server run build`
  - Passed. Existing unrelated duplicate `punjab_state` registry warning remains.

## Remaining Gaps

- Multi-layer relational percentage topologies were not added in this pass because that would modify topology generation. They remain the next bounded reasoning-expansion candidate.
- Some legacy golden/reference exports may still contain older wording until reference regeneration is intentionally run.
- Large distractor values can still exist in a few legacy trap formulas; this pass calibrated canonical stem/answer scale without rewriting the distractor engine.

## Readiness

The active quant-v2 admin path now has a measurable corpus-realism layer and stronger exam-style surface quality across English, Hindi, and Punjabi.

