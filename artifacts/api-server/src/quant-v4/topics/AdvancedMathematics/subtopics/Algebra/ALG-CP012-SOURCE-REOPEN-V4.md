# Algebra CP-012 Controlled Source Reopen V4

**Scope:** `ALG-CP012-CAND-011`, `ALG-CP012-CAND-012` only  
**Permanent QL:** `ALG-QL-043`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

The post-delivery audit scores CP-012 at **87.6/100**. Only two source patterns fall below 75:

- CAND-011 — reciprocal-sum extremum: **57/100**, 9/16 states, one frame.
- CAND-012 — square-sum extremum: **68/100**, 11/16 states, one frame.

CAND-009 has a distractor-strategy finding only, so it is not reopened at the learner-source layer. All other CP-012 patterns score 84–100 and remain untouched.

## State expansion

Both retained QL-043 contracts remain three-positive-variable fixed-sum extrema. V4 expands the visible fixed-sum pool from a narrow hash-selected `3..18` range to 36 exam-safe values `6..41`.

For CAND-011:

`(x+y+z)(1/x+1/y+1/z) >= 9`

so the least reciprocal sum is `9/S`, attained at `x=y=z=S/3`.

For CAND-012:

`(x+y+z)^2 <= 3(x^2+y^2+z^2)`

so the least square sum is `S^2/3`, again attained at `x=y=z=S/3`.

Each target uses four concise exam-style frames. No story context is added to an abstract Algebra identity.

## Review gate

Across 64 deterministic seeds per target:

- 36 distinct fixed-sum mathematical states must be exercised;
- the exact Cauchy bound must match the canonical answer;
- the equality state `x=y=z=S/3` must be shown;
- all four natural stem frames must appear;
- explanations must remain beginner-friendly;
- approved V3 remains unchanged.

The CI exporter produces `algebra-cp012-source-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before any new freeze authority or runtime wiring.
