# NUM-002 — Complete Checkpoint Design

**Package:** `NUM-002 — Remainders, Digits, Powers, Bases and Number-Theory Synthesis`  
**CP range:** `NUM-CP-007..NUM-CP-014`  
**Status:** complete design; executable QL and solve-mode counts deliberately open  
**First possible permanent identity:** current chapter next ID `NUM-QL-018`, allocated only after approval

---

## 1. Package purpose

`NUM-002` owns stateful or cyclic behaviour of exact integers:

- the division algorithm;
- modular transformations and congruence systems;
- terminal digit cycles;
- digit equations and number reconstruction;
- prime valuations in products and factorials;
- perfect-power exponent structure;
- positional base systems;
- essential multi-engine synthesis.

The package reuses prime factorisation, divisibility, HCF/LCM and exact rational primitives from `NUM-001` but does not duplicate their learner ownership.

---

# NUM-CP-007 — Division Algorithm and Elementary Remainder Transformation

## 2. Governing invariants

For positive divisor `d`:

```text
N = dq + r
0 ≤ r < d
```

This CP owns one-stage reconstruction and compatible propagation where no system of independent congruences is required.

## 3. Discovery families

### Direct division-lemma reconstruction

```text
remainder from dividend/divisor/quotient
dividend from divisor/quotient/remainder
divisor from dividend/quotient/remainder
quotient from dividend/divisor/remainder
validate or reject a division state
recover relation when divisor/quotient/remainder are linked
```

### Remainder propagation

```text
remainder of sum from component remainders
remainder of difference
remainder of product
remainder after scaling
remainder under a smaller divisor that divides the known divisor
compatible nested remainder
remainder of bounded polynomial from input remainder
```

### Number reconstruction

```text
number from quotient-remainder relation
quotient/divisor from algebraic relation plus dividend
same-remainder divisor candidate from differences before HCF optimisation
range-bounded dividend reconstruction
possible/impossible division state
count/set of bounded states
```

### Exact-divisibility adjustment

```text
minimum addition to next multiple
minimum subtraction to previous multiple
nearest multiple above or below
classify tie between nearest multiples
```

The already frozen CP-003 extremum n-digit multiple learner contract must not be duplicated.

## 4. Answer semantics

```text
DIVIDEND
DIVISOR
QUOTIENT
REMAINDER
INTEGER
ADDITION_AMOUNT
SUBTRACTION_AMOUNT
MULTIPLE
NUMBER_SET
COUNT
SOLUTION_CLASS
BOOLEAN_CLAIM
```

## 5. Edge states

- remainder zero;
- remainder `d-1`;
- invalid negative or `r ≥ d` ordinary remainder;
- quotient zero;
- dividend smaller than divisor;
- subtraction to previous multiple equals zero;
- exact tie between upper and lower multiple where “nearest” is ambiguous;
- several bounded states satisfy a relation;
- divisor must be positive and non-zero.

## 6. Representations

- division identity;
- long-division layout where useful;
- quotient/remainder table;
- statement set;
- data sufficiency;
- mini caselet sharing one dividend or divisor relation.

## 7. Misconceptions

- using `d-r` when subtraction rather than addition is asked;
- allowing remainder equal to divisor;
- treating quotient and divisor as interchangeable;
- propagating a remainder to an incompatible divisor;
- failing to normalise negative difference remainder;
- choosing a single inverse candidate without proving uniqueness.

## 8. Canonical and verifier routes

- canonical: direct division-lemma algebra and exact remainder rules;
- verifier: arithmetic reconstruction and bounded enumeration from rendered givens.

## 9. Ownership exclusions

- same-remainder greatest divisor → CP-006;
- multiple independent remainder constraints → CP-008;
- terminal digit target → CP-009;
- divisibility missing-digit target → CP-003.

## 10. Discovery closure gates

- every missing variable direction executed;
- valid/invalid remainder classification;
- compatible versus incompatible nested transformations;
- minimum addition/subtraction and exact-boundary states;
- direct, inverse, set/count and DS forms;
- overlap audit with CP-003, CP-006 and CP-008.

---

# NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences

## 11. Governing invariants

- mathematical modulo is the least non-negative residue unless the item explicitly introduces another representative;
- modular sum, difference and product preserve congruence;
- modular powers require exact repeated squaring or proven cycle reduction;
- `ax ≡ b (mod m)` has solutions according to `gcd(a,m) | b`;
- simultaneous systems may be compatible, incompatible, unique modulo LCM or have several bounded representatives.

