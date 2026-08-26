# DSF-001 Manifest Amendment — CP-011 Two-Statement Quant Breadth Expansion

## Authority boundary

- Checkpoint: `DSF-CP-011`
- Status: `FIVE_LANES_GREEN_TSD_AND_MIXTURE_REVIEW_CANDIDATES`
- Base production freeze: `DSF-CP-010`
- Permanent QL reused: `DSF-QL-001`
- Next available permanent QL remains: `DSF-QL-002`
- New permanent QL allocation: **none**

CP-011 is additive. CP-001 through CP-010 remain immutable historical authorities.

## Implemented deltas

| Wave | Source | DSF solve modes | Source truth owner | Status |
| --- | --- | --- | --- | --- |
| 1 | `AVG-001` | average / total | `AVG-001/foundation/solver::solveAvg001` | combined CI green |
| 2 | `RAP-003` Ages | age A / age B | `RAP-003/solver::solveRap003(ageFromSumAndRatio)` | combined CI green |
| 3 | `PNL-001` Profit/Loss/Discount | six PNL/Discount target modes | `solveFundamental`, `solveDiscount` | combined CI green |
| 4 | `INT-001` Simple/Compound Interest | SI, CI, amount, CI−SI | `simpleInterest`, `compoundInterest`, `compoundAmount`, `siCiDifference` | combined CI green |
| 5 | `TMW-001` Time & Work / Pipes | work time/rate/fraction + positive/mixed pipe fill | `solveTmwCp001`, `solveTmwCp009` | combined CI green |
| 6 | `TSD-001` TSD / Trains / Boats | distance, speed, time, train fixed-clear, two-train cross, upstream time, downstream time | `solveCp001`, `trainClearTimeAgainstFixedObject`, `twoTrainCompleteCrossingTime`, `groundSpeedInMedium`, `durationForUniformMotion` | review candidate |
| 7 | `MAL-001` Mixture & Alligation | mean, ratio, unknown source value, unknown quantity, add-to-target quantity, quantity reconstruction | `MAL-001/foundation/solver::solveMalCp001` | review candidate |

Every adapter independently filters valid source worlds through Statement I, Statement II and their conjunction, then projects surviving worlds through the source chapter solver/function. The shared frozen DSF evaluator alone assigns the canonical sufficiency class.

## Exam-realness delta

CP-011 does not treat a unique seed/generation identity as proof of student-visible variety. Every lane audits normalized stem surfaces, target kinds, Statement I/II family pairings, structural fingerprints and largest repeated structure clusters.

Average, Ages, Profit/Loss/Discount, Interest and Time & Work/Pipes are green in the combined CP011 API-build/audit gate.

TSD Wave 6 separates five mathematical source universes: 64 core-motion worlds, 180 train-vs-object worlds, 256 two-train worlds, 144 upstream boat worlds and 144 downstream boat worlds. Train length/clearance, relative speed and stream direction remain explicit source semantics.

Mixture Wave 7 separates a 400-world two-component blend universe from a 400-world add-to-target universe. Weighted mean, alligation ratio, inverse source-value recovery, inverse quantity recovery, add-to-target and total reconstruction all project through `solveMalCp001`.

## Required proof

Average: all five classes, both solve modes, all contexts/difficulties, exactly one correct option, source ancestry, 250 unique identities, perceptual breadth thresholds. Green.

Ages: all five classes, both solve modes, all contexts/difficulties, exactly one correct option, canonical `RAP-003` projection, 250 unique identities, perceptual breadth thresholds. Green.

Profit/Loss/Discount: all five classes, six solve modes, both source solvers/domains, all contexts/difficulties, 250 unique identities, perceptual breadth thresholds. Green.

Interest: all five classes, four solve modes/source functions, all contexts/difficulties, 250 unique identities, perceptual breadth thresholds. Green.

Time & Work/Pipes: all five classes, five solve modes, both canonical TMW solvers, twelve contexts, all difficulties, 250 unique identities, perceptual breadth thresholds. Green.

TSD/Trains/Boats requires all five classes, all seven solve modes, all six target kinds, all twelve declared contexts, all three difficulties, exactly one correct option, canonical TSD source ancestry, 350 unique generation identities, at least 30 normalized stems, at least 100 structural fingerprints, maximum cluster 10/350, and exact allocation of 50 questions per solve mode and 70 per canonical class.

Mixture/Alligation requires all five classes, all six solve modes/target kinds, all six contexts, all three difficulties, exactly one correct option, canonical `MAL-001` source ancestry, 300 unique generation identities, at least 24 normalized stems, at least 80 structural fingerprints, maximum cluster 10/300, and exact allocation of 50 questions per solve mode and 60 per canonical class.

## Lifecycle lock

All CP-011 expansion content remains review-only until the lane's executable audit and human review pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Remaining CP-011 breadth work

- Mensuration
- Geometry after source-authority resolution
- additional Number System/Ratio/Percentage/Algebra target and context worlds

Reasoning adapters and three-statement DS remain later checkpoints; they are not silently folded into CP-011.
