# Algebra CP-007 Explanation-Only Controlled Reopen V4

**Scope:** `ALG-CP007-CAND-005`, `ALG-CP007-CAND-006` only  
**Permanent QL:** `ALG-QL-022`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

The post-delivery audit scores CP-007 at **94.6/100** with no low-score variants. Its only substantive weakness is explanation quality:

- CAND-005: only **3/16** distinct explanations despite 16/16 states and stems.
- CAND-006: only **3/16** distinct explanations plus **16 LOW_EXPLANATION_SPECIFICITY** findings.

No state-pool, stem, or answer remediation is justified.

## Explanation-only rule

V4 calls the existing CP-007 generator for every seed and preserves:

- the exact stem;
- the exact 2×2 system;
- the exact answer/classification.

Only the learner explanation is replaced.

For no-solution systems, the explanation shows the actual x- and y-coefficient ratios, computes the constant that would be required for the same line, and compares it with the actual second constant.

For infinite-solution systems, the explanation shows that the x coefficient, y coefficient, and constant all share the same multiplier, proving that the second equation is the same line.

## Review gate

Across 64 deterministic seeds per target:

- baseline stem/system/answer must remain identical;
- the exact solver must independently confirm `NO_SOLUTION` or `INFINITE_SOLUTIONS`;
- at least 48 distinct states and 48 distinct explanations must appear per target;
- each explanation must contain question-specific numerical working;
- the approved V3 freeze must remain unchanged.

The CI exporter produces `algebra-cp007-explanation-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before any new freeze authority or runtime wiring.
