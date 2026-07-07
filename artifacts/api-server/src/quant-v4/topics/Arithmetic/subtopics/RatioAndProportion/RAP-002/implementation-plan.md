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

- Active CPs: `RAP-CP-007`, `RAP-CP-008`, `RAP-CP-009`
- Active QLs: `RAP-QL-201` to `RAP-QL-212`, `RAP-QL-301` to `RAP-QL-306`, `RAP-QL-401` to `RAP-QL-406`
- Active task kinds: `chainAlignment`, `extendedChainAlignment`, `missingChainRatio`, `reverseMiddleFinding`, `reverseEndpointFinding`, `constrainedReverseChain`, `successiveRatioChange`, `transferTracking`, `reconstructOriginalRatio`
- Language: English only
- Question Studio wiring: not enabled

## Phase 2: Full English Expansion

- [x] Add initial `RAP-CP-008` reverse chain.
- [x] Add initial `RAP-CP-009` multi-stage transformations.
- [ ] Add `RAP-CP-010` nested partitions.
- [ ] Add `RAP-CP-011` inverse chains.
- [ ] Add `RAP-CP-012` comparison and ordering.
- [ ] Add coverage and maturity audit outputs.

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

- [ ] Wire `RAP-002` into `generation-engine.ts`.
- [ ] Keep Hindi/Punjabi backend-only until full audit passes.
- [ ] Run normal export smoke.
- [ ] Confirm options and explanation shape.

## Phase 5: Human Review & Freeze

- [ ] Generate human review CSVs for English, Hindi, and Punjabi.
- [ ] Add `rap-002-pre-freeze-coverage-audit.md`.
- [ ] Add `rap-002-maturity-audit.md`.
- [ ] Add `rap-002-freeze-record.md`.

## Immediate Next Step

Move next to `RAP-CP-010` nested partitions or expand English coverage within `RAP-CP-008` and `RAP-CP-009`. Hindi/Punjabi should wait until the English task-kind contract is stable.
