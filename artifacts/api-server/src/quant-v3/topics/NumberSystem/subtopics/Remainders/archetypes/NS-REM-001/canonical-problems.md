# NS-REM-001 Canonical Problems

Archetype: NS-REM-001

Name: Remainder Conditions

Phase: Canonical Problem Package Revision

Status: Specification only

This document defines the revised educational scope and canonical problem architecture for NS-REM-001. It does not implement generators, solvers, validators, reasoning graphs, audits, or libraries.

## Section 1: Archetype Definition

NS-REM-001 teaches remainder-condition reasoning.

The archetype is built around a target remainder:

```text
Number % Divisor = Target Remainder
```

Example:

```text
572x % 7 = 3
```

Target Remainder is the core educational variable in NS-REM-001. It replaces the fixed divisibility target of zero used in NS-DIV-001.

Questions belong to NS-REM-001 when students must:

| Included Area | Description |
|---|---|
| Use a target remainder | Work with a required remainder after division. |
| Evaluate candidate values | Test possible replacements against a remainder condition. |
| Build a valid value set | Identify all candidates satisfying `resolvedNumber % divisor === targetRemainder`. |
| Extract an answer from the valid value set | Return a unique value, minimum, maximum, count, sum, or formed number. |
| Use structural number patterns | Work with missing-value number structures compatible with Pattern System V2. |

Questions do not belong to NS-REM-001 when they are only direct remainder calculation, advanced modular arithmetic, cyclicity of powers, CRT, polynomial remainder theorem, or olympiad-style congruence transformations.

## Section 2: Concept Boundaries

| Concept Area | Belongs To NS-REM-001 | Boundary |
|---|---:|---|
| Basic Remainders | LIMITED | Included only when a target remainder condition is attached to candidate evaluation. Direct remainder calculation is excluded. |
| Repeated Division | NO | Repeated division has a different topology and should belong to a future remainder archetype if needed. |
| Modular Arithmetic | LIMITED | Use only practical remainder equality needed for exam-standard target remainder conditions. |
| Remainder Theorems | NO | Polynomial remainder theorem belongs to a future Algebra/Polynomial archetype. |
| Large Exponent Remainders | NO | Belongs to cyclicity, unit digit, or advanced modular arithmetic archetypes. |
| Polynomial Remainders | NO | Belongs to a future polynomial remainder archetype. |
| Congruences | NO | Formal congruence solving belongs to a future modular arithmetic archetype. |

Future archetype separation:

| Future Area | Should Own |
|---|---|
| Basic Direct Remainders | Direct questions such as "Find the remainder when N is divided by d." |
| Advanced Modular Arithmetic | Congruence classes, modular inverses, CRT, modular equations. |
| Cyclicity | Large exponent remainders, power cycles, last digit cycles. |
| Polynomial Remainders | Remainder theorem, factor theorem, polynomial division. |
| Number Formation | Multi-digit arrangements where formation logic dominates remainder reasoning. |
| Divisibility | Remainder-zero questions where divisibility is the primary task. |

## Section 3: Canonical Problem Inventory

### CP-001: Find Missing Digit For Given Remainder

| Field | Specification |
|---|---|
| Name | Find Missing Digit For Given Remainder |
| Purpose | Resolve a unique candidate value satisfying a target remainder condition. |
| Student Task | Find the digit replacing x so the number leaves the required remainder when divided by the divisor. |
| Expected Answer Type | Single Integer |
| Example Question | 24x leaves remainder 2 when divided by 5. Find x. |
| Example Answer | 2 |

### CP-002: Find Smallest Valid Value

| Field | Specification |
|---|---|
| Name | Find Smallest Valid Value |
| Purpose | Build a valid value set and select its minimum. |
| Student Task | Construct the valid value set. Return the smallest valid value. |
| Expected Answer Type | Smallest Value |
| Example Question | What is the smallest digit x for which 7x2 leaves remainder 1 when divided by 3? |
| Example Answer | 2 |

### CP-003: Find Greatest Valid Value

| Field | Specification |
|---|---|
| Name | Find Greatest Valid Value |
| Purpose | Build a valid value set and select its maximum. |
| Student Task | Construct the valid value set. Return the greatest valid value. |
| Expected Answer Type | Greatest Value |
| Example Question | What is the greatest digit x for which 5x4 leaves remainder 0 when divided by 4? |
| Example Answer | 8 |

### CP-004: Count Valid Values

| Field | Specification |
|---|---|
| Name | Count Valid Values |
| Purpose | Count how many candidate values satisfy the target remainder condition. |
| Student Task | Construct the valid value set. Return the number of valid values. |
| Expected Answer Type | Count |
| Example Question | How many digits x make 3x1 leave remainder 1 when divided by 5? |
| Example Answer | 2 |

### CP-005: Sum Of Valid Values

