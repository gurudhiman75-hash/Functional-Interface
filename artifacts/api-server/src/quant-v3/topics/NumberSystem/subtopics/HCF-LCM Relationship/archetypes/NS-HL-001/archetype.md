# NS-HL-001 Archetype

## Identity

Archetype ID: NS-HL-001

Name: HCF-LCM Relationship

Topic: Number System

Subtopic: HCF-LCM Relationship

Status: Phase A architecture discovery only

## Design Boundary

NS-HL-001 owns questions where the educational work is the relationship between HCF, LCM, and the original numbers.

Owned concepts:

- HCF x LCM product relation for two numbers
- missing number reconstruction using HCF, LCM, and one number
- number-pair reconstruction from HCF and LCM
- possible-pair counting from HCF and LCM
- ratio-based reconstruction using HCF and/or LCM
- validity checks for HCF-LCM combinations

Not owned:

- direct HCF computation
- direct LCM computation
- prime factorization as a final answer
- divisibility-rule questions
- remainder questions
- modular arithmetic
- standalone factor-count or factor-list questions

## Mathematical Foundation

For two positive integers a and b:

HCF(a,b) x LCM(a,b) = a x b

If HCF(a,b) = h, then:

a = h x m

b = h x n

where m and n are co-prime.

Since:

LCM(a,b) = h x m x n

the reduced multiplier product is:

m x n = LCM / HCF

This relation is valid only when HCF divides LCM.

## Educational Boundary

This archetype focuses on recognizing and using the relationship after HCF and LCM are known or given. It does not require learners to compute HCF or LCM as the primary objective, although future implementations may reuse HCF and LCM solvers to verify generated values.

## Architecture Reuse

Future implementation must reuse:

- NS-PRM-001
- NS-PF-001
- NS-FAC-001
- NS-HCF-001
- NS-LCM-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Audit Framework
- Human Review Framework

## Phase A Runtime Gate

This package is design-only.

Phase A does not create:

- educational JSON libraries
- runtime files
- generators
- solvers
- validators
- reasoning graphs
- pipelines
- tests
- audits

Implementation may begin only after human approval of the canonical problem architecture and later approval of educational language libraries.