## 12. Discovery families

### Modular operations

```text
normalise positive/negative residue
modular sum/difference/product
large expression remainder
power remainder by repeated squaring
structured or geometric sum remainder
nested expression remainder
claim verification
```

### Linear congruences

```text
single solution class
multiple solution classes
no solution
least positive representative
greatest bounded representative
count representatives in interval
missing coefficient/modulus/residue under bounded state
```

### Simultaneous congruences

```text
combine two compatible congruences
combine several compatible congruences
classify compatible/incompatible
least positive solution
greatest solution below bound
count solutions in interval
same remainder across several moduli
specified different remainders
reconstruct number from system plus range
verify candidate against all constraints
```

### Repeated numeral and recurrence tasks

```text
least repunit length divisible by m under bounded source-backed domain
remainder recurrence for repeated blocks
structured concatenation remainder
```

### Advanced hold

```text
abstract modular inverse
large general CRT
Fermat/Euler reduction
Wilson-style remainder
```

## 13. Answer semantics

```text
REMAINDER
RESIDUE_CLASS
INTEGER
LEAST_POSITIVE_SOLUTION
GREATEST_BOUNDED_SOLUTION
COUNT
MODULUS
COEFFICIENT
SOLUTION_CLASS
BOOLEAN_CLAIM
SUFFICIENCY_CLASS
```

## 14. Edge states

- negative residue;
- zero residue;
- non-coprime moduli;
- compatible non-coprime system;
- incompatible system;
- linear congruence with several classes;
- no representative within bound;
- exponent zero;
- modulus one if source permits, normally excluded from learner generation;
- cycle boundary at remainder zero.

## 15. Representations

- congruence notation;
- remainder table;
- residue-class table;
- bounded number line of representatives;
- statement combination;
- data sufficiency;
- candidate-verification table;
- mini caselet only when one system supports several materially distinct questions.

## 16. Misconceptions

- leaving a negative residue unnormalised;
- assuming every linear congruence has one solution;
- multiplying moduli without checking compatibility/coprimality;
- selecting the first positive candidate without proving least;
- forgetting periodic representatives inside a range;
- reducing exponent modulo an invalid cycle/theorem condition;
- satisfying only one congruence.

## 17. Canonical and verifier routes

- canonical: modular arithmetic, gcd solvability, constructive bounded CRT;
- verifier: direct bounded enumeration of residues and candidates.

## 18. Ownership exclusions

- one-stage division state → CP-007;
- final unit/last-two/last-three digits → CP-009;
- direct algebraic identity without modular target → Algebra or advanced ownership hold;
- common-event LCM task → CP-006.

## 19. Discovery closure gates

- negative and zero residue handling;
- linear congruence one/many/no-solution states;
- compatible/incompatible non-coprime systems;
- least/greatest/count/set bounded projections;
- power and structured-sum remainder source saturation;
- advanced-theorem disposition;
- CP-007/009 overlap audit;
- complete merge/split proposal.

---

# NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits

## 20. Governing invariants

- terminal digits are residues modulo `10`, `100` or `1000`;
- unit-digit powers follow base-dependent cycles;
- an exponent congruent to zero modulo cycle length maps to the final cycle member;
- products/sums require modular composition after each component is resolved;
- leading zeroes must be preserved for last-two/last-three-digit answer semantics.

## 21. Discovery families

### Unit digit

```text
single power
product of powers
sum/difference of powers
nested exponent
power tower
factorial/structured exponent
terminal digit of repeated or geometric expression
```

### Last two and three digits

```text
single power
sum/product/expression
structured repeated block
Chinese-remainder decomposition when pedagogically useful
leading-zero formatted result
```

### Inverse cycle tasks

```text
cycle length
cycle position from huge exponent
missing exponent residue class
count exponents in interval producing target digit
possible/impossible terminal digit
recover bounded exponent from terminal evidence
```

### Last non-zero digit

```text
bounded product after removing factors ten
simple factorial/product advanced candidate
```

### Claim and representation

```text
compare terminal-digit claims
select correct/incorrect statement
data sufficiency for exponent class
cycle table interpretation
```

## 22. Answer semantics

```text
UNIT_DIGIT
LAST_TWO_DIGITS
LAST_THREE_DIGITS
EXPONENT_CLASS
EXPONENT
COUNT
CYCLE_LENGTH
BOOLEAN_CLAIM
SUFFICIENCY_CLASS
```

## 23. Edge states

