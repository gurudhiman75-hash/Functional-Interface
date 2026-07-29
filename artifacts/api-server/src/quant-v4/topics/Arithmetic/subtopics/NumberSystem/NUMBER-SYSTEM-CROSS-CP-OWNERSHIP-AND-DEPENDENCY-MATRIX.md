# Number System — Cross-CP Ownership and Dependency Matrix

**Scope:** `NUM-CP-001..NUM-CP-014`  
**Purpose:** prevent duplicate learner contracts and make implementation dependencies explicit  
**Counts:** no unfrozen CP count is prescribed by this matrix

---

## 1. Ownership decision rule

For every candidate question, assign ownership in this order:

1. identify the requested answer semantic;
2. identify the invariant that makes the answer possible;
3. remove story and cosmetic representation;
4. test whether one authority alone solves the item;
5. treat secondary properties as filters unless they are independently necessary;
6. assign CP-014 only after an ablation test proves two or more essential engines;
7. reassign to another chapter when counting, simplification, algebra, rate, probability or reasoning is the real inference.

---

## 2. Final boundary matrix

| Candidate family | Primary owner | Supporting validator | Reassign/hold rule |
|---|---|---|---|
| number-set classification | CP-001 | exact rational classifier | Algebra if general equation determines type |
| signed order/number line | CP-001 | rational comparator | CP-002 if recurring representation is central |
| fraction/decimal comparison | CP-002 | exact rational arithmetic | Simplification if long expression evaluation is central |
| decimal termination | CP-002 | prime factorisation | none |
| direct divisibility | CP-003 | exact division | none |
| missing digit for divisibility | CP-003 | digit enumeration | CP-010 if arithmetic/carry alone governs |
| divisibility of modular powers | CP-008 | CP-003 rule validator | Algebra hold for pure identity target |
| prime/composite/factorisation | CP-004 | divisibility/primality | CP-005/006/012 when their output is target |
| divisor count/sum/product | CP-005 | CP-004 factorisation | CP-012 only when completion of original number is target |
| square/cube divisor count | CP-005 | perfect-power predicate | not CP-012 because answer is divisor-set count |
| HCF/LCM direct/inverse | CP-006 | CP-004 factorisation | none |
| same-remainder greatest divisor | CP-006 | CP-007 division lemma | no duplicate CP-007 QL |
| minimum addition/subtraction for divisibility | CP-007 | modulo primitive | CP-003 only for its frozen digit-bound multiple template |
| one-stage quotient/divisor/remainder | CP-007 | exact arithmetic | CP-008 if several independent moduli |
| simultaneous congruences | CP-008 | gcd/LCM/CRT | CP-006 only if reducible to ordinary common multiple |
| power remainder | CP-008 | modular power | CP-009 when requested output is terminal digit(s) |
| unit/last two/last three digits | CP-009 | modular arithmetic | none |
| digit reversal/interchange | CP-010 | place-value algebra | Algebra if digit structure is incidental |
| carry/borrow digit reconstruction | CP-010 | direct column arithmetic | reject decorative divisibility hybrid |
| formed-number count | P&C | Number System validator | Number System never owns arrangement count |
| factorial trailing zeroes/highest power | CP-011 | CP-004 factorisation | P&C if factorial is arrangement count |
| last non-zero digit | CP-009 or CP-011 | both may support | CP-014 only when valuation and terminal cycle are both essential |
| perfect-square/cube completion | CP-012 | CP-004 factorisation | CP-005 if divisor count is final target |
| base conversion/validity/arithmetic | CP-013 | digit/modular validators | CP-010 only for ordinary decimal digits |
| essential mixed inverse | CP-014 | component authorities | reject/reassign when second engine is decorative |
| divisible by either/neither/exactly one | provisional CP-006/shared counting | LCM/divisibility | Set Theory/P&C if inclusion-exclusion is main inference |
| algebraic power factor identity | ownership hold | CP-008/Algebra | source and pedagogy decide |
| Euler/Fermat/Wilson/totient | advanced hold | CP-004/008 | no routine QL without source saturation |
| Roman numerals | Fundamentals hold | none | not Number System unless recurring demand appears |

---

## 3. Intra-chapter collision tests

### CP-001 versus CP-002

```text
Exact order of already represented numbers → CP-001
Representation conversion/recurrence needed to compare → CP-002
```

### CP-003 versus CP-007

```text
Digit structure enforces divisibility → CP-003
Division identity/remainder determines adjustment or missing variable → CP-007
```

### CP-003 versus CP-010

```text
Complete admissible digit domain under divisibility → CP-003
Column arithmetic/place-value equation governs digit → CP-010
Arithmetic leaves candidates and divisibility materially filters → CP-003 or CP-014 after necessity test
```

### CP-004 versus CP-005

```text
Prime decomposition itself is answer/evidence target → CP-004
Function of the divisor set is answer → CP-005
```

### CP-005 versus CP-012

```text
Count/sum/product of divisors with square/cube restriction → CP-005
Change original integer into perfect power → CP-012
```

### CP-006 versus CP-007

