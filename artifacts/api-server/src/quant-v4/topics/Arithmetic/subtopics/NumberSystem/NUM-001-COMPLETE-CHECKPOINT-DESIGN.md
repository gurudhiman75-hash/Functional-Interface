# NUM-001 — Complete Checkpoint Design

**Package:** `NUM-001 — Number Structure, Divisibility, Factors and HCF/LCM`  
**CP range:** `NUM-CP-001..NUM-CP-006`  
**Status:** complete design; executable counts open except approved `NUM-CP-003`  
**Current allocated range:** `NUM-QL-001..NUM-QL-017` for `NUM-CP-003`

---

## 1. Package purpose

`NUM-001` owns the structural description of exact numbers before stateful modular, digit-cycle, factorial-valuation, perfect-power or base-system behaviour becomes the main inference.

Its shared internal state uses:

- exact integers and reduced rationals;
- declared number-set conventions;
- prime-exponent maps;
- divisor sets and divisor-function evidence;
- HCF/LCM exponent minima and maxima;
- exact interval bounds;
- decimal digit divisibility evidence.

---

# NUM-CP-001 — Number Sets, Order, Parity and Integer Structure

## 2. Governing invariants

- inclusion chain among natural, whole, integer, rational and real numbers;
- irrationality where source-safe and unambiguous;
- exact signed order and absolute distance;
- parity under addition, subtraction, multiplication and integer powers;
- arithmetic structure of consecutive integer blocks;
- exact integer counts under interval endpoint conventions.

## 3. Discovery families

### Classification and membership

```text
smallest applicable number set
select item outside a declared set
validate membership claim
rational versus irrational expression
classify zero, one and negative integers under declared conventions
```

### Order and exact comparison

```text
compare signed integers
compare exact mixed representations
order integer/rational values
locate value on number line
find distance or absolute-value separation
select integer between exact bounds
least/greatest integer satisfying strict or non-strict bound
```

### Interval counts

```text
closed interval integer count
open interval integer count
half-open interval count
count positive, negative, even or odd integers in interval
recover an endpoint from count evidence
classify empty/singleton/multiple integer interval
```

### Parity

```text
parity of direct expression
parity from factor or exponent structure
missing parity condition
claim always/sometimes/never even or odd
parity of consecutive block sum/product
```

### Consecutive integer structure

```text
recover consecutive integers from sum
recover odd/even consecutive integers
find middle or endpoint
derive sum/product property
verify divisibility of consecutive-product pattern
classify possible/impossible block under parity evidence
```

## 4. Answer semantics

```text
NUMBER_SET
BOOLEAN_CLAIM
ORDERED_LIST
INTEGER
COUNT
PARITY_CLASS
NUMBER_TUPLE
DISTANCE
```

## 5. Edge states

- natural-number convention begins at zero or one;
- zero is even;
- one is neither prime nor composite but remains natural/whole/integer/rational;
- negative interval endpoints;
- equal bounds;
- strict bound exactly on an integer;
- no integer between two rationals;
- absolute value producing two candidates when inverse;
- consecutive block with no integer solution.

## 6. Representations

- prose;
- number line;
- interval notation;
- statement/claim set;
- small table of values;
- data sufficiency only after ordinary inverse authority is proven.

## 7. Misconceptions

- assuming natural numbers always include or exclude zero without reading convention;
- treating zero as odd;
- reversing negative-number order;
- counting both endpoints in every interval;
- using `upper - lower` without endpoint correction;
- treating absolute value as signed value;
- forcing an impossible consecutive-integer state.

## 8. Canonical and verifier routes

- canonical: set/property rules and exact interval formula;
- verifier: bounded exact enumeration and direct substitution.

## 9. Ownership exclusions

- generic inequalities → Algebra;
- fraction/recurring-decimal comparison central to representation → CP-002;
- number series → Number Series;
- linear equation without integer-property reasoning → Algebra.

## 10. Discovery closure gates

