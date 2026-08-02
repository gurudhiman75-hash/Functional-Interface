# NUM-CP-005 — Wave 01 Divisor-Function Foundation

**Package:** `NUM-001`  
**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Wave:** `01 — Direct counts, aggregate and first inverse state`  
**Lifecycle:** executable discovery only  
**Permanent QLs:** `0`  
**Next available chapter identity:** `NUM-QL-046` (not allocated by this wave)

## Purpose

This wave establishes the first executable divisor-function authority without fixing a permanent QL or solve-mode count. Every question is generated from an exact prime-exponent state, solved canonically from exponent constraints, and independently verified by explicit divisor enumeration or bounded inverse reconstruction.

## Temporary prototype contracts

| Temporary ID | Contract | Requested result |
|---|---|---|
| `NUM-CP005-PROT-001` | Count all positive divisors | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-002` | Count proper divisors | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-003` | Count odd divisors | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-004` | Count even divisors, including the zero-even-divisor edge | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-005` | Count divisors divisible by a constructed divisor `k` | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-006` | Count perfect-square divisors | `DIVISOR_COUNT` |
| `NUM-CP005-PROT-007` | Find the sum of all positive divisors | `DIVISOR_SUM` |
| `NUM-CP005-PROT-008` | Recover one missing prime exponent from a stated divisor count | `PRIME_EXPONENT` |

These are discovery contracts, not permanent QLs. Later source, inverse, edge, representation and merge/split waves may merge, split, reject or extend them.

## Mathematical authority

For

```text
n = p1^a1 × p2^a2 × ... × pk^ak
```

the canonical route uses:

- total divisors: `Π(ai + 1)`;
- proper divisors: `d(n) - 1`;
- odd divisors: suppress the exponent choice for prime `2`;
- even divisors: `d(n) - oddDivisors(n)`;
- divisors divisible by `k = Π(pi^bi)`: `Π(ai - bi + 1)` when every `bi ≤ ai`;
- square divisors: `Π(floor(ai / 2) + 1)`;
- divisor sum: `Π(1 + pi + ... + pi^ai)`;
- missing exponent: bounded exact reconstruction from the divisor-count equation.

The independent verifier constructs the complete divisor set directly from the prime powers. It does not call the canonical count or sum formula. The inverse verifier scans a bounded exponent domain and requires one unique solution.

## Source and ownership basis

This wave is grounded in:

1. the Number System complete checkpoint design;
2. the merged CP-004 prime-factorisation authority that supplies exact prime-exponent states;
3. SSC-style direct divisor-count, parity-filtered divisor and divisor-sum patterns;
4. the chapter-wide open discovery and freeze protocol.

Ownership remains closed as follows:

- prime factorisation alone → `NUM-CP-004`;
- HCF/LCM and common-factor optimisation → `NUM-CP-006`;
- completion of the original number into a square/cube/perfect power → `NUM-CP-012`;
- arrangements or selections of factors → Permutation & Combination;
- advanced perfect/deficient/abundant classification → hold for later source-backed review.

## Required proof

The Wave 01 gate must establish:

- 8 temporary prototype IDs and 0 permanent QLs;
- at least 100 deterministic packages per prototype;
- every answer position for every prototype;
- Easy, Medium and Hard reach for every prototype;
- canonical/verifier equality for every generated package;
- unique four-option construction with misconception ownership;
- the `n = 1`, prime, prime-power, odd-number and perfect-square boundaries represented across the wave;
- explicit zero-even-divisor states;
- unique inverse-exponent recovery;
- no Question Studio, Question Bank, test or publication activation.

## Still open after Wave 01

- cube and general perfect-power divisor counts;
- divisors not divisible by `k` and multi-condition subsets;
- sum of proper divisors and product of divisors;
- greatest/least or indexed divisor under conditions;
- complete divisor-set outputs and claim verification;
- exact-divisor-count constructive inverse families;
- least number, least odd number and least even number with a divisor count;
- possible/impossible and one/many/no-solution classifications;
- statement, table, data-sufficiency and shared-state representations;
- source saturation and final merge/split audit.

## Status

`NUM_CP005_WAVE01_EXECUTABLE_DISCOVERY_AUTHORISED`
