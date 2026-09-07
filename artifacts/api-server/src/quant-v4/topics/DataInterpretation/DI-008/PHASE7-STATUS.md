# DI-008 Arithmetic DI Phase 7

Status: `IMPLEMENTED_REVIEW_PENDING`

Scope:
- Banking Prelims and Banking Mains only.
- Five linked questions per shared product-economics dataset.
- Mixed percentage, ratio, average, profit/loss and revenue-contribution arithmetic.
- Prelims keeps direct single-product forms where appropriate.
- Mains requires multi-product aggregation/weighting before solving.
- Five options in both profiles.
- Deterministic seeded generation and materially separate independent verification.

Lifecycle lock:
- Question Studio discovery: OFF
- Question Bank: NOT_STORED
- Test eligibility: INELIGIBLE
- Public publication: false
- Permanent QLs: not allocated
- Localization: not started

Required gate before this checkpoint can be called green:
- 100 seeds × 2 banking profiles;
- zero five-option collisions;
- deterministic replay;
- independent verification;
- all product-role positions exercised;
- all correct-answer positions A-E exercised per task/profile;
- explicit Prelims-vs-Mains aggregation-depth proof;
- learner-surface/editorial lint clean;
- patch hygiene clean.
