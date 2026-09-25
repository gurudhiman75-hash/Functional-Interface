# Algebra CP-008 Controlled Source Reopen V4

**Scope:** `ALG-CP001-CAND-006`, `ALG-CP008-CAND-005`, `ALG-CP008-CAND-007` only  
**Permanent QL:** `ALG-QL-024`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

The post-delivery audit shows CP-008 at **83.6/100** overall. Most patterns are already healthy. The remaining source-side defects are concentrated in:

- legacy `ALG-CP001-CAND-006`: 16 HIGH `THIN_EXPLANATION` findings for domain substitution;
- `ALG-CP008-CAND-005`: only **10/16** visible mathematical states;
- `ALG-CP008-CAND-007`: only **9/16** states and two dominant frames.

CAND-003, CAND-004 and CAND-006 have delivery/distractor findings rather than learner-source defects, so this reopen leaves them untouched.

## Domain-check remediation

The domain-check pattern now explicitly:

1. identifies the denominator;
2. substitutes the given x-value;
3. computes the actual denominator value;
4. decides defined/undefined from whether that value is zero.

The proof covers 64 distinct states and both Boolean outcomes.

## No-valid-root remediation

The no-solution family now varies two genuinely different linear roots:

`(x-a)²/(x-a) = x-b`, with `a ≠ b`.

Cross-multiplication gives `(b-a)(x-a)=0`, so the only algebraic candidate is `x=a`. That value is excluded by the original denominator, leaving no valid solution. The second root parameter changes the actual equation rather than multiplying an unchanged factor by a cosmetic scalar.

## Infinite-on-domain remediation

The restricted identity family now varies two genuine domain exclusions:

`(x-a)/(x-a) = (x-b)/(x-b)`, with `a ≠ b`.

Both sides equal 1 wherever they are defined. The exact solver therefore returns `INFINITE_ON_DOMAIN` with the two excluded values `a` and `b`. Diversity is measured from the excluded-value pair, not coefficient scaling.

## Frozen boundaries

- permanent identity remains `ALG-QL-024`;
- the contract remains rational-equation solving with original-domain filtering;
- exact solver authority is unchanged;
- standard categorical answer families are preserved;
- no Question Bank, mock/test, public, or Question Studio activation is introduced.

## Promotion rule

Passing CI does not replace the approved V3 source. Product-owner review of the generated MD is required before any new freeze authority or runtime wiring.
