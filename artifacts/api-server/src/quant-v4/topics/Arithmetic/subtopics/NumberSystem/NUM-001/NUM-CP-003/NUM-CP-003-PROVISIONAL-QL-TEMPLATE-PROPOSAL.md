# NUM-CP-003 — Provisional QL-Template Proposal

**Status:** count-bearing proposal for review; not frozen  
**Checkpoint:** `NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints`  
**Provisional learner templates:** 22  
**Permanent `NUM-QL-*` identities:** 0  
**Frozen solve authorities:** 0

Temporary labels `QLT-01` through `QLT-22` exist only inside this proposal. They are not Question Language IDs and must never appear in Question Studio, Question Bank, tests or learner content.

---

## 1. Compression model

```text
Seven numerical solve authorities
  → twenty learner task templates
  → two representation templates
  = twenty-two provisional QL templates
```

A shared solver does not force shared QLs when the learner's target, answer semantic, uniqueness predicate or misconception profile changes.

---

# Authority A — Apply or recognise divisibility rules

## QLT-01 — Select a divisor or non-divisor of a visible number

```text
Authority:          APPLY_OR_RECOGNISE_DIVISIBILITY_RULE
Task direction:     number → divisor/non-divisor
Answer semantic:    DIVISOR
Parameters:         polarity, primitive/composite divisor, number length
Uniqueness:         exactly one displayed option satisfies requested polarity
```

Retains the direct composite-divisibility foundation. Primitive rules are generated through the same authority.

## QLT-02 — Identify divisor from a stated rule

```text
Authority:          APPLY_OR_RECOGNISE_DIVISIBILITY_RULE
Task direction:     rule → divisor
Answer semantic:    DIVISOR
Uniqueness:         one registered divisor matches the complete stated rule
```

## QLT-03 — Identify rule from a stated divisor

```text
Authority:          APPLY_OR_RECOGNISE_DIVISIBILITY_RULE
Task direction:     divisor → rule
Answer semantic:    RULE
Uniqueness:         one displayed rule is valid for the stated divisor
```

### Authority-A merge rule

Ordinary prose, rule cards and simple tables are presentations. Positive/negative claim selection is QLT-22 because it changes the evidence and truth-claim answer contract.

---

# Authority B — Resolve a single-digit candidate set

Shared exact state:

```text
template
candidate domain 0..9 or 1..9
stated divisor
complete valid-digit set
requested projection
```

## QLT-04 — Find the unique valid missing digit

```text
Task direction:     inverse reconstruction
Answer semantic:    DIGIT
Uniqueness:         valid set size = 1
```

Leading X is a candidate-domain edge, not another template.

## QLT-05 — Find the largest valid digit

```text
Answer semantic:    DIGIT
Target predicate:   maximum(valid set)
Precondition:       valid set size ≥ 2
```

## QLT-06 — Find the smallest valid digit

```text
Answer semantic:    DIGIT
Target predicate:   minimum(valid set)
Precondition:       valid set size ≥ 2
```

## QLT-07 — Count all valid digits

```text
Answer semantic:    COUNT
Target predicate:   cardinality(valid set)
```

## QLT-08 — Find the sum of all valid digits

```text
Answer semantic:    DIGIT_SUM
Target predicate:   sum(valid set)
```

## QLT-09 — Return the complete valid-digit set

```text
Answer semantic:    DIGIT_SET
Target predicate:   exact set equality
Option rule:        no duplicate semantic sets under reordered display
```

## QLT-10 — Form the greatest valid completed number

```text
Answer semantic:    NUMBER
Target predicate:   maximum(completed numerals)
```

The answer is the complete numeral, not merely the replacement digit.

## QLT-11 — Form the smallest valid completed number

```text
Answer semantic:    NUMBER
Target predicate:   minimum(completed numerals)
Leading-zero rule:  completed numeral must preserve stated length
```

### Authority-B split rule

The eight templates remain distinct because their answer dimensions are materially different:

```text
DIGIT
COUNT
DIGIT_SUM
DIGIT_SET
NUMBER
```

Largest/smallest and greatest/smallest also carry opposite-extremum misconception families.

---

# Authority C — Resolve ordered missing-digit pairs

Shared exact state:

```text
template containing X and Y
candidate domain of 100 ordered pairs
one or more divisibility constraints
optional digit-sum or arithmetic relation
complete valid ordered-pair set
```

## QLT-12 — Find the unique ordered digit pair

```text
Answer semantic:    ORDERED_DIGIT_PAIR
Uniqueness:         valid pair set size = 1
```

The presence or absence of an auxiliary relation is a state parameter.

## QLT-13 — Count all valid ordered pairs

```text
Answer semantic:    COUNT
Target predicate:   cardinality(valid pair set)
```

## QLT-14 — Return the complete ordered-pair set

```text
Answer semantic:    ORDERED_PAIR_SET
Target predicate:   exact ordered-pair set equality
```

This is advanced and should not dominate routine exam distribution.

## QLT-15 — Classify the pair solution set

```text
Answer semantic:    SOLUTION_CLASS
Classes:            NO_SOLUTION | UNIQUE_SOLUTION | MULTIPLE_SOLUTIONS
```