- source convention ledger complete;
- all interval endpoint combinations executed;
- direct/inverse parity forms audited;
- consecutive integer one/many/no-solution cases classified;
- number-line representation shown not to create duplicate QLs;
- merge/split audit between ordering, interval count and parity tasks.

---

# NUM-CP-002 — Fractions, Decimals and Recurring Representations

## 11. Governing invariants

- exact rational equivalence under reduction;
- fraction comparison by exact cross-products;
- decimal expansion determined by denominator prime structure after reduction;
- recurring decimal reconstruction through place-value subtraction;
- bounded remainder cycle for repeating block length.

## 12. Discovery families

### Representation conversion

```text
reduce fraction
proper/improper/mixed conversion
terminating decimal to fraction
pure recurring decimal to fraction
mixed recurring decimal to fraction
fraction to exact terminating decimal
fraction to recurring representation
```

### Comparison and ordering

```text
compare two fractions
order several fractions
compare fraction, terminating decimal and recurring decimal
largest/smallest rational
insert rational between two values
claim verification of exact order
```

### Decimal termination structure

```text
classify terminating or recurring
number of terminating decimal places
least power of ten needed
missing denominator factor
least multiplier for termination
least divisor for termination
possible/impossible termination under constraint
```

### Recurring block structure

```text
reconstruct fraction from marked block
recover missing recurring block digit
bounded recurring-block length
compare recurring patterns
identify equivalent recurring notations
```

### Exact rational inverse states

```text
unknown numerator or denominator from value
unknown fraction from sum/difference/ratio evidence when representation is central
recover denominator structure from decimal-place count
count/set of bounded denominators producing termination
```

## 13. Answer semantics

```text
REDUCED_FRACTION
DECIMAL_REPRESENTATION
ORDERED_LIST
RATIONAL_VALUE
COUNT
DENOMINATOR_FACTOR
RECURRING_BLOCK
BOOLEAN_CLAIM
```

## 14. Edge states

- negative rational;
- zero numerator;
- denominator sign normalisation;
- reduction changes termination status evidence;
- repeating 9s equivalent to next terminating decimal;
- zero-length non-repeating prefix;
- pure versus mixed recurring notation;
- denominator already terminating;
- multiple candidate multipliers unless “least” is explicit.

## 15. Representations

- fraction/decimal prose;
- fraction strip where useful;
- long-division remainder table;
- recurring-block notation;
- comparison table;
- statement and data sufficiency adapters.

## 16. Misconceptions

- comparing numerator or denominator alone;
- converting through rounded decimal;
- failing to reduce before checking factors 2 and 5;
- counting total powers instead of maximum denominator exponent;
- marking the wrong recurring block;
- treating `0.999...` as less than `1`;
- using expression simplification rather than exact representation.

## 17. Canonical and verifier routes

- canonical: reduced rational algebra and denominator factorisation;
- verifier: exact cross-products, bounded long division and decimal reconstruction.

## 18. Ownership exclusions

- long mixed fraction arithmetic → Simplification;
- percentage/profit interpretation → relevant arithmetic chapter;
- general rational equation → Algebra unless representation structure is essential;
- HCF/LCM of fractions as final target → CP-006.

## 19. Discovery closure gates

- all recurring notation conventions documented;
- termination direct/inverse/set/count tasks executed;
- exact comparison never uses floating authority;
- recurring block cycle proof bounded and independent;
- source-heavy algebra questions reassigned where representation is not central;
- merge/split audit across conversion, comparison, termination and reconstruction.

---

# NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints

## 20. Current frozen authority

This checkpoint is approved and permanently allocated:

```text
NUM-QL-001..NUM-QL-017
17 QL-template families
7 solve modes
```

The permanent implementation authority and proof records control its exact mapping.

## 21. Frozen governing authorities

