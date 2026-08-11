# INT-CP-002 — Final Saturation and Permanent-QL Proposal

Status: **final English review candidate; not frozen, staged, registered or published**  
Chapter: `INT-001 — Simple & Compound Interest`  
Checkpoint: `INT-CP-002 — Simple-Interest Comparisons, Interval Ledgers and Multiple Sums`

This checkpoint replaces any further numbered development waves. It combines the remaining representation, edge, source, inverse and ownership work into one closing audit.

## 1. Inputs retained

The final candidate reuses all previously proven executable authorities:

- eight Wave-1 direct/architecture ancestries;
- thirteen Wave-2 inverse ancestries;
- exact rational contribution-ledger foundation;
- independent contribution-by-contribution verification;
- V2 TeX-safe learner rendering;
- expanded partial-repayment event-time algebra;
- CP-001 Question Studio pre-registration isolation.

## 2. Final closure contracts added

Ten gaps survived the pre-freeze audit and received executable contracts:

1. final amount after a piecewise-rate ledger;
2. principal inverse from a piecewise-rate ledger;
3. difference between two complete simple-interest ledgers;
4. ratio of the two parts in a split-principal allocation;
5. principal ratio under an equal-interest relation;
6. original duration from a counterfactual time extension;
7. interest saving from earlier versus later partial repayment;
8. principal inverse from a borrowing/lending rate spread;
9. duration inverse from a borrowing/lending rate spread;
10. explicit 360-day versus 365-day basis comparison.

These are not arbitrary additions. Each changes an unknown position, answer semantic, ledger topology, event/comparison contract or misconception profile that was not already represented by the first 21 executable ancestries.

## 3. Proposed permanent inventory

The exhaustive proposal contains 31 permanent English contracts:

```text
INT-QL-022 through INT-QL-052
```

### Piecewise and ledger comparison

```text
INT-QL-022  find piecewise total interest
INT-QL-023  find piecewise final amount
INT-QL-024  recover piecewise principal
INT-QL-025  recover a missing interval rate
INT-QL-026  recover a missing interval duration
INT-QL-027  compare two complete SI ledgers
```

### Multiple deposits

```text
INT-QL-028  find combined interest
INT-QL-029  recover a missing principal
INT-QL-030  recover a missing rate
INT-QL-031  recover a missing duration
INT-QL-032  recover a common rate
```

### Split principal and equal interest

```text
INT-QL-033  recover one split-principal part
INT-QL-034  recover the split-principal ratio
INT-QL-035  recover equal-interest principal
INT-QL-036  recover equal-interest rate
INT-QL-037  recover equal-interest duration
INT-QL-038  recover equal-interest principal ratio
```

### Counterfactual change

```text
INT-QL-039  find the interest change
INT-QL-040  recover the original rate
INT-QL-041  recover the original duration
```

### Partial repayment

```text
INT-QL-042  find total interest after repayment
INT-QL-043  recover the repayment amount
INT-QL-044  recover the repayment time
INT-QL-045  compare early and late repayment
```

### Borrow/lend spread

```text
INT-QL-046  find net interest gain
INT-QL-047  recover the lending rate
INT-QL-048  recover the principal
INT-QL-049  recover the duration
```

### Declared day-count basis

```text
INT-QL-050  find interest for declared days
INT-QL-051  recover the number of days
INT-QL-052  compare declared 360/365 bases
```

## 4. Merge and representation decisions

The following remain parameters or presentation variants, not separate QLs:

- narrative, table, timeline and comparison-card rendering;
- year/month/day display when the underlying contract is unchanged;
- different-duration split principal within the same allocation authority;
- extra-interest versus interest-saved wording;
- which-plan-is-greater versus by-how-much comparison direction;
- contextual changes involving people, banks, currencies or deposit stories.

## 5. Reassignment and rejection decisions

Reassigned outside CP-002:

- equal recurring instalments → `INT-CP-008`;
- heterogeneous dated cash flows and equated dates → `INT-CP-009`;
- commercial sale margin → Profit & Loss;
- capital-time profit sharing → Partnership;
- true discount and banker's discount → separate commercial-discount authority.

Rejected as permanent learner contracts:

- any day-count question with an unstated 360/365 convention;
- zero-length intervals;
- repayment at the final horizon with no mathematical effect;
- three-part split systems without a source-backed unique inverse;
- two-repayment systems without evidence of a distinct competitive-exam contract.

## 6. Runtime and review boundary

The proposed registry and runtime are review-only:

```text
releaseCandidateId:          INT-CP-002-EN-v1-candidate
reviewStatus:                FINAL_ENGLISH_REVIEW_CANDIDATE
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Permanent freeze requires:

1. exact-head executable audit;
2. complete source/ownership/representation disposition proof;
3. manual inspection of the 124-question review artifact;
4. correction of any learner-facing defect without changing mathematics;
5. explicit approval before a separate immutable freeze wrapper.

No further numbered wave is planned. Any failure now is handled as a defect or a specific uncovered contract inside this final checkpoint.
