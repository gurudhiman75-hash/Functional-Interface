# RAP-002 Readiness Report

## Current Status

- `RAP-002` has been initialized and now has initial English runtime coverage for all planned CPs, `RAP-CP-007` through `RAP-CP-012`.
- Runtime generation is available through the local RAP-002 pipeline and the Quant V4 generation engine.
- `generation-engine.ts` now exposes `RAP-002` as an English-only Ratio and Proportion package.
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

Added `RAP-CP-011` English inverse-chain slice:

- Active QLs: `RAP-QL-601` to `RAP-QL-606`
- Active task kinds:
  - `inverseChainWork`
  - `inverseChainSpeed`
  - `combinedInverseChain`
- Solver coverage:
  - worker-days inverse proportion
  - speed-time inverse proportion
  - linked inverse chains across three entities
  - combined product ratios for efficiency/time or speed/time cases
- Validation:
  - fixed-answer checks were added for simple inverse, linked inverse, and combined product-ratio examples
  - forced and random CP-011 smoke coverage was added to `rap-002.test.ts`

Added `RAP-CP-012` English comparison/ordering slice:

- Active QLs: `RAP-QL-701` to `RAP-QL-706`
- Active task kinds:
  - `chainOrdering`
  - `chainInequality`
  - `chainEquivalence`
- Solver coverage:
  - normalize linked ratios into comparable chains
  - order entities from greatest to least
  - compare selected entities
  - test ratio equivalence from chain endpoints or direct ratios
- Validation:
  - fixed-answer checks were added for ordering and equivalence examples
  - forced and random CP-012 smoke coverage was added to `rap-002.test.ts`

## Next Implementation Slice

Review the current English MVP before multilingual work:

- inspect generated English samples for editorial polish
- expand QL breadth only after the current task-kind contract is accepted
- keep Hindi/Punjabi disabled until localized stems, labels, explanations, and audits exist

## Latest Smoke Results

- `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002.test.mjs`
- `node dist/quant-v4/rap-002.test.mjs`
- Result: `RAP-002 English test passed. CP-007 QLs covered: 12. CP-008 QLs covered: 6. CP-009 QLs covered: 6. CP-010 QLs covered: 6. CP-011 QLs covered: 6. CP-012 QLs covered: 6.`
- Question Studio smoke:
  - `pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-question-studio-smoke.mjs`
  - `node dist/quant-v4/rap-002-question-studio-smoke.mjs`
  - Result: `RAP-002 Question Studio English-only smoke passed.`
- Residual QA:
  - `.\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-residual-qa.mjs`
  - `node dist/quant-v4/rap-002-residual-qa.mjs`
  - Result: `RAP-002 residual QA passed.`

## Coverage / Maturity Audit

- Audit file: `rap-002-coverage-audit.ts`
- Record: `rap-002-maturity-audit.md`
- Result: passed
- Coverage: 6 CPs, 42 active QLs, 18 task kinds, all answer types (`COUNT`, `LOGIC`, `RATIO`), 762 generated samples.

## Frontend / Question Studio Status

- English-only Quant V4 package wiring is enabled through `generation-engine.ts`.
- `RAP-002` is discoverable with `supportedLanguages: ["en"]`.
- Hindi/Punjabi remain disabled for Question Studio and direct runtime generation.
- Do not expose Hindi/Punjabi until full localized stem, label, explanation, and audit coverage exists.

## English-Only Wiring

- Added `RAP-002` to the Quant V4 runtime package registry.
- Registered active CPs `RAP-CP-007` to `RAP-CP-012`.
- Route uses `runRap002Pipeline(...)` and preserves existing English-only runtime enforcement.
- Question Studio package discovery now exposes RAP-002 as an enabled English-only package.
- Normal preview output includes `metadata.language = "en"` for generated Quant V4 questions.
- Normal preview output includes `correctIndex` in addition to the existing `correct` field.

## Generated Output Hardening

- Replaced global entity selection with CP/task-safe scenario pools.
- Fixed `RAP-QL-601` grammar: `The number of workers ... is`.
- Prevented tie-risk for `chainInequality` and `chainOrdering` generation.
- Added both positive and negative equivalence outcomes.
- Fixed fixed-template extended-chain target pairing for `RAP-QL-205`, `RAP-QL-206`, and `RAP-QL-207`.
- Added 500-sample residual QA coverage in `rap-002-residual-qa.ts`.

Final residual QA counters are all zero for grammar, semantic compatibility, unresolved placeholders, invalid options, metadata mismatch, validation failures, duplicate stems, and chain-inequality tie-risk. Equivalence distribution includes both `Equivalent` and `Not equivalent`.

## Review Status

- Ready for English manual review: yes
- Ready for QL expansion: after manual review
- Ready for Hindi/Punjabi: no
- Freeze-ready: no
