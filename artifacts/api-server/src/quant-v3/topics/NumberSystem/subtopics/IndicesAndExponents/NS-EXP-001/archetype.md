# NS-EXP-001 Phase A Archetype Discovery

## Identity

- Topic: Number System
- Subtopic: Indices And Exponents
- Package: NS-EXP-001
- Phase: A architecture discovery
- Status: content-free architecture specification

## Objective

Discover the minimum canonical problem topologies needed for recurring exam-style questions on indices and exponents. This package intentionally does not define generators, solvers, validators, runtime schemas, JSON libraries, tests, audits, stem banks, explanation banks, or shortcut banks.

## Scope

This package covers recurring question topologies involving:

- exponent simplification
- product law
- quotient law
- power of power
- positive exponents
- negative exponents
- fractional exponents
- root-exponent equivalence
- comparison of exponential expressions
- missing exponent
- simple exponent equations
- power transformations

## Discovery Principle

Canonical problems are chosen from repeated exam solving patterns, not from a formula list or chapter table. If two question forms require the same recognition step and the same reasoning path, they are merged into one CP even if their wording or surface formula differs.

## Active Canonical Problem List

| CP ID | Topology Name | Coverage Role |
|---|---|---|
| NS-EXP-001-CP01 | Same-base exponent compression | Product, quotient, power-of-power simplification |
| NS-EXP-001-CP02 | Same-base exponent equation | Missing exponent and simple same-base equations |
| NS-EXP-001-CP03 | Common-base transformation and exponent solving | Rewriting numbers as powers of a shared base for simplification, comparison, or solving |
| NS-EXP-001-CP04 | Negative exponent normalization | Reciprocal reasoning and sign handling |
| NS-EXP-001-CP05 | Fractional exponent to root | Root-exponent equivalence and radical simplification |
| NS-EXP-001-CP06 | Mixed exponent expression simplification | Multi-law simplification in one expression |
| NS-EXP-001-CP07 | Exponential comparison by base alignment | Comparing expressions after rewriting bases |
| NS-EXP-001-CP09 | Value substitution using a given power relation | Using one given exponential relation to evaluate another |

## Topology Count

Active topology count: 8

This is the minimum Phase A set because each active CP has a distinct recognition trigger. Surface variants such as integer bases, prime bases, decimal-looking reciprocals, square-root forms, transformed exponent equations, and nested powers are treated as parameter or presentation variants inside these CPs, not separate CPs.

## Non-Goals

This package does not cover:

- logarithms
- exponential inequalities requiring calculus or graph behavior
- modular powers and unit digit cycles
- scientific notation
- growth/decay word problems
- compound interest applications
- advanced surds beyond direct fractional exponent equivalence

Those patterns require different subtopic packages or later Phase B/C discovery.
