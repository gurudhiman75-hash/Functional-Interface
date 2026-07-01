# PCT-002 Stage 1 English Expansion Report

## Scope

Expanded only the English question library for:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/`

Hindi and Punjabi libraries were not expanded. Shared/common cross-language logic was preserved.

## Files Changed

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/task-registry.library.json`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/coverage-auditor.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts`
- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-002-stage-1-expansion-report.md`

## Expansion Applied

- Starting English QL count: `50`
- Added English QLs: `100`
- New ID range: `PCT-QL-051` to `PCT-QL-150`
- Final English QL count: `150`
- Final CP count: `10`
- Final per-CP English QL count: `15`

New QLs were added exactly as:

- `PCT-CP-001`: `PCT-QL-051` to `PCT-QL-060`
- `PCT-CP-002`: `PCT-QL-061` to `PCT-QL-070`
- `PCT-CP-003`: `PCT-QL-071` to `PCT-QL-080`
- `PCT-CP-004`: `PCT-QL-081` to `PCT-QL-090`
- `PCT-CP-005`: `PCT-QL-091` to `PCT-QL-100`
- `PCT-CP-006`: `PCT-QL-101` to `PCT-QL-110`
- `PCT-CP-007`: `PCT-QL-111` to `PCT-QL-120`
- `PCT-CP-008`: `PCT-QL-121` to `PCT-QL-130`
- `PCT-CP-009`: `PCT-QL-131` to `PCT-QL-140`
- `PCT-CP-010`: `PCT-QL-141` to `PCT-QL-150`

## Runtime Behavior Preserved

- English generation uses all English QLs available in `question-language.en.json`.
- Hindi generation remains limited to shared/common QLs.
- Punjabi generation remains limited to shared/common QLs.
- `runPct002ForLanguages` continues to use only shared/common QLs for cross-language parity.
- `getCommonQuestionLanguageIds(cpId)` remains shared-only.

## Generator/Registry Work

- Added task-registry entries for `PCT-QL-051` to `PCT-QL-150`.
- Extended the parameter-generator alias map so each new English QL reuses the correct base solve pattern.
- Added scenario-variable overrides so each new QL renders with its intended exam-style labels instead of inheriting legacy labels from the original 20 foundational scenarios.
- Updated the bundled test expectation from `50` English-covered QLs to `150`.
- Updated the maturity audit renderer to compute the selectable QL denominator dynamically.

## Verification

### Static Audit

Command:

```powershell
@'
const fs = require("fs");
const qlPath = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json";
const regPath = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/task-registry.library.json";
const ql = JSON.parse(fs.readFileSync(qlPath, "utf8"));
const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
...
'@ | node -
```

Result:

- JSON parse: `passed`
- English QL count: `150`
- CP count: `10`
- Per-CP English QL count: `15` each
- Exact duplicate English template groups: `0`
- Missing required placeholders: `0`
- Unregistered template placeholders: `0`

### Bundled Build

Command:

```powershell
C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/pct-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-002.test.mjs
```

Result:

- `passed`

### Bundled Runtime Test

Command:

```powershell
node dist/quant-v4/pct-002.test.mjs
```

Result:

- `passed`
- Output: `PCT-002 foundational recovery test passed.`

### Runtime Audit Implications

From the passing bundled test:

- English generation coverage: `150/150`
- CP coverage: `10/10`
- Validation failures: `0`
- Render failures: `0`
- Solver failures: `0`
- Unused English QL IDs in the batch audit: `0`
- Shared/common cross-language parity: `passed`

## Final Status

`PCT-002 - Stage 1 English expansion complete; English generation covers all 150; ready for Stage 2 expansion decision or manual review of the expanded English bank`
