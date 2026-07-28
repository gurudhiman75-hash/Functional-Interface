# INT-001 / CP-001 Prototype Foundation Status

Status: **implementation complete; exact-head CI and manual editorial review pending**  
Branch: `feat/int-001-cp001-prototype-foundation`  
Base: `design/int-001-end-to-end-discovery`

## Safety inventory

```text
Permanent INT-QL IDs:       0
Prototype contracts:       16
Runtime language:          English only
Question Studio discovery: disabled
Question Bank status:      NOT_STORED
Test eligibility:          INELIGIBLE
Publicly publishable:      false
```

No prototype is a permanent QL or student question.

## Implemented non-QL contracts

```text
INT-CP001-PROT-SI-FROM-PRT
INT-CP001-PROT-AMOUNT-FROM-PRT
INT-CP001-PROT-PRINCIPAL-FROM-INTEREST
INT-CP001-PROT-PRINCIPAL-FROM-AMOUNT
INT-CP001-PROT-RATE-FROM-INTEREST
INT-CP001-PROT-RATE-FROM-AMOUNT
INT-CP001-PROT-TIME-FROM-INTEREST
INT-CP001-PROT-TIME-FROM-AMOUNT
INT-CP001-PROT-INTEREST-FOR-MONTHS
INT-CP001-PROT-INTEREST-FOR-DAYS
INT-CP001-PROT-ANNUAL-INTEREST-FROM-TOTAL
INT-CP001-PROT-INTEREST-FOR-SUBDURATION
INT-CP001-PROT-RATE-FROM-AMOUNT-MULTIPLE
INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE
INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE
INT-CP001-PROT-RATE-FROM-INTEREST-PRINCIPAL-RATIO
```

The list is a first executable discovery wave, not a final QL inventory.

## Mathematical foundation

- reduced `bigint` rational arithmetic;
- exact percentage-to-rate conversion;
- exact year, month and stated 365-day conversion;
- valid-state-first principal/rate/time construction;
- exact interest and amount invariants;
- no floating-point equality;
- no tolerance-based correctness;
- no numerical root or logarithmic inversion.

## Solver and verifier separation

The canonical solver uses exact rearrangements of:

```text
I = Prt
A = P + I
```

The independent verifier does not call the solver:

- direct tasks rebuild interest from one-year interest and exact time scaling;
- principal inverses enumerate a declared ₹100 grid;
- rate inverses enumerate the approved exact rate pool;
- time inverses enumerate the approved exact duration pool;
- amount-multiple and interest-ratio tasks reconstruct the displayed ratio for every admissible candidate;
- every inverse must have exactly one admissible match.

## Editorial foundation

- task-owned English stems;
- eight neutral Indian exam contexts;
- explicit distinction between principal, interest and amount;
- four-tier competitive explanations;
- value-specific calculations and verification;
- misconception-labelled distractors;
- correct-answer position rotation;
- structured reasoning graphs.

## Automated evidence

The focused workflow bundles and runs:

1. deterministic proof across 16 prototypes and 120 seeds each;
2. structural/editorial audit across 16 prototypes and 80 seeds each;
3. deterministic JSON and Markdown review export with three samples per prototype.

The proof checks lifecycle safety, exact solver/verifier agreement, unique inverse solutions, four unique options, answer-position coverage, context and mathematical diversity, explanation depth and reasoning-graph structure.

## Open discovery work

Before any permanent QL allocation:

- inspect the generated English review pack;
- classify each prototype as retain, merge, split, defer, reassign or reject;
- audit principal-from-interest versus principal-from-amount ownership;
- audit rate/time inverses from interest versus amount evidence;
- decide whether month/day forms are representations or distinct contracts;
- audit amount-multiple versus interest-ratio consolidation;
- recover representative fixtures for the relevant legacy families;
- run the CP-001 source and edge-gap audit;
- confirm parameter diversity and natural money display;
- complete English editorial approval.

## Current verdict

`INT-CP-001` has an executable non-QL discovery foundation. It is not QL-frozen, localised, integrated into Question Studio or ready for publication.
