# MAL-CP-005 Wave 03 — Price-Change Profit-Amount Candidate

## Status

`EXECUTABLE_CANDIDATE / PENDING_PRODUCT_REVIEW`

This checkpoint implements the one source-backed candidate discovered by Wave 02 without allocating a permanent `MAL-QL-*` identity or permanent solve mode.

Candidate ID:

`MAL-CP005-CAND-PROFIT-AFTER-FREE-ADULTERATION-AND-PRICE-CHANGE`

Runtime:

`MAL-CP005-EN-PRICE-CHANGE-PROFIT-AMOUNT-CANDIDATE-V1`

Direct normalized authority:

`RS-AGGARWAL-QA-2017-P388-Q111`

## Source-faithful contract

The normalized source form gives:

- an original quantity of paid pure product;
- its purchase rate;
- free adulterant added as a percentage of the original pure quantity;
- a selling-price increase percentage; and
- asks for **total monetary profit**.

This last point is decisive. The approved CP-005 forward commercial-profit prototype answers `PROFIT_PERCENT`; the Wave 03 source asks for `PROFIT_AMOUNT`.

## Mathematical model

For pure quantity `Q`, pure unit cost `C`, adulterant percentage of the pure quantity `a`, and price increase `m`:

```text
free adulterant = Q × a/100
final quantity  = Q × (1 + a/100)
new selling rate = C × (1 + m/100)
actual cost = Q × C
revenue = final quantity × new selling rate
total profit = revenue − actual cost
```

The implied profit percentage is:

```text
[(1 + a/100)(1 + m/100) − 1] × 100
= a + m + am/100
```

The source witness normalizes to:

```text
Q = 20
C = ₹15 per unit
a = 10%
m = 10%
free adulterant = 2
final quantity = 22
new selling rate = ₹16.50
cost = ₹300
revenue = ₹363
total profit = ₹63
profit rate = 21%
```

## Equivalence decision

Wave 03 intentionally separates **mathematical-core equivalence** from **task-contract equivalence**.

The composition and selling-rate state canonicalizes exactly to the existing approved prototype:

`MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE`

using the existing solve request:

`FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE`.

Therefore Wave 03 introduces **no fourth mathematical core**.

However, it remains a distinct task-contract candidate because its requested answer is monetary profit rather than profit percentage. A scaling witness proves the distinction:

- double `Q` while keeping `C`, `a` and `m` fixed;
- profit percentage remains unchanged;
- total monetary profit doubles.

Thus the quantity/cost base is indispensable to the requested answer and cannot be dropped as decorative information.

Recommendation:

`RETAIN_AS_DISTINCT_TASK_CONTRACT_SHARED_CORE`

## Generator policy

The candidate generator:

- uses exact rational arithmetic;
- converts percentage inputs into a canonical existing commercial ledger;
- independently verifies the implied profit percentage against the approved CP-005 solver;
- requires whole-rupee correct answers and misconception-derived distractors;
- uses balanced deterministic answer shuffling;
- emits one-to-three-line solution-first learner explanations;
- records the normalized source ID on every question;
- excludes false-weight, false-measure and short-delivery language;
- remains English-only and review-only.

Named misconception routes include:

- adding the two percentages but omitting their interaction;
- counting only the free-adulterant effect;
- counting only the price-increase effect;
- counting only revenue contributed by free adulterant;
- counting only markup on the final quantity.

## Lifecycle boundary

Wave 03 does **not**:

- allocate a permanent QL;
- create/freeze a permanent solve mode;
- write to the Question Bank;
- enable test or mock delivery;
- enable public publication;
- authorize Hindi or Punjabi generation.

Those remain later explicit gates after product review of the generated candidate questions.
