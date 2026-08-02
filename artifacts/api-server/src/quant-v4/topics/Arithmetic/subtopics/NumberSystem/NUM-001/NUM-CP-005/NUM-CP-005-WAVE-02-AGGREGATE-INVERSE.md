# NUM-CP-005 — Wave 02 Aggregate and Inverse Expansion

**Base authority:** merged Wave 01 foundation  
**Lifecycle:** executable discovery only  
**Permanent QLs:** `0`  
**Next available identity:** `NUM-QL-046` remains unallocated

## Temporary contracts

```text
NUM-CP005-PROT-009  count divisors not divisible by constructed k
NUM-CP005-PROT-010  count perfect-cube divisors
NUM-CP005-PROT-011  count perfect m-th-power divisors for m = 4 or 5
NUM-CP005-PROT-012  sum of proper positive divisors
NUM-CP005-PROT-013  product of all positive divisors
NUM-CP005-PROT-014  complete ordered divisor set for a bounded integer
NUM-CP005-PROT-015  recover a prime power from its prime and divisor count
NUM-CP005-PROT-016  least positive integer with an exact divisor count
```

These contracts remain provisional. Square, cube and general perfect-power divisor counts may merge after source and representation audits. Product, complete-set and inverse outputs remain separate until evidence proves equivalent learner contracts.

## Canonical and independent routes

- complement count: total divisor choices minus choices satisfying the constructed `k` requirement;
- cube/general power count: for every `p^a`, permitted divisor exponents are multiples of `m`, giving `floor(a/m) + 1` choices;
- proper-divisor sum: divisor-sum product minus `n`;
- divisor product: pair divisors to product `n`, with the square-root divisor handled exactly for odd divisor count;
- complete set: construct all divisors from exponent combinations;
- prime-power inverse: `d(p^a) = a + 1`, followed by direct divisor enumeration;
- least-number inverse: minimise the number over non-increasing exponent partitions assigned to ascending primes;
- independent least-number verifier: scan positive integers up to the candidate and count divisors by factor pairs.

## Proof requirements

- 8 new temporary prototypes and no permanent allocation;
- 100 deterministic packages per prototype;
- every answer position and every difficulty band;
- canonical/verifier parity;
- exact BigInt product support;
- complete-set option integrity;
- both even-pair and perfect-square divisor-product states;
- inverse least-number targets across composite and prime divisor counts;
- zero lifecycle exposure.

## Still open

- multiple simultaneous divisor predicates;
- indexed/greatest/least divisor under arbitrary conditions;
- claim verification and data sufficiency;
- unrestricted numbers with an exact divisor count;
- least odd/even number with an exact divisor count;
- one/many/no-solution reconstruction;
- source saturation and merge/split freeze.

## Status

`NUM_CP005_WAVE02_EXECUTABLE_DISCOVERY_AUTHORISED`
