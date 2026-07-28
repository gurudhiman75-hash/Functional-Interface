# NUM-CP-003 — Provisional QL-Template Proposal V2

**Status:** revised count-bearing proposal; not frozen  
**Checkpoint:** `NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints`  
**Provisional learner templates:** 17  
**Numerical authorities:** 7  
**Permanent `NUM-QL-*` identities:** 0

Temporary labels `QLT2-01` through `QLT2-17` are proposal-only review labels. They are not permanent Question Language IDs.

---

## 1. Compression result

```text
Seven numerical solve authorities
  → fifteen numerical/task templates
  → two representation templates
  = seventeen provisional learner templates
```

The second-pass review removed two unsupported meta-rule tasks and merged three largest/smallest or least/greatest direction pairs.

---

# Authority A — Apply divisibility to a visible number

## QLT2-01 — Select a divisor or non-divisor

```text
Authority:          APPLY_DIVISIBILITY_RULE
Task direction:     number → divisor option
Answer semantic:    DIVISOR
Parameters:         requested polarity, divisor rule family, number length
Uniqueness:         exactly one option satisfies requested polarity
```

Primitive versus composite divisor and divisible versus non-divisible are parameters.

Not retained as separate learner QLs:

- naming a divisor from a classroom rule description;
- naming a rule from a divisor.

Those remain study-mode or rule-registry checks until direct exam-task evidence appears.

---

# Authority B — Resolve a single-digit candidate set

Shared state:

```text
template
candidate domain: 0..9 or 1..9
one or more divisibility constraints
complete valid-digit set
requested projection
```

## QLT2-02 — Find the unique valid missing digit

```text
Answer semantic:    DIGIT
Uniqueness:         valid set size = 1
```

## QLT2-03 — Find an extremum valid digit

```text
Answer semantic:    DIGIT
Parameter:          extremumDirection = LARGEST | SMALLEST
Precondition:       valid set size ≥ 2
```

## QLT2-04 — Count all valid digits

```text
Answer semantic:    COUNT
Target:             cardinality(valid set)
```

## QLT2-05 — Find the sum of all valid digits

```text
Answer semantic:    DIGIT_SUM
Target:             sum(valid set)
```

## QLT2-06 — Return the complete valid-digit set

```text
Answer semantic:    DIGIT_SET
Target:             exact semantic set equality
```

## QLT2-07 — Form an extremum valid completed number

```text
Answer semantic:    NUMBER
Parameter:          extremumDirection = GREATEST | SMALLEST
Target:             extremum of completed numerals
```

The answer is the full numeral, not the replacement digit. Leading zero is a domain constraint.

### Authority-B boundary

The following are parameters, not new QLs:

- leading versus internal X;
- one composite divisor versus several equivalent displayed constraints;
- number length;
- rule family;
- largest versus smallest direction.

---

# Authority C — Resolve ordered missing-digit pairs

Shared state:

```text
template containing X and Y
100 ordered candidate pairs
one or more divisibility constraints
optional digit-sum or arithmetic relation
complete valid ordered-pair set
```

## QLT2-08 — Find the unique ordered digit pair

```text
Answer semantic:    ORDERED_DIGIT_PAIR
Uniqueness:         valid pair set size = 1
```

## QLT2-09 — Count all valid ordered pairs

```text
Answer semantic:    COUNT
Target:             cardinality(valid pair set)
```

## QLT2-10 — Return the complete ordered-pair set

```text
Answer semantic:    ORDERED_PAIR_SET
Target:             exact ordered-pair set equality
```

This is advanced enrichment and should not dominate routine SSC distribution.

## QLT2-11 — Classify the pair solution set

```text
Answer semantic:    SOLUTION_CLASS
Classes:            NO_SOLUTION | UNIQUE_SOLUTION | MULTIPLE_SOLUTIONS
```

Swapping X and Y changes the ordered pair and is never normalised away.

---

# Authority D — Find a digit-bound multiple

## QLT2-12 — Find an extremum n-digit multiple

```text
Authority:          FIND_DIGIT_BOUND_MULTIPLE
Answer semantic:    NUMBER
Parameter:          extremumDirection = LEAST | GREATEST
State:              digit length and divisor
```

Least and greatest are opposite directions over one boundary contract.

