# Algebra CP-011 Controlled Source Reopen V4

**Scope:** `ALG-QL-032` / `ALG-CP-011` only  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** stays `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Why this reopen exists

The Quant V4 distinctive-content audit showed that delivery-only distractor remediation improved Algebra substantially, but CP-011 remained the weakest major family. The remaining weakness is learner-content diversity rather than answer routing.

The approved English V3 learner source is not edited in place. This V4 candidate is a separate review surface.

## Frozen boundaries retained

- permanent identity remains `ALG-QL-032`;
- semantic contract remains Banking comparison of all admissible quadratic roots;
- the seven approved CP-011 comparison modes remain the semantic variants;
- shared quadratic/surd solver authority is unchanged;
- answer relation semantics are unchanged;
- Question Bank, mock/test eligibility, public publication and production release remain disabled.

## Learner-content changes proposed

1. Broaden integer-root states with independently varied base values, root gaps and separation.
2. Keep generated quadratics primitive so diversity comes from mathematical states rather than common-factor scaling. The equal-repeated-root semantic case alone may scale Equation II by 2 or 3 to avoid displaying two identical equations; that scale is excluded from the diversity measurement.
3. Expand irrational-conjugate states across radicands 2, 3, 5, 6, 7 and 10.
4. Replace the repeated one-line `Equation I ... Equation II ... Compare x and y.` frame with four natural Banking-style frames.
5. Replace exhaustive pair-list explanations with a simpler range/boundary argument where possible.
6. For indeterminate cases, show one `x < y` witness and one `x > y` witness so the reason is immediately visible.

## Review gate

The V4 proof must demonstrate, for every one of the seven variants:

- deterministic generation;
- independent solver agreement on the canonical relation;
- at least 32 distinct mathematical root states across 64 seeds;
- at least 32 distinct rendered questions and explanations across 64 seeds;
- at least three natural stem frames exercised;
- no lifecycle leakage.

The CI review exporter produces `algebra-cp011-source-reopen-v4-review.md` with two deterministic examples per variant.

## Promotion rule

This candidate does **not** supersede English V3 merely by passing CI. Product-owner review of the generated MD pack is required before any new freeze authority or runtime wiring is created.
