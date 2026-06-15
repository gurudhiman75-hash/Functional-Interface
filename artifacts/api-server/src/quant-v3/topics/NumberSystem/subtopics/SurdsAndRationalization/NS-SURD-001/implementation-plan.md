# NS-SURD-001 Implementation Plan

## Phase A Output Status

This package defines architecture discovery only. It does not create runtime content or executable logic.

Exactly five files belong to this package:

- `archetype.md` (Identity and Scope)
- `canonical-problems.md` (CP list and topology)
- `reasoning-patterns.md` (Mental models and methods)
- `difficulty-framework.md` (Leveling criteria)
- `implementation-plan.md` (This file)

## Phase B (Realism & Language)
- Draft 175 exam-style stems across the 8 CPs.
- Create JSON libraries for language and variable ranges.
- Validate realism against SSC, CDS, and Railway exam papers.

## Phase C (Runtime Implementation)
- Implement `solver.ts` for symbolic radical manipulation.
- Implement `reasoning-graph.ts` for step-by-step trace generation.
- Implement `parameter-generator.ts` with constrained random sampling.
- Implement `validator.ts` for structural and mathematical correctness.

## Checklist
- [x] Topology count = 8.
- [x] No runtime files (TS/JSON) created.
- [x] No audits or review CSVs created.
- [x] Excluded nested radicals and decimal surds.
- [x] Merged square and cube roots into CP01.
