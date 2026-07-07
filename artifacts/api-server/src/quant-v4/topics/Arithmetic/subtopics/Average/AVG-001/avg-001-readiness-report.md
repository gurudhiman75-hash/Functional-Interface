# AVG-001 Readiness Report

## Current Status

- `AVG-001` currently has planning documents only:
  - `archetype.md`
  - `canonical-problems.md`
  - `difficulty-framework.md`
  - `implementation-plan.md`
  - `reasoning-patterns.md`
- No runtime package files exist yet for Average:
  - no `question-language.en.json`
  - no `task-registry.library.json`
  - no `variable-ranges.library.json`
  - no `foundation/` runtime core
  - no solver, validator, explanation renderer, or test entrypoint
- `generation-engine.ts` does not currently expose or route `AVG-001`.

## Canonical Coverage Target

`AVG-001` is planned around six canonical problem groups:

- `AVG-CP-001`: Foundational Sum-Count Mapping
- `AVG-CP-002`: Symmetric AP Properties
- `AVG-CP-003`: Increment/Decrement & Replacement
- `AVG-CP-004`: Weighted & Combined Aggregation
- `AVG-CP-005`: Error Detection & Delta Correction
- `AVG-CP-006`: Multi-Stage Hierarchical Systems

## Recommended Architecture

Use the completed RAP-001 pattern as the implementation reference, not the older mixed renderer style:

- English runtime first.
- One package-level `AVG-001` module with typed task kinds.
- Solver/math logic language-neutral.
- English explanation renderer backed by solver evidence and MathJax.
- Hindi/Punjabi kept backend-only until English runtime is stable.
- Add localized renderer only after English smoke and audit are clean.
- Use shared entity libraries for reusable labels instead of hardcoded translated nouns.

## Phase 1: English Runtime MVP

Start with `AVG-CP-001` only.

Required files:

- `question-language.en.json`
- `task-registry.library.json`
- `variable-ranges.library.json`
- `foundation/types.ts`
- `foundation/library.ts`
- `foundation/parameter-generator.ts`
- `foundation/solver.ts`
- `foundation/validator.ts`
- `foundation/explanation-renderer.ts`
- `index.ts`
- `avg-001.test.ts`

Initial task kinds:

- `findSumFromAverageAndCount`
- `findAverageFromSumAndCount`
- `findCountFromSumAndAverage`
- `findMissingValueFromAverage`

## Phase 2: English Expansion

After `AVG-CP-001` passes, add the remaining CPs in small batches:

- Batch 2: `AVG-CP-002` symmetric AP properties
- Batch 3: `AVG-CP-003` add/remove/replace deviation
- Batch 4: `AVG-CP-004` weighted groups
- Batch 5: `AVG-CP-005` error correction
- Batch 6: `AVG-CP-006` hierarchical systems

Each batch should add QLs, registry mappings, variable generation, solver logic, explanations, and tests together.

## Phase 3: Question Studio Integration

Only after English runtime is stable:

- add `AVG-001` discovery in `generation-engine.ts`
- add normal export smoke
- verify metadata, options, explanations, and validation summary shape
- keep student/public exposure off until reviewed

## Phase 4: Multilingual Backend Pilot

Only after English Question Studio integration is clean:

- localize a tiny `AVG-CP-001` Hindi/Punjabi pilot
- add non-English QL allowlist through shared `language-coverage.ts`
- localize stems, runtime labels, and explanation prose together
- keep Hindi/Punjabi frontend exposure off

## Immediate Next Step

Implement `AVG-CP-001` English runtime MVP with 20-30 high-quality QLs and deterministic smoke coverage.
