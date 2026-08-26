# DSF-001 Manifest Amendment — CP-011 Two-Statement Quant Breadth Expansion

## Authority boundary

- Checkpoint: `DSF-CP-011`
- Status: `AVERAGE_GREEN_AGES_GREEN_PNL_REVIEW_CANDIDATE_INTEREST_REVIEW_CANDIDATE_TMW_REVIEW_CANDIDATE`
- Base production freeze: `DSF-CP-010`
- Permanent QL reused: `DSF-QL-001`
- Next available permanent QL remains: `DSF-QL-002`
- New permanent QL allocation: **none**

CP-011 is additive. CP-001 through CP-010 remain immutable historical authorities.

## Implemented deltas

| Wave | Source | DSF solve modes | Source truth owner | Status |
| --- | --- | --- | --- | --- |
| 1 | `AVG-001` | `DSF-SM-AVG-TOTAL-FROM-GROUP`, `DSF-SM-AVG-AVERAGE-FROM-GROUP` | `AVG-001/foundation/solver::solveAvg001` | dedicated CI green |
| 2 | `RAP-003` Ages | `DSF-SM-AGE-PRESENT-AGE-A`, `DSF-SM-AGE-PRESENT-AGE-B` | `RAP-003/solver::solveRap003(ageFromSumAndRatio)` | dedicated CI green |
| 3 | `PNL-001` Profit/Loss/Discount | `DSF-SM-PNL-SP-FROM-CP-RATE`, `DSF-SM-PNL-CP-FROM-SP-RATE`, `DSF-SM-PNL-RATE-FROM-CP-SP`, `DSF-SM-DISCOUNT-SP-FROM-MP-RATE`, `DSF-SM-DISCOUNT-RATE-FROM-MP-SP`, `DSF-SM-DISCOUNT-MP-FROM-SP-RATE` | `PNL-001/foundation/solver::solveFundamental`, `PNL-001/foundation/discount-solver::solveDiscount` | review candidate |
| 4 | `INT-001` Simple/Compound Interest | `DSF-SM-INT-SIMPLE-INTEREST`, `DSF-SM-INT-COMPOUND-INTEREST`, `DSF-SM-INT-COMPOUND-AMOUNT`, `DSF-SM-INT-CI-MINUS-SI` | `INT-001/cp006-si-ci-relations-runtime-v1::{simpleInterest, compoundInterest, compoundAmount, siCiDifference}` | review candidate |
| 5 | `TMW-001` Time & Work / Pipes | `DSF-SM-TMW-COMPLETION-TIME`, `DSF-SM-TMW-WORK-RATE`, `DSF-SM-TMW-FRACTION-COMPLETED`, `DSF-SM-PIPE-POSITIVE-FILL-TIME`, `DSF-SM-PIPE-MIXED-FILL-TIME` | `TMW-001/foundation/cp001-solver::solveTmwCp001`, `TMW-001/foundation/cp009-solver::solveTmwCp009` | review candidate |

Every adapter independently filters valid source worlds through Statement I, Statement II and their conjunction, then projects surviving worlds through the source chapter solver/function. The shared frozen DSF evaluator alone assigns the canonical sufficiency class.

## Exam-realness delta

CP-011 does not treat a unique seed/generation identity as proof of student-visible variety. Every lane audits normalized stem surfaces, target kinds, Statement I/II family pairings, structural fingerprints and largest repeated structure clusters.

Average provides six contexts and multiple intro surfaces and uses short counterexamples for insufficiency explanations. Its 250-question dedicated audit is green.

Ages provides six neutral contexts and statement families covering present ratio, sum, difference, exact age, future ratio, past ratio, bounds, parity, comparison, ratio+sum and ratio+difference. No unstated parent/child, gender or age-order assumption is used. Its 250-question dedicated audit is green.

Profit/Loss/Discount uses canonical exact Money/Rational arithmetic from `PNL-001`. It spans six target modes across fundamental profit/loss and discount mechanics, with exact-price/rate, direction, compound-pair, bound and congruence statement families plus six neutral retail contexts.

Interest uses the canonical `INT-001` CP006 SI/CI runtime functions for all world construction and target projection. It spans SI, CI, compound amount and CI−SI targets across principal/rate/time exacts, source-derived exact values, parameter pairs, complete parameter triples and low-information bounds, with six neutral investment contexts.

Time & Work/Pipes uses `solveTmwCp001` for ordinary work rate/time/fraction worlds and `solveTmwCp009` for pipe/cistern signed-flow worlds. Its finite audit universes contain 66 work worlds, 42 two-inlet worlds and 30 inlet+outlet worlds, so outlets retain their negative-flow semantics.

## Required proof

Average requires all five canonical classes, both solve modes, all six contexts, all three difficulties, exactly one correct option, canonical source ancestry, 250 unique generation identities, at least 16 normalized stems, at least 40 structural fingerprints, and a maximum cluster of 14/250. This gate is green.

Ages requires all five classes, both age targets/solve modes, all six contexts, all three difficulties, exactly one correct option, canonical `RAP-003` source projection, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250. This gate is green.

Profit/Loss/Discount requires all five classes, all six solve modes, both canonical source solvers, both `PROFIT_LOSS` and `DISCOUNT` source domains, all six contexts, all three difficulties, exactly one correct option, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250.

Interest requires all five classes, all four solve modes/source functions, all six contexts, all three difficulties, exactly one correct option, canonical `INT-001` source ancestry, 250 unique generation identities, at least 20 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250.

Time & Work/Pipes requires all five classes, all five solve modes, both canonical TMW solvers, both `TIME_AND_WORK` and `PIPES_AND_CISTERNS` source domains, all twelve work/pipe contexts, all three difficulties, exactly one correct option, 250 unique generation identities, at least 24 normalized stems, at least 60 structural fingerprints, and a maximum cluster of 10/250.

## Lifecycle lock

All CP-011 expansion content remains review-only until the lane's executable audit and human review pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Remaining CP-011 breadth work

- TSD/Trains/Boats
- Mixture & Alligation
- Geometry/Mensuration
- additional Number System/Ratio/Percentage/Algebra target and context worlds

Reasoning adapters and three-statement DS remain later checkpoints; they are not silently folded into CP-011.
