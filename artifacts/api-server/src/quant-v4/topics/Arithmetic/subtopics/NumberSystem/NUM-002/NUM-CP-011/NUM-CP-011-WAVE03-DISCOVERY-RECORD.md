# NUM-CP-011 — Wave 03 Discovery Record

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Wave:** 03 — compound zero structures and edge conventions  
**Status:** executable discovery; permanent identity remains open

## Wave objective

Wave 03 closes two material representation gaps left after the forward and inverse valuation foundations:

- trailing zeroes of an exact factorial ratio;
- trailing zeroes of an explicit structured product.

It also freezes mathematical conventions that must remain stable before any permanent allocation:

- `0! = 1`;
- `1! = 1`;
- `v_p(1) = 0`;
- exponent-vs-power-value wording;
- trailing-zero representation semantics;
- integrality of learner-facing factorial ratios.

These conventions are audited separately rather than inflated into ordinary question authorities.

## Executable prototypes

### `NUM-CP011-PROT-012` — trailing zeroes of an exact factorial ratio

Representations:

- decimal trailing zeroes of `n!/m!`;
- trailing zeroes of `n!/m!` in a declared composite base.

For a base

```text
b = p1^a1 p2^a2 ...
```

and the exact integer ratio `n!/m!`, the retained prime count is

```text
v_pi(n!/m!) = v_pi(n!) - v_pi(m!)
```

and the zero count is

```text
min_i floor((v_pi(n!) - v_pi(m!))/ai)
```

Canonical route:

- Legendre valuation of numerator factorial;
- Legendre valuation of denominator factorial;
- subtraction;
- base-prime grouping;
- limiting minimum.

Verifier:

- enumerate only the surviving factors `(m+1)(m+2)...n`;
- accumulate the required prime valuations independently;
- compute the limiting base capacity.

Primary misconceptions:

- ignore denominator cancellation;
- ignore exponents in the base factorisation;
- use the non-limiting prime capacity.

Decimal and general-base versions remain one solve authority because the hidden state and algorithm differ only by base factorisation parameters.

### `NUM-CP011-PROT-013` — trailing zeroes of a structured product

Representations:

- decimal trailing zeroes of a product such as `A^x × B^y × ...`;
- trailing zeroes of the same product in a declared composite base.

Canonical route:

- compute each required base-prime valuation term-by-term;
- multiply each coefficient valuation by its displayed exponent;
- sum across the product;
- divide by the prime multiplicity required in one base factor;
- take the limiting minimum.

Verifier:

- construct the exact bounded product with `BigInt`;
- repeatedly divide the entire integer by the declared base;
- count successful exact divisions.

This verifier is intentionally different from the canonical valuation-table route.

Primary misconceptions:

- count terms already divisible by the whole base;
- ignore prime exponents in the base;
- use the most abundant prime instead of the limiting one.

## Why these are retained after merge/split review

### Factorial-ratio zero count does not collapse into Wave 01 ratio valuation

`NUM-CP011-PROT-003` answers one prime valuation of a factorial ratio.

`NUM-CP011-PROT-012` requires:

- at least two prime valuations when the base is composite;
- prime-exponent requirements of the representation base;
- a limiting-minimum operation;
- zero-count answer semantics rather than prime-exponent semantics.

Removing the base-balancing step changes the answer and misconception topology, so the authority remains distinct.

### Structured-product zero count does not collapse into Wave 01 structured-product valuation

`NUM-CP011-PROT-001` asks for one declared prime valuation.

`NUM-CP011-PROT-013` must balance all prime factors required by the representation base. The minimum capacity can be controlled by a different prime from the largest raw valuation. Therefore it is not a cosmetic wording change.

## Edge-convention freeze

The dedicated edge audit fixes these contracts:

```text
0! = 1
1! = 1
v_p(1) = 0 for every prime p
```

For highest-power wording:

```text
"largest integer k such that a^k divides N" → answer the exponent k
"highest power of a dividing N" → answer a^k only when the prompt explicitly asks for the power value
```

These answer semantics must never be mixed inside one permanent QL.

Trailing-zero convention:

```text
ordinary integer trailing zeroes are terminal zeroes of the chosen representation
leading zeroes do not count unless a fixed-width representation is explicitly declared
```

Factorial-ratio convention:

```text
learner-facing Number System ratios treated as integers must be generated only in integral form
```

For the current ratio generator this is guaranteed structurally by using `n!/m!` with `n >= m >= 0`.

## Proof sweep

Wave 03 generates:

```text
2 temporary prototypes × 160 seeds = 320 packages
```

Every package must prove:

- deterministic replay;
- canonical/verifier agreement;
- exactly four unique options;
- one and only one correct option;
- answer-index binding;
- misconception identity on every option;
- structured learner explanation bounds;
- no internal implementation vocabulary;
- all discovery lifecycle locks;
- no permanent QL allocation.

Per prototype it additionally requires:

- at least 50 distinct mathematical fingerprints;
- all four answer positions;
- both decimal and general-base representations.

A separate convention audit proves the factorial and valuation edge contracts.

## What remains open

Wave 03 does not claim checkpoint saturation. Remaining material work is now narrower:

- statement / claim evaluation based on already-proven valuation engines;
- data sufficiency based on already-proven ordinary authorities;
- source-backed disposition of binomial-coefficient valuation;
- ownership ablation of factorial remainder against CP008;
- ownership ablation of factorial divisor count against CP005;
- ownership ablation of last non-zero digit against CP009 / CP014;
- final source saturation and merge/split audit;
- only after saturation: permanent QL allocation and English freeze.

## Lifecycle boundary

Every Wave 03 package remains:

```text
maturity = DISCOVERY_PROTOTYPE
reviewStatus = WAVE03_REVIEW_REQUIRED
active = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

No permanent QL is allocated or reserved. `NUM-QL-213` remains next-free only.
