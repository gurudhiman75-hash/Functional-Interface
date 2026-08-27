# DSF-CP-013 — Reasoning Data Sufficiency Wave 2

## Scope

Additive two-statement Data Sufficiency breadth for source-backed Reasoning families after CP012 Wave 1.

Permanent semantic authority remains `DSF-QL-001`. This checkpoint does not allocate a new permanent QL and does not modify frozen DSF-CP-001..010.

All CP013 content is review-only:

- Question Studio discoverable: false
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false

## Lane status

### Seating / Arrangement — GREEN

Source authority:

- `SEA-001/solver/production-solver::solveLinear`
- `SEA-001/solver/independent-oracle::enumerateLinearOracle`
- `SEA-001/constraints/evaluate::evaluateConstraint`
- `SEA-001/topology/linear::LinearTopology`

Finite domain:

- five people
- North-facing universe: 120 permutations
- South-facing universe: 120 permutations
- production solver must agree with the independent oracle key-for-key before generation is permitted

Targets:

1. middle occupant
2. Aman's position from the left end
3. number of people between Aman and Bina
4. Charan's exact position relative to Diya

Audit:

- 300 questions
- 75 per solve mode
- 60 per canonical DS class
- both facings
- six contexts
- Easy / Medium / Hard
- source ancestry and positive-world proofs
- normalized-stem and structural-fingerprint gates
- lifecycle locks

Executable evidence:

- workflow: `Validate DSF CP-013 Reasoning Wave 2`
- run `32980965331`
- API build: success
- Seating audit: success

### Coding-Decoding / COD-001 — EXECUTABLE-PENDING REVIEW CANDIDATE

Source boundary is intentionally limited to `COD-CP-001` direct one-to-one mappings.

Source authority:

- `COD-CP-001/independent-solver::solveCodCp001`
- `COD-001/foundation/mapping::mappingFromEvidence`
- `COD-001/foundation/mapping::encodeWithMapping`
- `COD-001/foundation/mapping::decodeWithMapping`

Finite domain:

- four source symbols
- digit set {1,2,3,4}
- each digit is used exactly once
- exhaustive domain = `4! = 24` mappings

The bijection is explicitly stated in every question. Therefore inference by elimination is a declared rule of the problem and not a correlation leaked by the generator.

Targets:

1. encode one source symbol
2. decode digit 1
3. encode a two-symbol sequence

Deterministic finite-domain proof:

- every one of the 24 anchors realizes all five canonical DS classes in all three modes
- 300-question allocation: 100/mode, 60/class
- six contexts
- private structural replay: 214 distinct fingerprints, maximum cluster 5

The audit is wired into the combined workflow but cannot yet be called green because the newest GitHub Actions runs are terminating before any job steps execute.

### Calendar / CAL-001 — EXECUTABLE-PENDING REVIEW CANDIDATE

Source authority:

- `CAL-001/foundation::weekdayShift`
- `CAL-001/foundation::mod7`
- semantic family aligns with `CAL-001/runtime-cp001::shiftProblem`

Finite domain:

- seven possible starting weekdays
- seven possible forward-shift remainders modulo 7
- exhaustive Cartesian domain = `7 × 7 = 49` states
- resulting weekday is always computed by source `weekdayShift`
- starting weekday is recovered by source reverse shift
- shift remainder is recovered by source `mod7`

Targets:

1. resulting weekday
2. starting weekday
3. day-count remainder modulo 7

Deterministic finite-domain proof:

- every one of the 49 anchors realizes all five canonical DS classes in all three modes
- 300-question allocation: 100/mode, 60/class
- every mode uses all six contexts
- private structural replay: 298 distinct fingerprints, maximum cluster 2

The audit is wired into the combined workflow but remains executable-pending while GitHub Actions jobs terminate before step execution.

## Selected puzzle-family status — SOURCE BLOCKED

No standalone merged floor, box, scheduling, or generic puzzle solver authority is currently present on `New-main`.

Repository searches resolve only to Seating/generic generator infrastructure rather than a canonical puzzle truth engine. CP013 will not create a DSF-owned puzzle solver merely to fill the roadmap slot.

A future puzzle lane may be added when a source chapter exposes a real finite constraint model / solver / oracle suitable for DS target projection.

## DS architecture

Each CP013 lane contributes only:

- a mathematically explicit finite domain
- source-backed target projection
- statement predicates
- editorial surface pools

Frozen DSF `evaluateFiniteDomainPair` remains responsible for:

- Statement I filtering
- Statement II filtering
- conjunction filtering
- consistency checks
- target-answer normalization
- canonical five-class sufficiency assignment

## CI note

The first Seating-only CP013 run completed successfully. On the later Coding head, CP013 and many unrelated workflows began terminating within seconds with no job steps and no downloadable job log. Until a runner executes the combined gate, Coding and Calendar must remain `EXECUTABLE-PENDING` rather than green or red.
