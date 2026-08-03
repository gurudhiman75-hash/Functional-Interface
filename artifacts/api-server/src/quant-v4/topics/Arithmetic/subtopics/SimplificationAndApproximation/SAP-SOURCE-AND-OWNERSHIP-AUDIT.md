# Simplification and Approximation — Source and Ownership Audit

**Applies to:** `SAP-001`, `SAP-002`, `SAP-CP-001..SAP-CP-012`  
**Status:** design-stage source classification authority  
**Permanent QLs:** none  
**Question Studio exposure:** disabled

---

## 1. Purpose

This audit records what the available uploaded and repository sources prove, what they do not prove, and which ExamTree chapter owns each family. Source headings are evidence, not automatic architecture.

Every source fixture must eventually receive exactly one disposition:

```text
RETAIN
MERGE
SPLIT
REASSIGN
ADVANCED_HOLD
REJECT
```

No source question becomes a permanent QL merely because it appears in a recognised book.

---

## 2. Reviewed source set

### 2.1 Uploaded R.S. Aggarwal quantitative aptitude material

The uploaded file labelled as a reasoning book is actually a quantitative aptitude text. Its contents separate:

- Decimal Fractions;
- Simplification;
- Square Roots and Cube Roots;
- Surds and Indices;
- Percentage;
- HCF and LCM;
- other applied arithmetic chapters.

This is important evidence that “Simplification” is an expression-evaluation family, not a licence to absorb every fundamentals topic.

**Useful evidence:**

- large practice depth for exact arithmetic expression evaluation;
- fractions, decimals, bracketed expressions and shortcut-oriented calculation;
- objective-answer and data-sufficiency wrappers;
- exam-speed emphasis.

**Not automatic authority:**

- old publication taxonomy;
- every printed shortcut;
- symbolic roots/surds or HCF/LCM merely because they appear near Simplification;
- OCR-damaged formula layout.

### 2.2 Uploaded Disha SSC Mathematics Guide

The Fundamentals chapter explicitly presents:

- BODMAS;
- “of” as multiplication;
- inner-to-outer grouping;
- vinculum, round, curly and square brackets;
- worked mixed-operation expressions.

**Useful evidence:**

- strong SSC-facing demand for operation order and bracket scope;
- authentic use of mixed numeric forms;
- need for teacher-style explanation of the decisive operation sequence.

**Required correction in ExamTree:**

- multiplication and division have equal precedence and run left to right;
- addition and subtraction have equal precedence and run left to right;
- bracket glyph type does not create a mathematical precedence independent of nesting;
- “of” must be rendered with explicit scope so the expression has one parse.

### 2.3 Uploaded Arun Sharma quantitative aptitude material

The material contains calculation methods, ratio estimation, percentage landmarks and examples of controlled approximation.

**Useful evidence:**

- compatible-number estimation;
- scaled ratio comparison;
- approximate percentage calculation;
- exact-versus-estimated route comparison;
- the value of option-aware calculation.

**Not automatic authority:**

- CAT-specific advanced heuristics;
- unrestricted trend extrapolation;
- approximation methods that cannot provide a certified answer gap for ExamTree MCQs.

### 2.4 Repository legacy Fundamentals inventory

`artifacts/api-server/src/lib/motifs/quant/fundamentals.ts` currently mixes:

- BODMAS;
- fractions and decimals;
- HCF/LCM;
- prime factorisation;
- surds and indices;
- divisibility;
- unit digit cycles;
- simplification and approximation.

The file is useful as a recovery inventory but is too broad to become the new runtime boundary.

**Retain after redesign:** BODMAS, fraction chains, decimal normalisation in expressions, structural cancellation and approximation.

**Reassign:** HCF/LCM, divisibility, unit digits, prime structure, symbolic surds and symbolic index laws.

---

## 3. Source-family disposition matrix

