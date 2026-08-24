# SRI Merge / Split Closure — R1

**Purpose:** compress executable discovery prototypes into materially distinct learner-task contracts before any permanent QL proposal.  
**Input corpus:** 93 provisional executable families after Source Saturation R1 additions.  
**Status:** PROVISIONAL_COMPRESSION_PROPOSAL — not a freeze and not permanent allocation.

## Compression rule

Merge when differences are only sign, operator choice, root index, equivalent representation, object family, target surface, or a strict special case of a broader executable topology. Retain separately when the mathematical law/topology, inverse direction, domain proof, answer semantic, verification path or misconception profile materially changes.

## SRI-001 — Indices, Exponents & Power Structure

### CP-001

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C001-A + C001-B | MERGE | same-base exponent combination with product/quotient operator |
| C001-C | KEEP | power raised to a power |
| C001-D | KEEP | multi-law product/quotient compression |
| C001-E | KEEP | zero exponent with non-zero base |
| C001-F + C001-G | MERGE | same-exponent different-base combination with product/quotient operator |
| C001-H | KEEP | equivalent-expression selection using index laws |

**R1 retained CP-001 contracts: 6**

### CP-002

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C002-A | KEEP | negative integer exponent / reciprocal normalization |
| C002-B | KEEP | signed exponent combination |
| C002-C + C002-D + C002-E | MERGE | signed fractional exponent on exact integer perfect-power base |
| C002-F + C002-G + C002-H | MERGE | signed fractional exponent on exact rational/terminating-decimal base |
| C002-I | KEEP | zero-base undefined edge conditions |
| C002-J + C002-K | MERGE | negative-base rational exponent with denominator-parity domain proof |

`C002-H` is a representation overlay, not a permanent solve-mode reason by itself. Exact terminating-decimal surfaces belong in the rational-base object pool.

**R1 retained CP-002 contracts: 6**

### CP-003

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C003-A + C003-C | MERGE | rewrite composite/reciprocal expressions to a common base |
| C003-B + C003-E | MERGE | simplify after base harmonisation, including mixed signed/fractional exponents |
| C003-D | MERGE_CROSS_CP | same-exponent combination belongs to CP-001 retained same-exponent authority |
| C003-F | KEEP | equivalence decision after power normalization |

**R1 retained CP-003 contracts: 3**

### CP-004

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C004-A + C004-B + C004-C | MERGE | transform a supplied `a^x` value to an affine exponent target `a^(mx+k)` |
| C004-D | KEEP | combine two supplied power relations into one target |
| C004-E + C004-F | MERGE | recover a parameter from a transformed power relation |
| C004-G | KEEP | recover parameter then evaluate a secondary target |

**R1 retained CP-004 contracts: 4**

### CP-005

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C005-A + C005-B | MERGE | same-base linear exponent equation |
| C005-C + C005-I | MERGE | normalize common/reciprocal bases then solve exponent equation |
| C005-D + C005-E | MERGE | factor common exponential term in a sum/difference equation |
| C005-F | KEEP | quadratic in `a^x` substitution |
| C005-G | KEEP | chained equal-power relation |
| C005-H | KEEP | solve exponent then evaluate a derived target |

**R1 retained CP-005 contracts: 6**

### CP-006

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C006-A + C006-C + C006-D + C006-G | MERGE | exact two-quantity power comparison after normalization |
| C006-B | KEEP | order three or more powers |
| C006-E | KEEP | single index-law statement correctness |
| C006-F | KEEP | two-statement truth-set classification |

**R1 retained CP-006 contracts: 4**

### SRI-001 compression subtotal

48 executable prototypes → **29 retained R1 solve contracts**.

---

## SRI-002 — Surds, Radicals & Rationalisation

### CP-007

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C007-A + C007-B + C007-C | MERGE | simplify supported nth root by extracting perfect nth powers |
| C007-D | KEEP | classify a radical as rational or surd across supported root indices |
| C007-E | KEEP | classify the result of exact radical arithmetic |
| C007-F | KEEP | radical ↔ fractional-index representation conversion |

**R1 retained CP-007 contracts: 4**

