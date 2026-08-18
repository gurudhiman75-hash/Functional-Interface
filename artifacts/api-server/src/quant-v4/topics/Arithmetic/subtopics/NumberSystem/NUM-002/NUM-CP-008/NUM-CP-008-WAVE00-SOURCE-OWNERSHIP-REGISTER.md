# NUM-CP-008 Wave 00 — Source and Ownership Register

**Checkpoint:** `NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences`  
**Status:** source-backed discovery baseline; source saturation not claimed  
**Permanent QLs:** 0  
**Next available Number System identity:** `NUM-QL-166`

## Governing ownership

CP008 owns genuine modular reasoning where the learner must work with residue classes, modular equations, powers modulo a divisor, or multiple independent congruence constraints.

The current design authority requires:

- least non-negative residue convention;
- modular sum, difference and product;
- exact modular powers;
- linear congruence solvability through `gcd(a,m) | b`;
- compatible and incompatible simultaneous systems;
- bounded/least/greatest/count projections in later discovery;
- direct bounded enumeration as a materially separate verifier route.

## Source-backed handoffs already recorded in the repository

The CP007 source fixture audit explicitly routes the following away from one-stage division and into CP008:

1. a known remainder under one modulus does not determine the remainder under an unrelated modulus;
2. different specified remainders under several moduli form a simultaneous residue system;
3. incompatible simultaneous conditions require a modular-system compatibility decision;
4. non-trivial modular equations and large-power residue work belong outside CP007;
5. ordinary compatible nested-divisor transfer remains CP007 and must not be duplicated here.

The chapter source/legacy audit also recovers the V2 families `ns_modular_arithmetic`, `ns_remainder_after_power`, `ns_modular_cycle`, `ns_remainder_pattern`, `ns_remainder_reconstruction` and related remainder families, with instructions to split ordinary division-lemma work from genuine modular-system work and to add compatibility, one/many/no-solution and bounded CRT gaps.

## Wave 01 temporary prototypes

```text
NUM-CP008-PROT-001 — signed residue normalisation
NUM-CP008-PROT-002 — modular sum / difference / product
NUM-CP008-PROT-003 — power remainder by exact repeated squaring
NUM-CP008-PROT-004 — linear congruence, unique residue class
NUM-CP008-PROT-005 — linear congruence, multiple residue classes
NUM-CP008-PROT-006 — linear congruence, no solution
NUM-CP008-PROT-007 — compatible two-congruence system, least positive solution
NUM-CP008-PROT-008 — incompatible two-congruence system classification
```

These are discovery identities only. They do not imply eight permanent learner QLs.

## Canonical / verifier separation

- power remainder: canonical repeated squaring vs direct modular multiplication verifier;
- unique linear congruence: modular inverse vs complete residue enumeration;
- multiple/no-solution linear congruence: gcd criterion vs complete residue enumeration;
- compatible two-congruence system: generalized CRT construction vs enumeration over one LCM period;
- incompatible system: gcd compatibility theorem vs enumeration over one LCM period.

## Ownership exclusions

Keep outside Wave 01 and outside CP008 where appropriate:

- one-stage dividend/divisor/quotient/remainder reconstruction → CP007;
- compatible nested remainder when the target divisor divides the known divisor → CP007;
- unit digit / last two / last three digits as the final target → CP009;
- common-event / common-multiple alignment → CP006;
- direct algebraic identity with no essential modular target → Algebra or ownership hold;
- formed-number counting → P&C.

## Still open after Wave 01

The following remain required before any source-saturation or permanent-count proposal:

- structured/geometric-sum remainders;
- nested modular expressions;
- least/greatest/count/set bounded representatives;
- missing coefficient/modulus/residue inverse states;
- three-or-more congruence systems;
- same-remainder and specified-different-remainder systems under broader source forms;
- candidate verification, claims, statement combinations and Data Sufficiency;
- repeated numeral / concatenation recurrence;
- explicit advanced-theorem disposition for modular inverse as target, general CRT, Fermat/Euler and Wilson forms;
- final CP007/CP009 overlap and merge/split audit.

## Lifecycle

All Wave 01 content remains:

```text
permanentQlId: null
maturity: EXECUTABLE_DISCOVERY_PROOF
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```
