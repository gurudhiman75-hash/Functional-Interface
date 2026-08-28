# DSF-CP-014 — Executable Foundation Freeze

Status: **GREEN — REUSABLE EDITORIAL FOUNDATION FROZEN**

Validated head before this authority-only record: `45da4eeae73ce3894ccfe20a486e762347a2d568`

Executable workflow: `Validate DSF CP-014 Editorial Anti-Duplicate Foundation`

Successful run: `33057329390`

The successful job completed:

1. locked dependency installation;
2. API server build;
3. CP014 editorial-audit test bundling; and
4. CP014 editorial-audit execution.

The validated foundation includes:

- numeric/percentage/currency-only variant normalization;
- caller-declared entity masking using reserved alphabetic sentinels;
- Statement-I/II swap detection;
- weighted unigram + adjacent-bigram near-duplicate detection;
- solve-mode-scoped candidate comparison by default;
- structural-cluster limits;
- explanation-opening repetition limits;
- context/object breadth limits; and
- maximum object-concentration limits.

The validated test suite includes the corrected sentinel regression and a deliberately high-overlap paraphrase fixture. The near-duplicate threshold was **not** weakened to make the fixture pass.

This freeze covers the reusable CP014 foundation only. It does not claim a combined CP012+CP013 corpus audit because those feature branches do not yet coexist on one merged base.

Lifecycle remains unchanged and locked. CP014 grants no Question Studio discovery, Question Bank writes, scored-test eligibility, mock eligibility or public publication authority.