### Authority-C merge rule

Swapping X and Y is not equivalent. Ordered-pair semantics are preserved throughout solver, options and explanation.

---

# Authority D — Find a digit-bound multiple

Shared exact state:

```text
digit length
stated divisor
lower or upper decimal boundary
search direction
exact boundary multiple
```

## QLT-16 — Find the least n-digit multiple

```text
Answer semantic:    NUMBER
Direction:          first multiple at or above 10^(n−1)
```

## QLT-17 — Find the greatest n-digit multiple

```text
Answer semantic:    NUMBER
Direction:          last multiple at or below 10^n−1
```

These share one boundary engine but remain separate learner templates because direction and distractor behaviour differ.

---

# Authority E — Count a one-divisor range

## QLT-18 — Count multiples of one divisor in an inclusive range

```text
Authority:          COUNT_RANGE_BY_ONE_DIVISOR
Answer semantic:    COUNT
Visible state:      lower bound, upper bound, divisor
Boundary rule:      both endpoints interpreted explicitly as inclusive
```

This includes counts of n-digit multiples by using decimal digit boundaries.

Excluded from this template:

- one-but-not-another;
- either/neither/exactly-one;
- three-divisor inclusion–exclusion;
- common multiples governed by LCM.

---

# Authority F — Test a concrete repeated numeral

## QLT-19 — Test direct divisibility of a concrete repeated numeral

```text
Authority:          TEST_REPEATED_NUMERAL_DIVISIBILITY
Answer semantic:    DIVISOR or TRUTH_CLAIM
Visible state:      source block, repeat count, completed numeral or exact construction
```

This remains distinct from general repeated-block factor identities. It directly tests the concrete number.

---

# Authority G — Linked arithmetic–divisibility reconstruction

## QLT-20 — Resolve a linked arithmetic–divisibility extremum

```text
Authority:          RESOLVE_LINKED_ARITHMETIC_DIVISIBILITY
Answer semantic:    DIGIT
Visible state:      arithmetic relation linking A and B; result divisibility
Target:             largest or smallest admissible A
```

Required generation proof:

1. arithmetic alone leaves multiple ordered pairs;
2. divisibility removes at least one pair;
3. at least two valid pairs remain;
4. the requested extremum is unique;
5. independent 100-pair enumeration reproduces the answer.

A question failing condition 1 or 2 is decorative-divisibility arithmetic and is rejected.

---

# Representation template R1 — Data sufficiency

## QLT-21 — Missing-digit data sufficiency

```text
Underlying authority: single-digit candidate set
Answer semantic:      SUFFICIENCY_CLASS
Supported outcomes:
- Statement I alone
- Statement II alone
- each statement alone
- both together only
- even together insufficient
```

The product must use one stable option convention across chapters.

---

# Representation template R2 — Claim verification

## QLT-22 — Divisibility claim verification

```text
Underlying authority: direct divisibility checking
Answer semantic:      TRUTH_CLAIM
Task:                 select the correct or incorrect displayed claim
```

Positive and negative polarity are parameters.

---

## 2. Explicit non-templates

The following do not increase the count:

```text
leading missing digit              → domain edge of QLT-04..11
table layout                       → presentation adapter
mini-caselet                       → presentation adapter
primitive vs composite rule        → authority parameter
optional digit-sum relation        → pair-state parameter
ordinary wording variation         → stem family
language                           → localisation layer
```

---

## 3. Rejected or reassigned evidence

### Rejected

```text
missing digit in fully visible exact sum
missing digit in fully visible exact difference
missing digit in fully visible exact product
```

when arithmetic alone fixes the digit.

### Referred to NUM-CP-008

```text
least repunit length
modular-power divisibility
```

### Ownership-held outside the 22 count

```text
multi-divisor inclusion–exclusion
power-difference identity
odd power-sum identity
repeated-block factor identity
```

### Other checkpoint ownership

```text
hidden divisor/quotient/dividend       → NUM-CP-007
same-remainder greatest divisor        → NUM-CP-006
common-multiple range count             → NUM-CP-006
count digit arrangements                → P&C
```

---

## 4. Proposed runtime authority count

```text
A  apply/recognise rule                   1
B  single-digit candidate set             1
C  ordered-pair candidate set              1
D  digit-bound multiple                    1
E  one-divisor range count                 1
F  concrete repeated numeral               1
G  linked arithmetic–divisibility          1
------------------------------------------------
Numerical solve authorities:               7
Representation adapters:                   2
Learner templates:                         22
```

---

## 5. Approval gate

Approval of this proposal would authorise the next architecture step only:

- create a stable 22-row template registry using temporary internal labels;
- define exact solver/validator ownership for seven authorities;
- create a retained runtime plan;
- produce permanent-ID allocation sequencing.

Approval would **not** by itself authorise:

- permanent `NUM-QL-*` IDs;
- Question Studio discovery;
- Question Bank storage;
- test eligibility;
- Hindi/Punjabi production localisation;
- public publishing.

```text
Provisional template count:       22
Permanent QLs:                     0
Freeze decision:                 PENDING REVIEW
```
