# PCT-002 SSC-Realism Editorial Review

## Scope

Reviewed:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-content-002-phase-a-expansion-matrix.md`

This review is for ExamTree's question-first practice model. The goal is not classroom-style teaching. The goal is high-quality SSC / Banking / Punjab-state practice questions with simple, detailed explanatory solutions after the attempt.

No runtime, solver, validator, generator, registry, Hindi, Punjabi, explanation, or PCT-001/PCT-003+ files were changed in this pass.

## Current Shape

PCT-002 is an older foundation-ready package, not the newer PCT-006/PCT-007 500-QL package shape.

Observed English QL shape:

- 10 CPs
- 50 English QL templates
- 5 QLs per CP
- QL IDs are not ordered CP-by-CP in a modern contiguous layout; this is existing legacy layout and should not be changed casually.

The existing Phase A matrix states that PCT-002's Stage 1 target was 35-40 effective families, with emphasis on table, survey, ledger, and distribution situations. It also states that the target is not raw QL count, and that new families must be genuinely different educational situations rather than noun swaps.

## Overall Verdict

`Needs targeted English editorial polish and likely Stage 1 expansion before manual question-bank review.`

PCT-002 is structurally useful and most stems are mathematically clear, but it is not yet at the PCT-006/PCT-007 polish standard. The current English library is compact and contains several generic/artificial shells.

Recommended next action:

1. Do an English-only editorial polish of existing 50 QLs.
2. Do not expand yet unless we approve the Stage 1 matrix direction.
3. After existing-stem polish, rerun JSON parse, duplicate audit, placeholder audit, render audit, and bundled PCT-002 test if available.
4. Then decide whether to perform Stage 1 effective-family expansion.

## CP-Level Realism Scores

| CP | Focus | Score | Notes |
|---|---|---:|---|
| PCT-CP-001 | Whole from Part | 3.5/5 | Clear base recovery. Some generic placeholder-heavy wording. Needs exam-like contexts. |
| PCT-CP-002 | Another Percentage from Known Percentage | 2.5/5 | Has artificial shells like bank statement/telecom note. Needs more natural exam-practice wording. |
| PCT-CP-003 | Percentage from Part and Whole | 4/5 | Mostly direct, clear, and mock-test suitable. Minor grammar/context polish only. |
| PCT-CP-004 | Reverse Percentage Mapping | 3.5/5 | Formula-clear. Some stems are generic and can better state recovered base. |
| PCT-CP-005 | Ratio to Percentage Conversion | 4/5 | Good practice relevance. Context variety is acceptable for the compact shape. |
| PCT-CP-006 | Complementary Percentage | 3.5/5 | Clear concept. One grammar issue and possible placeholder-context risk. |
| PCT-CP-007 | Difference Between Percentage Parts | 3/5 | Should prefer `percentage-point difference` over vague `percentage difference`. |
| PCT-CP-008 | Percentage Partition | 3/5 | Mathematically clear but includes report/roster shells. Needs more natural statements. |
| PCT-CP-009 | Missing Percentage | 2.5/5 | Several artificial report/summary shells. Needs focused polish. |
| PCT-CP-010 | Multi-category Percentage Distribution | 3/5 | Clear but generic; final wording `Find the value of {targetLabel}` can be improved. |

## Weak Stem Watchlist

### PCT-CP-002

Target IDs:

- `PCT-QL-003`
- `PCT-QL-004`

Issues:

- `A bank statement says...` is artificial.
- `A telecom usage note says...` is artificial and may not match all placeholder combinations.

Suggested style:

- `In a monthly account, {knownRate}% of the {wholeLabel} is {valuePrefix}{knownValue}. Find {targetRate}% of the same {wholeLabel}.`
- `If {knownRate}% of the total usage is {knownValue}, find the value corresponding to {targetRate}% of the same total.`

### PCT-CP-006

Target IDs:

- `PCT-QL-036`
- possible `PCT-QL-012`

Issues:

- `If {knownRate}% students are {partLabel}` should be `If {knownRate}% of the students are {partLabel}`.
- `income is kept as {partLabel}` can sound awkward depending on the generated label.

Suggested style:

- `If {knownRate}% of the students are {partLabel}, find the percentage of {complementLabel}.`
- `If {knownRate}% of the income is saved as {partLabel}, what percentage remains for {complementLabel}?` only if labels support this safely.

### PCT-CP-007

Target IDs:

- `PCT-QL-014`
- `PCT-QL-041`

Issue:

- `percentage difference` can be interpreted as relative percentage difference. For this CP, the intended answer is likely percentage-point difference.

Suggested style:

- Use `difference in percentage points` or `difference between the two shares`.

### PCT-CP-008

Target IDs:

- `PCT-QL-042`
- `PCT-QL-043`

Issues:

- `A survey roster lists...` is a bit artificial.
- `A stock of ... is divided into...` is acceptable but can be more exam-like.

Suggested style:

- `A survey covers {totalValue} {wholeLabel}. It includes...`
- `A warehouse has {totalValue} {wholeLabel}, of which...`

### PCT-CP-009

Target IDs:

- `PCT-QL-045`
- `PCT-QL-046`
- `PCT-QL-047`

Issues:

- `A survey shows...` is acceptable but generic.
- `belongs to` is weak for election/report contexts.
- `A result summary shows...` is an artificial wrapper.

Suggested style:

- `In a survey, {rate1}% chose {partLabel}, {rate2}% chose {otherLabel}, and {rate3}% chose {thirdLabel}. Find the remaining percentage for {complementLabel}.`
- `In an election report, {rate1}% of votes went to {partLabel}, {rate2}% to {otherLabel}, and {rate3}% to {thirdLabel}. Find the remaining percentage for {complementLabel}.`
- `In a result distribution, {rate1}% are {partLabel}, {rate2}% are {otherLabel}, and {rate3}% are {thirdLabel}. Find the percentage of {complementLabel}.`

### PCT-CP-010

Target IDs:

- `PCT-QL-049`
- `PCT-QL-050`

Issues:

- `A district summary lists... It records...` is understandable but report-like.
- `Find the value of {targetLabel}` is vague; prefer `Find the number of {targetLabel}` or `Find the amount spent on {targetLabel}` depending on value prefix/context.

Suggested style:

- `In a district survey of {totalValue} {wholeLabel}, ... Find the number of {targetLabel}.`

## Robotic Shell List

High-confidence shells to reduce:

- `A bank statement says...`
- `A telecom usage note says...`
- `A survey roster lists...`
- `A result summary shows...`
- `A district summary lists... It records...`

These are not fatal, but PCT-006/PCT-007 polish showed that removing such wrappers makes stems feel more like real mock-test questions.

## Boundary Check

No major boundary drift found. PCT-002 stays inside percentage recovery/share/distribution and does not drift into full profit-loss, SI-CI, alligation, or full DI.

## Recommended Patch Scope

Patch only:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json`

