# NUM-CP-003 — Independent Second-Pass Boundary Review

**Review result:** `APPROVE_WITH_MERGES_OR_SPLITS`  
**First-pass proposal:** 22 learner templates  
**Revised proposal:** 17 learner templates  
**Permanent QLs:** 0

This review re-applies the chapter merge/split protocol to the first count-bearing proposal. It compares givens, unknown, governing invariant, algorithm, answer semantic, uniqueness proof, misconception profile and explanation strategy. Prototype ancestry and historical Quant V3 CP boundaries are evidence, not automatic V4 QL boundaries.

---

## 1. Decisions that remain unchanged

The following answer contracts remain materially distinct:

- unique missing digit;
- extremum valid digit;
- count of valid digits;
- sum of valid digits;
- complete valid-digit set;
- extremum completed number;
- unique ordered pair;
- ordered-pair count;
- complete ordered-pair set;
- no/unique/multiple pair classification;
- one-divisor range count;
- linked arithmetic/divisibility extremum;
- data sufficiency;
- claim verification.

They may share exact authorities, but their answer semantics, uniqueness predicates or wrong-answer spaces differ.

The seven numerical authorities also remain unchanged.

---

## 2. Remove two meta-rule templates from the learner count

First-pass rows:

```text
QLT-02 — identify divisor from a stated rule
QLT-03 — identify rule from a stated divisor
```

### Finding

The current source record proves that divisibility rules must be taught and applied. It does not establish a distinct recurring exam contract whose target is the name of a rule or divisor merely from a classroom-style rule description.

The approved end-to-end CP-003 baseline includes:

- direct primitive-rule application;
- composite-rule application;
- divisor/non-divisor selection;

but not a separate meta-identification family.

### Disposition

```text
REMOVE_FROM_PROVISIONAL_LEARNER_QL_COUNT
```

The Wave 04 prototypes remain useful:

- study-mode concept checks;
- rule-registry tests;
- explanation-selection tests;
- future source evidence.

They do not receive retained QL-template rows now.

Count effect:

```text
22 → 20
```

---

## 3. Merge largest and smallest valid digit

First-pass rows:

```text
QLT-05 — largest valid digit
QLT-06 — smallest valid digit
```

### Comparison

```text
Givens:                identical
Unknown:               one digit
Governing invariant:   complete valid candidate set
Algorithm:             enumerate and filter candidates
Answer semantic:       DIGIT
Uniqueness proof:      one extremum of a finite non-empty set
Explanation strategy: recover set, select extremum
Difference:            direction = MAXIMUM or MINIMUM
```

The opposite-extremum distractor exists in both directions and is generated from one misconception family.

### Decision

Merge as:

```text
FIND_EXTREMUM_VALID_DIGIT
extremumDirection: LARGEST | SMALLEST
```

Count effect:

```text
20 → 19
```

---

## 4. Merge greatest and smallest completed number

First-pass rows:

```text
QLT-10 — greatest valid completed number
QLT-11 — smallest valid completed number
```

### Comparison

Both consume the same single-digit candidate set, map each candidate to its completed numeral and select one ordered extremum. The answer semantic is `NUMBER` in both cases. Leading-zero policy is part of candidate-domain validation, not a new QL.

### Decision

Merge as:

```text
FORM_EXTREMUM_VALID_NUMBER
extremumDirection: GREATEST | SMALLEST
```

Count effect:

```text
19 → 18
```

---

## 5. Merge least and greatest n-digit multiple

First-pass rows:

```text
QLT-16 — least n-digit multiple
QLT-17 — greatest n-digit multiple
```

### Comparison

```text
State:                 digit length and divisor
Answer semantic:       NUMBER
Authority:             digit-bound multiple
Boundary:              lower or upper decimal edge
Algorithm family:      nearest valid multiple at requested edge
Difference:            search direction only
```

The original end-to-end design already describes this as one mode:

```text
findLeastOrGreatestNumberInDigitRangeDivisibleByK
```

### Decision

Merge as:

```text
FIND_EXTREMUM_N_DIGIT_MULTIPLE
extremumDirection: LEAST | GREATEST
```

Count effect:

```text
18 → 17
```

---

## 6. Tighten the repeated-numeral boundary

The repeated-numeral template remains retained only when the learner must construct or reason about a numeral from:

```text
source block + repeat count
```

If the complete numeral is already displayed and no place-value construction is needed, the task merges into ordinary divisor/non-divisor selection.

Revised retained contract:

```text
TEST_IMPLICIT_REPEATED_NUMERAL_DIVISIBILITY
```

This clarification does not change the count.

---

## 7. Single-digit multiple-constraint clarification

The single-digit authority must accept one or more divisibility constraints:

```ts
divisors: readonly bigint[]
```

Displaying “divisible by 8 and 9” versus “divisible by 72” may change wording and explanation evidence, but does not automatically create another QL when the candidate-set contract is unchanged.

This clarification does not change the count.

---

## 8. Revised compressed inventory

```text
Numerical authorities:          7
Numerical/task QL templates:   15
Representation QL templates:    2
----------------------------------
Provisional learner templates: 17
Permanent QLs:                  0
```

The 17 rows are:

1. select divisor or non-divisor;
2. unique valid missing digit;
3. extremum valid digit;
4. count valid digits;
5. sum valid digits;
6. complete valid-digit set;
7. extremum valid completed number;
8. unique ordered digit pair;
9. count ordered digit pairs;
10. complete ordered-pair set;
11. classify pair solution set;
12. extremum n-digit multiple;
13. count multiples of one divisor in an inclusive range;
14. test an implicitly constructed repeated numeral;
15. linked arithmetic/divisibility extremum;
16. missing-digit data sufficiency;
17. divisibility claim verification.

---

## 9. Review conclusion

```text
First-pass proposal:            22
Removed unsupported meta tasks:  2
Merged direction-only pairs:      3
Revised proposal:                17
Permanent IDs:                    0
```

The revised 17-template proposal is more consistent with the chapter-wide rule that query direction, extremum polarity and ordinary presentation variation remain parameters unless they change the governing inference or answer contract.
