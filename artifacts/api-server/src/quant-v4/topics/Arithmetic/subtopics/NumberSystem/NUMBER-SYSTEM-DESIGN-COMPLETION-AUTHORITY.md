# ExamTree Quant V4 — Number System Design Completion Authority

**Student-facing chapter:** Number System  
**Runtime packages:** `NUM-001`, `NUM-002`  
**Canonical CP range:** `NUM-CP-001..NUM-CP-014`  
**Design status:** `COMPLETE_FOR_CHECKPOINT_EXECUTABLE_DISCOVERY`  
**Current permanent allocation:** `NUM-QL-001..NUM-QL-017` owned by `NUM-CP-003`  
**Next available chapter identity:** `NUM-QL-018`  
**Question Studio / Question Bank / tests / public routing:** disabled unless separately released

---

## 1. What “design complete” means

The Number System design is complete when the chapter has a stable architecture, explicit mathematical ownership, checkpoint boundaries, source and legacy disposition rules, shared-engine contracts, exhaustive discovery dimensions, verification routes, lifecycle gates and a dependency-aware implementation order.

It does **not** mean that all future QL or solve-mode counts are known.

For every checkpoint other than the already approved `NUM-CP-003`, the following remain open outcomes of executable discovery:

- retained solve-authority count;
- retained learner-template count;
- difficulty distribution;
- permanent QL range;
- representation inventory;
- advanced-enrichment retention.

No checkpoint may use a guessed count as a quota.

---

## 2. Authority order

Where earlier Number System documents contain historical status lines, this document supplies the current chapter truth.

Authority order:

1. approved permanent allocation records for an individual CP;
2. this design-completion authority;
3. package blueprints for `NUM-001` and `NUM-002`;
4. the cross-CP ownership and dependency matrix;
5. the open discovery and freeze protocol;
6. the original end-to-end design hypothesis;
7. source, legacy and exploratory records.

Detailed mathematical candidates in the original design remain valid discovery input unless this authority explicitly reassigns, merges, rejects or places them on hold.

---

## 3. Final package architecture

```text
Number System
├── NUM-001 — Number Structure, Divisibility, Factors and HCF/LCM
│   ├── NUM-CP-001 — Number Sets, Order, Parity and Integer Structure
│   ├── NUM-CP-002 — Fractions, Decimals and Recurring Representations
│   ├── NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints
│   ├── NUM-CP-004 — Prime Structure and Factorisation
│   ├── NUM-CP-005 — Divisors and Divisor Functions
│   └── NUM-CP-006 — HCF, LCM and Common-Alignment Applications
└── NUM-002 — Remainders, Digits, Powers, Bases and Synthesis
    ├── NUM-CP-007 — Division Algorithm and Elementary Remainder Transformation
    ├── NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences
    ├── NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits
    ├── NUM-CP-010 — Digit Structure, Place Value and Number Reconstruction
    ├── NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes
    ├── NUM-CP-012 — Perfect Squares, Cubes and General Perfect Powers
    ├── NUM-CP-013 — Positional Bases and Numeral Conversion
    └── NUM-CP-014 — Mixed Inverse, Optimisation and Number-Theory Synthesis
```

The package split is an implementation boundary only. The learner sees one Number System chapter and may filter by concept family.

---

## 4. Final checkpoint ownership decisions

