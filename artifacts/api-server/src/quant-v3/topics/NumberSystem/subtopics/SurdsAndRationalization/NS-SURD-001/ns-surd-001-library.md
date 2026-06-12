# NS-SURD-001 Implementation Library

## Scope

This file is a library registration layer for NS-SURD-001. It organizes the existing human-authored architecture and language sources so future implementation can select canonical problem, topology, reasoning pattern, difficulty, stem source, and explanation source without inventing new educational language.

This file does not define JSON libraries, runtime code, generators, validators, tests, audits, pipelines, solvers, or reasoning graphs.

Source files:

- `archetype.md`
- `canonical-problems.md`
- `difficulty-framework.md`
- `reasoning-patterns.md`
- `implementation-plan.md`
- `ns-surd-001-language-draft.md`

Note: `ns-surd-001-topology-review.md` was requested as a source, but it is not present in this package directory. The topology registry below uses the approved CP topology definitions from `archetype.md`, `canonical-problems.md`, `reasoning-patterns.md`, and `implementation-plan.md`.

---

## Section 1: CP Registry

### NS-SURD-001-CP01

Title: Perfect-power extraction from a surd

Topology summary:
The radicand contains an extractable perfect square or perfect cube factor. The expression is simplified by extracting the perfect-power part and keeping the leftover factor inside the radical.

Reasoning patterns:

- Pattern 1: Extract The Perfect-Power Part

Difficulty drivers:

- Easy: one extractable perfect square or cube factor.
- Medium: radicand requires splitting before extraction.
- Hard: normally not a hard standalone CP; appears inside CP04, CP05, CP06, CP07, or CP08 as a dependent step.

### NS-SURD-001-CP02

Title: Like-surd addition and subtraction

Topology summary:
The expression contains surd terms that either already have the same radical part or become like surds after simplification. The coefficients are then added or subtracted.

Reasoning patterns:

- Pattern 1: Extract The Perfect-Power Part
- Pattern 2: Combine Only Like Surds

Difficulty drivers:

- Easy: like surds are already visible.
- Medium: terms must first be simplified before they become like surds.
- Hard: normally handled through CP04 when multiple operations are involved.

### NS-SURD-001-CP03

Title: Surd multiplication and division simplification

Topology summary:
The expression multiplies or divides compatible surds. The radicands are combined first, then the resulting radical is simplified.

Reasoning patterns:

- Pattern 3: Multiply Or Divide Inside The Radical First

Difficulty drivers:

- Easy: direct multiplication or division of compatible square-root surds.
- Medium: product or quotient creates a value that still needs extraction.
- Hard: normally handled through CP04 when multiplication or division is part of a longer expression.

### NS-SURD-001-CP04

Title: Mixed surd expression simplification

Topology summary:
The expression contains more than one operation: extraction, multiplication, division, addition, or subtraction. The student must sequence operations before collecting like surds.

Reasoning patterns:

- Pattern 1: Extract The Perfect-Power Part
- Pattern 2: Combine Only Like Surds
- Pattern 3: Multiply Or Divide Inside The Radical First
- Pattern 7: Sequence Operations Before Arithmetic

Difficulty drivers:

- Easy: not preferred as a standalone easy CP.
- Medium: two to four transformations with visible simplification.
- Hard: several surd terms, products, quotients, integer terms, and like-surd collection.

### NS-SURD-001-CP05

Title: Surd comparison by normalization

Topology summary:
Two or more surd expressions must be compared or arranged. The expressions are simplified or normalized so their values can be compared safely.

Reasoning patterns:

- Pattern 4: Normalize Before Comparing

Difficulty drivers:

- Easy: comparison becomes visible after direct simplification.
- Medium: two positive expressions require squaring or cubing before comparison.
- Hard: three or more expressions must be ordered after normalization.

### NS-SURD-001-CP06

Title: Monomial denominator rationalization

Topology summary:
The denominator contains a single radical term. The denominator is rationalized by multiplying numerator and denominator by the needed radical factor.

Reasoning patterns:

- Pattern 5: Remove A Single Radical Denominator

Difficulty drivers:

- Easy: square-root denominator such as \(1/\sqrt{a}\) or \(k/\sqrt{a}\).
- Medium: rational coefficient is also present in the denominator.
- Hard: cube-root monomial denominator, if kept exam-clean.

### NS-SURD-001-CP07

Title: Binomial denominator rationalization

Topology summary:
The denominator has two terms and at least one surd. The conjugate is used so the denominator becomes rational through the difference-of-squares pattern.

Reasoning patterns:

- Pattern 6: Use The Conjugate For A Two-Term Denominator

Difficulty drivers:

- Easy: not preferred as a standalone easy CP except very clean conjugate use.
- Medium: denominator of the form \(a+\sqrt{b}\), \(a-\sqrt{b}\), \(\sqrt{a}+\sqrt{b}\), or \(\sqrt{a}-\sqrt{b}\).
- Hard: rationalization creates a numerator that still needs simplification.

### NS-SURD-001-CP08

Title: Surd identity evaluation

Topology summary:
The expression resembles a standard algebraic identity involving surds. The student must recognize the identity before expanding or simplifying.

Reasoning patterns:

- Pattern 8: Recognize Identity Before Expanding

Difficulty drivers:

- Easy: visible product of conjugates.
- Medium: square of a surd binomial.
- Hard: identity use followed by additional simplification or comparison-like cleanup.

---

## Section 2: Topology Registry

### NS-SURD-001-T01

Parent CP: NS-SURD-001-CP01

Description:
Perfect-power extraction from a square-root or cube-root radicand.

Coverage status:
Covered by CP01 and language draft stems 1-20.

### NS-SURD-001-T02

Parent CP: NS-SURD-001-CP02

Description:
Addition or subtraction of like surds, including cases where simplification is needed before combining coefficients.

Coverage status:
Covered by CP02 and language draft stems 21-40.

### NS-SURD-001-T03

Parent CP: NS-SURD-001-CP03

Description:
Multiplication or division of compatible surds followed by simplification.

Coverage status:
Covered by CP03 and language draft stems 41-60.

### NS-SURD-001-T04

Parent CP: NS-SURD-001-CP04

Description:
Mixed surd expression simplification requiring operation sequencing and like-surd collection.

Coverage status:
Covered by CP04 and language draft stems 61-85.

### NS-SURD-001-T05

Parent CP: NS-SURD-001-CP05

Description:
Comparison, selection, or ordering of surd expressions after normalization.

Coverage status:
Covered by CP05 and language draft stems 86-120.

### NS-SURD-001-T06

Parent CP: NS-SURD-001-CP06

Description:
Rationalization of a denominator containing one radical term.

Coverage status:
Covered by CP06 and language draft stems 121-135.

### NS-SURD-001-T07

Parent CP: NS-SURD-001-CP07

Description:
Rationalization of a two-term denominator using the conjugate.

Coverage status:
Covered by CP07 and language draft stems 136-155.

### NS-SURD-001-T08

Parent CP: NS-SURD-001-CP08

Description:
Evaluation of surd expressions by recognizing identities such as \((a+b)^2\), \((a-b)^2\), and \((a+b)(a-b)\).

Coverage status:
Covered by CP08 and language draft stems 156-175.

---

## Section 3: Reasoning Pattern Mapping

| Reasoning Pattern | Name | Supported CPs |
|---|---|---|
| Pattern 1 | Extract The Perfect-Power Part | CP01, CP02, CP04 |
| Pattern 2 | Combine Only Like Surds | CP02, CP04 |
| Pattern 3 | Multiply Or Divide Inside The Radical First | CP03, CP04 |
| Pattern 4 | Normalize Before Comparing | CP05 |
| Pattern 5 | Remove A Single Radical Denominator | CP06 |
| Pattern 6 | Use The Conjugate For A Two-Term Denominator | CP07 |
| Pattern 7 | Sequence Operations Before Arithmetic | CP04 |
| Pattern 8 | Recognize Identity Before Expanding | CP08 |

---

## Section 4: Difficulty Mapping

### CP01 Perfect-Power Extraction From A Surd

Easy:
One square-root or cube-root expression with a visible extractable perfect power.

Medium:
Radicand requires factor splitting before extraction.

Hard:
Not used as an independent hard topology. Hard usage belongs to mixed expressions or comparison chains.

### CP02 Like-Surd Addition And Subtraction

Easy:
Terms already have the same radical part.

Medium:
Terms become like surds only after simplification.

Hard:
Not used as an independent hard topology. Hard usage belongs to CP04.

### CP03 Surd Multiplication And Division

Easy:
Compatible radicals multiply or divide directly.

Medium:
The product or quotient must be simplified after combining radicands.

Hard:
Not used as an independent hard topology. Hard usage belongs to CP04.

### CP04 Mixed Surd Expressions

Easy:
Not preferred.

Medium:
Two to four transformations using simplification and like-surd collection.

Hard:
Several operations must be sequenced before final collection.

### CP05 Surd Comparison By Normalization

Easy:
Expressions become directly comparable after simplification.

Medium:
Two expressions require squaring or cubing to compare.

Hard:
Three or more expressions require increasing or decreasing order after normalization.

### CP06 Monomial Denominator Rationalization

Easy:
Single square-root denominator with simple numerator.

Medium:
Rational coefficient or reducible coefficient is present.

Hard:
Cube-root monomial denominator requiring completion of cube factors.

