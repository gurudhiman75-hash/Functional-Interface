# Number System — Source, Legacy-Recovery and Ownership Audit

**Status:** open source-backed audit  
**Packages:** `NUM-001`, `NUM-002`  
**Permanent QLs created by this audit:** 0

This audit prevents three common failures:

1. treating a book chapter heading as the final ExamTree ownership map;
2. copying the older Quant V2/V3 taxonomy as a fixed V4 inventory;
3. losing valid legacy ideas merely because their previous implementation was incomplete.

---

## 1. Evidence reviewed for the design baseline

### 1.1 Uploaded SSC mathematics guide

The uploaded guide’s Number System material provides evidence for:

- prime factorisation;
- HCF and LCM by factorisation and division methods;
- trailing zeroes through prime-pair counting;
- decimal and non-decimal base systems;
- positional expansion;
- conversion from a base to decimal;
- conversion from decimal to another base.

The guide is source evidence, not runtime authority. Formulae, examples and shortcuts must be independently checked before entering a permanent registry.

### 1.2 Uploaded SSC previous-year Number System collection

The uploaded PYQ collection provides recurring evidence for:

- exact fraction comparison and ordering;
- least or greatest number in a digit range divisible by a given factor;
- remainders under compatible divisors;
- minimum addition for divisibility;
- prime-number range tasks;
- digit equations and missing digits;
- quotient–divisor–remainder relations;
- same-remainder divisor recovery;
- remainders of scaled numbers and expressions;
- number and reverse-number structures.

It also contains questions whose true ownership is elsewhere, including general averages, ordinary linear equations and generic arithmetic word problems. Such entries must be reassigned according to their tested inference.

### 1.3 Existing ExamTree chapter designs

The design follows established Quant V4 rules already used in mature chapter work:

- exact-state-first generation;
- a canonical solver plus materially separate verifier;
- misconception-derived options;
- open QL and solve-mode inventories;
- source, inverse, edge, representation, ownership and merge/split audits;
- structured explanations and reviewer evidence;
- no public lifecycle state during discovery.

### 1.4 P&C boundary evidence

The P&C design explicitly separates:

```text
Determine whether a formed number has a digit/divisibility property
→ Number System

Count how many arrangements or numbers satisfy the property
→ P&C
```

A shared property validator may be called by P&C, but Number System must not duplicate the counting engine.

---

## 2. Source-quality rules

Every source-derived candidate must record:

```text
source ID
source type
exam or book identity
page/question reference where available
visible givens
requested unknown
mathematical invariant
answer semantic
provisional CP owner
retain/merge/split/reassign/reject decision
review notes
```

A source example does not automatically justify a new solve mode. Several examples may be parameter variants of one contract. Conversely, one source example may reveal several materially different inverse tasks that require separate executable discovery.

### 2.1 Source contradiction policy

When sources use different conventions, the runtime must declare the convention in the item or package.

Examples:

- whether natural numbers begin at 0 or 1;
- whether a round-table reflection is considered identical — outside Number System but relevant to shared validators;
- whether “remainder” means the least non-negative remainder;
- whether the number range is inclusive;
- whether repeated decimal notation includes only the marked block.

### 2.2 Source-error policy

No source answer is trusted merely because it is printed. Every recovered fixture must be independently solved and validated. Incorrect, ambiguous or underdetermined source items are recorded and rejected or repaired; they are not silently copied.

---

## 3. Quant V2 recovery

Quant V2 contains a broad `NumberSystemFamilyId` inventory. It is valuable prior art, but it is not a V4 QL ledger.

### 3.1 V2 families provisionally mapped to NUM-CP-003 — Divisibility

```text
ns_missing_digit_single_rule
ns_missing_digit_multi_rule
ns_reverse_divisibility
ns_divisibility_multi_condition
ns_divisibility_range_count
ns_large_expression_divisibility
ns_divisibility_lcm_bridge
ns_hidden_divisor_deduction
```

Disposition:

- recover every distinct visible-given/unknown topology as a prototype candidate;
- merge single-rule divisors when the same parameterised digit rule owns them;
- separate unique-digit, all-digits, count-of-digits and possible/impossible answer semantics;
- reassign HCF/LCM-led states to CP-006 when divisibility is only evidence.

