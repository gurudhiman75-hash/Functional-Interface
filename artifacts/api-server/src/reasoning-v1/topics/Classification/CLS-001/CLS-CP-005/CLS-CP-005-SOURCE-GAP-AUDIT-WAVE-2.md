# CLS-CP-005 — Digit-Product Source Supplement

Status: `ODD_PAIR_EXECUTABLE__35_RULE_VERIFIED__EQUIVALENT_SET_OPEN`

Permanent QLs: `0`

## Source finding

A recurring Number Classification form presents complete ordered pairs in which the second member is derived from the decimal digits of the first member.

Source example:

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

`67 : 54` is the outlier because `6 × 7 = 42`, not `54`.

Source control:

- uploaded reference: `reasoning_aggarwal.pdf`;
- chapter: Classification / Number Classification;
- family: pair classification by product of the first member's digits.

## Ownership

This form is owned by CP-005 because every option is a complete ordered pair and the learner evaluates the internal relation between its two members.

It is not:

- CP-004 single-number classification;
- Numeric Analogy source-to-incomplete-target transfer;
- Series continuation;
- Missing Number completion.

## Bounded rule

```text
PAIR_FIRST_DIGIT_PRODUCT_TO_SECOND
```

Formal contract:

1. the first member contains exactly two decimal digits;
2. the first member does not end in zero;
3. multiply its tens digit by its units digit;
4. the product must equal the second member;
5. pair order is fixed;
6. leading-zero interpretations are prohibited;
7. every state is checked against the complete combined rule universe.

## Executable implementation

The odd-pair runtime now supports:

```text
Generated audit questions:            240
Unique visible questions:             240
Options:                           4 and 5
Stem forms:                            5
Answer positions:          28, 86, 58, 52, 16
Option explanations audited:          1040
Permanent QLs:                           0
```

Every option uses the approved Simple Option Explanations V3 structure:

```text
plain-language reason -> active digit calculation -> match/failure status
```

For example:

```text
(34, 12): Multiplying the two digits of 34 gives the second number 12.
\( 3 \times 4 = 12 \) — ✅ Matches rule.
```

## Combined ambiguity proof

The original isolated nineteen-rule proof has been retired. The digit-product runtime now uses the same independent verifier as all other CP-005 questions:

```text
Wave 1 rules:                     18
Generic source-gap Wave 2 rules: 16
Digit-product rule:               1
Complete competing-rule count:   35
```

Audit result:

```text
Expanded unique questions:       240 / 240
Alternate answer conflicts:        0
Intended rule recovered:         240 / 240
Maximum source-search attempt:      0
```

## Presentation proof

The answer-aware quality gate rejects scale giveaways.

```text
Maximum answer/common maximum ratio: 3.93
Maximum answer/common total ratio:   4.00
```

It also rejects duplicate pairs, unbalanced MathJax, math-only explanation blocks and incorrect match/failure labels.

## Boundary effect

The digit-product family remains a rule instance inside the provisional contract:

```text
find the odd number tuple
```

It does not justify a separate learner contract or QL.

Equivalent-set admission remains open. The presence of a valid odd-pair generator does not automatically prove that a reference-pair version is natural, sufficiently diverse or editorially useful.

## Current decision

```text
Source-backed odd-pair rule:              EXECUTABLE
Combined ambiguity proof:                 PASS__35_RULES
Simple V3 explanations:                   PASS
Answer-aware presentation proof:          PASS
Equivalent-set admission:                 PENDING_NATURALNESS_AUDIT
Permanent QLs:                            0
English freeze:                           BLOCKED_PENDING_WAVE_2_REVIEW
Question Studio exposure:                 disabled
Question Bank storage:                    disabled
Test/publication eligibility:             disabled
```

No permanent identity may be allocated until the generic Wave 2 review, this supplement review, equivalent-set decision and repeated no-meaningful-gap audit are complete.
