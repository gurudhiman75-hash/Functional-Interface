# Algebra English V3 Editorial Audit

**Review authority:** `ALG-EN-review-v3`  
**Status:** `EXACT_HEAD_CI_PENDING`  
**Semantic QL freeze reopened:** no  
**Solver authority reopened:** no  
**Learner-English freeze reopened:** yes  
**Downstream delivery:** locked

## Why V3 exists

The all-variant learner review showed that correctness alone was not enough. Several explanations were technically correct but too compressed or visually dense for an exam learner. The product-owner review identified these explicit requirements:

1. learner explanations must render as visible, understandable steps;
2. temporary assumptions should prefer familiar `a, b, c` notation rather than arbitrary `u/v` or `S/P` aliases when a standard identity is being taught;
3. formula-based solutions must explain why the formula/theorem applies and then show substitution and calculation step by step;
4. unnecessary opening words in stems should be removed.

## V3 learner contract

Formula/theorem solutions follow this order where applicable:

```text
Given
Required
Why this method / formula applies
Formula or theorem
Substitution
Arithmetic / algebraic simplification
Final conclusion
```

This is a learner-presentation rule, not a solver-state change.

## Stem rules

- remove unnecessary `If ...` and `Given ...` wrappers;
- remove unnecessary `When P(x) ...` / `For P(x) ...` theorem wrappers;
- keep natural exam forms such as `For what value of k ...` when `For` is semantically part of the question;
- preserve the mathematical condition exactly.

## Notation rules

- prefer `a, b, c` for temporary substitutions used to invoke standard identities;
- keep `α, β, γ` when they are actual roots named by the question;
- avoid `u/v` aliases;
- avoid temporary `S/P` aliases for root sum/product when direct `α + β` and `αβ` are clearer;
- recurrence notation such as `Pₙ` remains allowed when it is the actual named recurrence quantity;
- simplify learner-facing integer ratios such as `(7)/(1)` to `7`.

## Formula rationale rules

The reason for using a method is family-specific rather than a repeated generic sentence. Examples include square/cube identities, reciprocal transforms, Remainder/Factor Theorem, discriminant/quadratic formula, Vieta and transformed roots, quadratic sign/vertex/global-sign analysis, Cauchy extrema, absolute value, and 3×3 elimination.

## Rendering rules

The HTML review exporter renders each explanation line as its own visible solution block. `Given`, `Required`, and `Why this method` steps receive separate guide blocks. Learner text is escaped before HTML insertion.

## Automated V3 gate

The V3 audit covers:

- 1,308 stress samples: 109 mapped variants × seeds 1..12;
- 109 deterministic all-variant review coordinates;
- 1,417 total learner samples;
- all 43 permanent QLs;
- semantic identity, prototype, solve-mode, seed, raw solver state and canonical-answer parity;
- unique all-variant questions and explanations;
- visible formula rationale followed by mathematical working;
- Data Sufficiency Statement I/II presence;
- no raw `If`/`Given` opening where the V3 rule applies;
- no `u/v` or temporary `S/P` aliases;
- no `±1x`, `+ -`, `x - -a`, `n/1`, `(n)/(1)`, raw HTML, `undefined`, or `NaN` learner output.

## Lifecycle boundary

V3 does **not** authorize English refreeze, Hindi/Punjabi localization, Question Studio discovery, Question Bank storage/write, test/mock eligibility, public publication, or merge.

The next authority after a green exact-head V3 artifact is product-owner review of that artifact. English can be refrozen only after explicit approval.
