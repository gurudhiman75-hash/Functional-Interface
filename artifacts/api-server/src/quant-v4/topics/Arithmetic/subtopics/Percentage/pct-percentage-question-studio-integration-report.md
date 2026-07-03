# Percentage Question Studio Integration Report

## Goal
- Integrate Quant V4 `Arithmetic -> Percentage` into Question Studio only.
- Keep Quant V4 Percentage as the only active Percentage generation source in Question Studio.
- Improve the actual Question Studio generation/export quality, not just the registry wiring.

## Active Path
Question Studio -> `/api/generator/pattern` or `/api/generator/generate` -> Quant V4 generation API -> Quant V4 Percentage runtime -> `PCT-001` to `PCT-007`

Current Question Studio behavior supports both:
- Full Percentage generation through the virtual `PCT-ALL` selector.
- Package-specific generation through `PCT-001` to `PCT-007`.

## Sample Output QA Findings
The original Question Studio sample exposed real integration-quality issues:
- Full-topic generation was effectively locked to `PCT-001`-style output instead of rotating across `PCT-001` to `PCT-007`.
- Package batches were pinned to one canonical problem per run.
- Export JSON repeated raw/internal structures such as `questionPackage`, `traceability`, `semanticMetadata`, `validation`, and `debugMetadata`.
- Explanation output surfaced raw renderer/debug formatting instead of a clean Question Studio review format.
- Symbolic/text-comparison answers produced weak distractors such as negative clones and `+ 1` / `- 1` variants.
- Passed validation checks still carried failure-sounding messages such as `Missing translation...` and `Broken Unicode...`.
- Normal export exposed semantic/debug fields that were not appropriate for the student/review payload.

## Fixes Applied

### Backend runtime
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
  - Added a mixed Percentage selector path via `PCT-ALL`.
  - Added mixed full-topic batch sampling across all active Percentage packages.
  - Rotated canonical-problem selection inside full-topic batches.
  - Rotated canonical-problem selection inside package-specific batches when no explicit CP is requested.
  - Cleaned Question Studio explanation formatting into prose + `$$...$$` display-math blocks.
  - Kept package-specific generation locked to the requested package while allowing internal CP/QL/task variety.

- `artifacts/api-server/src/routes/generator.ts`
  - Passed `domain`, `topic`, and `subtopic` through to Quant V4 generation.
  - Kept Question Studio on the Quant V4 path for both mixed Percentage and specific-package requests.

### Option / answer shaping
- `artifacts/api-server/src/quant-v4/shared/answers/option-generation.ts`
  - Improved symbolic answer handling so MathJax-wrapped percentages/fractions get real numeric/fraction distractors.
  - Added comparison-aware textual distractors for answers like `Town B is greater by 390 people.`
  - Filtered weak fallback options such as negative clones and `+ 1` / `- 1` filler when they are not legitimate.
  - Preserved MathJax formatting consistency for generated distractors.

### Frontend Question Studio / export
- `artifacts/examtree/src/pages/admin-generator.tsx`
  - Added the virtual `PCT-ALL` registry selector for full Percentage generation.
  - Preserved package-specific selectors for `PCT-001` to `PCT-007`.
  - Continued enforcing English-only Percentage generation in Question Studio via supported-language metadata.

- `artifacts/examtree/src/lib/export-engine.ts`
  - Switched normal JSON export to a clean review payload.
  - Kept `options`, `correctIndex`, package metadata, and validation summary visible.
  - Removed raw `questionPackage` dumping from normal export.
  - Kept reasoning/traceability/debug blocks out of normal export unless the export mode explicitly asks for them.
  - Added validation message sanitization/audit so passed checks do not surface failure-sounding messages in exported summaries.

## Files Changed
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
- `artifacts/api-server/src/quant-v4/shared/answers/option-generation.ts`
- `artifacts/api-server/src/routes/generator.ts`
- `artifacts/examtree/src/pages/admin-generator.tsx`
- `artifacts/examtree/src/lib/export-engine.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-percentage-question-studio-integration-report.md`

## Old Generation Path Audit
- `artifacts/api-server/src/routes/generator.ts`
  - Old role: legacy async/manual generator job entry points.
  - Action: left physically present but disconnected.
  - Result: those endpoints return `410`, so they are not part of the active Question Studio Percentage path.

- Legacy Percentage generator code under older engines
  - Old role: historical/non-Quant-V4 Percentage generation.
  - Action: left in repo but not reachable from the active Question Studio Percentage path.
  - Reason: unrelated topics and archival code still exist in the repository, but Question Studio Percentage now routes through Quant V4 only.

## Topic Key / Metadata
- Subject: `Quant`
- Topic group: `Arithmetic`
- Subtopic: `Percentage`
- Source: `quant-v4`
- Full-topic selector: `PCT-ALL`
- Package selectors:
  - `PCT-001`
  - `PCT-002`
  - `PCT-003`
  - `PCT-004`
  - `PCT-005`
  - `PCT-006`
  - `PCT-007`
- Supported Question Studio language for Percentage: `["en"]`
- Metadata exposed in clean export:
  - `packageId`
  - `archetypeId`
  - `canonicalProblemId`
  - `questionLanguageId`
  - `explanationId`
  - `taskKind`
  - `difficulty`
  - `language`
  - `generationBackend`
  - `packageSource`
  - `questionId`
  - `seed`

## PCT Package Support
- Full Percentage generation: supported through `PCT-ALL`.
- Specific package generation: supported through `PCT-001` to `PCT-007`.
- `PCT-007` remains active in the runtime and is included in both registry and mixed-batch generation.

