# DSF-CP-011 — Two-Statement Quant Breadth Expansion

Status: **AVERAGE GREEN / AGES GREEN / PROFIT-LOSS-DISCOUNT REVIEW CANDIDATE**

CP-011 is additive. It does not rewrite or weaken any authority frozen by DSF-CP-001 through DSF-CP-010.

## Permanent semantic identity

- QL: `DSF-QL-001`
- Contract: `TWO_STATEMENT_TARGET_DETERMINACY`
- Canonical semantic classes: unchanged five-class DSF model
- Answer-position truth remains separate from semantic truth
- No new permanent QL is allocated by CP-011

## Implemented source bindings

### Wave 1 — Average / `AVG-001`

Source capability reused directly:

- `AVG-001/foundation/solver::solveAvg001`

Solve modes:

- `DSF-SM-AVG-TOTAL-FROM-GROUP`
- `DSF-SM-AVG-AVERAGE-FROM-GROUP`

Student-facing contexts:

- class marks
- cricket innings
- parcel weights
- daily sales
- worker wages
- books per shelf

Dedicated CI is green for the API build plus the 250-question Average breadth/realness audit.

### Wave 2 — Ages / `RAP-003`

Source capability reused directly:

- `RAP-003/solver::solveRap003(ageFromSumAndRatio)`

DSF does not calculate the target age independently. Each surviving finite world is projected through the source solver; DSF owns only statement filtering and canonical sufficiency classification.

Solve modes:

- `DSF-SM-AGE-PRESENT-AGE-A`
- `DSF-SM-AGE-PRESENT-AGE-B`

Statement families include present ratio, sum, difference, exact age, future ratio, past ratio, bounds, parity, comparison, ratio+sum and ratio+difference.

Neutral student-facing contexts include cousins, colleagues, neighbours, club players, friends and siblings. No unstated age-order or cultural assumption is used.

Dedicated CI is green for the API build plus the 250-question Ages breadth/realness audit.

### Wave 3 — Profit/Loss/Discount / `PNL-001`

Source capabilities reused directly:

- `PNL-001/foundation/solver::solveFundamental`
- `PNL-001/foundation/discount-solver::solveDiscount`

The base price worlds are themselves created through the canonical PNL solvers. Every surviving world is then projected to the asked target through the appropriate source solver. CP-011 therefore does not own profit/loss or discount formulas.

Solve modes:

- `DSF-SM-PNL-SP-FROM-CP-RATE`
- `DSF-SM-PNL-CP-FROM-SP-RATE`
- `DSF-SM-PNL-RATE-FROM-CP-SP`
- `DSF-SM-DISCOUNT-SP-FROM-MP-RATE`
- `DSF-SM-DISCOUNT-RATE-FROM-MP-SP`
- `DSF-SM-DISCOUNT-MP-FROM-SP-RATE`

Statement families cover exact CP/SP/MP/rate, profit-or-loss direction, canonical price/rate pairs, bounds and low-information congruence conditions. Neutral retail contexts include books, garments, electronics, furniture, sports goods and stationery.

Wave 3 is review-only until its executable 250-question audit is green.

## Exam-realness rule

Generation identity is not accepted as evidence of student-visible variety. Each implemented lane additionally measures:

- normalized stem surfaces with numbers removed;
- target kind;
- Statement I/II family pairing;
- student-facing structural fingerprints;
- largest repeated structural cluster in a deterministic batch.

Insufficiency explanations prefer short counterexamples (two conflicting target answers) instead of dumping complete finite-world sets.

## Lifecycle

All CP-011 expansion questions remain review-only until their dedicated CI and human review gates pass:

- Question Studio discoverable: no
- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no

## Planned later CP-011 waves

High-value additive source bindings still remaining:

1. Simple/Compound Interest
2. Time & Work / Pipes
3. Time-Speed-Distance / Trains / Boats
4. Mixture & Alligation
5. Geometry / Mensuration
6. richer Number System, Ratio, Percentage and Algebra target/world variants

Each wave must reuse the source chapter's solver/capability or stay blocked; CP-011 must not become a second arithmetic implementation layer inside DSF.
