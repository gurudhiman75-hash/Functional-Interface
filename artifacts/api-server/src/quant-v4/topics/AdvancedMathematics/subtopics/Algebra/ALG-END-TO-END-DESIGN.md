# ExamTree Quant V4 — Algebra
## End-to-End Design Authority — Revision 2

**Status:** `PHASE_0_EXECUTABLE_FOUNDATION_IN_PROGRESS`  
**Student-facing chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Canonical checkpoint range:** `ALG-CP-001..ALG-CP-015`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio:** disabled until package-level review gates pass  
**Question Bank / test / public eligibility:** disabled  
**Primary exams:** SSC CGL/CHSL/MTS/GD, Banking (IBPS/SBI/RRB), Railway, PSSSB/PPSC/Punjab Police and comparable state exams  
**Languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)  
**Revision date:** 18 August 2026

---

## 1. Executive decision

Algebra is one learner-facing chapter with two runtime packages:

```text
Algebra
├── ALG-001 — Expressions, Identities and Polynomials
│   ├── ALG-CP-001 — Algebraic expressions and exact substitution
│   ├── ALG-CP-002 — Identities and transformed values
│   ├── ALG-CP-003 — Three-variable symmetric identities
│   ├── ALG-CP-004 — Polynomial operations and factorisation
│   └── ALG-CP-005 — Polynomial remainder and factor theorem
└── ALG-002 — Equations, Roots and Inequalities
    ├── ALG-CP-006 — One-variable linear equations
    ├── ALG-CP-007 — Simultaneous linear equations
    ├── ALG-CP-008 — Algebraic fractions and rational equations
    ├── ALG-CP-009 — Quadratic equations
    ├── ALG-CP-010 — Roots, coefficients and equation transformation
    ├── ALG-CP-011 — Banking quadratic comparison
    ├── ALG-CP-012 — Inequalities, quadratic sign and extrema
    ├── ALG-CP-013 — Absolute-value equations and inequalities
    ├── ALG-CP-014 — Statement, quantity comparison and data sufficiency
    └── ALG-CP-015 — Mixed algebra synthesis and caselets
```

The package boundary is based on dominant mathematical engine, not on a brittle rule such as “one package never solves an unknown.” A remainder-theorem question may recover a coefficient while still being polynomial-owned; a transformed-value question may use a solver internally while still being identity-owned.

No QL count, solve-mode count or difficulty quota is predetermined. A QL is retained only when it represents a materially different exam task contract: given/unknown topology, governing inference, answer semantic, domain/uniqueness condition or misconception profile. Wording, variable names, number changes, context and language do not create QLs by themselves.

The current external 98-candidate discovery list is evidence only. It is not source-audited, not merged/split, and not a production target.

---

## 2. Authority order

When material conflicts, use this order:

1. approved permanent CP/QL allocation and freeze record;
2. this design authority;
3. source-audited solve-mode discovery inventory;
4. runtime, QA, localisation and freeze contracts;
5. package implementation records;
6. legacy Quant V2/V3 evidence;
7. exploratory drafts and general-knowledge inventories.

Legacy code and draft inventories are evidence, not automatic authority.

---

## 3. Design principles

### 3.1 Structured state first

Question wording is never the mathematical source of truth.

```text
structured state
→ canonical solve
→ independent verification
→ admissibility/domain proof
→ distractors
→ stem
→ human solution
→ localisation
→ Question Studio payload
```

### 3.2 Exact arithmetic only

Authoritative Algebra math uses:

- `bigint` integers;
- reduced exact rationals;
- exact one-variable polynomials;
- exact quadratic surds of the form `p + q√d`;
- exact root/interval sets.

Floating point may be used only for non-authoritative display after exact validation.

### 3.3 Shared engines, not duplicated formulas

Reusable symbolic primitives live under:

```text
quant-v4/shared/algebra/
```

The most important shared rule is the quadratic-root power-sum recurrence:

For roots `r1,r2` of

` t² - s t + p = 0 `

let `P_n = r1^n + r2^n`. Then:

```text
P_0 = 2
P_1 = s
P_n = s P_(n-1) - p P_(n-2)
```

This one engine powers both:

- `x + 1/x` transformed-value questions (`p = 1`);
- Vieta root-power questions such as `α³ + β³`.

It must be implemented once and reused.

### 3.4 Vieta-first solving

If the tested inference is a symmetric function of roots, solve directly from coefficients using Vieta. Do not find individual roots merely because the engine can.

### 3.5 Human solutions

Solutions must explain what is given, what is required, why the chosen relation applies, and the complete calculation. Avoid metadata-like step dumps and unexplained formula walls.

### 3.6 Difficulty from topology

Difficulty comes from reverse inference, parameters, domain restrictions, identity selection, root relations, interval analysis, ambiguity and data sufficiency—not giant coefficients or ugly arithmetic.

---

## 4. Scope and ownership

### Included

- algebraic terms, coefficients, degree and exact substitution;
- one- and two-variable symbolic manipulation;
- standard identities;
- reciprocal transformed values (`x ± 1/x`);
- three-variable symmetric identities;
- polynomial addition, multiplication and factorisation;
- polynomial remainder/factor theorem;
- one-variable linear equations;
- two-variable linear systems and solution classification;
- algebraic fractions and rational equations with excluded-value checks;
- quadratic solving and discriminant classification;
- root/coefficient relationships and transformed-root equations;
- Banking quadratic comparison;
- linear and quadratic inequalities;
- quadratic sign and extrema;
- absolute-value equations/inequalities;
- quantity comparison, statements and data sufficiency;
- bounded mixed algebra synthesis/caselets after ordinary engines are stable.

### Excluded/delegated

- pure BODMAS/approximation → Simplification & Approximation;
- pure surd/index simplification → Surds & Indices;
- divisibility/digit/remainder number theory → Number System;
- age scenarios → Problems on Ages;
- commercial arithmetic → Profit/Loss, Interest, Partnership etc.;
- work/rate and speed/distance scenarios → their own chapters;
- probability/counting → Probability/P&C;
- coordinate geometry → Geometry/Coordinate Geometry;
- trigonometric equations → Trigonometry;
- matrices, determinants, complex numbers, calculus and higher algebra outside target exams;
- cubic-root Vieta families unless a later source audit proves meaningful demand.

### Boundary examples

```text
3x + 7 = 25                           → Algebra
25% of a number is 45                 → Percentage
x + 1/x = 5; find x² + 1/x²          → Algebra
find present ages from past/future    → Ages
find polynomial remainder at x=2      → Algebra
find 7^103 mod 10                     → Number System
simplify √48                           → Surds & Indices
find roots of x² - 7x + 12            → Algebra
Banking: compare roots of Eq I and II → Algebra
```

---

## 5. Universal discovery matrix

Every CP must be audited across relevant combinations before counts freeze.

### Target direction

```text
direct evaluation
reverse missing constraint
solve unknown
solve system
symmetric root target without individual roots
individual roots
classification/nature
parameter recovery
extremum
sign/interval
integer-solution count
claim verification
quantity comparison
data sufficiency
```

### Structural topology

```text
single expression
two-variable identity
three-variable symmetric identity
reciprocal pair
one-variable linear equation
two-variable system
rational equation
factorable quadratic
irrational-root quadratic
repeated-root quadratic
no-real-root quadratic
quadratic root-set pair comparison
linear inequality
quadratic inequality
absolute-value piecewise state
polynomial linear-factor division
```

### Constraint topology

```text
direct value
derived value
parameter condition
known root
known factor/remainder
source-authentic special identity condition
multiple statements
domain restriction
```

### Edge states

```text
zero coefficient
negative answer
rational answer
discriminant >0, =0, <0
perfect-square vs non-square discriminant
no/infinite linear-system solution
excluded denominator root
extraneous candidate
open/closed interval boundary
equality possible in Banking comparison
non-integer quadratic vertex
```

### Representation

```text
direct symbolic MCQ
plain prose
statement set
quantity I / quantity II
data sufficiency
table/caselet
```

Representation is a new QL only when it changes evidence topology, learner inference or answer contract.

---

## 6. Exact shared Algebra model

Phase 0 creates an isolated `bigint` Algebra core rather than altering mature chapter-local safe-integer rational implementations.

Required modules:

```text
quant-v4/shared/algebra/
  rational.ts
  quadratic-surd.ts
  power-sum.ts
  expression-ast.ts
  polynomial.ts
  linear-equation.ts
  quadratic.ts
  index.ts
```

Later modules:

```text
linear-system.ts
factorisation.ts
polynomial-division.ts
rational-equation.ts
domain.ts
inequality.ts
absolute-value.ts
equivalence.ts
formatting.ts
```

### Rational invariant

```ts
interface Rational {
  numerator: bigint;
  denominator: bigint;
}
```

- denominator nonzero and positive;
- reduced by GCD;
- zero canonicalised to `0/1`.

### Exact quadratic surd

```ts
interface QuadraticSurd {
  p: Rational;
  q: Rational;
  d: bigint; // square-free positive radicand when q != 0
}
```

This supports exact irrational roots without turning Algebra into a Surds chapter.

### Expression AST

Authoritative expressions are structured, not parsed strings.

```ts
type AlgebraExpr =
  | CONST
  | VAR
  | ADD
  | MUL
  | POW
  | NEG
  | DIV
  | ABS;
```

### One-variable polynomial

Coefficients are stored ascending by degree and normalised exactly.

---

## 7. Checkpoint authority

### ALG-CP-001 — Algebraic expressions and exact substitution

Owns terminology, degree, like terms, exact evaluation, equivalent-expression recognition and controlled substitution.

Provisional solve families include:

```text
identify variable/constant/coefficient/term
classify polynomial by degree/term count
combine like terms
evaluate one/two-variable expression
find missing coefficient from known value
construct expression from verbal relation
identify equivalent expression
detect undefined substitution
```

### ALG-CP-002 — Identities and transformed values

Owns two-variable identities and reciprocal transformed-value chains.

Core identities:

```text
(a+b)², (a-b)², a²-b²
(a+b)³, (a-b)³
a³+b³, a³-b³
a⁴-b⁴ where exam-relevant
x ± 1/x power families
```

The reciprocal power ladder must use the shared recurrence, not hard-coded formulas.

### ALG-CP-003 — Three-variable symmetric identities

Explicitly owns:

```text
(a+b+c)²
a²+b²+c² ↔ ab+bc+ca
a+b+c=0 ⇒ a³+b³+c³=3abc
general three-variable cubic identity where source-backed
(a-b)²+(b-c)²+(c-a)²
```

Cubic-equation root theory remains excluded unless source-audited later.

### ALG-CP-004 — Polynomial operations and factorisation

Owns expansion and factor structure:

```text
common factor
grouping
difference of squares
perfect-square trinomials
sum/difference of cubes
monic/non-monic quadratic factorisation
bounded substitution patterns
```

Prefer reverse construction from known factors and verify by exact re-expansion.

### ALG-CP-005 — Polynomial remainder and factor theorem

Core rules:

```text
remainder of P(x) on division by x-a = P(a)
x-a is a factor iff P(a)=0
```

Supports unknown coefficient/parameter recovery and bounded factor-then-quadratic chains. Numeric modular remainder belongs to Number System.

### ALG-CP-006 — One-variable linear equations

Must classify exactly:

```text
UNIQUE
NO_SOLUTION
INFINITE_SOLUTIONS
```

Supports brackets, fractions, variable on both sides, literal equations and parameter conditions.

Generation should normally reverse-construct from a chosen clean answer.

### ALG-CP-007 — Simultaneous linear equations

Owns two-variable systems, transformed targets and unique/none/infinite classification. Three-variable systems are included only when highly structured and source-backed.

Canonical verification substitutes the candidate into every original equation.

### ALG-CP-008 — Algebraic fractions and rational equations

Mandatory lifecycle:

```text
extract original denominator restrictions
solve exactly
substitute candidates into original unsimplified equation
reject excluded/extraneous candidates
```

Cancellation never removes an original excluded value.

### ALG-CP-009 — Quadratic equations

Core:

```text
ax²+bx+c=0
D=b²-4ac
```

Supports factorable, repeated, exact irrational and no-real-root states. Complex roots are out of scope.

Difficulty comes from transformations/parameters, not large coefficients.

### ALG-CP-010 — Roots, coefficients and transformed equations

Vieta authority:

```text
α+β = -b/a
αβ = c/a
```

Owns symmetric functions, equation construction, shifted/scaled/negated/reciprocal roots and source-backed transformed roots.

Direct Vieta is mandatory when individual root values are unnecessary.

### ALG-CP-011 — Banking quadratic comparison

Given all valid real roots `X` and `Y`, classify the relation by comparing **all** root pairs.

No solver may select one arbitrary root from each equation.

Required relation classes include strict, weak/equality-possible and indeterminate according to product option conventions.

### ALG-CP-012 — Inequalities, quadratic sign and extrema

Owns:

```text
linear inequalities
compound intervals
factored quadratic inequalities
quadratic sign intervals
minimum/maximum of ax²+bx+c
vertex x = -b/(2a)
parameter conditions for always-positive/always-negative forms
integer counts within solution intervals
```

Sign reversal on multiplication/division by a negative quantity is solver-level logic.

### ALG-CP-013 — Absolute value

Owns bounded competitive-exam absolute-value equations/inequalities and interval unions. Nested arbitrary puzzles are excluded without source evidence.

### ALG-CP-014 — Statement, quantity comparison and data sufficiency

A presentation layer over already-proven engines.

Data sufficiency asks whether information is sufficient, not for the underlying value. Every admissible state must be considered.

### ALG-CP-015 — Mixed synthesis and caselets

Implemented last. At most two major Algebra engines in an ordinary mixed question unless an authentic source proves otherwise. No difficulty stacking for its own sake.

---

## 8. Generator pipeline

```text
QL selection
→ exam profile / difficulty profile
→ structural state construction
→ domain validation
→ canonical solve
→ independent verification
→ answer canonicalisation
→ misconception-backed distractors
→ option uniqueness
→ stem rendering
→ human solution
→ localisation
→ parity audit
→ Question Studio payload
```

Generation is deterministic from:

```text
runtimePackageId + cpId + qlId + seed + language + generatorVersion
```

Runtime free-form question invention is not authoritative production generation.

---

## 9. Independent verification

Every permanent QL needs two paths.

Examples:

```text
linear equation: isolate coefficients → substitute into original equation
system: elimination/determinant → substitute into every original equation
factorisation: factor engine → re-expand and compare polynomial
identity: symbolic identity path → evaluate from hidden exact source values
rational equation: cleared equation → original equation + domain check
quadratic: factor/formula → substitute roots + discriminant/root-count proof
inequality: symbolic interval solve → critical-point/boundary sign proof
remainder theorem: P(a) → exact polynomial division
Banking comparison: root solver → exhaustive root-pair relation proof
```

A verifier must not merely call the same solver helper chain under another function name.

---

## 10. Distractors

Prefer misconception-backed distractors:

```text
SIGN_TRANSFER_ERROR
BRACKET_DISTRIBUTION_ERROR
PARTIAL_DENOMINATOR_CLEARING
SQUARE_SUM_MISSING_2AB
CUBE_SUM_AS_SUM_OF_CUBES
RECIPROCAL_PLUS_MINUS_TWO
WRONG_FACTOR_PAIR
ROOT_SIGN_FROM_FACTOR
FORMULA_MINUS_B_ERROR
DISCRIMINANT_SIGN_ERROR
KEEP_EXTRANEOUS_ROOT
CANCEL_ACROSS_ADDITION
NO_INEQUALITY_SIGN_REVERSAL
OPEN_CLOSED_ENDPOINT_ERROR
BANKING_SINGLE_ROOT_COMPARISON
```

Random nearby values are fallback only.

---

## 11. Human-solution contract

Preferred learner flow:

```text
Given / relation known
What is required
Why the chosen identity/equation method applies
Complete substitution/transformation
Complete calculation
Answer
```

Do not expose internal QL IDs, solver names, state metadata or distractor rationale to learners.

---

## 12. Multilingual contract

One exact state drives all languages:

```text
state → en-IN
      → hi-IN
      → pa-IN
```

Math expressions, answer and option values remain identical. Localisation changes grammar and reviewed terminology only.

Parity audits must prove same givens, target, restrictions, answer, options, solution mathematics and logical quantifiers.

---

## 13. Question Studio contract

