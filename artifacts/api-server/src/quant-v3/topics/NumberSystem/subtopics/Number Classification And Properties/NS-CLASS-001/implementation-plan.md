# NS-CLASS-001 Implementation Plan

## Phase A Status

This package is architecture-only. It does not create runtime files, JSON libraries, generators, solvers, validators, pipelines, reasoning graphs, tests or audits.

## Active CP List

| CP ID | Name |
| --- | --- |
| NS-CLASS-001-CP01 | Parity Outcome Determination |
| NS-CLASS-001-CP02 | Sign Outcome Determination |
| NS-CLASS-001-CP03 | Consecutive Integer Property |
| NS-CLASS-001-CP04 | Count Integers Satisfying A Property |
| NS-CLASS-001-CP05 | Integer Classification From Conditions |
| NS-CLASS-001-CP06 | Missing Number From Property Conditions |

Topology count: 6

## CP01 Parity Outcome Determination

Educational objective:
Recognize whether a number or expression is even or odd without unnecessary arithmetic.

Inputs:

- integers or variables with known parity
- operation type
- expression

Outputs:

- parity: even or odd

Solver topology:

- classify inputs by parity
- apply parity rules
- return final parity

Future graph topology:

- captureInputs
- classifyParity
- applyParityRules
- extractAnswer

Validation requirements:

- independent parity recomputation
- support for addition, subtraction, multiplication and powers

Coverage requirements:

- direct parity
- sum/difference parity
- product parity
- power parity
- variable parity

Audit requirements:

- operation type
- input parity profile
- difficulty
- question language ID
- explanation ID

## CP02 Sign Outcome Determination

Educational objective:
Determine whether an integer expression is positive, negative or zero.

Inputs:

- signed integers or variables with known sign
- operation type
- expression

Outputs:

- sign: positive, negative or zero

Solver topology:

- identify signs
- detect zero
- count negative factors for products/quotients
- use exponent parity for powers
- compare magnitudes for mixed-sign sums when required

Future graph topology:

- captureExpression
- identifySigns
- applySignRules
- extractAnswer

Validation requirements:

- independent sign recomputation
- explicit zero handling

Coverage requirements:

- positive result
- negative result
- zero result
- product sign
- power sign
- sum/difference sign

Audit requirements:

- sign profile
- zero case coverage
- operation type
- difficulty

## CP03 Consecutive Integer Property

Educational objective:
Use consecutive-number structure to identify a property or missing value.

Inputs:

- sequence type
- term count
- known terms or condition
- requested property

Outputs:

- property result, term value or classification

Solver topology:

- identify sequence type
- assign step size
- construct terms
- apply property
- return result

Future graph topology:

- identifySequenceType
- generateTerms
- applyConsecutiveProperty
- extractAnswer

Validation requirements:

- verify step size
- verify parity requirement for even/odd consecutive sequences
- verify requested property

Coverage requirements:

- consecutive integers
- consecutive even integers
- consecutive odd integers
- sum property
- product property
- missing term

Audit requirements:

- sequence type
- term count
- requested property
- difficulty

## CP04 Count Integers Satisfying A Property

Educational objective:
Count integers in a range or list that satisfy a stated property.

Inputs:

- range or list
- property filter

Outputs:

- count

Solver topology:

- identify input shape
- apply property filter
- count valid integers

Future graph topology:

- captureRangeOrList
- identifyPropertyFilter
- countValidIntegers
- extractAnswer

Validation requirements:

- independent enumeration or range-count verification
- endpoint handling

Coverage requirements:

- even count
- odd count
- positive count
- negative count
- non-negative count
- list count
- range count

Audit requirements:

- input shape
- property type
- endpoint status
- difficulty

## CP05 Integer Classification From Conditions

Educational objective:
Classify an integer from one or more property conditions.

Inputs:

- conditions
- optional integer or variable

Outputs:

- classification

Solver topology:

- parse conditions
- derive properties
- combine properties
- return most specific classification

Future graph topology:

- captureConditions
- deriveProperties
- combineClassifications
- extractAnswer

Validation requirements:

- every condition must be satisfied by the final classification
- reject over-specific answers not implied by conditions

Coverage requirements:

- even classification
- odd classification
- positive classification
- negative classification
- zero classification
- combined property classification

Audit requirements:

- condition count
- classification type
- difficulty

## CP06 Missing Number From Property Conditions

Educational objective:
Find a unique missing integer using property conditions.

Inputs:

- property conditions
- known values
- optional candidate set or range

Outputs:

- missing number

Solver topology:

- derive candidate set
- test candidates against conditions
- eliminate invalid values
- return unique answer

Future graph topology:

- captureConditions
- generateCandidates
- evaluateCandidates
- selectUniqueAnswer

Validation requirements:

- exactly one valid answer
- all conditions satisfied by the selected answer
- all rejected candidates fail at least one condition

Coverage requirements:

- parity missing number
- sign missing number
- consecutive missing number
- candidate-set missing number
- combined condition missing number

Audit requirements:

- candidate count
- condition count
- uniqueness status
- difficulty

## Architecture Reuse

Future implementation should reuse:

- NS-DIV-001 for divisibility evidence
- NS-REM-001 and NS-REM-002 for residue reasoning
- NS-PRM-001 for prime/composite boundaries
- NS-COP-001 for co-prime/consecutive HCF boundaries
- NS-FRACDEC-001 for rational/integer ownership boundaries
- NS-EXP-001 for power parity support

## Guardrails

Future implementation must not create:

- formula-only drills
- textbook-heading CPs
- duplicate CPs for consecutive even and consecutive odd integers
- duplicate CPs for direct parity and parity after operations
- sign questions inside parity CPs
- divisibility digit replacement inside this archetype

## Recommended Next Step

Human review of Phase A architecture before creating educational language drafts.
