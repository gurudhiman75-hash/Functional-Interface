# Algebra CP-004 Controlled Source Reopen V4

**Scope:** `ALG-CP004-CAND-002` and `ALG-CP004-CAND-003` only  
**Permanent QL:** `ALG-QL-014`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

After delivery-level remediation, CP-004 still contains two clear state-pool bottlenecks:

- CAND-002 — difference of squares: **35/100**, only **7/16** states and one dominant frame;
- CAND-003 — perfect-square trinomial: **59/100**, only **9/16** states.

The healthy generic quadratic factorisation patterns are not reopened.

## Frozen boundaries

Both targets remain under `ALG-QL-014`, the identity-form recognition/factorisation contract. CP remains `ALG-CP-004`, package remains `ALG-001`, and no runtime or lifecycle promotion is introduced.

## Genuine state expansion

CAND-002 expands from only `x²-a²` to the same retained identity with genuine coefficient variation:

`(mx)²-n² = (mx-n)(mx+n)`.

CAND-003 expands to:

`(mx±n)² = m²x² ± 2mnx + n²`.

The coefficient ranges are intentionally small enough for aptitude exams. Diversity comes from different algebraic states, not common-factor scaling or decorative wording.

## Review gate

Across 64 deterministic seeds per target:

- all 64 mathematical states must be distinct;
- the factorisation identity must be verified independently;
- all four natural stem frames must appear;
- explanations must remain simple and sufficiently worked;
- the approved V3 freeze remains unchanged.

The CI exporter produces `algebra-cp004-source-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before any new freeze authority or runtime wiring is created.
