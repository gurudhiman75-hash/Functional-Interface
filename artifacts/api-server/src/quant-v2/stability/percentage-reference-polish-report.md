# Percentage Quant V2 Reference Polish Report

## Scope

This pass keeps the work focused on the existing percentage generator. It does not add platform systems, new admin pages, new question-bank flows, or cross-topic generation behavior.

## Implemented

- Wired the existing admin generator and corpus export request paths to pass `useScheduler` and `schedulerProfile`.
- Kept scheduler usage optional and batch-only; single-question generation remains unchanged.
- Added visible scheduler controls and a collapsed Scheduler Summary panel in the existing admin generator workflow.
- Strengthened scheduler duplicate pressure using topology-plus-percentage-vector keys, operation-chain fingerprints, semantic-anchor frequency, examiner-intent frequency, and stem-opening repetition.
- Added scheduler summary metadata for repeated topology vectors, repeated operation fingerprints, and repeated stem openings.
- Added stricter distractor intelligence metadata for `rounding_trap` and `one_step_shortcut_error`, plus stronger magnitude/reasoning-path checks.
- Rebuilt the teacher explanation normalizer as clean UTF-8 and expanded public rewrites for internal terms such as `Final value index`, `Reference value`, `Using inverse relation`, `Required value`, and `Remaining percentage`.
- Recalibrated commercial realism scoring with harder caps for internal terminology leakage, simple one-step templates, incomplete explanations, and excessive numeric scale.
- Tuned corpus-quality scoring so small curated mock sets remain strict while large 20k audit corpora are not unfairly treated like a finite 50-question paper.
- Added a batch duplicate validator for exact duplicates, topology-vector repeats, same opening plus topology, and same semantic object plus percentage relation.
- Replaced Hindi and Punjabi explanation renderers with clean UTF-8 native tables.
- Added semantic intent coverage for teacher-normalized labels such as `Relation index`, `Decrease percentage`, `Apply the next relation`, and `After the change, value`.
- Added localized explanation completion safety so Hindi/Punjabi cannot end on a label-only colon.
- Tightened runtime realism caps from actual localized validator failures.
- Reduced scheduled simple-template quota and increased retry pressure for repeated topology, operation, semantic anchor, answer pattern, and recent examiner intent.
- Added deterministic stem-opening variation for relational and mixture percentage stems.

## Admin Scheduler Wiring

- Existing UI: `artifacts/examtree/src/pages/admin-generator.tsx`
- Existing API route: `artifacts/api-server/src/routes/generator.ts`
- Existing generation engine: `artifacts/api-server/src/lib/core/generator-engine.ts`

When enabled for a batch, the admin request includes:

```json
{
  "useScheduler": true,
  "schedulerProfile": "ssc_mock"
}
```

The generator only activates R7 scheduling when:

- `count > 1`
- `useScheduler === true`
- `generationDomain === "quant-v2-percentage"`

## Sample Before / After

Before:

```text
Final value index =
Required value =
```

After:

```text
After the change, value =
Required answer =
```

Before:

```text
Take reference value as 100:
Remaining percentage =
```

After:

```text
Let the original value be 100:
Remaining part =
```

## Validation

- `pnpm --dir artifacts/api-server run test:quant-v2-admin-integration`
- `pnpm --dir artifacts/api-server run test:quant-v2-commercial-realism`
- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-scheduler`
- `pnpm --dir artifacts/api-server run test:quant-v2-semantic-coherence`
- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-audit`
- `pnpm --dir artifacts/api-server run build`
- `pnpm --dir artifacts/examtree run build`

All commands passed. The known duplicate `punjab_state` registry warning remains unrelated to this pass.

## Audit Samples

- 50-question scheduled sample: `artifacts/api-server/exports/percentage-polish-50c`
  - 50 unique fingerprints.
  - 0 repeated fingerprint share.
  - 0 scanned Hindi/Punjabi leakage matches for the audited English fragments.
  - Simple-template group reduced to 5/50.
  - Average realism: 80.16.
- 200-question scheduled sample: `artifacts/api-server/exports/percentage-polish-200-final`
  - 22 topology families.
  - Average realism: 80.23.
  - Multilingual consistency coverage: 1.0.
  - Remaining warning: topology-vector repetition is still visible at 200-question scale.

## Remaining Gaps

- Relational percentage families should continue to be expanded in the bounded P3 reasoning-expansion phase.
- The existing duplicate `punjab_state` registry warning should be cleaned separately.
- More real PYQ-derived cadence profiles can be added after the percentage reference topic is locked.