### CP07 Binomial Denominator Rationalization

Easy:
Not preferred except direct, clean conjugate use.

Medium:
Conjugate rationalization with a simple binomial denominator.

Hard:
Rationalization creates a numerator or final expression that needs simplification.

### CP08 Surd Identity Evaluation

Easy:
Direct product of conjugates.

Medium:
Square of a surd binomial.

Hard:
Identity recognition followed by additional simplification.

---

## Section 5: Language Allocation

Language source:
`ns-surd-001-language-draft.md`

Stem allocation:

| CP | Stem Range | Stem Count |
|---|---:|---:|
| CP01 | 1-20 | 20 |
| CP02 | 21-40 | 20 |
| CP03 | 41-60 | 20 |
| CP04 | 61-85 | 25 |
| CP05 | 86-120 | 35 |
| CP06 | 121-135 | 15 |
| CP07 | 136-155 | 20 |
| CP08 | 156-175 | 20 |

Explanation allocation:

| Explanation Source | CP |
|---|---|
| ES-001 | CP01 |
| ES-002 | CP02 |
| ES-003 | CP03 |
| ES-004 | CP04 |
| ES-005 | CP05 |
| ES-006 | CP06 |
| ES-007 | CP07 |
| ES-008 | CP08 |

Language linkage status:
Linked by stem range and ES identifier only. Stem text and explanation text are not duplicated in this library.

---

## Section 6: Boundary Rules

### Belongs To NS-SURD-001

- Simplifying square-root and cube-root surds by extracting perfect powers.
- Adding and subtracting like surds after simplification.
- Multiplying and dividing compatible surds.
- Simplifying mixed surd expressions.
- Comparing or ordering positive surd expressions by normalization.
- Rationalizing monomial radical denominators.
- Rationalizing binomial radical denominators using conjugates.
- Evaluating surd expressions using standard identities.

### Boundary With Indices

Belongs here:
Surd expressions where the exam task is radical simplification or rationalization.

Does not belong here:
Pure exponent-law questions, index simplification without radicals, exponential equations, and power comparison questions. Those belong to Indices And Exponents.

### Boundary With Number Classification

Belongs here:
Operational questions involving surds.

Does not belong here:
Classifying numbers as rational, irrational, integer, natural, or real when no surd operation is required.

### Boundary With Simplification

Belongs here:
Simplification where surd rules are central.

Does not belong here:
General arithmetic simplification where radicals are absent or incidental.

### Boundary With Algebraic Identities

Belongs here:
Identity use where the expression contains surds and the aim is surd evaluation or simplification.

Does not belong here:
Pure algebraic identity expansion with variables and no surd-specific simplification.

### Boundary With Quadratic Expressions

Belongs here:
Rationalization and identity evaluation involving surd binomials.

Does not belong here:
Quadratic equations, factorization of quadratics, discriminant analysis, and root relations.

---

## Section 7: Future Expansion Registry

These are future candidates only. They are not active CPs and must not be treated as implemented topologies.

### Missing CP05 Comparison Topologies

- Ordering more than three surd expressions.
- Comparison involving a rational term plus a surd term.
- Comparison where one expression simplifies to an integer and another remains a surd.
- Comparison requiring common radical conversion before ordering.

### Missing CP07 Post-Rationalization Topologies

- Rationalization followed by like-surd collection in the numerator.
- Rationalization followed by comparison with another expression.
- Rationalization where numerator and denominator share a reducible factor after conjugate multiplication.
- Multi-fraction rationalization where two rationalized terms must be combined.

### Future Mixed-Identity Chains

- Identity evaluation followed by like-surd addition or subtraction.
- Difference of two squared surd binomials.
- Product of identity outputs followed by simplification.
- Identity recognition embedded inside a mixed surd expression.

### Future Advanced Surd Transformations

- Nested radical simplification in clean exam forms.
- Radical equations with controlled extraneous-root checks.
- Surd inequalities with positive-domain guarantees.
- Higher-index radical rationalization beyond clean cube-root cases.

---

## Verification

CP count:
8

Topology count:
8

Reasoning pattern count:
8

Language linkage status:
Complete. CP01 through CP08 are linked to stem ranges 1-175 in `ns-surd-001-language-draft.md`.

Explanation linkage status:
Complete. ES-001 through ES-008 are linked to CP01 through CP08.

Implementation readiness status:
Ready as a documentation-only library layer. Future runtime work can select CP, topology, reasoning pattern, difficulty, and human-authored language source from this file without creating new educational language.

File creation status:
Exactly one implementation library file was created: `ns-surd-001-library.md`.

Non-runtime status:
No JSON libraries, runtime files, generators, validators, tests, audits, pipelines, solvers, or reasoning graphs are defined in this file.