- exponent zero;
- base ending in zero, one, five or six;
- exponent multiple of cycle length;
- negative difference requiring residue normalisation;
- answer `00`, `004` or other leading-zero terminal string;
- product contains factors two and five creating zeroes;
- no exponent in bounded interval;
- several exponent residue classes for composite terminal condition.

## 24. Representations

- cycle table;
- residue ladder;
- terminal-digit column;
- statement/data sufficiency;
- bounded exponent table;
- mini caselet sharing one expression only when answer targets differ materially.

## 25. Misconceptions

- mapping cycle remainder zero to first entry;
- using exponent itself rather than exponent modulo cycle length;
- using only last digit when last two/three are asked;
- dropping leading zeroes;
- combining component cycles before resolving each residue;
- treating last non-zero digit as ordinary last digit.

## 26. Canonical and verifier routes

- canonical: cycle classification and modular composition;
- verifier: exact modular exponentiation/repeated squaring.

## 27. Ownership exclusions

- general remainder not terminal digit → CP-008;
- pure exponent manipulation → Surds & Indices;
- factorial valuation/trailing zero count → CP-011.

## 28. Discovery closure gates

- all base-ending cycle families;
- unit/last-two/last-three semantics separated;
- direct/inverse/count/range tasks;
- zero-cycle and leading-zero boundaries;
- last non-zero digit source disposition;
- proof that representations do not over-split;
- CP-008/011 overlap audit.

---

# NUM-CP-010 — Digit Structure, Place Value and Number Reconstruction

## 29. Governing invariants

- positional decimal expansion;
- face value versus place value;
- digit sum and digital root;
- algebraic value of reversal/interchange;
- exact column addition/subtraction/multiplication with carry or borrow;
- leading digit cannot be zero unless the object is explicitly a fixed-width string;
- number reconstruction requires complete candidate-domain proof.

## 30. Discovery families

### Place value and digit aggregates

```text
face/place value
expanded form
digit sum
digital root/repeated digital sum
modulo-nine interpretation
number of digits of explicit exact integer
bounded concatenated-sequence digit count
```

### Two- and three-digit reconstruction

```text
number from digit sum and place relation
two-digit number from reversal relation
three-or-more-digit number from digit equations
original number after interchange
sum/difference with reverse
palindrome under constraint
nearest bounded palindrome
```

### Column arithmetic

```text
missing digit in addition
missing digit in subtraction
missing digit in multiplication
recover carry digit
recover borrow digit
complete column state
classify unique/multiple/impossible arithmetic digit state
```

### Mixed digit constraints

```text
leading/trailing digit plus value relation
number from digit sum and divisibility where both materially constrain
bounded complete candidate set
least/greatest valid number
claim verification
data sufficiency
```

### Bounded occurrence and range tasks

```text
digit occurrence count in small bounded range
sum of digits across bounded range advanced hold
```

## 31. Answer semantics

```text
PLACE_VALUE
DIGIT
DIGIT_SUM
DIGITAL_ROOT
NUMBER_OF_DIGITS
INTEGER
NUMBER_SET
COUNT
CARRY
BORROW
SOLUTION_CLASS
BOOLEAN_CLAIM
SUFFICIENCY_CLASS
```

## 32. Edge states

- leading zero;
- repeated digits;
- carry into new most-significant place;
- borrow chain across zeros;
- palindrome unchanged by reverse;
- digit sum zero only for zero;
- multiple numbers share same digit sum;
- arithmetic alone fixes digit, making extra divisibility decorative;
- fixed-width strings versus integers.

## 33. Representations

- place-value table;
- vertical column arithmetic;
- digit boxes;
- reversal diagram;
- candidate table;
- statement/data sufficiency;
- mini caselet built from one hidden number.

## 34. Misconceptions

- confusing face and place value;
- allowing leading zero;
- reversing positional weights incorrectly;
- ignoring carry or borrow;
- assuming digit sum uniquely identifies a number;
- treating digital root as ordinary digit sum;
- counting digit arrangements rather than reconstructing the declared number.

## 35. Canonical and verifier routes

- canonical: positional equations and column-state propagation;
- verifier: string/digit reconstruction and direct arithmetic over all admissible candidates.

## 36. Ownership exclusions

- divisibility-only missing digit → CP-003;
- count numbers formed from available digits → P&C;
- general simultaneous linear equation without digit structure → Algebra;
- base-`b` digit equation → CP-013;
- essential multi-engine hidden-number synthesis → CP-014.

