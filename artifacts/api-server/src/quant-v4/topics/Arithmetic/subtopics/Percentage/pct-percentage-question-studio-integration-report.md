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

## Smarter Option Generation Patch

Goal:
- Improve distractor quality using the existing shared Quant V4 option-generation infrastructure.
- Avoid a parallel option system.
- Avoid hardcoded Percentage-only options in Question Studio UI.
- Avoid rewriting Percentage content unless a content bug is separately proven.

Files changed in this patch:
- `artifacts/api-server/src/quant-v4/shared/answers/option-generation.ts`
- `artifacts/api-server/src/quant-v4/shared/answers/option-generation.test.ts`
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-percentage-question-studio-integration-report.md`

Implementation notes:
- Extended `QuantV4OptionGenerationInput` with optional `context`.
- Passed package/task/stem/variables/traceability context from `toQuestionStudioPreview(...)` into `buildQuantV4AnswerOptions(...)`.
- Added context-aware filtering for bounded share/complement percentages so impossible options like `233%`, `300%`, `400%`, and `2400%` are rejected outside reverse-comparison contexts.
- Preserved reverse-comparison families where percentages above `100%` can be mathematically valid.
- Replaced `+ 1` / `- 1` symbolic filler for percentage-point composite answers with plausible percentage-point/relative-change variants.
- Improved text-comparison distractors by switching direction and varying amounts, while normalizing double-period endings.
- Kept integer/count answers on non-negative integer distractors.
- Kept decimal percentage distractors within reasonable precision and range.
- Strengthened weak-option filtering for `undefined`, `null`, `NaN`, MathJax suffix junk such as `$$...$$ 1`, and simple unevaluated filler expressions.
- Normalized option identity before deduping, so each generated question has exactly one canonical option after formatting normalization.

Targeted smoke:

```powershell
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
pnpm exec esbuild src/quant-v4/shared/answers/option-generation.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/option-generation.test.mjs
node dist/quant-v4/option-generation.test.mjs
```

Result:
- `quant-v4 option-generation smoke passed`

Fresh 500-question English Percentage `PCT-ALL` audit:
- Output file: `artifacts/generated-exports/quant-v4-percentage-pct-all-500-option-qa.json`
- Question count: `500`
- Weak filler option count: `0`
- `+ 1` / `- 1` option count: `0`
- `$$...$$ 1` MathJax suffix count: `0`
- Impossible `>100%` bounded share/complement option count: `0`
- Duplicate normalized-option question count: `0`
- Invalid correct-index count: `0`
- Non-unique correct-option count: `0`
- Missing-options count: `0`
- Placeholder/`undefined`/`null`/`NaN` text count: `0`

Additional check status:
- Quant V4 generation-engine bundle passed:
  - `pnpm exec esbuild src/quant-v4/generation-engine.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/generation-engine.option-qa.mjs`
- Repo-wide backend typecheck was run and still fails on broad pre-existing repository issues outside this patch, including knowledge generator typing, core domain-adapter unions, RatioAndProportion renderer imports, and route typing. No new option-generation or Percentage Question Studio errors were identified by the targeted bundle/smoke path.

## Non-Option Generated Output QA Patch

Goal:
- Fix the remaining generated-output blockers found after the smarter option-generation patch.
- Keep the active Question Studio Percentage path on Quant V4 only.
- Keep the clean export limited to question, options, and explanations for student/review use.

Files changed in this patch:
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/solver.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/explanation-renderer.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/foundation/solver.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/pct-005.test.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/foundation/solver.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/foundation/explanation-renderer.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/foundation/explanation-renderer.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-percentage-question-studio-integration-report.md`

## Remaining Issues Found After Smarter Option Patch
- PCT-002 ratio-to-percentage questions could use the second ratio term even when the stem asked for the first named part.
- PCT-001 explanation lines could render nested display math such as `=$$answer$$$$`.
- Some English preview text still had article/agreement artifacts such as `A output`, `a asset value`, and plural count wording.
- PCT-006/PCT-007 explanations still had placeholder-style formulas such as `\text{base}` or `\text{target difference}` in student-facing output.
- PCT-007 caselet explanations still contained internal/generic wording.
- PCT-005 count answers could be silently rounded.
- Long floating-point artifacts could enter final stems, such as binary-decimal residue in large mixture values.

