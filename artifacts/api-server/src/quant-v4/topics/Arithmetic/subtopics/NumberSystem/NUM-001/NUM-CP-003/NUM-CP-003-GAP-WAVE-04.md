# NUM-CP-003 — Divisibility and Missing Digits
## Gap Wave 04 — Rule Recognition, Remaining Predicates and Identity Boundaries

**Status:** executable discovery candidate  
**Depends on:** green Waves 01–03  
**Temporary contracts:** 8  
**Permanent QLs:** 0  
**Frozen solve modes:** 0

Wave 04 closes the highest-value task-direction gaps still visible after the first three waves. It remains non-permanent and explicitly preserves later source and ownership review.

## Temporary contracts

1. divisor from a stated elementary divisibility rule;
2. rule from a stated divisor;
3. complete ordered-pair solution set;
4. no/unique/multiple ordered-pair solution classification;
5. `each statement alone is sufficient` missing-digit data sufficiency;
6. count divisible by at least one of three divisors;
7. guaranteed divisor of a block repeated twice;
8. guaranteed divisor of an odd power sum.

## Exact verification

- rule-recognition tasks reconstruct from one reviewed rule registry;
- pair set/class tasks independently enumerate all 100 ordered pairs;
- each-alone sufficiency independently enumerates each statement’s digit set;
- three-divisor counting uses inclusion–exclusion and direct interval enumeration;
- repeated-block identity verifies factors of `10^k + 1`;
- odd power-sum identity verifies exact `bigint` divisibility by `a + b`.

## Proof contract

```text
8 temporary contracts × 100 seeds = 800 deterministic packages
8 temporary contracts × 60 seeds  = 480 structural/editorial packages
8 temporary contracts × 3 seeds   = 24 English review questions
```

Required coverage:

- all four answer positions;
- Easy, Medium and Hard;
- six answer semantics;
- all eight primitive rule identities;
- no/unique/multiple pair-solution classes;
- exact solver/verifier parity;
- no permanent or public lifecycle state.

## Provisional boundaries

- forward and reverse rule-recognition may merge under direction parameters;
- pair set and pair class remain answer-semantic candidates over one solution-set engine;
- each-alone sufficiency completes the missing result class but remains a representation adapter;
- three-divisor inclusion–exclusion may remain advanced enrichment depending on source frequency;
- repeated-block and power-sum identities remain on CP-003/CP-008/Algebra ownership hold until source saturation.

No permanent QL allocation follows from this wave.
