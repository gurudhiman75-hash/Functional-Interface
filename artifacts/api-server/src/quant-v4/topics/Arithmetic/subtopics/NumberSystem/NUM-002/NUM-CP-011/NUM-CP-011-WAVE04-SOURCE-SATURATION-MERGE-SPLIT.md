# NUM-CP-011 — Wave 04 Source Saturation and Merge/Split Record

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Status:** saturation candidate; permanent allocation still blocked on Wave 04 green evidence  
**Next free chapter QL:** `NUM-QL-213` — not reserved by this record

## Saturation conclusion

The retained discovery inventory now covers every material source/legacy family registered for CP011 and every source-gap family mandated by Wave 0.

The executable discovery surface contains **15 temporary prototypes** across Waves 01–04. Final merge/split review proposes **14 permanent solve authorities** because the ordinary decimal-factorial trailing-zero prototype is a strict specialization of the general-base factorial trailing-zero prototype.

No permanent QL is allocated in this wave.

## Executable prototype inventory

| Prototype | Retained inference |
|---|---|
| `NUM-CP011-PROT-001` | Prime valuation in a structured product |
| `NUM-CP011-PROT-002` | Prime valuation in a factorial / largest prime exponent dividing a factorial |
| `NUM-CP011-PROT-003` | Prime valuation in an exact factorial ratio |
| `NUM-CP011-PROT-004` | Highest composite power exponent dividing a factorial |
| `NUM-CP011-PROT-005` | Decimal trailing zeroes of a factorial |
| `NUM-CP011-PROT-006` | General-base trailing zeroes of a factorial |
| `NUM-CP011-PROT-007` | Least factorial reaching a prime-valuation threshold |
| `NUM-CP011-PROT-008` | Exact factorial-valuation preimage, including exact decimal-zero preimages |
| `NUM-CP011-PROT-009` | Least factorial reaching a general-base zero threshold |
| `NUM-CP011-PROT-010` | Least factorial divisible by a declared composite integer |
| `NUM-CP011-PROT-011` | Missing product exponent recovered from a target valuation |
| `NUM-CP011-PROT-012` | Trailing zeroes of an exact factorial ratio |
| `NUM-CP011-PROT-013` | Trailing zeroes / complete base-factor capacity of a structured product |
| `NUM-CP011-PROT-014` | Statement / claim evaluation over factorial valuations |
| `NUM-CP011-PROT-015` | Data sufficiency over valuation / trailing-zero thresholds |

## Final merge/split proposal

### Merge M01 — `PROT-005` into `PROT-006`

Decimal factorial trailing zeroes are the base-10 specialization of the general-base rule.

```text
base 10 = 2 × 5
Z_10(n!) = min(v_2(n!), v_5(n!))
```

For ordinary factorials, factors of 2 are more abundant, so the learner shortcut reduces to `v_5(n!)`. That shortcut does not create a separate inference authority.

Permanent proposal:

```text
one authority: factorial trailing zeroes in a declared base
representations: decimal shortcut + general composite base
```

### Keep S01 — `PROT-001` vs `PROT-013`

A single-prime valuation of a product and a complete-base-factor / trailing-zero count of a product are not merged.

`PROT-013` requires:

- all prime factors of a composite base;
- required prime multiplicities;
- a limiting-minimum operation.

A one-prime valuation does not contain those decisions.

### Keep S02 — `PROT-002` vs `PROT-004`

Direct `v_p(n!)` and highest composite power in `n!` remain distinct because the composite authority adds base factorisation, valuation-ratio normalization and limiting-prime selection.

### Keep S03 — `PROT-007` vs `PROT-010`

Single-prime inverse valuation and least factorial divisible by an arbitrary composite integer remain distinct because the latter requires simultaneous prime-power thresholds and a maximum across their least-`n` boundaries.

### Keep S04 — ordinary solve vs statement/DS representations

`PROT-014` and `PROT-015` remain separate solution-topology authorities rather than aliases of a direct valuation question:

- statement/claim output is a two-claim truth pattern;
- data sufficiency output is a sufficiency class over allowed state sets.

The learner must perform additional inference not present in the ordinary direct solve.

## Proposed 14-authority permanent map

The following labels are **candidate authority slots only**, not permanent QL IDs.

| Candidate | Prototype ancestry | Solve authority |
|---|---|---|
| `CP011-AUTH-01` | `PROT-001` | Structured-product prime valuation |
| `CP011-AUTH-02` | `PROT-002` | Factorial prime valuation |
| `CP011-AUTH-03` | `PROT-003` | Factorial-ratio prime valuation |
| `CP011-AUTH-04` | `PROT-004` | Highest composite power dividing a factorial |
| `CP011-AUTH-05` | `PROT-005 + PROT-006` | Factorial trailing zeroes in decimal/general base |
| `CP011-AUTH-06` | `PROT-007` | Least `n` reaching a prime-valuation threshold |
| `CP011-AUTH-07` | `PROT-008` | Exact factorial-valuation preimage |
| `CP011-AUTH-08` | `PROT-009` | Least `n` reaching a general-base zero threshold |
| `CP011-AUTH-09` | `PROT-010` | Least factorial divisible by a declared integer |
| `CP011-AUTH-10` | `PROT-011` | Missing product exponent from valuation |
| `CP011-AUTH-11` | `PROT-012` | Factorial-ratio trailing zeroes |
| `CP011-AUTH-12` | `PROT-013` | Structured-product complete base-factor / trailing-zero count |
| `CP011-AUTH-13` | `PROT-014` | Statement / claim evaluation |
| `CP011-AUTH-14` | `PROT-015` | Data sufficiency over valuation thresholds |

