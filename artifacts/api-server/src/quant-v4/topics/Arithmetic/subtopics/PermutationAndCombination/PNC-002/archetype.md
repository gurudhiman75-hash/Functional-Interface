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
  - `PNC-CP-011 — Grouping & Distribution`
  - `PNC-CP-012 — Mixed Advanced Counting Systems`
- Language: English runtime proof
- Publication: disabled

## Fixed ownership map

1. `PNC-CP-007 — Together, Apart & Block Restrictions`
2. `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`
3. `PNC-CP-009 — Conditional Selection from Categories`
4. `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`
5. `PNC-CP-011 — Grouping & Distribution`
6. `PNC-CP-012 — Mixed Advanced Counting Systems`

## Final reviewed state

- active CPs: 6;
- English QLs: `PNC-QL-107` through `PNC-QL-269`;
- active English QLs: 163;
- active solve modes: 130;
- QL-specific natural explanations: 163;
- observed difficulty: 18 Easy / 77 Medium / 68 Hard;
- CP-007 deterministic runtime proof: 216 cases, each generated twice;
- CP-008 deterministic runtime proof: 276 cases, each generated twice;
- CP-009 deterministic runtime proof: 348 cases, each generated twice;
- CP-010 deterministic runtime proof: 256 cases, each generated twice;
- CP-011 deterministic runtime proof:
  - grouping: 120 cases, each generated twice;
  - distinct-object distribution: 120 cases, each generated twice;
  - identical-object distribution: 120 cases, each generated twice;
  - bounded inverse recovery: 72 cases, each generated twice;
- CP-012 deterministic runtime proof: 224 cases, each generated twice, plus 84 reviewed-TeX cases;
- independent verification:
  - exhaustive linear-permutation enumeration for CP-007 and CP-008;
  - exhaustive fixed-size subset enumeration for CP-009;
  - exhaustive reference-fixed circular and dihedral enumeration for CP-010;
  - independent grouping, assignment, composition, set-partition and integer-partition enumeration for CP-011;
  - independent subset/role, permutation, circular, grid-path, bounded-occupancy, colour-composition and team-partition enumeration for CP-012;
- formula rendering: delimited LaTeX/MathJax;
- CP-007 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-008 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-009 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-010 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-011 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- CP-012 verdict: `SATURATED FOR CURRENT ENGLISH OWNERSHIP`;
- family verdict: `PNC-002 ENGLISH OWNERSHIP COMPLETE AT RUNTIME-PROOF MATURITY`;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

Saturation means all material English predicates currently owned by each CP are represented and proof-backed. It is not localization, publication, shared-composer registration or production-integration approval. Hindi, Punjabi and publication remain separate later stages.