Algebra uses the existing shared Question Studio package architecture. Do not create a dedicated Algebra lifecycle, admin app or approval router unless the shared platform proves insufficient.

Question Studio exposure remains disabled until package-level generation, regeneration, persistence, review exports and localisation gates pass.

Question Studio completion does not automatically enable Question Bank, tests or public release.

---

## 14. Required audits

### Mathematical

```text
exactness
solver/verifier agreement
domain/extraneous-root
factorisation re-expansion
linear-system substitution
quadratic root state
Banking relation class
inequality boundary/sign
remainder/factor theorem
```

### Corpus

```text
generation success
seed reproducibility
option uniqueness
correct-option distribution
state diversity
duplicate / near-duplicate
difficulty distribution
```

### Editorial/localisation

```text
stem readability
human-solution completeness
formula-without-explanation
notation consistency
context realism
Hindi/Punjabi quality
untranslated fragment
semantic parity
```

### Coverage

```text
CP/QL/solve-mode
universal discovery matrix
reverse/inverse
edge/boundary
SSC
Banking
Punjab/state
cross-chapter ownership
legacy recovery
source/PYQ gap
```

---

## 15. Implementation order

```text
Phase 0 — exact shared foundation
ALG-CP-001
ALG-CP-002
ALG-CP-003
ALG-CP-004
ALG-CP-005
ALG-CP-006
ALG-CP-007
ALG-CP-008
ALG-CP-009
ALG-CP-010
ALG-CP-011
ALG-CP-012
ALG-CP-013
ALG-CP-014
ALG-CP-015
chapter-wide gap/duplicate audit
English freeze
Hindi/Punjabi freeze
shared Question Studio integration
```

The shared power-sum recurrence is proven in CP-002 and reused by CP-010.

---

## 16. Phase 0 executable contract

Phase 0 creates:

```text
quant-v4/shared/algebra/
  rational.ts
  quadratic-surd.ts
  power-sum.ts
  expression-ast.ts
  polynomial.ts
  linear-equation.ts
  quadratic.ts
  index.ts

AdvancedMathematics/subtopics/Algebra/
  ALG-END-TO-END-DESIGN.md
  ALG-001/foundation/chapter-types.ts
  ALG-001/index.ts
  tests/phase0-foundation.test.ts
```

Phase 0 acceptance must prove:

- exact rational reduction/arithmetic;
- AST substitution/evaluation;
- polynomial expansion/evaluation;
- linear unique/no/infinite classification;
- independent substitution verification;
- shared recurrence for both reciprocal values and Vieta root powers;
- exact quadratic-surd normalisation;
- rational/repeated/irrational/no-real quadratic states;
- strict TypeScript compile.

Phase 0 does **not** freeze any QL or expose Algebra to Question Studio.

---

## 17. Definition of done

A CP is complete only when source-backed discovery is saturated, retained QLs generate reliably, solver and verifier are independent and green, edge/domain audits pass, distractors are realistic, English/Hindi/Punjabi review passes and shared Question Studio integration works for that release boundary.

The chapter is Question-Studio-complete only when all approved CPs are frozen, multilingual parity is complete, large-corpus audits pass, shared package discovery/regeneration/persistence works and downstream release locks remain explicit.

---

## 18. Non-negotiable rules

1. No permanent QL quota.
2. No floating-point authority.
3. No stem-first generation.
4. No answer without independent verification.
5. No rational-equation root without original-domain validation.
6. No Banking comparison using one arbitrarily selected root.
7. No factorisation checked only by string equality.
8. No duplicated power-sum engine between reciprocal and Vieta families.
9. No full quadratic solve when Vieta directly answers the tested symmetric target.
10. No fake difficulty from giant coefficients.
11. No formula-only learner solutions.
12. No independently regenerated multilingual math.
13. No Algebra-specific lifecycle when shared Question Studio is sufficient.
14. No Question Bank/test/public release merely because Question Studio is green.
15. No mixed-synthesis implementation before its component engines are stable.

This Revision 2 supersedes the earlier `ALG-001-END-TO-END-DESIGN.md` draft and incorporates the valuable architecture and discovery ideas from the later Algebra blueprint/inventory review while retaining the broader SSC/Banking coverage required by ExamTree.
