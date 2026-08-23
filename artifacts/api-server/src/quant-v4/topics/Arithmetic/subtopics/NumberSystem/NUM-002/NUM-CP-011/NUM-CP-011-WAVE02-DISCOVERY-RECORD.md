# NUM-CP-011 — Wave 02 Discovery Record

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Wave:** 02 — inverse valuation and zero structures  
**Status:** executable discovery; permanent identity remains open

## Wave objective

Wave 02 expands the proven Wave 01 valuation foundation in the inverse direction. It does not add surface variants merely because their wording differs.

The central rule is:

```text
forward valuation authority proven first
→ invert the monotone valuation state
→ preserve exact / at-least / impossible / multiple-solution semantics
→ merge representations that use the same inverse engine
```

## Merge decision applied before implementation

### Exact decimal trailing-zero inversion is not a separate authority from exact `v_5(n!)`

For an ordinary factorial in base 10:

```text
trailing_zeroes(n!) = min(v_2(n!), v_5(n!)) = v_5(n!)
```

Therefore these prompts:

```text
Find all n such that v_5(n!) = z.
Find all n such that n! has exactly z decimal trailing zeroes.
```

have the same:

- hidden state;
- monotone function;
- lower-bound search;
- exact-preimage construction;
- possible/impossible states;
- verifier;
- answer topology.

Wave 02 keeps them inside one temporary prototype, `NUM-CP011-PROT-008`, with two learner representations. No extra temporary or permanent identity is created for the decimal wording.

### At-least decimal trailing-zero inversion is also not duplicated

The least `n` with at least `z` decimal trailing zeroes is the `p = 5` representation of the single-prime lower-bound inverse implemented by `NUM-CP011-PROT-007`. It remains a representation candidate for later editorial expansion, not a separate solve authority.

## Executable temporary prototypes

### `NUM-CP011-PROT-007` — least `n` meeting a prime-valuation threshold

Question contract:

```text
least n such that v_p(n!) >= t
```

Equivalent learner phrasing:

```text
least n such that p^t divides n!
```

Canonical route:

- Legendre valuation;
- monotone lower-bound binary search.

Verifier:

- linear scan over `n`;
- factor-by-factor prime accumulation in each factorial.

The proof also checks the minimality boundary:

```text
v_p((n-1)!) < t <= v_p(n!)
```

### `NUM-CP011-PROT-008` — exact factorial-valuation preimage

Question contract:

```text
all positive integers n such that v_p(n!) = t
```

Representations in the same authority:

- exact prime valuation;
- exact base-10 trailing zero count through `p = 5`.

Canonical route:

1. find the first `n` with valuation at least `t`;
2. if that valuation has already jumped above `t`, return no solution;
3. otherwise find the first `n` with valuation at least `t + 1`;
4. the exact preimage is the consecutive interval between those boundaries.

Verifier:

- bounded enumeration of factorial valuations from `n = 1` upward.

This authority deliberately generates:

- attainable targets;
- targets skipped by a valuation jump;
- single or multiple consecutive solutions where mathematically possible.

A no-solution state is a valid answer, not a generation failure.

### `NUM-CP011-PROT-009` — inverse trailing zeroes in a general base

Question contract:

```text
least n such that n! has at least z trailing zeroes in base b
```

For

```text
b = p1^a1 p2^a2 ...
```

the monotone state is:

```text
Z_b(n!) = min_i floor(v_pi(n!)/ai)
```

Canonical route:

- factor the base;
- use Legendre valuations;
- binary-search the least `n` whose limiting capacity reaches the target.

Verifier:

- linear scan over `n`;
- independent factor accumulation for every prime in the base.

This remains distinct from the single-prime inverse because multiple prime requirements and a changing limiting prime are part of the inference.

### `NUM-CP011-PROT-010` — least factorial divisible by a declared integer

Question contract:

```text
least n such that M divides n!
```

For

```text
M = p1^a1 p2^a2 ...
```

the canonical route finds the least `n` satisfying each prime-power threshold and takes the largest of those threshold values.

Verifier:

- build `n! mod M` incrementally;
- stop at the first `n` where the residue becomes zero.

This is retained separately from general-base zero inversion because the answer object is divisibility by one declared integer, not a count of repeated base factors.

### `NUM-CP011-PROT-011` — recover an unknown product exponent from a target valuation

Question contract:

```text
v_p(A × B^x) = T
find x
```

Canonical route:

```text
v_p(A) + x v_p(B) = T
```

Verifier:

- enumerate bounded integer `x` values;
- evaluate the valuation independently until the target is matched.

This covers the Wave 00 missing-exponent source gap without converting ordinary exponent algebra into CP011 ownership: the requested semantic is explicitly a prime valuation.

## Proof sweep

The Wave 02 runtime audit generates:

```text
5 temporary prototypes × 120 seeds = 600 packages
```

Every package must prove:

- deterministic replay;
- canonical/verifier agreement;
- exactly four unique options;
- exactly one correct option;
- correct-index binding;
- misconception identity for every option;
- 2–4 explanation steps;
- learner-language hygiene;
- all discovery lifecycle locks;
- no permanent QL allocation.

Per prototype it also requires:

- at least 30 distinct mathematical fingerprints;
- all four answer positions reachable.

For `NUM-CP011-PROT-008` it additionally requires:

- both exact-prime-valuation and exact-decimal-zero representations;
- attainable exact targets;
- impossible exact targets.

## Misconception topology added in Wave 02

The inverse layer adds materially new misconception classes:

- stop one factorial too early;
- overshoot the least valid factorial;
- assume every exact valuation target must occur;
- keep only the first member of a multi-value exact preimage;
- shift an exact preimage interval left or right;
- count whole-base multiples instead of prime capacities;
- ignore the limiting prime requirement of a composite divisor;
- add independent prime thresholds instead of taking the maximum;
- forget the valuation contributed by the multiplier base;
- ignore the valuation already present before the unknown exponent.

## Still open after Wave 02

Wave 02 intentionally does not claim saturation. Remaining discovery includes:

- explicit-product trailing zero counts if source evidence proves a distinct inference shape;
- trailing zeroes of exact factorial ratios;
- statement/claim representations;
- data sufficiency built on proven ordinary authorities;
- edge cases around `0!`, `1!`, valuation zero and answer-semantic wording;
- factorial remainder ownership ablation against CP008;
- factorial divisor-count ownership ablation against CP005;
- last non-zero digit ownership ablation against CP009/CP014;
- binomial-coefficient valuation source disposition;
- final source saturation and merge/split audit.

These belong to Wave 03+ rather than being forced into the inverse layer.

## Lifecycle boundary

Every Wave 02 package remains:

```text
maturity = DISCOVERY_PROTOTYPE
reviewStatus = WAVE02_REVIEW_REQUIRED
active = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

No permanent QL is allocated or reserved. `NUM-QL-213` remains next-free only.