### CP-008

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C008-A + C008-B | MERGE | simplify if needed, then combine like surds |
| C008-C + C008-D | MERGE | exact product/quotient of supported surds |
| C008-E + C008-G | MERGE | multiply surd binomials/finite sums, including square as a special case |
| C008-F | KEEP | conjugate product / difference-of-squares identity |
| C008-H | KEEP | rational/irrational result after exact surd arithmetic |
| C008-I | KEEP_SOURCE_GATED | derive condition for exceptional root-sum identity |

**R1 retained CP-008 contracts: 6** (1 remains source-gated)

### CP-009

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C009-A + C009-B | MERGE | rationalise a supported monomial radical denominator across root indices |
| C009-C + C009-D + C009-E | MERGE | rationalise a two-term quadratic-surd denominator using its conjugate |
| C009-F | KEEP | combine multiple rationalised terms to canonical surd form |
| C009-G + C009-H | MERGE | recover canonical coefficients and optionally evaluate a derived target |
| C009-I | MERGE_CROSS_CP | reciprocal/conjugate transformed value moves into CP-011-F authority |

**R1 retained CP-009 contracts: 4**

### CP-010

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C010-A + C010-B | MERGE | denest `√(A±2√B)` with sign as state |
| C010-C | KEEP | decide exact denestability |
| C010-D + C010-E | MERGE | inverse denesting / recover hidden nested or denested parameters |
| C010-F | KEEP_SOURCE_GATED | repeating infinite-radical fixed point |

**R1 retained CP-010 contracts: 4** (1 remains source-gated)

### CP-011

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C011-A + C011-B | MERGE | compare coefficient-bearing same-index square surds exactly |
| C011-C | KEEP | compare radicals of different indices via a common exact power |
| C011-D + C011-E | MERGE | exact integer/range bounds for positive irrational radicals, including scaling |
| C011-F + C009-I | MERGE_CROSS_CP | conjugate/reciprocal transformed surd values |
| C011-G | KEEP | solve a bounded radical equation with original-domain verification |
| C011-H | KEEP | identify/reject an extraneous radical-equation candidate after squaring |
| C011-I | KEEP | statement truth-set using exact surd comparison/bounds |
| C011-J | KEEP | compare positive finite surd sums exactly by squaring |

**R1 retained CP-011 contracts: 8**

### CP-012

| Prototype(s) | R1 disposition | Retained contract |
|---|---|---|
| C012-A + C012-B | MERGE | bidirectional mixed radical/index simplification |
| C012-C | KEEP | compare/equate radical and index representations |
| C012-D | KEEP | solve a short mixed radical-index equation |
| C012-E | KEEP | transformed target requiring both surd and index steps |

**R1 retained CP-012 contracts: 4**

### SRI-002 compression subtotal

45 executable prototypes → **30 retained R1 solve contracts**, including two source-gated contracts.

---

## Chapter R1 compression result

- Executable provisional prototypes: **93**
- R1 retained solve contracts before source-gate resolution: **59**
- Source-gated retained contracts: **2** (`C008-I`, `C010-F`)
- Non-source-gated retained contracts if both gates remain unresolved: **57**

These are **not permanent QL counts**. One retained solve contract may still need multiple question-language families if natural exam language cannot be parameterized without semantic distortion, and a retained contract may still be removed after cross-chapter collision or English review.

## Cross-chapter ownership decisions

- simultaneous `√x±√y` systems → **Algebra**
- long `x+1/x` recurrence/high-power identity chains → **Algebra**
- deep procedural nested-root/BODMAS evaluation → **Simplification & Approximation**
- last-digit/cyclic power/remainder patterns → **Number System**
- statement sufficiency wrappers → **Data Sufficiency**
- geometric measurements that merely end in surd form → **Geometry/Mensuration/Trigonometry** by tested burden

## Required next closure

1. prove the 93-family chapter-wide saturation gate green;
2. create executable retained-contract authority rather than deleting discovery evidence;
3. run cross-chapter collision checks on the 59-contract proposal;
4. resolve the two source gates;
5. run representative English review;
6. only then propose permanent solve-mode / QL IDs.

**Freeze remains prohibited.**
