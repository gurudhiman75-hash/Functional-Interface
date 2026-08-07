# SAP-CP-003 Wave 01 — Executable Discovery Implementation

## Checkpoint

`SAP-CP-003 — Decimals, Percentages and Exact Representation Switching`

## Authority

Implementation follows `SAP-CP-001-TO-CP-012-SCOPE-AUTHORITY.md`.

The checkpoint owns exact arithmetic when decimal, fraction, recurring-decimal or percentage representation switching is the central calculation method. It does not own percentage applications, recurring-decimal theory, decimal termination classification or general algebra.

## Implemented executable families

1. terminating-decimal expressions;
2. mixed decimal-and-fraction expressions;
3. decimal products and place value;
4. division by powers of ten;
5. division by compatible decimal factors;
6. percentages as numeric factors;
7. scoped percentage-of blocks;
8. mixed percentage, fraction and decimal expressions;
9. conversion to fractions before evaluation;
10. conversion to decimals before evaluation;
11. benchmark fraction-decimal equivalences;
12. recurring decimals inside larger expressions;
13. complementary percentage factors;
14. successive percentage factors as pure arithmetic;
15. missing decimal operands;
16. missing percentage literals in fixed arithmetic;
17. comparison across fraction, decimal and percentage forms;
18. correct decimal-placement selection;
19. first incorrect representation-conversion step.

## Exactness model

- terminating decimals are parsed as scaled integers over powers of ten;
- percentages are exact decimal values divided by 100;
- supported recurring decimals are reconstructed as exact rationals;
- every canonical answer is compared with an independently computed answer;
- floating point is not used for equality or option construction.

## Review model

The review artifact contains only:

- question;
- four options;
- correct answer.

Explanations and validation evidence remain in runtime packages and authority logs so the review file remains small.

## Validation target

```text
19 prototypes × 100 seeds = 1,900 generated packages
300 unique compact review questions
4 unique options per question
1 correct option per question
balanced A/B/C/D positions within every prototype
```

## Lifecycle

```text
permanentQlId:              null
nextAvailableQlId:          SAP-QL-034
status:                     EXECUTABLE_DISCOVERY_HUMAN_REVIEW_PENDING
active:                     false
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```

No permanent QL allocation, English freeze, activation or publication is authorised by this wave.