### 3.2 V2 families provisionally mapped to NUM-CP-004 — Prime structure

```text
ns_prime_factorization
ns_hidden_prime_exponent
ns_prime_composite_deduction
```

Disposition:

- retain as source candidates;
- expand missing coverage for co-prime structure, interval primes, least prime factor and inverse factorisation;
- do not create a QL for each named prime property without source and misconception evidence.

### 3.3 V2 families provisionally mapped to NUM-CP-005 — Divisors

```text
ns_factor_count_basic
ns_factor_count_constraint
ns_exact_divisor_count
ns_odd_even_divisor_count
ns_sum_of_divisors
ns_product_of_divisors
```

Disposition:

- recover;
- separate direct divisor-function outputs from inverse reconstruction only when the uniqueness and reasoning topology differ;
- add source-gap discovery for divisors divisible by a condition, square/cube divisors and common-divisor counts.

### 3.4 V2 families provisionally mapped to NUM-CP-006 — HCF/LCM

```text
ns_hcf_lcm_relation
ns_three_number_hcf_lcm
ns_hidden_hcf
ns_hidden_lcm
ns_fraction_hcf_lcm
ns_hcf_lcm_word_problem
ns_schedule_alignment
ns_minimum_common_multiple
```

Disposition:

- recover;
- treat schedule/bell/context changes as representations unless they alter evidence topology;
- preserve fraction and decimal HCF/LCM only after exact unit-normalisation proof;
- add Euclidean algorithm, same-remainder greatest divisor, grouping and range-count gaps.

### 3.5 V2 families provisionally mapped to NUM-CP-007/008 — Remainders and congruences

```text
ns_remainder_after_division
ns_remainder_after_power
ns_modular_cycle
ns_nested_remainder
ns_remainder_pattern
ns_remainder_reconstruction
ns_remainder_factor_hybrid
ns_remainder_range_count
ns_modular_arithmetic
ns_cyclic_pattern
ns_prime_remainder_hybrid
```

Disposition:

- split ordinary one-stage division-lemma tasks from genuine modular-system tasks;
- merge cyclic power remainders with CP-009 when terminal digits are the answer;
- do not preserve “hybrid” as a QL identity unless the second engine is essential;
- add compatibility, multiple-solution, no-solution, bounded CRT and linear-congruence gaps.

### 3.6 V2 families provisionally mapped to NUM-CP-009 — Terminal digits

```text
ns_unit_digit_cycle
ns_last_two_digits
ns_last_three_digits
ns_expression_last_digit
ns_power_tower_digit
ns_cycle_length_detection
```

Disposition:

- recover;
- distinguish unit digit, last two digits and last three digits because answer semantics and algorithms differ;
- merge different bases/exponents as parameters where the same cycle contract applies;
- add inverse exponent-class and terminal-digit-count tasks.

### 3.7 V2 families provisionally mapped to NUM-CP-010 — Digit structure

```text
ns_sum_of_digits
ns_number_of_digits
ns_digit_interchange
ns_digit_formation
ns_digit_constraints
ns_unknown_digit_equation
ns_digit_sum_reconstruction
ns_consecutive_digit_number
```

Disposition:

- retain reconstruction and digit-equation candidates;
- reassign arrangement-counting forms of `ns_digit_formation` to P&C;
- do not use general logarithmic digit-count approximations without a separate exactness policy;
- add place value, digital root, carry/borrow, palindrome and bounded occurrence gaps.

### 3.8 V2 families provisionally mapped to NUM-CP-011 — Factorials and valuations

```text
ns_trailing_zeroes
ns_highest_power_dividing
ns_factorial_divisibility
ns_factorial_remainder
ns_factorial_factor_count
```

Disposition:

- recover;
- merge direct prime valuations across products and factorials only when pedagogy and inverse direction remain shared;
- add general-base trailing zeroes, inverse zero counts, factorial ratios and last non-zero digit as source-backed candidates.

### 3.9 V2 families provisionally mapped to NUM-CP-012 — Perfect powers