| Field | Specification |
|---|---|
| Name | Sum Of Valid Values |
| Purpose | Aggregate all values satisfying the target remainder condition. |
| Student Task | Construct the valid value set. Return the sum of valid values. |
| Expected Answer Type | Single Integer |
| Example Question | Find the sum of all digits x for which 6x leaves remainder 2 when divided by 4. |
| Example Answer | 8 |

### CP-006: Form Smallest Valid Number

| Field | Specification |
|---|---|
| Name | Form Smallest Valid Number |
| Purpose | Use the minimum valid value to form the smallest number satisfying the target remainder condition. |
| Student Task | Construct the valid value set. Form the smallest valid number satisfying the remainder condition. |
| Expected Answer Type | Number Formation |
| Example Question | Replace x in 8x5 so the number leaves remainder 1 when divided by 6. Find the smallest such number. |
| Example Answer | 805 |

### CP-007: Form Greatest Valid Number

| Field | Specification |
|---|---|
| Name | Form Greatest Valid Number |
| Purpose | Use the maximum valid value to form the greatest number satisfying the target remainder condition. |
| Student Task | Construct the valid value set. Form the greatest valid number satisfying the remainder condition. |
| Expected Answer Type | Number Formation |
| Example Question | Replace x in 8x5 so the number leaves remainder 1 when divided by 6. Find the greatest such number. |
| Example Answer | 895 |

## Section 4: Canonical Problem Relationships

NS-REM-001 is intended as the direct sibling of NS-DIV-001. Maximum architectural reuse is expected.

Shared abstraction:

| Shared Abstraction | Used By |
|---|---|
| Structural Pattern | CP-001 through CP-007 |
| Instance Generation | CP-001 through CP-007 |
| Target Remainder | CP-001 through CP-007 |
| Candidate Domain | CP-001 through CP-007 |
| Candidate Evaluation | CP-001 through CP-007 |
| Valid Value Set | CP-001 through CP-007 |
| CP-Specific Answer Extraction | CP-001 through CP-007 |

Shared pipeline:

```text
Structural Pattern
-> Instance Generation
-> Target Remainder
-> Candidate Generation
-> Valid Value Set
-> CP-Specific Answer Extraction
```

Answer extraction map:

| CP | Extraction Rule |
|---|---|
| CP-001 | Unique Valid Value |
| CP-002 | Minimum(Valid Value Set) |
| CP-003 | Maximum(Valid Value Set) |
| CP-004 | Count(Valid Value Set) |
| CP-005 | Sum(Valid Value Set) |
| CP-006 | Number Formation using Minimum(Valid Value Set) |
| CP-007 | Number Formation using Maximum(Valid Value Set) |

Common future infrastructure:

| Infrastructure | Reuse Potential |
|---|---|
| Pattern System V2 | Direct reuse from NS-DIV-001. |
| Instance generation | Direct reuse with added target remainder metadata. |
| Candidate generation | Direct reuse with remainder-condition evaluation. |
| Valid value set builder | Direct sibling of NS-DIV-001 valid digit set builder. |
| Traceability | Direct reuse of Question ID, Pattern ID, and Instance ID. |
| Validation framework | Reuse structure; replace divisibility condition with target remainder condition. |
| Audit framework | Reuse distribution reporting; add target remainder distribution. |

Fundamentally different topics:

| Topic | Reason |
|---|---|
| Find Direct Remainder | Does not use candidate generation, valid value sets, structural pattern reasoning, or Pattern System V2. |
| Advanced congruence solving | Requires a different mathematical topology and should not share this CP package. |

## Section 5: Answer Types

| Answer Type | Meaning | CPs |
|---|---|---|
| Single Integer | One candidate value satisfying the target remainder condition. | CP-001, CP-005 |
| Smallest Value | Minimum element of the valid value set. | CP-002 |
| Greatest Value | Maximum element of the valid value set. | CP-003 |
| Count | Number of valid values. | CP-004 |
| Number Formation | Final number after replacing x with a selected valid value. | CP-006, CP-007 |
| Set-Based Answer | Answer derived from valid value set operations. | CP-001 through CP-007 |

## Section 6: Educational Progression

| Order | CP | Difficulty Position | Justification |
|---:|---|---|---|
| 1 | CP-001 | Easy | Unique valid value; closest to NS-DIV-001 CP-001, with target remainder replacing zero. |
| 2 | CP-002 | Easy-Medium | Requires valid value set construction and minimum selection. |
| 3 | CP-003 | Easy-Medium | Same valid value set construction with maximum selection. |
| 4 | CP-004 | Medium | Requires counting valid values rather than selecting one. |
| 5 | CP-005 | Medium | Requires aggregation over valid values. |
| 6 | CP-006 | Medium-Hard | Requires valid value selection and smallest number formation. |
| 7 | CP-007 | Medium-Hard | Requires valid value selection and greatest number formation. |

## Section 7: Exam Relevance

