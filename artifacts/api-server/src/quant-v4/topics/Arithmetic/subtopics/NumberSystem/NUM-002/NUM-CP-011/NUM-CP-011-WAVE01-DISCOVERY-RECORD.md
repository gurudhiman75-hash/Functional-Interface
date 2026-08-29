# NUM-CP-011 — Wave 01 Discovery Record

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Wave:** 01 — architecture foundation  
**Status:** executable discovery; permanent identity still open

## Scope of this wave

Wave 01 implements only the smallest valuation foundation needed to prove:

- deterministic state construction;
- exact canonical solving;
- materially separate verification;
- misconception-derived MCQ options;
- learner-facing structured explanations;
- state diversity and answer-position reachability;
- lifecycle locks.

It is deliberately not a complete CP011 inventory.

## Wave 00 candidate merge applied before coding

Wave 00 listed both:

- direct `v_p(n!)`;
- highest prime power dividing `n!`.

When the requested answer is the exponent `k` in `p^k | n!`, these are the same inference contract:

```text
same givens: n, p
same invariant: factorial prime valuation
same algorithm: Legendre floor sum
same verifier: factor-by-factor prime accumulation
same answer semantic: prime exponent / valuation
same misconception space: missed higher powers, off-by-one exponent
```

Therefore the tentative separate highest-prime-power candidate is merged into `NUM-CP011-PROT-002` before implementation. The learner wording “largest k such that p^k divides n!” is retained as a representation of factorial valuation, not a separate authority.

This reduces the Wave 01 foundation from seven tentative candidates to six executable prototypes. It does not propose six permanent QLs.

## Executable prototypes

### `NUM-CP011-PROT-001` — prime valuation in a structured product

Primary inference:

```text
v_p(A × B × C) = v_p(A) + v_p(B) + v_p(C)
```

Canonical route: valuation of each explicit term followed by addition.  
Verifier: construct the exact product with `BigInt` and repeatedly divide by `p`.

Primary misconception families:

- take only the largest term valuation;
- count terms divisible by `p` rather than multiplicity;
- omit one factor's contribution.

### `NUM-CP011-PROT-002` — prime valuation in a factorial

Primary inference:

```text
v_p(n!) = floor(n/p) + floor(n/p^2) + ...
```

Canonical route: Legendre floor sum.  
Verifier: enumerate `2..n`, count the power of `p` in each integer, and sum.

This prototype also owns the direct phrasing “largest integer `k` such that `p^k` divides `n!`” when `k` is the answer.

Primary misconception families:

- count multiples of `p` only;
- stop the floor sum too early;
- off-by-one exponent.

### `NUM-CP011-PROT-003` — prime valuation in an exact factorial ratio

Primary inference:

```text
v_p(n!/m!) = v_p(n!) - v_p(m!)
```

Canonical route: subtract two factorial valuations.  
Verifier: enumerate only the surviving factors `(m+1)(m+2)...n`.

Primary misconception families:

- ignore denominator cancellation;
- use denominator valuation itself;
- count first powers of `p` only.

### `NUM-CP011-PROT-004` — highest composite power dividing a factorial

For `b = p1^a1 p2^a2 ...`:

```text
max k = min_i floor(v_pi(n!)/ai)
```

Canonical route: factor the composite base, compute each factorial valuation, divide by the required exponent, then take the limiting minimum.  
Verifier: independently accumulate prime factors across every integer in the factorial before applying the base requirements.

Primary misconception families:

- ignore exponents in the base factorisation;
- take the most abundant prime instead of the limiting prime;
- add capacities rather than take the minimum.

### `NUM-CP011-PROT-005` — decimal trailing zeroes of a factorial

Primary inference:

```text
zeroes = min(v_2(n!), v_5(n!)) = v_5(n!) for ordinary n!
```

Canonical route: Legendre count of factors of five with the factorial abundance-of-two invariant.  
Verifier: independently enumerate both `v_2(n!)` and `v_5(n!)`, then take the minimum.

Primary misconception families:

- count multiples of five but miss repeated factors from 25, 125, ...;
- count factors of two;
- miss one higher-power contribution.

### `NUM-CP011-PROT-006` — trailing zeroes of a factorial in a declared base

For `b = p1^a1 p2^a2 ...`:

```text
base-b zeroes = min_i floor(v_pi(n!)/ai)
```

Canonical route: base factorisation plus Legendre valuations.  
Verifier: independent factor accumulation over `2..n` for each prime in the base.

Primary misconception families:

- ignore prime exponents in the base;
- use the non-limiting prime capacity;
- count multiples of the whole base.

## Proof sweep

The Wave 01 runtime audit is configured to generate `120` deterministic seeds for each of the `6` prototypes:

```text
6 × 120 = 720 generated packages
```

For every generated package it checks:

- deterministic replay;
- canonical/verifier agreement;
- exactly four unique options;
- exactly one correct option;
- correct-index binding;
- misconception identity on every option;
- learner explanation length and internal-vocabulary hygiene;
- all lifecycle locks;
- absence of permanent QL identity.

Across each prototype it additionally requires:

- at least 30 distinct mathematical fingerprints;
- all four answer positions to be reachable.

## Intentionally open after Wave 01

Wave 01 does not claim coverage of:

- inverse `n` from an at-least valuation target;
- inverse `n` from an exact valuation target;
- exact / at-least trailing-zero inversion;
- possible/impossible exact zero counts;
- bounded count/set of valid `n` values;
- missing exponent reconstruction in products;
- least factorial containing a declared integer factor;
- explicit-product trailing zeroes beyond the valuation foundation;
- factorial-ratio trailing zeroes as a separate source-backed task;
- last non-zero digit of a factorial;
- factorial remainder;
- divisor count of a factorial;
- binomial-coefficient valuation;
- statement or data-sufficiency representations.

These remain Wave 02+ discovery, ownership-ablation or advanced-hold work.

## Ownership holds preserved

- `ns_factorial_remainder` remains a CP008 candidate unless valuation is proved essential.
- `ns_factorial_factor_count` remains a CP005 candidate unless factorial-specific inference materially changes ownership.
- last non-zero digit remains a CP009/CP014 hold pending source-backed ablation.
- factorial-as-arrangement remains P&C.
- generic exponent manipulation remains Surds & Indices.

No hold has been silently converted into a CP011 authority.

## Lifecycle boundary

Every Wave 01 package remains:

```text
maturity = DISCOVERY_PROTOTYPE
reviewStatus = WAVE01_REVIEW_REQUIRED
active = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

No permanent QL is allocated or reserved. `NUM-QL-213` remains the chapter next-free identity only.

## Next discovery step

Wave 02 must expand the proven foundation in the inverse direction rather than adding cosmetic variants. Its first search targets are exact/at-least inverse valuations, exact trailing-zero preimages, possible/impossible targets, bounded solution sets and least-factorial divisibility.
