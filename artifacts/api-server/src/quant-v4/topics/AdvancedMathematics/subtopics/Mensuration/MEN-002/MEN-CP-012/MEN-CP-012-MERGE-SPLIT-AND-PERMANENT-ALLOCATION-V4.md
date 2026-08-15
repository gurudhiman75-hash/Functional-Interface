# MEN-CP-012 — Merge/Split Authority & Permanent Allocation V4

Authority: `MEN-CP012-MERGE-SPLIT-V4-V1`

## Decision

Discovery is closed after Waves 01–03.

The 42 executable/source-backed forms are consolidated into **13 permanent reasoning identities**, allocated as:

```text
MEN-002-QL-150 .. MEN-002-QL-162
```

This allocation freezes **reasoning identity and solve-mode ownership only**.

It does **not** freeze the permanent English runtime and does not activate Question Studio, Question Bank, scored tests or publication.

## Why 42 forms do not become 42 QLs

Shape changes, diameter/radius wording, unit conversions, source/target direction, rounding requests and PYQ contexts are often representations of the same conservation solve.

Permanent QLs are split only when the decisive inference changes enough to require a different solve strategy or misconception model.

## Permanent families

| QL | Canonical family | Reasoning identity |
|---|---|---|
| `MEN-002-QL-150` | `RECAST_COUNT_DIRECT` | total material volume ÷ one-unit volume |
| `MEN-002-QL-151` | `RECAST_LINEAR_DIMENSION_DIRECT` | unknown target height/length occurs to first power |
| `MEN-002-QL-152` | `RECAST_SQUARE_ROOT_DIMENSION_INVERSE` | isolate squared dimension, then positive square root |
| `MEN-002-QL-153` | `RECAST_CUBE_ROOT_DIMENSION_INVERSE` | isolate cubed dimension, then positive cube root |
| `MEN-002-QL-154` | `DRAWING_ROLLING_LENGTH_DIRECT` | cross-section × length conservation, final length unknown |
| `MEN-002-QL-155` | `DRAWING_ROLLING_CROSS_SECTION_INVERSE` | cross-sectional radius/thickness unknown |
| `MEN-002-QL-156` | `COMBINED_SOURCE_RECAST` | sum multiple source volumes before target recovery |
| `MEN-002-QL-157` | `LOSS_AWARE_RECAST_GIVEN` | retained fraction is given and modifies source material |
| `MEN-002-QL-158` | `LOSS_YIELD_PERCENT_UNKNOWN` | infer yield/loss percentage from actual output |
| `MEN-002-QL-159` | `HOLLOW_SOURCE_MATERIAL_RECAST` | outer-minus-inner source material, then recast |
| `MEN-002-QL-160` | `HOLLOW_TARGET_LENGTH_DIRECT` | hollow target length from shell-material volume |
| `MEN-002-QL-161` | `HOLLOW_TARGET_THICKNESS_INVERSE` | recover inner radius, then wall thickness |
| `MEN-002-QL-162` | `RECAST_THEN_SECONDARY_MEASURE` | conserve volume first, then compute a secondary measure |

## Important merge decisions

### Direct count is one family

The following remain representations inside QL-150 rather than separate QLs:

- sphere → many spheres;
- cylinder → spheres;
- cube → cubes;
- source sphere count → cylinder;
- symbolic N-spheres → cylinder;
- metre/cm/mm cube recasting;
- coin → cuboid with diameter/thickness;
- coin → cuboid with circumference/thickness.

The decisive operation is still a material-volume quotient. Unit/circumference preprocessing does not create a new permanent identity.

### Root type is a real split

Dimension-recovery questions are split by the mathematical structure of the unknown:

```text
first power   -> QL-151
square root   -> QL-152
cube root     -> QL-153
```

This keeps distractors and teaching aligned with the actual solve burden rather than the source/target shape names.

### Drawing/rolling gets direct and inverse families

Wire/rod/plate questions share the `cross-section × length` conservation idea, but direct final-length questions and inverse cross-sectional-dimension questions are kept separate because their rearrangement and error patterns differ materially.

### Combined sources are one family

Two spheres, many cones, mixed cylinder+cone and unequal spheres all require the same decisive pre-step:

```text
add all usable source volumes first
```

Target shape/root type becomes a representation inside that family.

### Loss given vs loss unknown

These are separated:

- QL-157: loss/retained percentage is an input modifier;
- QL-158: loss/yield percentage itself is the unknown.

### Hollow CP-011 / CP-012 boundary

The ownership rule is now explicit:

```text
If hollow geometry/material is the final task with no transformation -> CP-011.
If melting/recasting material from or into the hollow solid is the decisive task -> CP-012.
```

That keeps hollow-cylinder/sphere recasting in CP-012 while preventing ordinary shell geometry from leaking out of CP-011.

Hollow target length and thickness remain separate because:

```text
length:     direct first-power shell-volume solve
thickness:  recover inner radius by square root, then R-r
```

### Recast then secondary measure is distinct

Surface area is **not** conserved during recasting. A question that first determines the new solid by volume and then asks surface-area change requires a second inference, so it receives QL-162 rather than being merged into ordinary recasting.

## Semantic correction discovered during Wave 04

Wave 03's safe presentation for `V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO` remained mathematically valid but accidentally changed the source-backed reasoning burden by giving cone radius and recovering height.

The source-backed form should instead:

1. give sphere radius and cone height;
2. use volume conservation to recover cone radius through a **square root**;
3. convert radius to diameter;
4. form diameter : height.

`MEN-CP012-SOURCE-CORRECTIONS-V4-V1` supersedes that one Wave-03 presentation for permanent identity purposes. The source is therefore assigned to QL-152, not QL-151.

## Coverage closure

All discovery evidence must map exactly once:

```text
Wave 01 prototypes:       16
Wave 02 candidates:       14
Wave 03 source forms:     12
--------------------------------
Total source forms:       42
Mapped exactly once:      42
Permanent QLs:            13
```

No source form may be missing, double-mapped or assigned merely because of shape naming.

## Lifecycle after allocation

Required state:

```text
permanentIdentityFrozen:      true
solveModeFrozen:              true
englishImplementationFrozen:  false
active:                       false
questionStudioDiscoverable:   false
questionBankStatus:           NOT_STORED
testEligibility:              INELIGIBLE
publiclyPublishable:           false
```

## Next gate

Build a permanent English runtime for all 13 QLs using the merged source pools, with the V4 cone-ratio correction as the authoritative source for that representation.

The runtime must then undergo a question-level exam-realism audit before English freeze or Question Studio activation.