| Source family | ExamTree disposition | Owner | Reason |
|---|---|---|---|
| Flat BODMAS expression | RETAIN | SAP-CP-001 | Parse and precedence are the learner objective |
| Nested brackets/vinculum | RETAIN | SAP-CP-001 | Grouping materially changes evaluation |
| Traditional bracket glyph ordering | MERGE/CORRECT | SAP-CP-001 | Nesting, not glyph prestige, controls scope |
| “Of” inside arithmetic expression | RETAIN WITH GUARD | SAP-CP-001 | Authentic but must be unambiguous |
| Fraction arithmetic chain | RETAIN | SAP-CP-002 | Exact rational evaluation is central |
| Convert or classify a lone fraction/decimal | REASSIGN | Number System | Representation is the learner objective |
| Complex fraction / continued fraction | RETAIN BOUNDED | SAP-CP-002 | Evaluation contract, if exam-realistic |
| Terminating decimal expression | RETAIN | SAP-CP-003 | Place-value arithmetic and conversion aid evaluation |
| Recurring decimal reconstruction | REASSIGN | Number System | Representation theory is central |
| Recurring decimal used inside larger expression | RETAIN VIA ADAPTER | SAP-CP-003 | Conversion is incidental to evaluation |
| Percentage literal used as a factor | RETAIN | SAP-CP-003 | Pure numeric operation |
| Unknown percentage/rate/base | REASSIGN | Percentage | Percentage semantics are central |
| Exact numeric power/perfect root | RETAIN | SAP-CP-004 | Bounded evaluation |
| Perfect-power classification or exponent completion | REASSIGN | Number System | Number structure is central |
| Symbolic surd/index simplification | REASSIGN | Surds and Indices | Symbolic laws are central |
| Small factorial evaluation or quotient cancellation | RETAIN | SAP-CP-004/005 | Numeric expression evaluation |
| Factorial valuation/trailing zeroes | REASSIGN | Number System | Prime-exponent structure is central |
| Factorial as arrangement count | REASSIGN | P&C | Counting interpretation is central |
| Product-chain cancellation | RETAIN | SAP-CP-005 | Structural simplification is central |
| Telescoping numeric form | RETAIN BOUNDED | SAP-CP-005 | Efficient exact reduction, when source-backed |
| Missing operand in fixed arithmetic structure | RETAIN | SAP-CP-006 | Direct inverse arithmetic is sufficient |
| General equation family | REASSIGN | Algebra | Symbolic equation solving is central |
| Coded/interchanged operators | REASSIGN | Reasoning OPS | Operator meaning is hidden or transformed |
| Explicit place-value rounding | RETAIN | SAP-CP-007 | Rounding rule is central |
| Approximate sum/difference | RETAIN | SAP-CP-008 | Additive estimation |
| Approximate product/quotient/ratio/percentage | RETAIN | SAP-CP-009 | Multiplicative estimation |
| Approximate non-perfect root/power | RETAIN BOUNDED | SAP-CP-010 | Benchmark estimation |
| Nearest-option and error tasks | RETAIN | SAP-CP-011 | Option separation or error is central |
| Reverse approximate equality | RETAIN | SAP-CP-012 | Approximation-aware inversion |
| DI table interpretation with estimation | SHARED ENGINE, NO DUPLICATE QL | Data Interpretation | Interpretation/caselet remains DI-owned |
| Applied chapter word problem using approximation | SHARED ENGINE, NO DUPLICATE QL | Applied chapter | Approximation is a calculation aid only |

---

## 4. Cross-chapter ownership decisions

### 4.1 Number System

Number System owns:

- exact rational representation and decimal termination;
- recurring-decimal construction;
- divisibility and prime factorisation;
- HCF/LCM;
- terminal digits;
- factorial valuations and perfect powers.

Simplification may call those primitives only when the final learner task is evaluation of a larger expression.

### 4.2 Percentage

Percentage owns semantic relations among part, whole and rate, including percentage change and applied word problems. Simplification owns `%` as a numeric representation inside an expression.

### 4.3 Surds and Indices

Surds and Indices owns symbolic manipulation, rationalisation and variable-base exponent laws. Simplification owns exact numeric evaluation such as `√144`, `3^4` or a small perfect-root expression.

### 4.4 Algebra

Algebra owns general unknown-variable equations and identities. Simplification owns direct missing-operand arithmetic when the expression structure is fixed and no general equation model is needed.

### 4.5 P&C

P&C owns factorial expressions interpreted as counts. Simplification may evaluate a factorial ratio as a pure numeric object without an arrangement/selection meaning.

### 4.6 Reasoning Mathematical Operations

Reasoning OPS owns changed, coded, interchanged or missing operators. Simplification assumes standard operators with declared meanings.

### 4.7 Data Interpretation

DI may use SAP approximation utilities, but reading and combining chart/table evidence remains DI-owned. A standalone arithmetic estimate extracted from no caselet belongs to SAP.

