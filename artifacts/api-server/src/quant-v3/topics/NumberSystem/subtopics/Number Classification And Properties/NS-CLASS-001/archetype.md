# NS-CLASS-001 Phase A Archetype Discovery

## Identity

- Topic: Number System
- Subtopic: Number Classification And Properties
- Package: NS-CLASS-001
- Phase: A architecture discovery
- Status: architecture-only specification

## Objective

Discover the minimum recurring exam topologies for number classification and integer properties across SSC, Banking, Railway, CDS, NDA, CAPF, Punjab PCS and State PCS exams.

This package intentionally does not define JSON libraries, runtime files, generators, solvers, validators, pipelines, reasoning graphs, tests or audits.

## Scope

NS-CLASS-001 owns recurring exam topologies involving:

- even and odd outcome determination
- parity after arithmetic operations
- consecutive integer properties
- consecutive even and odd integer properties
- count of integers satisfying a property
- integer classification from given conditions
- positive and negative integer sign determination
- property-based missing number questions

## Educational Boundary

NS-CLASS-001 covers property recognition and classification when the final answer is a property, class, sign, parity, count or missing integer.

NS-CLASS-001 does not own:

- direct prime-number testing; owned by NS-PRM-001
- prime factorization; owned by NS-PF-001
- divisibility-rule digit replacement; owned by NS-DIV-001
- remainder reconstruction; owned by NS-REM-001 and NS-REM-002
- factor count, factor sum or kth factor; owned by NS-FAC-001
- HCF/LCM computation; owned by NS-HCF-001 and NS-LCM-001
- rational/irrational conversion or fraction arithmetic; owned by NS-FRACDEC-001
- exponent-law simplification; owned by NS-EXP-001
- surds and rationalization; future NS-SURD-001

## Discovery Principle

Canonical problems are selected from recurring exam-solving topologies, not from textbook headings or isolated formulas.

A CP is retained only when at least one of these changes:

- recognition step
- reasoning path
- solver topology
- validator requirement

Surface wording, number size, operation symbols and answer format variations are treated as parameter or language variants inside a CP.

## Active Canonical Problem List

| CP ID | Topology Name | Coverage Role |
| --- | --- | --- |
| NS-CLASS-001-CP01 | Parity Outcome Determination | Even/odd result after number or expression operations |
| NS-CLASS-001-CP02 | Sign Outcome Determination | Positive/negative/zero result after integer operations |
| NS-CLASS-001-CP03 | Consecutive Integer Property | Properties of consecutive, consecutive even and consecutive odd integers |
| NS-CLASS-001-CP04 | Count Integers Satisfying A Property | Count values in a range/list satisfying parity, sign or classification constraints |
| NS-CLASS-001-CP05 | Integer Classification From Conditions | Classify an integer from conditions such as parity, sign, square/cube behavior or divisibility hints |
| NS-CLASS-001-CP06 | Missing Number From Property Conditions | Find a missing integer from parity, sign, consecutive or classification constraints |

## Topology Count

Active topology count: 6

This is the minimum Phase A set. Even/odd and sign determination remain separate because their algebraic rules and validators differ. Consecutive integers, consecutive even integers and consecutive odd integers are merged because the reasoning topology is one property-of-sequence structure with different step sizes and parity constraints.

## Reuse Expectations

Future implementation should reuse:

- NS-DIV-001 for divisibility evidence when a condition requires it
- NS-REM-001 / NS-REM-002 for modulo-style residue reasoning if needed
- NS-PRM-001 for prime/composite ownership boundaries
- NS-FRACDEC-001 for rational/integer distinction boundaries
- NS-EXP-001 for exponent parity support when powers appear

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Human Review Framework
- Audit Framework

## Recommended Next Step

Human review of the six active CP topologies before creating educational libraries.
