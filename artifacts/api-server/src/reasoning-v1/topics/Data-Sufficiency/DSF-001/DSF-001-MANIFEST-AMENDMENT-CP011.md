# DSF-001 Manifest Amendment — CP-011 Two-Statement Quant Breadth Expansion

## Authority boundary

- Checkpoint: `DSF-CP-011`
- Status: `WAVE1_REVIEW_CANDIDATE`
- Base production freeze: `DSF-CP-010`
- Permanent QL reused: `DSF-QL-001`
- Next available permanent QL remains: `DSF-QL-002`
- New permanent QL allocation: **none**

CP-011 is an additive breadth checkpoint. CP-001 through CP-010 remain immutable historical authorities.

## Wave 1 delta

Adds an Average source adapter backed by the canonical `AVG-001` solver.

| Source chapter | DSF solve modes | Source truth owner | Status |
| --- | --- | --- | --- |
| `AVG-001` | `DSF-SM-AVG-TOTAL-FROM-GROUP`, `DSF-SM-AVG-AVERAGE-FROM-GROUP` | `AVG-001/foundation/solver::solveAvg001` | review candidate |

The adapter enumerates valid count/average worlds, filters those worlds independently through Statement I, Statement II and their conjunction, then projects each surviving world to the asked answer by calling the source solver. The existing shared DSF evaluator alone assigns the canonical sufficiency class.

## Exam-realness delta

Wave 1 introduces six context worlds and four intro surfaces per context instead of exposing one fixed abstract Average stem. It also introduces a deterministic perceptual repetition audit based on normalized stems and statement-family structure.

Explanation policy is deliberately shorter than the early CP-001 finite-world explanations: where a statement is insufficient, two conflicting target answers are enough to prove insufficiency.

## Required Wave 1 proof

Dedicated CI/review must prove at least:

1. all five canonical sufficiency classes occur;
2. both Average solve modes occur;
3. all six context worlds occur;
4. Easy/Medium/Hard occur corpus-wide;
5. exactly one correct option per question;
6. source ancestry points to `AVG-001::solveAvg001`;
7. deterministic generation identities are unique in the audit batch;
8. at least 16 normalized non-numeric stem surfaces in 250 deterministic questions;
9. at least 40 student-facing structural fingerprints in the same batch;
10. no structural fingerprint occupies more than 14/250 questions.

## Lifecycle lock

Until Wave 1 review/CI passes, CP-011 questions are not exposed through the production Question Studio lifecycle and cannot enter Question Bank, scored tests, mock tests or student delivery.

## Remaining CP-011 breadth work

- Ages
- Profit/Loss/Discount
- SI/CI
- Time & Work/Pipes
- TSD/Trains/Boats
- Mixture & Alligation
- Geometry/Mensuration
- additional Number System/Ratio/Percentage/Algebra target and context worlds

Reasoning adapters and three-statement DS remain later checkpoints; they are not silently folded into CP-011.
