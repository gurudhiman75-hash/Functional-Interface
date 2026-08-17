# MEN-CP-012 — Recasting, Melting & Volume Conservation — Discovery Wave 02

Authority: `MEN-CP012-DISCOVERY-WAVE-02-V1`

## Decision boundary

Wave 01 proved the basic conservation engine. Wave 02 challenges that inventory with reverse, inverse, loss/yield, unit and mixed-source questions.

This wave is **not** permanent allocation. No candidate count may be interpreted as a QL count.

## Added executable coverage

14 candidates are added:

1. target sphere radius from source radius + count;
2. source sphere radius from target radius + count;
3. cylinder radius from a known number of source spheres;
4. source-sphere count required to make a cylinder;
5. small-cube side from source cube + count;
6. source-cube side from small cube + count;
7. wire radius from source rod and final wire length;
8. diameter-based wire phrasing;
9. plate thickness inverse after rolling;
10. loss percentage from actual output count;
11. source-sphere count required when wastage is present;
12. yield percentage from actual output;
13. metre-to-millimetre cube recasting;
14. cylinder + cone combined source to one cylinder.

## First merge/split hypotheses

Wave 02 deliberately marks likely representations before permanent allocation.

### Likely representation merges

- source-sphere count to cylinder ↔ cylinder-to-sphere count: same volume-ratio count identity;
- diameter wire wording ↔ radius wire wording: presentation/representation only;
- metre-to-mm cube count ↔ metre-to-cm cube count: unit representation, not a new conservation identity.

### Likely directional-inverse merges

- smaller-sphere radius from count and larger-sphere radius from count;
- smaller-cube side from count and larger/source-cube side from count;
- yield percentage and loss percentage are complementary efficiency representations unless source evidence proves a meaningful separate solve identity.

### Retain candidates pending saturation

- cylinder radius from sphere-count conservation: square-root target dimension recovery;
- wire radius from final length: inverse cross-sectional dimension recovery;
- plate thickness inverse;
- loss percentage as the unknown;
- source count with explicit wastage;
- mixed cylinder + cone source material.

These are not yet guaranteed permanent identities. Wave 03 must test whether their solve paths merge with broader inverse-dimension, loss/yield or combined-source families.

## Ownership audit

- CP-012 owns these questions when **material conservation** is decisive.
- Hollow geometry without recasting remains CP-011.
- Displacement, immersion, overflow and liquid-level change remain CP-013.
- Direct formula questions for a single shape remain with its base-shape CP.
- Unit conversion is part of CP-012 only when embedded in a recasting/material-conservation task.

## Proof target

```text
14 candidates × 64 deterministic seeds = 896 proof packages
14 candidates × 4 answer positions = 56 review records
```

Wave 02 gates:

- exact construction verification;
- deterministic replay;
- four unique options;
- exactly one correct option;
- A/B/C/D reachability for every candidate;
- 14/14/14/14 review balance;
- 56 distinct review stems;
- explicit provisional disposition for every candidate;
- permanent QL count remains zero;
- Question Studio and public publication remain disabled;
- Wave 01 proof remains green;
- production API build remains green.

## What Wave 03 must still answer

Before permanent allocation, source saturation should probe:

- reverse target count versus source count;
- multiple unequal source solids;
- multiple target shapes or target count + dimension inverses;
- diameter/radius and radius/diameter mixed wording;
- mm/cm/m cubic conversions and litre/cubic-centimetre cases only where physically legitimate;
- wastage, retained percentage and yield as input or unknown;
- repeated melting/recasting stages;
- hollow-source material with thickness-derived dimensions;
- whether wire and plate transformations are one general `area × length` / `area × thickness` family or need separate identities;
- whether all cross-shape inverse dimension problems can share a general conservation-inverse identity or require root-type splits;
- SSC/source-backed exam patterns and arithmetic realism;
- merge/split/reassign audit against CP-011 and CP-013.
