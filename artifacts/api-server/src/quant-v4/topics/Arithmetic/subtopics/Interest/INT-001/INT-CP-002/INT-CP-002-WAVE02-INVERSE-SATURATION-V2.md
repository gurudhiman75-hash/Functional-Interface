# INT-CP-002 — Wave 2 Inverse Saturation V2

Status: **executable discovery authority; permanent QL allocation remains closed**  
Checkpoint: `INT-CP-002 — Simple-Interest Comparisons, Interval Ledgers and Multiple Sums`  
Runtime authority: `INT-CP-002-WAVE02-INVERSE-SATURATION-V2`

## Provisional inverse space

Wave 2 implements thirteen provisional inverse modes:

1. missing rate in a piecewise-rate ledger;
2. missing duration in a piecewise-rate ledger;
3. missing principal in a multi-deposit ledger;
4. missing rate in a multi-deposit ledger;
5. missing duration in a multi-deposit ledger;
6. common rate across multiple deposits;
7. equal-interest missing rate;
8. equal-interest missing duration;
9. original rate from additional interest;
10. repayment amount from total interest;
11. repayment event time from total interest;
12. lending rate from borrowing rate and net gain;
13. missing number of days under a declared day-count basis.

These modes remain provisional. They do not allocate permanent QLs or freeze final solve contracts.

## Exact inverse contract

Every generated question provides:

- valid-state-first hidden generation;
- exact rational inverse answer;
- deterministic bounded recovery;
- four distinct misconception-owned options;
- independent mode-specific reconstruction of the complete ledger;
- exactly one option accepted by the independent verifier;
- calculation-rich English explanation;
- actual values substituted into every governing equation;
- intermediate arithmetic or algebra;
- numerical verification;
- all three wrong options explained;
- TeX-safe learner output;
- complete lifecycle and registry locks.

## V1 pedagogical finding and V2 remediation

The first human-review artifact showed that the repayment-event-time mode wrote the complete two-segment equation but moved directly from that equation to the result.

The underlying mathematics and options were correct, but the learner explanation did not show the requested expansion and coefficient isolation. V1 is therefore superseded for review.

V2 preserves exactly:

- stems;
- hidden mathematical state;
- solutions;
- option values and order;
- correct indices;
- misconception audit;
- difficulty and answer semantics;
- independent verification behaviour.

For every repayment-time question, V2 now shows:

1. remaining principal;
2. complete two-segment equation;
3. numeric substitution and multiplication by 100;
4. explicit expansion and collection of the time coefficient;
5. final numerical division producing the event time.

## Executable proof

```text
Head:       b2e5016ec6ebcf60adbf82913cc6dc6ac1906890
Workflow:   Validate INT-CP-002 Wave 2 inverse saturation
Run:        30749894294
Conclusion: PASS
Artifact:   8834092505
Digest:     sha256:ba2bb4ccf8712dd630c01181028a6e7125a756f3af9b432c37ea7ec2439ae092
```

### Mathematical saturation audit

```text
Questions:                       1,300
Deterministic checks:            1,300
Structural checks:              10,400
Independent option checks:       5,200
Wrong-option rejections:         3,900
Explanation checks:              6,500
Math-integrity checks:           6,500
Lifecycle checks:                9,100
Recovered seeds:                    23
Maximum generation attempts:         2 / 32
Answer positions:       304 / 323 / 326 / 347
```

All thirteen modes, all four answer semantics, Medium/Hard states and all four answer positions were covered. Every prototype produced at least 37 distinct stems across 100 audited seeds.

### V1-to-V2 identity and explanation audit

```text
Questions:                       1,300
Deterministic V2 checks:         1,300
Frozen-mathematics checks:      10,400
Independent option checks:       5,200
Wrong-option rejections:         3,900
TeX-integrity checks:            5,200
Expanded event-time checks:      1,600
```

## Human-review pack V2

```text
Questions:                         78
Samples per provisional mode:       6
Distinct stems:                    78
Answer positions:       20 / 19 / 19 / 20
Answer semantics:                    4
Minimum worked steps:                4
Maximum worked steps:                5
Total worked steps:                318
Expanded repayment-time questions:  6
Control characters:                  0
Learner trace leakage:               0
```

Manual artifact inspection confirmed clean equations for all mode families and fully expanded repayment-time algebra.

## Lifecycle boundary

```text
Permanent QLs:              0
Frozen solve contracts:     0
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

## Next wave

Wave 3 will perform representation, edge-state and ownership saturation before any merge/split proposal or permanent QL allocation.
