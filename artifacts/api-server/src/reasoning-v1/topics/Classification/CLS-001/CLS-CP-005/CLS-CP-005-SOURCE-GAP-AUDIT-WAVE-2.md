# CLS-CP-005 — Source-Gap Audit and Wave 2

Status: `MEANINGFUL_SOURCE_GAP_FOUND__PERMANENT_FREEZE_BLOCKED`

Permanent QLs: `0`

## Audit trigger

The product owner approved `Simple Option Explanations V3` as the English editorial baseline. The next required gate was source-gap closure before permanent learner-contract allocation.

## Source finding

A recurring Number Classification form presents complete ordered pairs in which the second member is derived from the decimal digits of the first member. A direct source example uses:

```text
34 : 12
67 : 54
57 : 35
48 : 32
```

The common relation is:

```text
product of the digits of the first number = second number
```

The pair `67 : 54` is the outlier because `6 × 7 = 42`, not `54`.

Source control:

- uploaded reference: `reasoning_aggarwal.pdf`;
- chapter: Classification / Number Classification;
- example family: pair classification based on the product of digits of the first member.

## Why this is a real CP-005 gap

This form is not owned by CP-004 merely because it uses digits. The displayed answer object is a complete ordered pair and the learner evaluates an internal relation between the two members. Therefore it has the same answer object and mismatch proof as the existing odd-number-tuple contract.

It is also not Numeric Analogy because there is no incomplete target and no source-to-target transfer. Every option is a complete pair and one pair must be classified as different.

## Missing bounded relation

Wave 1 contains pair-level whole-number rules such as difference, ratio, sum, product, GCD, LCM, square, cube and reversal. It does not contain a rule in which the decimal digits of one member generate the other member.

The first mandatory Wave 2 rule is:

```text
PAIR_FIRST_DIGIT_PRODUCT_TO_SECOND
```

Formal contract:

1. the first member must contain exactly two decimal digits;
2. neither digit is hidden or inferred;
3. multiply the tens digit by the units digit;
4. the result must equal the second member;
5. pair order is fixed;
6. the reverse relation is not accepted unless separately declared;
7. pairs with leading-zero interpretation are prohibited;
8. the ambiguity verifier must enumerate this rule together with the complete existing registry.

## Additional candidates requiring source confirmation

The following are plausible adjacent forms but are not admitted merely by analogy or formula availability:

- sum of digits of first member equals second;
- absolute difference of digits of first member equals second;
- exact digit quotient of first member equals second;
- sum or product of digits of second member equals first;
- three-digit digit transforms.

Each candidate requires direct Classification evidence, a bounded domain and a collision audit. Analogy-only evidence is insufficient.

## Boundary effect

The new relation does **not** currently justify a third learner contract. It remains an instance rule inside:

```text
find the odd number tuple
```

It may also be admitted to reference-set matching only after the equivalent-set audit proves natural, unambiguous candidate construction.

## Wave 2 acceptance gates

Before CP-005 can freeze:

- implement the source-backed digit-product pair rule;
- construct odd-pair states with four and five options;
- test equivalent-set matching separately rather than assuming admission;
- include the new rule in complete competing-rule enumeration;
- reject surface giveaways caused by digit length or second-member scale;
- provide simple V3 option explanations;
- audit deterministic replay, every answer position and difficulty coverage;
- regenerate the English review artifact;
- repeat the no-meaningful-source-gap audit.

## Current decision

```text
Human editorial review:                 APPROVED_V3_BASELINE
Source-gap closure:                     FAILED__ONE_MEANINGFUL_GAP_FOUND
Provisional learner-contract shapes:    2
Permanent QLs:                          0
English freeze:                         BLOCKED
Question Studio exposure:               disabled
Question Bank storage:                  disabled
Test/publication eligibility:           disabled
```

No permanent identity may be allocated until Wave 2 and the repeated source-gap audit are complete.
