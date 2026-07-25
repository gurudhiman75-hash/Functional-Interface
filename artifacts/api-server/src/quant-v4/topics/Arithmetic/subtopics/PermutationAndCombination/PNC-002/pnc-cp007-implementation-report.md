# PNC-CP-007 Implementation Report

## Scope

Implemented and saturated `PNC-CP-007 — Together, Apart & Block Restrictions` as the first active CP in package `PNC-002`.

## Inventory

- QLs: `PNC-QL-107` through `PNC-QL-124`;
- active QLs: 18;
- solve modes: 9;
- natural QL-specific explanations: 18;
- difficulty: 1 Easy / 8 Medium / 9 Hard;
- language: English;
- maturity: `RUNTIME_PROOF`;
- CP-007 coverage verdict: saturated;
- publication: disabled.

## Runtime

The package supports:

- single specified blocks together;
- complement counting for pair/group not together;
- multiple simultaneous disjoint blocks;
- a required block plus a separate non-adjacent pair;
- two formed blocks that must not touch;
- a required block separated from a named outsider;
- one required block together while another group is broken;
- complements where at least one of several specified blocks is broken;
- bounded inverse recovery of \(n\) or block size, including a separated-block inverse.

Production formulas use exact factorial arithmetic. An independent recursive verifier enumerates every distinct linear permutation and checks the actual block and adjacency predicates. Inverse verification repeats that enumeration for every candidate in the stated domain.

## Proof

- deterministic seeds per QL: 12;
- generated cases: 216;
- each case generated twice;
- solver/enumerator disagreements: 0;
- validation failures: 0;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0.

## Presentation and safety

Every QL has its own human-authored explanation. Visible calculations use MathJax delimiters. No generation-engine, admin discovery, Question Studio publication or public-test routing was added. `publiclyPublishable` remains `false`.
