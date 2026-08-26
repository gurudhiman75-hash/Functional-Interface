# DSF-001 Manifest Amendment — CP-011 Two-Statement Quant Breadth Expansion

## Authority boundary

- Checkpoint: `DSF-CP-011`
- Status: `FIVE_LANES_GREEN_TSD_MIXTURE_MENSURATION_REVIEW_CANDIDATES`
- Base production freeze: `DSF-CP-010`
- Permanent QL reused: `DSF-QL-001`
- Next available permanent QL remains: `DSF-QL-002`
- New permanent QL allocation: **none**

CP-011 is additive. CP-001 through CP-010 remain immutable historical authorities.

## Implemented deltas

| Wave | Source | DSF solve modes | Source truth owner | Status |
| --- | --- | --- | --- | --- |
| 1 | `AVG-001` | average / total | `solveAvg001` | combined CI green |
| 2 | `RAP-003` Ages | age A / age B | `solveRap003(ageFromSumAndRatio)` | combined CI green |
| 3 | `PNL-001` Profit/Loss/Discount | six PNL/Discount modes | `solveFundamental`, `solveDiscount` | combined CI green |
| 4 | `INT-001` Simple/Compound Interest | SI, CI, amount, CI−SI | canonical INT CP006 functions | combined CI green |
| 5 | `TMW-001` Time & Work / Pipes | work time/rate/fraction + positive/mixed pipe fill | `solveTmwCp001`, `solveTmwCp009` | combined CI green |
| 6 | `TSD-001` TSD / Trains / Boats | distance, speed, time, train clear/cross, upstream/downstream time | canonical TSD CP001 + motion functions | review candidate |
| 7 | `MAL-001` Mixture & Alligation | mean, ratio, inverse value/quantity, add-to-target, reconstruction | `solveMalCp001` | review candidate |
| 8 | `MEN-001` + `MEN-002` Mensuration | triangle/rectangle/circle measures + pyramid/frustum volume | `solveMen001`, `solveMenCp010` | review candidate |

Every adapter filters valid source worlds independently through Statement I, Statement II and their conjunction, then projects surviving worlds through the source chapter solver/function. The shared frozen DSF evaluator alone assigns the canonical sufficiency class.

## Exam-realness delta

CP-011 does not treat a unique seed/generation identity as proof of student-visible variety. Every lane audits normalized stem surfaces, target kinds, Statement I/II family pairings, structural fingerprints and largest repeated structure clusters.

Average, Ages, Profit/Loss/Discount, Interest and Time & Work/Pipes are green in the combined CP011 API-build/audit gate.

TSD Wave 6 separates core motion, train-vs-object, two-train, upstream and downstream source worlds; train length/clearance, relative speed and stream direction remain explicit semantics.

Mixture Wave 7 separates a two-component blend universe from an add-to-target universe. Weighted mean, alligation ratio and inverse recovery all project through `solveMalCp001`.

Mensuration Wave 8 uses `MEN-001` for 2D triangle/rectangle/circle targets and `MEN-002` for square-pyramid and conical-frustum volumes. Its 3D worlds use a fixed metre/metre-cubed unit contract and Cartesian valid dimensions; DSF does not infer facts from incidental source-generator correlations. Exact-π frustum targets remain exact through `solveMenCp010`.

## Required proof

- Average: 250-question source-bound breadth/realness audit — green.
- Ages: 250-question source-bound breadth/realness audit — green.
- Profit/Loss/Discount: 250-question six-mode audit — green.
- Interest: 250-question four-mode audit — green.
- Time & Work/Pipes: 250-question five-mode signed-flow audit — green.
- TSD/Trains/Boats: 350 questions; 50/mode; 70/class; all declared contexts/difficulties; source ancestry; >=30 normalized stems; >=100 structural fingerprints; max cluster 10.
- Mixture/Alligation: 300 questions; 50/mode; 60/class; all six contexts/difficulties; source ancestry; >=24 normalized stems; >=80 fingerprints; max cluster 10.
- Mensuration: 350 questions; 50/mode; 70/class; both `MEN-001` and `MEN-002`; AREA/PERIMETER/CIRCUMFERENCE/VOLUME coverage; all ten contexts/difficulties; >=28 normalized stems; >=90 fingerprints; max cluster 10.

## Lifecycle lock

All CP-011 expansion content remains review-only until its executable audit and human review pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Remaining CP-011 breadth work

- Geometry after source-authority resolution
- richer Number System/Ratio/Percentage/Algebra target and context worlds

Reasoning adapters and three-statement DS remain later checkpoints; they are not silently folded into CP-011.
