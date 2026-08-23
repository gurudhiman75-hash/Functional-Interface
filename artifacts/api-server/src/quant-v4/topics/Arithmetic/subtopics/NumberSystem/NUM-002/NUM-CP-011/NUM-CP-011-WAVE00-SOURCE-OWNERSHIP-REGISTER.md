# NUM-CP-011 — Wave 00 Source and Ownership Register

**Checkpoint:** `NUM-CP-011`  
**Package:** `NUM-002`  
**Title:** Factorials, Prime Valuations and Trailing Zeroes  
**Status:** discovery open; permanent QL count not proposed  
**Permanent QL allocation:** none

## Primary invariant

Prime valuations are additive across products and factorial expansions, and trailing-zero / highest-power questions are controlled by the limiting prime valuation after exact factorisation of the requested base or divisor.

A retained CP011 question must require factorial/product valuation structure as a material part of the inference. The mere presence of `n!`, a power or a trailing digit does not by itself make CP011 the owner.

## Source evidence already registered at chapter level

The Number System source and legacy audit records direct source demand for:

- trailing zeroes through prime-pair counting in the uploaded SSC mathematics guide;
- factorial and valuation families recovered from Quant V2;
- general-base trailing zeroes;
- inverse factorial valuation and possible/impossible exact zero counts.

Recovered V2 families provisionally mapped to CP011:

- `ns_trailing_zeroes`
- `ns_highest_power_dividing`
- `ns_factorial_divisibility`
- `ns_factorial_remainder`
- `ns_factorial_factor_count`

Migration aliases to resolve rather than preserve as new identities:

- `ns_trailing_zeros_factorial`
- `ns_highest_power_in_factorial`

Wave 0 treats these as source candidates only. None is a permanent solve authority or QL.

## Required source-gap discovery

The checkpoint must explicitly search for source-backed variants across:

- prime valuation in an explicit product;
- prime valuation in `n!`;
- prime valuation in an exact factorial ratio;
- highest prime power dividing a product or factorial;
- highest composite power dividing a product or factorial;
- direct factorial divisibility;
- least factorial containing a declared factor;
- base-ten trailing zeroes of factorials and explicit products;
- trailing zeroes in a declared non-decimal base;
- trailing zeroes of exact factorial ratios where the ratio is integral;
- inverse `at least z` trailing-zero tasks;
- inverse `exactly z` trailing-zero tasks;
- count/set of bounded `n` values producing an exact zero count;
- possible/impossible exact zero-count states;
- recovery of a missing product exponent from a required valuation or zero count;
- statement/claim and data-sufficiency representations only after ordinary solve authorities are executable.

Advanced candidates requiring explicit source disposition before retention:

- last non-zero digit of a factorial;
- valuation of a binomial coefficient;
- large factorial remainder;
- total divisor count of a factorial.

## Hard ownership boundaries

| Candidate | Owner | CP011 disposition |
|---|---|---|
| Factorial used as arrangement count | P&C | Reassign |
| Generic exponent simplification with no valuation target | Surds & Indices | Reassign |
| Ordinary terminal digit / last two or three digits | CP009 | Reassign |
| Last non-zero factorial digit | CP009 or CP014 candidate | Hold; require ablation showing valuation is materially necessary |
| General remainder of a factorial expression | CP008 candidate | Hold/reassign unless factorial valuation is essential |
| Prime valuation in product/factorial/ratio | CP011 | Retain |
| Highest prime/composite power dividing factorial/product | CP011 | Retain |
| Trailing zero count in base 10 or declared base | CP011 | Retain |
| Inverse exact/at-least trailing-zero search | CP011 | Retain |
| Divisor count where factorial is only the number being factored | CP005 candidate | Hold for ownership ablation |
| Perfect-power completion from exponent residues | CP012 | Reassign |
| Multi-engine task where valuation and another Number System engine are independently necessary | CP014 candidate | Hold for ablation |

## Collision rules

### CP005 — divisor functions

```text
Requested valuation / highest power / divisibility threshold → CP011
Requested ordinary divisor-function output after factorisation → CP005 candidate
Factorial structure itself changes the required valuation engine → hold for ablation before ownership freeze
```

### CP008 — general remainders

```text
Requested remainder/residue and factorial is merely the expression → CP008 candidate
Requested exponent of a prime/composite factor inside factorial/product → CP011
```

### CP009 — terminal digits