## Fixes Applied
- Added explicit `targetPartIndex` handling for PCT-002 ratio-share questions, including first-part and second-part regression coverage.
- Hardened Question Studio explanation formatting so nested display delimiters are stripped before re-wrapping.
- Added narrow English preview polish for observed generated wording defects and long binary-decimal artifacts.
- Replaced PCT-006 placeholder formulas with concrete values from solver evidence.
- Reworked PCT-007 caselet and percentage-error explanations so final output uses student-facing calculation lines.
- Fixed PCT-007 drying/evaporation explanations so the stable solid/solute amount is computed instead of falling back to `0`.
- Changed PCT-005 count formatting so fractional count answers are not silently rounded unless the math itself is integral.

## Fresh 500-Question QA Results
Output file:
- `artifacts/generated-exports/quant-v4-percentage-pct-all-500-option-qa.json`

Metadata distribution from the same regenerated PCT-ALL run:
- `PCT-001`: `71`
- `PCT-002`: `71`
- `PCT-003`: `72`
- `PCT-004`: `71`
- `PCT-005`: `72`
- `PCT-006`: `71`
- `PCT-007`: `72`

Clean export audit:
- Total questions: `500`
- Exact duplicate stem groups: `8`
- Ratio-direction regression failures: `0`
- Broken MathJax explanation count: `0`
- Weak option count: `0`
- Duplicate normalized-option question count: `0`
- Grammar issue count: `0`
- Placeholder-style explanation count: `0`
- Generic/internal explanation count: `0`
- Silent rounded-count examples: `0`
- Floating precision artifact count: `0`
- Unresolved placeholder count: `0`
- `undefined` / `null` / `NaN` in student-facing fields: `0`

## Package-Specific Smoke Results
Generated files:
- `artifacts/generated-exports/quant-v4-percentage-pct-001-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-002-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-003-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-004-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-005-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-006-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-007-20-option-qa.json`

For each `PCT-001` to `PCT-007` 20-question smoke:
- Question count: `20`
- Broken MathJax explanation count: `0`
- Weak option count: `0`
- Duplicate normalized-option question count: `0`
- Grammar issue count: `0`
- Placeholder-style explanation count: `0`
- Generic/internal explanation count: `0`
- Floating precision artifact count: `0`
- Unresolved placeholder count: `0`
- `undefined` / `null` / `NaN` in student-facing fields: `0`

Additional verification:
- `PCT-002 foundational recovery test passed.`
- `PCT-005 first-pass implementation test passed.`
- `PCT-007 implementation test passed.`
- `pnpm --dir artifacts/api-server run build` passed.
- Quant V4 generation-engine bundle passed.

## Earlier Caveats
- Public student/mock-test catalog exposure is still not enabled.
- Hindi/Punjabi are still not exposed for Percentage in Question Studio and were not edited in this QA pass.
- `PCT-001` duplicate rate `24.70%` remains an editorial/manual-review signal, not a runtime blocker.
- Legacy Percentage code still exists elsewhere in the repository, but no active Question Studio Percentage path routes through it.
- Repo-wide backend/frontend typechecks were not reopened for this follow-up; previously documented repo-wide typecheck issues remain outside this Percentage Question Studio patch.
- Generated QA export files under `artifacts/generated-exports/` are review artifacts and should not be committed unless intentionally requested.

## Residual QA Patch After Package Smoke Review

