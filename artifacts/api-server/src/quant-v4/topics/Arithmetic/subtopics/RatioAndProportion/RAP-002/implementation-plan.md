# RAP-002: Implementation Plan

## Phase 0: Design

- [x] Create `archetype.md`.
- [x] Create `canonical-problems.md`.
- [x] Create `reasoning-patterns.md`.
- [x] Create `difficulty-framework.md`.
- [x] Create initial `task-registry.library.json` scaffold.

## Phase 1: English Runtime MVP

Start with `RAP-CP-007`, then add the first reverse-chain slice from `RAP-CP-008`.

- [x] Add `types.ts`.
- [x] Add `math.ts` with chain alignment helpers.
- [x] Add `question-language.en.json` for initial CP-007 QLs.
- [x] Add `variable-ranges.library.json`.
- [x] Add `distribution-targets.library.json`.
- [x] Implement `parameter-generator.ts`.
- [x] Implement `solver.ts`.
- [x] Implement `validator.ts`.
- [x] Implement `explanation-renderer.ts`.
- [x] Implement `pipeline.ts` and `index.ts`.
- [x] Add `rap-002.test.ts`.

Current MVP coverage:

- Active CPs: `RAP-CP-007`, `RAP-CP-008`, `RAP-CP-009`, `RAP-CP-010`, `RAP-CP-011`, `RAP-CP-012`
- Active QLs: `RAP-QL-201` to `RAP-QL-212`, `RAP-QL-301` to `RAP-QL-306`, `RAP-QL-401` to `RAP-QL-406`, `RAP-QL-501` to `RAP-QL-506`, `RAP-QL-601` to `RAP-QL-606`, `RAP-QL-701` to `RAP-QL-706`
- Active task kinds: `chainAlignment`, `extendedChainAlignment`, `missingChainRatio`, `reverseMiddleFinding`, `reverseEndpointFinding`, `constrainedReverseChain`, `successiveRatioChange`, `transferTracking`, `reconstructOriginalRatio`, `nestedPartition`, `conditionalDistribution`, `weightedNestedPartition`, `inverseChainWork`, `inverseChainSpeed`, `combinedInverseChain`, `chainOrdering`, `chainInequality`, `chainEquivalence`
- Language: English only
- Question Studio wiring: enabled for English only

## Phase 2: Full English Expansion

- [x] Add initial `RAP-CP-008` reverse chain.
- [x] Add initial `RAP-CP-009` multi-stage transformations.
- [x] Add initial `RAP-CP-010` nested partitions.
- [x] Add initial `RAP-CP-011` inverse chains.
- [x] Add initial `RAP-CP-012` comparison and ordering.
- [x] Add coverage and maturity audit outputs.

## Phase 3: Multilingual From Start

- [ ] Add `question-language.hi.json`.
- [ ] Add `question-language.pa.json`.
- [ ] Add `explanation.en.json`.
- [ ] Add `explanation.hi.json`.
- [ ] Add `explanation.pa.json`.
- [ ] Add `localized-explanation-renderer.ts`.
- [ ] Use shared entity libraries and `language-coverage.ts`.
- [ ] Add `rap-002-multilingual-audit.ts`.

## Phase 4: Question Studio Integration

- [x] Wire `RAP-002` into `generation-engine.ts`.
- [x] Keep Hindi/Punjabi disabled until full multilingual audit passes.
- [x] Run English-only Question Studio smoke.
- [x] Confirm options and explanation shape.

## Phase 5: Human Review & Freeze

- [ ] Generate human review CSVs for English.
- [ ] Add `rap-002-pre-freeze-coverage-audit.md`.
- [x] Add `rap-002-maturity-audit.md`.
- [x] Add `rap-002-residual-qa.ts` and `rap-002-residual-qa-report.md`.
- [ ] Add `rap-002-freeze-record.md`.

## Immediate Next Step

RAP-002 is now wired through Question Studio for English only and passes 500-sample residual QA. Next safe step is manual editorial review of the English MVP breadth before expansion or any Hindi/Punjabi localization work.
