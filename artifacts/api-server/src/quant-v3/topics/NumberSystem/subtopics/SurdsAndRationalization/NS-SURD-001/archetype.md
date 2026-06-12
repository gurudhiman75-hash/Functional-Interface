# NS-SURD-001 Phase A Archetype Discovery

## Identity

- Topic: Number System
- Subtopic: Surds And Rationalization
- Package: NS-SURD-001
- Phase: A architecture discovery
- Status: content-free architecture specification

## Objective

Discover the minimum recurring exam topologies needed for surds and rationalization across SSC, Banking, Railway, CDS, NDA, CAPF, Punjab PCS, and State PCS style quantitative aptitude.

This package is architecture-only. It does not define runtime code, JSON libraries, generators, solvers, validators, pipelines, reasoning graphs, tests, audits, stem libraries, explanation libraries, shortcut libraries, or distribution targets.

## Discovery Principle

Canonical problems are selected from repeated exam solving patterns, not from formula lists or textbook headings. A separate CP exists only when the recognition step and reasoning path change enough that future solving, validation, or distractor logic would also change.

## Active Canonical Problem List

| CP ID | Topology Name | Coverage Role |
|---|---|---|
| NS-SURD-001-CP01 | Perfect-power extraction from a surd | Square-root and cube-root simplification |
| NS-SURD-001-CP02 | Like-surd addition and subtraction | Combining coefficients after simplification |
| NS-SURD-001-CP03 | Surd multiplication and division simplification | Product and quotient operations under radicals |
| NS-SURD-001-CP04 | Mixed surd expression simplification | Multi-step expressions using extraction and arithmetic |
| NS-SURD-001-CP05 | Surd comparison by normalization | Ordering and comparison of surd expressions |
| NS-SURD-001-CP06 | Monomial denominator rationalization | Rationalizing a single surd denominator |
| NS-SURD-001-CP07 | Binomial denominator rationalization | Rationalizing with a conjugate |
| NS-SURD-001-CP08 | Surd identity evaluation | Evaluating surd expressions using algebraic identities |

## Topology Count

Active topology count: 8

## Special Review Decisions

Square-root simplification and cube-root simplification are merged into CP01.

Justification:
The repeated exam topology is the same: identify the largest perfect power inside the radicand, extract it, and leave the non-extractable part inside the radical. The root index changes the allowed perfect power, but the recognition pattern and reasoning sequence remain the same. Future implementation can parameterize the root index instead of creating two CPs.

Monomial denominator rationalization and binomial denominator rationalization remain separate CPs.

Justification:
The reasoning changes. A monomial denominator is rationalized by multiplying by the missing radical factor. A binomial denominator is rationalized by multiplying by the conjugate and using the difference-of-squares pattern. These require different validation, distractor logic, and explanation structure.

Surd identity evaluation is separate from mixed surd expression simplification.

Justification:
The recognition pattern changes. In mixed simplification, students sequence arithmetic operations and collect like surds. In identity evaluation, students must first recognize a standard algebraic identity such as \((a+b)^2\), \((a-b)^2\), or \((a+b)(a-b)\), then simplify the result. This needs separate validation and distractor logic because the common mistakes are missed middle terms and incorrect conjugate products.

## Non-Goals

This package does not cover:

- irrational proof questions
- nested radical identities beyond exam-level simplification
- advanced algebraic surd equations
- trigonometric radical values
- approximation-only square-root questions
- coordinate geometry or mensuration applications using radicals
