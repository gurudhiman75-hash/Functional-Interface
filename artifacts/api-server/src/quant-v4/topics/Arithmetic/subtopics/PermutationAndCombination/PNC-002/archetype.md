# PNC-002 Archetype

## Identity

- Package: `PNC-002`
- Name: Restricted Arrangements, Grouping & Advanced Selection
- Family: `PermutationAndCombination`
- Active checkpoints:
  - `PNC-CP-007 — Together, Apart & Block Restrictions`
  - `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`
  - `PNC-CP-009 — Conditional Selection from Categories`
  - `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`
- Language: English runtime proof
- Publication: disabled

## Fixed ownership map

1. `PNC-CP-007 — Together, Apart & Block Restrictions`
2. `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`
3. `PNC-CP-009 — Conditional Selection from Categories`
4. `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`
5. `PNC-CP-011 — Grouping & Distribution`
6. `PNC-CP-012 — Mixed Advanced Counting Systems`

## Current reviewed state

- active CPs: 4;
- English QLs: `PNC-QL-107` through `PNC-QL-203`;
- active English QLs: 97;
- active solve modes: 68;
- QL-specific natural explanations: 97;
- observed difficulty: 13 Easy / 45 Medium / 39 Hard;
- CP-007 deterministic runtime proof: 216 cases, each generated twice;
- CP-008 deterministic runtime proof: 276 cases, each generated twice;
- CP-009 deterministic runtime proof: 348 cases, each generated twice;
- CP-010 initial deterministic runtime checkpoint: 216 cases, each generated twice;
- independent verification:
  - exhaustive linear-permutation enumeration for CP-007 and CP-008;
  - exhaustive fixed-size subset enumeration for CP-009;
  - exhaustive reference-fixed circular enumeration for CP-010;
  - canonical mirrored representatives for reflection-equivalent ornament modes;
- formula rendering: delimited LaTeX/MathJax;
- CP-007 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-008 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-009 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-010 verdict: `INITIAL ENGLISH RUNTIME CHECKPOINT — SATURATION AUDIT OPEN`;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

Saturation means a CP's material English predicates are represented and proof-backed. It is not freeze, localization, publication or production-integration approval. CP-010 remains open for generated review and a second gap audit before any saturation verdict.