```text
Ordinary last digit(s) → CP009
Trailing-zero count → CP011
Last non-zero digit → hold until source-backed ablation determines whether valuation is merely preprocessing or a co-essential engine
```

### P&C

```text
Factorial notation representing permutations/arrangements → P&C
Arithmetic properties of factorial as an integer → CP011 candidate
```

## Unresolved conventions to close during discovery

- `0! = 1` and `1! = 1` must be explicit runtime conventions.
- Mathematical prime valuation `v_p(1) = 0` must not be confused with “no positive power divides”.
- “Highest power of `a` dividing `N`” must specify whether the answer is the exponent `k` or the value `a^k`; CP011 authorities must not mix these answer semantics.
- Composite-power questions require factorisation of the composite base and a minimum valuation-ratio rule.
- For trailing zeroes in base `b`, all prime factors of `b` and their exponents must participate; the base-ten shortcut using only factors of five is not general.
- An exact factorial ratio must be integral whenever the learner-facing task treats it as an integer.
- `exactly z` and `at least z` inverse tasks are different predicates and must not share distractor logic blindly.
- Some exact base-ten trailing-zero counts are impossible; generation must prove possibility rather than assume every target exists.
- Leading zeroes are not relevant to an integer trailing-zero count unless a fixed-width representation is explicitly declared.

## Known source / legacy risks

- Source shortcuts that “count fives” are valid only when factors of two are provably abundant in the exact base-ten state.
- Legacy `ns_factorial_remainder` may be misowned if the requested semantic is a residue rather than a valuation.
- Legacy `ns_factorial_factor_count` may collapse into CP005 after ownership ablation.
- A printed source answer is not authority; every retained fixture requires independent valuation verification.
- Large explicit factorial values must not be constructed merely to count factors; the canonical route should operate on valuations.
- Inverse zero-count questions must search a bounded monotonic domain and preserve no-solution / multi-solution states instead of forcing uniqueness.

## Wave 01 foundation prototype candidates

Wave 01 should implement only the smallest executable foundation needed to prove the valuation engine. Initial candidates are:

1. `NUM-CP011-PROT-001` — prime valuation in an explicit structured product.
2. `NUM-CP011-PROT-002` — direct `v_p(n!)` via repeated floor division.
3. `NUM-CP011-PROT-003` — prime valuation in an exact factorial ratio.
4. `NUM-CP011-PROT-004` — highest prime power dividing a factorial.
5. `NUM-CP011-PROT-005` — highest composite power dividing a factorial by limiting valuation ratio.
6. `NUM-CP011-PROT-006` — base-ten trailing zeroes of a factorial.
7. `NUM-CP011-PROT-007` — trailing zeroes in a declared composite base.

These are temporary discovery identities only. They do **not** imply seven permanent QLs. Direct/inverse expansion, edge states, representations, source saturation and merge/split decisions remain open.

## Wave 02 mandatory expansion targets

After the foundation is proven, Wave 02 must search at minimum:

- least `n` with at least a requested valuation / zero count;
- exact valuation inversion;
- exact trailing-zero inversion;
- count/set of bounded solutions;
- possible/impossible targets;
- missing exponent reconstruction;
- least factorial containing a declared integer factor;
- product and ratio variants not already subsumed by a foundation authority.

## Verification contract

Canonical and verifier routes must differ materially.

Recommended pairings:

```text
Legendre floor-sum valuation
↔ bounded explicit factor accumulation / repeated exact division

Highest composite power from prime valuation ratios
↔ direct bounded divisibility search over successive composite powers

Inverse monotonic search
↔ independent enumeration of candidate n values in the rendered bound
```

Every executable prototype must also prove deterministic replay, exact answer agreement, unique MCQ options, misconception-derived distractors, answer-position reachability, structured explanations, and lifecycle locks.

## Lifecycle

All CP011 discovery outputs remain locked:

- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

No permanent ID is reserved. `NUM-QL-213` remains merely the current chapter next-free identity after CP010 and is **not allocated** by Wave 0.

## Wave 00 exit condition

Wave 0 is ready to close only when:

- source and legacy candidate families are registered;
- CP005/008/009/P&C/Surds & Indices boundaries are explicit;
- unresolved conventions are recorded;
- Wave 01 foundation candidates are temporary and ID-free;
- no lifecycle gate has been opened;
- no permanent QL count has been proposed.
