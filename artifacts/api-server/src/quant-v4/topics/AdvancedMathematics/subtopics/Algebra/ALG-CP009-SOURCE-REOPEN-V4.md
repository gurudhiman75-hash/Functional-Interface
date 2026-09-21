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

The old CAND-005 source was monic:

`x² + bx + k = 0`

with even b, so the visible state pool was narrow.

V4 uses primitive coprime integer pairs `m,n` and the quadratic:

`m²x² + 2mnx + k = 0`.

Equal roots require:

`D = (2mn)² - 4m²k = 0`

so:

`k = n²`.

This preserves the exact equal-roots parameter contract while adding genuine leading-coefficient and middle-coefficient variation.

## Review gate

Across 64 deterministic seeds:

- all 64 `(m,n)` states must be distinct and primitive;
- discriminant must be exactly zero;
- the exact quadratic solver must return `REPEATED_ROOT`;
- all four natural stem frames must appear;
- explanations must show the actual discriminant substitution and repeated root;
- the approved V3 freeze remains unchanged.

The CI exporter produces `algebra-cp009-source-reopen-v4-review.md`.

## Promotion rule

Passing CI does not replace V3. Product-owner review is required before any new freeze authority or runtime wiring is created.
