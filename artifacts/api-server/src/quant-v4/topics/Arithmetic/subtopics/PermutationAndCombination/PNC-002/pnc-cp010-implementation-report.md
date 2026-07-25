# PNC-CP-010 Saturation-Expanded Implementation Report

## Scope delivered

- canonical problem: `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`;
- branch base: merged CP-009 state;
- immutable QL range: `PNC-QL-177` through `PNC-QL-205`;
- active QLs: 29;
- need-based solve modes: 22;
- observed difficulty: 3 Easy / 13 Medium / 13 Hard;
- English runtime only;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

## Runtime architecture

The checkpoint contains CP-specific human-owned language, registry, range, constraint and explanation libraries plus:

- deterministic parameter generation;
- exact circular and dihedral solvers;
- solver-owned evidence;
- QL-specific natural explanations;
- misconception-oriented four-option generation;
- independent circular enumeration;
- CP-specific validation and coverage audit;
- deterministic review export.

## Saturation expansion

The initial checkpoint contained 27 QLs (`PNC-QL-177..203`) and 21 solve modes. A second ownership audit identified two meaningful gaps rather than inflating the chapter with cosmetic variants:

1. a larger specified circular group must not all occupy consecutive seats — `PNC-QL-204`;
2. exactly one of two disjoint specified pairs must sit together — `PNC-QL-205`.

The first reuses the existing circular-block-complement authority because its solver, evidence and validator remain the same. The second adds an exclusive pair-event contract with the exact formula `2 × (one-pair count − both-pairs count)` and an independently enumerated XOR adjacency predicate.

## Mathematical boundaries

Round-table rotation, one-sided rotation-only ornament counting and reflection-equivalent necklace counting have separate solve modes and evidence. Reflection division is never silently applied to table seating.

Circular restrictions include block compression, complements, inclusion–exclusion, exclusive pair events, directed clockwise spacing, relative order, alternation, gap placement and bounded inverse recovery.

Repeated-colour necklaces requiring Burnside/Pólya analysis remain outside CP-010. Grouping/distribution remains CP-011, while mixed selection-plus-circular systems remain CP-012.

## Current proof contract

The bundled proof now requires:

- 29 contiguous QLs;
- 22 solve modes;
- 3 Easy / 13 Medium / 13 Hard;
- 232 deterministic runtime cases (`29 × 8`);
- every case generated twice;
- independent enumeration agreement;
- four positive unique options;
- exact answer-index agreement;
- unresolved-placeholder rejection;
- delimited LaTeX/MathJax calculations;
- direct solver contracts for QLs 204 and 205;
- review JSON and CSV export containing 29 rows.

These values are regression snapshots discovered from current ownership coverage, not fixed future quotas.

## Release safety

- no generation-engine registration;
- no Question Studio exposure;
- no admin discovery;
- no public-test routing;
- Hindi and Punjabi not started;
- final saturation verdict withheld until the expanded proof, generated review and final gap audit pass.
