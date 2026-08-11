# INT-CP-002 — Wave 0 Exact Ledger Foundation

Status: **implemented foundation; permanent QL allocation remains closed**  
Checkpoint: `INT-CP-002 — Simple-Interest Comparisons, Interval Ledgers and Multiple Sums`  
Wave: `00 — exact contribution-ledger foundation`

## Implemented authority

Wave 0 establishes the reusable exact foundation for CP-002 executable discovery:

- exact rational contribution and ledger types;
- exact contribution validation;
- piecewise-rate and multiple-deposit summation;
- common-rate inverse;
- missing-principal inverse;
- missing-duration inverse;
- split-principal inverse;
- two-ledger comparison;
- declared 365-day, 360-day and explicit day-count conversion;
- exact outstanding-balance segments for explicit partial repayments;
- independent contribution-by-contribution verification.

No permanent QL or final solve-contract inventory is created by this wave.

## Solver and verifier separation

The canonical ledger computes each contribution through the weighted expression:

```text
I_i = P_i(R_iT_i)/100
```

The independent verifier reconstructs annual interest first and then applies duration:

```text
annual interest_i = P_iR_i/100
I_i = annual interest_i × T_i
```

Inverse candidates are substituted into the complete contribution ledger. The verifier does not trust a stored target, canonical weighted coefficient or displayed answer.

## Covered foundation states

The executable proof covers:

- one principal across successive rates;
- multiple independent deposits;
- common-rate recovery;
- missing-principal recovery;
- missing-duration recovery;
- split-principal allocation;
- comparison of two complete ledgers;
- one explicit partial repayment and remaining-balance segmentation;
- actual/365, commercial/360 and explicit day-count bases;
- rejected duration/start-end mismatch;
- rejected indeterminate split coefficient;
- rejected unordered repayment events;
- rejected missing explicit day-count denominator.

## First executable proof

```text
Head:       960c8f6641517e0d72d3aa7e1188ce0173ddb4e9
Workflow:   Validate INT-CP-002 Wave 0 ledger foundation
Run:        30748468008
Conclusion: PASS
Artifact:   8833650709
Digest:     sha256:ae6861e8bfe170deb7328be4377421076b1db89ce349f0fe00adcf51131a039f
```

```text
Exact ledger checks:          11
Inverse checks:                5
Independent verifier checks:   7
Tamper rejection checks:       3
Invalid-state checks:          4
Day-count checks:              3
Event-order checks:            4
Central-registry checks:       3
```

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

## Next implementation wave

Wave 1 will add architecture-establishing English prototypes across the currently justified ancestries. Prototype count remains open and no permanent QL IDs will be allocated.