## Registered source-family coverage

### `ns_trailing_zeroes`

Covered by:

- `AUTH-05` direct factorial zero count;
- `AUTH-07` exact inverse / possible-impossible zero counts;
- `AUTH-08` general-base inverse zero threshold;
- `AUTH-11` factorial-ratio zeroes;
- `AUTH-12` structured-product zeroes.

Alias `ns_trailing_zeros_factorial` is absorbed into `AUTH-05`; it is not a separate identity.

### `ns_highest_power_dividing`

Covered by:

- `AUTH-01` single-prime structured-product valuation;
- `AUTH-02` single-prime factorial valuation;
- `AUTH-04` composite-base factorial power;
- `AUTH-10` missing-exponent valuation reconstruction;
- `AUTH-12` structured-product complete-base capacity.

Alias `ns_highest_power_in_factorial` is absorbed into `AUTH-02` / `AUTH-04` according to whether the requested base is prime or composite.

### `ns_factorial_divisibility`

Covered by:

- `AUTH-06` prime-power threshold;
- `AUTH-09` arbitrary integer divisor threshold.

A direct yes/no divisibility question is a bounded representation of the same threshold authority and does not require another QL.

### `ns_factorial_remainder`

**Disposition: REASSIGN_CP008.**

If the requested answer is a residue or remainder, factorial notation alone does not make the question a CP011 valuation authority. Standard factorial-remainder tasks belong to remainder/modular reasoning in CP008 unless a future source proves a genuinely co-essential mixed engine; such a mixed case would be a CP014 candidate rather than CP011.

### `ns_factorial_factor_count`

**Disposition: SPLIT_BY_GIVENS.**

- if prime exponents/factorisation are already given and the task is ordinary divisor-function output → CP005;
- if the raw input is `n!` and the learner must first derive factorial prime valuations before applying a divisor-function formula → CP014 mixed-synthesis candidate.

No CP011 permanent authority is allocated for total divisor count.

## Advanced candidate dispositions

### Last non-zero digit of a factorial

**Disposition: REASSIGN_CP014.**

A general last-non-zero-digit solve requires both:

- removal/balancing of terminal 2/5 factors;
- terminal-digit modular/cyclic reasoning.

Neither valuation alone nor CP009 terminal cyclicity alone is sufficient. This is a mixed-engine candidate, not a CP011 authority.

### Binomial-coefficient valuation

**Disposition: DEFER_NO_DIRECT_SOURCE.**

Mathematically,

```text
v_p(C(n,r)) = v_p(n!) - v_p(r!) - v_p((n-r)!)
```

is a natural extension of factorial-ratio valuation. However the registered SSC/legacy source evidence for this checkpoint does not establish a direct exam-facing Number System family requiring its own permanent identity. It is therefore excluded from the current permanent allocation. If direct source demand appears later, it can be evaluated as a representation/generalization of `AUTH-03` before any new QL is considered.

### Highest composite power dividing a structured product

**Disposition: MERGE_INTO_AUTH-12.**

For a product `N` and base `b`,

```text
largest k such that b^k divides N
```

and

```text
number of trailing zeroes when N is written in base b
```

are the same complete-base-factor count. They have the same givens, factorisation state, valuation totals, limiting-minimum algorithm and integer answer `k`. The wording difference is a representation, not a solve-authority split.

### Highest-power exponent vs highest-power value

**Disposition: ANSWER_FORMAT_ONLY.**

After the exponent `k` is known, returning `a^k` instead of `k` is a deterministic answer-format transform. It must be controlled by explicit wording but does not create another inference authority.

## Wave 0 required-gap closure

| Wave 0 gap | Closure |
|---|---|
| Prime valuation in explicit product | `AUTH-01` |
| Prime valuation in factorial | `AUTH-02` |
| Prime valuation in exact factorial ratio | `AUTH-03` |
| Highest prime power dividing product/factorial | `AUTH-01` / `AUTH-02` |
| Highest composite power dividing product/factorial | `AUTH-12` representation / `AUTH-04` |
| Direct factorial divisibility | `AUTH-06` / `AUTH-09` representation |
| Least factorial containing declared factor | `AUTH-09` |
| Base-ten trailing zeroes | `AUTH-05` |
| Non-decimal-base trailing zeroes | `AUTH-05` |
| Factorial-ratio trailing zeroes | `AUTH-11` |
| At-least inverse valuation/zeroes | `AUTH-06` / `AUTH-08` |
| Exact inverse valuation/zeroes | `AUTH-07` |
| Count/set of exact solutions | `AUTH-07` representation |
| Possible/impossible exact targets | `AUTH-07` |
| Missing product exponent | `AUTH-10` |
| Statement/claim | `AUTH-13` |
| Data sufficiency | `AUTH-14` |

Every mandatory gap has an executable authority, a proved merge, or an explicit ownership disposition.

## Saturation gate

Wave 04 may be called source-saturated only if CI proves:

- all 15 prototype IDs are unique and contiguous;
- the proposed merge leaves exactly 14 authority candidates;
- all registered source-family dispositions are present;
- the structured-product highest-power/trailing-zero equivalence is executable;
- Wave 04 statement and DS runtime is green;
- no lifecycle gate has opened;
- no `NUM-QL-*` identity has been allocated to CP011.

After that gate is green, the next step is permanent allocation review. The expected range would be **14 consecutive IDs starting at the then-current next-free Number System QL**, but this document does not reserve that range.