```text
Greatest common divisor/least common multiple across numbers or adjusted differences → CP-006
One division state or direct remainder adjustment → CP-007
```

### CP-006 versus CP-008

```text
Ordinary common multiple/alignment or simple same-remainder reduction → CP-006
Independent residues, compatibility or modular equation → CP-008
```

### CP-008 versus CP-009

```text
Requested remainder/residue class → CP-008
Requested unit/last-two/last-three digit string → CP-009
```

### CP-009 versus CP-011

```text
Terminal periodicity after exponent/product structure → CP-009
Prime-pair valuation/trailing-zero or highest-power target → CP-011
Both essential → CP-014 candidate with ablation proof
```

### CP-010 versus CP-013

```text
Decimal digit equation → CP-010
Stated base is essential to value/validity/arithmetic → CP-013
```

---

## 4. Cross-chapter boundaries

| Other chapter | Number System retains | Other chapter retains |
|---|---|---|
| Simplification | rational representation, termination and exact comparison | long arithmetic/BODMAS expression evaluation |
| Algebra | integer/digit/factor/remainder structure | general equations and identities without number-theory invariant |
| Surds & Indices | modular/terminal/perfect-power number properties | generic exponent and surd manipulation |
| P&C | property validator and hidden-number reconstruction | counting arrangements, selections or formed numbers |
| Probability | divisibility/digit validator | probability/sample-space calculation |
| Set Theory | integer range and common-multiple property | general set counting/inclusion-exclusion when set logic is central |
| Time & Work | LCM-only event coincidence | productivity schedules and completion time |
| Time, Speed & Distance | LCM-only departure coincidence | movement, relative speed and travel schedules |
| Mensuration | common exact measure as pure HCF | area, volume, tiling geometry or dimensional reasoning |
| Reasoning | mathematical numeral value | coded numbers, symbol substitution and operation puzzles |
| Number Series | none | pattern continuation and missing term |

---

## 5. Dependency matrix

`R` means required implementation dependency. `V` means reusable validator only. `—` means no dependency.

| CP | 003 | 004 | 005 | 006 | 007 | 008 | 009 | 010 | 011 | 012 | 013 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CP-001 | V | — | — | — | — | — | — | — | — | — | — |
| CP-002 | — | V | — | — | — | — | — | — | — | — | — |
| CP-003 | — | — | — | — | — | — | — | — | — | — | — |
| CP-004 | V | — | — | — | — | — | — | — | — | — | — |
| CP-005 | V | R | — | — | — | — | — | — | — | V | — |
| CP-006 | V | R | V | — | V | — | — | — | — | — | — |
| CP-007 | V | — | — | V | — | — | — | — | — | — | — |
| CP-008 | V | V | — | V | R | — | V | — | — | — | — |
| CP-009 | V | — | — | — | V | R | — | — | V | — | — |
| CP-010 | V | — | — | — | V | V | — | — | — | — | V |
| CP-011 | — | R | V | — | — | V | V | — | — | — | — |
| CP-012 | V | R | V | — | — | — | — | — | V | — | — |
| CP-013 | V | — | — | — | V | V | V | V | — | — | — |
| CP-014 | V | R | R | R | R | R | R | R | R | R | R |

CP-014 does not require every component for every question, but it may only combine component authorities already proven for that cluster.

---

## 6. Implementation lanes

### Lane A — factor structure

```text
CP-004 → CP-005 → CP-006
             └──→ CP-012
CP-004 → CP-011
```

### Lane B — remainder and cycles

```text
CP-007 → CP-008 → CP-009
```

### Lane C — independent exact representations

```text
CP-001
CP-002
CP-010
CP-013
```

These can run in parallel once shared primitives and chapter-wide ID coordination are stable.

### Lane D — synthesis

```text
CP-014 only after participating lanes are stable
```

---

## 7. CP-014 necessity-ablation test

For a mixed candidate with engines `A` and `B`:

1. solve with all evidence;
2. remove the evidence owned by `A` and enumerate solutions;
3. remove the evidence owned by `B` and enumerate solutions;
4. require both removals to materially change or underdetermine the answer;
5. require the combined state to have the intended unique/set/count/classification result;
6. reject CP-014 ownership if either engine is only a final check.

Reviewer evidence must include both ablations.

---

## 8. Permanent identity coordination

Current chapter ledger:

```text
Allocated: NUM-QL-001..NUM-QL-017 → NUM-CP-003
Next:      NUM-QL-018
```

Rules:

- no package-local reset;
- no reservation before count approval;
- parallel branches do not independently allocate overlapping ranges;
- allocation order follows approval order, not CP number;
- permanent IDs remain immutable after merge;
- later discoveries receive new IDs and explicit ancestry records.

---

## 9. Closure condition

The ownership matrix is considered satisfied for a CP only when:

- every source and prototype candidate has one primary owner;
- every competing owner has an explicit disposition;
- no permanent learner contract is duplicated;
- supporting validators do not silently become public QLs;
- representation-only changes are merged;
- essential mixed tasks pass ablation;
- rejected and held families remain recorded.