```text
APPLY_DIVISIBILITY_RULE
RESOLVE_SINGLE_DIGIT_CANDIDATE_SET
RESOLVE_ORDERED_DIGIT_PAIR_SET
FIND_DIGIT_BOUND_MULTIPLE
COUNT_ONE_DIVISOR_IN_RANGE
TEST_IMPLICIT_REPEATED_NUMERAL
RESOLVE_LINKED_ARITHMETIC_DIVISIBILITY
```

## 22. Frozen representations

- 15 standard learner templates;
- one five-class data-sufficiency template;
- one claim-verification template.

## 23. Closed exclusions and referrals

- visible arithmetic alone fixes digit → reject hybrid;
- repunit length and modular-power divisibility → CP-008;
- same-remainder greatest divisor → CP-006;
- quotient/divisor/remainder reconstruction → CP-007;
- overlap/inclusion-exclusion counting → CP-006/shared set-counting ownership audit;
- algebraic power identities → CP-008/Algebra ownership hold.

## 24. Future change rule

A new CP-003 family may be added only through post-freeze discovery proving a materially distinct contract and explicit new permanent allocation. Existing identities are immutable.

---

# NUM-CP-004 — Prime Structure and Factorisation

## 25. Governing invariants

- prime, composite, unit and neither classifications;
- unique prime factorisation for positive integers greater than one;
- co-prime status through HCF one or disjoint prime support;
- bounded prime enumeration;
- exponent recovery from constructed factorisation evidence.

## 26. Discovery families

### Prime classification and interval tasks

```text
classify prime/composite/unit/neither
find primes in bounded interval
count primes in bounded interval
least/greatest/next/previous prime
select prime under digit/range constraint
verify prime claim
```

### Factorisation

```text
prime factorisation of constructed integer
largest/smallest prime factor
distinct prime-factor count
total prime-factor count with multiplicity
recover integer from factorisation
compare prime-exponent structures
complete missing factor or exponent
```

### Co-prime structure

```text
select co-prime pair or set
recover unknown for co-prime condition
classify pairwise versus collectively co-prime
count bounded candidate values co-prime to fixed number without totient shortcut
verify co-prime claim
```

### Prime reconstruction

```text
prime pair from sum/difference/product
bounded prime triple
least prime divisor
prime divisor of constructed expression
classify possible/impossible prime structure
```

### Advanced hold

```text
Euler totient
count integers co-prime to n by formula
special prime theorems
```

## 27. Answer semantics

```text
PRIME_CLASS
PRIME
PRIME_SET
COUNT
PRIME_FACTOR
PRIME_EXPONENT
FACTORISATION
INTEGER
BOOLEAN_CLAIM
```

## 28. Edge states

- zero, one and negative inputs;
- number equal to a prime square;
- repeated exponents;
- exactly one distinct prime factor;
- pairwise versus collectively co-prime distinction;
- interval containing no prime or one prime;
- factorisation already visible;
- source candidate with ambiguous primality domain.

## 29. Representations

- prose/expression;
- factor tree;
- prime-exponent table;
- interval list/table;
- statement set;
- bounded data sufficiency.

## 30. Misconceptions

- treating one as prime;
- stopping factorisation too early at a composite factor;
- confusing distinct factors with multiplicity;
- assuming consecutive numbers are the only co-prime pairs;
- treating pairwise and collective co-prime as identical;
- testing divisibility only up to an incorrect bound.

## 31. Canonical and verifier routes

- canonical: constructed factor state, prime table and deterministic bounded primality;
- verifier: independent trial division or direct multiplication of declared prime powers.

## 32. Ownership exclusions

- divisor count/sum/product → CP-005;
- HCF/LCM target → CP-006;
- perfect-power completion → CP-012;
- arrangements of prime selections → P&C.

## 33. Discovery closure gates

- source/PYQ prime task saturation;
- one, repeated and several-prime support;
- direct/inverse factorisation coverage;
- pairwise/collective co-prime audit;
- bounded uniqueness for prime pair/triple tasks;
- advanced totient disposition;
- merge/split audit for prime classification versus factorisation outputs.

---

# NUM-CP-005 — Divisors and Divisor Functions

