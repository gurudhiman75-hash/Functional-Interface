# NUM-CP-005 — Wave 03 Source and Representation Expansion

**Base authority:** merged Waves 01–02  
**Lifecycle:** executable discovery only  
**Permanent QLs:** `0`  
**Next available Number System identity:** `NUM-QL-046` remains unallocated

## Purpose

Wave 03 extends the divisor-function inventory beyond direct aggregates. It adds multi-condition subsets, ordered/extreme divisor outputs, claim and pair-table representations, bounded inverse counting, and parity-constrained minimum constructions. These are provisional learner contracts and must still pass later source saturation and merge/split review.

## Temporary contracts

```text
NUM-CP005-PROT-017  count divisors divisible by k1 but not by k2
NUM-CP005-PROT-018  greatest divisor not exceeding a stated bound
NUM-CP005-PROT-019  k-th smallest positive divisor
NUM-CP005-PROT-020  verify a divisor-function claim
NUM-CP005-PROT-021  complete one missing entry in a divisor-pair table
NUM-CP005-PROT-022  count integers in a bounded interval with exactly t divisors
NUM-CP005-PROT-023  least odd positive integer with exactly t divisors
NUM-CP005-PROT-024  least even positive integer with exactly t divisors
```

## Canonical and independent routes

- multi-condition count: exponent-range counting with inclusion/complement constraints; verifier filters the explicit divisor set;
- greatest/indexed divisor: canonical sorted divisor construction; verifier scans integer candidates against divisibility and order;
- claim verification: canonical formula result compared with a displayed claim; verifier recomputes the target property independently;
- divisor-pair table: canonical pair invariant `d × (n/d) = n`; verifier divides the integer exactly and checks the ordered pair inventory;
- bounded exact-divisor-count range: canonical factorisation count for every integer in the interval; verifier uses independent factor-pair counting;
- least odd/even exact-divisor-count number: exponent-partition minimisation with parity restrictions; verifier scans only the required parity class and proves no smaller candidate exists.

## Ownership boundary

- HCF/LCM constraints remain `NUM-CP-006`;
- transforming a number into a square/cube/perfect power remains `NUM-CP-012`;
- arranging or selecting divisor objects remains P&C;
- unrestricted large-range divisor-density analysis and advanced multiplicative functions remain source-backed holds.

## Proof requirements

- eight new temporary prototypes and zero permanent QLs;
- 100 deterministic packages per prototype;
- every answer position and all three difficulty bands;
- canonical/verifier equality;
- both true and false claims;
- first, middle and last indexed-divisor states;
- exact divisor-pair table integrity;
- bounded inverse intervals with zero, one and multiple matching integers;
- independently verified odd/even minimum targets;
- no learner-facing internal IDs and no lifecycle exposure.

## Still open after Wave 03

- statement-wise data sufficiency;
- one/many/no-solution reconstruction from mixed divisor evidence;
- source-led special-number classifications;
- table/graph representations beyond divisor pairs;
- chapter-level source saturation and merge/split audit;
- permanent allocation and English freeze.

## Status

`NUM_CP005_WAVE03_EXECUTABLE_DISCOVERY_AUTHORISED`
