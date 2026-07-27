# PNC-CP-008 Implementation Report

## Scope

Implemented and saturated `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints` as the second active canonical problem in `PNC-002`.

## Final inventory

- QLs: `PNC-QL-125` through `PNC-QL-147`;
- active English QLs: 23;
- active solve modes: 17;
- QL-specific natural explanations: 23;
- observed difficulty: 4 Easy / 11 Medium / 8 Hard;
- maturity: `RUNTIME_PROOF`;
- publication: disabled.

## Represented contracts

The runtime owns:

- one object at an exact position, either end, or away from both ends;
- two specified objects at the two ends;
- several named objects at prescribed positions;
- a specified set occupying a named position set in any order;
- prescribed relative-order chains of lengths two, three and four;
- two independent relative-order chains;
- strict alternation for equal categories, one-extra categories and a fixed starting category;
- gap placement so no two specified/category members are adjacent;
- exact, at-least and at-most separation between a specified pair;
- directional exact separation with one named object before another;
- exact and at-least counts of specified objects in odd/even position classes;
- bounded inverse recovery of an exact gap parameter.

## Runtime architecture

The package uses human-owned question, registry and explanation libraries. Exact factorial, permutation and combination formulas are the production authority. A separate recursive permutation enumerator checks the actual position, order, alternation, adjacency, separation and position-class predicates.

The five saturation additions are isolated in companion modules for parameters, solver, options, reasoning, explanation and validation. The original 18-QL CP-008 checkpoint remains independently traceable.

## Proof

- deterministic seeds per QL: 12;
- generated cases: 276;
- each case generated twice: yes;
- solver/enumerator disagreements: 0;
- validation failures: 0;
- option-contract failures: 0;
- unresolved placeholders: 0;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0;
- visible formulas: delimited LaTeX/MathJax.

## Editorial review

The generated 23-row review corpus was inspected after proof generation. The final directional-gap stem uses a position-distance formulation to avoid singular/plural defects while preserving the exact same mathematical contract.

## Saturation verdict

`SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY`

Remaining circular, conditional-selection, grouping/distribution and broader mixed systems remain owned by CP-010, CP-009, CP-011 and CP-012 respectively.

## Safety

- English only;
- `publiclyPublishable: false`;
- no generation-engine registration;
- no Question Studio exposure;
- no admin discovery or public-test routing.
