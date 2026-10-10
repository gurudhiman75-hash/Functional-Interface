# TSD quality audit

The report records an editorial NO-GO; structural checks do not grant approval.
The corpus selects current approved sources explicitly, avoiding historical review exports.
CP007 samples one deterministic case per family/locale. The separate Studio proof sweeps every compatible numeric combination.

From repository root:

```sh
artifacts/api-server/node_modules/.bin/esbuild artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/quality-audit/export.ts --bundle --platform=node --format=esm --packages=external --outfile=artifacts/api-server/dist/tsd-quality-export.mjs
node artifacts/api-server/dist/tsd-quality-export.mjs /tmp/tsd-quality-audit
```

For validation, bundle/run `TSD-002/cp007/studio-semantic-compatibility.test.ts`, `tsd-frozen-checkpoint-proof-suite.ts` and `tsd-current-main-closure-audit.test.ts` with the same esbuild flags.
The new regression independently computes rendered clock answers for 93-A..E and point counts for 94-A..B; all 618 English compatible combinations also undergo option-answer and release-lock checks.
The existing CP007 proof validates all 1,854 multilingual combinations. Frozen content itself is unchanged.

`corpus-metrics-20261004.json` contains triage measurements for the reviewed snapshot.
The report defines numeric-mask and arithmetic-marker heuristics; these measurements must not be treated as semantic approvals.

Latest remediation: `TSD-REMEDIATION-V3-20261004.md`. Bundle/run `editorial-candidates-proof-suite.ts` for candidate checks or `revision-v2-proof-suite.ts` for candidate plus frozen/closure checks. `revision-review-export-v3.ts` exports the complete 2,334-row candidate JSON and 678-row human-readable review.