Files changed in this residual QA pass:
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/foundation/parameter-generator.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/pct-005.test.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/question-studio-residual-qa.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-percentage-question-studio-integration-report.md`

What changed:
- Removed the over-broad preview rewrite that could mutate `School A attendance` into `School An attendance`.
- Fixed the `PCT-005` school-comparison source labels to generate `School A's attendance` and `School B's attendance` directly.
- Added a regression in `PCT-005` so this exact grammar leak is caught in package tests.
- Tightened the residual QA audit so it reports only real blockers instead of valid multi-step explanation patterns.
- Reconfirmed the existing `PCT-001` discount guard that keeps discount amount below base and discount percent within realistic bounds for the audited discount-percent family.

## Additional Audit Rules Added

The residual QA audit now explicitly checks:
- impossible discount/reduction amount greater than or equal to the base amount for discount-style stems
- bounded percentage options above `100%` for share-of-whole, ratio-share, component-share, complementary-share, and revised-share families
- exact grammar bad phrases, including `School An attendance`, while avoiding false positives like `number of internet users is`
- double-period formatting in stem, explanation, and options
- count-context decimal final answers
- silent rounding in count contexts when the stem does not ask for approximation
- repeated identical calculation lines, while ignoring legitimate repeated helper percent-conversion lines
- missing repeated-reduction intermediate steps only for true repeated-reduction final-value stems

## Fresh Smoke Results

Artifacts generated:
- `artifacts/generated-exports/quant-v4-percentage-pct-all-500-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-all-500-clean.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-001-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-002-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-003-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-004-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-005-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-006-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-007-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-residual-qa-summary.json`
- `artifacts/generated-exports/quant-v4-percentage-residual-qa-run.log`

Fresh 500-question `PCT-ALL` English audit:
- Question count: `500`
- Weak filler options: `0`
- `+ 1` / `- 1` options: `0`
- MathJax suffix junk: `0`
- Duplicate normalized-option questions: `0`
- Invalid correct-index questions: `0`
- Non-unique correct-option questions: `0`
- Missing-options questions: `0`
- Runtime placeholder / `undefined` / `null` / `NaN`: `0`
- Bounded-percentage `>100%` blockers: `0`
- Impossible discount blockers: `0`
- Grammar blockers: `0`
- Double-period blockers: `0`
- Count-decimal blockers: `0`
- Silent-rounding blockers: `0`
- Repeated-calculation blockers: `0`
- Repeated-reduction blockers: `0`

Fresh 20-question English package smokes:
- `PCT-001`: all blocker counters `0`
- `PCT-002`: all blocker counters `0`
- `PCT-003`: all blocker counters `0`
- `PCT-004`: all blocker counters `0`
- `PCT-005`: all blocker counters `0`
- `PCT-006`: all blocker counters `0`
- `PCT-007`: all blocker counters `0`

Targeted checks run in this pass:

```powershell
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/pct-005.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-005.test.mjs
node dist/quant-v4/pct-005.test.mjs

pnpm exec esbuild src/quant-v4/shared/answers/option-generation.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/option-generation.test.mjs
node dist/quant-v4/option-generation.test.mjs

pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/question-studio-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/question-studio-residual-qa.mjs
node dist/quant-v4/question-studio-residual-qa.mjs
```

```powershell
cd C:\Users\gurbaj\Downloads\f
pnpm --dir artifacts/api-server run build
```

Observed results:
- `PCT-005 first-pass implementation test passed.`
- `quant-v4 option-generation smoke passed`
- residual QA rerun completed with all blocker counters at `0`
- backend build passed

## Remaining Caveats

- No commit or push was performed in this residual QA pass.
- Public student/mock-test catalog exposure is still not enabled.
- Hindi/Punjabi were not edited and remain disabled for Percentage in Question Studio.
- Generated QA export artifacts under `artifacts/generated-exports/` are review outputs and should stay uncommitted unless explicitly requested.
- Broader repository typecheck issues outside the Percentage Question Studio path remain out of scope for this pass.

## Final Status
Percentage Question Studio generation has clean options and generated English output is ready for manual question-bank review. Quant V4 Percentage remains the only active Percentage generation source in Question Studio, with `PCT-ALL` full-topic generation and package-specific `PCT-001` to `PCT-007` generation verified. No known generated-output blockers remain in the fresh uploaded-style package smokes.

## Final Export Cleanup
- Fixed the last normal-export polish issues found after manual review of the residual smoke files.
- Kept the work local and uncommitted.
- Did not enable Percentage for the public student catalog.
- Did not reopen Hindi/Punjabi package content.
- Did not reopen the shared option-generation implementation beyond smoke verification.

## Manual Review Issues Missed by Audit
- Some PCT-002 alias questions could still inherit `students` as the final `$$\text{...}=...$$` label even when the visible stem context was `usage`, `budget`, `payroll`, or another non-student context.
- Normal Question Studio export still serialized `validationSummary.messageAuditWarnings`, even when the validation state was fully passed.
- `metadata.language` could still fall through to an empty string when the preview payload did not explicitly carry language metadata.
- Residual grammar issues were still slipping through because the audit did not explicitly check the exact leaked phrases seen in the 500-question export.
- Exact duplicate stems in the 500-question mixed export were not being measured explicitly.

## Fixes Applied
- `artifacts/api-server/src/quant-v4/generation-engine.ts`
  - Added explicit `language: "en"` on Percentage Question Studio preview items.
  - Extended English preview polishing to catch the manual-review phrases:
    - repeated adjacent words like `booking booking`
    - lower-case entity starts such as `salary A ...` / `production A ...`
    - `A train has ... students`
    - `The whole students corresponds ...`
    - `the total employees is ...`
    - `A Product A ...` / `A Warehouse A ...`
- `artifacts/examtree/src/lib/export-engine.ts`
  - Removed `messageAuditWarnings` from normal export validation summaries.
  - Kept warning/audit detail available only in debug-oriented export modes.
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator.ts`
  - Added missing alias overrides so non-student contexts such as `usage`, `payroll`, `budget`, `stock`, and `yearly output` no longer inherit `targetLabel: "students"`.
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/question-studio-residual-qa.ts`
  - Added residual checks for:
    - semantic final-label mismatch
    - normal-export warning leakage
    - `metadata.language !== "en"`
    - duplicate stem groups
    - the exact grammar leaks from manual review

## Final QA Results
Verification rerun:

```powershell
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
node build.mjs

.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-005/pct-005.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-005.test.mjs
node dist/quant-v4/pct-005.test.mjs

.\node_modules\.bin\esbuild.CMD src/quant-v4/shared/answers/option-generation.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/option-generation.test.mjs
node dist/quant-v4/option-generation.test.mjs

.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/question-studio-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/question-studio-residual-qa.mjs
node dist/quant-v4/question-studio-residual-qa.mjs
```

Observed results:
- Backend build passed.
- `PCT-005` targeted smoke passed.
- Shared option-generation smoke passed.
- Fresh mixed `PCT-ALL` 500-question English export regenerated successfully.
- Fresh 20-question English package smokes for `PCT-001` to `PCT-007` regenerated successfully.
- Residual audit results for the fresh 500-question export:
  - `semanticLabelMismatchCount = 0`
  - `validationWarningLeakCount = 0`
  - `metadataLanguageMismatchCount = 0`
  - `grammarIssueCount = 0`
  - `weakOptionCount = 0`
  - `duplicateStemGroupCount = 6`
  - `duplicateStemQuestionCount = 12`

Generated artifacts refreshed:
- `artifacts/generated-exports/quant-v4-percentage-pct-all-500-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-all-500-clean.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-001-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-002-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-003-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-004-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-005-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-006-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-pct-007-20-option-qa.json`
- `artifacts/generated-exports/quant-v4-percentage-residual-qa-summary.json`
- `artifacts/generated-exports/quant-v4-percentage-residual-qa-run.log`

## Remaining Editorial Caveats
- Duplicate stems are not zero in the fresh 500-question mixed export.
- Current measured duplicate-stem footprint is:
  - `6` duplicate stem groups
  - `12` total questions involved
- This is now explicitly audited and documented, but not yet eliminated through seed/QL de-duplication logic.
- No commit or push was performed in this cleanup pass.
