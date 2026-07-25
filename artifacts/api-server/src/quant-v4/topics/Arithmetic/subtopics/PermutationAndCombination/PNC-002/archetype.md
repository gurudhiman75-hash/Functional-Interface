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
- English QLs: `PNC-QL-107` through `PNC-QL-208`;
- active English QLs: 102;
- active solve modes: 72;
- QL-specific natural explanations: 102;
- observed difficulty: 13 Easy / 48 Medium / 41 Hard;
- CP-007 deterministic runtime proof: 216 cases, each generated twice;
- CP-008 deterministic runtime proof: 276 cases, each generated twice;
- CP-009 deterministic runtime proof: 348 cases, each generated twice;
- CP-010 deterministic runtime proof: 256 cases, each generated twice;
- independent verification:
  - exhaustive linear-permutation enumeration for CP-007 and CP-008;
  - exhaustive fixed-size subset enumeration for CP-009;
  - exhaustive reference-fixed circular enumeration for CP-010 restrictions;
  - exhaustive subset selection followed by canonical circular enumeration for choose-then-circle modes;
  - canonical mirrored representatives for reflection-equivalent ornaments, rings and neighbour-set seatings;
- formula rendering: delimited LaTeX/MathJax;
- CP-007 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-008 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-009 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-010 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

Saturation means the material English predicates currently owned by a CP are represented and proof-backed. It is not freeze, localization, publication or production-integration approval. CP-010 passed its final source-backed gap audit, 32-QL generated review and exact runtime proof; Hindi, Punjabi and publication remain separate future stages.
