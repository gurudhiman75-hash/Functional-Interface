# DSF-CP-013 — Reasoning Data Sufficiency Wave 2

## Status

**IMPLEMENTATION GREEN — SOURCE-BACKED LANES FROZEN**

Permanent two-statement semantic authority remains `DSF-QL-001`. CP013 does not allocate a new permanent QL and does not modify frozen DSF-CP-001..010.

All CP013 content remains review-only:

- Question Studio discoverable: false
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false

## Final executable evidence

Workflow: `Validate DSF CP-013 Reasoning Wave 2`

Exact implementation head validated: `718015279183ea81d1d1f4ed0553dc179d457016`

Run: `33049254915`, rerun attempt after the repository-wide zero-step Actions incident.

Final job: `validate-cp013-reasoning-wave2` — **SUCCESS**.

The successful job completed:

1. locked dependency installation;
2. API server build;
3. Seating audit bundle + run;
4. Coding audit bundle + run; and
5. Calendar audit bundle + run.

The earlier failure on this same head had no job steps and occurred during a repository-wide Actions failure burst. The successful exact-head rerun establishes the actual code verdict.

## Lane status

### Seating / Arrangement — GREEN

Source authority:

- `SEA-001/solver/production-solver::solveLinear`
- `SEA-001/solver/independent-oracle::enumerateLinearOracle`
- `SEA-001/constraints/evaluate::evaluateConstraint`
- `SEA-001/topology/linear::LinearTopology`

Finite domain:

- five people;
- North-facing universe: 120 permutations;
- South-facing universe: 120 permutations; and
- production solver must agree with the independent oracle key-for-key before generation.

Targets:

1. middle occupant;
2. Aman's position from the left end;
3. number of people between Aman and Bina; and
4. Charan's exact position relative to Diya.

Audit: 300 questions, 75/mode, 60/class, both facings, six contexts, all three difficulties, source ancestry, positive-world proofs, anti-template gates and lifecycle locks.

### Coding-Decoding / COD-001 — GREEN

Source boundary is intentionally limited to frozen `COD-CP-001` direct one-to-one mappings.

Source authority:

- `COD-CP-001/independent-solver::solveCodCp001`
- `COD-001/foundation/mapping::mappingFromEvidence`
- `COD-001/foundation/mapping::encodeWithMapping`
- `COD-001/foundation/mapping::decodeWithMapping`

Finite domain:

- four source symbols;
- digit set {1,2,3,4};
- every digit is used exactly once; and
- exhaustive domain = `4! = 24` mappings.

The bijection is explicitly stated in every question, so elimination is a declared problem rule rather than a generator correlation.

Targets:

1. encode one source symbol;
2. decode digit 1; and
3. encode a two-symbol sequence.

Audit: 300 questions, 100/mode, 60/class. Every solve mode is required to traverse all six contexts. Deterministic topology proves every one of the 24 anchors can realize all five canonical DS classes in all three modes. Structural replay produced 214 fingerprints with maximum cluster 5.

### Calendar / CAL-001 — GREEN

Source authority:

- `CAL-001/foundation::weekdayShift`
- `CAL-001/foundation::mod7`
- semantic family aligned with `CAL-001/runtime-cp001::shiftProblem`.

Finite domain:

- seven starting weekdays;
- seven forward-shift remainders modulo 7; and
- exhaustive Cartesian domain = `7 × 7 = 49` states.

Targets:

1. resulting weekday;
2. starting weekday; and
3. day-count remainder modulo 7.

Audit: 300 questions, 100/mode, 60/class, every mode across all six contexts. Every one of the 49 anchors realizes all five DS classes in all three modes. Structural replay produced 298 fingerprints with maximum cluster 2.

## Selected puzzle-family status — SOURCE BLOCKED

No standalone merged floor, box, scheduling or generic puzzle solver authority is currently present on `New-main`.

Repository searches resolve only to Seating or generic generator infrastructure, not to a canonical puzzle truth engine. CP013 therefore does **not** create a DSF-owned puzzle solver simply to fill a roadmap slot.

A future puzzle lane may be added when a source chapter exposes a real finite constraint model / solver / oracle suitable for DS target projection.

## DS architecture

Each CP013 lane contributes only:

- a mathematically explicit finite domain;
- source-backed target projection;
- statement predicates; and
- editorial surface pools.

Frozen `evaluateFiniteDomainPair` owns independent Statement I/II filtering, conjunction, consistency checks, target-answer normalization and five-class sufficiency assignment.

## Closure boundary

CP013 is closed at implementation/audit level for every source-backed lane admitted to this checkpoint. The source-blocked generic puzzle slot is recorded transparently and is not counted as implemented coverage.

No learner-facing lifecycle capability is unlocked by this freeze.
