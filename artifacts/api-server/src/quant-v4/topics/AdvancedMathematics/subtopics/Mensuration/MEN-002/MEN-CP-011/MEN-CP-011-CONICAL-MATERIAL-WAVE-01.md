# MEN-CP-011 — Conical Material Volume Wave 01

## Authority

```text
MEN-CP011-CONICAL-MATERIAL-WAVE-01-V1
```

## Purpose

This wave implements the first two executable conical-shell families authorised by the conical ownership audit:

```text
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER
MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL
```

The wave is discovery-only. It does not allocate permanent QLs or enable Question Studio, Question Bank, tests or public delivery.

## Governing formula

For an outer cone of radius `R` and height `H`, with an explicitly defined inner conical void of radius `r` and height `h`:

```text
Vouter = (1/3)πR²H
Vinner = (1/3)πr²h
Vmaterial = (1/3)π(R²H − r²h)
```

The solver never infers `r = R − t` or `h = H − t` from one thickness value.

## Family 1 — Explicit inner cone

The canonical state supplies:

```text
outer radius R
outer height H
inner radius r
inner height h
shared base plane
common axis
inner cavity topology
```

Required physical checks:

```text
R > 0, H > 0
r > 0, h > 0
r < R
h ≤ H
R²H − r²h > 0
```

The learner transformation is outer cone volume minus inner cone volume.

## Family 2 — Declared similar-wall cone

The state supplies the outer dimensions and a declared inner-to-outer linear scale:

```text
k = p/q, where 0 < p < q
r = kR
h = kH
```

The generator verifies both relations exactly:

```text
rq = Rp
hq = Hp
```

The learner may solve by ordinary subtraction or use the similar-solids shortcut:

```text
Vinner = k³Vouter
Vmaterial = Vouter(1 − k³)
```

The similarity relationship appears explicitly in the stem, state, diagram and explanation. It is never silently assumed.

## Pi policies

The wave proves:

```text
EXACT_PI
PI_22_OVER_7
PI_3_14
```

Declared `π = 3.14` is represented exactly as `157/50`. No floating-point equality is used.

## Coverage matrix

```text
Runtime prototypes:                  2
Fixtures per prototype:              8
Deterministic packages per family: 192
Total deterministic packages:      384
Balanced review records:            48
Records per family:                 24
Linear units:                       cm, m
Pi policies:                         3
Records per family/unit/pi cell:     4
Correct positions:              A12 B12 C12 D12
Distinct review states:             48
```

## Option model

Each question contains the exact answer and three calculation-derived distractors:

```text
USED_OUTER_SOLID_VOLUME_ONLY
CALCULATED_INNER_VOID_ONLY
ADDED_INNER_AND_OUTER_VOLUMES
```

Random numerical offsets are forbidden.

Every displayed wrong option receives a natural explanation describing the corresponding mathematical error.

## Explanation model

Each learner solution includes:

1. a physical outer-minus-inner visual anchor;
2. explicit recovery of inner dimensions when similarity is declared;
3. unit-preserving construction of `R²H − r²h`;
4. exact application of the declared π policy;
5. an exam-speed shortcut;
6. analysis of all three displayed wrong options.

For the similar-wall family, the independent verifier uses `Vouter(1-k³)`. For the explicit-inner family, the verifier reconstructs the outer and inner coefficients directly.

## Diagram contract

The responsive original SVG contains:

```text
data-diagram-version="CONICAL_SHELL_EXAMTREE_V1"
data-topology="HOLLOW_SHARED_BASE_CAVITY"
data-relation=<canonical relation>
data-diagram-role="PROMPT" or "SOLUTION"
```

The diagram shows:

- a solid outer conical boundary;
- a dashed inner conical void;
- outer and inner radii from the common base centre;
- outer and inner axial heights;
- explicit relation text;
- separate prompt and solution labels;
- a not-to-scale notice.

The attempt surface remains text-complete and diagram-free. No fixed SVG width is allowed, and responsive `min-width: 0` remains mandatory.

## Validation surface

```text
conical-material.ts
conical-material.test.ts
conical-material-review-export.ts
chapter-wide-current-audit-v6.ts
men-002-cp011-conical-material.yml
```

The complete `foundation.test.ts` also imports the 384-package conical proof, preventing isolated-only validation.

## Chapter-wide effect

The live V6 audit expects:

```text
Direct runtime families:              26
Current review records:               408
Unique exact stems:                   408
Technically clean learner records:    408
Correct positions:                    A102 B102 C102 D102
Initial architecture candidates:      20 / 20 complete
```

Conical material volume becomes covered for explicit-inner and declared-similar relations. Conical curved-area and lining-cost families remain pending.

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
