# PNC-CP-007 Implementation Report

## Scope

Implemented `PNC-CP-007 — Together, Apart & Block Restrictions` as the first active CP in package `PNC-002`.

## Inventory

- QLs: `PNC-QL-107` through `PNC-QL-118`;
- active QLs: 12;
- solve modes: 5;
- natural QL-specific explanations: 12;
- difficulty: 1 Easy / 5 Medium / 6 Hard;
- language: English;
- maturity: `RUNTIME_PROOF`;
- publication: disabled.

## Runtime

The package supports:

- single specified blocks together;
- complement counting for pair/group not together;
- multiple simultaneous disjoint blocks;
- a required block plus a separate non-adjacent pair;
- bounded inverse recovery of \(n\) or block size.

Production formulas use exact factorial arithmetic. An independent recursive verifier enumerates every distinct linear permutation and checks the actual adjacency predicates. Inverse verification repeats that enumeration for every candidate in the stated domain.

## Presentation

Every QL has its own human-authored explanation. Visible calculations use MathJax delimiters and the package validator rejects raw visible factorial/operator expressions.

## Safety

No generation-engine, admin discovery, Question Studio publication or public-test routing was added. `publiclyPublishable` remains `false`.
