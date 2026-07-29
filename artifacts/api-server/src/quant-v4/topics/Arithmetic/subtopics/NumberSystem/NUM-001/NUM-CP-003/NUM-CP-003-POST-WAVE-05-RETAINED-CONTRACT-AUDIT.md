# NUM-CP-003 — Post-Wave-05 Retained-Contract Audit

**Status:** source-saturated provisional compression  
**Executable waves:** 01–05  
**Temporary executable contracts reviewed:** 38  
**Permanent QLs:** 0  
**Frozen solve authorities:** 0

This audit replaces prototype counting with a retained-contract ledger. A temporary contract may be retained, merged, rejected, reassigned or held for ownership review.

---

## 1. Inventory arithmetic

```text
Temporary executable contracts:                  38
Reject as decorative CP-003 inference:            3
Refer directly to NUM-CP-008:                     2
Hold multi-divisor range ownership:               5
Hold algebraic/modular identity ownership:         3
----------------------------------------------------
Retained or provisionally eligible contracts:     25
Merge duplicate governing contracts:              3
----------------------------------------------------
Provisional learner-template proposal:            22
```

No line in this arithmetic authorises permanent IDs.

---

## 2. Rejected contracts

```text
NUM-CP003-W2-PROT-MISSING-DIGIT-IN-SUM
NUM-CP003-W3-PROT-MISSING-DIGIT-IN-DIFFERENCE
NUM-CP003-W3-PROT-MISSING-DIGIT-IN-PRODUCT
```

Reason:

- the visible equality determines the hidden digit;
- divisibility is only a post-hoc property;
- removing the divisibility sentence does not change the answer.

Disposition:

```text
REJECT_AS_CP003_NUMERICAL_AUTHORITY
```

They remain negative-test evidence and must not receive permanent QLs.

---

## 3. Direct CP-008 referrals

```text
NUM-CP003-W2-PROT-LEAST-REPUNIT-LENGTH
NUM-CP003-W2-PROT-POWER-EXPRESSION-DIVISIBILITY
```

Their efficient governing engine is remainder recurrence or modular exponentiation. They must appear once under `NUM-CP-008`, not be duplicated in CP-003.

---

## 4. Multi-divisor range ownership hold

```text
NUM-CP003-W2-PROT-COUNT-ONE-NOT-ANOTHER
NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EITHER
NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-NEITHER
NUM-CP003-W3-PROT-COUNT-DIVISIBLE-BY-EXACTLY-ONE
NUM-CP003-W4-PROT-COUNT-THREE-DIVISORS-AT-LEAST-ONE
```

These use LCM and inclusion–exclusion as the main engine. They remain evidence for a later CP-003/CP-006/general set-counting decision and are excluded from the present CP-003 template count.

The one-divisor range-count contract remains eligible because no overlap engine is required.

---

## 5. Algebraic/modular identity ownership hold

```text
NUM-CP003-W3-PROT-GUARANTEED-POWER-DIFFERENCE-DIVISOR
NUM-CP003-W4-PROT-REPEATED-BLOCK-GUARANTEED-DIVISOR
NUM-CP003-W4-PROT-POWER-SUM-GUARANTEED-DIVISOR
```

The final answer is a divisor, but the governing inference may be factorisation or modular arithmetic. These remain outside the present count pending CP-008 and Algebra reconciliation.

Concrete repeated-numeral divisibility remains eligible because the visible numeral is directly tested.

---

## 6. Duplicate governing contracts merged

### 6.1 Leading missing digit

```text
NUM-CP003-W2-PROT-LEADING-MISSING-DIGIT
```

merges into unique single-digit reconstruction with candidate domain `1..9` instead of `0..9`.

### 6.2 Ordered pair with or without an auxiliary relation

```text
NUM-CP003-PROT-TWO-MISSING-DIGITS-MULTI-RULE
NUM-CP003-W2-PROT-TWO-DIGITS-NO-SUM
```

merge into one unique ordered-pair contract whose state may contain an optional digit-sum or arithmetic relation.

### 6.3 Data-sufficiency result-class waves

```text
NUM-CP003-W3-PROT-MISSING-DIGIT-DATA-SUFFICIENCY
NUM-CP003-W4-PROT-EACH-STATEMENT-ALONE-SUFFICIENT
```

merge into one data-sufficiency representation template supporting all five standard outcomes.

---

## 7. Retained numerical/task templates

### Rule and direct-divisibility surface

1. **Select divisor or non-divisor of a visible number**  
   Primitive/composite divisor and polarity are parameters.

2. **Identify divisor from a stated divisibility rule**

3. **Identify divisibility rule from a stated divisor**

### Single-digit candidate-set surface

4. **Find the unique valid missing digit**

5. **Find the largest valid digit**

6. **Find the smallest valid digit**

7. **Count all valid digits**

8. **Find the sum of all valid digits**

9. **Return the complete valid-digit set**

10. **Form the greatest valid completed number**

11. **Form the smallest valid completed number**

Leading position is a domain edge, not another template.

### Ordered-pair candidate-set surface

12. **Find the unique ordered digit pair**  
    Optional auxiliary relation and one-or-more divisibility constraints are state parameters.

13. **Count all valid ordered pairs**

14. **Return the complete ordered-pair set**

15. **Classify the pair solution set as none, unique or multiple**

### Boundary and range surface

16. **Find the least n-digit multiple**

17. **Find the greatest n-digit multiple**

18. **Count multiples of one divisor in an inclusive range**

### Repeated numeral and linked hybrid

19. **Test direct divisibility of a concrete repeated numeral**

20. **Resolve a linked arithmetic–divisibility extremum**  
    Arithmetic alone must leave multiple states and divisibility must materially reduce them.

---

## 8. Retained representation templates

21. **Missing-digit data sufficiency**  
    Supports Statement I alone, Statement II alone, each alone, both together only and even together insufficient.

22. **Divisibility claim verification**  
    Positive/negative claim selection over exact direct checks.

These share numerical authorities with ordinary questions but retain distinct visible-evidence and answer contracts.

---

## 9. Table and caselet conclusion

Table and mini-caselet layouts add no new numerical or answer contract. They remain future presentation adapters and do not increase the proposal beyond 22.

---

## 10. Coverage checks against source and legacy evidence

The 22-template proposal covers:

- all seven legacy V3 learner outputs;
- primitive and composite rules;
- direct and reverse rule recognition;
- one and two missing digits;
- leading-zero boundaries;
- extremum, count, sum, set and completed-number semantics;
- least/greatest digit-bound multiples;
- one-divisor range counts;
- direct repeated numerals;
- the uploaded SSC linked arithmetic/divisibility pattern;
- standard banking-style data sufficiency and claim representations.

Explicitly excluded or held:

- remainder targets;
- quotient/divisor/dividend reconstruction;
- HCF/LCM overlap counting;
- modular-power and repunit recurrence;
- algebraic identities;
- P&C digit-arrangement counts.

---

## 11. Decision

```text
Provisional learner templates:          22
Numerical/task templates:               20
Representation templates:               2
Permanent IDs:                           0
Frozen solve authorities:                0
Question Studio exposure:                0
```

The proposal may proceed to a count-bearing QL-template document. Permanent allocation still requires approval of the template boundaries and a final exact runtime architecture plan.
