# DSF-001 Manifest Amendment — CP-011 Two-Statement Quant Breadth Expansion

## Authority boundary

- Checkpoint: `DSF-CP-011`
- Status: `FIVE_LANES_GREEN_TSD_TRAINS_BOATS_REVIEW_CANDIDATE`
- Base production freeze: `DSF-CP-010`
- Permanent QL reused: `DSF-QL-001`
- Next available permanent QL remains: `DSF-QL-002`
- New permanent QL allocation: **none**

CP-011 is additive. CP-001 through CP-010 remain immutable historical authorities.

## Implemented deltas

| Wave | Source | DSF solve modes | Source truth owner | Status |
| --- | --- | --- | --- | --- |
| 1 | `AVG-001` | `DSF-SM-AVG-TOTAL-FROM-GROUP`, `DSF-SM-AVG-AVERAGE-FROM-GROUP` | `AVG-001/foundation/solver::solveAvg001` | combined CI green |
| 2 | `RAP-003` Ages | `DSF-SM-AGE-PRESENT-AGE-A`, `DSF-SM-AGE-PRESENT-AGE-B` | `RAP-003/solver::solveRap003(ageFromSumAndRatio)` | combined CI green |
| 3 | `PNL-001` Profit/Loss/Discount | six PNL/Discount target modes | `PNL-001/foundation/solver::solveFundamental`, `PNL-001/foundation/discount-solver::solveDiscount` | combined CI green |
| 4 | `INT-001` Simple/Compound Interest | SI, CI, amount, CI−SI | `INT-001/cp006-si-ci-relations-runtime-v1::{simpleInterest, compoundInterest, compoundAmount, siCiDifference}` | combined CI green |
| 5 | `TMW-001` Time & Work / Pipes | work time/rate/fraction + positive/mixed pipe fill | `TMW-001/foundation/cp001-solver::solveTmwCp001`, `TMW-001/foundation/cp009-solver::solveTmwCp009` | combined CI green |
| 6 | `TSD-001` TSD / Trains / Boats | distance, speed, time, train fixed-clear, two-train cross, upstream time, downstream time | `solveCp001`, `trainClearTimeAgainstFixedObject`, `twoTrainCompleteCrossingTime`, `groundSpeedInMedium`, `durationForUniformMotion` | review candidate |

Every adapter independently filters valid source worlds through Statement I, Statement II and their conjunction, then projects surviving worlds through the source chapter solver/function. The shared frozen DSF evaluator alone assigns the canonical sufficiency class.

## Exam-realness delta

CP-011 does not treat a unique seed/generation identity as proof of student-visible variety. Every lane audits normalized stem surfaces, target kinds, Statement I/II family pairings, structural fingerprints and largest repeated structure clusters.

Average and Ages retain their previously green dedicated audits. Profit/Loss/Discount, Interest and Time & Work/Pipes are now also green in the combined CP011 API-build/audit gate.

Profit/Loss/Discount uses canonical exact Money/Rational arithmetic from `PNL-001`. Interest uses the canonical `INT-001` CP006 SI/CI runtime functions. Time & Work/Pipes preserves true signed-flow semantics through `solveTmwCp009`.

TSD Wave 6 separates five mathematical source universes: 64 core-motion worlds, 180 train-vs-object worlds, 256 two-train worlds, 144 upstream boat worlds and 144 downstream boat worlds. It does not simulate trains or boats by noun-swapping ordinary `distance = speed × time` stems; train length/clearance, relative speed, and stream direction are preserved in the source world model.

## Required proof

Average requires all five canonical classes, both solve modes, all six contexts, all three difficulties, exactly one correct option, canonical source ancestry, 250 unique generation identities, at least 16 normalized stems, at least 40 structural fingerprints, and a maximum cluster of 14/250. Green.

Ages requires all five classes, both age targets/solve modes, all six contexts, all three difficulties, exactly one correct option, canonical `RAP-003` source projection, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250. Green.

Profit/Loss/Discount requires all five classes, all six solve modes, both canonical source solvers, both PNL and Discount source domains, all six contexts, all three difficulties, exactly one correct option, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250. Green.

Interest requires all five classes, all four solve modes/source functions, all six contexts, all three difficulties, exactly one correct option, canonical `INT-001` source ancestry, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250. Green.

Time & Work/Pipes requires all five classes, all five solve modes, both canonical TMW solvers, all twelve work/pipe contexts, all three difficulties, exactly one correct option, 250 unique generation identities, at least 24 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250. Green.

TSD/Trains/Boats requires all five classes, all seven solve modes, all six target kinds, all twelve declared contexts, all three difficulties, exactly one correct option, canonical TSD source ancestry, 350 unique generation identities, at least 30 normalized stems, at least 100 structural fingerprints, a maximum cluster of 10/350, and exact deterministic allocation of 50 questions per solve mode and 70 per canonical class.

## Lifecycle lock

All CP-011 expansion content remains review-only until the lane's executable audit and human review pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Remaining CP-011 breadth work

- Mixture & Alligation
- Mensuration
- Geometry after source-authority resolution
- additional Number System/Ratio/Percentage/Algebra target and context worlds

Reasoning adapters and three-statement DS remain later checkpoints; they are not silently folded into CP-011.
