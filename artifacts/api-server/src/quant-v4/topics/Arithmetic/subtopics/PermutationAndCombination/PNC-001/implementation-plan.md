# PNC-001 Implementation Plan

## Checkpoint 1 — CP-001 runtime proof

Implement all 48 English QLs with:

- task registry and human-owned language library;
- exact integer math;
- deterministic parameter generation;
- solver evidence;
- solve-mode-specific explanation rendering;
- semantic distractors;
- validation and bundled tests;
- no generation-engine edits.

## Later checkpoints

1. CP-002 distinct permutations.
2. CP-003 basic combinations.
3. CP-004 number/code formation.
4. CP-005 word/multiset arrangements.
5. CP-006 selection then ordered assignment.
6. Chapter-wide audit and generation-engine integration.
7. English freeze.
8. Hindi/Punjabi localization as a separate reviewed phase.

Every checkpoint must preserve exact registry/language parity. Incomplete QL ranges are not mergeable.