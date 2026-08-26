# DSF-CP-011 — Two-Statement Quant Breadth Expansion

Status: **AVERAGE GREEN / AGES GREEN / PROFIT-LOSS-DISCOUNT GREEN / INTEREST GREEN / TIME-WORK-PIPES GREEN / TSD REVIEW CANDIDATE / MIXTURE REVIEW CANDIDATE / MENSURATION REVIEW CANDIDATE**

CP-011 is additive. It does not rewrite or weaken DSF-CP-001 through DSF-CP-010.

## Permanent semantic identity

- QL: `DSF-QL-001`
- Contract: `TWO_STATEMENT_TARGET_DETERMINACY`
- Canonical semantic classes: unchanged five-class DSF model
- No new permanent QL is allocated by CP-011

## Implemented source bindings

### Wave 1 — Average / `AVG-001` — GREEN
- source: `AVG-001/foundation/solver::solveAvg001`
- modes: average, total
- 250-question breadth/realness audit green

### Wave 2 — Ages / `RAP-003` — GREEN
- source: `RAP-003/solver::solveRap003(ageFromSumAndRatio)`
- modes: present age A, present age B
- 250-question breadth/realness audit green

### Wave 3 — Profit/Loss/Discount / `PNL-001` — GREEN
- sources: `solveFundamental`, `solveDiscount`
- six target modes covering CP, SP, profit/loss rate, MP, discount rate and post-discount SP
- exact Money/Rational source arithmetic
- 250-question audit green

### Wave 4 — Simple/Compound Interest / `INT-001` — GREEN
- sources: `simpleInterest`, `compoundInterest`, `compoundAmount`, `siCiDifference`
- four target modes
- 250-question audit green

### Wave 5 — Time & Work / Pipes & Cisterns / `TMW-001` — GREEN
- sources: `solveTmwCp001`, `solveTmwCp009`
- work time/rate/fraction plus positive-inlet and mixed inlet/outlet fill-time modes
- true signed-flow pipe semantics
- 250-question audit green

### Wave 6 — TSD / Trains / Boats / `TSD-001` — REVIEW CANDIDATE
- sources: `solveCp001`, `trainClearTimeAgainstFixedObject`, `twoTrainCompleteCrossingTime`, `groundSpeedInMedium`, `durationForUniformMotion`
- seven modes: distance, speed, time, train fixed-clear, two-train cross, upstream time, downstream time
- source universes: 64 core, 180 train-vs-object, 256 two-train, 144 upstream, 144 downstream
- 350-question audit: 50/mode, 70/class

### Wave 7 — Mixture & Alligation / `MAL-001` — REVIEW CANDIDATE
- source: `MAL-001/foundation/solver::solveMalCp001`
- six modes: mean, alligation ratio, inverse source value, inverse quantity, add-to-target quantity, two-quantity reconstruction
- separate 400-world blend and 400-world addition universes
- 300-question audit: 50/mode, 60/class

### Wave 8 — Mensuration / `MEN-001` + `MEN-002` — REVIEW CANDIDATE
- 2D source: `MEN-001/solver::solveMen001`
- 3D source: `MEN-002/cp010-foundation/engine::solveMenCp010`
- seven modes: triangle area; rectangle area/perimeter; circle area/circumference; square-pyramid volume; conical-frustum volume
- 2D worlds use canonical MEN-001 solvers
- 3D worlds use metre/metre-cubed Cartesian dimensions and canonical MEN-002 target solving, avoiding hidden source-generator correlations
- conical-frustum volume uses exact π
- 350-question audit: 50/mode, 70/class

## Exam-realness rule

Generation identity is not evidence of student-visible variety. Every lane audits:

- normalized stem surfaces with numbers removed;
- target kind;
- Statement I/II family pairing;
- structural fingerprints;
- largest repeated structure cluster.

Insufficiency explanations use short conflicting-target counterexamples rather than dumping complete finite-world sets.

## Lifecycle

All CP-011 expansion questions remain review-only until executable and human review gates pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Remaining CP-011 breadth work

1. Geometry — blocked until a merged runtime authority is resolvable on `New-main`.
2. richer Number System, Ratio, Percentage and Algebra target/world variants.

Each future wave must reuse source chapter truth or remain blocked. CP-011 must not become a second Quant implementation layer inside DSF.
