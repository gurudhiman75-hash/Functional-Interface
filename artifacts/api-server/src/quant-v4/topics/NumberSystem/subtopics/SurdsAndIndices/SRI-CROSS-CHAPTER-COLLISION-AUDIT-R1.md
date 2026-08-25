# SRI Cross-Chapter Collision Audit — R1

**Status:** FREEZE-PREP OWNERSHIP CLOSURE  
**Input:** 59 retained-contract R1 proposal  
**Permanent QLs:** 0

## Authorities reviewed

- `AdvancedMathematics/subtopics/Algebra/ALG-SOURCE-PYQ-AUDIT-WAVE01-CP001-CP005.md`
- `Arithmetic/subtopics/SimplificationAndApproximation/SAP-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `Arithmetic/subtopics/NumberSystem/NUM-001-NUM-002-END-TO-END-DESIGN.md`
- SRI design/source/ownership authorities

## 1. Algebra boundary

The Algebra source audit explicitly treats `x±1/x` reciprocal transforms, recurrence depth and high-power transformed identities as Algebra task contracts. Therefore:

- immediate conjugate/reciprocal simplification whose main burden is recognizing a quadratic surd conjugate remains **SRI-CP-011**;
- recurrence chains such as `x+1/x → x^n+1/x^n` for high n are **Algebra**;
- simultaneous equations written as `√x+√y` and `√x−√y` are **Algebra** when elimination/substitution is the dominant inference;
- generic polynomial/quadratic solving remains **Algebra**, even when roots happen to contain radicals.

### Radical-equation boundary

A bounded equation with one explicit principal radical remains SRI only when the tested burden is radical isolation, squaring and original-domain/extraneous-candidate verification. If ordinary equation-system or polynomial manipulation dominates, ownership moves to Algebra.

## 2. Simplification & Approximation boundary

The SAP ownership authority explicitly states:

- symbolic surd/index simplification → **Surds & Indices**;
- exact numeric perfect-root/power evaluation inside a calculation → **Simplification & Approximation**;
- long BODMAS / nested numeric evaluation → **Simplification & Approximation**.

Therefore:

- `√(A±2√B)` denesting remains **SRI-CP-010** because symbolic denesting is the learner objective;
- repeated exact perfect-root chains whose task is simply inner-to-outer evaluation move to **SAP**;
- mixed long arithmetic expressions that merely contain a surd or index term move to **SAP**;
- SRI-CP-012 is retained only for short synthesis where radical/index conversion is itself essential to solving.

## 3. Number System boundary

The Number System V4 design owns perfect-power structure, number-set classification, divisibility/remainders/digits and exact rational representation. It explicitly excludes general surd/index simplification.

### Perfect-power versus surd classification

Potential collision: `C007-D` uses a perfect-nth-power test to classify a displayed radical.

Ownership rule:

- “Is n a perfect square/cube/nth power?” → **Number System**;
- “Is `nthRoot(n)` rational or a surd?” where radical notation/surd semantics are the answer contract → **SRI-CP-007**;
- generic rational/irrational classification without radical-specific burden → **Number System**.

### Powers boundary

- last digit / last two digits / modular cycles of powers → **Number System**;
- factorial valuations and highest perfect powers dividing an integer/factorial → **Number System**;
- symbolic index laws, base harmonisation, rational exponents and exponent equations → **SRI-001**.

## 4. Data Sufficiency and wrapper boundary

A statement-sufficiency wrapper does not create a duplicate SRI solve contract. The underlying ordinary solve remains SRI; the sufficiency wrapper is owned by **Data Sufficiency** and calls the SRI solver as an authority.

Statement-correctness MCQs that directly test an index/surd law remain SRI because they are not sufficiency questions.

## 5. Geometry / Mensuration / Trigonometry boundary

If a geometric/trigonometric problem ends in a surd only because the exact measurement is irrational, the applied chapter owns the question. SRI owns only decontextualized radical/index manipulation where that manipulation is the tested inference.

## 6. Collision closures affecting R1 retained groups

| Prototype / retained group | Decision |
|---|---|
| C003-D | merge into CP-001 same-exponent authority; no duplicate CP-003 contract |
| C009-I | merge into CP-011 transformed conjugate/reciprocal authority |
| C007-D | retain in SRI only under radical/surd answer semantics; perfect-power-only forms stay Number System |
| C011-F | retain immediate conjugate transforms; high-depth reciprocal recurrences stay Algebra |
| C011-G/H | retain only bounded principal-radical equations with explicit domain/extraneous verification |
| CP010-F | source-gated; do not use to absorb generic nested numeric Simplification questions |
| CP012 | retain only when both surd and index engines are materially required |

## R1 ownership verdict

No additional chapter move is required beyond the explicit closures above. The 59-group retained proposal is **ownership-consistent**, subject to the two unresolved source gates and English review.

This is not freeze authority and does not allocate permanent IDs.