| CP | Governing authority | Owns | Does not own |
|---|---|---|---|
| CP-001 | exact set/order/integer-property reasoning | number-set classification, signed order, interval integers, parity, elementary consecutive-integer structure | general equations, long simplification, number series |
| CP-002 | exact rational representation | fraction/decimal comparison, recurring conversion, termination structure, exact rational reconstruction | expression-heavy fraction arithmetic |
| CP-003 | decimal digit divisibility constraints | direct/composite divisibility, missing digits, one-divisor range count, repeated numeral divisibility, approved claim/DS representations | modular power, inclusion-exclusion counting, generic digit arithmetic |
| CP-004 | prime decomposition | prime/composite/co-prime structure and factorisation before another target takes over | divisor-function outputs, HCF/LCM targets |
| CP-005 | divisor-set functions | divisor count/subsets/sum/product and bounded inverse divisor-count reconstruction | arrangement counting of factor selections |
| CP-006 | common-factor/common-multiple optimisation | HCF, LCM, exact grouping, same-remainder greatest divisor, common-event alignment | work-rate or movement scheduling |
| CP-007 | one-stage division lemma | dividend/divisor/quotient/remainder reconstruction and compatible single-modulus transformations | simultaneous congruences or non-trivial modular equations |
| CP-008 | congruence systems | modular arithmetic, power remainders, linear congruences, compatible/incompatible systems and bounded CRT | terminal-digit answers whose pedagogy is cycle-specific |
| CP-009 | terminal periodicity | unit digit, last two/three digits, inverse cycle position and bounded last non-zero digit | general modular result not expressed as terminal digits |
| CP-010 | digit equations | place value, digital root, reversal/interchange, carry/borrow and bounded number reconstruction | divisibility-only missing digit, formed-number counting |
| CP-011 | prime valuation in products/factorials | highest powers, trailing zeroes, factorial divisibility and inverse valuation states | ordinary P&C factorial counting |
| CP-012 | perfect-power exponent completion | square/cube/general perfect-power recognition, completion and optimisation | surd manipulation, geometric square/cube measurement |
| CP-013 | positional numeral systems | conversion, validity, unknown base/digit, base arithmetic and base-specific divisibility | coded-number reasoning |
| CP-014 | essential multi-engine synthesis | bounded tasks requiring at least two independently essential Number System authorities | a hard single-engine question with decorative secondary evidence |

---

## 5. Current frozen checkpoint truth

`NUM-CP-003` is the first approved checkpoint and owns:

```text
NUM-QL-001..NUM-QL-017
17 frozen learner-template families
7 frozen solve modes
```

Its retained authority covers:

1. divisor/non-divisor selection;
2. unique missing digit;
3. extremum valid digit;
4. valid-digit count;
5. valid-digit sum;
6. complete valid-digit set;
7. extremum completed number;
8. unique ordered digit pair;
9. ordered-pair count;
10. complete ordered-pair set;
11. pair-solution classification;
12. extremum n-digit multiple;
13. one-divisor inclusive-range count;
14. implicit repeated-numeral divisibility;
15. linked arithmetic/divisibility extremum;
16. missing-digit data sufficiency;
17. divisibility claim verification.

This allocation is inactive implementation proof. It does not imply Question Studio, Question Bank, test, localisation or publication release.

---

## 6. Cross-CP decisions closed by this authority

### 6.1 Least or greatest n-digit multiple

The approved CP-003 template retains the **digit-range divisibility** form.

CP-007 may use nearest multiple, minimum addition or minimum subtraction only when the visible state is governed by the division algorithm and remainder transformation. It must not duplicate the permanent CP-003 learner contract.

### 6.2 Same-remainder greatest divisor

Owned by CP-006 because the governing inference is the HCF of pairwise differences.

CP-007 may supply the division-lemma explanation primitive but may not allocate a duplicate learner QL.

### 6.3 Power-expression divisibility and remainder

- direct guaranteed algebraic factor identity: hold for CP-008/Algebra ownership audit;
- actual remainder of a large power or structured expression: CP-008;
- terminal digit of the power: CP-009;
- direct decimal digit divisibility without modular exponentiation: CP-003.

### 6.4 Overlap counting

Counting values divisible by either, neither, exactly one or at least one of several divisors is not part of the frozen CP-003 set.

Provisional owner:

- CP-006 when the main object is common multiples or LCM-based overlap;
- a shared exact set-counting adapter when inclusion-exclusion itself is central;
- P&C/Set Theory when the task is primarily combinatorial set counting.

No duplicate QL is allocated until that ownership audit closes during CP-006 discovery.

### 6.5 Digit arithmetic versus divisibility

- arithmetic column/carry/borrow determines the digit: CP-010;
- arithmetic leaves several candidates and divisibility materially filters them: CP-003 or CP-014 depending on whether a second full engine is essential;
- visible arithmetic alone fixes the digit and divisibility is decorative: reject as a Number System hybrid.

### 6.6 Fraction HCF/LCM

CP-006 may retain HCF/LCM of fractions or terminating decimals only after normalising exact rational units. Generic fraction calculation remains CP-002 or Simplification.