## 34. Governing invariants

For `n = p₁^a₁ ... pₖ^aₖ`:

- divisor count from exponent choices;
- divisor subset count from constrained exponent ranges;
- divisor sum from geometric factors;
- divisor product from paired divisors;
- inverse divisor-count states require bounded constructive uniqueness.

## 35. Discovery families

### Direct divisor counts

```text
total positive divisors
proper divisors
odd/even divisors
divisors divisible by k
divisors not divisible by k
square divisors
cube divisors
general perfect-power divisors
common divisor count
```

### Divisor aggregates and selection

```text
sum of divisors
sum of proper divisors
product of divisors
greatest/least divisor under condition
paired or nth divisor in bounded explicit state
complete divisor set for small number
claim verification
```

### Inverse divisor structure

```text
missing exponent from divisor count
prime power from divisor count
number with exact divisor count
least number with exact divisor count
least odd/even number with exact divisor count
classify possible/impossible divisor count
recover bounded number from divisor subset evidence
```

### Advanced hold

```text
perfect/deficient/abundant classification
large inverse divisor optimisation
```

## 36. Answer semantics

```text
DIVISOR_COUNT
DIVISOR_SUM
DIVISOR_PRODUCT
DIVISOR
DIVISOR_SET
PRIME_EXPONENT
INTEGER
SOLUTION_CLASS
BOOLEAN_CLAIM
```

## 37. Edge states

- `n = 1`;
- prime number;
- prime power;
- perfect square has unpaired square-root divisor;
- no even divisors for odd number;
- condition `divisible by k` impossible;
- inverse count with multiple numbers;
- “proper divisor” convention excludes the number itself;
- product magnitude requires exact `bigint`.

## 38. Representations

- factorisation expression;
- prime-exponent grid;
- divisor-pair table;
- explicit divisor list for bounded verification;
- statement/data sufficiency;
- mini caselet only if several outputs share one factorisation state.

## 39. Misconceptions

- adding exponents instead of multiplying `(a+1)` terms;
- forgetting divisor `1` or the number itself;
- confusing proper and total divisors;
- counting odd/even divisors with wrong exponent restriction;
- assuming every divisor of a square is square;
- using `n^(d/2)` without checking exact product semantics;
- accepting one inverse candidate without uniqueness proof.

## 40. Canonical and verifier routes

- canonical: prime-exponent formulas and constrained exponent-choice counting;
- verifier: explicit divisor enumeration for bounded proof states.

## 41. Ownership exclusions

- square/cube completion of the original number → CP-012;
- HCF/common factor as final optimum → CP-006;
- count selections of factors under combinatorial arrangements → P&C;
- prime factorisation alone → CP-004.

## 42. Discovery closure gates

- all divisor subset predicates represented;
- direct aggregate and inverse reconstruction separated by evidence;
- square/cube divisor boundary with CP-012 closed;
- inverse uniqueness via enumeration/constructive order proof;
- one/many/no-solution classes tested;
- advanced perfect/abundant disposition;
- complete merge/split audit.

---

# NUM-CP-006 — HCF, LCM and Common-Alignment Applications

## 43. Governing invariants

- HCF from minimum prime exponents or Euclidean algorithm;
- LCM from maximum prime exponents;
- `HCF × LCM = product` only for two positive integers;
- greatest common measure/grouping from HCF;
- least common alignment from LCM;
- greatest divisor leaving same/declared remainders from HCF of adjusted differences;
- common-multiple range counts from LCM.

## 44. Discovery families

### Direct HCF/LCM

```text
HCF by factorisation
HCF by Euclidean algorithm
LCM by factorisation/division table
HCF and LCM together
three or more numbers
powers
exact fractions
terminating decimals
claim verification
```

### Inverse pair reconstruction

```text
missing number from HCF-LCM product relation
pair from HCF, LCM and sum/difference/ratio/product
recover missing HCF/LCM from exponent evidence
possible/impossible pair
count/set of bounded pairs
co-prime consequence
```