```text
ns_perfect_square_completion
ns_perfect_cube_completion
ns_least_square_multiple
ns_least_cube_multiple
ns_square_factor_constraint
ns_cube_factor_constraint
ns_square_remainder_hybrid
ns_square_divisibility_hybrid
ns_square_factor_count_hybrid
```

Disposition:

- recover the prime-exponent completion logic;
- merge square/cube as a parameter only where the same general perfect-power engine preserves learner reasoning;
- retain separate QLs where answer semantic, shortcut or misconception profile materially differs;
- reassign generic algebraic square identities to Algebra.

### 3.10 V2 optimisation and reconstruction families

```text
ns_hidden_number_theory
ns_multi_cluster_reasoning
ns_least_number_constraint
ns_greatest_number_constraint
ns_minimum_addition
ns_minimum_subtraction
ns_minimum_multiplier
ns_minimum_divisor
ns_smallest_divisible_number
ns_largest_valid_number
ns_range_optimization
ns_multi_condition_optimization
ns_hidden_number_reconstruction
ns_hidden_divisor_reconstruction
ns_hidden_exponent_reconstruction
ns_hidden_factorization_reconstruction
ns_hidden_square_reconstruction
ns_multi_condition_reconstruction
ns_reverse_number_theory
ns_prime_hcf_lcm_optimization
ns_digit_divisibility_reconstruction
ns_remainder_constraint_optimization
ns_factor_count_square_hidden
ns_prime_exact_divisor_optimization
ns_modular_cycle_reconstruction
ns_digit_divisibility_hcf_verification
ns_factor_hcf_hybrid
```

Disposition:

- these labels describe difficulty or composition more often than stable mathematical ownership;
- map every recovered fixture to its primary CP;
- retain CP-014 only for a question that genuinely requires multiple independent engines;
- reject “elite” or “hybrid” as a standalone reason for a new QL;
- require bounded exact enumeration or constructive uniqueness proof for every inverse optimisation task.

### 3.11 V2 aliases

```text
ns_missing_digit_divisibility
ns_two_missing_digits_divisibility
ns_last_digit_power
ns_last_two_digits_power
ns_hcf_lcm_product_relation
ns_trailing_zeros_factorial
ns_highest_power_in_factorial
```

Disposition:

- aliases are migration references only;
- no alias receives a V4 CP or QL identity;
- every legacy fixture must resolve to one canonical V4 authority.

---

## 4. Quant V3 recovery

### 4.1 Topic configuration

The current Quant V3 `NumberSystem` topic configuration has an empty subtopic list. It cannot serve as an exhaustive content map.

### 4.2 Divisibility registry

The Quant V3 Divisibility registry is a governance scaffold with:

- no registered source entries;
- no approved archetypes;
- no canonical problems;
- no reasoning patterns;
- no solver capability mappings;
- all review fields pending human review.

The registry’s source-first discipline is worth preserving, but its empty inventory cannot be mistaken for a finished chapter design.

### 4.3 Existing V3 implementation traces

The repository contains tests or architecture traces for areas such as:

- divisibility;
- surds;
- exponents;
- number classification;
- digits;
- fractions/decimals;
- last digits.

These must be treated as recoverable implementation evidence. Before reuse, each trace requires:

1. source provenance;
2. mathematical audit;
3. ownership audit;
4. comparison against the V4 exact-state contract;
5. disposition as retain, merge, rewrite, reassign or reject.

No V3 file name or test name automatically creates a V4 CP or QL.

---

## 5. Major source gaps not safely covered by the old inventory

The V4 discovery programme must explicitly investigate:

- number-set conventions and irrational/rational classification;
- exact fraction/decimal/recurring-decimal representation;
- decimal-termination criteria and inverse tasks;
- number-line and absolute-value tasks;
- open/closed interval integer counts;
- divisibility of repeated blocks and concatenations;
- guaranteed divisibility of power sums/differences;
- bounded prime-range and co-prime inverse tasks;
- divisor subsets such as square, cube or `k`-divisible divisors;
- common-divisor and common-multiple counts in ranges;
- Euclidean algorithm as both solve and verification route;
- compatibility and impossibility of simultaneous congruences;
- bounded CRT tasks;
- negative residues and residue normalisation;
- inverse cycle/exponent-class tasks;
- carry/borrow digit reconstruction;
- palindromes and bounded digit occurrence;
- general-base trailing zeroes;
- inverse factorial valuation and possible/impossible zero counts;
- general perfect-power completion;
- base validity, unknown-base equations and arithmetic in a base;
- advanced source-backed totient, modular inverse, Fermat/Euler and Wilson tasks;
- data-sufficiency and statement representations after ordinary authority proof.

---

## 6. Cross-chapter ownership ledger

| Candidate family | Number System ownership | Other owner / rule |
|---|---|---|
| fraction comparison and decimal termination | retain | expression simplification goes to Simplification |
| HCF/LCM foundations and applications | retain | UI may expose a subtopic filter only |
| digit arrangements satisfying divisibility | property validator only | P&C owns counting |
| digit equations and number reversal | retain | general simultaneous equations go to Algebra |
| powers used for last digits/remainders | retain | general exponent manipulation goes to Surds & Indices |
| perfect-square/cube exponent completion | retain | geometric square/cube measurement goes to Mensuration |
| repeated event alignment | retain when common multiple is tested | rate/schedule completion goes to Time & Work or TSD |
| number series | exclude | Banking Number Series |
| coded numbers and symbol replacement | exclude | Reasoning Coding-Decoding / Mathematical Operations |
| probability of a divisibility event | property validator only | Probability owns sample space and probability |
| count of integers in a numeric interval | retain | combinatorial arrangement count remains P&C |
| general inequalities | exclude | Algebra/Inequalities |
| Roman numerals | hold | Fundamentals unless recurring source evidence justifies a small adapter |
| data sufficiency | representation only | no new mathematical ownership without an ordinary solve authority |

---

## 7. Ownership tests for ambiguous items

For every candidate, ask in order:

1. What is the final requested quantity?
2. Which invariant makes the answer possible?
3. Would the question remain the same if its story context changed?
4. Does the learner primarily count arrangements, simplify an expression, solve an algebraic system or reason about divisibility/factors/remainders?
5. Is a secondary number property only a filter, or is it the main inference?
6. Can the item be solved entirely by another chapter’s authority?

Examples:

```text
“How many 4-digit even numbers can be formed?”
Main inference: count arrangements under constraints.
Owner: P&C.

“A 4-digit number has digit sum 18 and is divisible by 9. Which statement follows?”
Main inference: digit/divisibility structure.
Owner: Number System.

“Evaluate (3/5 + 7/10) ÷ 9/4.”
Main inference: expression simplification.
Owner: Simplification.

“Which of the following fractions has a terminating decimal expansion?”
Main inference: denominator prime structure.
Owner: Number System.
```

---

## 8. Source-saturation matrix required before QL allocation

Every CP must be checked against these directions:

```text
direct value
reverse value
missing input
missing exponent/digit/base
least/greatest optimisation
count/set of all valid answers
possible/impossible
unique/multiple/indeterminate
range-bounded solution
comparison or claim verification
multi-condition intersection
representation change
edge and boundary state
```

Each retained task must also be checked across:

- integer sign and zero behaviour where valid;
- one, two and several prime factors;
- repeated prime exponents;
- co-prime and non-co-prime moduli;
- exact cycle boundary;
- exponent congruent to zero modulo cycle length;
- leading zero and carry/borrow boundaries;
- lower/upper digit range boundaries;
- exact versus at-least semantics;
- inclusive versus exclusive intervals;
- one answer, multiple answers and no answer.

---

## 9. Audit outputs required before implementation begins

The design branch should eventually contain:

```text
source-ledger.md
source-fixture-index.json
legacy-v2-disposition.json
legacy-v3-disposition.json
cross-chapter-ownership-ledger.md
open-gap-ledger.md
rejected-and-reassigned-fixtures.md
```

At the present design stage, all source and legacy decisions remain provisional. This audit authorises structured executable discovery; it does not authorise permanent IDs or public content.
