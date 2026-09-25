# Algebra CP-009 Controlled Source Reopen V4

**Scope:** `ALG-CP009-CAND-005 / ALG-QL-026` only  
**Status:** `REVIEW_CANDIDATE_ONLY`  
**Lifecycle:** remains `BANK_ONLY`; no test/public promotion  
**Prior learner source:** `ALG-EN-v3-frozen`

## Audit basis

The post-delivery audit scores CP-009 at **85.5/100**. Only two patterns are below 75:

- CAND-002: 72/100 because of distractor-strategy variety — delivery-layer issue, not reopened here.
- CAND-005: 71/100 with only **11/16** mathematical states — genuine source-state issue.

CAND-006 has only low-severity setter-shorthand findings and remains untouched.

## State expansion

The old CAND-005 source was primarily monic, so the visible equal-roots parameter pool remained narrow.

V4 uses primitive exam-safe families of the form

`ax² - 2arx + ck = 0`

where `a`, the repeated root `r`, and the coefficient `c` of `k` vary independently within small integer bounds.

Equal roots require

`D = (-2ar)² - 4a(ck) = 0`

so

`k = ar²/c`.

Only states giving an integral `k` are admitted. The generated family is primitive as written, so diversity does not come from multiplying an unchanged equation by a common scalar.

The review gate also caps the visible arithmetic:

- `1 ≤ a ≤ 6`;
- `|b| ≤ 60`;
- `1 ≤ c ≤ 6`;
- `1 ≤ k ≤ 30`.

This keeps the questions closer to normal SSC/Banking calculation load while still providing more than 64 genuine parameter states.

## Review gate

Across 64 deterministic seeds:

- all 64 parameter states must be distinct and primitive;
- discriminant must be exactly zero;
- the exact quadratic solver must return `REPEATED_ROOT`;
- the repeated root must match the constructed root state;
- all four natural stem frames must appear;
- explanations must show the actual discriminant substitution;
- the approved V3 freeze remains unchanged.

The CI exporter produces `algebra-cp009-source-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before any new freeze authority or runtime wiring is created.