---

# Authority E — Count one-divisor range states

## QLT2-13 — Count multiples of one divisor in an inclusive range

```text
Authority:          COUNT_ONE_DIVISOR_IN_RANGE
Answer semantic:    COUNT
State:              lower bound, upper bound, divisor
Boundary:           explicitly inclusive
```

This also covers n-digit multiple counts by using decimal digit boundaries.

Excluded:

- common multiples;
- one-but-not-another;
- either/neither/exactly-one;
- three-divisor inclusion–exclusion.

---

# Authority F — Construct and test an implicit repeated numeral

## QLT2-14 — Test divisibility of an implicitly constructed repeated numeral

```text
Authority:          TEST_IMPLICIT_REPEATED_NUMERAL
Answer semantic:    DIVISOR
Visible state:      source block and repeat count
Required inference: construct or factor the repeated numeral before testing
```

If the complete numeral is already displayed and no place-value construction remains, the task merges into QLT2-01.

General repeated-block factor identities remain outside this template.

---

# Authority G — Linked arithmetic and divisibility

## QLT2-15 — Resolve a linked arithmetic–divisibility extremum

```text
Authority:          RESOLVE_LINKED_ARITHMETIC_DIVISIBILITY
Answer semantic:    DIGIT
Visible state:      arithmetic relation linking A and B; result divisibility
Parameter:          extremumDirection = LARGEST | SMALLEST
```

Required generation proof:

1. arithmetic alone leaves multiple ordered pairs;
2. divisibility removes at least one pair;
3. at least two valid pairs remain;
4. the requested extremum is unique;
5. independent 100-pair enumeration reproduces the answer.

Any state failing condition 1 or 2 is rejected as decorative divisibility.

---

# Representation R1 — Data sufficiency

## QLT2-16 — Missing-digit data sufficiency

```text
Underlying authority: single-digit candidate set
Answer semantic:      SUFFICIENCY_CLASS
```

Supported outcomes:

- Statement I alone;
- Statement II alone;
- each statement alone;
- both together only;
- even together insufficient.

The option convention must be shared product-wide.

---

# Representation R2 — Claim verification

## QLT2-17 — Divisibility claim verification

```text
Underlying authority: direct divisibility checking
Answer semantic:      TRUTH_CLAIM
Task:                 select the correct or incorrect displayed claim
Parameter:            requested polarity
```

---

## 2. Explicit non-templates

```text
leading missing digit             → candidate-domain parameter
largest/smallest direction        → extremum parameter
least/greatest direction          → boundary parameter
primitive/composite divisor       → rule-family parameter
table or mini-caselet             → presentation adapter
optional pair relation            → pair-state parameter
ordinary wording                  → stem family
language                          → localisation layer
```

---

## 3. Rejected, reassigned or held evidence

### Rejected as decorative CP-003 inference

```text
fully visible exact sum with X already fixed by arithmetic
fully visible exact difference with X already fixed by arithmetic
fully visible exact product with X already fixed by arithmetic
```

### Referred to NUM-CP-008

```text
least repunit length
modular-power divisibility
```

### Ownership-held outside the 17 count

```text
multi-divisor inclusion–exclusion
power-difference identity
odd power-sum identity
repeated-block factor identity
```

### Other checkpoint ownership

```text
hidden divisor/quotient/dividend  → NUM-CP-007
same-remainder greatest divisor   → NUM-CP-006
common-multiple range count        → NUM-CP-006
count digit arrangements           → P&C
```

---

## 4. Runtime architecture count

```text
A  apply divisibility rule                  1
B  single-digit candidate set               1
C  ordered-pair candidate set               1
D  digit-bound multiple                      1
E  one-divisor range count                   1
F  implicit repeated numeral                 1
G  linked arithmetic–divisibility            1
------------------------------------------------
Numerical solve authorities:                 7
Numerical/task templates:                   15
Representation templates:                   2
Provisional learner templates:              17
Permanent QLs:                               0
```

---

## 5. Next architecture step

The revised proposal authorises only a temporary 17-row registry and consolidated retained-runtime proof. It does not authorise permanent IDs or production exposure.

```text
Provisional template count: 17
Permanent QLs:                0
Freeze decision:             NOT YET MADE
```
