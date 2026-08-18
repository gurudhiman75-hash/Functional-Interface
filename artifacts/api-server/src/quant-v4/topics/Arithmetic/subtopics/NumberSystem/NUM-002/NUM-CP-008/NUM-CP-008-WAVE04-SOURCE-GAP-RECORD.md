# NUM-CP-008 Wave 04 — Focused Source-Gap Discovery Record

**Checkpoint:** `NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences`  
**Base:** Wave 03 reviewed candidate  
**Permanent QLs:** 0  
**Next available Number System identity:** `NUM-QL-166`  
**Purpose:** close only source/design gaps found by the post-Wave-03 saturation recheck

## Why Wave 04 exists

The post-Wave-03 recheck against the uploaded SSC/competitive-aptitude sources and the complete CP008 design found four still-unproven directions. This is a focused closure wave, not an advanced-theorem expansion.

Source examples include:

- R.S. Aggarwal Number System examples asking for the minimum repeated-digit construction that becomes divisible by a modulus;
- repeated-block divisibility/remainder constructions in the Disha SSC guide and broader quantitative-aptitude sources;
- greatest bounded integers satisfying several different remainder conditions;
- the chapter-wide discovery matrix requirement to exercise bounded no/one/many solution topology.

## Temporary prototypes

```text
NUM-CP008-PROT-025 — least repeated-digit length giving divisibility
NUM-CP008-PROT-026 — repeated-block concatenation remainder
NUM-CP008-PROT-027 — greatest bounded solution of a compatible congruence system
NUM-CP008-PROT-028 — bounded compatible-system solution class: no / one / many
```

These are temporary discovery identities. They do not imply four additional permanent QLs.

## Canonical / verifier separation

### P025 — minimum repeated-digit length
- canonical: append-digit remainder recurrence until the first zero;
- verifier: exact `BigInt` construction for every shorter length and the selected length.

### P026 — repeated-block concatenation
- canonical: block-place-value recurrence modulo the divisor;
- verifier: exact `BigInt` construction of the repeated block.

### P027 — greatest bounded system solution
- canonical: generalized CRT followed by the final arithmetic-progression projection below the upper bound;
- verifier: direct bounded enumeration satisfying every displayed congruence.

### P028 — bounded no/one/many classification
- canonical: CRT residue class plus progression count in the interval;
- verifier: direct bounded enumeration of all system solutions.

## Ownership

- P025/P026 belong to CP008 only when modular recurrence is essential; ordinary fixed-number divisibility-rule questions remain CP003.
- P027/P028 require multiple independent congruence constraints and therefore remain CP008 rather than CP007.
- terminal-digit targets remain CP009.
- pure same-remainder common-alignment/HCF-LCM optimisation remains CP006.

## Advanced-theorem disposition remains unchanged

The design authority continues to hold the following outside routine CP008 discovery unless new recurring exam evidence appears:

```text
abstract modular inverse as the learner target
large unrestricted/general CRT
Fermat/Euler exponent reduction
Wilson-theorem remainder tasks
```

Wave 04 does not implement them.

## Required proof

The dedicated gate must pass:

- retained Wave 03 mathematical + final-review regressions;
- `4 × 120 = 480` deterministic Wave-04 packages;
- independent verifier equality;
- four-option/one-correct integrity;
- all four answer positions per prototype;
- state-derived difficulty breadth;
- minimum-length proof for all P025 states;
- exact concatenation parity for all P026 states;
- greatest-bound proof for all P027 states;
- all three bounded no/one/many classes for P028;
- 240-package structural/ownership/learner audit;
- 12-question direct review export;
- all lifecycle locks.

## Next gate after Wave 04

If this wave passes executable and direct learner review, run the **final CP008 source-saturation + merge/split audit across `PROT-001..028`**. That audit may merge P026 with the existing recurrence authority and P028 with another bounded-system authority; permanent count remains an outcome, not a quota.

No `NUM-QL-166+` allocation is allowed until the count-bearing proposal is explicitly approved.
