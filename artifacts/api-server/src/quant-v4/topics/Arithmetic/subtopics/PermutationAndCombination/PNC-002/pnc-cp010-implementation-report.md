# PNC-CP-010 Initial Implementation Report

## Scope delivered

- canonical problem: `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`;
- branch base: completed CP-009 head `ed03de7ff27c6025c26890748882550106323451`;
- immutable QL range: `PNC-QL-177` through `PNC-QL-203`;
- current checkpoint QLs: 27;
- current need-based solve modes: 21;
- English runtime only;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

## Runtime architecture

The checkpoint adds CP-specific human-owned language, registry, range, constraint and explanation libraries plus:

- deterministic parameter generation;
- exact circular and dihedral solvers;
- solver-owned evidence;
- QL-specific natural explanations;
- misconception-oriented four-option generation;
- independent circular enumeration;
- CP-specific validation and coverage audit;
- deterministic review export.

## Mathematical boundaries

Round-table rotation, one-sided rotation-only ornament counting and reflection-equivalent necklace counting have separate solve modes and evidence. Reflection division is never silently applied to table seating.

Circular restrictions include block compression, complements, inclusion–exclusion, directed clockwise spacing, relative order, alternation, gap placement and bounded inverse recovery.

## Current proof snapshot

The bundled test is configured for:

- 27 QLs;
- 21 solve modes;
- 216 deterministic runtime cases (`27 × 8`);
- every case generated twice;
- independent enumeration agreement;
- four positive unique options;
- exact answer-index agreement;
- unresolved-placeholder rejection;
- delimited LaTeX/MathJax calculations;
- review JSON and CSV export.

These are current regression numbers, not future content quotas.

## Release safety

- no generation-engine registration;
- no Question Studio exposure;
- no admin discovery;
- no public-test routing;
- Hindi and Punjabi not started;
- saturation verdict intentionally withheld.
