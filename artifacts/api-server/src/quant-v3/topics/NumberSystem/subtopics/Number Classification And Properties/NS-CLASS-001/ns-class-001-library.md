# NS-CLASS-001 Implementation Library

## Purpose

This document is the implementation library layer for NS-CLASS-001. It organizes the approved Phase A architecture and the human-authored language draft so future implementation can select canonical problem, difficulty, reasoning pattern and topology without inventing educational language.

Source files:

- `archetype.md`
- `canonical-problems.md`
- `difficulty-framework.md`
- `reasoning-patterns.md`
- `implementation-plan.md`
- `ns-class-001-language-draft.md`

Runtime may later load, select, substitute, render and audit approved content. Runtime must not generate new stems, explanations, fallback wording or educational sentences.

## Section 1: CP Registry

| CP ID | Title | Topology Summary | Reasoning Patterns | Difficulty Drivers |
| --- | --- | --- | --- | --- |
| CP01 | Parity Outcome Determination | Determine whether a number, expression or operation result is even or odd by applying parity rules. | RP01 Parity Rule Application | number of operations, variable parity, powers, product length |
| CP02 | Sign Outcome Determination | Determine whether an integer expression is positive, negative or zero by applying sign rules. | RP02 Sign Rule Application | count of negative factors, exponent parity, zero handling, magnitude comparison |
| CP03 | Consecutive Integer Property | Use consecutive integer, consecutive even integer or consecutive odd integer structure to derive a property, term or classification. | RP03 Consecutive Sequence Property | sequence type, number of terms, sum/product condition, missing term position |
| CP04 | Count Integers Satisfying A Property | Count integers in a list or range that satisfy a stated number property. | RP04 Property Count | range size, endpoint inclusion, list length, combined property filters |
| CP05 | Integer Classification From Conditions | Classify an integer from one or more conditions such as parity, sign or power behavior. | RP05 Condition-Based Classification | number of conditions, specificity of classification, power/parity implication |
| CP06 | Missing Number From Property Conditions | Find a unique missing integer using parity, sign, consecutive structure or classification conditions. | RP06 Missing Number Elimination | number of constraints, candidate count, uniqueness requirement, condition mix |

Topology count: 6

## Section 2: Reasoning Pattern Mapping

| Reasoning Pattern | Name | Supported CPs | Notes |
| --- | --- | --- | --- |
| RP01 | Parity Rule Application | CP01 | Used when the final answer is even or odd. |
| RP02 | Sign Rule Application | CP02 | Used when the final answer is positive, negative or zero. |
| RP03 | Consecutive Sequence Property | CP03 | Covers consecutive integers, consecutive even integers and consecutive odd integers as variants of one topology. |
| RP04 | Property Count | CP04 | Used for range or list counts by property. |
| RP05 | Condition-Based Classification | CP05 | Used when conditions imply a class or property category. |
| RP06 | Missing Number Elimination | CP06 | Used when candidate values must be checked against property conditions. |

RP count: 6

## Section 3: Difficulty Mapping

### CP01 Parity Outcome Determination

Easy:

- direct even/odd classification
- one operation
- small integers

Medium:

- two or three operations
- products or powers
- variable parity provided

Hard:

- mixed operations
- parity expression with variables
- product of consecutive integers

### CP02 Sign Outcome Determination

Easy:

- one product or quotient
- direct positive/negative result
- no zero case

Medium:

- multiple negative factors
- negative base with exponent
- simple sum or difference sign

Hard:

- zero handling
- expression sign with magnitude comparison
- combined power and product sign reasoning

### CP03 Consecutive Integer Property

Easy:

- two consecutive integers
- direct next or previous term
- direct HCF or parity property

Medium:

- three consecutive integers
- consecutive even or odd integers
- sum condition with middle term reasoning

Hard:

- four or more terms
- product divisibility property
- missing term not in first or last position

### CP04 Count Integers Satisfying A Property

Easy:

- short list
- direct even or odd count
- positive-only range

Medium:

- larger range
- endpoint inclusion matters
- positive or negative count

Hard:

- mixed negative and positive range
- combined property filter
- non-positive or non-negative count

### CP05 Integer Classification From Conditions

Easy:

- one condition
- direct even/odd or sign classification
- explicit integer property

Medium:

- two conditions
- power parity implication
- positive plus parity classification

Hard:

- combined sign and parity classification
- classification from indirect condition
- avoid over-specific classification not implied by the prompt

### CP06 Missing Number From Property Conditions

Easy:

- direct missing consecutive integer
- one parity condition
- small obvious candidate set

Medium:

- two conditions
- consecutive even or odd missing term
- sign plus absolute value condition

Hard:

- multiple constraints
- candidate elimination
- uniqueness requirement across parity, sign and range

## Section 4: Language Allocation

All language is owned by `ns-class-001-language-draft.md`.

This implementation library references stem ranges only. It does not duplicate stem text.

| CP ID | Language Draft Stem Range | Stem Count | Explanation |
| --- | --- | ---: | --- |
| CP01 | Stem 1-20 under CP01 | 20 | ES-001 |
| CP02 | Stem 1-20 under CP02 | 20 | ES-002 |
| CP03 | Stem 1-25 under CP03 | 25 | ES-003 |
| CP04 | Stem 1-25 under CP04 | 25 | ES-004 |
| CP05 | Stem 1-25 under CP05 | 25 | ES-005 |
| CP06 | Stem 1-25 under CP06 | 25 | ES-006 |

Total approved stems referenced: 140

Total approved explanations referenced: 6

## Section 5: Future Expansion Notes

### Missing Topologies

The following are intentionally not active CPs in this package:

- rational vs irrational classification involving surds
- prime/composite classification
- divisibility digit replacement
- HCF/LCM property computation
- arithmetic progression problems beyond simple consecutive integer structure
- advanced inequality-based integer classification

### Future CP Expansion Candidates

Future expansion may be considered only if repeated exam evidence shows a distinct topology:

- CP07 Number Set Classification: natural, whole, integer, rational, irrational and real classification after NS-SURD-001 is complete.
- CP08 Parity In Algebraic Expressions: deeper symbolic parity beyond simple government-exam property questions.
- CP09 Integer Property Statements: select all true statements about integer properties, if MCQ reasoning differs from CP05.
- CP10 Consecutive Integer Equation Systems: if sequence solving becomes equation-heavy enough to leave CP03.

These candidates are not approved active CPs.

### Boundary Rules With Neighboring Subtopics

NS-PRM-001 Prime Numbers:

- Owns prime/composite classification and prime-counting.
- NS-CLASS-001 may reference prime/composite only as a rejected boundary unless a future classification package is explicitly expanded.

NS-DIV-001 Divisibility:

- Owns divisibility tests, missing digits and divisibility-rule construction.
- NS-CLASS-001 owns only property recognition such as even/odd when no digit replacement topology is present.

NS-REM-001 and NS-REM-002 Remainders:

- Own target-remainder and division reconstruction problems.
- NS-CLASS-001 should not absorb modulo/remainder workflows.

NS-FAC-001 Factors:

- Owns factor count, factor sum, factor product and kth factor.
- NS-CLASS-001 may use factor language only when the final answer is a property classification.

NS-HCF-001, NS-LCM-001 and NS-HL-001:

- Own HCF, LCM and relationship computation.
- Consecutive integer HCF as a property can remain in CP03 only when the educational objective is the consecutive-number property.

NS-COP-001 Co-Prime Numbers:

- Owns co-prime classification and co-prime pair reasoning.
- Consecutive-number co-prime-only questions should remain with NS-COP-001.

NS-FRACDEC-001 Fractions Decimals Rational Numbers:

- Owns rational arithmetic and fraction/decimal conversion.
- NS-CLASS-001 does not currently own rational/irrational classification involving fractions or surds.

NS-EXP-001 Indices And Exponents:

- Owns exponent-law simplification.
- NS-CLASS-001 may use exponent parity or sign only when the final answer is a class, sign or parity.

Future NS-SURD-001:

- Should own surd simplification and rationalization.
- Rational/irrational classification involving surds should not be added to NS-CLASS-001 until that boundary is reviewed.

## Verification

- CP count: 6
- RP count: 6
- Topology count: 6
- Difficulty framework status: mapped from `difficulty-framework.md`
- Language draft linkage status: linked by CP stem ranges and ES IDs from `ns-class-001-language-draft.md`
- JSON files created: 0
- Runtime files created: 0
- Generators created: 0
- Validators created: 0
- Tests created: 0
- Audits created: 0
- Reasoning graphs created: 0
- Question banks created: 0