## 37. Discovery closure gates

- place/digit aggregate direct and inverse coverage;
- two-, three- and multi-digit reconstruction;
- carry and borrow chains;
- palindrome source demand;
- one/many/no-solution enumeration;
- P&C and CP-003 boundary audit;
- bounded occurrence advanced disposition;
- merge/split proposal.

---

# NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes

## 38. Governing invariants

- prime valuation is additive across products and subtractive across exact ratios;
- Legendre-style factorial valuation `v_p(n!) = floor(n/p)+floor(n/p²)+...`;
- highest composite power divides according to minimum valuation ratio across its prime factors;
- trailing zeroes in base `b` are limited by balanced prime factors of `b`;
- inverse valuation and zero-count tasks require monotonic bounded search and possible/impossible classification.

## 39. Discovery families

### Direct valuations

```text
prime valuation in explicit product
prime valuation in factorial
prime valuation in factorial ratio
highest prime power dividing product/factorial
highest composite power dividing product/factorial
factorial divisibility
least factorial containing declared factor
```

### Trailing zeroes

```text
factorial base ten
explicit product
factorial ratio
general base
product of powers
expression with minimum valuation across terms when valid
```

### Inverse valuation

```text
least n with at least z zeroes
least n with exact prime valuation
count/set of n producing exact zero count in bounded interval
possible/impossible trailing-zero count
recover missing product exponent
```

### Advanced hold

```text
last non-zero digit of factorial
valuation of binomial coefficient
large factorial remainder
```

## 40. Answer semantics

```text
PRIME_VALUATION
HIGHEST_POWER
TRAILING_ZERO_COUNT
INTEGER
NUMBER_SET
COUNT
SOLUTION_CLASS
BOOLEAN_CLAIM
SUFFICIENCY_CLASS
```

## 41. Edge states

- `0! = 1` and `1! = 1`;
- declared prime greater than `n` gives valuation zero;
- composite base with repeated prime exponents;
- factors two not automatically abundant in non-decimal base;
- exact zero count may correspond to five consecutive `n` values in base ten or none;
- factorial ratio must be integral where required;
- highest power zero versus no positive power.

## 42. Representations

- prime-valuation table;
- factorial division ladder;
- base-factor balance table;
- monotonic inverse-search table;
- statement/data sufficiency;
- mini caselet sharing one factorial/product.

## 43. Misconceptions

- counting factors ten directly;
- counting only powers of five in every base;
- forgetting repeated prime powers in Legendre sum;
- adding instead of taking minimum valuation ratio for composite power;
- assuming every zero count is possible;
- confusing “at least” with “exactly”.

## 44. Canonical and verifier routes

- canonical: valuation formulas and monotonic inverse search;
- verifier: explicit bounded factor accumulation/product division.

## 45. Ownership exclusions

- factorial as arrangements → P&C;
- terminal digit after removing zeroes → CP-009 unless valuation remains essential enough for CP-014;
- generic exponent simplification → Surds & Indices.

## 46. Discovery closure gates

- direct product/factorial/ratio valuations;
- prime and composite highest-power tasks;
- base-ten and general-base zeroes;
- exact/at-least/possible inverse semantics;
- P&C and CP-009 boundary audits;
- advanced family source disposition;
- complete merge/split proposal.

---

# NUM-CP-012 — Perfect Squares, Cubes and General Perfect Powers

## 47. Governing invariants

An integer is a perfect `k`th power when every prime exponent is divisible by `k`. Completion and reduction operate on exponent residues modulo `k`.

## 48. Discovery families

### Recognition and roots

```text
identify perfect square/cube/general k-th power
exact integer square/cube root
verify factorisation claim
trailing-digit compatibility as quick rejection only
```

### Range and boundary

```text
count squares/cubes in interval
nearest square/cube
least/greatest perfect power under bound
consecutive perfect-power boundary
possible/impossible terminal pattern
```

### Multiplicative completion

```text
least multiplier for square/cube/k-th power
least divisor
missing prime exponent
least perfect-power multiple
greatest perfect-power divisor
number whose product with another is perfect power
```

### Additive completion

```text
least addition to next square/cube
least subtraction to previous square/cube
nearest perfect power with tie policy
```

### Cross-evidence candidates

```text
perfect power from divisor pattern
square/cube divisor count bridge
claim verification
data sufficiency
```

The final owner depends on requested semantic; count of square divisors remains CP-005.

## 49. Answer semantics

