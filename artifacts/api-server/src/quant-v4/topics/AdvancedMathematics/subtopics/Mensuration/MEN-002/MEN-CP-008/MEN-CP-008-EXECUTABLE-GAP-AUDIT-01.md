# MEN-CP-008 Executable Gap Audit 01

## Status

```text
Package:                    MEN-002
Canonical problem:          MEN-CP-008 — Cylinders & Cones
Clean foundation contracts: 20
Gap Wave 01 contracts:      16
Permanent QLs:               0
Publication:                 disabled
```

This wave extends the clean cylinder-and-cone foundation with missing inverse, comparison, scaling and alternate-evidence contracts. It is executable discovery, not a final QL inventory.

## Added cylinder systems

1. height from total surface area;
2. curved-to-total surface-area ratio;
3. radius from area ratio and height;
4. height from area ratio and radius;
5. volume percentage change under radius/height scaling;
6. roller length from swept area, radius and revolutions;
7. roller radius from swept area, length and revolutions.

## Added cone systems

8. radius from curved surface area and slant height;
9. slant height from curved surface area and radius;
10. slant height from total surface area and radius;
11. radius from total surface area and slant height;
12. volume from radius and slant height;
13. volume from height and slant height;
14. curved-to-total surface-area ratio;
15. cone height under an equal-volume cylinder relation;
16. cone volume percentage change under radius/height scaling.

## Exact reasoning added

The wave proves these reusable identities and inverse systems:

```text
Cylinder TSA:                 2πr(r+h)
Cylinder CSA:TSA:             h:(h+r)
Swept roller area:            2πrLn
Cone CSA:                     πrl
Cone TSA:                     πr(r+l)
Cone CSA:TSA:                 l:(l+r)
Cone axial relation:          l²=r²+h²
Equal cylinder/cone volume:   πR²H=(1/3)πr²h
Cylinder/cone scaling:        volume proportional to r²h
```

All π cancellation, exact `22/7` roller arithmetic, rational ratios, exact percentage multipliers and π-volume outputs remain structural exact values.

## Provisional compression hypotheses

- cylinder and cone percentage-change tasks may merge as shape representations because both use the same $r^2h$ transformation;
- cone volume from radius-plus-slant and height-plus-slant may merge as evidence representations after the missing axial dimension is recovered;
- CSA:TSA ratio may remain within each shape's surface system rather than creating independent formula-only QLs;
- roller direct and inverse tasks may remain distinct when the requested answer semantic changes between revolutions, length and radius;
- surface inverse outputs remain separate where radius, height and slant height require materially different equations or misconception structures.

No merge is frozen by this wave.

## Ownership exclusions

The following remain outside MEN-CP-008:

- open-ended cylinders, pipes, shells, thickness and excluded surfaces → MEN-CP-011;
- melting or recasting cylinders/cones → MEN-CP-012;
- joined, drilled, inscribed or displacement solids → MEN-CP-013;
- frustums → MEN-CP-010;
- tasks whose decisive evidence is trigonometric rather than mensuration → Trigonometry.

## Required proof

Every Wave-01 prototype must pass:

- deterministic valid-state generation;
- exact canonical solution;
- materially separate independent verification;
- four unique positive misconception-derived option values and displays;
- all four answer positions;
- at least four distinct stems and exact answers;
- at least two state-derived difficulty bands;
- exact π-policy and ratio rendering;
- four-tier English explanations and option-specific traps;
- strict MathJax and Indian editorial checks;
- lifecycle and publication locks;
- deterministic 48-question review export;
- clean-foundation and MEN-CP-007 regressions;
- exact Render production build.

## Next audit

After Wave 01 is green, continue source and representation review for:

- diameter-based and circumference-evidence inverses;
- cylinder/cone equal-area and equal-volume comparisons;
- rate/cost inverses where answer semantics differ;
- multi-object count/revolution applications;
- declared-decimal and mixed-unit representations;
- any source-proven missing tasks not reducible to the current 36 executable contracts.

Permanent allocation remains prohibited until source retrieval, gap saturation and duplicate-reasoning compression close.