---

## 5. Required source-fixture extraction dimensions

Each relevant source question should be indexed by:

```text
source document and location
printed expression
normalised AST
visible numeric representations
operation set
grouping depth
task direction
answer semantic
exact or approximate contract
rounding stage and rule
canonical method
credible alternate method
misconception evidence
proposed owner
final disposition
known print/OCR defect
```

Do not preserve a malformed OCR expression as a valid fixture. Resolve it from the visual page or mark it unusable.

---

## 6. Source defects and normalisation risks

### 6.1 BODMAS mnemonic misuse

The letters must not be interpreted as:

```text
all division before all multiplication
all addition before all subtraction
```

ExamTree explanations must explicitly teach equal-precedence left-to-right behaviour.

### 6.2 Bracket-glyph folklore

Round, curly and square brackets are visual grouping devices. Nesting determines evaluation. Source wording that implies a free-standing mathematical precedence among glyph types is normalised rather than copied.

### 6.3 Ambiguous “of”

Expressions such as `1/2 of 8 ÷ 2` can be read differently when scope is not shown. Generated content must use parentheses, a fraction bar or an explicit multiplication sign to produce one parse.

### 6.4 OCR loss

Source PDFs frequently lose:

- fraction bars;
- vinculum extent;
- radical extent;
- superscripts;
- multiplication signs;
- recurring-decimal bars;
- nested bracket boundaries.

Visual confirmation is mandatory before registering such a fixture.

### 6.5 Approximation without policy

Some books rely on unstated classroom conventions. ExamTree must attach an explicit machine policy and reject a state when multiple defensible policies produce different answers.

### 6.6 Exact/approximate symbol confusion

Source solutions may use `=` after rounding. ExamTree uses:

```text
=  for exact equality
≈  for approximation
```

### 6.7 Premature rounding

A source shortcut may round intermediate values too aggressively. It is retained only when option separation or a certified error interval proves the answer.

---

## 7. Approximation evidence requirements

Every approximation fixture must record:

- exact oracle value;
- declared rounding/compatible-number policy;
- transformed values;
- estimated value;
- whether the route overestimates or underestimates when known;
- uncertainty or certified interval;
- nearest-option distances;
- uniqueness and safety gap;
- alternate common policy outcome.

A fixture is rejected when:

- the intended option is not uniquely nearest;
- the approved estimate can cross the midpoint to another option;
- the denominator can round to zero;
- subtraction causes uncontrolled catastrophic cancellation;
- the stem precision conflicts with the answer precision;
- exact and approximate notation are mixed incorrectly.

---

## 8. Advanced-enrichment policy

### 8.1 Hold unless recurring source evidence appears

- non-trivial significant-figure science conventions;
- advanced relative-error propagation;
- first-order differential approximation;
- binomial-series estimation;
- logarithmic interpolation;
- repeated-root numerical algorithms;
- unrestricted continued fractions;
- advanced telescoping series;
- approximation of transcendental constants.

### 8.2 Reject from routine SAP

- Newton-Raphson as a learner requirement;
- Taylor series and calculus-based error analysis;
- engineering numerical methods;
- arbitrary-precision scientific computation;
- trick expressions whose only difficulty is unreadable typography;
- artificial expressions requiring excessive manual multiplication.

---

## 9. Source saturation gate

A checkpoint is source-saturated only when:

- every reviewed fixture has a disposition;
- at least one SSC/banking/state-exam style source stream has been checked where relevant;
- direct, inverse, comparison, count/set and possible/impossible forms have been searched;
- edge and representation variants have been searched;
- legacy Fundamentals motifs have been reconciled;
- duplicate ownership with neighbouring chapters has been checked;
- no unresolved OCR-dependent major family remains;
- the latest gap wave finds no new material task contract.

Source saturation does not allocate permanent QLs. It permits a merge/split proposal.

---

## 10. Current design conclusion

The source evidence supports one learner-facing chapter with two runtime packages:

```text
SAP-001 — Exact Expression Simplification
SAP-002 — Approximation and Estimation
```

The evidence supports the twelve checkpoint hypotheses in the end-to-end blueprint. It does not support a fixed QL count or solve-mode quota.

Current lifecycle remains:

```text
Permanent QLs: 0
Frozen solve modes: 0
Question Studio: disabled
Question Bank: disabled
Test eligibility: disabled
Public publication: disabled
```
