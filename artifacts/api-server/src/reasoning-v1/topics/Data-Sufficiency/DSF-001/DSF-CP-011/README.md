# DSF-CP-011 — Two-Statement Quant Breadth Expansion

Status: **AVERAGE GREEN / AGES REVIEW CANDIDATE**

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
- `RAP-003/math::simplifyRatio`

DSF does not calculate the target age independently. Each surviving finite world is projected through the source solver; DSF owns only statement filtering and canonical sufficiency classification.

Solve modes:

- `DSF-SM-AGE-PRESENT-AGE-A`
- `DSF-SM-AGE-PRESENT-AGE-B`

Statement families include present ratio, sum, difference, exact age, future ratio, past ratio, bounds, parity, comparison, ratio+sum and ratio+difference.

Neutral student-facing contexts include cousins, colleagues, neighbours, club players, friends and siblings. No unstated age-order or cultural assumption is used.

Wave 2 is review-only until its executable audit is green.

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

1. Profit/Loss/Discount
2. Simple/Compound Interest
3. Time & Work / Pipes
4. Time-Speed-Distance / Trains / Boats
5. Mixture & Alligation
6. Geometry / Mensuration
7. richer Number System, Ratio, Percentage and Algebra target/world variants

Each wave must reuse the source chapter's solver/capability or stay blocked; CP-011 must not become a second arithmetic implementation layer inside DSF.
