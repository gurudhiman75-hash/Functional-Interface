# Algebra CP-013 Controlled Explanation Reopen V4

**Scope:** `ALG-CP013-CAND-004` and `ALG-CP013-CAND-007` only  
**Permanent QLs:** `ALG-QL-037`, `ALG-QL-038`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

The post-delivery CP-013 family is already strong overall. No state-pool expansion is justified.

Only two source-side explanation findings remain:

- CAND-004: **83/100**, with only **7/16 distinct explanations** for negative-right-side absolute equations;
- CAND-007: **92/100**, with repeated `LOW_EXPLANATION_SPECIFICITY` findings for zero-boundary absolute inequalities.

Other CP-013 findings are answer-position/editorial delivery issues and are not reopened here.

## Safety boundary

This is an **explanation-only** reopen.

For every deterministic proof sample, V4 must replay the active CP-013 generator and preserve exactly:

- the learner question;
- the mathematical state;
- the canonical answer.

Only the explanation text is replaced.

## CAND-004 remediation

For `|ax+b| = r` with `r < 0`, the explanation now states:

1. an absolute value is always at least zero;
2. the actual right-hand side is negative;
3. even the minimum possible left side, zero, cannot equal that negative value;
4. therefore there is no real solution.

The actual expression and RHS are included so explanations vary with the question rather than repeating one generic sentence.

## CAND-007 remediation

For `|ax+b| > 0` or `|ax+b| ≥ 0`, V4 explicitly solves

`ax+b=0`

to show the exact zero point `x=-b/a`.

- For `> 0`, that one value is excluded.
- For `≥ 0`, equality is allowed, so every real x is included.

This directly addresses the audit's explanation-specificity finding.

## Promotion rule

Passing CI does not replace V3 and does not authorize any lifecycle change. Product-owner review of the generated MD is required before a new freeze authority or runtime wiring is created.