### 6.7 Factorial and P&C

- factorial as a product with prime valuations or zeroes: CP-011;
- factorial as a count of arrangements: P&C;
- binomial-coefficient valuation: advanced hold pending source evidence and P&C ownership review.

### 6.8 Perfect-power divisor questions

- count square/cube divisors: CP-005, because the answer is a divisor-set count;
- minimum multiplier/divisor to make the number a square/cube: CP-012;
- infer a perfect power from an inverse divisor-count state: owner chosen by the final requested semantic and essential inference; CP-014 only if both engines are independently necessary.

### 6.9 Base-system divisibility

CP-013 owns numeral validity and arithmetic in the stated base. It may call shared divisibility and modular validators, but the learner contract remains CP-013 when base interpretation is essential.

---

## 7. Source-backed design evidence

The design has been checked against:

- uploaded SSC chapterwise mathematics material;
- uploaded SSC Number System previous-year solved papers;
- uploaded SSC mathematics guide material;
- broader quantitative-aptitude Number System and base-system references;
- existing Quant V2 family inventory;
- Quant V3 divisibility and implementation traces;
- mature Quant V4 chapter design conventions;
- the approved executable CP-003 discovery and permanent-allocation record.

Source headings are evidence only. Every item is assigned according to the invariant actually tested.

The source set establishes routine demand for fractions, divisibility, range multiples, prime structure, factorisation, HCF/LCM, division-lemma remainder transfer, number reversal, terminal digits, factorial zeroes and base conversion. Advanced methods remain conditional on explicit recurring evidence.

---

## 8. Advanced-enrichment policy

The following do not become routine QLs merely because they are mathematically related:

- Euler totient and co-prime counts by `φ(n)`;
- modular inverse as an abstract target;
- general CRT with large unrestricted moduli;
- Fermat/Euler exponent reduction;
- Wilson-theorem remainder tasks;
- factorial-ratio and binomial-coefficient valuations;
- last non-zero digit of large factorials;
- fractional values in arbitrary bases;
- unbounded general perfect-power decomposition.

Each remains `ADVANCED_ENRICHMENT_HOLD` until source saturation proves exam relevance, bounded manual solvability and a distinct misconception profile.

---

## 9. Universal discovery matrix

Every unfrozen CP must test all relevant cells of this matrix.

### Direction

```text
direct value
reverse value
missing input
missing digit/exponent/base
least or greatest optimisation
count of valid states
complete valid set
possible or impossible
unique, multiple or indeterminate
bounded range solution
claim verification
statement combination
data sufficiency
```

### State topology

```text
single constraint
multiple compatible constraints
multiple incompatible constraints
single-stage transformation
multi-stage transformation
cyclic state
range-bounded state
prime-exponent state
digit-equation state
mixed-engine state
```

### Edge states

```text
zero and one conventions
negative values where valid
exact boundary inclusion
remainder zero and divisor minus one
cycle remainder zero
leading zero
carry and borrow
co-prime and non-co-prime moduli
already-complete exponent state
one, many and no solutions
exactly versus at least
minimum valid base and invalid digit
```

### Representation

```text
plain prose
expression
number line
factor tree
prime-exponent table
divisor-pair table
Euclidean ladder
remainder/cycle table
digit-column arithmetic
place-value table
base-conversion table
statement set
data sufficiency
mini caselet
```

A representation is a new learner QL only when it changes the evidence topology or reasoning contract.

---

## 10. Shared exact-engine contract

Both packages use a common exact-number-theory library.

Required primitives:

```text
bigint guards
reduced rational arithmetic
gcd and lcm
extended gcd
bounded prime generation and primality
constructed prime factorisation
prime-exponent maps
divisor enumeration and divisor functions
mathematical modulo
modular multiplication and power
linear congruence solving
bounded CRT
place-value and digit arithmetic
recurring-decimal reconstruction
factorial valuations
perfect-power exponent completion
base conversion and validation
bounded exact enumeration
```

Rules:

- no floating-point decision authority;
- no zero divisor or modulus;
- every rational reduced;
- every remainder normalised to the declared convention;
- every base digit validated;
- no unsafe `bigint` to `number` conversion;
- bounded generation domains recorded in reviewer evidence;
- canonical solver and verifier must be materially separate.