Do not touch:

- solver
- validator
- generator
- registry
- runtime
- tests
- explanations
- Hindi/Punjabi files
- PCT-001 or PCT-003 to PCT-007

Hard constraints:

- Preserve all QL IDs.
- Preserve CP mapping.
- Preserve placeholders.
- Preserve difficulty labels unless a typo makes it unavoidable.
- Preserve JSON structure.
- Do not expand from 50 QLs in this polish pass.

## Verification Required After Patch

Run:

- JSON parse
- English QL count
- per-CP count
- exact duplicate English template audit
- placeholder consistency audit
- rendered-stem unresolved-placeholder audit
- bundled PCT-002 test if it exists

## Final Call

`PCT-002 - Needs tiny English editorial polish before Stage 1 expansion or manual review.`

Do not mark PCT-002 ready for manual question-bank review yet.

## Final Editorial Polish

- Files changed:
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-002-ssc-realism-review.md`
- QL IDs patched:
  - Editorial polish targets:
    - `PCT-QL-003`
    - `PCT-QL-004`
    - `PCT-QL-014`
    - `PCT-QL-036`
    - `PCT-QL-041`
    - `PCT-QL-045`
    - `PCT-QL-046`
    - `PCT-QL-047`
    - `PCT-QL-049`
    - `PCT-QL-050`
  - Additional in-file placeholder repairs needed to rerun the bundled test:
    - `PCT-QL-016`
    - `PCT-QL-020`
    - `PCT-QL-028`
    - `PCT-QL-029`
    - `PCT-QL-032`
    - `PCT-QL-037`
    - `PCT-QL-038`
    - `PCT-QL-044`
- Audit results:
  - JSON parse: `passed`
  - English QL count: `50`
  - Per-CP count: `5` for each of `PCT-CP-001` to `PCT-CP-010`
  - Exact duplicate English template groups: `0`
  - Required-placeholder audit: `0` missing required placeholders after the patch
  - Extra placeholders not present in the registry: `6`
    - Remaining extra `valuePrefix` placeholders are pre-existing registry/content mismatches in:
      - `PCT-QL-002`
      - `PCT-QL-003`
      - `PCT-QL-006`
      - `PCT-QL-007`
      - `PCT-QL-016`
      - `PCT-QL-020`
  - Cross-language placeholder mismatch audit: `60`
    - This reflects existing Hindi/Punjabi coverage mismatch outside this English-only polish scope
  - Rendered-stem unresolved-placeholder audit: `0`
- Test result:
  - Bundled test build command:
    - `C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002.test.mjs`
    - Result: `passed`
  - Bundled test run command:
    - `node dist/quant-v4/pct-002.test.mjs`
    - Result: `failed`
  - Runtime failure reached:
    - `20 !== 50`
  - Cause identified:
    - The current non-English baseline is incomplete for the test's cross-language expectations:
      - `question-language.en.json = 50`
      - `question-language.hi.json = 20`
      - `question-language.pa.json = 20`
    - Hindi/Punjabi files were explicitly out of scope for this task, so this was not changed here.
- Final status:
  - `PCT-002 - Existing 50 QLs polished; ready for Stage 1 expansion decision`

## Runtime Selection Fix

- Files changed:
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/coverage-auditor.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/pipeline.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/validator.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-002-ssc-realism-review.md`
- English-vs-common QL selection:
  - English generation now uses all QLs available in `question-language.en.json` for the selected CP.
  - Hindi and Punjabi generation continue to use only shared/common QLs.
  - `runPct002ForLanguages` now explicitly preserves shared-only parity selection.
  - `getCommonQuestionLanguageIds(cpId)` remains unchanged and still returns only shared QLs.
  - Verified CP-level availability after the fix:
    - Every CP has `en=5` and `common=2`.