```text
BOOLEAN_CLAIM
ROOT
COUNT
INTEGER
MULTIPLIER
DIVISOR
PRIME_EXPONENT
PERFECT_POWER_CLASS
SOLUTION_CLASS
SUFFICIENCY_CLASS
```

## 50. Edge states

- zero and one as perfect powers under declared exponent convention;
- negative cube versus negative square;
- number already complete, giving multiplier/divisor one or addition zero;
- exponent residue zero;
- no integer root;
- equal distance between adjacent perfect powers;
- divisor completion must remain integer;
- general `k` bounded to exam-realistic values.

## 51. Representations

- factorisation/exponent table;
- number-line square/cube boundary;
- completion grid;
- statement/data sufficiency;
- bounded candidate table.

## 52. Misconceptions

- making all exponents equal rather than divisible by `k`;
- multiplying by the existing residue rather than its complement;
- confusing multiplier and divisor completion;
- using decimal root approximation as authority;
- assuming terminal-digit compatibility proves perfect square/cube;
- returning zero multiplier when number is already perfect.

## 53. Canonical and verifier routes

- canonical: exponent-residue completion and exact integer root;
- verifier: direct power/root multiplication and bounded candidate search.

## 54. Ownership exclusions

- square/cube divisor count → CP-005;
- surd simplification → Surds & Indices;
- area/volume square/cube context → Mensuration;
- algebraic square identities → Algebra.

## 55. Discovery closure gates

- recognition, roots, range, multiplicative and additive directions;
- square/cube parameter merge tested without forced over-merge;
- zero/one/negative conventions;
- inverse one/many/no-solution states;
- CP-005 ownership boundary;
- general-power source disposition;
- merge/split proposal.

---

# NUM-CP-013 — Positional Bases and Numeral Conversion

## 56. Governing invariants

For numeral `(d_k...d_0)_b`:

```text
value = Σ d_i b^i
0 ≤ d_i < b
b ≥ 2
```

Decimal-to-base conversion uses repeated division; fractional terminating conversion, when retained, uses repeated multiplication under bounded exact rational states.

## 57. Discovery families

### Conversion

```text
base b to decimal
decimal integer to base b
between non-decimal bases
binary/octal/hex grouping
compare numerals across bases
```

### Validity and place value

```text
validate numeral for base
minimum possible base
place value in base b
number of digits in base b
largest/smallest n-digit numeral in base b
```

### Unknown digit/base

```text
unknown digit in numeral equality
unknown base from decimal equality
unknown base from arithmetic statement
count/set of valid bases under bounded range
possible/impossible base state
```

### Arithmetic in a base

```text
addition
subtraction
multiplication
carry/borrow in base b
remainder/divisibility in base b
terminal digits in stated base
```

### Advanced hold

```text
fractional terminating conversion
recurring fractional base expansion
large symbolic base equations
```

## 58. Answer semantics

```text
DECIMAL_INTEGER
BASE_NUMERAL
BASE
DIGIT
PLACE_VALUE
NUMBER_OF_DIGITS
COUNT
BASE_SET
SOLUTION_CLASS
BOOLEAN_CLAIM
SUFFICIENCY_CLASS
```

## 59. Edge states

- minimum base exactly one greater than largest digit;
- digit invalid for base;
- leading zero;
- hexadecimal `A–F` mapping;
- zero value;
- carry into new digit;
- multiple bases satisfy equation;
- no integer base satisfies state;
- leading zeroes in terminal-base answer;
- base one prohibited.

## 60. Representations

- positional expansion table;
- repeated-division ladder;
- repeated-multiplication table for advanced fractional conversion;
- column arithmetic in base;
- digit/base candidate table;
- statement/data sufficiency.

## 61. Misconceptions

- reading numeral as decimal digits;
- allowing a digit equal to or above base;
- using base equal to largest digit;
- reading conversion remainders in forward order;
- applying decimal carry rules in another base;
- mixing displayed numeral and decimal value;
- assuming unknown-base equation has one solution without bounded proof.

## 62. Canonical and verifier routes

- canonical: positional expansion and repeated division/multiplication;
- verifier: independent reconstruction back to decimal and digit validity checks.

## 63. Ownership exclusions

- coded number/symbol substitution → Reasoning;
- ordinary decimal digit equation → CP-010;
- pure binary logic/computer-science operations outside exam arithmetic → exclude;
- terminal decimal digits of powers → CP-009 unless stated base is essential.

## 64. Discovery closure gates

