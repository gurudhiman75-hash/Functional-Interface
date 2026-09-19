# Algebra CP-002 Controlled Source Reopen V4

**Scope:** `ALG-CP002-CAND-003`, `ALG-CP002-CAND-006`, `ALG-CP002-CAND-007` only  
**Permanent QLs:** `ALG-QL-007`, `ALG-QL-008`  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Why these three patterns

After delivery-level distractor remediation, CP-002 averages **78.2/100**. Its remaining source deficits are concentrated in:

- CAND-003 — reciprocal square from `x+1/x`: score 51, 8/16 states;
- CAND-006 — reciprocal square from `x-1/x`: score 57, 9/16 states;
- CAND-007 — reciprocal cube from `x-1/x`: score 69, 11/16 states.

The other six CP-002 patterns are left untouched.

## Frozen boundaries

- CAND-003 and CAND-006 remain under `ALG-QL-007` reciprocal-square transform;
- CAND-007 remains under `ALG-QL-008` reciprocal-cube transform;
- package remains `ALG-001`, CP remains `ALG-CP-002`;
- exact rational arithmetic and the retained identities are unchanged;
- no production, Question Bank, mock/test, public, or Question Studio activation is introduced.

## State expansion

For `x+1/x=k`, V4 uses non-zero real-safe integer states with `|k|>=2`, covering `-18..-2` and `2..18` (34 visible states).

For `x-1/x=k`, every real integer k is admissible, so V4 covers `-18..18` (37 visible states).

Each target uses four concise exam-style frames. Diversity is counted from the visible k state, not cosmetic formatting.

## Retained mathematics

- `x+1/x=k` ⇒ `x²+1/x²=k²-2`.
- `x-1/x=k` ⇒ `x²+1/x²=k²+2`.
- `x-1/x=k` ⇒ `x³-1/x³=k³+3k`.

## Review gate

Across 64 deterministic seeds per target:

- CAND-003 must exercise all **34** real-safe k states;
- CAND-006 and CAND-007 must exercise all **37** k states;
- every canonical answer must independently match the retained identity;
- all four natural stem frames must appear;
- explanations must remain beginner-friendly;
- V3 freeze authority remains untouched and green.

The CI exporter produces `algebra-cp002-source-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before a new freeze authority or runtime wiring is created.