### Grouping and measurement

```text
greatest exact measure
maximum equal group size
minimum groups/containers under exact grouping
least quantity divisible into declared groups
shared tile/segment dimension where no geometry inference is needed
```

### Remainder-adjusted HCF/LCM

```text
greatest divisor leaving declared remainders
greatest divisor leaving same remainder
least number leaving same remainder for several divisors
least number leaving compatible declared remainders when reducible to LCM
```

### Common multiples and events

```text
least common multiple
next/previous common multiple
count common multiples in interval
first common event time
repeat alignment of bells/lights/departures
```

### Ownership audit family

```text
count divisible by either/neither/exactly one
at least one of several divisors
```

These remain provisional until the inclusion-exclusion versus LCM ownership audit closes.

## 45. Answer semantics

```text
HCF
LCM
INTEGER
NUMBER_PAIR
NUMBER_SET
COUNT
MEASURE
GROUP_SIZE
EVENT_TIME
DIVISOR
SOLUTION_CLASS
BOOLEAN_CLAIM
```

## 46. Edge states

- co-prime numbers;
- one number divides another;
- more than two numbers;
- repeated values;
- product relation misapplied to three numbers;
- adjusted remainder greater than or equal to divisor invalid;
- no bounded pair satisfying HCF/LCM evidence;
- event starts already aligned at time zero versus first positive alignment;
- inclusive/exclusive range count;
- rational units requiring exact normalisation.

## 47. Representations

- prime-exponent table;
- Euclidean ladder;
- division table;
- grouping diagram;
- event timeline;
- statement/data sufficiency;
- shared caselet with one number set and several HCF/LCM targets.

## 48. Misconceptions

- using exponent maxima for HCF or minima for LCM;
- multiplying HCF and LCM relation for more than two numbers;
- failing to divide numbers by HCF before inverse reconstruction;
- taking LCM when greatest measure is required;
- taking HCF when first alignment is required;
- ignoring remainder adjustment;
- counting time zero as the requested next event;
- adding separate multiple counts without overlap correction.

## 49. Canonical and verifier routes

- canonical: prime-exponent minima/maxima, Euclidean algorithm and adjusted-difference HCF;
- verifier: direct common-divisor/common-multiple checks, bounded pair enumeration and event simulation.

## 50. Ownership exclusions

- one-stage quotient/remainder reconstruction → CP-007;
- general simultaneous residue system → CP-008;
- worker productivity/schedule completion → Time & Work;
- speed/departure motion inference → Time, Speed and Distance;
- geometric measurement beyond common unit → Mensuration/Geometry.

## 51. Discovery closure gates

- factorisation and Euclidean routes both proven;
- two-number and multi-number relation audit;
- fraction/decimal exact normalisation;
- grouping, remainder-adjusted and event families saturated;
- interval count boundaries tested;
- inclusion-exclusion ownership closed;
- inverse pair one/many/no-solution proof;
- complete source and legacy disposition;
- merge/split audit before count proposal.

---

## 52. NUM-001 implementation dependencies

```text
shared exact integer/rational library
        ├── CP-001
        └── CP-002

prime factorisation authority (CP-004)
        ├── CP-005
        └── CP-006

approved divisibility authority (CP-003)
        ├── reusable validator for CP-004..006
        └── no duplicate learner ownership
```

`CP-001` and `CP-002` may run in parallel with the CP-004→005→006 factor chain once the shared rational and exact-number primitives are stable.

---

## 53. NUM-001 package closure

`NUM-001` reaches English package closure only when:

- CP-001, CP-002, CP-004, CP-005 and CP-006 each complete open discovery and explicit permanent allocation;
- CP-003 regression remains green;
- chapter-wide QL IDs remain continuous from `NUM-QL-001`;
- no cross-CP duplicate learner contracts remain;
- all source fixtures map exactly once;
- solver/verifier pairs are proven;
- English review corpora pass adversarial and human review;
- Question Studio remains separately gated.