## Full Percentage Export Smoke
Command path:
- Local bundled smoke via temporary workspace script using:
  - Quant V4 `generateQuestion(...)`
  - Question Studio `createQuestionExport(...)`

100-question English mixed smoke results:
- Package distribution:
  - `PCT-001`: 14
  - `PCT-002`: 14
  - `PCT-003`: 15
  - `PCT-004`: 14
  - `PCT-005`: 14
  - `PCT-006`: 15
  - `PCT-007`: 14
- Canonical-problem distribution covered all 10 active CP buckets across the Percentage chapter.
- `questionLanguageId` coverage was broad across the batch; the smoke produced a large varied QL spread rather than a tiny repeating subset.
- `taskKind` coverage was broad and multi-package, not locked to comparison-only tasks.
- No unresolved placeholders detected in stem/options/explanation.
- No weak distractor pattern remained in the audited 100-question export sample.
- Exact duplicate stems detected: `1`
- Validation failures: `0`

Normal JSON export audit for the same 100-question batch:
- `count` matched `questions.length`
- every question had `packageId`
- every question had `options`
- no `questionPackage` raw dump remained in normal export
- no debug block appeared in normal `content="explanations"` export

## Package-Specific Smoke
English 10-question smoke per package:
- `PCT-001`: package lock correct; CP variety `6`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-002`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-003`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-004`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-005`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-006`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.
- `PCT-007`: package lock correct; CP variety `10`; QL variety `10`; task-kind variety `10`; no unresolved placeholders; no weak options.

## Export Format
Normal Question Studio export now behaves like a review/student payload:
- `stem`
- `options`
- `correctIndex`
- `answer`
- `explanation`
- clean metadata block
- validation summary

Reasoning/traceability/debug structures are kept out of normal export by default.
Those details remain available only when an export mode explicitly requests reasoning/traceability-level data.

## Smoke Test Results
- Full mixed Percentage generation passed.
- `PCT-001` generation passed.
- `PCT-002` generation passed.
- `PCT-003` generation passed.
- `PCT-004` generation passed.
- `PCT-005` generation passed.
- `PCT-006` generation passed.
- `PCT-007` generation passed.
- Invalid package handling returned: `Unknown Quant V4 package: PCT-999`
- Normal export no longer includes the raw repeated debug payload in `content="explanations"` mode.

## Frontend Smoke Test Results
- Percentage appears through a single Quant V4 registry path.
- Mixed Percentage and package-specific selection are both available from the registry selector.
- Non-English selection remains disabled for Percentage by supported-language metadata.
- Clean export payload generation passed.
- Vite production build passed.
- No duplicate active Percentage generator path was left in the Question Studio integration.

## Runtime Tests
- `PCT-001 Phase C test passed. Duplicate rate: 24.70%.`
- `PCT-002 foundational recovery test passed.`
- `PCT-003 first-pass implementation test passed.`
- `PCT-004 first-pass implementation test passed.`
- `PCT-005 first-pass implementation test passed.`
- `PCT-006 implementation test passed.`
- `PCT-007 implementation test passed.`

## Tests
Commands run:

```powershell
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
node build.mjs

$packages = @('PCT-001','PCT-002','PCT-003','PCT-004','PCT-005','PCT-006','PCT-007')
foreach ($pkg in $packages) {
  $src = "src/quant-v4/topics/Arithmetic/subtopics/Percentage/$pkg/$($pkg.ToLower()).test.ts"
  $out = "dist/quant-v4/$($pkg.ToLower()).test.mjs"
  .\node_modules\.bin\esbuild.CMD $src --bundle --platform=node --format=esm --outfile=$out
  node $out
}
```

```powershell
cd C:\Users\gurbaj\Downloads\f\artifacts\examtree
pnpm run build
```

```powershell
cd C:\Users\gurbaj\Downloads\f
artifacts\api-server\node_modules\.bin\esbuild.CMD tmp\pct-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=tmp\pct-question-studio-smoke.mjs
node tmp\pct-question-studio-smoke.mjs
```

Observed results:
- Backend build passed.
- Frontend build passed after rerunning outside the sandbox because in-sandbox Vite/esbuild hit `spawn EPERM`.
- Mixed Percentage smoke passed.
- Package-specific Percentage smoke passed.

## Build / Check Status
- Backend build passed with `node build.mjs`.
- Frontend Vite build passed with `pnpm run build` after an out-of-sandbox rerun because in-sandbox `esbuild` hit `spawn EPERM`.
- Repo-wide backend/frontend typechecks were not reopened in this pass; the previously documented repo-wide typecheck failures remain a known pre-existing caveat and are not attributed to this Percentage integration patch.

## Remaining Caveats
- Public student/mock-test catalog exposure is still not enabled.
- Hindi/Punjabi are still not exposed for Percentage in Question Studio.
- `PCT-001` duplicate rate `24.70%` remains an editorial/manual-review signal, not a runtime blocker.
- Legacy Percentage code still exists elsewhere in the repository, but no active Question Studio Percentage path routes through it.
- No Percentage content-bank JSON files, solvers, explanation renderer files, or Hindi/Punjabi content files were edited in this integration pass.

## Final Status
Percentage Question Studio integration complete; Quant V4 Percentage is the only active Percentage generation source, and Question Studio now produces clean, varied, export-safe English Percentage output from `PCT-001` to `PCT-007`.
