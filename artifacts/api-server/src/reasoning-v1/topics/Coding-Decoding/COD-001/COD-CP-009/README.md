# COD-CP-009 — Sentence and Artificial-Language Coding

Status: **design complete; prototype discovery open; runtime not implemented; permanent QLs not allocated**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-009-END-TO-END-DESIGN.md`
3. `COD-CP-009-QL-DISCOVERY-AUDIT.md`
4. `COD-CP-009-IMPLEMENTATION-PLAN.md`

## Core decision

CP-009 is implemented as a bounded constraint-satisfaction runtime over a hidden one-to-one word-token mapping. Displayed code-token order is irrelevant. Every exact, possible or impossible answer is proven against the complete mapping space reconstructed from displayed statements.

## Current provisional coverage

- exact word-to-token and token-to-word;
- exact phrase-to-token-set and inverse;
- missing word or token;
- possible word/token relationships;
- impossible word/token relationships;
- possible phrase/token-set relationships;
- direct, chained, difference, global-bijection and partial-information solve modes.

These are prototype contracts, not permanent QLs. Counts and IDs remain open until executable merge/split and gap audits pass.

## Explicit exclusions

- Data Sufficiency wrappers;
- positional token-order coding;
- operator substitution;
- conditional table coding;
- renaming entities;
- free-form sentence generation.

## Next action

Implement only the abstract constraint solver and independent exhaustive verifier. Do not allocate permanent QLs yet.