- conversion directions and grouping methods;
- validity/minimum-base tasks;
- unknown digit/base one/many/no-solution states;
- arithmetic with carry/borrow;
- hexadecimal terminology consistency;
- advanced fractional-base disposition;
- CP-010/009 boundary audit;
- merge/split proposal.

---

# NUM-CP-014 — Mixed Inverse, Optimisation and Number-Theory Synthesis

## 65. Admission test

A candidate enters CP-014 only when:

1. at least two established Number System authorities are independently necessary;
2. removing either authority makes the answer underdetermined or changes the task;
3. the solution cannot be taught honestly as one earlier CP with a small parameter check;
4. bounded exact generation and independent search prove uniqueness or intended solution class;
5. the combined misconception space is materially distinct.

Hardness alone is not admission.

## 66. Candidate synthesis clusters

```text
divisibility + digit reconstruction
remainder system + digit sum/range
HCF/LCM + prime structure
divisor count + perfect-power structure
valuation + terminal non-zero digit
base validity + divisibility/remainder
cycle class + hidden exponent factor evidence
factorisation + bounded optimisation
mixed hidden number/divisor/exponent reconstruction
```

Each cluster remains a discovery hypothesis, not a guaranteed QL.

## 67. Task directions

```text
least/greatest valid number
least multiplier/divisor
hidden number reconstruction
hidden divisor reconstruction
hidden exponent reconstruction
count/set of complete solutions
unique/multiple/impossible/indeterminate classification
claim verification across constraint clusters
data sufficiency
statement combination
mini table/caselet
```

## 68. Answer semantics

Any established Number System semantic may appear, but the registry must identify:

- primary target semantic;
- participating authorities;
- necessity proof for each authority;
- bounded candidate domain;
- uniqueness or solution-class evidence.

## 69. Edge states

- one constraint cluster redundant;
- two clusters incompatible;
- several complete solutions;
- no complete solution;
- one cluster alone sufficient in data sufficiency;
- representation accidentally leaks a hidden answer;
- cross-engine shortcut invalid under one branch;
- candidate domain too large for independent bounded verification.

## 70. Representations

- constraint-cluster table;
- candidate elimination grid;
- statement/data sufficiency;
- mini caselet;
- multi-stage reasoning graph.

Representation does not itself justify CP-014.

## 71. Misconceptions

- satisfying only one cluster;
- assuming a secondary property without checking;
- combining independent minima/maxima incorrectly;
- using a shortcut outside its conditions;
- accepting first valid candidate instead of least/greatest;
- treating incompatible evidence as indeterminate rather than impossible;
- mistaking representation complexity for mathematical necessity.

## 72. Canonical and verifier routes

- canonical: composed established engines with explicit dependency graph;
- verifier: independent bounded constraint enumeration from rendered givens.

No CP-014 prototype may exist before all participating component engines are stable.

## 73. Ownership exclusions

A candidate is reassigned to its primary CP when the second property is:

- a simple divisibility check;
- a range bound;
- an option validator;
- a context detail;
- a direct value already visible;
- a representation-only statement.

## 74. Discovery closure gates

- component CPs frozen or stable implementation proof;
- necessity-ablation test for every cluster;
- bounded domain and independent search;
- one/many/no-solution and DS classes;
- cross-CP duplicate audit;
- source saturation for genuine mixed PYQs;
- strict rejection of decorative hybrids;
- final chapter-wide merge/split audit.

---

## 75. NUM-002 dependency graph

```text
CP-007 ──→ CP-008 ──→ CP-009
                  └──→ selected CP-014 clusters

CP-004 shared factorisation ──→ CP-011 ──→ selected CP-014 clusters
                            └──→ CP-012 ──→ selected CP-014 clusters

CP-010 independent after digit primitives ──→ selected CP-014 clusters
CP-013 independent after base primitives  ──→ selected CP-014 clusters
```

CP-010 and CP-013 may run in parallel with the modular/valuation chains after shared exact primitives are stable.

---

## 76. NUM-002 package closure

`NUM-002` reaches English package closure only when:

- CP-007 through CP-013 each complete source-backed discovery and permanent allocation;
- CP-014 admission and synthesis audits close after component maturity;
- all QLs use the continuous chapter-wide `NUM-QL-*` ledger;
- CP-003, NUM-001 and shared-number-theory regressions remain green;
- cross-package collisions are zero;
- every source fixture is represented or disposed;
- solver/verifier, editorial and lifecycle proofs pass;
- Question Studio remains separately approved.
