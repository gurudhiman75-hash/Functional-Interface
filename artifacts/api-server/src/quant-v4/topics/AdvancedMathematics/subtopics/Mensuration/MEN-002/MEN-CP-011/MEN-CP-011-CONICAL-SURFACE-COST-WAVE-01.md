# MEN-CP-011 — Conical Surface and Lining Cost Wave 01

## Authority

```text
MEN-CP011-CONICAL-SURFACE-COST-WAVE-01-V1
```

## Purpose

This wave implements the remaining two executable conical-shell families authorised by the conical ownership audit:

```text
MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES
MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL
```

The wave is discovery-only. It does not allocate permanent QLs or enable Question Studio, Question Bank, tests or public delivery.

## Family 1 — Both curved surfaces

For an outer conical wall with radius `R` and slant height `L`, and an inner conical wall with radius `r` and slant height `l`:

```text
Aouter = πRL
Ainner = πrl
Aboth = πRL + πrl = π(RL + rl)
```

The inner wall is added, not subtracted, because both curved surfaces are exposed or coated. Circular rims and bases are excluded unless a future family explicitly includes them.

The canonical state supplies and verifies both Pythagorean triples:

```text
L² = R² + H²
l² = r² + h²
```

## Family 2 — Inner lining cost from a shell relation

A direct inner-cone lining problem remains MEN-CP-008 when the inner cone alone is supplied. This CP-011 family requires an explicit inner–outer shell relationship.

The outer radius and slant height are supplied, and the inner wall is declared similar at exact scale:

```text
k = p/q
r = kR
l = kL
```

The generator verifies radius, height and slant-height similarity before calculating:

```text
Ainner = πrl
Cost = πrl × rate per m²
```

An independent verifier uses the similar-area relation:

```text
Ainner = k²Aouter
```

## Pi and currency policies

The curved-area family proves:

```text
EXACT_PI
PI_22_OVER_7
PI_3_14
```

The lining-cost family uses numeric policies only:

```text
PI_22_OVER_7
PI_3_14
```

Declared `π = 3.14` is represented exactly as `157/50`. Rates are selected by construction so every correct cost is an exact whole-rupee value.

## Coverage matrix

```text
Runtime prototypes:                  2
Fixtures per prototype:              8
Deterministic packages per family: 128
Total deterministic packages:      256
Balanced review records:            40
Curved-area records:                 24
Inner-lining-cost records:           16
Correct positions:              A10 B10 C10 D10
Linear-unit counts:             cm12 m28
Pi-policy counts:          exact8, 22/7=16, 3.14=16
Distinct review states:              40
```

## Option model

### Both curved surfaces

```text
USED_OUTER_CURVED_SURFACE_ONLY
USED_INNER_CURVED_SURFACE_ONLY
SUBTRACTED_INNER_CURVED_SURFACE
```

### Inner lining cost

```text
USED_OUTER_SURFACE_FOR_INNER_LINING
CHARGED_BOTH_CURVED_SURFACES
OMITTED_LINING_RATE
```

Every distractor is generated from a recognised calculation error. Random numerical offsets are forbidden.

## Explanation model

Each learner solution includes:

- the included-surface ledger;
- explicit use or recovery of radius and slant height;
- exact application of the declared π policy;
- area-unit or ₹/m² rate cancellation;
- an exam-speed factorisation or similarity shortcut;
- analysis of all three displayed wrong options.

## Diagram contract

The responsive original SVG contains:

```text
data-diagram-version="CONICAL_SURFACE_COST_EXAMTREE_V1"
data-target="AREA" or "COST"
data-relation=<canonical relation>
data-diagram-role="PROMPT" or "SOLUTION"
```

The diagram distinguishes:

- the solid outer curved boundary;
- the dashed inner curved boundary;
- outer and inner radius guides;
- outer and inner slant-height guides;
- the included coating or lining surface;
- the declared similarity and rate where applicable.

The attempt surface remains text-complete and diagram-free. No fixed SVG width is allowed, and responsive `min-width: 0` remains mandatory.

## Validation surface

```text
conical-surface-cost.ts
conical-surface-cost.test.ts
conical-surface-cost-review-export.ts
chapter-wide-current-audit-v7.ts
men-002-cp011-conical-surface-cost.yml
```

The complete `foundation.test.ts` also imports the 256-package proof, preventing isolated-only validation.

## Chapter-wide effect

The live V7 audit expects:

```text
Direct runtime families:              28
Current review records:               448
Unique exact stems:                   448
Technically clean learner records:    448
Correct positions:                    A112 B112 C112 D112
Initial architecture candidates:      20 / 20 complete
Conical executable discovery:         complete
```

The chapter remains unfrozen because direct source normalisation, human English review, permanent-family compression and multilingual parity are still pending.

## Lifecycle locks

```text
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               NOT_STORED
Test eligibility:            INELIGIBLE
Public publication:          false
Direct source normalisation: pending
Manual English review:       pending
```
