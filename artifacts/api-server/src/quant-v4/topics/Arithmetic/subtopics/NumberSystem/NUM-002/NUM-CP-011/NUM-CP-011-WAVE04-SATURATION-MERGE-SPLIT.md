# NUM-CP-011 — Wave 04 Saturation and Merge/Split Audit

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Status:** saturation candidate; permanent IDs still unallocated

## Executive result

After Waves 0–3, CP011 has **13 retained solve authorities**. No additional solve authority is justified by statement/claim wording, data-sufficiency formatting, or the held factorial families below.

The next permanent identity remains `NUM-QL-213`; Wave 04 does not allocate it.

## Retained authority inventory

| Temporary prototype | Retained solve authority | Permanent disposition |
|---|---|---|
| `NUM-CP011-PROT-001` | prime valuation in a structured product | RETAIN |
| `NUM-CP011-PROT-002` | prime valuation in `n!` / largest exponent `k` with `p^k | n!` | RETAIN |
| `NUM-CP011-PROT-003` | prime valuation in an exact factorial ratio | RETAIN |
| `NUM-CP011-PROT-004` | highest composite-power exponent dividing a factorial | RETAIN |
| `NUM-CP011-PROT-005` | decimal trailing zeroes of a factorial | RETAIN |
| `NUM-CP011-PROT-006` | trailing zeroes of a factorial in a declared general base | RETAIN |
| `NUM-CP011-PROT-007` | least `n` reaching a prime-valuation threshold | RETAIN |
| `NUM-CP011-PROT-008` | exact factorial-valuation preimage, including exact decimal-zero representation | RETAIN |
| `NUM-CP011-PROT-009` | least `n` reaching a general-base zero threshold | RETAIN |
| `NUM-CP011-PROT-010` | least factorial divisible by a declared composite integer | RETAIN |
| `NUM-CP011-PROT-011` | recover an unknown product exponent from a target valuation | RETAIN |
| `NUM-CP011-PROT-012` | trailing zeroes of an exact factorial ratio | RETAIN |
| `NUM-CP011-PROT-013` | trailing zeroes of a structured product | RETAIN |

## Merge decisions already applied

### Highest prime power versus factorial valuation

The wording

```text
largest integer k such that p^k divides n!
```

is the same solve authority as `v_p(n!)`; it remains inside `PROT-002` and does not receive a second identity.

### Exact decimal trailing-zero inversion versus exact `v_5(n!)`

For ordinary factorials in base ten, exact trailing-zero inversion is the `p = 5` representation of the exact valuation preimage. It remains inside `PROT-008`.

### Decimal versus general-base representations inside compound zero authorities

`PROT-012` and `PROT-013` each keep decimal and declared-general-base wording inside one authority. Changing the representation base changes parameters, not the ownership of the solve engine.

## Why decimal factorial zeroes remain separate from general-base factorial zeroes

`PROT-005` is retained separately from `PROT-006` for learner-skill and misconception topology reasons:

- ordinary decimal factorial zeroes use the proved abundance of factors of 2 and reduce to counting factors of 5;
- declared-general-base zeroes require explicit base factorisation, all required prime valuations, exponent-normalised capacities and a limiting minimum;
- using the decimal shortcut in a general base is mathematically invalid;
- the misconception families differ materially.

Therefore a general-base solver can mathematically subsume base 10, but the exam-facing inference contract is not identical enough to merge the learner authority.

## Representation-only forms — no new permanent QL

### Statement / claim evaluation

Statement or claim questions that merely ask whether one or more already-proven valuation facts are true do not introduce a new mathematical engine. They are presentation wrappers over one or more retained authorities.

Examples:

```text
Statement I: v_5(100!) = ...
Statement II: 12^k divides 50! for k = ...
```

The underlying solve work is still owned by `PROT-002`, `PROT-004`, `PROT-005`, etc. A statement wrapper must preserve the original authority ancestry instead of minting a CP011 QL solely for the option format.

### Data sufficiency

Data sufficiency is a cross-topic reasoning/composition layer already owned by the dedicated Data Sufficiency system. A CP011-flavoured DS item may invoke one or more CP011 authorities as statement evaluators, but the sufficiency topology itself is not a new Number System solve authority.

Therefore CP011 allocates no permanent QL for the DS shell.

## Ownership ablations

### `ns_factorial_remainder`

**Disposition: REASSIGN to CP008 unless valuation is independently necessary.**

A question asking for the remainder of a factorial expression is fundamentally a modular-arithmetic task when factorial notation is merely the operand. Factorial appearance alone does not move ownership to CP011.

### `ns_factorial_factor_count`

**Disposition: REASSIGN to CP005 unless the requested semantic is a prime valuation/highest-power threshold.**

Counting ordinary divisors of `n!` is a divisor-function task. CP011 may supply prime valuations as preprocessing, but the answer semantic and final invariant belong to divisor functions.

### Last non-zero digit of a factorial

**Disposition: REASSIGN/HOLD under CP009 or CP014.**

Removing trailing zeroes can use valuations, but the requested output is a terminal digit and the remaining decisive engine is cyclic modular arithmetic. This is not retained as a CP011 authority.

### Binomial-coefficient valuation

**Disposition: HOLD OUTSIDE CURRENT CP011 PERMANENT SCOPE.**

`v_p(C(n,r))` is mathematically valid and can be derived from factorial valuations, but the current chapter source inventory does not establish it as a required independent SSC/Banking/Punjab-state exam family. It remains an advanced/source-backed expansion candidate rather than being allocated speculatively.

### Factorial as arrangement count

**Disposition: P&C.**

When factorial notation represents permutations/arrangements rather than integer-factor structure, ownership is outside Number System.

## Source-saturation conclusion

Material source-backed families are now covered by one of:

1. a retained executable authority;
2. an explicit merge into a retained authority;
3. a documented reassignment to the correct checkpoint/chapter;
4. a source-evidence hold that does not justify current permanent allocation.

No unresolved source-backed gap requires another CP011 solve engine before permanent allocation.

## Proposed permanent allocation size

Subject to executable saturation audit success and Wave 03 green CI:

```text
13 retained authorities
→ 13 permanent QLs
→ proposed range NUM-QL-213 .. NUM-QL-225
```

This range is **proposed only** in Wave 04. It is not reserved or allocated until the permanent-allocation wave lands.

## Lifecycle

Wave 04 opens no runtime gates:

```text
active = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

## Exit condition

Wave 04 may be considered saturated when:

- all 13 temporary IDs are unique and executable;
- every retained runtime still proves independent verifier agreement;
- all lifecycle locks remain closed;
- representation-only forms are prevented from QL inflation;
- held/reassigned factorial families have explicit owners;
- the permanent proposal is exactly 13 QLs and no IDs are allocated in this wave.
