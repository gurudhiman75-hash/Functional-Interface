# NUM-CP-011 — Wave 00 Source & Ownership Register

**Checkpoint:** `NUM-CP-011` — Factorials, Prime Valuations and Trailing Zeroes  
**Status:** discovery authority; permanent QLs allocated: **0**

## Primary ownership

CP011 owns questions whose governing invariant is additive prime valuation in factorial/product structure or the limiting prime-factor balance that creates powers/trailing zeroes.

Retained source families:

- prime valuation `v_p(n!)`;
- valuation of bounded factorial ratios/products;
- highest power of a prime dividing a factorial;
- highest power of a composite integer dividing a factorial;
- decimal trailing zeroes of a factorial;
- trailing zeroes in a general integer base;
- inverse least-`n` valuation/zero targets;
- factorial divisibility and valuation-based feasibility, pending later discovery;
- exact/set/count inverse valuation forms, pending later discovery.

## Legacy V2 dispositions

| Legacy family | CP011 disposition |
|---|---|
| `ns_trailing_zeroes` | RETAIN |
| `ns_highest_power_dividing` | RETAIN |
| `ns_factorial_divisibility` | RETAIN after dedicated discovery |
| `ns_factorial_remainder` | REASSIGN CP008 when remainder is primary; HOLD only valuation-led special cases |
| `ns_factorial_factor_count` | REASSIGN CP005 when divisor count is primary; CP014 only if two engines are independently essential |
| `ns_trailing_zeros_factorial` | ALIAS only |
| `ns_highest_power_in_factorial` | ALIAS only |

## Cross-checkpoint boundaries

- **CP005 Divisor Functions:** owns number-of-divisors / sum/product-of-divisors outputs, even when the input happens to be `n!`, unless valuation itself is the requested inference.
- **CP008 Modular Arithmetic:** owns factorial remainder questions when modular/remainder reasoning is primary.
- **CP009 Terminal Digits:** owns terminal digits; large factorial last-non-zero-digit remains a hold until a distinct source-backed contract is proven.
- **CP012 Perfect Powers:** owns perfect-square/cube/general-power completion of ordinary integers. CP011 owns factorial valuation/power divisibility.
- **P&C:** owns factorial as a counting operation when arrangements/combinations are the tested inference.
- **Surds & Indices:** owns generic exponent manipulation without factorial valuation structure.
- **CP014 Synthesis:** reserved for genuinely necessary multi-engine combinations after component authority proof.

## Canonical solver / independent verifier policy

Canonical route:
- Legendre-style sum `floor(n/p) + floor(n/p^2) + ...`;
- prime-factor balance for composite bases;
- monotone inverse search for least-`n` tasks.

Independent verifier:
- explicitly factor every integer from `2` through `n` and accumulate prime multiplicities;
- for factorial ratios, subtract explicit accumulations;
- for inverse tasks, brute-search using the explicit accumulation verifier.

The independent verifier must not call the canonical valuation function.

## Lifecycle

All discovery packages remain:
- `active: false`
- `questionStudioDiscoverable: false`
- `questionBankWritable: false`
- `testEligible: false`
- `publiclyPublishable: false`

`NUM-QL-213` is the chapter-wide next free coordinate after CP010, but it is **not reserved or allocated** by CP011 discovery.