---

## 11. Difficulty model

Difficulty derives from live reasoning dimensions:

- number of independent constraints;
- direct versus inverse direction;
- visible versus hidden prime structure;
- factorisation burden;
- cycle or congruence topology;
- candidate-domain size;
- stage count;
- representation switching;
- uniqueness proof burden;
- cross-engine coupling;
- distractor closeness.

The review bands are:

```text
CORE_EXAM_PATTERN
UPPER_EXAM_PRACTICE
ADVANCED_ENRICHMENT
```

No band receives a quota before executable evidence.

---

## 12. Explanation design

Every generated explanation must contain:

1. **Core Concept** — exact invariant in plain language;
2. **Given Data and Strategy** — translation of the live question;
3. **Complete Step-by-Step Solution** — value-specific arithmetic;
4. **Exam Speed Method** — only when valid for that state;
5. **Common Traps** — tied to actual displayed wrong options;
6. **Final Answer** — direct semantic conclusion.

Shared explanation evidence must expose prime exponents, candidate sets, divisor conditions, cycle positions, carry/borrow states or base expansion as appropriate. Generic filler and random-nearby-number distractors are prohibited.

---

## 13. Localisation design

English is the mathematical/editorial authority. Hindi and Punjabi are generated from structured state, not by paragraph translation.

Every locale release must preserve:

- exact hidden state;
- answer and option index;
- MathJax tokens;
- numeral/base symbols;
- reasoning structure;
- option-specific misconception mapping.

Local wording must be natural for SSC, banking and Punjab state exams. Needlessly technical Punjabi or Hindi vocabulary is rejected even when literally correct.

---

## 14. Lifecycle gates

The release sequence is:

```text
complete design
→ source-backed executable discovery
→ CP merge/split proposal
→ explicit count approval
→ permanent QL allocation
→ English runtime and editorial freeze
→ Hindi/Punjabi review and freeze
→ guarded Question Studio review routing
→ Question Bank conversion
→ mock-test eligibility
→ public publication
```

No earlier stage implies a later stage.

All current and future discovery outputs default to:

```text
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
questionStudioDiscoverable: false
publiclyPublishable: false
```

---

## 15. Dependency-aware implementation order

The implementation order is now:

```text
Completed: NUM-CP-003

Foundation chain:
1. NUM-CP-004 — Prime Structure and Factorisation
2. NUM-CP-005 — Divisors and Divisor Functions
3. NUM-CP-006 — HCF/LCM and Alignment
4. NUM-CP-007 — Division Algorithm
5. NUM-CP-008 — Congruences
6. NUM-CP-009 — Terminal Digits
7. NUM-CP-011 — Valuations and Trailing Zeroes
8. NUM-CP-012 — Perfect Powers

Independent/parallel after shared primitives:
9. NUM-CP-002 — Fractions and Decimals
10. NUM-CP-001 — Sets, Order and Parity
11. NUM-CP-010 — Digit Structure and Reconstruction
12. NUM-CP-013 — Positional Bases

Final only after component closure:
13. NUM-CP-014 — Synthesis
```

Parallel execution is allowed where dependencies do not conflict, but every branch must reserve chapter-wide QL identities from the current next-ID ledger only after explicit approval.

---

## 16. Design-completion checklist

The chapter design is complete because it now has:

- one learner-facing chapter and two runtime packages;
- fourteen explicit CP owners;
- closed high-risk cross-CP boundaries;
- source and legacy evidence rules;
- open, non-quota discovery protocol;
- shared exact-engine contract;
- canonical/verifier separation by CP;
- answer-semantic and representation policy;
- edge-state matrix;
- distractor and explanation contracts;
- localisation and lifecycle contracts;
- dependency-aware implementation order;
- machine-audited design registry;
- one approved permanent checkpoint with a continuous next-ID ledger.

Current truth:

```text
Design architecture: complete
CP ownership hypotheses: complete
Executable checkpoints approved: 1 of 14
Permanent QLs: 17
Next available QL: NUM-QL-018
Remaining CP counts: deliberately open
Question Studio/public exposure: 0
```

The next valid implementation action is `NUM-CP-004` open executable discovery. No QL or solve-mode count is to be chosen before its gap and ownership audits close.
