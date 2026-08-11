# INT-CP-001 — Executable Discovery Checkpoint 01

Status: **prototype foundation implemented; CI and review pending**

## Admitted temporary contracts

The first wave contains 16 `INT-CP001-PROT-*` contracts covering:

- direct simple interest;
- direct amount;
- principal inverse from interest;
- principal inverse from amount;
- rate inverse from interest;
- rate inverse from amount;
- time inverse from interest;
- time inverse from amount;
- month conversion;
- stated 365-day conversion;
- annual-interest reconstruction;
- proportional subduration interest;
- rate/time inversion from an amount multiple;
- time/rate inversion from an interest-to-principal ratio.

These are admitted to executable discovery only. None is a permanent QL.

## Exactness decisions

- `bigint` rational values are canonical;
- money, percentages and durations are derived exactly;
- direct and inverse solutions use no floating arithmetic;
- principal inverses are checked over a declared ₹100 grid;
- rate and time inverses are checked over approved finite exact domains;
- each inverse requires exactly one matching admissible candidate.

## Lifecycle decisions

Every generated item remains:

```text
reviewStatus:        UNREVIEWED
questionBankStatus:  NOT_STORED
testEligibility:     INELIGIBLE
publiclyPublishable: false
permanentQlId:       null
```

## Next checkpoint

After exact-head CI and English pack inspection, classify each prototype as retain, merge, split, defer, reassign or reject. Then perform the missing-variable, representation, amount-multiple and legacy-fixture gap audits before any permanent QL allocation.