| CP | SSC | Banking | Railway | State PCS | UPSC CSAT | Other Competitive Exams |
|---|---:|---:|---:|---:|---:|---:|
| CP-001 | High | Medium | High | Medium | Low | Medium |
| CP-002 | Medium | Medium | Medium | Medium | Low | Medium |
| CP-003 | Medium | Medium | Medium | Medium | Low | Medium |
| CP-004 | Medium | Medium | Medium | Medium | Low | Medium |
| CP-005 | Medium | Low | Medium | Medium | Low | Medium |
| CP-006 | Medium | Low | Medium | Medium | Low | Medium |
| CP-007 | Medium | Low | Medium | Medium | Low | Medium |

## Section 8: Reusability Analysis

NS-REM-001 should reuse the NS-DIV-001 reference architecture as much as possible.

Reusable from NS-DIV-001:

| NS-DIV-001 Component | Reuse For NS-REM-001 |
|---|---|
| Human-owned library principle | Reuse exactly. |
| Structural Pattern V2 model | Reuse with remainder-specific target remainder metadata. |
| Instance generator pattern | Reuse after adding target remainder and valid value set requirements. |
| Candidate domain logic | Reuse for digit replacement and value replacement cases. |
| Valid digit/value set abstraction | Reuse directly as Valid Value Set. |
| CP-specific answer extraction pattern | Reuse directly. |
| Traceability fields | Reuse Question ID, Pattern ID, Instance ID. |
| Pipeline order | Reuse structural pattern, instance generation, solver, graph, explanation, validation, final output. |
| Validation framework shape | Reuse with `resolvedNumber % divisor === targetRemainder`. |
| Audit framework shape | Reuse distributions and failure counts; add target remainder distribution. |

Must be redesigned:

| Area | Reason |
|---|---|
| Divisibility condition | Remainder equality replaces remainder-zero divisibility. |
| Target remainder selection | New core variable not present in NS-DIV-001. |
| Remainder capability metadata | Divisor and target remainder compatibility must be reviewed. |
| Explanation wording | Must speak about target remainders rather than divisibility. |
| CP-001 uniqueness rule | Must require exactly one valid value, not simply one missing digit for divisibility. |

New educational abstraction:

| Abstraction | Definition |
|---|---|
| Target Remainder | Required remainder after division. |
| Remainder Condition | `resolvedNumber % divisor === targetRemainder`. |
| Valid Value Set | All candidate values satisfying the remainder condition. |
| Remainder Target Distribution | Audit exposure of target remainders across generated batches. |

## Section 9: Exclusions

Do not include:

| Excluded Topic | Reason |
|---|---|
| Find Direct Remainder | Does not use candidate generation, valid value sets, structural pattern reasoning, or Pattern System V2. It may belong to a future basic remainder archetype if required. |
| Advanced Modular Arithmetic | Requires formal congruence methods beyond basic remainder-condition reasoning. |
| CRT | Separate advanced modular system archetype. |
| Polynomial Remainder Theorem | Algebra/polynomial domain, not Number System basic remainder-condition reasoning. |
| Olympiad-style Congruences | Too advanced and proof-oriented for this archetype. |
| Large Exponent Remainders | Belongs to cyclicity/power remainder archetypes. |
| Modular inverses | Advanced modular arithmetic. |
| Systems of congruences | Advanced modular arithmetic. |
| Base conversion remainder problems | Belongs to base systems unless the remainder-condition aspect is primary. |
| Pure divisibility questions | Belongs to NS-DIV archetypes when target remainder is zero and divisibility is the real task. |
| Repeated division chains | Belongs to a future repeated-division remainder archetype if required. |

## Section 10: Final Recommendation

Recommended final CP list:

| CP | Name | Answer Extraction |
|---|---|---|
| CP-001 | Find Missing Digit For Given Remainder | Unique Valid Value |
| CP-002 | Find Smallest Valid Value | Minimum(Valid Value Set) |
| CP-003 | Find Greatest Valid Value | Maximum(Valid Value Set) |
| CP-004 | Count Valid Values | Count(Valid Value Set) |
| CP-005 | Sum Of Valid Values | Sum(Valid Value Set) |
| CP-006 | Form Smallest Valid Number | Number Formation using Minimum(Valid Value Set) |
| CP-007 | Form Greatest Valid Number | Number Formation using Maximum(Valid Value Set) |

These seven canonical problems provide complete coverage of NS-REM-001 because they all share the same educational topology:

```text
Target Remainder
-> Valid Value Set
-> Answer Extraction
```

Coverage:

| Coverage Area | Covered By |
|---|---|
| Unique valid value | CP-001 |
| Selection operations | CP-002, CP-003 |
| Aggregation operations | CP-004, CP-005 |
| Number formation output | CP-006, CP-007 |
| Full reuse of NS-DIV-001 architecture | CP-001 through CP-007 |

Implementation should begin only after human approval of this revised canonical problem package.
