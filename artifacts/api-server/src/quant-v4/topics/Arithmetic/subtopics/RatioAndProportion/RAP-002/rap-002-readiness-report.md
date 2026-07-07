# RAP-002 Readiness Report

## Current Status

- `RAP-002` has been initialized and now has English runtime coverage through `RAP-CP-010`.
- Runtime generation is available through the local RAP-002 pipeline, but is not wired into Question Studio yet.
- `generation-engine.ts` still exposes only `RAP-001` for Ratio and Proportion.
- Hindi/Punjabi are planned from the start, but no localized QLs should be generated until the English solver contract is stable.

## Files Created

- `archetype.md`
- `canonical-problems.md`
- `reasoning-patterns.md`
- `difficulty-framework.md`
- `implementation-plan.md`
- `task-registry.library.json`
- `types.ts`
- `math.ts`
- `question-language.en.json`
- `variable-ranges.library.json`
- `distribution-targets.library.json`
- `library.ts`
- `parameter-generator.ts`
- `solver.ts`
- `explanation-renderer.ts`
- `validator.ts`
- `pipeline.ts`
- `index.ts`
- `rap-002.test.ts`

## Canonical Problem Plan

- `RAP-CP-007`: Direct Chain Ratios
- `RAP-CP-008`: Reverse Chain Proportions
- `RAP-CP-009`: Multi-Stage Ratio Transformations
- `RAP-CP-010`: Conditional Partition With Ratios
- `RAP-CP-011`: Inverse Proportion Chains
- `RAP-CP-012`: Ratio Comparison & Ordering

## Architecture Decision

Use the RAP-001 flat architecture:

- no `foundation/` subdirectory
- task-kind driven solvers and renderers
- shared entity resolution
- shared multilingual coverage gating
- dedicated multilingual audit before any non-English exposure

## Current Runtime Slice

Built `RAP-CP-007` English MVP:

- Active QLs: `RAP-QL-201` to `RAP-QL-212`
- Active task kinds:
  - `chainAlignment`
  - `extendedChainAlignment`
  - `missingChainRatio`
- Solver coverage:
  - four-entity linked chain alignment
  - selected pair extraction from a full chain
  - aligned middle value recovery from endpoint ratio
- Validation:
  - required variables present
  - no unresolved stem/explanation placeholders
  - English-only guard for MVP

Added `RAP-CP-008` English reverse-chain slice:

- Active QLs: `RAP-QL-301` to `RAP-QL-306`
- Active task kinds:
  - `reverseMiddleFinding`
  - `reverseEndpointFinding`
  - `constrainedReverseChain`
- Solver coverage:
  - recover middle value from a known endpoint
  - recover endpoint value from a known middle value
  - recover middle value from endpoint difference or total constraint
- Validation:
  - fixed-answer checks for reverse middle and total-constraint cases
  - forced QL checks for all six CP-008 QLs
  - random CP-008 smoke coverage

Added `RAP-CP-009` English multi-stage transformation slice:

- Active QLs: `RAP-QL-401` to `RAP-QL-406`
- Active task kinds:
  - `successiveRatioChange`
  - `transferTracking`
  - `reconstructOriginalRatio`
- Solver coverage:
  - convert ratio plus total into actual values
  - apply additions/removals and simplify final ratio
  - track transfers between two sides
  - reconstruct original ratio from final ratio plus operation details
- Validation:
  - fixed-answer checks for forward transformation and reverse transfer reconstruction
  - forced QL checks for all six CP-009 QLs
  - random CP-009 smoke coverage

Added `RAP-CP-010` English nested-partition slice:

- Active QLs: `RAP-QL-501` to `RAP-QL-506`
- Active task kinds:
  - `nestedPartition`
  - `conditionalDistribution`
  - `weightedNestedPartition`
- Solver coverage:
  - split a total by a first-level ratio
  - split a selected branch by a second-level ratio
  - return a target subshare
  - compute weighted totals from second-level subshares
- Validation:
  - fixed-answer checks for nested and weighted nested examples
  - forced QL checks for all six CP-010 QLs
  - random CP-010 smoke coverage

## Next Implementation Slice

Expand the current English MVP before multilingual work:

- start `RAP-CP-011` inverse chains, or expand `RAP-CP-008` to `RAP-CP-010` beyond the initial six QLs each
- add broader coverage audit once the next CP slice is active

## Latest Smoke Results

- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002.test.mjs`
- `node dist/quant-v4/rap-002.test.mjs`
- Result: `RAP-002 English test passed. CP-007 QLs covered: 12. CP-008 QLs covered: 6. CP-009 QLs covered: 6. CP-010 QLs covered: 6.`

## Frontend / Question Studio Status

- Not enabled.
- Do not expose `RAP-002` until the English runtime and smoke tests pass.
- Do not expose Hindi/Punjabi until full localized stem, label, explanation, and audit coverage exists.
