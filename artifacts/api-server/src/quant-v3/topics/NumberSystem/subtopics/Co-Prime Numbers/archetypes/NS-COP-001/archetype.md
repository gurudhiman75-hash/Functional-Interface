# NS-COP-001 Archetype

## Identity

Archetype ID: NS-COP-001

Name: Co-Prime Numbers

Topic: Number System

Subtopic: Co-Prime Numbers

Status: Design and educational library package only

## Mathematical Foundation

Two positive integers are co-prime if their HCF is 1.

Equivalent language:

- co-prime numbers
- relatively prime numbers
- numbers with HCF 1
- numbers with no common factor other than 1

Consecutive positive integers are always co-prime.

A ratio is in lowest form when its two terms are co-prime.

## Educational Boundary

NS-COP-001 owns:

- co-prime identification
- relative-prime identification
- co-prime pair counting
- co-prime list filtering
- consecutive-number co-prime properties
- ratio reduction through HCF

NS-COP-001 does not own:

- direct HCF computation as a standalone final answer
- direct LCM computation
- prime factorization as a final answer
- divisibility rules
- remainder problems
- modular arithmetic

## Architecture Reuse

Future implementation must reuse:

- NS-PRM-001
- NS-PF-001
- NS-HCF-001
- NS-LCM-001
- NS-HL-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Audit Framework
- Human Review Framework

## Runtime Gate

This package does not create runtime files, generators, solvers, validators, reasoning graphs, pipelines, tests, or audits.

Runtime implementation may begin only after human review of this design and educational library package.