- Bundled build result:
  - Command:
    - `C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002.test.mjs`
  - Result: `passed`
- Bundled runtime test result:
  - Command:
    - `node dist/quant-v4/pct-002.test.mjs`
  - Result: `passed`
  - Output:
    - `PCT-002 foundational recovery test passed.`
- Static audit results:
  - JSON parse: `passed`
  - English QL count: `50`
  - Per-CP count: `5` each across all 10 CPs
  - Exact duplicate English template groups: `0`
  - Required-placeholder audit: `0` missing
  - Rendered unresolved placeholders: `0`
- Final status:
  - `PCT-002 - Existing 50 English QLs polished; English generation covers all 50; ready for Stage 1 expansion decision`

## Stage 1 English Expansion

- Files changed:
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/task-registry.library.json`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/coverage-auditor.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-002-stage-1-expansion-report.md`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-002-ssc-realism-review.md`
- New English QL ranges added:
  - `PCT-QL-051` to `PCT-QL-150`
- Final English shape:
  - CP count: `10`
  - English QL count: `150`
  - Per-CP English QL count: `15` each
- Static audit results:
  - JSON parse: `passed`
  - Exact duplicate English template groups: `0`
  - Missing required placeholders: `0`
  - Unregistered template placeholders: `0`
- Runtime verification:
  - Bundled build command:
    - `C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002.test.mjs`
    - Result: `passed`
  - Bundled runtime command:
    - `node dist/quant-v4/pct-002.test.mjs`
    - Result: `passed`
  - Bundled audit implications from the passing runtime:
    - English generation covers all `150` English QLs
    - Rendered unresolved-placeholder audit: `0`
    - Validation failures: `0`
    - Solver failures: `0`
    - Cross-language parity on shared/common QLs: `passed`
- Final status:
  - `PCT-002 - Stage 1 English expansion complete; English generation covers all 150; ready for Stage 2 expansion decision or manual review of the expanded English bank`
