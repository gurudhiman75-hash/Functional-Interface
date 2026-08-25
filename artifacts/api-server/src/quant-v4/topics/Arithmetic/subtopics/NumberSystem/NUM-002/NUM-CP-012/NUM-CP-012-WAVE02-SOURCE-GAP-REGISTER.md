# NUM-CP-012 — Wave 02 Edge, Boundary and Inverse Gap Register

**Checkpoint:** `NUM-CP-012`  
**Package:** `NUM-002`  
**Status:** discovery only; stacked after Wave 01  
**Permanent QL allocation:** none  
**Current next-free Number System identity:** `NUM-QL-226` (not reserved)

## Purpose

Wave 01 proves the core perfect-power engines: recognition, exact positive roots, multiplier/divisor completion, missing exponent, greatest square/cube divisor, bounded square/cube count and directional additive completion. Wave 02 must not duplicate those solved states. It exists to close the design gaps that remain materially different because of domain, answer semantic, boundary projection or inverse-solution topology.

## Confirmed Wave 01 coverage

Wave 02 treats the following as already represented and therefore not new authorities by default:

- positive perfect square/cube/general-`k` recognition;
- exact positive integer root;
- least multiplier to complete a perfect `k`th power;
- least divisor to reduce to a perfect `k`th power;
- one uniquely bounded missing exponent;
- greatest perfect square/cube divisor;
- count of squares/cubes in a closed interval;
- least non-negative addition/subtraction to the adjacent square/cube boundary;
- already-complete multiplier `1`, divisor `1`, additive completion `0` states;
- general fourth-power reach in recognition/root/completion.

## Remaining mandatory gaps

### 1. Signed, zero and one domain

The checkpoint design explicitly requires:

- `0` and `1` under the declared perfect-power convention;
- negative odd powers accepted over the integers;
- negative even powers rejected over the integers;
- exact signed odd root;
- explicit no-integer-root outcome for negative even-power targets.

These states cannot be represented by merely changing the positive root value because the answer domain changes from an integer root to a non-existence classification.

### 2. Bound projection semantics

Wave 01 counts powers inside a range and moves from a declared integer to an adjacent boundary. It does not yet directly ask for:

- greatest perfect square/cube/general supported power not exceeding a bound;
- least perfect square/cube/general supported power not smaller than a bound;
- the perfect-power value itself rather than the adjustment amount.

This is a distinct answer semantic even when the same integer-root boundary engine is reusable.

### 3. Nearest perfect power

The design calls for nearest square/cube states. Discovery must explicitly prove the tie situation rather than invent one.

For consecutive non-negative integer `k`th powers `n^k` and `(n+1)^k`, one endpoint is even and the other odd, so their difference is odd. Their midpoint is therefore a half-integer. An integer query value cannot be exactly equidistant from the two consecutive integer powers.

**Wave 02 finding:** under ordinary integer-domain nearest-square/cube/general-`k` questions, the equal-distance tie is unreachable. The runtime should still use a deterministic comparison, but no artificial tie-answer family should be created unless a later source changes the domain.

### 4. Perfect-power multiple value versus multiplier

Wave 01 returns the least multiplier. Source demand also names the least perfect-power multiple. Discovery must test whether:

```text
same completion state + answer = multiplier
versus
same completion state + answer = completed multiple
```

is only an answer-projection representation or deserves a permanent split. Wave 02 should implement the value projection temporarily and defer the merge/split decision.

### 5. Terminal compatibility as rejection evidence

CP012 may use terminal digits only as a necessary quick rejection test for perfect-power possibility. It must not absorb CP009 terminal-digit ownership.

Allowed Wave 02 form:

```text
which terminal digit is impossible for a perfect square/cube?
```

because the requested semantic is perfect-power compatibility.

Not CP012:

```text
what is the unit/last-two/last-three digit of an expression?
```

which remains CP009.

Terminal compatibility must never be presented as sufficient proof that a concrete integer is a perfect power.

### 6. Inverse one/many/no-solution topology

Wave 01 proves one uniquely bounded missing exponent. Wave 02 must reach all three bounded solution classes for the same perfect-power invariant:

- no valid exponent in the declared interval;
- exactly one valid exponent;
- multiple valid exponents.

The learner answer is the solution class, not one arbitrary exponent.

## Wave 02 temporary prototypes

The following IDs remain discovery-only and must never be treated as permanent QLs.

1. `NUM-CP012-PROT-009` — signed/zero/one exact root with explicit `NO_INTEGER_ROOT` state.
2. `NUM-CP012-PROT-010` — least/greatest perfect-power value under a declared bound.
3. `NUM-CP012-PROT-011` — nearest square/cube/general supported perfect-power value; audit proves no integer tie.
4. `NUM-CP012-PROT-012` — least perfect-power multiple value as a projection of multiplier completion.
5. `NUM-CP012-PROT-013` — terminal-digit compatibility rejection for square/cube possibility only.
6. `NUM-CP012-PROT-014` — bounded missing-exponent `NONE / ONE / MULTIPLE` solution classification.

## Canonical versus verifier requirements

Each temporary prototype needs materially different verification:

```text
signed root/domain rule
↔ direct integer-power enumeration including negative candidates

bound projection by integer root
↔ bounded monotonic search from the rendered bound

nearest power by adjacent-root comparison
↔ bounded enumeration of candidate perfect powers around the rendered integer

least perfect-power multiple via exponent completion
↔ enumerate integer multiples until the first exact kth power

terminal compatibility table
↔ enumerate many exact square/cube residues modulo 10 and compare reachable residue set

bounded exponent class via modular exponent rule
↔ enumerate every exponent in the rendered interval and directly test exact kth-power construction
```

## Required edge reach

Wave 02 tests must prove deterministic reach of:

- `0` as a perfect `k`th power;
- `1` as a perfect `k`th power;
- a negative odd perfect power with negative exact root;
- a negative even-power target with `NO_INTEGER_ROOT`;
- both least-at-least and greatest-at-most bound directions;
- nearest lower and nearest upper outcomes;
- no nearest integer tie across the sampled state space plus a theorem assertion for consecutive integer powers;
- least-perfect-power-multiple already-complete state where the returned multiple equals the original number;
- square and cube terminal compatibility;
- all inverse solution classes: `NO_SOLUTION`, `ONE_SOLUTION`, `MULTIPLE_SOLUTIONS`.

## Ownership guards

- no square/cube divisor-count question: CP005;
- no symbolic radical simplification: Surds & Indices;
- no polynomial square/cube identity: Algebra;
- no geometric area/volume interpretation: Mensuration;
- no requested remainder: CP008;
- no requested terminal digit of an expression: CP009;
- no essential independent second engine without CP014 ablation.

## Lifecycle

All Wave 02 outputs remain locked:

- `maturity = DISCOVERY_PROTOTYPE`
- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

No permanent ID is allocated or reserved. `NUM-QL-226` remains only the current next-free identity until CP012 source saturation and merge/split approval determine the permanent authority count.

## Wave 02 exit condition

Wave 02 can close only when:

- signed/zero/one semantics are executable;
- bound and nearest value projections are executable;
- nearest-power tie impossibility is formally captured for integer-domain generation;
- least-perfect-power-multiple projection is available for ablation against Wave 01 multiplier completion;
- terminal compatibility is demonstrated without CP009 leakage;
- bounded exponent inverse reaches none/one/multiple classes;
- every prototype has independent verification, option integrity, state diversity and lifecycle locks;
- no permanent allocation or downstream publication gate opens.
