# Algebra CP-003 Controlled Source Reopen V4

**Scope:** `ALG-CP003-CAND-004 / ALG-QL-011` and `ALG-CP003-CAND-006 / ALG-QL-013` only  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

After the delivery-level distractor remediation, CP-003 improved to **77.2/100**. Four of its six patterns are already healthy:

- CAND-001: 93
- CAND-002: 100
- CAND-003: 75
- CAND-005: 99

Only two source-side defects remain:

- **CAND-004 / ALG-QL-011:** 10/16 mathematical states and one dominant frame; score 62.
- **CAND-006 / ALG-QL-013:** 2/16 mathematical states, 2 stems and 2 explanations; score 34.

This reopen deliberately leaves the four healthy patterns untouched.

## Frozen boundaries retained

- permanent identities remain `ALG-QL-011` and `ALG-QL-013`;
- CP remains `ALG-CP-003`, package remains `ALG-001`;
- QL-011 remains the symmetric square / pairwise-product conversion contract;
- QL-013 remains the cyclic reciprocal multi-variable relation contract;
- exact rational arithmetic remains the solver authority;
- no Question Bank, mock/test, public or Question Studio activation is introduced.

## CAND-004 remediation

The old source derived the visible square-sum state from a narrow hidden integer pool, producing only 10 distinct states in the 16-sample audit.

V4 selects from a larger set of **realizable integer zero-sum states**. The pool is built from small integer triples satisfying `a+b+c=0`, restricted to exam-appropriate square sums. The learner still solves the same identity:

`(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)`.

Four concise exam-style frames are used.

## CAND-006 remediation

The old source used only `q=1` and `q=-1`:

`a + 1/b = q`, `b + 1/c = q`.

The safe general identity is:

`a + q^2/b = q` and `b + q^2/c = q`  
implies  
`c + q^2/a = q`.

Proof:

1. `b=q^2/(q-a)`.
2. `q-b = -qa/(q-a)`.
3. Hence `c=q^2/(q-b)=q-q^2/a`.
4. Therefore `c+q^2/a=q`.

V4 varies non-zero integer `q` across a broad exam-safe range and validates each generated state with an exact rational witness. This is genuine mathematical-state diversity, not wording-only variation.

## Review gate

Across 64 deterministic seeds per target:

- CAND-004 must expose at least **34** distinct mathematical states;
- CAND-006 must expose at least **32** distinct mathematical states;
- each target must exercise all **4** natural stem frames;
- every answer must independently satisfy the retained semantic identity;
- the approved English V3 freeze proof must remain green;
- lifecycle flags must remain fully locked.

The CI exporter produces `algebra-cp003-source-reopen-v4-review.md` for human review.

## Promotion rule

Passing CI does not replace the approved V3 learner source. Product-owner review of the generated MD pack is required before any new freeze authority or runtime wiring is created.
