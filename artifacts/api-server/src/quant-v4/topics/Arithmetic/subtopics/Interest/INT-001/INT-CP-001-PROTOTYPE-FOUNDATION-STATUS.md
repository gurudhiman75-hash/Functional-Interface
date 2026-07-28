# INT-001 / CP-001 Prototype Foundation Status

Status: **exact-head runtime proof passed; first English self-review completed; human approval and QL freeze pending**  
Branch: `feat/int-001-cp001-prototype-foundation`  
Base: `design/int-001-end-to-end-discovery`  
Exact proven head: `65dc52d0727c262c83a7578c959fcc90fa8f4897`

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
- exact scaling when a hidden state would otherwise yield fractional money;
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
- structured reasoning graphs;
- independent context-opening variation;
- natural interrogative question forms;
- integral-rupee answers and options for money semantics.

## Exact automated evidence

Workflow: `Validate INT-CP-001 prototype foundation`  
Run: `30321735504`  
Conclusion: **success**  
Evidence artifact: `8674247524`  
Artifact digest: `sha256:7dd155c221c5a4ef713c14b2c9d4d9088409b9d6511edd351b141cf237b84ae4`

### Deterministic proof

```text
16 prototypes × 120 seeds = 1,920 generated cases
```

Passed:

- deterministic regeneration;
- exact canonical solver and independent verifier agreement;
- exactly one admissible inverse solution;
- four unique options and exactly one correct answer;
- all four correct-answer positions for every prototype;
- Easy, Medium and Hard reachability;
- six answer semantics;
- per-prototype stem, explanation, mathematical-fingerprint and answer diversity;
- complete lifecycle and publication safety.

### Structural and editorial audit

```text
16 prototypes × 80 seeds = 1,280 generated cases
```

Observed:

```text
Easy:                    191
Medium:                  609
Hard:                    480
Context families:          8
Most repeated opening:     30
Fractional money options:   0
```

The audit also passed:

- 23 chapter-wide option labels including `CORRECT`;
- all eight contexts for every prototype;
- no unresolved placeholders or non-finite text;
- no lowercase stem openings;
- no `Find ...?` or `Determine ...?` fragments;
- no exposed legacy personal-lending label;
- no malformed control characters;
- explanation depth, answer conclusion and verification checks;
- no public, Question Bank or test eligibility leakage.

### Review export

Generated:

```text
16 prototypes × 3 samples = 48 English review questions
```

The first internal editorial inspection found and corrected:

- sentence-final imperative questions;
- lowercase institution-led openings;
- an unnatural personal-lending institution label;
- deterministic opening-template correlation;
- fractional-rupee distractors;
- awkward fractional interest-ratio wording;
- under-diverse inverse-duration answer pools.

The corrected 48-sample pack is available in the exact-head workflow artifact. Human approval remains required before any permanent QL decision.

## First discovery disposition

The initial disposition audit records:

- 13 provisional retain candidates;
- one provisional presentation merge;
- two open representation-boundary candidates;
- no permanent QL allocation.

The disposition is provisional and may change after source-fixture recovery and the remaining gap prototypes.

## Open discovery work

Before any permanent QL allocation:

- obtain human review of the corrected English pack;
- recover representative fixtures for the relevant legacy families;
- prototype two-time amount-gap and amount-ratio inverses;
- audit month/day representation across amount and inverse tasks;
- close amount-multiple versus interest-ratio consolidation;
- run the final CP-001 source, inverse, edge and representation gap audit;
- repeat merge/split review after the new prototypes;
- allocate permanent IDs only from the surviving contracts.

## Current verdict

`INT-CP-001` has a CI-proven, review-only, non-QL executable foundation. It is not QL-frozen, localised, integrated into Question Studio or ready for publication.
