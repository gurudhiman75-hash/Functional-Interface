# SIMPL-001 Archetype

## Identity

Archetype ID: SIMPL-001

Name: Simplification And Approximation

Topic: Simplification And Approximation

Status: Phase A architecture plus human language draft

This package is design-only. It contains no runtime implementation, generators, solvers, validators, pipelines, reasoning graphs, tests, audits, or JSON educational libraries.

## Educational Boundary

SIMPL-001 owns recurring exam questions where the learner must simplify, evaluate, approximate, or choose a nearest value for arithmetic expressions.

SIMPL-001 includes:

- BODMAS expression simplification
- Fraction expression simplification
- Decimal expression simplification
- Mixed fraction and decimal expressions
- Square-root, cube-root, and power expressions
- Approximation using rounded values
- Closest-value and nearest-option questions

SIMPL-001 does not own:

- Fraction to decimal conversion as a standalone Number System skill
- Recurring decimal conversion
- HCF or LCM of fractions
- Number classification
- Algebraic simplification with variables
- Surds and rationalization as a full topic
- Data interpretation approximation

## Mathematical Foundation

Simplification questions require applying the order of operations and reducing the expression to a final value.

Approximation questions require replacing difficult values with suitable nearby values and then computing an estimated result.

Nearest-value questions require identifying which option is closest to the computed or estimated value.

## Active Canonical Problems

SIMPL-001 retains seven active canonical problem topologies:

- CP-001 BODMAS Exact Simplification
- CP-002 Fraction Expression Simplification
- CP-003 Decimal Expression Simplification
- CP-004 Mixed Fraction And Decimal Simplification
- CP-005 Root And Power Expression Simplification
- CP-006 Approximation By Rounding
- CP-007 Closest Or Nearest Value Selection

Topology count: 7

## Architecture Reuse

Future implementation should reuse existing Quant V3 architecture patterns for:

- educational library loading
- traceability
- validation
- coverage
- audit reporting
- human review export

Future implementation may reuse arithmetic support from related Number System archetypes where appropriate, especially fraction, decimal, exponent, digit, and root handling.

## Runtime Gate

Runtime implementation may begin only after human review approves:

- canonical problem topology
- language draft
- coverage categories
- variable ranges
- explanation families

This Phase A package intentionally does not define JSON libraries.
