# PNC-CP-009 Implementation Report

## Scope

Implemented and saturated `PNC-CP-009 — Conditional Selection from Categories` as the third active canonical problem in `PNC-002`.

## Final inventory

- QLs: `PNC-QL-148` through `PNC-QL-176`;
- active English QLs: 29;
- active solve modes: 21;
- QL-specific natural explanations: 29;
- observed difficulty: 5 Easy / 14 Medium / 10 Hard;
- maturity: `RUNTIME_PROOF`;
- publication: disabled.

## Represented contracts

The runtime owns:

- compulsory, excluded, and compulsory-plus-excluded named members;
- exact, at-least and at-most quotas across two categories;
- at least one member from one category or from every required category;
- exact and positive distributions across three categories;
- exact, at-least, at-most and inclusive-range counts from a specified subset;
- exactly one, at least one, not both, all-or-none and implication relations between named members;
- simultaneous lower and upper category bounds;
- named compulsory/excluded members combined with exact category quotas;
- bounded recovery of total pool size or category size.

## Runtime architecture

Human-owned question, registry and explanation libraries define the corpus. Exact combination formulas are the production authority. A separate recursive verifier enumerates every fixed-size subset and evaluates the actual named-member, category-quota and range predicates.

The four saturation QLs are isolated in companion solver, option, reasoning, explanation and validator modules. The original 25-QL checkpoint remains independently traceable.

## Proof

- deterministic seeds per QL: 12;
- generated cases: 348;
- each case generated twice: yes;
- solver/enumerator disagreements: 0;
- validation failures: 0;
- option-contract failures: 0;
- unresolved placeholders: 0;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0;
- visible formulas: delimited LaTeX/MathJax.

## Editorial review

The generated review corpus was inspected after proof generation. Parameter pools were corrected so category counts do not produce singular/plural defects. The final 29-row corpus validates cleanly with distinct stems and QL-specific explanations.

## Saturation verdict

`SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY`

Unrestricted selection remains CP-003, selection followed by roles remains CP-006, and circular, grouping/distribution and broader mixed systems remain CP-010, CP-011 and CP-012.

## Safety

- English only;
- `publiclyPublishable: false`;
- no generation-engine registration;
- no Question Studio exposure;
- no admin discovery or public-test routing.
